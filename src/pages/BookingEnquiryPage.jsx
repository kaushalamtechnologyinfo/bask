import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MENU_ATTACHMENTS = [
  {
    id: 'food',
    title: 'Food Menu',
    tagline: 'Handcrafted Pasta, House-Made Dough & Coastal Seafood',
    fileUrl: '/food-menu.pdf',
    downloadName: 'Baskk-Food-Menu.pdf',
    badge: 'A La Carte & Dinner',
    icon: 'fa-solid fa-utensils'
  },
  {
    id: 'drinks',
    title: 'Drinks Menu',
    tagline: 'Signature Spritzes, Italian Wines, Beers & Cocktails',
    fileUrl: '/drinks-menu.pdf',
    downloadName: 'Drinks Menu.pdf',
    badge: 'Bar & Cellar',
    icon: 'fa-solid fa-martini-glass-citrus'
  },
  {
    id: 'set-menu',
    title: 'Set Menu 2026',
    tagline: 'Multi-Course Shared Feasts for Groups & Functions',
    fileUrl: '/set-menu-2026.pdf',
    downloadName: 'Baskk-Set-Menu-2026.pdf',
    badge: 'Group Feasts & Packages',
    icon: 'fa-solid fa-champagne-glasses'
  }
];

export default function BookingEnquiryPage({ onOpenBook }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Group Dining Celebration',
    guests: '20',
    date: '',
    timeSlot: 'Dinner (from 5:00 PM)',
    seatingArea: 'Alfresco Ocean Terrace',
    menuPreference: 'Set Menu 2026 (Shared Feast)',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const guestCount = formData.guests ? String(formData.guests).replace(/[^0-9]/g, '') || formData.guests : '20';
    const numberOfGuestsFormatted = `${guestCount} People`;

    const enquiryPayload = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests,
      numberOfGuests: numberOfGuestsFormatted,
      bookingDate: formData.date || 'Not specified',
      bookingTime: formData.timeSlot || 'Dinner (from 5:00 PM)',
      eventType: formData.eventType,
      seatingArea: formData.seatingArea,
      menuPreference: formData.menuPreference,
      additionalDetails: formData.message || 'None'
    };

    const formSubmitPayload = {
      _subject: `New Function Enquiry (${numberOfGuestsFormatted}) - ${formData.name}`,
      _template: 'table',
      "Number of Guests": numberOfGuestsFormatted,
      "Booking Date": formData.date || 'Not specified',
      "Booking Time": formData.timeSlot || 'Dinner (from 5:00 PM)',
      "Customer Name": formData.name,
      "Email Address": formData.email,
      "Phone Number": formData.phone,
      "Event Type": formData.eventType,
      "Seating Preference": formData.seatingArea,
      "Menu Package": formData.menuPreference,
      "Any additional booking details": formData.message || "None",
      _captcha: "false"
    };

    // 1. Dispatch to Vercel serverless backend API (handles GoDaddy SMTP + Admin CMS + Google Sheets)
    try {
      const orderId = `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const savedSheetUrl = localStorage.getItem('baskk_google_sheet_webapp_url') || '';
      const fullPayload = { ...enquiryPayload, orderId, orderType: 'Function Enquiry', sheetsWebhookUrl: savedSheetUrl };

      try {
        const rawOrders = localStorage.getItem('baskk_orders_ledger_v1');
        const list = rawOrders ? JSON.parse(rawOrders) : [];
        list.unshift({
          orderId,
          createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderType: 'Function Enquiry',
          status: 'New',
          customerName: enquiryPayload.customerName,
          email: enquiryPayload.email,
          phone: enquiryPayload.phone,
          guests: numberOfGuestsFormatted,
          bookingDate: enquiryPayload.bookingDate,
          bookingTime: enquiryPayload.bookingTime,
          eventType: enquiryPayload.eventType,
          seatingArea: enquiryPayload.seatingArea,
          menuPreference: enquiryPayload.menuPreference,
          additionalDetails: enquiryPayload.additionalDetails,
          adminNotes: ''
        });
        localStorage.setItem('baskk_orders_ledger_v1', JSON.stringify(list));
      } catch (_) {}

      await fetch('/api/booking-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(fullPayload)
      });
    } catch (apiErr) {
      console.warn('Backend API route dispatch note:', apiErr);
    }

    // 2. Also dispatch to FormSubmit webhook as secondary channel
    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitPayload)
      });
    } catch (err) {
      console.warn('FormSubmit background notification error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="enquiry-page-root">
      <Navbar onOpenBook={onOpenBook} />

      <main className="enquiry-main-content">
        {/* HERO SECTION */}
        <section className="enquiry-hero-section">
          <div className="container">
            <div className="enquiry-hero-box text-center">
              <span className="editorial-eyebrow">CELEBRATIONS &amp; PRIVATE EVENTS</span>
              <h1 className="enquiry-title">Booking &amp; Function Enquiry</h1>
              <p className="enquiry-subtitle">
                Planning an event? Let us make it unforgettable! From beachfront birthday feasts and intimate weddings 
                to large group dining packages overlooking Marine Parade, let our team craft the perfect seaside celebration.
              </p>

              {/* Instant vs Group Guide Pills */}
              <div className="booking-choice-strip">
                <div className="choice-card small-group">
                  <div className="choice-badge">1 – 10 GUESTS</div>
                  <h3>Standard Table Reservations</h3>
                  <p>Book your table instantly online with real-time confirmation via ResDiary.</p>
                  <a 
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-choice-resdiary"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>INSTANT TABLE BOOKING (RESDIARY)</span>
                  </a>
                </div>

                <div className="choice-card large-group">
                  <div className="choice-badge highlight">10 – 160 GUESTS</div>
                  <h3>Group Feasts &amp; Private Functions</h3>
                  <p>Tailored banquet menus, dedicated staff, private spaces, and beverage packages.</p>
                  <a href="#enquiry-form" className="btn-choice-enquire" style={{ textDecoration: 'none' }}>
                    <i className="fa-solid fa-arrow-down"></i>
                    <span>FILL IN FUNCTION ENQUIRY BELOW</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MENU ATTACHMENTS & DOWNLOADS SECTION */}
        <section className="menu-attachments-section">
          <div className="container">
            <div className="section-header-block text-center">
              <span className="section-eyebrow">OFFICIAL EVENT MENUS</span>
              <h2 className="section-heading">Download Menu Attachments</h2>
              <p className="section-desc">
                Review our official menus and banquet feast packages below. You can download PDF attachments 
                directly to plan your event courses and beverage selections.
              </p>
            </div>

            <div className="attachments-grid">
              {MENU_ATTACHMENTS.map((item) => (
                <div className="attachment-card" key={item.id}>
                  <div className="card-top-row">
                    <span className="card-badge">{item.badge}</span>
                    <i className={`${item.icon} card-icon`}></i>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-desc">{item.tagline}</p>
                  
                  <div className="card-actions-row">
                    <a 
                      href={item.fileUrl} 
                      download={item.downloadName}
                      className="btn-download-attachment"
                      title={`Download ${item.title} PDF`}
                    >
                      <i className="fa-solid fa-file-arrow-down"></i>
                      <span>Download PDF</span>
                    </a>
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-attachment"
                      title={`Open ${item.title} in new tab`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      <span>View</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="browse-menu-strip text-center">
              <Link to="/menu" className="btn-browse-full-menu">
                <span>VIEW FULL INTERACTIVE ONLINE MENU &amp; PRICES</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* ENQUIRY FORM & VENUE SPECS SECTION */}
        <section className="form-specs-section" id="enquiry-form">
          <div className="container">
            <div className="form-specs-grid">
              {/* Left Column: Interactive Form */}
              <div className="enquiry-form-card">
                <span className="form-eyebrow">ONLINE ENQUIRY FORM</span>
                <h2 className="form-title">Send Your Booking Enquiry</h2>
                <p className="form-desc">
                  Tell us about your celebration. Our events coordinator will check date availability, 
                  propose the ideal menu package, and reply to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="form-success-alert">
                    <i className="fa-solid fa-circle-check success-icon"></i>
                    <h3>Grazie! Your Enquiry Has Been Sent.</h3>
                    <p>
                      Thank you <strong>{formData.name || 'Guest'}</strong>. We have received your enquiry for 
                      a <strong>{formData.eventType}</strong> ({formData.guests ? `${String(formData.guests).replace(/[^0-9]/g, '') || formData.guests} People` : '20 People'}). Our events coordinator will contact you via email or phone shortly.
                    </p>

                    <div className="enquiry-confirmed-summary" style={{
                      margin: '20px 0',
                      padding: '18px 20px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #F0CED2',
                      textAlign: 'left',
                      fontSize: '0.92rem'
                    }}>
                      <div style={{ fontWeight: '700', color: '#94181B', marginBottom: '10px', fontSize: '1rem', borderBottom: '1px solid #F5E4E6', paddingBottom: '6px' }}>
                        Submitted Booking Details:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', lineHeight: '1.5' }}>
                        <span style={{ color: '#665255', fontWeight: '600' }}>Number of Guests:</span>
                        <strong style={{ color: '#94181B' }}>{formData.guests ? `${String(formData.guests).replace(/[^0-9]/g, '') || formData.guests} People` : '20 People'}</strong>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Booking Date:</span>
                        <span style={{ color: '#241719', fontWeight: '600' }}>{formData.date || 'Not specified'}</span>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Booking Time:</span>
                        <span style={{ color: '#241719' }}>{formData.timeSlot}</span>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Customer Name:</span>
                        <span style={{ color: '#241719', fontWeight: '600' }}>{formData.name}</span>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Email Address:</span>
                        <span style={{ color: '#241719' }}>{formData.email}</span>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Phone Number:</span>
                        <span style={{ color: '#241719' }}>{formData.phone}</span>

                        <span style={{ color: '#665255', fontWeight: '600' }}>Additional Details:</span>
                        <span style={{ color: '#241719' }}>{formData.message || 'None'}</span>
                      </div>
                    </div>

                    <div className="success-actions">
                      <a 
                        href={`mailto:request@baskk.co?subject=${encodeURIComponent(`Function Enquiry (${formData.guests ? `${String(formData.guests).replace(/[^0-9]/g, '') || formData.guests} People` : '20 People'}) - ${formData.name}`)}&body=${encodeURIComponent(
`Hi Baskk Events Team,

Here are the details for my booking enquiry:
- Number of Guests: ${formData.guests ? `${String(formData.guests).replace(/[^0-9]/g, '') || formData.guests} People` : '20 People'}
- Booking Date: ${formData.date || 'Not specified'}
- Booking Time: ${formData.timeSlot || 'Dinner (from 5:00 PM)'}
- Customer Name: ${formData.name}
- Email Address: ${formData.email}
- Phone Number: ${formData.phone}
- Event Type: ${formData.eventType}
- Seating Preference: ${formData.seatingArea}
- Menu Package: ${formData.menuPreference}
- Any additional booking details: ${formData.message || 'None'}

Please confirm availability and package details. Thank you!`
                        )}`} 
                        className="btn-email-fallback"
                      >
                        <i className="fa-solid fa-envelope"></i>
                        <span>Email directly: request@baskk.co</span>
                      </a>
                      <button 
                        type="button" 
                        className="btn-send-another"
                        onClick={() => setSubmitted(false)}
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="actual-enquiry-form">
                    <div className="form-row">
                      <div className="form-col">
                        <label>Your Full Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Marco Rossi"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-col">
                        <label>Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="e.g. marco@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col">
                        <label>Phone Number *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="e.g. 0400 000 000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-col">
                        <label>Event Type</label>
                        <select 
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        >
                          <option value="Group Dining Celebration">Group Dining Table (10+ Guests)</option>
                          <option value="Birthday Party Celebration">Birthday Party Celebration</option>
                          <option value="Wedding / Engagement Dinner">Wedding / Engagement Dinner</option>
                          <option value="Corporate Event / Dinner">Corporate Event / Dinner</option>
                          <option value="Cocktails & Canapés Gathering">Cocktails &amp; Canapés Gathering</option>
                          <option value="Exclusive Full Venue Hire">Exclusive Full Venue Hire</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col">
                        <label>Preferred Date *</label>
                        <input 
                          type="date" 
                          required 
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className="form-col">
                        <label>Estimated Guests (Count) *</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="200" 
                          required 
                          placeholder="e.g. 25"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col">
                        <label>Preferred Time Slot</label>
                        <select 
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        >
                          <option value="Lunch (12:00 PM – 3:00 PM)">Lunch (12:00 PM – 3:00 PM)</option>
                          <option value="Sunset Aperitivo (3:00 PM – 5:00 PM)">Sunset Aperitivo (3:00 PM – 5:00 PM)</option>
                          <option value="Dinner (from 5:00 PM)">Dinner (from 5:00 PM onwards)</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label>Seating Preference</label>
                        <select 
                          value={formData.seatingArea}
                          onChange={(e) => setFormData({ ...formData, seatingArea: e.target.value })}
                        >
                          <option value="Alfresco Ocean Terrace">Alfresco Ocean Terrace</option>
                          <option value="Main Dining Room">Main Dining Room</option>
                          <option value="Cocktail Lounge Bar">Cocktail Lounge Bar</option>
                          <option value="Whole Venue Exclusive">Whole Venue Exclusive</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row full-width">
                      <label>Menu Package Preference</label>
                      <select 
                        value={formData.menuPreference}
                        onChange={(e) => setFormData({ ...formData, menuPreference: e.target.value })}
                      >
                        <option value="Set Menu 2026 (Shared Feast)">Set Menu 2026 (Shared Multi-Course Feast)</option>
                        <option value="A La Carte Dining Menu">A La Carte Dining Menu</option>
                        <option value="Cocktails & Canapés Package">Cocktails &amp; Canapés Package</option>
                        <option value="Custom Menu (Discuss with Event Manager)">Custom Menu (Discuss with Event Manager)</option>
                      </select>
                    </div>

                    <div className="form-row full-width">
                      <label>Dietary Requirements &amp; Special Notes</label>
                      <textarea 
                        rows="4"
                        placeholder="Tell us about dietary needs (gluten-free, vegan, allergies), audio-visual requests, celebration speeches, or timing preferences..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-submit-enquiry" disabled={isSubmitting}>
                      <span>{isSubmitting ? 'SENDING ENQUIRY...' : 'SUBMIT BOOKING ENQUIRY'}</span>
                      <i className={isSubmitting ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paper-plane"}></i>
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Venue Highlights & Quick Contact */}
              <div className="venue-highlights-card">
                <div className="venue-specs-box">
                  <span className="specs-eyebrow">VENUE CAPACITY</span>
                  <h3 className="specs-title">Seaside Italian Elegance</h3>

                  <div className="specs-stat-grid">
                    <div className="stat-item">
                      <strong className="stat-number">160</strong>
                      <span className="stat-label">Seated Dining Capacity</span>
                    </div>
                    <div className="stat-item">
                      <strong className="stat-number">150</strong>
                      <span className="stat-label">Cocktail Party Capacity</span>
                    </div>
                    <div className="stat-item">
                      <strong className="stat-number">100%</strong>
                      <span className="stat-label">Direct Beachfront Ocean Views</span>
                    </div>
                    <div className="stat-item">
                      <strong className="stat-number">4</strong>
                      <span className="stat-label">Curated Menu &amp; Bar Packages</span>
                    </div>
                  </div>
                </div>

                <div className="highlights-photo-box">
                  <img 
                    src="/baskk-photos/DSC_0162.JPG" 
                    alt="Baskk Italian Oceanfront Terrace Atmosphere" 
                    className="highlights-img"
                  />
                  <div className="highlights-overlay">
                    <strong>Baskk Italian</strong>
                    <p>52–58 Marine Parade, Coolangatta, QLD 4225</p>
                  </div>
                </div>

                <div className="quick-contact-box">
                  <h4>Direct Event Assistance</h4>
                  <p>Prefer to speak directly with our team? Send us your brief:</p>
                  <a href="mailto:request@baskk.co" className="btn-contact-email">
                    <i className="fa-solid fa-envelope"></i>
                    <span>request@baskk.co</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        .enquiry-page-root {
          min-height: 100vh;
          background-color: #FAF2F3;
          color: #241719;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
        }

        .enquiry-main-content {
          padding-top: 110px;
        }

        /* HERO */
        .enquiry-hero-section {
          padding: 50px 0 35px 0;
          background: linear-gradient(180deg, rgba(250, 242, 243, 0.95) 0%, rgba(246, 233, 235, 0.8) 100%);
          border-bottom: 1px solid #F0CED2;
        }

        .enquiry-hero-box {
          max-width: 900px;
          margin: 0 auto;
        }

        .editorial-eyebrow {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #94181B;
          margin-bottom: 14px;
        }

        .enquiry-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(2.4rem, 4.8vw, 3.8rem);
          font-weight: 400;
          color: #241719;
          line-height: 1.15;
          margin: 0 0 16px 0;
        }

        .enquiry-subtitle {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #574447;
          max-width: 760px;
          margin: 0 auto 36px auto;
        }

        .booking-choice-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          text-align: left;
          margin-top: 20px;
        }

        .choice-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 28px 26px;
          border: 1px solid #F0CED2;
          box-shadow: 0 6px 20px rgba(36, 23, 25, 0.05);
          display: flex;
          flex-direction: column;
        }

        .choice-badge {
          align-self: flex-start;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 4px 12px;
          border-radius: 9999px;
          background: #FAF2F3;
          color: #94181B;
          margin-bottom: 14px;
        }

        .choice-badge.highlight {
          background: #94181B;
          color: #FFFFFF;
        }

        .choice-card h3 {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.45rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #241719;
        }

        .choice-card p {
          font-size: 0.9rem;
          color: #635053;
          line-height: 1.5;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .btn-choice-resdiary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 20px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          border-radius: 9999px;
          transition: all 0.25s ease;
        }

        .btn-choice-resdiary:hover {
          background: #7D1417;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        .btn-choice-enquire {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 20px;
          background: #FAF2F3;
          color: #94181B;
          border: 1.5px solid #94181B;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          border-radius: 9999px;
          transition: all 0.25s ease;
        }

        .btn-choice-enquire:hover {
          background: #94181B;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* MENU ATTACHMENTS */
        .menu-attachments-section {
          padding: 60px 0;
          background: #FFFFFF;
          border-bottom: 1px solid #F0CED2;
        }

        .section-header-block {
          max-width: 720px;
          margin: 0 auto 40px auto;
        }

        .section-eyebrow {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #94181B;
          display: inline-block;
          margin-bottom: 8px;
        }

        .section-heading {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 400;
          margin: 0 0 12px 0;
          color: #241719;
        }

        .section-desc {
          font-size: 0.96rem;
          line-height: 1.65;
          color: #635053;
          margin: 0;
        }

        .attachments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 22px;
          margin-bottom: 35px;
        }

        .attachment-card {
          background: #FAF2F3;
          border: 1px solid #F0CED2;
          border-radius: 14px;
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .attachment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(148, 24, 27, 0.12);
          border-color: #94181B;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .card-badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #94181B;
          border: 1px solid #F0CED2;
        }

        .card-icon {
          font-size: 1.25rem;
          color: #94181B;
        }

        .card-title {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.55rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #241719;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #635053;
          line-height: 1.5;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .card-actions-row {
          display: flex;
          gap: 10px;
        }

        .btn-download-attachment {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-download-attachment:hover {
          background: #7D1417;
        }

        .btn-view-attachment {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          background: #FFFFFF;
          color: #574447;
          border: 1px solid #D6B2B6;
          font-size: 0.74rem;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-view-attachment:hover {
          border-color: #94181B;
          color: #94181B;
        }

        .btn-browse-full-menu {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 30px;
          background: #FAF2F3;
          border: 1.5px solid #94181B;
          color: #94181B;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-browse-full-menu:hover {
          background: #94181B;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.25);
        }

        /* FORM & SPECS SECTION */
        .form-specs-section {
          padding: 60px 0 80px 0;
          background: #FAF2F3;
        }

        .form-specs-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.95fr;
          gap: 40px;
          align-items: start;
        }

        .enquiry-form-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #F0CED2;
          box-shadow: 0 8px 30px rgba(36, 23, 25, 0.06);
        }

        .form-eyebrow {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #94181B;
          display: inline-block;
          margin-bottom: 8px;
        }

        .form-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 2.2rem;
          font-weight: 500;
          margin: 0 0 10px 0;
          color: #241719;
        }

        .form-desc {
          font-size: 0.94rem;
          line-height: 1.6;
          color: #635053;
          margin: 0 0 30px 0;
        }

        .actual-enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-row.full-width {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .actual-enquiry-form label {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #3C312D;
        }

        .actual-enquiry-form input,
        .actual-enquiry-form select,
        .actual-enquiry-form textarea {
          width: 100%;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 0.92rem;
          color: #241719;
          background: #FAF7F4;
          border: 1px solid #E5D5D8;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .actual-enquiry-form input:focus,
        .actual-enquiry-form select:focus,
        .actual-enquiry-form textarea:focus {
          border-color: #94181B;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(148, 24, 27, 0.12);
        }

        .btn-submit-enquiry {
          margin-top: 10px;
          padding: 15px 30px;
          background: #94181B;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        .btn-submit-enquiry:hover {
          background: #7D1417;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.5);
        }

        /* SUCCESS STATE */
        .form-success-alert {
          background: #F7FAF5;
          border: 1.5px solid #82A374;
          border-radius: 12px;
          padding: 30px 24px;
          text-align: center;
        }

        .success-icon {
          font-size: 2.5rem;
          color: #4A7A3A;
          margin-bottom: 12px;
        }

        .form-success-alert h3 {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.8rem;
          color: #241719;
          margin: 0 0 10px 0;
        }

        .form-success-alert p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #574447;
          margin: 0 0 20px 0;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .btn-email-fallback {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #94181B;
          color: #FFFFFF;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
        }

        .btn-send-another {
          background: none;
          border: none;
          color: #94181B;
          font-weight: 700;
          font-size: 0.84rem;
          cursor: pointer;
          text-decoration: underline;
        }

        /* VENUE HIGHLIGHTS RIGHT COLUMN */
        .venue-highlights-card {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .venue-specs-box {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 32px 28px;
          border: 1px solid #F0CED2;
        }

        .specs-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #94181B;
          display: block;
          margin-bottom: 6px;
        }

        .specs-title {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.65rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #241719;
        }

        .specs-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-item {
          background: #FAF2F3;
          border: 1px solid #F0CED2;
          border-radius: 12px;
          padding: 16px;
        }

        .stat-number {
          display: block;
          font-size: 1.8rem;
          font-weight: 800;
          color: #94181B;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 0.78rem;
          color: #635053;
          line-height: 1.35;
          display: block;
        }

        .highlights-photo-box {
          position: relative;
          height: 220px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(36, 23, 25, 0.08);
        }

        .highlights-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .highlights-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          background: linear-gradient(180deg, transparent 0%, rgba(20, 14, 16, 0.85) 100%);
          color: #FFFFFF;
        }

        .highlights-overlay strong {
          display: block;
          font-size: 1rem;
          letter-spacing: 0.06em;
        }

        .highlights-overlay p {
          margin: 2px 0 0 0;
          font-size: 0.78rem;
          opacity: 0.88;
        }

        .quick-contact-box {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 26px;
          border: 1px solid #F0CED2;
        }

        .quick-contact-box h4 {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.35rem;
          margin: 0 0 6px 0;
          color: #241719;
        }

        .quick-contact-box p {
          font-size: 0.88rem;
          color: #635053;
          margin: 0 0 14px 0;
        }

        .btn-contact-email {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94181B;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .form-specs-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .enquiry-form-card {
            padding: 26px 20px;
          }
        }
      `}</style>
    </div>
  );
}
