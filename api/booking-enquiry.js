// Serverless function for Vercel: /api/booking-enquiry
// Handles booking and function enquiries, captures all guest details dynamically,
// and formats the admin email notification template with exact fields.
import nodemailer from 'nodemailer';
import { recordOrderInCms } from '../lib/cmsStore.js';

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

    // 1. Dynamic extraction & normalization
    const customerName = data.customerName || data['Customer Name'] || data.name || data['Guest Name'] || 'Valued Guest';
    const email = data.email || data['Email Address'] || data.emailAddress || 'Not provided';
    const phone = data.phone || data['Phone Number'] || data.phoneNumber || 'Not provided';
    
    // Dynamic guest count (never hardcoded, accepts any count e.g. 20)
    const rawGuests = data.guests || data['Number of Guests'] || data.numberOfGuests || '20';
    const cleanGuestCount = String(rawGuests).replace(/[^0-9]/g, '') || String(rawGuests).trim() || '20';
    const numberOfGuests = `${cleanGuestCount} People`;

    const bookingDate = data.bookingDate || data['Booking Date'] || data.date || data['Requested Date'] || 'Not specified';
    const bookingTime = data.bookingTime || data['Booking Time'] || data.timeSlot || data['Time Slot'] || 'Dinner (from 5:00 PM)';
    const eventType = data.eventType || data['Event Type'] || 'Group Dining Celebration';
    const seatingArea = data.seatingArea || data['Seating Preference'] || 'Alfresco Ocean Terrace';
    const menuPreference = data.menuPreference || data['Menu Package'] || 'Set Menu 2026 (Shared Feast)';
    const additionalDetails = data.additionalDetails || data['Additional Booking Details'] || data.message || data.notes || 'None';
    const orderId = data.orderId || `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

    // Record in Master Admin CMS + Google Sheets Live Tracker
    try {
      await recordOrderInCms({
        orderId,
        createdAt,
        orderType: data.orderType || 'Function / Booking Enquiry',
        status: 'New',
        customerName,
        email,
        phone,
        guests: numberOfGuests,
        bookingDate,
        bookingTime,
        eventType,
        seatingArea,
        menuPreference,
        additionalDetails,
        adminNotes: ''
      }, data.sheetsWebhookUrl || '');
    } catch (cmsErr) {
      console.warn('[CMS Order Record Warning]:', cmsErr.message);
    }

    // 2. Email Notification Subject & Templates
    const emailSubject = `New Function Booking Enquiry (${numberOfGuests}) - ${customerName}`;

    const emailText = [
      '============================================================',
      '              NEW BOOKING ENQUIRY RECEIVED',
      '============================================================',
      '',
      `• Number of Guests: ${numberOfGuests}`,
      `• Booking Date: ${bookingDate}`,
      `• Booking Time: ${bookingTime}`,
      `• Customer Name: ${customerName}`,
      `• Email Address: ${email}`,
      `• Phone Number: ${phone}`,
      `• Event Type: ${eventType}`,
      `• Seating Preference: ${seatingArea}`,
      `• Menu Package: ${menuPreference}`,
      `• Any additional booking details: ${additionalDetails}`,
      '',
      '============================================================',
      'Submitted via Baskk Italian Website (baskk.co)'
    ].join('\n');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf2f3; color: #241719;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #f0ced2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(148, 24, 27, 0.08);">
    
    <!-- Brand Header -->
    <div style="background: linear-gradient(135deg, #94181B 0%, #7A1215 100%); color: #ffffff; padding: 28px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 700;">BASKK ITALIAN</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; letter-spacing: 1px; color: #fce4ec; text-transform: uppercase;">New Function & Group Booking Enquiry</p>
    </div>

    <!-- Intro Note -->
    <div style="padding: 24px 24px 16px 24px; background: #fff8f9; border-bottom: 1px solid #f5e4e6;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #4a383b;">
        A new booking enquiry has been received from the website. Please review the guest details and confirm availability:
      </p>
    </div>

    <!-- Details Table -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #f0ced2; border-radius: 8px; overflow: hidden;">
        <tbody>
          <!-- Number of Guests Highlighted -->
          <tr style="background-color: #fcf1f3; border-bottom: 1px solid #f0ced2;">
            <td style="padding: 14px 18px; font-weight: 700; color: #94181B; width: 42%; border-bottom: 1px solid #f0ced2;">
              Number of Guests
            </td>
            <td style="padding: 14px 18px; font-size: 17px; font-weight: 800; color: #94181B; border-bottom: 1px solid #f0ced2;">
              ${numberOfGuests}
            </td>
          </tr>

          <!-- Booking Date -->
          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Booking Date
            </td>
            <td style="padding: 12px 18px; color: #241719; font-weight: 700; border-bottom: 1px solid #f5e4e6;">
              ${bookingDate}
            </td>
          </tr>

          <!-- Booking Time -->
          <tr style="background-color: #fafbfc;">
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Booking Time
            </td>
            <td style="padding: 12px 18px; color: #241719; border-bottom: 1px solid #f5e4e6;">
              ${bookingTime}
            </td>
          </tr>

          <!-- Customer Name -->
          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Customer Name
            </td>
            <td style="padding: 12px 18px; color: #241719; font-weight: 700; border-bottom: 1px solid #f5e4e6;">
              ${customerName}
            </td>
          </tr>

          <!-- Email Address -->
          <tr style="background-color: #fafbfc;">
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Email Address
            </td>
            <td style="padding: 12px 18px; border-bottom: 1px solid #f5e4e6;">
              <a href="mailto:${email}" style="color: #94181B; text-decoration: underline; font-weight: 600;">${email}</a>
            </td>
          </tr>

          <!-- Phone Number -->
          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Phone Number
            </td>
            <td style="padding: 12px 18px; border-bottom: 1px solid #f5e4e6;">
              <a href="tel:${phone}" style="color: #94181B; text-decoration: underline; font-weight: 600;">${phone}</a>
            </td>
          </tr>

          <!-- Event Type -->
          <tr style="background-color: #fafbfc;">
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Event Type
            </td>
            <td style="padding: 12px 18px; color: #241719; border-bottom: 1px solid #f5e4e6;">
              ${eventType}
            </td>
          </tr>

          <!-- Seating Preference -->
          <tr>
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Seating Preference
            </td>
            <td style="padding: 12px 18px; color: #241719; border-bottom: 1px solid #f5e4e6;">
              ${seatingArea}
            </td>
          </tr>

          <!-- Menu Package -->
          <tr style="background-color: #fafbfc;">
            <td style="padding: 12px 18px; font-weight: 600; color: #665255; border-bottom: 1px solid #f5e4e6;">
              Menu Package
            </td>
            <td style="padding: 12px 18px; color: #241719; border-bottom: 1px solid #f5e4e6;">
              ${menuPreference}
            </td>
          </tr>

          <!-- Additional Booking Details -->
          <tr>
            <td style="padding: 14px 18px; font-weight: 600; color: #665255; vertical-align: top;">
              Any additional booking details
            </td>
            <td style="padding: 14px 18px; color: #241719; line-height: 1.6; white-space: pre-line;">
              ${additionalDetails}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Action Bar -->
    <div style="padding: 20px 24px; background-color: #fff8f9; border-top: 1px solid #f5e4e6; text-align: center;">
      <a href="https://www.baskk.co/admin"
         style="display: inline-block; background: #191919; color: #f5f0e8; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 22px; border-radius: 6px; letter-spacing: 0.5px; margin: 4px;">
        Open Master Admin Panel
      </a>
      <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Baskk Italian Booking Enquiry (${numberOfGuests})`)}&body=${encodeURIComponent(`Hi ${customerName},\n\nThank you for reaching out to Baskk Italian! We would be delighted to host your ${eventType} for ${numberOfGuests} on ${bookingDate}.\n\n`)}" 
         style="display: inline-block; background: #94181B; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 6px; letter-spacing: 0.5px; margin: 4px;">
        Reply Directly to ${customerName}
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background-color: #f7ebed; text-align: center; font-size: 12px; color: #887275;">
      Baskk Italian • 52–58 Marine Parade, Coolangatta, QLD 4225 • <a href="mailto:request@baskk.co" style="color: #94181B;">request@baskk.co</a>
    </div>
  </div>
