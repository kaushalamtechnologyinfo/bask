// Serverless function for Vercel: /api/gift-voucher
// 1. Handles online gift voucher orders, sends instant email notifications to request@baskk.co,
//    and automatically logs rows into Google Sheets (when GOOGLE_SHEETS_WEBHOOK_URL is configured).
// 2. Powers the Baskk Staff Voucher Tracker Dashboard (/gifts-admin) for searching, verifying,
//    and recording partial or full voucher redemptions synced with Google Sheets.
import nodemailer from 'nodemailer';
import { recordVoucherInCms } from '../lib/cmsStore.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = data.action || 'create_order';
    const configuredSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || data.sheetsWebhookUrl || '';
    const adminPinExpected = process.env.VOUCHER_ADMIN_PIN || '4225';

    // =========================================================================
    // STAFF TRACKER DASHBOARD ACTIONS (verify_pin, list, update, manual_add)
    // =========================================================================
    if (action === 'verify_pin') {
      const valid = String(data.pin || '').trim() === String(adminPinExpected).trim();
      return res.status(valid ? 200 : 401).json({
        success: valid,
        hasEnvSheetUrl: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
        error: valid ? null : 'Incorrect Staff PIN.'
      });
    }

    if (action === 'list' || action === 'update' || action === 'manual_add') {
      if (String(data.pin || '').trim() !== String(adminPinExpected).trim()) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Staff PIN.' });
      }

      if (!configuredSheetsUrl) {
        return res.status(200).json({
          success: true,
          sheetConnected: false,
          vouchers: [],
          message: 'Google Sheet Web App URL not connected yet.'
        });
      }

      if (action === 'list') {
        const separator = configuredSheetsUrl.includes('?') ? '&' : '?';
        const listRes = await fetch(`${configuredSheetsUrl}${separator}action=list`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        const listJson = await listRes.json();
        return res.status(200).json({
          success: true,
          sheetConnected: true,
          vouchers: Array.isArray(listJson.vouchers) ? listJson.vouchers : []
        });
      }

      if (action === 'update' || action === 'manual_add') {
        const sheetRes = await fetch(configuredSheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        const sheetJson = await sheetRes.json();
        return res.status(200).json({
          success: true,
          sheetConnected: true,
          result: sheetJson
        });
      }
    }

    // =========================================================================
    // DEFAULT ACTION: ONLINE GIFT VOUCHER ORDER FROM /gifts
    // =========================================================================
    const voucherAmount = data.voucherAmount || data['Voucher Amount'] || data.amount || '$100 AUD';
    const numericVal = parseFloat(String(voucherAmount).replace(/[^0-9.]/g, '')) || 100;
    const voucherTitle = data.voucherTitle || data['Voucher Package'] || 'Coastal Italian Dining Voucher';
    const voucherCode = data.voucherCode || data['Voucher Code'] || `BASKK-GV-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryType = data.deliveryType || data['Delivery Type'] || 'Send to Recipient';
    const deliveryDate = data.deliveryDate || data['Delivery Date'] || 'Instant Digital Delivery';

    const buyerName = data.buyerName || data['Purchaser Name'] || data.customerName || 'Valued Guest';
    const buyerEmail = data.buyerEmail || data['Purchaser Email'] || data.email || 'Not provided';
    const buyerPhone = data.buyerPhone || data['Purchaser Phone'] || data.phone || 'Not provided';

    const recipientName = data.recipientName || data['Recipient Name'] || buyerName;
    const recipientEmail = data.recipientEmail || data['Recipient Email'] || buyerEmail;
    const occasion = data.occasion || data['Occasion'] || 'Special Gift';
    const personalMessage = data.personalMessage || data['Personal Gift Message'] || data.message || 'Enjoy an unforgettable coastal Italian dining experience at Baskk!';
    const stripeCheckoutUrl = data.stripeUrl || data['Stripe Checkout Link'] || 'https://buy.stripe.com/7sY00jcfH0iZ7t05359R605';
    const purchaseDate = data.purchaseDate || new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const expiryDate = data.expiryDate || (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3);
      return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    })();

    // 1. Automatically record in Master Admin CMS + Google Sheets Live Tracker
    let loggedToGoogleSheet = false;
    try {
      const syncResult = await recordVoucherInCms({
        timestamp: new Date().toISOString(),
        purchaseDate,
        voucherCode,
        originalAmount: numericVal,
        remainingBalance: numericVal,
        voucherAmount,
        voucherTitle,
        status: 'Active',
        paymentStatus: 'Verify Stripe Payment',
        buyerName,
        buyerEmail,
        buyerPhone,
        recipientName,
        recipientEmail,
        deliveryType,
        deliveryDate,
        occasion,
        personalMessage,
        expiryDate,
        notes: 'Online order via baskk.co/gifts'
      }, configuredSheetsUrl);
      loggedToGoogleSheet = Boolean(syncResult?.synced);
    } catch (gsErr) {
      console.warn('[CMS / Google Sheets] Voucher log warning:', gsErr.message);
    }

    // 2. Email Notification Subject & Templates (sent to request@baskk.co)
    const emailSubject = `New Gift Voucher Order (${voucherAmount}) - ${buyerName} [${voucherCode}]`;

    const emailText = [
      '============================================================',
      '           NEW ONLINE GIFT VOUCHER ORDER RECEIVED',
      '============================================================',
      '',
      `• Voucher Code: ${voucherCode}`,
      `• Voucher Amount: ${voucherAmount}`,
      `• Voucher Package: ${voucherTitle}`,
      `• Purchaser Name: ${buyerName}`,
      `• Purchaser Email: ${buyerEmail}`,
      `• Purchaser Phone: ${buyerPhone}`,
      `• Recipient Name: ${recipientName}`,
      `• Recipient Email: ${recipientEmail}`,
      `• Delivery Type: ${deliveryType}`,
      `• Delivery Schedule: ${deliveryDate}`,
      `• Occasion: ${occasion}`,
      `• Personal Gift Message: ${personalMessage}`,
      `• Issue Date: ${purchaseDate}`,
      `• Expiry Date (3 Years): ${expiryDate}`,
      '',
      '• Master Admin Panel: https://www.baskk.co/admin?search=' + encodeURIComponent(voucherCode),
      '• Verify Payment in Stripe: https://dashboard.stripe.com/payments',
      '============================================================',
      'Submitted via Baskk Italian Gift Vouchers (baskk.co/gifts)'
    ].join('\n');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f0e8; color: #191919;">
  <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5dcce; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 28px rgba(25, 25, 25, 0.08);">
    
    <!-- Brand Header -->
    <div style="background: #191919; color: #f5f0e8; padding: 28px 24px; text-align: center; border-bottom: 3px solid #B9674B;">
      <p style="margin: 0 0 6px 0; font-size: 11px; letter-spacing: 2.2px; color: #B9674B; text-transform: uppercase; font-weight: 700;">ONLINE GIFT VOUCHER NOTIFICATION</p>
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 1.5px; font-weight: 600;">BASKK ITALIAN GIFT VOUCHER</h1>
      <div style="margin-top: 12px; display: inline-block; background: #B9674B; color: #ffffff; padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; letter-spacing: 1px;">
        CODE: ${voucherCode} &bull; ${voucherAmount}
      </div>
    </div>

    <!-- Intro Note -->
    <div style="padding: 20px 24px; background: #faf7f2; border-bottom: 1px solid #e5dcce;">
      <p style="margin: 0; font-size: 14px; line-height: 1.55; color: #3d3832;">
        A new online <strong>Gift Voucher (${voucherAmount})</strong> has been submitted by <strong>${buyerName}</strong>. Verify payment in Stripe and track or redeem this code anytime in your Staff Voucher Portal:
      </p>
    </div>

    <!-- Details Table -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e5dcce; border-radius: 10px; overflow: hidden;">
        <tbody>
          <tr style="background-color: #faf7f2;">
            <td style="padding: 14px 18px; font-weight: 700; color: #B9674B; width: 42%; border-bottom: 1px solid #e5dcce;">
              Voucher Value &amp; Edition
            </td>
            <td style="padding: 14px 18px; font-size: 17px; font-weight: 800; color: #191919; border-bottom: 1px solid #e5dcce;">
              ${voucherAmount} <span style="font-size: 13px; font-weight: 500; color: #5e564d;">(${voucherTitle})</span>
            </td>
          </tr>

          <tr>
            <td style="padding: 12px 18px; font-weight: 700; color: #191919; border-bottom: 1px solid #e5dcce;">
              Unique Voucher Code
            </td>
            <td style="padding: 12px 18px; font-family: monospace; font-size: 16px; font-weight: 800; color: #B9674B; border-bottom: 1px solid #e5dcce; letter-spacing: 1px;">
              ${voucherCode}
            </td>
          </tr>

          <tr style="background-color: #faf7f2;">
            <td style="padding: 12px 18px; font-weight: 600; color: #5e564d; border-bottom: 1px solid #efe8dc;">
              Purchased By (Buyer)
            </td>
            <td style="padding: 12px 18px; color: #191919; font-weight: 700; border-bottom: 1px solid #efe8dc;">
              ${buyerName}
            </td>
          </tr>

          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #5e564d; border-bottom: 1px solid #efe8dc;">
              Purchaser Email &amp; Phone
            </td>
            <td style="padding: 12px 18px; border-bottom: 1px solid #efe8dc;">
              <a href="mailto:${buyerEmail}" style="color: #B9674B; font-weight: 600;">${buyerEmail}</a> &bull; <a href="tel:${buyerPhone}" style="color: #191919;">${buyerPhone}</a>
            </td>
          </tr>

          <tr style="background-color: #faf7f2;">
            <td style="padding: 12px 18px; font-weight: 600; color: #5e564d; border-bottom: 1px solid #efe8dc;">
              Gift Recipient
            </td>
            <td style="padding: 12px 18px; color: #191919; font-weight: 700; border-bottom: 1px solid #efe8dc;">
              ${recipientName} (<a href="mailto:${recipientEmail}" style="color: #B9674B;">${recipientEmail}</a>)
            </td>
          </tr>

          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #5e564d; border-bottom: 1px solid #efe8dc;">
              Delivery &amp; Occasion
            </td>
            <td style="padding: 12px 18px; color: #191919; border-bottom: 1px solid #efe8dc;">
              ${deliveryType} (${deliveryDate}) &bull; ${occasion}
            </td>
          </tr>

          <tr style="background-color: #faf7f2;">
            <td style="padding: 12px 18px; font-weight: 600; color: #5e564d; border-bottom: 1px solid #efe8dc;">
              Validity Period (36 Months)
            </td>
            <td style="padding: 12px 18px; color: #191919; border-bottom: 1px solid #efe8dc;">
              ${purchaseDate} &ndash; ${expiryDate}
            </td>
          </tr>

          <tr>
            <td style="padding: 14px 18px; font-weight: 600; color: #5e564d; vertical-align: top;">
              Personal Gift Message
            </td>
            <td style="padding: 14px 18px; color: #191919; line-height: 1.6; font-style: italic;">
              "${personalMessage}"
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Action Bar -->
    <div style="padding: 20px 24px; background-color: #faf7f2; border-top: 1px solid #e5dcce; text-align: center;">
      <a href="https://www.baskk.co/admin?search=${encodeURIComponent(voucherCode)}"
         style="display: inline-block; background: #191919; color: #f5f0e8; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 999px; letter-spacing: 0.5px; margin: 4px;">
        Open Master Admin Panel
      </a>
      <a href="https://dashboard.stripe.com/payments"
         style="display: inline-block; background: #B9674B; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 999px; letter-spacing: 0.5px; margin: 4px;">
        Verify Payment in Stripe
      </a>
      <a href="mailto:${recipientEmail}?subject=${encodeURIComponent(`Your Baskk Italian Gift Voucher (${voucherAmount}) - Code: ${voucherCode}`)}&body=${encodeURIComponent(`Hi ${recipientName},\n\nYou have received a ${voucherAmount} Baskk Italian Gift Voucher from ${buyerName}!\n\nPersonal Message: "${personalMessage}"\n\nVoucher Code: ${voucherCode}\nValue: ${voucherAmount}\nValid Until: ${expiryDate}\n\nSimply present this email or voucher code when dining with us at Baskk Italian (52-58 Marine Parade, Coolangatta).\n\nWarm regards,\nBaskk Italian Team`)}" 
         style="display: inline-block; background: #ffffff; color: #191919; border: 1px solid #191919; text-decoration: none; font-weight: 700; font-size: 13px; padding: 11px 20px; border-radius: 999px; letter-spacing: 0.5px; margin: 4px;">
        Email Voucher to Recipient
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background-color: #f5f0e8; text-align: center; font-size: 12px; color: #5e564d;">
      Baskk Italian &bull; 52&ndash;58 Marine Parade, Coolangatta, QLD 4225 &bull; <a href="mailto:request@baskk.co" style="color: #B9674B;">request@baskk.co</a>
    </div>
  </div>
</body>
</html>
    `;

    // 3. Dispatch to available mail services -> ALWAYS targeting request@baskk.co
    const targetAdminEmail = process.env.ADMIN_EMAIL || 'request@baskk.co';
    let emailDispatched = false;

    const godaddyPass = process.env.SMTP_PASS || process.env.GODADDY_PASS || process.env.GODADDY_EMAIL_PASSWORD;
    if (godaddyPass) {
      try {
        const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
        const smtpUser = process.env.SMTP_USER || 'request@baskk.co';

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: godaddyPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"Baskk Gift Vouchers" <${smtpUser}>`,
          to: targetAdminEmail,
          replyTo: `"${buyerName}" <${buyerEmail}>`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });

        emailDispatched = true;
      } catch (err) {
        console.error('[SMTP] GoDaddy SMTP dispatch error:', err.message);
      }
    }

    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'Baskk Gift Vouchers <onboarding@resend.dev>',
            to: [targetAdminEmail],
            reply_to: buyerEmail,
            subject: emailSubject,
            html: emailHtml,
            text: emailText
          })
        });
        if (resendRes.ok) emailDispatched = true;
      } catch (err) {
        console.warn('Resend dispatch error:', err.message);
      }
    }

    if (!emailDispatched && process.env.SENDGRID_API_KEY) {
      try {
        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: targetAdminEmail }] }],
            from: { email: process.env.FROM_EMAIL || 'request@baskk.co', name: 'Baskk Gift Vouchers' },
            reply_to: { email: buyerEmail, name: buyerName },
            subject: emailSubject,
            content: [
              { type: 'text/plain', value: emailText },
              { type: 'text/html', value: emailHtml }
            ]
          })
        });
        if (sgRes.ok) emailDispatched = true;
      } catch (err) {
        console.warn('SendGrid dispatch error:', err.message);
      }
    }

    // Forward to FormSubmit targeting request@baskk.co
    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: emailSubject,
          _template: 'table',
          "Voucher Code": voucherCode,
          "Voucher Amount": voucherAmount,
          "Voucher Package": voucherTitle,
          "Purchaser Name": buyerName,
          "Purchaser Email": buyerEmail,
          "Purchaser Phone": buyerPhone,
          "Recipient Name": recipientName,
          "Recipient Email": recipientEmail,
          "Delivery Type": deliveryType,
          "Delivery Date": deliveryDate,
          "Occasion": occasion,
          "Personal Gift Message": personalMessage,
          "Valid Until": expiryDate,
          _captcha: 'false'
        })
      });
    } catch (e) {
      // silent fallback
    }

    return res.status(200).json({
      success: true,
      loggedToGoogleSheet,
      message: 'Gift voucher notification sent to request@baskk.co',
      data: {
        voucherCode,
        voucherAmount,
        originalAmount: numericVal,
        remainingBalance: numericVal,
        voucherTitle,
        buyerName,
        buyerEmail,
        buyerPhone,
        recipientName,
        recipientEmail,
        deliveryType,
        deliveryDate,
        occasion,
        personalMessage,
        purchaseDate,
        expiryDate,
        stripeCheckoutUrl
      }
    });

  } catch (error) {
    console.error('Gift voucher handler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error processing gift voucher'
    });
  }
}
