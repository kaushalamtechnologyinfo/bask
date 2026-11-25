<?php
// GoDaddy cPanel PHP Backend for /api/gift-voucher
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

$voucherAmount = $data['voucherAmount'] ?? $data['Voucher Amount'] ?? '$100 AUD';
$numericVal = (float)preg_replace('/[^0-9.]/', '', (string)$voucherAmount);
if ($numericVal <= 0) $numericVal = 100;

$voucherTitle = $data['voucherTitle'] ?? 'Coastal Italian Dining Voucher';
$voucherCode = $data['voucherCode'] ?? ('BASKK-GV-' . mt_rand(100000, 999999));
$deliveryType = $data['deliveryType'] ?? 'Send to Recipient';
$deliveryDate = $data['deliveryDate'] ?? 'Instant Digital Delivery';

$buyerName = $data['buyerName'] ?? $data['Purchaser Name'] ?? 'Valued Guest';
$buyerEmail = $data['buyerEmail'] ?? $data['Purchaser Email'] ?? 'Not provided';
$buyerPhone = $data['buyerPhone'] ?? $data['Purchaser Phone'] ?? 'Not provided';

$recipientName = $data['recipientName'] ?? $buyerName;
$recipientEmail = $data['recipientEmail'] ?? $buyerEmail;
$occasion = $data['occasion'] ?? 'Special Gift';
$personalMessage = $data['personalMessage'] ?? 'Enjoy an unforgettable coastal Italian dining experience at Baskk!';
$purchaseDate = $data['purchaseDate'] ?? date('j M Y');
$expiryDate = $data['expiryDate'] ?? date('j M Y', strtotime('+3 years'));

$voucherEntry = [
    'voucherCode' => $voucherCode,
    'purchaseDate' => $purchaseDate,
    'expiryDate' => $expiryDate,
    'originalAmount' => $numericVal,
    'remainingBalance' => $numericVal,
    'status' => 'Active',
    'paymentStatus' => 'Verify Stripe Payment',
    'buyerName' => $buyerName,
    'buyerEmail' => $buyerEmail,
    'buyerPhone' => $buyerPhone,
    'recipientName' => $recipientName,
    'recipientEmail' => $recipientEmail,
    'occasion' => $occasion,
    'deliveryDate' => $deliveryDate,
    'personalMessage' => $personalMessage,
    'notes' => "Online order ($voucherTitle)"
];

// 1. Save to server CMS store
$store = ['vouchers' => [], 'orders' => [], 'gallery' => [], 'hiddenDefaultImages' => [], 'settings' => ['sheetUrl' => '']];
if (file_exists($storeFile)) {
    $parsed = @json_decode(@file_get_contents($storeFile), true);
    if (is_array($parsed)) $store = array_merge($store, $parsed);
}
array_unshift($store['vouchers'], $voucherEntry);
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
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array_merge(['action' => 'append_voucher'], $voucherEntry)));
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        @curl_exec($ch);
        @curl_close($ch);
    }
}

// 3. Send notification email via GoDaddy PHP mail()
$to = 'request@baskk.co';
$subject = "New Gift Voucher Order ($voucherAmount) - $buyerName [$voucherCode]";
$bodyText = "NEW ONLINE GIFT VOUCHER ORDER\n\n"
    . "Voucher Code: $voucherCode\n"
    . "Amount: $voucherAmount\n"
    . "Package: $voucherTitle\n"
    . "Valid Until (3 Years): $expiryDate\n"
    . "Purchaser Name: $buyerName\n"
    . "Purchaser Email: $buyerEmail\n"
    . "Purchaser Phone: $buyerPhone\n"
    . "Recipient Name: $recipientName\n"
    . "Recipient Email: $recipientEmail\n"
    . "Occasion: $occasion\n"
    . "Delivery Schedule: $deliveryDate\n"
    . "Personal Message: $personalMessage\n";
$headers = "From: Baskk Gift Concierge <noreply@baskk.co>\r\n";
if (strpos($buyerEmail, '@') !== false) {
    $headers .= "Reply-To: $buyerEmail\r\n";
}
@mail($to, $subject, $bodyText, $headers);

echo json_encode([
    'success' => true,
    'voucherCode' => $voucherCode,
    'message' => 'Gift voucher recorded and dispatched.'
]);