</body>
</html>
    `;

    // 3. Dispatch to available mail services
    let emailDispatched = false;

    // A. GoDaddy Workspace / SMTP (Direct Server-to-Server)
    const godaddyPass = process.env.SMTP_PASS || process.env.GODADDY_PASS || process.env.GODADDY_EMAIL_PASSWORD;
    if (godaddyPass) {
      try {
        const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
        const smtpUser = process.env.SMTP_USER || 'request@baskk.co';

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for 587
          auth: {
            user: smtpUser,
            pass: godaddyPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"Baskk Bookings" <${smtpUser}>`,
          to: process.env.ADMIN_EMAIL || 'request@baskk.co',
          replyTo: `"${customerName}" <${email}>`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });

        emailDispatched = true;
        console.log(`[SMTP] Successfully sent booking enquiry to ${process.env.ADMIN_EMAIL || 'request@baskk.co'} via GoDaddy SMTP`);
      } catch (err) {
        console.error('[SMTP] GoDaddy SMTP dispatch error:', err.message);
      }
    }

    // B. Resend (if configured)
    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'Baskk Bookings <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL || 'request@baskk.co'],
            reply_to: email,
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

    // B. SendGrid (if configured)
    if (!emailDispatched && process.env.SENDGRID_API_KEY) {
      try {
        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: process.env.ADMIN_EMAIL || 'request@baskk.co' }] }],
            from: { email: process.env.FROM_EMAIL || 'bookings@baskk.co', name: 'Baskk Website' },
            reply_to: { email, name: customerName },
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

    // C. Forward to FormSubmit with exact required field formatting
    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: emailSubject,
          _template: 'table',
          "Number of Guests": numberOfGuests,
          "Booking Date": bookingDate,
          "Booking Time": bookingTime,
          "Customer Name": customerName,
          "Email Address": email,
          "Phone Number": phone,
          "Event Type": eventType,
          "Seating Preference": seatingArea,
          "Menu Package": menuPreference,
          "Any additional booking details": additionalDetails,
          _captcha: 'false'
        })
      });
    } catch (e) {
      // silent fallback
    }

    return res.status(200).json({
      success: true,
      message: 'Booking enquiry processed successfully',
      data: {
        numberOfGuests,
        bookingDate,
        bookingTime,
        customerName,
        email,
        phone,
        eventType,
        seatingArea,
        menuPreference,
        additionalDetails
      },
      emailNotification: {
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      }
    });

  } catch (error) {
    console.error('Booking enquiry handler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error processing enquiry'
    });
  }
}
