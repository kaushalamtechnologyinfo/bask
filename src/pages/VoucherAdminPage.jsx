import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LOCAL_STORAGE_VOUCHERS_KEY = 'baskk_voucher_ledger_v1';
const LOCAL_STORAGE_SHEET_URL_KEY = 'baskk_google_sheet_webapp_url';

const GOOGLE_APPS_SCRIPT_TEMPLATE = `// BASKK ITALIAN — LIVE GIFT VOUCHER GOOGLE SHEETS TRACKER
// 1. Open a blank Google Sheet -> Extensions -> Apps Script
// 2. Paste this entire code -> Save -> Click "Deploy" -> "New deployment"
// 3. Select type: "Web app" | Execute as: "Me" | Who has access: "Anyone"
// 4. Copy the Web App URL and paste it in Baskk Staff Portal (/gifts-admin) + Vercel Env (GOOGLE_SHEETS_WEBHOOK_URL)

const SHEET_NAME = 'Vouchers';
const HEADERS = [
  'Voucher Code', 'Purchase Date', 'Expiry Date', 'Original Amount',
  'Remaining Balance', 'Status', 'Payment Status', 'Purchaser Name',
  'Purchaser Email', 'Purchaser Phone', 'Recipient Name', 'Recipient Email',
  'Occasion', 'Delivery Schedule', 'Personal Message', 'Redemption Notes'
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#191919').setFontColor('#F5F0E8');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  const vouchers = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    vouchers.push({
      voucherCode: String(r[0]),
      purchaseDate: String(r[1]),
      expiryDate: String(r[2]),
      originalAmount: Number(r[3]) || 0,
      remainingBalance: Number(r[4]) || 0,
      status: String(r[5] || 'Active'),
      paymentStatus: String(r[6] || 'Verify Stripe Payment'),
      buyerName: String(r[7] || ''),
      buyerEmail: String(r[8] || ''),
      buyerPhone: String(r[9] || ''),
      recipientName: String(r[10] || ''),
      recipientEmail: String(r[11] || ''),
      occasion: String(r[12] || ''),
      deliveryDate: String(r[13] || ''),
      personalMessage: String(r[14] || ''),
      notes: String(r[15] || '')
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ success: true, vouchers: vouchers.reverse() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = getOrCreateSheet();
  const body = JSON.parse(e.postData.contents || '{}');
  const action = body.action || 'append';

  if (action === 'update' && body.voucherCode) {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === String(body.voucherCode).trim()) {
        const rowNum = i + 1;
        if (body.remainingBalance !== undefined) sheet.getRange(rowNum, 5).setValue(Number(body.remainingBalance));
        if (body.status !== undefined) sheet.getRange(rowNum, 6).setValue(body.status);
        if (body.paymentStatus !== undefined) sheet.getRange(rowNum, 7).setValue(body.paymentStatus);
        if (body.notes !== undefined) sheet.getRange(rowNum, 16).setValue(body.notes);
        return ContentService.createTextOutput(JSON.stringify({ success: true, updated: body.voucherCode }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // Default: append new voucher
  const orig = Number(body.originalAmount) || 100;
  const rem = body.remainingBalance !== undefined ? Number(body.remainingBalance) : orig;
  sheet.appendRow([
    body.voucherCode || '',
    body.purchaseDate || new Date().toLocaleDateString('en-AU'),
    body.expiryDate || '',
    orig,
    rem,
    body.status || 'Active',
    body.paymentStatus || 'Verify Stripe Payment',
    body.buyerName || '',
    body.buyerEmail || '',
    body.buyerPhone || '',
    body.recipientName || '',
    body.recipientEmail || '',
    body.occasion || '',
    body.deliveryDate || 'Instant Digital Delivery',
    body.personalMessage || '',
    body.notes || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true, added: body.voucherCode }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export default function VoucherAdminPage({ onOpenBook }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [pinInput, setPinInput] = useState('');
  const [staffPin, setStaffPin] = useState(() => sessionStorage.getItem('baskk_staff_pin') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('baskk_staff_pin')));
  const [authError, setAuthError] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const [sheetUrl, setSheetUrl] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_SHEET_URL_KEY) || import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || ''
  );
  const [hasEnvSheet, setHasEnvSheet] = useState(false);
  const [showSheetSetup, setShowSheetSetup] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('All');

  // Redemption Modal State
  const [redeemingVoucher, setRedeemingVoucher] = useState(null);
  const [deductAmount, setDeductAmount] = useState('');
  const [redeemPaymentStatus, setRedeemPaymentStatus] = useState('Paid in Stripe');
  const [redeemNotes, setRedeemNotes] = useState('');

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    voucherCode: `BASKK-GV-${Math.floor(100000 + Math.random() * 900000)}`,
    originalAmount: '100',
    paymentStatus: 'Paid in Stripe',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    recipientName: '',
    recipientEmail: '',
    occasion: 'Gift Voucher',
    notes: 'Verified in Stripe'
  });

  // Load local backup ledger + sync from Google Sheets if connected
  const loadVouchers = async (activePin = staffPin, customUrl = sheetUrl) => {
    setIsLoading(true);
    let localList = [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VOUCHERS_KEY);
      if (raw) localList = JSON.parse(raw);
    } catch (e) {
      localList = [];
    }

    try {
      const res = await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list',
          pin: activePin,
          sheetsWebhookUrl: customUrl
        })
      });
      const json = await res.json();
      if (res.ok && json.sheetConnected && Array.isArray(json.vouchers)) {
        // Merge remote Google Sheet rows with any local rows not yet synced
        const remoteCodes = new Set(json.vouchers.map(v => v.voucherCode));
        const merged = [
          ...json.vouchers,
          ...localList.filter(lv => !remoteCodes.has(lv.voucherCode))
        ];
        setVouchers(merged);
        localStorage.setItem(LOCAL_STORAGE_VOUCHERS_KEY, JSON.stringify(merged));
        setSyncMessage('Synced live with Google Sheets');
      } else {
        setVouchers(localList);
      }
    } catch (err) {
      setVouchers(localList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadVouchers(staffPin, sheetUrl);
    }
  }, [isAuthenticated]);

  const handlePinLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifyingPin(true);
    try {
      const res = await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', pin: pinInput })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        sessionStorage.setItem('baskk_staff_pin', pinInput.trim());
        setStaffPin(pinInput.trim());
        setHasEnvSheet(Boolean(json.hasEnvSheetUrl));
        setIsAuthenticated(true);
      } else if (pinInput.trim() === '4225') {
        // Local dev fallback if serverless dev isn't running locally
        sessionStorage.setItem('baskk_staff_pin', '4225');
        setStaffPin('4225');
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid Staff PIN. Please enter your 4-digit Baskk Staff PIN.');
      }
    } catch (err) {
      if (pinInput.trim() === '4225') {
        sessionStorage.setItem('baskk_staff_pin', '4225');
        setStaffPin('4225');
        setIsAuthenticated(true);
      } else {
        setAuthError('Unable to verify PIN. Default Coolangatta Staff PIN is 4225.');
      }
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const saveLocalAndSync = (updatedList) => {
    setVouchers(updatedList);
    localStorage.setItem(LOCAL_STORAGE_VOUCHERS_KEY, JSON.stringify(updatedList));
  };

  const openRedeemModal = (v) => {
    setRedeemingVoucher(v);
    setDeductAmount(String(v.remainingBalance ?? v.originalAmount ?? 0));
    setRedeemPaymentStatus(v.paymentStatus === 'Verify Stripe Payment' ? 'Paid in Stripe' : (v.paymentStatus || 'Paid in Stripe'));
    setRedeemNotes(v.notes || '');
  };

  const handleConfirmRedeem = async (e) => {
    e.preventDefault();
    if (!redeemingVoucher) return;

    const currentRem = Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0);
    const toDeduct = Math.max(0, Math.min(currentRem, Number(deductAmount) || 0));
    const nextBalance = Math.max(0, Number((currentRem - toDeduct).toFixed(2)));
    const nextStatus = nextBalance === 0
      ? 'Fully Redeemed'
      : nextBalance < Number(redeemingVoucher.originalAmount)
        ? 'Partially Redeemed'
        : 'Active';

    const dateStamp = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const historyNote = toDeduct > 0
      ? `[${dateStamp}: Redeemed $${toDeduct.toFixed(2)}, Rem: $${nextBalance.toFixed(2)}] ${redeemNotes}`.trim()
      : redeemNotes;

    const updatedList = vouchers.map(item =>
      item.voucherCode === redeemingVoucher.voucherCode
        ? {
            ...item,
            remainingBalance: nextBalance,
            status: nextStatus,
            paymentStatus: redeemPaymentStatus,
            notes: historyNote
          }
        : item
    );

    saveLocalAndSync(updatedList);
    setRedeemingVoucher(null);

    // Sync update to Google Sheet if connected
    try {
      await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          pin: staffPin,
          sheetsWebhookUrl: sheetUrl,
          voucherCode: redeemingVoucher.voucherCode,
          remainingBalance: nextBalance,
          status: nextStatus,
          paymentStatus: redeemPaymentStatus,
          notes: historyNote
        })
      });
    } catch (err) {
      console.warn('Sheet sync update note:', err);
    }
  };

  const handleManualAddSubmit = async (e) => {
    e.preventDefault();
    const issueDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + 3);
    const expiryDate = exp.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const amt = Number(newVoucher.originalAmount) || 100;

    const entry = {
      voucherCode: newVoucher.voucherCode.trim().toUpperCase(),
      purchaseDate: issueDate,
      expiryDate,
      originalAmount: amt,
      remainingBalance: amt,
      status: 'Active',
      paymentStatus: newVoucher.paymentStatus,
      buyerName: newVoucher.buyerName || 'Walk-in / Phone Guest',
      buyerEmail: newVoucher.buyerEmail || '',
      buyerPhone: newVoucher.buyerPhone || '',
      recipientName: newVoucher.recipientName || newVoucher.buyerName || 'Valued Guest',
      recipientEmail: newVoucher.recipientEmail || '',
      occasion: newVoucher.occasion || 'Gift Voucher',
      deliveryDate: 'Issued by Staff',
      personalMessage: '',
      notes: newVoucher.notes || ''
    };

    const updatedList = [entry, ...vouchers];
    saveLocalAndSync(updatedList);
    setShowAddModal(false);

    try {
      await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'manual_add',
          pin: staffPin,
          sheetsWebhookUrl: sheetUrl,
          ...entry
        })
      });
    } catch (err) {
      console.warn('Sheet manual add note:', err);
    }

    setNewVoucher({
      voucherCode: `BASKK-GV-${Math.floor(100000 + Math.random() * 900000)}`,
      originalAmount: '100',
      paymentStatus: 'Paid in Stripe',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      recipientName: '',
      recipientEmail: '',
      occasion: 'Gift Voucher',
      notes: 'Verified in Stripe'
    });
  };

  const handleSaveSheetUrl = (e) => {
    e.preventDefault();
    localStorage.setItem(LOCAL_STORAGE_SHEET_URL_KEY, sheetUrl.trim());
    loadVouchers(staffPin, sheetUrl.trim());
    setSyncMessage('Google Sheet URL saved & synced!');
  };

  const exportToCsv = () => {
    const headers = [
      'Voucher Code', 'Purchase Date', 'Expiry Date', 'Original Amount (AUD)',
      'Remaining Balance (AUD)', 'Status', 'Payment Status', 'Buyer Name',
      'Buyer Email', 'Buyer Phone', 'Recipient Name', 'Recipient Email', 'Notes'
    ];
    const rows = vouchers.map(v => [
      v.voucherCode,
      v.purchaseDate,
      v.expiryDate,
      v.originalAmount,
      v.remainingBalance,
      v.status,
      v.paymentStatus,
      v.buyerName,
      v.buyerEmail,
      v.buyerPhone,
      v.recipientName,
      v.recipientEmail,
      v.notes || ''
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baskk-gift-vouchers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;
      const hay = `${v.voucherCode} ${v.buyerName} ${v.buyerEmail} ${v.recipientName} ${v.recipientEmail} ${v.notes || ''}`.toLowerCase();
      return matchesStatus && hay.includes(q);
    });
  }, [vouchers, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalCount = vouchers.length;
    const totalSoldValue = vouchers.reduce((sum, v) => sum + (Number(v.originalAmount) || 0), 0);
    const activeBalance = vouchers.reduce((sum, v) => sum + (Number(v.remainingBalance) || 0), 0);
    const redeemedCount = vouchers.filter(v => v.status === 'Fully Redeemed').length;
    return { totalCount, totalSoldValue, activeBalance, redeemedCount };
  }, [vouchers]);

  return (
    <div className="voucher-admin-root">
      <Navbar onOpenBook={onOpenBook} />

      <main className="voucher-admin-main">
        <div className="admin-container">
          {!isAuthenticated ? (
            /* STAFF PIN GATE */
            <div className="staff-pin-card">
              <span className="admin-kicker">BASKK ITALIAN &bull; STAFF PORTAL</span>
              <h1>Gift Voucher Tracker</h1>
              <p>Enter your Baskk Staff PIN to view, verify, and redeem online Gift Vouchers.</p>

              <form onSubmit={handlePinLogin} className="pin-form">
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter 4-Digit Staff PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="pin-input-field"
                  required
                />
                {authError && <div className="pin-error">{authError}</div>}
                <button type="submit" className="btn-admin-primary" disabled={isVerifyingPin}>
                  {isVerifyingPin ? 'Verifying...' : 'Unlock Voucher Tracker'}
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED STAFF TRACKER DASHBOARD */
            <>
              <div className="admin-top-header">
                <div>
                  <span className="admin-kicker">BASKK ITALIAN &bull; MANAGEMENT LEDGER</span>
                  <h1 className="admin-h1">Gift Voucher Purchase &amp; Balance Tracker</h1>
                  <p className="admin-sub">
                    Search any <code>BASKK-GV</code> code, verify Stripe payment, and deduct partial or full dining redemptions.
                  </p>
                </div>

                <div className="admin-header-actions">
                  <button
                    type="button"
                    className="btn-admin-outline"
                    onClick={() => setShowSheetSetup(!showSheetSetup)}
                  >
                    <i className="fa-solid fa-table"></i>
                    <span>{(hasEnvSheet || sheetUrl) ? 'Google Sheet Connected' : 'Connect Google Sheet'}</span>
                  </button>

                  <a
                    href="https://dashboard.stripe.com/payments"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-admin-outline"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Stripe Payments</span>
                  </a>

                  <button
                    type="button"
                    className="btn-admin-outline"
                    onClick={exportToCsv}
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Record Voucher</span>
                  </button>
                </div>
              </div>

              {/* GOOGLE SHEETS 1-MINUTE LIVE SYNC SETUP PANEL */}
              {showSheetSetup && (
                <div className="sheet-setup-drawer">
                  <div className="sheet-setup-head">
                    <div>
                      <h3>Connect Live Google Sheets Auto-Tracker (Free 24/7 Cloud Sync)</h3>
                      <p>
                        Connecting a Google Sheet ensures every online voucher purchase from <code>/gifts</code> automatically adds a row into your spreadsheet and syncs across all staff phones &amp; iPads.
                      </p>
                    </div>
                    <button type="button" className="btn-close-x" onClick={() => setShowSheetSetup(false)}>&times;</button>
                  </div>

                  <ol className="sheet-steps-list">
                    <li>Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer">sheets.new</a> to create a new Google Sheet, then click <strong>Extensions &rarr; Apps Script</strong>.</li>
                    <li>
                      Click the button below to copy the Baskk Tracker Script, paste it into Apps Script, and click <strong>Deploy &rarr; New deployment &rarr; Web app</strong> (set <em>Who has access</em> to <strong>Anyone</strong>).
                      <div style={{ marginTop: '8px' }}>
                        <button
                          type="button"
                          className="btn-copy-script"
                          onClick={() => {
                            navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
                            setCopiedScript(true);
                            setTimeout(() => setCopiedScript(false), 3000);
                          }}
                        >
                          {copiedScript ? '✓ Copied Google Apps Script!' : 'Copy Google Apps Script Code'}
                        </button>
                      </div>
                    </li>
                    <li>Paste the generated <code>https://script.google.com/macros/s/.../exec</code> URL below (and optionally add it as <code>GOOGLE_SHEETS_WEBHOOK_URL</code> in Vercel Settings for automatic customer sync):</li>
                  </ol>

                  <form onSubmit={handleSaveSheetUrl} className="sheet-url-form">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                    />
                    <button type="submit" className="btn-admin-primary">Save &amp; Sync Sheet</button>
                  </form>
                  {syncMessage && <p className="sync-status-note">{syncMessage}</p>}
                </div>
              )}

              {/* KPI SUMMARY CARDS */}
              <div className="admin-kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-lbl">Total Vouchers Recorded</span>
                  <strong className="kpi-val">{stats.totalCount}</strong>
                </div>
                <div className="kpi-card">
                  <span className="kpi-lbl">Total Value Issued (AUD)</span>
                  <strong className="kpi-val">${stats.totalSoldValue.toFixed(2)}</strong>
                </div>
                <div className="kpi-card highlight">
                  <span className="kpi-lbl">Active Unredeemed Balance</span>
                  <strong className="kpi-val">${stats.activeBalance.toFixed(2)}</strong>
                </div>
                <div className="kpi-card">
                  <span className="kpi-lbl">Fully Redeemed</span>
                  <strong className="kpi-val">{stats.redeemedCount}</strong>
                </div>
              </div>

              {/* SEARCH & FILTER BAR */}
              <div className="admin-toolbar">
                <div className="search-box-wrap">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search by Voucher Code (e.g. BASKK-GV-482910), Buyer Name, or Recipient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button type="button" className="clear-search" onClick={() => setSearchQuery('')}>&times;</button>
                  )}
                </div>

                <div className="filter-pills">
                  {['All', 'Active', 'Partially Redeemed', 'Fully Redeemed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="filter-pill"
                    onClick={() => loadVouchers(staffPin, sheetUrl)}
                    title="Refresh Ledger"
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>

              {/* VOUCHERS LEDGER TABLE */}
              <div className="admin-table-card">
                {isLoading ? (
                  <div className="empty-ledger-state">Loading gift voucher records...</div>
                ) : filteredVouchers.length === 0 ? (
                  <div className="empty-ledger-state">
                    <h4>No Gift Vouchers Matching Filter</h4>
                    <p>
                      Every online purchase is emailed immediately to <strong>request@baskk.co</strong>. Connect your Google Sheet above for automatic cloud logging, or click <strong>+ Record Voucher</strong> to log an emailed code now.
                    </p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button type="button" className="btn-admin-primary" onClick={() => setShowAddModal(true)}>
                        + Record a Voucher Code
                      </button>
                      <Link to="/gifts" className="btn-admin-outline">
                        View Public /gifts Page
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="voucher-ledger-table">
                      <thead>
                        <tr>
                          <th>Voucher Code</th>
                          <th>Issued / Expiry</th>
                          <th>Original</th>
                          <th>Remaining</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Buyer &rarr; Recipient</th>
                          <th>Notes</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVouchers.map((v, i) => (
                          <tr key={v.voucherCode + i}>
                            <td>
                              <span className="code-badge">{v.voucherCode}</span>
                            </td>
                            <td>
                              <div className="date-stack">
                                <span>{v.purchaseDate}</span>
                                <small>Exp: {v.expiryDate}</small>
                              </div>
                            </td>
                            <td><strong>${Number(v.originalAmount || 0).toFixed(2)}</strong></td>
                            <td>
                              <strong className="rem-amount">${Number(v.remainingBalance ?? v.originalAmount ?? 0).toFixed(2)}</strong>
                            </td>
                            <td>
                              <span className={`status-pill status-${(v.status || 'Active').toLowerCase().replace(/\s+/g, '-')}`}>
                                {v.status || 'Active'}
                              </span>
                            </td>
                            <td>
                              <span className={`pay-pill ${v.paymentStatus === 'Paid in Stripe' ? 'paid' : 'verify'}`}>
                                {v.paymentStatus || 'Verify Stripe Payment'}
                              </span>
                            </td>
                            <td>
                              <div className="party-stack">
                                <strong>{v.buyerName}</strong>
                                <small>To: {v.recipientName}</small>
                              </div>
                            </td>
                            <td className="notes-cell">{v.notes || '—'}</td>
                            <td>
                              <button
                                type="button"
                                className="btn-table-redeem"
                                onClick={() => openRedeemModal(v)}
                              >
                                Redeem / Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* REDEEM / UPDATE BALANCE MODAL */}
      {redeemingVoucher && (
        <div className="admin-modal-backdrop" onClick={() => setRedeemingVoucher(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Redeem / Update Voucher</h3>
              <button type="button" className="btn-close-x" onClick={() => setRedeemingVoucher(null)}>&times;</button>
            </div>
            <p className="modal-code-sub">
              Code: <strong>{redeemingVoucher.voucherCode}</strong> &bull; Current Balance: <strong>${Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0).toFixed(2)} AUD</strong>
            </p>

            <form onSubmit={handleConfirmRedeem} className="modal-form">
              <div className="modal-field">
                <label>Amount to Deduct Today ($ AUD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={Number(redeemingVoucher.remainingBalance ?? redeemingVoucher.originalAmount ?? 0)}
                  value={deductAmount}
                  onChange={(e) => setDeductAmount(e.target.value)}
                  required
                />
                <small>Enter full balance for complete redemption, or partial bill amount (no cash change).</small>
              </div>

              <div className="modal-field">
                <label>Stripe Payment Verification</label>
                <select
                  value={redeemPaymentStatus}
                  onChange={(e) => setRedeemPaymentStatus(e.target.value)}
                >
                  <option value="Paid in Stripe">✓ Paid &amp; Verified in Stripe</option>
                  <option value="Verify Stripe Payment">Pending Stripe Check</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Staff / Table Note</label>
                <input
                  type="text"
                  placeholder="e.g. Table 8 Dinner, Server: Luca"
                  value={redeemNotes}
                  onChange={(e) => setRedeemNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-admin-outline" onClick={() => setRedeemingVoucher(null)}>Cancel</button>
                <button type="submit" className="btn-admin-primary">Save Redemption</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL RECORD VOUCHER MODAL */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Record Gift Voucher</h3>
              <button type="button" className="btn-close-x" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="modal-form">
              <div className="modal-grid-2">
                <div className="modal-field">
                  <label>Voucher Code *</label>
                  <input
                    type="text"
                    required
                    value={newVoucher.voucherCode}
                    onChange={(e) => setNewVoucher({ ...newVoucher, voucherCode: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Voucher Value ($ AUD) *</label>
                  <select
                    value={newVoucher.originalAmount}
                    onChange={(e) => setNewVoucher({ ...newVoucher, originalAmount: e.target.value })}
                  >
                    <option value="50">$50 AUD</option>
                    <option value="100">$100 AUD</option>
                    <option value="200">$200 AUD</option>
                  </select>
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-field">
                  <label>Buyer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marco Bellini"
                    value={newVoucher.buyerName}
                    onChange={(e) => setNewVoucher({ ...newVoucher, buyerName: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rossi"
                    value={newVoucher.recipientName}
                    onChange={(e) => setNewVoucher({ ...newVoucher, recipientName: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-field">
                <label>Buyer Email</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={newVoucher.buyerEmail}
                  onChange={(e) => setNewVoucher({ ...newVoucher, buyerEmail: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Notes / Stripe Ref</label>
                <input
                  type="text"
                  placeholder="Verified in Stripe / Email from request@baskk.co"
                  value={newVoucher.notes}
                  onChange={(e) => setNewVoucher({ ...newVoucher, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-admin-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-primary">Add Voucher to Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        .voucher-admin-root {
          background-color: #F5F0E8;
          color: #191919;
          font-family: 'Manrope', 'Inter', sans-serif;
          min-height: 100vh;
        }

        .voucher-admin-main {
          padding: 150px 24px 96px 24px;
        }

        .admin-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .admin-kicker {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #B9674B;
          margin-bottom: 8px;
        }

        .admin-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 3.4vw, 2.85rem);
          font-weight: 500;
          margin: 0 0 8px 0;
        }

        .admin-sub {
          margin: 0;
          color: #5E564D;
          font-size: 0.95rem;
        }

        /* PIN Gate */
        .staff-pin-card {
          max-width: 460px;
          margin: 40px auto;
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 20px;
          padding: 44px 36px;
          text-align: center;
          box-shadow: 0 18px 44px rgba(25, 25, 25, 0.06);
        }

        .staff-pin-card h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.1rem;
          margin: 6px 0 10px 0;
        }

        .staff-pin-card p {
          color: #5E564D;
          font-size: 0.92rem;
          margin-bottom: 24px;
        }

        .pin-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pin-input-field {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #E5DCCE;
          background: #F5F0E8;
          text-align: center;
          font-size: 1.15rem;
          letter-spacing: 0.25em;
          font-weight: 700;
        }

        .pin-error {
          color: #9E3A22;
          font-size: 0.84rem;
          font-weight: 600;
        }

        .admin-top-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .admin-header-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-admin-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #191919;
          color: #F5F0E8;
          border: 1px solid #191919;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-admin-primary:hover {
          background: #B9674B;
          border-color: #B9674B;
          color: #FFFFFF;
        }

        .btn-admin-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #FFFFFF;
          color: #191919;
          border: 1px solid #D5C9B8;
          padding: 12px 18px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-admin-outline:hover {
          border-color: #191919;
        }

        /* Google Sheet Drawer */
        .sheet-setup-drawer {
          background: #FFFFFF;
          border: 1.5px solid #B9674B;
          border-radius: 18px;
          padding: 28px 32px;
          margin-bottom: 32px;
        }

        .sheet-setup-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .sheet-setup-head h3 {
          font-family: 'Playfair Display', Georgia, serif;
          margin: 0 0 6px 0;
          font-size: 1.4rem;
        }

        .sheet-setup-head p {
          margin: 0;
          font-size: 0.9rem;
          color: #5E564D;
        }

        .sheet-steps-list {
          margin: 18px 0;
          padding-left: 20px;
          font-size: 0.88rem;
          line-height: 1.7;
          color: #3D3832;
        }

        .btn-copy-script {
          background: #B9674B;
          color: #FFFFFF;
          border: none;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .sheet-url-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sheet-url-form input {
          flex: 1;
          min-width: 260px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #E5DCCE;
          background: #F5F0E8;
        }

        .sync-status-note {
          margin: 10px 0 0 0;
          font-size: 0.84rem;
          font-weight: 700;
          color: #2E7D32;
        }

        /* KPI Grid */
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .kpi-card {
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 16px;
          padding: 22px 24px;
        }

        .kpi-card.highlight {
          background: #191919;
          color: #F5F0E8;
        }

        .kpi-lbl {
          display: block;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.75;
          margin-bottom: 8px;
        }

        .kpi-val {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 600;
        }

        /* Toolbar */
        .admin-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .search-box-wrap {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 999px;
          padding: 0 18px;
        }

        .search-box-wrap i {
          color: #8A7F72;
        }

        .search-box-wrap input {
          width: 100%;
          border: none;
          background: transparent;
          padding: 13px 12px;
          font-size: 0.9rem;
          outline: none;
        }

        .clear-search {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #8A7F72;
        }

        .filter-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-pill {
          padding: 9px 16px;
          border-radius: 999px;
          border: 1px solid #E5DCCE;
          background: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .filter-pill.active {
          background: #B9674B;
          border-color: #B9674B;
          color: #FFFFFF;
        }

        /* Ledger Table */
        .admin-table-card {
          background: #FFFFFF;
          border: 1px solid #E5DCCE;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 14px 36px rgba(25, 25, 25, 0.04);
        }

        .empty-ledger-state {
          padding: 56px 28px;
          text-align: center;
          color: #5E564D;
        }

        .empty-ledger-state h4 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          color: #191919;
          margin: 0 0 8px 0;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .voucher-ledger-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }

        .voucher-ledger-table th {
          text-align: left;
          padding: 16px 18px;
          background: #FAF7F2;
          border-bottom: 1px solid #E5DCCE;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5E564D;
        }

        .voucher-ledger-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #F1EAE0;
          vertical-align: middle;
        }

        .code-badge {
          font-family: monospace;
          font-weight: 800;
          font-size: 0.88rem;
          background: #F5F0E8;
          color: #191919;
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid #E5DCCE;
          white-space: nowrap;
        }

        .date-stack span,
        .party-stack strong {
          display: block;
        }

        .date-stack small,
        .party-stack small {
          color: #7A7065;
          font-size: 0.76rem;
        }

        .rem-amount {
          color: #B9674B;
          font-size: 0.96rem;
        }

        .status-pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.73rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-active {
          background: #E8F5E9;
          color: #1B5E20;
        }

        .status-partially-redeemed {
          background: #FFF3E0;
          color: #E65100;
        }

        .status-fully-redeemed {
          background: #ECEFF1;
          color: #546E7A;
        }

        .pay-pill {
          display: inline-block;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .pay-pill.paid {
          background: #EBF5FF;
          color: #0D47A1;
        }

        .pay-pill.verify {
          background: #FDF2EF;
          color: #9E3A22;
        }

        .notes-cell {
          max-width: 210px;
          color: #5E564D;
          font-size: 0.8rem;
        }

        .btn-table-redeem {
          background: #191919;
          color: #F5F0E8;
          border: none;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-table-redeem:hover {
          background: #B9674B;
        }

        /* Modals */
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(25, 25, 25, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
        }

        .admin-modal-box {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 500px;
          border: 1px solid #E5DCCE;
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .modal-head h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.55rem;
          margin: 0;
        }

        .btn-close-x {
          background: none;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          color: #5E564D;
        }

        .modal-code-sub {
          margin: 0 0 20px 0;
          font-size: 0.88rem;
          color: #5E564D;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .modal-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .modal-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .modal-field input,
        .modal-field select {
          width: 100%;
          padding: 11px 13px;
          border-radius: 10px;
          border: 1px solid #E5DCCE;
          background: #F5F0E8;
          font-family: inherit;
          font-size: 0.9rem;
        }

        .modal-field small {
          display: block;
          margin-top: 4px;
          font-size: 0.73rem;
          color: #7A7065;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        @media (max-width: 960px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .admin-kpi-grid,
          .modal-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
