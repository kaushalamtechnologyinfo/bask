<?php
// GoDaddy cPanel PHP Backend for /api/booking-enquiry
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$storeFile = $dataDir . '/cms-store.json';

$rawBody = file_get_contents('php://input');
$data = @json_decode($rawBody, true);
if (!is_array($data)) $data = [];

$customerName = $data['customerName'] ?? $data['Customer Name'] ?? $data['name'] ?? 'Valued Guest';
$email = $data['email'] ?? $data['Email Address'] ?? 'Not provided';
$phone = $data['phone'] ?? $data['Phone Number'] ?? 'Not provided';
$rawGuests = $data['guests'] ?? $data['Number of Guests'] ?? '20';
$cleanCount = preg_replace('/[^0-9]/', '', (string)$rawGuests);
$numberOfGuests = ($cleanCount !== '' ? $cleanCount : '20') . ' People';

$bookingDate = $data['bookingDate'] ?? $data['Booking Date'] ?? 'Not specified';
$bookingTime = $data['bookingTime'] ?? $data['Booking Time'] ?? 'Dinner (from 5:00 PM)';
$eventType = $data['eventType'] ?? $data['Event Type'] ?? 'Group Dining Celebration';
$seatingArea = $data['seatingArea'] ?? $data['Seating Preference'] ?? 'Alfresco Ocean Terrace';
$menuPreference = $data['menuPreference'] ?? $data['Menu Package'] ?? 'Set Menu 2026 (Shared Feast)';
$additionalDetails = $data['additionalDetails'] ?? $data['Additional Booking Details'] ?? $data['message'] ?? 'None';
$orderId = $data['orderId'] ?? ('BASKK-ORD-' . mt_rand(100000, 999999));
$orderType = $data['orderType'] ?? 'Function / Booking Enquiry';
$createdAt = date('j M Y');

$orderEntry = [
    'orderId' => $orderId,
    'createdAt' => $createdAt,
    'orderType' => $orderType,
    'status' => 'New',
    'customerName' => $customerName,
    'email' => $email,
    'phone' => $phone,
    'guests' => $numberOfGuests,
    'bookingDate' => $bookingDate,
    'bookingTime' => $bookingTime,
    'eventType' => $eventType,
    'seatingArea' => $seatingArea,
    'menuPreference' => $menuPreference,
    'additionalDetails' => $additionalDetails,
    'adminNotes' => ''
];

// 1. Save to server CMS store
$store = ['vouchers' => [], 'orders' => [], 'gallery' => [], 'hiddenDefaultImages' => [], 'settings' => ['sheetUrl' => '']];
if (file_exists($storeFile)) {
    $parsed = @json_decode(@file_get_contents($storeFile), true);
    if (is_array($parsed)) $store = array_merge($store, $parsed);
}
array_unshift($store['orders'], $orderEntry);
@file_put_contents($storeFile, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// 2. Push to Google Sheets if configured
$sheetUrl = trim((string)($data['sheetsWebhookUrl'] ?? ($store['settings']['sheetUrl'] ?? '')));
if ($sheetUrl !== '' && strpos($sheetUrl, 'https://script.google.com') === 0) {
    $ch = @curl_init($sheetUrl);
    if ($ch) {
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array_merge(['action' => 'append_order'], $orderEntry)));
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        @curl_exec($ch);
        @curl_close($ch);
    }
}

// 3. Send notification email via GoDaddy PHP mail()
$to = 'request@baskk.co';
$subject = "New Function Booking Enquiry ($numberOfGuests) - $customerName";
$bodyText = "NEW BOOKING ENQUIRY RECEIVED\n\n"
    . "Order ID: $orderId\n"
    . "Number of Guests: $numberOfGuests\n"
    . "Booking Date: $bookingDate\n"
    . "Booking Time: $bookingTime\n"
    . "Customer Name: $customerName\n"
    . "Email Address: $email\n"
    . "Phone Number: $phone\n"
    . "Event Type: $eventType\n"
    . "Seating Preference: $seatingArea\n"
    . "Menu Package: $menuPreference\n"
    . "Additional Details: $additionalDetails\n";
$headers = "From: Baskk Website <noreply@baskk.co>\r\n";
if (strpos($email, '@') !== false) {
    $headers .= "Reply-To: $email\r\n";
}
@mail($to, $subject, $bodyText, $headers);

echo json_encode([
    'success' => true,
    'orderId' => $orderId,
    'message' => 'Booking enquiry recorded and dispatched.'
]);
