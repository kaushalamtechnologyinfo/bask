// Shared CMS & Google Sheets Cloud Sync Store for Baskk Italian
// Supports:
// 1. Gift Vouchers (Purchases, Stripe verification, Partial/Full Redemptions)
// 2. Orders & Booking Enquiries (Functions, Group Dining, Contact Enquiries, Pickup Orders)
// 3. Live Website Gallery (Upload photos, captions, feature layout, show/hide)
// 4. Google Sheets Multi-Tab Cloud Database Sync + /tmp fast cache
import fs from 'fs';
import path from 'path';
import os from 'os';

const STORE_FILE = path.join(os.tmpdir(), 'baskk-master-cms-v2.json');

const DEFAULT_STORE = {
  vouchers: [],
  orders: [],
  gallery: [],
  hiddenDefaultImages: [],
  settings: {
    sheetUrl: '',
    promoBannerTitle: '2-FOR-1 COCKTAILS',
    promoBannerSub: 'Every Friday to Sunday, 3 PM – 5 PM on Marine Parade, Coolangatta.'
  }
};

export function readLocalStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        vouchers: Array.isArray(parsed.vouchers) ? parsed.vouchers : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
        hiddenDefaultImages: Array.isArray(parsed.hiddenDefaultImages) ? parsed.hiddenDefaultImages : [],
        settings: { ...DEFAULT_STORE.settings, ...(parsed.settings || {}) }
      };
    }
  } catch (err) {
    console.warn('[CMS Store] Read warning:', err.message);
  }
  return JSON.parse(JSON.stringify(DEFAULT_STORE));
}

export function writeLocalStore(nextData) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(nextData, null, 2), 'utf8');
  } catch (err) {
    console.warn('[CMS Store] Write warning:', err.message);
  }
  return nextData;
}

export function resolveSheetUrl(overrideUrl = '') {
  if (overrideUrl && overrideUrl.startsWith('https://script.google.com')) {
    return overrideUrl.trim();
  }
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    return process.env.GOOGLE_SHEETS_WEBHOOK_URL.trim();
  }
  const store = readLocalStore();
  if (store.settings?.sheetUrl && store.settings.sheetUrl.startsWith('https://script.google.com')) {
    return store.settings.sheetUrl.trim();
  }
  return '';
}

export async function pushToGoogleSheet(payload, overrideUrl = '') {
  const sheetUrl = resolveSheetUrl(overrideUrl);
  if (!sheetUrl) return { synced: false };

  try {
    const res = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let json = {};
    try { json = JSON.parse(text); } catch (_) { json = { raw: text }; }
    return { synced: res.ok, result: json };
  } catch (err) {
    console.warn('[Google Sheets Push] Warning:', err.message);
    return { synced: false, error: err.message };
  }
}

export async function pullFromGoogleSheet(overrideUrl = '') {
  const sheetUrl = resolveSheetUrl(overrideUrl);
  const local = readLocalStore();
  if (!sheetUrl) {
    return { sheetConnected: false, ...local };
  }

  try {
    const sep = sheetUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${sheetUrl}${sep}action=sync_all`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      return { sheetConnected: false, ...local };
    }
    const remote = await res.json();

    // Merge remote Google Sheet records with local store by unique IDs
    const remoteVouchers = Array.isArray(remote.vouchers) ? remote.vouchers : [];
    const remoteCodes = new Set(remoteVouchers.map(v => v.voucherCode));
    const mergedVouchers = [
      ...remoteVouchers,
      ...local.vouchers.filter(v => v.voucherCode && !remoteCodes.has(v.voucherCode))
    ];

    const remoteOrders = Array.isArray(remote.orders) ? remote.orders : [];
    const remoteOrderIds = new Set(remoteOrders.map(o => o.orderId));
    const mergedOrders = [
      ...remoteOrders,
      ...local.orders.filter(o => o.orderId && !remoteOrderIds.has(o.orderId))
    ];

    const remoteGallery = Array.isArray(remote.gallery) ? remote.gallery : [];
    const remoteGalleryIds = new Set(remoteGallery.map(g => g.id));
    const mergedGallery = [
      ...remoteGallery,
      ...local.gallery.filter(g => g.id && !remoteGalleryIds.has(g.id))
    ];

    const mergedHidden = Array.isArray(remote.hiddenDefaultImages) && remote.hiddenDefaultImages.length > 0
      ? Array.from(new Set([...remote.hiddenDefaultImages, ...local.hiddenDefaultImages]))
      : local.hiddenDefaultImages;

    const updated = writeLocalStore({
      vouchers: mergedVouchers,
      orders: mergedOrders,
      gallery: mergedGallery,
      hiddenDefaultImages: mergedHidden,
      settings: {
        ...local.settings,
        sheetUrl
      }
    });

    return { sheetConnected: true, ...updated };
  } catch (err) {
    console.warn('[Google Sheets Pull] Warning:', err.message);
    return { sheetConnected: false, ...local };
  }
}

export async function recordVoucherInCms(voucherObj, overrideUrl = '') {
  const store = readLocalStore();
  const filtered = store.vouchers.filter(v => v.voucherCode !== voucherObj.voucherCode);
  store.vouchers = [voucherObj, ...filtered];
  if (overrideUrl && overrideUrl.startsWith('https://script.google.com')) {
    store.settings.sheetUrl = overrideUrl.trim();
  }
  writeLocalStore(store);

  return pushToGoogleSheet({
    tab: 'Vouchers',
    action: 'append_voucher',
    ...voucherObj
  }, overrideUrl);
}

export async function recordOrderInCms(orderObj, overrideUrl = '') {
  const store = readLocalStore();
  const filtered = store.orders.filter(o => o.orderId !== orderObj.orderId);
  store.orders = [orderObj, ...filtered];
  writeLocalStore(store);

  return pushToGoogleSheet({
    tab: 'Orders_Enquiries',
    action: 'append_order',
    ...orderObj
  }, overrideUrl);
}
