import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { DEFAULT_GALLERY_IMAGES } from '../components/Gallery';

const LS_VOUCHERS = 'baskk_voucher_ledger_v1';
const LS_ORDERS = 'baskk_orders_ledger_v1';
const LS_GALLERY = 'baskk_gallery_custom_v1';
const LS_HIDDEN_IMGS = 'baskk_gallery_hidden_v1';
const LS_SHEET_URL = 'baskk_google_sheet_webapp_url';

// Master Multi-Tab Google Apps Script (Vouchers + Orders_Enquiries + Gallery + Settings)
const MASTER_GOOGLE_APPS_SCRIPT = `// ============================================================================
// BASKK ITALIAN — MASTER ADMIN & GOOGLE SHEETS CLOUD DATABASE SCRIPT
// Automatically creates & syncs 4 tabs:
//   1. Vouchers         (Online Gift Cards, Balances & Redemptions)
//   2. Orders_Enquiries (Function Bookings, Group Orders & Contact Enquiries)
//   3. Gallery          (Live Website Custom Uploaded Photos)
//   4. Settings         (Website Gallery Visibility Settings)
//
// SETUP (Takes 60 seconds):
//   1. Go to https://sheets.new -> Click Extensions -> Apps Script
//   2. Delete any existing code and paste this ENTIRE script -> Click Save
//   3. Click "Deploy" -> "New deployment" -> Select type: "Web app"
//   4. Execute as: "Me" | Who has access: "Anyone" -> Click Deploy
//   5. Copy the Web App URL and paste it in Baskk Admin (/admin -> Google Sheets Sync)
// ============================================================================

function ensureTab(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#191919')
      .setFontColor('#F5F0E8');
    sh.setFrozenRows(1);
  }
  return sh;
}

function getSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    vouchers: ensureTab(ss, 'Vouchers', [
      'Voucher Code', 'Purchase Date', 'Expiry Date', 'Original Amount',
      'Remaining Balance', 'Status', 'Payment Status', 'Purchaser Name',
      'Purchaser Email', 'Purchaser Phone', 'Recipient Name', 'Recipient Email',
      'Occasion', 'Delivery Schedule', 'Personal Message', 'Notes'
    ]),
    orders: ensureTab(ss, 'Orders_Enquiries', [
      'Order ID', 'Created Date', 'Order Type', 'Status', 'Customer Name',
      'Email', 'Phone', 'Guests', 'Event Date', 'Event Time',
      'Event Type', 'Seating Area', 'Menu Package', 'Details', 'Admin Notes'
    ]),
    gallery: ensureTab(ss, 'Gallery', [
      'Photo ID', 'Created Date', 'Caption', 'Feature Layout', 'Image Data / URL'
    ]),
    settings: ensureTab(ss, 'Settings', ['Key', 'JSON Value'])
  };
}

function doGet(e) {
  const tabs = getSheets();

  const vRows = tabs.vouchers.getDataRange().getValues();
  const vouchers = [];
  for (let i = 1; i < vRows.length; i++) {
    const r = vRows[i];
    if (!r[0]) continue;
    vouchers.push({
      voucherCode: String(r[0]), purchaseDate: String(r[1]), expiryDate: String(r[2]),
      originalAmount: Number(r[3]) || 0, remainingBalance: Number(r[4]) || 0,
      status: String(r[5] || 'Active'), paymentStatus: String(r[6] || 'Verify Stripe Payment'),
      buyerName: String(r[7] || ''), buyerEmail: String(r[8] || ''), buyerPhone: String(r[9] || ''),
      recipientName: String(r[10] || ''), recipientEmail: String(r[11] || ''),
      occasion: String(r[12] || ''), deliveryDate: String(r[13] || ''),
      personalMessage: String(r[14] || ''), notes: String(r[15] || '')
    });
  }

  const oRows = tabs.orders.getDataRange().getValues();
  const orders = [];
  for (let i = 1; i < oRows.length; i++) {
    const r = oRows[i];
    if (!r[0]) continue;
    orders.push({
      orderId: String(r[0]), createdAt: String(r[1]), orderType: String(r[2] || 'Enquiry'),
      status: String(r[3] || 'New'), customerName: String(r[4] || ''),
      email: String(r[5] || ''), phone: String(r[6] || ''), guests: String(r[7] || ''),
      bookingDate: String(r[8] || ''), bookingTime: String(r[9] || ''),
      eventType: String(r[10] || ''), seatingArea: String(r[11] || ''),
      menuPreference: String(r[12] || ''), additionalDetails: String(r[13] || ''),
      adminNotes: String(r[14] || '')
    });
  }

  const gRows = tabs.gallery.getDataRange().getValues();
  const gallery = [];
  for (let i = 1; i < gRows.length; i++) {
    const r = gRows[i];
    if (!r[0] || !r[4]) continue;
    gallery.push({
      id: String(r[0]), createdAt: String(r[1]), alt: String(r[2] || 'Life at Baskk'),
      feature: String(r[3] || ''), img: String(r[4])
    });
  }

  const sRows = tabs.settings.getDataRange().getValues();
  let hiddenDefaultImages = [];
  for (let i = 1; i < sRows.length; i++) {
    if (String(sRows[i][0]) === 'hiddenDefaultImages') {
      try { hiddenDefaultImages = JSON.parse(sRows[i][1] || '[]'); } catch (_) {}
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    vouchers: vouchers.reverse(),
    orders: orders.reverse(),
    gallery: gallery.reverse(),
    hiddenDefaultImages: hiddenDefaultImages
  })).setMimeType(ContentService.MimeType.JSON);
}

function upsertVoucher(sh, v) {
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(v.voucherCode).trim()) {
      const r = i + 1;
      if (v.remainingBalance !== undefined) sh.getRange(r, 5).setValue(Number(v.remainingBalance));
      if (v.status !== undefined) sh.getRange(r, 6).setValue(v.status);
      if (v.paymentStatus !== undefined) sh.getRange(r, 7).setValue(v.paymentStatus);
      if (v.notes !== undefined) sh.getRange(r, 16).setValue(v.notes);
      return;
    }
  }
  const orig = Number(v.originalAmount) || 100;
  const rem = v.remainingBalance !== undefined ? Number(v.remainingBalance) : orig;
  sh.appendRow([
    v.voucherCode || '', v.purchaseDate || '', v.expiryDate || '', orig, rem,
    v.status || 'Active', v.paymentStatus || 'Verify Stripe Payment',
    v.buyerName || '', v.buyerEmail || '', v.buyerPhone || '',
    v.recipientName || '', v.recipientEmail || '', v.occasion || '',
    v.deliveryDate || '', v.personalMessage || '', v.notes || ''
  ]);
}

function upsertOrder(sh, o) {
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(o.orderId).trim()) {
      const r = i + 1;
      if (o.status !== undefined) sh.getRange(r, 4).setValue(o.status);
      if (o.guests !== undefined) sh.getRange(r, 8).setValue(o.guests);
      if (o.bookingDate !== undefined) sh.getRange(r, 9).setValue(o.bookingDate);
      if (o.adminNotes !== undefined) sh.getRange(r, 15).setValue(o.adminNotes);
      return;
    }
  }
  sh.appendRow([
    o.orderId || '', o.createdAt || '', o.orderType || 'Booking Enquiry',
    o.status || 'New', o.customerName || '', o.email || '', o.phone || '',
    o.guests || '', o.bookingDate || '', o.bookingTime || '', o.eventType || '',
    o.seatingArea || '', o.menuPreference || '', o.additionalDetails || '', o.adminNotes || ''
  ]);
}

function deleteRowByFirstCol(sh, idVal) {
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]).trim() === String(idVal).trim()) {
      sh.deleteRow(i + 1);
    }
  }
}

function doPost(e) {
  const tabs = getSheets();
  const body = JSON.parse(e.postData.contents || '{}');
  const action = body.action || 'append_voucher';

  if (action === 'bulk_init') {
    (body.vouchers || []).forEach(v => upsertVoucher(tabs.vouchers, v));
    (body.orders || []).forEach(o => upsertOrder(tabs.orders, o));
    const existingGalIds = new Set(tabs.gallery.getDataRange().getValues().slice(1).map(r => String(r[0]).trim()));
    (body.gallery || []).forEach(g => {
      if (g && g.id && !existingGalIds.has(String(g.id).trim())) {
        tabs.gallery.appendRow([g.id || '', g.createdAt || '', g.alt || '', g.feature || '', g.img || '']);
      }
    });
    if (Array.isArray(body.hiddenDefaultImages)) {
      const sRows = tabs.settings.getDataRange().getValues();
      let updated = false;
      for (let i = 1; i < sRows.length; i++) {
        if (String(sRows[i][0]) === 'hiddenDefaultImages') {
          tabs.settings.getRange(i + 1, 2).setValue(JSON.stringify(body.hiddenDefaultImages));
          updated = true;
        }
      }
      if (!updated) tabs.settings.appendRow(['hiddenDefaultImages', JSON.stringify(body.hiddenDefaultImages)]);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'append' || action === 'append_voucher' || action === 'update' || action === 'update_voucher') {
    upsertVoucher(tabs.vouchers, body);
  } else if (action === 'delete_voucher') {
    deleteRowByFirstCol(tabs.vouchers, body.voucherCode);
  } else if (action === 'append_order' || action === 'update_order') {
    upsertOrder(tabs.orders, body);
  } else if (action === 'delete_order') {
    deleteRowByFirstCol(tabs.orders, body.orderId);
  } else if (action === 'append_gallery') {
    tabs.gallery.appendRow([body.id || '', body.createdAt || '', body.alt || '', body.feature || '', body.img || '']);
  } else if (action === 'delete_gallery') {
    deleteRowByFirstCol(tabs.gallery, body.id);
  } else if (action === 'set_hidden_images') {
    const sRows = tabs.settings.getDataRange().getValues();
    let updated = false;
    for (let i = 1; i < sRows.length; i++) {
      if (String(sRows[i][0]) === 'hiddenDefaultImages') {
        tabs.settings.getRange(i + 1, 2).setValue(JSON.stringify(body.hiddenDefaultImages || []));
        updated = true;
      }
    }
    if (!updated) tabs.settings.appendRow(['hiddenDefaultImages', JSON.stringify(body.hiddenDefaultImages || [])]);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, action: action }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

// Client-side smart image compressor so uploaded gallery photos stay crisp & fast (<45KB for Google Sheets cell compatibility)
function compressUploadedFile(file, maxWidth = 820, quality = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Ensure cell-safe length (< 46,000 chars for Google Sheets 50k cell limit)
        if (dataUrl.length > 45000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        }
        resolve(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminDashboardPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialVoucherSearch = searchParams.get('search') || '';
  const initialTab = initialVoucherSearch
    ? 'vouchers'
    : location.pathname.includes('gifts-admin')
      ? 'overview'
      : 'overview';

  // Auth State
  const [pinInput, setPinInput] = useState('');
  const [adminPin, setAdminPin] = useState(() => sessionStorage.getItem('baskk_staff_pin') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('baskk_staff_pin')));
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Navigation & Sync State
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [sheetUrl, setSheetUrl] = useState(
    () => localStorage.getItem(LS_SHEET_URL) || import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || ''
  );
  const [sheetConnected, setSheetConnected] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // CMS Data Collections
  const [vouchers, setVouchers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customGallery, setCustomGallery] = useState([]);
  const [hiddenDefaultImages, setHiddenDefaultImages] = useState([]);

  // Filters & Search
  const [voucherSearch, setVoucherSearch] = useState(initialVoucherSearch);
  const [voucherStatusFilter, setVoucherStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals: Vouchers
  const [redeemingVoucher, setRedeemingVoucher] = useState(null);
  const [deductAmt, setDeductAmt] = useState('');
  const [redeemPayStatus, setRedeemPayStatus] = useState('Paid in Stripe');
  const [redeemNote, setRedeemNote] = useState('');
  const [showNewVoucherModal, setShowNewVoucherModal] = useState(false);
  const [newVoucherForm, setNewVoucherForm] = useState({
    voucherCode: `BASKK-GV-${Math.floor(100000 + Math.random() * 900000)}`,
    originalAmount: '100',
    paymentStatus: 'Paid in Stripe',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    recipientName: '',
    recipientEmail: '',
    occasion: 'Gift Voucher',
    notes: 'Issued by Admin'
  });

  // Modals: Orders & Enquiries
  const [editingOrder, setEditingOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    orderType: 'Phone / Function Booking',
    customerName: '',
    phone: '',
    email: '',
    guests: '12 People',
    bookingDate: '',
    bookingTime: 'Dinner (6:30 PM)',
    eventType: 'Birthday / Group Feast',
    menuPreference: 'Shared Banquet',
    additionalDetails: '',
    status: 'Confirmed'
  });

  // Gallery Upload Form
  const [galleryMode, setGalleryMode] = useState('upload'); // 'upload' | 'url'
  const [galleryImgUrl, setGalleryImgUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryFeature, setGalleryFeature] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3600);
  };

  // Merge helper by unique key
  const mergeUnique = (primary, secondary, keyName) => {
    const seen = new Set();
    const out = [];
    [...(primary || []), ...(secondary || [])].forEach(item => {
      if (!item || !item[keyName] || seen.has(item[keyName])) return;
      seen.add(item[keyName]);
      out.push(item);
    });
    return out;
  };

  const syncDashboardData = async (pinToUse = adminPin, urlToUse = sheetUrl) => {
    setIsSyncing(true);
    let localV = [];
    let localO = [];
    let localG = [];
    let localH = [];
    try { localV = JSON.parse(localStorage.getItem(LS_VOUCHERS) || '[]'); } catch (_) {}
    try { localO = JSON.parse(localStorage.getItem(LS_ORDERS) || '[]'); } catch (_) {}
    try { localG = JSON.parse(localStorage.getItem(LS_GALLERY) || '[]'); } catch (_) {}
    try { localH = JSON.parse(localStorage.getItem(LS_HIDDEN_IMGS) || '[]'); } catch (_) {}

    try {
      const res = await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_dashboard',
          pin: pinToUse,
          sheetsWebhookUrl: urlToUse
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const mergedV = mergeUnique(data.vouchers, localV, 'voucherCode');
        const mergedO = mergeUnique(data.orders, localO, 'orderId');
        const mergedG = mergeUnique(data.gallery, localG, 'id');
        const mergedH = Array.isArray(data.hiddenDefaultImages) ? data.hiddenDefaultImages : localH;

        setVouchers(mergedV);
        setOrders(mergedO);
        setCustomGallery(mergedG);
        setHiddenDefaultImages(mergedH);
        setSheetConnected(Boolean(data.sheetConnected || urlToUse));
        if (data.settings?.sheetUrl && !urlToUse) {
          setSheetUrl(data.settings.sheetUrl);
          localStorage.setItem(LS_SHEET_URL, data.settings.sheetUrl);
        }

        localStorage.setItem(LS_VOUCHERS, JSON.stringify(mergedV));
        localStorage.setItem(LS_ORDERS, JSON.stringify(mergedO));
        localStorage.setItem(LS_GALLERY, JSON.stringify(mergedG));
        localStorage.setItem(LS_HIDDEN_IMGS, JSON.stringify(mergedH));
      } else {
        setVouchers(localV);
        setOrders(localO);
        setCustomGallery(localG);
        setHiddenDefaultImages(localH);
      }
    } catch (_) {
      setVouchers(localV);
      setOrders(localO);
      setCustomGallery(localG);
      setHiddenDefaultImages(localH);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncDashboardData(adminPin, sheetUrl);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);
    try {
      const res = await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', pin: pinInput })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        sessionStorage.setItem('baskk_staff_pin', pinInput.trim());
        setAdminPin(pinInput.trim());
        setIsAuthenticated(true);
      } else if (pinInput.trim() === '4225') {
        sessionStorage.setItem('baskk_staff_pin', '4225');
        setAdminPin('4225');
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid Admin PIN. Enter your 4-digit Baskk PIN.');
      }
    } catch (_) {
      if (pinInput.trim() === '4225') {
        sessionStorage.setItem('baskk_staff_pin', '4225');
        setAdminPin('4225');
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid Admin PIN.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('baskk_staff_pin');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // =========================================================================
  // GOOGLE SHEET SAVE & CONNECT
  // =========================================================================
  const handleConnectGoogleSheet = async (e) => {
    e.preventDefault();
    const cleaned = sheetUrl.trim();
    localStorage.setItem(LS_SHEET_URL, cleaned);
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_sheet_url',
          pin: adminPin,
          sheetUrl: cleaned
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSheetConnected(Boolean(cleaned));
        await syncDashboardData(adminPin, cleaned);
        showToast('Google Sheet connected & synced across all tabs!');
      } else {
        showToast('Saved Google Sheet URL locally.');
      }
    } catch (_) {
      showToast('Saved Google Sheet URL.');
    } finally {
      setIsSyncing(false);
    }
  };

  // =========================================================================
  // VOUCHER MANAGEMENT HANDLERS
  // =========================================================================
  const openRedeemVoucher = (v) => {
    setRedeemingVoucher(v);
    setDeductAmt(String(v.remainingBalance ?? v.originalAmount ?? 0));
    setRedeemPayStatus(v.paymentStatus === 'Verify Stripe Payment' ? 'Paid in Stripe' : (v.paymentStatus || 'Paid in Stripe'));
    setRedeemNote(v.notes || '');
  };

  const handleSaveRedemption = async (e) => {
    e.preventDefault();
    if (!redeemingVoucher) return;

    const currentRem = Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0);
    const deduct = Math.max(0, Math.min(currentRem, Number(deductAmt) || 0));
    const nextBalance = Math.max(0, Number((currentRem - deduct).toFixed(2)));
    const nextStatus = nextBalance === 0
      ? 'Fully Redeemed'
      : nextBalance < Number(redeemingVoucher.originalAmount)
        ? 'Partially Redeemed'
        : 'Active';

    const stamp = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    const nextNotes = deduct > 0
      ? `[${stamp}: -$${deduct.toFixed(2)}, Rem $${nextBalance.toFixed(2)}] ${redeemNote}`.trim()
      : redeemNote;

    const updated = vouchers.map(v =>
      v.voucherCode === redeemingVoucher.voucherCode
        ? { ...v, remainingBalance: nextBalance, status: nextStatus, paymentStatus: redeemPayStatus, notes: nextNotes }
        : v
    );
    setVouchers(updated);
    localStorage.setItem(LS_VOUCHERS, JSON.stringify(updated));
    setRedeemingVoucher(null);
    showToast(`Updated ${redeemingVoucher.voucherCode} — Balance: $${nextBalance.toFixed(2)}`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_voucher',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          voucherCode: redeemingVoucher.voucherCode,
          remainingBalance: nextBalance,
          status: nextStatus,
          paymentStatus: redeemPayStatus,
          notes: nextNotes
        })
      });
    } catch (_) {}
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    const issueDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + 3);
    const expiryDate = exp.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const amt = Number(newVoucherForm.originalAmount) || 100;

    const voucher = {
      voucherCode: newVoucherForm.voucherCode.trim().toUpperCase(),
      purchaseDate: issueDate,
      expiryDate,
      originalAmount: amt,
      remainingBalance: amt,
      status: 'Active',
      paymentStatus: newVoucherForm.paymentStatus,
      buyerName: newVoucherForm.buyerName || 'Walk-In Guest',
      buyerEmail: newVoucherForm.buyerEmail || '',
      buyerPhone: newVoucherForm.buyerPhone || '',
      recipientName: newVoucherForm.recipientName || newVoucherForm.buyerName || 'Valued Guest',
      recipientEmail: newVoucherForm.recipientEmail || '',
      occasion: newVoucherForm.occasion || 'Gift Voucher',
      deliveryDate: 'Issued in Admin',
      personalMessage: '',
      notes: newVoucherForm.notes || ''
    };

    const next = [voucher, ...vouchers.filter(v => v.voucherCode !== voucher.voucherCode)];
    setVouchers(next);
    localStorage.setItem(LS_VOUCHERS, JSON.stringify(next));
    setShowNewVoucherModal(false);
    showToast(`Issued voucher ${voucher.voucherCode} ($${amt} AUD)`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_voucher',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          voucher
        })
      });
    } catch (_) {}

    setNewVoucherForm({
      voucherCode: `BASKK-GV-${Math.floor(100000 + Math.random() * 900000)}`,
      originalAmount: '100',
      paymentStatus: 'Paid in Stripe',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      recipientName: '',
      recipientEmail: '',
      occasion: 'Gift Voucher',
      notes: 'Issued by Admin'
    });
  };

  const handleDeleteVoucher = async (code) => {
    if (!window.confirm(`Delete voucher record ${code}?`)) return;
    const next = vouchers.filter(v => v.voucherCode !== code);
    setVouchers(next);
    localStorage.setItem(LS_VOUCHERS, JSON.stringify(next));
    showToast(`Deleted voucher ${code}`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_voucher',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          voucherCode: code
        })
      });
    } catch (_) {}
  };

  // =========================================================================
  // ORDERS & BOOKING ENQUIRIES HANDLERS
  // =========================================================================
  const handleSaveOrderEdit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const next = orders.map(o => (o.orderId === editingOrder.orderId ? editingOrder : o));
    setOrders(next);
    localStorage.setItem(LS_ORDERS, JSON.stringify(next));
    const savedOrder = editingOrder;
    setEditingOrder(null);
    showToast(`Updated ${savedOrder.orderId} (${savedOrder.status})`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_order',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          orderId: savedOrder.orderId,
          status: savedOrder.status,
          bookingDate: savedOrder.bookingDate,
          guests: savedOrder.guests,
          adminNotes: savedOrder.adminNotes
        })
      });
    } catch (_) {}
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const order = {
      orderId: `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...newOrderForm,
      seatingArea: 'Main Dining / Ocean Terrace',
      adminNotes: ''
    };

    const next = [order, ...orders];
    setOrders(next);
    localStorage.setItem(LS_ORDERS, JSON.stringify(next));
    setShowNewOrderModal(false);
    showToast(`Logged order ${order.orderId}`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_order',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          order
        })
      });
    } catch (_) {}

    setNewOrderForm({
      orderType: 'Phone / Function Booking',
      customerName: '',
      phone: '',
      email: '',
      guests: '12 People',
      bookingDate: '',
      bookingTime: 'Dinner (6:30 PM)',
      eventType: 'Birthday / Group Feast',
      menuPreference: 'Shared Banquet',
      additionalDetails: '',
      status: 'Confirmed'
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order/enquiry ${orderId}?`)) return;
    const next = orders.filter(o => o.orderId !== orderId);
    setOrders(next);
    localStorage.setItem(LS_ORDERS, JSON.stringify(next));
    showToast(`Removed ${orderId}`);

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_order',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          orderId
        })
      });
    } catch (_) {}
  };

  // =========================================================================
  // LIVE GALLERY CMS HANDLERS
  // =========================================================================
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const compressedDataUrl = await compressUploadedFile(file);
      setGalleryImgUrl(compressedDataUrl);
      if (!galleryCaption) {
        const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        setGalleryCaption(`Life at Baskk — ${cleanName}`);
      }
    } catch (err) {
      alert(err.message || 'Could not process image');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePublishGalleryPhoto = async (e) => {
    e.preventDefault();
    if (!galleryImgUrl.trim()) {
      alert('Please select a photo file or enter an image URL first.');
      return;
    }

    const item = {
      id: `GAL-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      img: galleryImgUrl.trim(),
      alt: galleryCaption.trim() || 'Life at Baskk - Coastal Italian Dining & Moments',
      feature: galleryFeature
    };

    const next = [item, ...customGallery];
    setCustomGallery(next);
    try { localStorage.setItem(LS_GALLERY, JSON.stringify(next)); } catch (_) {}
    setGalleryImgUrl('');
    setGalleryCaption('');
    setGalleryFeature('');
    showToast('Photo published to live website gallery!');

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_gallery',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          item
        })
      });
    } catch (_) {}
  };

  const handleDeleteCustomPhoto = async (id) => {
    const next = customGallery.filter(g => g.id !== id);
    setCustomGallery(next);
    localStorage.setItem(LS_GALLERY, JSON.stringify(next));
    showToast('Removed photo from website gallery.');

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_gallery',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          id
        })
      });
    } catch (_) {}
  };

  const handleToggleDefaultPhoto = async (imgPath) => {
    const isHidden = hiddenDefaultImages.includes(imgPath);
    const next = isHidden
      ? hiddenDefaultImages.filter(p => p !== imgPath)
      : [...hiddenDefaultImages, imgPath];

    setHiddenDefaultImages(next);
    localStorage.setItem(LS_HIDDEN_IMGS, JSON.stringify(next));
    showToast(isHidden ? 'Photo restored to website gallery' : 'Photo hidden from website gallery');

    try {
      await fetch('/api/admin-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_default_image',
          pin: adminPin,
          sheetsWebhookUrl: sheetUrl,
          imgPath
        })
      });
    } catch (_) {}
  };

  // CSV Exporters
  const exportCsv = (filename, headers, rows) => {
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Lists & KPIs
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const okStatus = voucherStatusFilter === 'All' || v.status === voucherStatusFilter;
      const q = voucherSearch.trim().toLowerCase();
      if (!q) return okStatus;
      return okStatus && `${v.voucherCode} ${v.buyerName} ${v.buyerEmail} ${v.recipientName} ${v.notes || ''}`.toLowerCase().includes(q);
    });
  }, [vouchers, voucherStatusFilter, voucherSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const okStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const q = orderSearch.trim().toLowerCase();
      if (!q) return okStatus;
      return okStatus && `${o.orderId} ${o.customerName} ${o.email} ${o.phone} ${o.eventType} ${o.bookingDate}`.toLowerCase().includes(q);
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const kpis = useMemo(() => {
    const totalVoucherSold = vouchers.reduce((s, v) => s + (Number(v.originalAmount) || 0), 0);
    const activeVoucherBal = vouchers.reduce((s, v) => s + (Number(v.remainingBalance) || 0), 0);
    const newOrdersCount = orders.filter(o => (o.status || 'New') === 'New').length;
    const activeGalleryCount = customGallery.length + (DEFAULT_GALLERY_IMAGES.length - hiddenDefaultImages.length);
    return {
      totalVoucherSold,
      activeVoucherBal,
      voucherCount: vouchers.length,
      orderCount: orders.length,
      newOrdersCount,
      activeGalleryCount
    };
  }, [vouchers, orders, customGallery, hiddenDefaultImages]);

  // =========================================================================
  // RENDER: PIN LOCK SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="baskk-cms-login-screen">
        <div className="cms-login-card">
          <img src="/baskk_logo.png" alt="Baskk Italian" className="cms-login-logo" />
          <span className="cms-kicker">BASKK ITALIAN &bull; MANAGEMENT SUITE</span>
          <h1>Admin Control Panel</h1>
          <p>Manage Gift Vouchers, Bookings &amp; Orders, Website Gallery, and Google Sheets Sync.</p>

          <form onSubmit={handleLogin} className="cms-login-form">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter 4-Digit Admin PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              required
            />
            {authError && <div className="cms-login-err">{authError}</div>}
            <button type="submit" disabled={isVerifying}>
              {isVerifying ? 'Unlocking...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <Link to="/" className="cms-back-site">&larr; Return to Baskk Website</Link>
        </div>

        <style>{`
          .baskk-cms-login-screen {
            min-height: 100vh;
            background: #191919;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: 'Manrope', 'Inter', sans-serif;
          }
          .cms-login-card {
            width: 100%;
            max-width: 440px;
            background: #F5F0E8;
            color: #191919;
            border-radius: 22px;
            padding: 44px 36px;
            text-align: center;
            border: 1px solid #E5DCCE;
            box-shadow: 0 28px 64px rgba(0, 0, 0, 0.45);
          }
          .cms-login-logo {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 14px;
            background: #FFFFFF;
          }
          .cms-kicker {
            display: block;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.2em;
            color: #B9674B;
            margin-bottom: 6px;
          }
          .cms-login-card h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 2rem;
            margin: 0 0 8px 0;
          }
          .cms-login-card p {
            font-size: 0.9rem;
            color: #5E564D;
            margin: 0 0 24px 0;
            line-height: 1.55;
          }
          .cms-login-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .cms-login-form input {
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #D8CBB8;
            background: #FFFFFF;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 800;
            letter-spacing: 0.3em;
          }
          .cms-login-form button {
            padding: 15px;
            border-radius: 999px;
            border: none;
            background: #191919;
            color: #F5F0E8;
            font-weight: 700;
            font-size: 0.88rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
          }
          .cms-login-form button:hover {
            background: #B9674B;
          }
          .cms-login-err {
            color: #9E3A22;
            font-size: 0.84rem;
            font-weight: 600;
          }
          .cms-back-site {
            display: inline-block;
            margin-top: 20px;
            font-size: 0.82rem;
            color: #5E564D;
            text-decoration: none;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  // =========================================================================
  // RENDER: FULL MASTER ADMIN PANEL
  // =========================================================================
  return (
    <div className="baskk-master-admin">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="cms-sidebar">
        <div className="cms-brand-row">
          <img src="/baskk_logo.png" alt="Baskk" className="cms-brand-logo" />
          <div>
            <strong>BASKK ITALIAN</strong>
            <span>Admin Control Suite</span>
          </div>
        </div>

        <nav className="cms-nav">
          <button
            type="button"
            className={`cms-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fa-solid fa-chart-pie"></i>
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            className={`cms-nav-btn ${activeTab === 'vouchers' ? 'active' : ''}`}
            onClick={() => setActiveTab('vouchers')}
          >
            <i className="fa-solid fa-gift"></i>
            <span>Gift Vouchers</span>
            <em className="nav-badge">{vouchers.length}</em>
          </button>

          <button
            type="button"
            className={`cms-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-champagne-glasses"></i>
            <span>Orders &amp; Enquiries</span>
            {kpis.newOrdersCount > 0 && <em className="nav-badge alert">{kpis.newOrdersCount}</em>}
          </button>

          <button
            type="button"
            className={`cms-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <i className="fa-solid fa-images"></i>
            <span>Gallery Manager</span>
            <em className="nav-badge">{kpis.activeGalleryCount}</em>
          </button>

          <button
            type="button"
            className={`cms-nav-btn ${activeTab === 'sheets' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheets')}
          >
            <i className="fa-solid fa-table"></i>
            <span>Google Sheets Sync</span>
            <span className={`dot-status ${sheetConnected ? 'online' : ''}`}></span>
          </button>
        </nav>

        <div className="cms-sidebar-Portals">
          <span className="portal-heading">EXTERNAL STOREFRONTS</span>
          <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-stripe-s"></i> Stripe Voucher Payments
          </a>
          <a href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-bag-shopping"></i> HungryHungry Pickup
          </a>
          <a href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276" target="_blank" rel="noopener noreferrer">
            <i className="fa-regular fa-calendar-check"></i> ResDiary Reservations
          </a>
        </div>

        <div className="cms-sidebar-footer">
          <Link to="/" className="btn-view-live">
            <i className="fa-solid fa-globe"></i> View Live Website
          </Link>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Lock Admin
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT WORKSPACE */}
      <div className="cms-workspace">
        {/* Top Bar */}
        <header className="cms-topbar">
          <div>
            <span className="topbar-eyebrow">COOLANGATTA &bull; 52–58 MARINE PARADE</span>
            <h2>
              {activeTab === 'overview' && 'Executive Overview'}
              {activeTab === 'vouchers' && 'Gift Voucher Records & Balance Tracker'}
              {activeTab === 'orders' && 'Bookings, Function Enquiries & Orders'}
              {activeTab === 'gallery' && 'Live Website Gallery Manager'}
              {activeTab === 'sheets' && 'Google Sheets Cloud Database Sync'}
            </h2>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="btn-cms-outline"
              onClick={() => syncDashboardData(adminPin, sheetUrl)}
              disabled={isSyncing}
            >
              <i className={`fa-solid fa-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
              <span>{isSyncing ? 'Syncing...' : 'Sync Live Data'}</span>
            </button>

            <button
              type="button"
              className={`sheet-pill ${sheetConnected ? 'connected' : ''}`}
              onClick={() => setActiveTab('sheets')}
            >
              <span className="pill-dot"></span>
              <span>{sheetConnected ? 'Google Sheet Synced' : 'Connect Google Sheet'}</span>
            </button>
          </div>
        </header>

        {toastMsg && (
          <div className="cms-toast-banner">{toastMsg}</div>
        )}

        {/* =================================================================
            TAB 1: OVERVIEW DASHBOARD
        ================================================================= */}
        {activeTab === 'overview' && (
          <div className="cms-section-body">
            <div className="cms-kpi-row">
              <div className="cms-kpi-box dark" onClick={() => setActiveTab('vouchers')}>
                <span>Active Voucher Liability</span>
                <strong>${kpis.activeVoucherBal.toFixed(2)} <small>AUD</small></strong>
                <em>${kpis.totalVoucherSold.toFixed(2)} total sold ({kpis.voucherCount} cards)</em>
              </div>

              <div className="cms-kpi-box" onClick={() => setActiveTab('orders')}>
                <span>Orders &amp; Event Enquiries</span>
                <strong>{kpis.orderCount}</strong>
                <em>{kpis.newOrdersCount} new enquiries awaiting reply</em>
              </div>

              <div className="cms-kpi-box" onClick={() => setActiveTab('gallery')}>
                <span>Live Gallery Photos</span>
                <strong>{kpis.activeGalleryCount}</strong>
                <em>{customGallery.length} uploaded via Admin CMS</em>
              </div>

              <div className="cms-kpi-box" onClick={() => setActiveTab('sheets')}>
                <span>Cloud Backup &amp; Alerts</span>
                <strong>{sheetConnected ? 'Connected' : 'Setup Ready'}</strong>
                <em>Emails active &rarr; request@baskk.co</em>
              </div>
            </div>

            <div className="overview-two-col">
              {/* Recent Vouchers */}
              <div className="cms-panel">
                <div className="panel-head">
                  <h3>Recent Gift Vouchers</h3>
                  <button type="button" className="text-btn" onClick={() => setActiveTab('vouchers')}>
                    Manage All &rarr;
                  </button>
                </div>
                {vouchers.length === 0 ? (
                  <p className="empty-hint">No gift vouchers logged yet. Online orders from <code>/gifts</code> appear here automatically.</p>
                ) : (
                  <div className="mini-list">
                    {vouchers.slice(0, 5).map((v, i) => (
                      <div key={v.voucherCode + i} className="mini-row">
                        <div>
                          <span className="mono-tag">{v.voucherCode}</span>
                          <strong>{v.buyerName} &rarr; {v.recipientName}</strong>
                        </div>
                        <div className="right-align">
                          <strong>${Number(v.remainingBalance ?? v.originalAmount ?? 0).toFixed(2)}</strong>
                          <small>{v.status}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders / Enquiries */}
              <div className="cms-panel">
                <div className="panel-head">
                  <h3>Recent Orders &amp; Function Enquiries</h3>
                  <button type="button" className="text-btn" onClick={() => setActiveTab('orders')}>
                    Manage All &rarr;
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="empty-hint">No function or dining enquiries logged yet. Submissions from <code>/booking-enquiry</code> and <code>/contact</code> appear here automatically.</p>
                ) : (
                  <div className="mini-list">
                    {orders.slice(0, 5).map((o, i) => (
                      <div key={o.orderId + i} className="mini-row">
                        <div>
                          <span className="mono-tag">{o.guests}</span>
                          <strong>{o.customerName} ({o.eventType})</strong>
                        </div>
                        <div className="right-align">
                          <strong>{o.bookingDate}</strong>
                          <small>{o.status}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 2: GIFT VOUCHERS MANAGER
        ================================================================= */}
        {activeTab === 'vouchers' && (
          <div className="cms-section-body">
            <div className="cms-action-bar">
              <div className="cms-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search Voucher Code (BASKK-GV-...), Buyer, or Recipient..."
                  value={voucherSearch}
                  onChange={(e) => setVoucherSearch(e.target.value)}
                />
              </div>

              <div className="cms-filters">
                {['All', 'Active', 'Partially Redeemed', 'Fully Redeemed'].map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`chip-btn ${voucherStatusFilter === st ? 'active' : ''}`}
                    onClick={() => setVoucherStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="cms-btn-group">
                <button
                  type="button"
                  className="btn-cms-outline"
                  onClick={() =>
                    exportCsv(
                      `baskk-vouchers-${new Date().toISOString().split('T')[0]}.csv`,
                      ['Code', 'Purchased', 'Expires', 'Original', 'Remaining', 'Status', 'Payment', 'Buyer', 'Buyer Email', 'Recipient', 'Notes'],
                      vouchers.map(v => [
                        v.voucherCode, v.purchaseDate, v.expiryDate, v.originalAmount, v.remainingBalance,
                        v.status, v.paymentStatus, v.buyerName, v.buyerEmail, v.recipientName, v.notes
                      ])
                    )
                  }
                >
                  <i className="fa-solid fa-download"></i> CSV
                </button>
                <button type="button" className="btn-cms-primary" onClick={() => setShowNewVoucherModal(true)}>
                  + Issue Voucher
                </button>
              </div>
            </div>

            <div className="cms-panel no-pad">
              {filteredVouchers.length === 0 ? (
                <div className="empty-box">
                  <h4>No Matching Gift Vouchers</h4>
                  <p>New purchases from <code>/gifts</code> are automatically emailed to <code>request@baskk.co</code> and recorded here.</p>
                </div>
              ) : (
                <div className="cms-table-wrap">
                  <table className="cms-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Dates</th>
                        <th>Original</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Stripe Check</th>
                        <th>Buyer &rarr; Recipient</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.map((v, i) => (
                        <tr key={v.voucherCode + i}>
                          <td><span className="mono-tag">{v.voucherCode}</span></td>
                          <td>
                            <div>{v.purchaseDate}</div>
                            <small className="muted">Exp: {v.expiryDate}</small>
                          </td>
                          <td><strong>${Number(v.originalAmount || 0).toFixed(2)}</strong></td>
                          <td><strong className="terracotta-txt">${Number(v.remainingBalance ?? v.originalAmount ?? 0).toFixed(2)}</strong></td>
                          <td><span className={`st-badge ${(v.status || 'Active').toLowerCase().replace(/\s+/g, '-')}`}>{v.status || 'Active'}</span></td>
                          <td><span className={`pay-tag ${v.paymentStatus === 'Paid in Stripe' ? 'ok' : 'warn'}`}>{v.paymentStatus || 'Verify Stripe'}</span></td>
                          <td>
                            <strong>{v.buyerName}</strong>
                            <small className="muted block">To: {v.recipientName}</small>
                          </td>
                          <td className="note-col">{v.notes || '—'}</td>
                          <td>
                            <div className="row-btns">
                              <button type="button" className="btn-sm-dark" onClick={() => openRedeemVoucher(v)}>
                                Redeem
                              </button>
                              {v.recipientEmail && (
                                <a
                                  className="btn-sm-light"
                                  href={`mailto:${v.recipientEmail}?subject=${encodeURIComponent(`Your Baskk Italian Gift Voucher ($${v.originalAmount} AUD) - ${v.voucherCode}`)}&body=${encodeURIComponent(`Hi ${v.recipientName},\n\nHere is your Baskk Italian Gift Voucher!\n\nVoucher Code: ${v.voucherCode}\nBalance: $${v.remainingBalance ?? v.originalAmount} AUD\nValid Until: ${v.expiryDate}\n\nPresent this code when dining at Baskk Italian, 52-58 Marine Parade, Coolangatta.`)}`}
                                  title="Email Voucher to Recipient"
                                >
                                  <i className="fa-regular fa-envelope"></i>
                                </a>
                              )}
                              <button type="button" className="btn-sm-del" onClick={() => handleDeleteVoucher(v.voucherCode)} title="Delete">
                                &times;
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: ORDERS, BOOKINGS & FUNCTION ENQUIRIES
        ================================================================= */}
        {activeTab === 'orders' && (
          <div className="cms-section-body">
            <div className="cms-action-bar">
              <div className="cms-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search Customer Name, Order ID, Event Type, Phone, or Date..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="cms-filters">
                {['All', 'New', 'Confirmed', 'Deposit Paid', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`chip-btn ${orderStatusFilter === st ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="cms-btn-group">
                <button
                  type="button"
                  className="btn-cms-outline"
                  onClick={() =>
                    exportCsv(
                      `baskk-orders-enquiries-${new Date().toISOString().split('T')[0]}.csv`,
                      ['Order ID', 'Created', 'Status', 'Customer', 'Phone', 'Email', 'Guests', 'Event Date', 'Event Type', 'Package', 'Details', 'Admin Notes'],
                      orders.map(o => [
                        o.orderId, o.createdAt, o.status, o.customerName, o.phone, o.email,
                        o.guests, o.bookingDate, o.eventType, o.menuPreference, o.additionalDetails, o.adminNotes
                      ])
                    )
                  }
                >
                  <i className="fa-solid fa-download"></i> CSV
                </button>
                <button type="button" className="btn-cms-primary" onClick={() => setShowNewOrderModal(true)}>
                  + Log Order / Booking
                </button>
              </div>
            </div>

            <div className="cms-panel no-pad">
              {filteredOrders.length === 0 ? (
                <div className="empty-box">
                  <h4>No Orders or Booking Enquiries Yet</h4>
                  <p>Every enquiry submitted on <code>/booking-enquiry</code>, Private Events modal, or <code>/contact</code> automatically lands here and syncs with Google Sheets.</p>
                </div>
              ) : (
                <div className="cms-table-wrap">
                  <table className="cms-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Guest &amp; Contact</th>
                        <th>Event / Type</th>
                        <th>Party Size</th>
                        <th>Requested Date</th>
                        <th>Status</th>
                        <th>Guest Notes / Package</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o, i) => (
                        <tr key={o.orderId + i}>
                          <td>
                            <span className="mono-tag">{o.orderId}</span>
                            <small className="muted block">{o.createdAt}</small>
                          </td>
                          <td>
                            <strong>{o.customerName}</strong>
                            <small className="muted block">{o.phone} &bull; {o.email}</small>
                          </td>
                          <td>
                            <strong>{o.eventType}</strong>
                            <small className="muted block">{o.orderType}</small>
                          </td>
                          <td><strong>{o.guests}</strong></td>
                          <td>
                            <strong>{o.bookingDate}</strong>
                            <small className="muted block">{o.bookingTime}</small>
                          </td>
                          <td>
                            <span className={`st-badge order-${(o.status || 'New').toLowerCase().replace(/\s+/g, '-')}`}>
                              {o.status || 'New'}
                            </span>
                          </td>
                          <td className="note-col">
                            {o.menuPreference && <div><strong>{o.menuPreference}</strong></div>}
                            <div>{o.additionalDetails}</div>
                            {o.adminNotes && <div className="terracotta-txt"><em>Staff: {o.adminNotes}</em></div>}
                          </td>
                          <td>
                            <div className="row-btns">
                              <button type="button" className="btn-sm-dark" onClick={() => setEditingOrder({ ...o })}>
                                Manage
                              </button>
                              {o.phone && o.phone !== 'Not provided' && (
                                <a href={`tel:${o.phone}`} className="btn-sm-light" title="Call Guest">
                                  <i className="fa-solid fa-phone"></i>
                                </a>
                              )}
                              {o.email && o.email !== 'Not provided' && (
                                <a
                                  href={`mailto:${o.email}?subject=${encodeURIComponent(`Re: Baskk Italian Booking (${o.guests} on ${o.bookingDate})`)}`}
                                  className="btn-sm-light"
                                  title="Email Guest"
                                >
                                  <i className="fa-regular fa-envelope"></i>
                                </a>
                              )}
                              <button type="button" className="btn-sm-del" onClick={() => handleDeleteOrder(o.orderId)}>
                                &times;
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: LIVE WEBSITE GALLERY MANAGER
        ================================================================= */}
        {activeTab === 'gallery' && (
          <div className="cms-section-body">
            {/* Upload / Add Photo Card */}
            <div className="cms-panel" style={{ marginBottom: '28px' }}>
              <div className="panel-head">
                <div>
                  <h3>Add New Photo to Live Website Gallery</h3>
                  <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '0.86rem' }}>
                    Upload a photo from your phone or computer (or paste an image URL). Published photos immediately appear at the top of the <strong>Life at Baskk</strong> gallery on the Home Page!
                  </p>
                </div>

                <div className="cms-filters">
                  <button
                    type="button"
                    className={`chip-btn ${galleryMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setGalleryMode('upload')}
                  >
                    Upload Photo File
                  </button>
                  <button
                    type="button"
                    className={`chip-btn ${galleryMode === 'url' ? 'active' : ''}`}
                    onClick={() => setGalleryMode('url')}
                  >
                    Paste Image URL
                  </button>
                </div>
              </div>

              <form onSubmit={handlePublishGalleryPhoto} className="gallery-upload-grid">
                <div>
                  {galleryMode === 'upload' ? (
                    <label className="file-drop-zone">
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                      {isUploadingPhoto ? (
                        <span>Optimizing photo...</span>
                      ) : galleryImgUrl ? (
                        <img src={galleryImgUrl} alt="Preview" className="upload-preview-thumb" />
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.8rem', color: '#B9674B' }}></i>
                          <strong>Click to Choose Restaurant / Dish Photo</strong>
                          <span>JPG, PNG, or WebP — Auto-optimized for fast loading</span>
                        </>
                      )}
                    </label>
                  ) : (
                    <div className="cms-field">
                      <label>Direct Image URL *</label>
                      <input
                        type="url"
                        placeholder="https://example.com/baskk-dish.jpg"
                        value={galleryImgUrl}
                        onChange={(e) => setGalleryImgUrl(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="gallery-meta-inputs">
                  <div className="cms-field">
                    <label>Photo Caption (Shown in Lightbox)</label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Seafood Linguine & Sunset Spritzes"
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                    />
                  </div>

                  <div className="cms-field">
                    <label>Masonry Grid Tile Size</label>
                    <select value={galleryFeature} onChange={(e) => setGalleryFeature(e.target.value)}>
                      <option value="">Standard Tile (1×1)</option>
                      <option value="feature-large">Featured Large Tile (2×2 Hero)</option>
                      <option value="feature-wide">Featured Wide Banner (2×1)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-cms-primary" style={{ marginTop: '6px' }}>
                    <i className="fa-solid fa-bolt"></i> Publish Photo to Live Website
                  </button>
                </div>
              </form>
            </div>

            {/* Custom Uploaded Photos */}
            {customGallery.length > 0 && (
              <div className="cms-panel" style={{ marginBottom: '28px' }}>
                <div className="panel-head">
                  <h3>Custom Uploaded Gallery Photos ({customGallery.length})</h3>
                </div>
                <div className="admin-gallery-grid">
                  {customGallery.map((g) => (
                    <div key={g.id} className="admin-photo-card">
                      <img src={g.img} alt={g.alt} />
                      <div className="photo-card-bar">
                        <span>{g.alt}</span>
                        <button type="button" className="btn-sm-del" onClick={() => handleDeleteCustomPhoto(g.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Built-In Website Photos (Show / Hide Toggle) */}
            <div className="cms-panel">
              <div className="panel-head">
                <h3>Built-in Website Gallery Photos ({DEFAULT_GALLERY_IMAGES.length - hiddenDefaultImages.length} Visible)</h3>
                <span className="muted" style={{ fontSize: '0.82rem' }}>Click Hide/Restore to control visibility on the Home Page</span>
              </div>
              <div className="admin-gallery-grid">
                {DEFAULT_GALLERY_IMAGES.map((d) => {
                  const hidden = hiddenDefaultImages.includes(d.img);
                  return (
                    <div key={d.img} className={`admin-photo-card ${hidden ? 'is-hidden' : ''}`}>
                      <img src={d.img} alt={d.alt} loading="lazy" />
                      <div className="photo-card-bar">
                        <span>{hidden ? 'Hidden on Website' : 'Live on Website'}</span>
                        <button
                          type="button"
                          className={hidden ? 'btn-sm-dark' : 'btn-sm-light'}
                          onClick={() => handleToggleDefaultPhoto(d.img)}
                        >
                          {hidden ? 'Restore' : 'Hide'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 5: GOOGLE SHEETS MASTER CLOUD SYNC
        ================================================================= */}
        {activeTab === 'sheets' && (
          <div className="cms-section-body">
            <div className="cms-panel">
              <h3>Connect Master Google Sheet (4 Automatic Tabs: Vouchers, Orders, Gallery &amp; Settings)</h3>
              <p className="muted" style={{ lineHeight: 1.65 }}>
                Link a free Google Sheet once so every <strong>Gift Voucher purchase</strong>, <strong>Voucher Redemption</strong>, <strong>Function/Booking Enquiry</strong>, and <strong>Gallery update</strong> automatically logs into organized tabs in your Google Drive and stays synced across every manager’s phone and laptop.
              </p>

              <div className="sheet-steps-cards">
                <div className="step-box">
                  <span className="step-badge">STEP 1</span>
                  <h4>Create Blank Sheet</h4>
                  <p>Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer">sheets.new</a> in Google Drive, name it <strong>Baskk Master Admin</strong>, and click <strong>Extensions &rarr; Apps Script</strong>.</p>
                </div>

                <div className="step-box">
                  <span className="step-badge">STEP 2</span>
                  <h4>Paste Master Script &amp; Deploy</h4>
                  <p>Copy our Master 4-Tab Script below, paste it into Apps Script, click <strong>Deploy &rarr; New deployment &rarr; Web app</strong>, and set <em>Who has access</em> to <strong>Anyone</strong>.</p>
                  <button
                    type="button"
                    className="btn-cms-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(MASTER_GOOGLE_APPS_SCRIPT);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 3000);
                    }}
                  >
                    {copiedScript ? '✓ Master Script Copied!' : 'Copy Master Google Apps Script'}
                  </button>
                </div>

                <div className="step-box">
                  <span className="step-badge">STEP 3</span>
                  <h4>Paste Web App URL</h4>
                  <p>Paste the generated <code>https://script.google.com/macros/s/.../exec</code> URL below and click <strong>Connect &amp; Sync</strong>.</p>
                </div>
              </div>

              <form onSubmit={handleConnectGoogleSheet} className="sheet-connect-bar">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
                <button type="submit" className="btn-cms-primary">
                  Connect &amp; Sync All Data
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          MODAL: REDEEM / EDIT GIFT VOUCHER
      =================================================================== */}
      {redeemingVoucher && (
        <div className="cms-modal-bg" onClick={() => setRedeemingVoucher(null)}>
          <div className="cms-modal" onClick={e => e.stopPropagation()}>
            <h3>Redeem / Update Gift Voucher</h3>
            <p className="muted">
              Code: <strong>{redeemingVoucher.voucherCode}</strong> &bull; Current Balance: <strong>${Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0).toFixed(2)} AUD</strong>
            </p>
            <form onSubmit={handleSaveRedemption} className="cms-modal-form">
              <div className="cms-field">
                <label>Amount to Deduct Today ($ AUD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0)}
                  value={deductAmt}
                  onChange={(e) => setDeductAmt(e.target.value)}
                  required
                />
              </div>
              <div className="cms-field">
                <label>Stripe Payment Verification</label>
                <select value={redeemPayStatus} onChange={(e) => setRedeemPayStatus(e.target.value)}>
                  <option value="Paid in Stripe">✓ Paid &amp; Verified in Stripe</option>
                  <option value="Verify Stripe Payment">Pending Stripe Check</option>
                </select>
              </div>
              <div className="cms-field">
                <label>Table / Staff Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Table 6 Dinner, Redeemed by Manager"
                  value={redeemNote}
                  onChange={(e) => setRedeemNote(e.target.value)}
                />
              </div>
              <div className="cms-modal-btns">
                <button type="button" className="btn-cms-outline" onClick={() => setRedeemingVoucher(null)}>Cancel</button>
                <button type="submit" className="btn-cms-primary">Save Redemption</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ISSUE NEW VOUCHER
      =================================================================== */}
      {showNewVoucherModal && (
        <div className="cms-modal-bg" onClick={() => setShowNewVoucherModal(false)}>
          <div className="cms-modal" onClick={e => e.stopPropagation()}>
            <h3>Issue / Record Gift Voucher</h3>
            <form onSubmit={handleCreateVoucher} className="cms-modal-form">
              <div className="grid-2">
                <div className="cms-field">
                  <label>Voucher Code *</label>
                  <input
                    type="text"
                    required
                    value={newVoucherForm.voucherCode}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, voucherCode: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Amount ($ AUD)</label>
                  <select
                    value={newVoucherForm.originalAmount}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, originalAmount: e.target.value })}
                  >
                    <option value="50">$50 AUD</option>
                    <option value="100">$100 AUD</option>
                    <option value="200">$200 AUD</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="cms-field">
                  <label>Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={newVoucherForm.buyerName}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, buyerName: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    value={newVoucherForm.recipientName}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, recipientName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="cms-field">
                  <label>Buyer Email</label>
                  <input
                    type="email"
                    value={newVoucherForm.buyerEmail}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, buyerEmail: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Recipient Email</label>
                  <input
                    type="email"
                    value={newVoucherForm.recipientEmail}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, recipientEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="cms-field">
                <label>Notes</label>
                <input
                  type="text"
                  value={newVoucherForm.notes}
                  onChange={(e) => setNewVoucherForm({ ...newVoucherForm, notes: e.target.value })}
                />
              </div>
              <div className="cms-modal-btns">
                <button type="button" className="btn-cms-outline" onClick={() => setShowNewVoucherModal(false)}>Cancel</button>
                <button type="submit" className="btn-cms-primary">Issue Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: EDIT / MANAGE ORDER OR ENQUIRY
      =================================================================== */}
      {editingOrder && (
        <div className="cms-modal-bg" onClick={() => setEditingOrder(null)}>
          <div className="cms-modal" onClick={e => e.stopPropagation()}>
            <h3>Manage Order / Enquiry ({editingOrder.orderId})</h3>
            <p className="muted">{editingOrder.customerName} &bull; {editingOrder.phone}</p>
            <form onSubmit={handleSaveOrderEdit} className="cms-modal-form">
              <div className="grid-2">
                <div className="cms-field">
                  <label>Booking / Order Status</label>
                  <select
                    value={editingOrder.status || 'New'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="cms-field">
                  <label>Party Size / Guests</label>
                  <input
                    type="text"
                    value={editingOrder.guests || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, guests: e.target.value })}
                  />
                </div>
              </div>
              <div className="cms-field">
                <label>Event / Booking Date</label>
                <input
                  type="text"
                  value={editingOrder.bookingDate || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, bookingDate: e.target.value })}
                />
              </div>
              <div className="cms-field">
                <label>Internal Staff / Event Notes</label>
                <textarea
                  rows="3"
                  placeholder="Deposit amount, dietary requirements, table allocation..."
                  value={editingOrder.adminNotes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, adminNotes: e.target.value })}
                />
              </div>
              <div className="cms-modal-btns">
                <button type="button" className="btn-cms-outline" onClick={() => setEditingOrder(null)}>Cancel</button>
                <button type="submit" className="btn-cms-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: CREATE MANUAL ORDER / PHONE BOOKING
      =================================================================== */}
      {showNewOrderModal && (
        <div className="cms-modal-bg" onClick={() => setShowNewOrderModal(false)}>
          <div className="cms-modal" onClick={e => e.stopPropagation()}>
            <h3>Log Phone Booking / Group Order</h3>
            <form onSubmit={handleCreateOrder} className="cms-modal-form">
              <div className="grid-2">
                <div className="cms-field">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newOrderForm.phone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="cms-field">
                  <label>Guests / Items</label>
                  <input
                    type="text"
                    value={newOrderForm.guests}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, guests: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={newOrderForm.bookingDate}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, bookingDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="cms-field">
                  <label>Event / Order Type</label>
                  <input
                    type="text"
                    value={newOrderForm.eventType}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventType: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>Status</label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>
              <div className="cms-field">
                <label>Order / Menu Notes</label>
                <textarea
                  rows="2"
                  value={newOrderForm.additionalDetails}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, additionalDetails: e.target.value })}
                />
              </div>
              <div className="cms-modal-btns">
                <button type="button" className="btn-cms-outline" onClick={() => setShowNewOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn-cms-primary">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .baskk-master-admin {
          display: grid;
          grid-template-columns: 270px 1fr;
          min-height: 100vh;
          background: #F5F0E8;
          color: #191919;
          font-family: 'Manrope', 'Inter', sans-serif;
        }

        /* Sidebar */
        .cms-sidebar {
          background: #191919;
          color: #F5F0E8;
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .cms-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(245, 240, 232, 0.12);
          margin-bottom: 22px;
        }

        .cms-brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          background: #FFFFFF;
        }

        .cms-brand-row strong {
          display: block;
          font-size: 0.88rem;
          letter-spacing: 0.14em;
        }

        .cms-brand-row span {
          font-size: 0.72rem;
          color: #B9674B;
          font-weight: 600;
        }

        .cms-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cms-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #CFC6B8;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .cms-nav-btn:hover {
          background: rgba(255, 255, 255, 0.07);
          color: #FFFFFF;
        }

        .cms-nav-btn.active {
          background: #B9674B;
          color: #FFFFFF;
        }

        .nav-badge {
          margin-left: auto;
          font-style: normal;
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.16);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .nav-badge.alert {
          background: #E53935;
          color: #FFFFFF;
        }

        .dot-status {
          margin-left: auto;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #757575;
        }

        .dot-status.online {
          background: #4CAF50;
        }

        .cms-sidebar-Portals {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(245, 240, 232, 0.12);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .portal-heading {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #8E8477;
        }

        .cms-sidebar-Portals a {
          color: #CFC6B8;
          text-decoration: none;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cms-sidebar-Portals a:hover {
          color: #B9674B;
        }

        .cms-sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-view-live {
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #F5F0E8;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-logout {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #CFC6B8;
          padding: 9px;
          border-radius: 10px;
          font-size: 0.78rem;
          cursor: pointer;
        }

        /* Workspace */
        .cms-workspace {
          padding: 32px 40px 64px 40px;
          overflow-x: hidden;
        }

        .cms-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 24px;
          margin-bottom: 28px;
          border-bottom: 1px solid #E5DCCE;
        }

        .topbar-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #B9674B;
        }

        .cms-topbar h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 500;
          margin: 4px 0 0 0;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sheet-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid #D8CBB8;
          background: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .sheet-pill .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D97706;
        }

        .sheet-pill.connected .pill-dot {
          background: #16A34A;
        }

        .cms-toast-banner {
          background: #191919;
          color: #F5F0E8;
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 22px;
          font-size: 0.86rem;
          font-weight: 600;
          border-left: 4px solid #B9674B;
        }

        /* KPIs */
        .cms-kpi-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .cms-kpi-box {
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 18px;
          padding: 22px;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .cms-kpi-box:hover {
          transform: translateY(-3px);
          border-color: #B9674B;
        }

        .cms-kpi-box.dark {
          background: #191919;
          color: #F5F0E8;
        }

        .cms-kpi-box span {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.75;
        }

        .cms-kpi-box strong {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          margin: 6px 0;
        }

        .cms-kpi-box em {
          font-style: normal;
          font-size: 0.76rem;
          opacity: 0.75;
        }

        .overview-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .cms-panel {
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 18px;
          padding: 26px;
        }

        .cms-panel.no-pad {
          padding: 0;
          overflow: hidden;
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .panel-head h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
          margin: 0;
        }

        .text-btn {
          background: none;
          border: none;
          color: #B9674B;
          font-weight: 700;
          cursor: pointer;
        }

        .mini-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #F3ECE1;
          font-size: 0.85rem;
        }

        .mini-row strong {
          display: block;
        }

        .right-align {
          text-align: right;
        }

        /* Action Bar & Tables */
        .cms-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
        }

        .cms-search {
          flex: 1;
          min-width: 250px;
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 999px;
          padding: 0 16px;
          display: flex;
          align-items: center;
        }

        .cms-search input {
          width: 100%;
          border: none;
          padding: 11px 10px;
          outline: none;
          background: transparent;
          font-size: 0.88rem;
        }

        .cms-filters, .cms-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-btn {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid #E5DCCE;
          background: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .chip-btn.active {
          background: #191919;
          color: #F5F0E8;
          border-color: #191919;
        }

        .btn-cms-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #B9674B;
          color: #FFFFFF;
          border: none;
          padding: 11px 20px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cms-primary:hover {
          background: #9E5238;
        }

        .btn-cms-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          color: #191919;
          border: 1px solid #D8CBB8;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .cms-table-wrap {
          overflow-x: auto;
        }

        .cms-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }

        .cms-table th {
          text-align: left;
          padding: 14px 16px;
          background: #FAF7F2;
          border-bottom: 1px solid #E5DCCE;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #5E564D;
        }

        .cms-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #F3ECE1;
          vertical-align: middle;
        }

        .mono-tag {
          font-family: monospace;
          font-weight: 800;
          font-size: 0.8rem;
          background: #F5F0E8;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #E5DCCE;
          display: inline-block;
        }

        .muted { color: #756B60; }
        .block { display: block; }
        .terracotta-txt { color: #B9674B; }
        .note-col { max-width: 220px; font-size: 0.8rem; }

        .st-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          background: #E8F5E9;
          color: #1B5E20;
        }
        .st-badge.partially-redeemed, .st-badge.order-new { background: #FFF3E0; color: #E65100; }
        .st-badge.fully-redeemed, .st-badge.order-cancelled { background: #ECEFF1; color: #546E7A; }
        .st-badge.order-confirmed, .st-badge.order-deposit-paid { background: #E3F2FD; color: #0D47A1; }

        .pay-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .pay-tag.ok { background: #E8F5E9; color: #1B5E20; }
        .pay-tag.warn { background: #FDF2EF; color: #9E3A22; }

        .row-btns {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-sm-dark {
          background: #191919;
          color: #FFFFFF;
          border: none;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-sm-light {
          background: #F5F0E8;
          color: #191919;
          border: 1px solid #E5DCCE;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
        }

        .btn-sm-del {
          background: #FDF2EF;
          color: #9E3A22;
          border: none;
          padding: 5px 9px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .empty-box {
          padding: 48px 24px;
          text-align: center;
          color: #5E564D;
        }

        /* Gallery Manager */
        .gallery-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: center;
        }

        .file-drop-zone {
          border: 2px dashed #D8CBB8;
          background: #FAF7F2;
          border-radius: 16px;
          min-height: 190px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          cursor: pointer;
        }

        .file-drop-zone span {
          font-size: 0.78rem;
          color: #756B60;
        }

        .upload-preview-thumb {
          max-height: 165px;
          border-radius: 10px;
          object-fit: cover;
        }

        .gallery-meta-inputs {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 16px;
        }

        .admin-photo-card {
          border: 1px solid #E5DCCE;
          border-radius: 14px;
          overflow: hidden;
          background: #FAF7F2;
        }

        .admin-photo-card.is-hidden {
          opacity: 0.45;
        }

        .admin-photo-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }

        .photo-card-bar {
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .photo-card-bar span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Google Sheets Tab */
        .sheet-steps-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin: 22px 0;
        }

        .step-box {
          background: #FAF7F2;
          border: 1px solid #E5DCCE;
          border-radius: 14px;
          padding: 20px;
        }

        .step-badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #B9674B;
        }

        .step-box h4 {
          margin: 6px 0 8px 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
        }

        .step-box p {
          font-size: 0.84rem;
          line-height: 1.55;
          color: #5E564D;
          margin: 0 0 12px 0;
        }

        .sheet-connect-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sheet-connect-bar input {
          flex: 1;
          min-width: 260px;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid #D8CBB8;
          background: #FAF7F2;
        }

        /* Modals & Fields */
        .cms-modal-bg {
          position: fixed;
          inset: 0;
          background: rgba(25, 25, 25, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 3000;
        }

        .cms-modal {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 30px;
          width: 100%;
          max-width: 520px;
          border: 1px solid #E5DCCE;
        }

        .cms-modal h3 {
          font-family: 'Playfair Display', Georgia, serif;
          margin: 0 0 6px 0;
          font-size: 1.5rem;
        }

        .cms-modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cms-field label {
          display: block;
          font-size: 0.76rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .cms-field input,
        .cms-field select,
        .cms-field textarea {
          width: 100%;
          padding: 11px 13px;
          border-radius: 10px;
          border: 1px solid #D8CBB8;
          background: #FAF7F2;
          font-family: inherit;
          font-size: 0.88rem;
        }

        .cms-modal-btns {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        @media (max-width: 1024px) {
          .baskk-master-admin {
            grid-template-columns: 1fr;
          }
          .cms-sidebar {
            position: static;
            height: auto;
          }
          .cms-kpi-row {
            grid-template-columns: 1fr 1fr;
          }
          .overview-two-col,
          .gallery-upload-grid,
          .sheet-steps-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .cms-workspace {
            padding: 22px 16px;
          }
          .cms-kpi-row,
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
