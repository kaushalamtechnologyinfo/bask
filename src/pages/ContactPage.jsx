import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MagneticButton from '../components/MagneticButton';

export default function ContactPage({ onOpenBook }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Dinner Reservation',
    guests: '2',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const guestCount = formData.guests ? String(formData.guests).replace(/[^0-9]/g, '') || formData.guests : '2';
    const numberOfGuestsFormatted = `${guestCount} People`;

    const enquiryPayload = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests,
      numberOfGuests: numberOfGuestsFormatted,
      bookingDate: formData.date || 'Not specified',
      bookingTime: 'Dinner / Evening',
      eventType: formData.eventType,
      additionalDetails: formData.message || 'No additional notes'
    };

    try {
      const orderId = `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const savedSheetUrl = localStorage.getItem('baskk_google_sheet_webapp_url') || '';
      const fullPayload = { ...enquiryPayload, orderId, orderType: 'Contact / Dining Enquiry', sheetsWebhookUrl: savedSheetUrl };

      try {
        const rawOrders = localStorage.getItem('baskk_orders_ledger_v1');
        const list = rawOrders ? JSON.parse(rawOrders) : [];
        list.unshift({
          orderId,
          createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderType: 'Contact / Dining Enquiry',
          status: 'New',
          customerName: enquiryPayload.customerName,
          email: enquiryPayload.email,
          phone: enquiryPayload.phone,
          guests: numberOfGuestsFormatted,
          bookingDate: enquiryPayload.bookingDate,
          bookingTime: enquiryPayload.bookingTime,
          eventType: enquiryPayload.eventType,
          seatingArea: 'Main Dining / Terrace',
          menuPreference: 'Standard Menu',
          additionalDetails: enquiryPayload.additionalDetails,
          adminNotes: ''
        });
        localStorage.setItem('baskk_orders_ledger_v1', JSON.stringify(list));
      } catch (_) {}

      await fetch('/api/booking-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fullPayload)
      });
    } catch (apiErr) {
      console.warn('API route dispatch note:', apiErr);
    }

    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Contact / Function Enquiry (${numberOfGuestsFormatted}) - ${formData.name}`,
          _template: 'table',
          "Number of Guests": numberOfGuestsFormatted,
          "Booking Date": formData.date || 'Not specified',
          "Booking Time": 'Dinner / Evening',
          "Customer Name": formData.name,
          "Email Address": formData.email,
          "Phone Number": formData.phone,
          "Event Type": formData.eventType,
          "Any additional booking details": formData.message || 'No additional notes',
          _captcha: 'false'
        })
      });
    } catch(err) {
      console.warn('Contact form network fallback:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-page-wrap">
      <Navbar onOpenBook={onOpenBook} />

      <main className="contact-main-content">
        {/* Banner */}
        <section className="contact-hero-banner">
          <div className="container">
            <span className="contact-eyebrow">GET IN TOUCH</span>
            <h1 className="contact-main-title">
              CONTACT US & <br />
              <span className="title-accent">FUNCTIONS INQUIRIES</span>
            </h1>
            <p className="contact-hero-lead">
              Located on Marine Parade right across from Coolangatta Beach. We would love to welcome you!
            </p>
          </div>
        </section>

        {/* Contact Details & Inquiry Form Section */}
        <section className="contact-body-section section-padding">
          <div className="container">
            <div className="contact-grid">
              {/* Left Column: Location Info & Hours */}
              <div className="contact-info-card">
                <span className="info-badge">VISIT BASKK</span>
                <h2 className="info-title">Beachfront Restaurant & Bar</h2>
                <p className="info-lead">
                  Whether you're visiting for a casual beachfront spritz, a long lunch, an intimate dinner, 
                  or planning a private milestone celebration, here is everything you need to find us.
                </p>

                <div className="contact-details-list">
                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <strong>Address</strong>
                      <p>52–58 Marine Parade, Coolangatta, QLD 4225, Australia</p>
                    </div>
                  </div>



                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <strong>Email Inquiries</strong>
                      <p><a href="mailto:request@baskk.co">request@baskk.co</a></p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                      <strong>Verified Trading Hours</strong>
                      <div className="hours-table">
                        <div className="hours-row">
                          <span>Monday – Thursday:</span>
                          <span>5:00 PM – 9:30 PM</span>
                        </div>
                        <div className="hours-row">
                          <span>Friday:</span>
                          <span>3:00 PM – 10:00 PM <small>(Happy Hour 3–5PM)</small></span>
                        </div>
                        <div className="hours-row">
                          <span>Saturday:</span>
                          <span>12:00 PM – 10:00 PM <small>(Happy Hour 3–5PM)</small></span>
                        </div>
                        <div className="hours-row">
                          <span>Sunday:</span>
                          <span>12:00 PM – 9:30 PM <small>(Happy Hour 3–5PM)</small></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct External Action Buttons */}
                <div className="contact-external-actions">
                  <a 
                    href="mailto:request@baskk.co" 
                    className="btn-link-action btn-call-featured"
                  >
                    <i className="fa-solid fa-envelope"></i>
                    <span>Email Us: request@baskk.co</span>
                  </a>

                  <a 
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link-action"
                  >
                    <i className="fa-regular fa-calendar-check"></i>
                    <span>Book Table (ResDiary)</span>
                  </a>

                  <a 
                    href="https://www.instagram.com/baskkitaliangc/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link-action"
                  >
                    <i className="fa-brands fa-instagram"></i>
                    <span>Instagram @baskkitaliangc</span>
                  </a>

                  <a 
                    href="https://www.facebook.com/baskkitalian" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link-action"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                    <span>Facebook @baskkitalian</span>
                  </a>

                  <a 
                    href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link-action"
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                    <span>Order Online (HungryHungry)</span>
                  </a>

                  <a 
                    href="https://www.agfg.com.au/restaurant/bask-115695" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link-action"
                  >
                    <img src="/agfg-badge.svg" alt="AGFG" className="agfg-tiny-icon" />
                    <span>Write Review on AGFG</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Functions & Booking Inquiry Form */}
              <div className="contact-form-card">
                <span className="form-eyebrow">FUNCTIONS & GENERAL INQUIRIES</span>
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-sub">
                  Planning an event? Let us make it unforgettable! Fill out the inquiry form below, 
                  and one of our friendly team members will be in touch with you shortly.
                </p>

                {submitted ? (
                  <div className="form-success-box">
                    <i className="fa-solid fa-circle-check"></i>
                    <h3>Grazie! We have received your inquiry.</h3>
                    <p>One of our friendly team members will contact you within 24 hours.</p>
                    <button 
                      type="button" 
                      className="btn-reset-form"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="inquiry-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Sofia Rossi"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="e.g. sofia@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="e.g. 0400 000 000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Event Type</label>
                        <select 
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        >
                          <option value="Dinner Reservation">Dinner Reservation</option>
                          <option value="Lunch Celebration">Lunch Celebration</option>
                          <option value="Birthday Party">Birthday Party</option>
                          <option value="Wedding / Engagement">Wedding / Engagement</option>
                          <option value="Corporate Function">Corporate Function</option>
                          <option value="Cocktails & Drinks">Cocktails & Drinks Gathering</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Preferred Date</label>
                        <input 
                          type="date" 
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Estimated Guests</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="200" 
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Message or Special Requirements</label>
                      <textarea 
                        rows="4" 
                        placeholder="Tell us more about your dietary preferences or celebration..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-form-submit" disabled={isSubmitting}>
                      <span>{isSubmitting ? 'SENDING INQUIRY...' : 'SUBMIT INQUIRY'}</span>
                      <i className={isSubmitting ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paper-plane"}></i>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        .contact-page-wrap {
          background-color: #FAF2F3;
          min-height: 100vh;
        }

        .contact-hero-banner {
          background: #242223;
          color: #FFFFFF;
          padding: 150px 0 70px 0;
          text-align: center;
          border-bottom: 1px solid rgba(232, 160, 168, 0.2);
        }

        .contact-eyebrow {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #E63980;
          display: inline-block;
          margin-bottom: 14px;
        }

        .contact-main-title {
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          line-height: 1.15;
          margin: 0 0 16px 0;
        }

        .title-accent {
          font-style: italic;
          color: #E8A0A8;
        }

        .contact-hero-lead {
          font-size: 1.1rem;
          color: #D6C2C5;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .section-padding {
          padding: 80px 0 100px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
        }

        /* Info Card */
        .contact-info-card {
          background: #FFFFFF;
          border: 1px solid #E8A0A8;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 6px 25px rgba(148, 24, 27, 0.05);
        }

        .info-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #94181B;
          display: block;
          margin-bottom: 10px;
        }

        .info-title {
          font-family: var(--font-serif, serif);
          font-size: 1.8rem;
          color: #241719;
          margin: 0 0 14px 0;
        }

        .info-lead {
          font-size: 0.96rem;
          color: #665255;
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
          margin-bottom: 32px;
        }

        .detail-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(148, 24, 27, 0.08);
          color: #94181B;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.1rem;
        }

        .detail-item strong {
          display: block;
          font-size: 0.95rem;
          color: #241719;
          margin-bottom: 4px;
        }

        .detail-item p {
          font-size: 0.92rem;
          color: #574447;
          line-height: 1.5;
          margin: 0;
        }

        .detail-item a {
          color: #94181B;
          text-decoration: none;
          font-weight: 600;
        }

        .hours-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 6px;
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
          color: #574447;
        }

        .hours-row small {
          color: #E63980;
          font-weight: 600;
        }

        .contact-external-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid #E8A0A8;
          padding-top: 24px;
        }

        .btn-link-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          background: #FAF2F3;
          border: 1px solid #E8A0A8;
          border-radius: 6px;
          color: #241719;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.84rem;
          transition: all 0.2s ease;
        }

        .btn-link-action:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
        }

        .btn-call-featured {
          background: #94181B !important;
          color: #FFFFFF !important;
          border-color: #94181B !important;
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.25);
        }

        .btn-call-featured:hover {
          background: #B31E22 !important;
          transform: translateY(-2px);
        }

        .agfg-tiny-icon {
          height: 22px;
          width: auto;
        }

        /* Form Card */
        .contact-form-card {
          background: #FFFFFF;
          border: 1px solid #E8A0A8;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 6px 25px rgba(148, 24, 27, 0.05);
        }

        .form-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #E63980;
          display: block;
          margin-bottom: 10px;
        }

        .form-title {
          font-family: var(--font-serif, serif);
          font-size: 1.8rem;
          color: #241719;
          margin: 0 0 10px 0;
        }

        .form-sub {
          font-size: 0.95rem;
          color: #665255;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .inquiry-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #241719;
          letter-spacing: 0.02em;
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 12px 14px;
          border: 1px solid #E8A0A8;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.92rem;
          color: #241719;
          background: #FAF2F3;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: #94181B;
          background: #FFFFFF;
        }

        .btn-form-submit {
          margin-top: 10px;
          padding: 16px;
          background: linear-gradient(135deg, #FF4081 0%, #E63980 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.16em;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 18px rgba(230, 57, 128, 0.4);
          transition: transform 0.2s ease;
        }

        .btn-form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(230, 57, 128, 0.6);
        }

        .form-success-box {
          text-align: center;
          padding: 40px 20px;
          background: #FAF2F3;
          border: 1px solid #E8A0A8;
          border-radius: 8px;
        }

        .form-success-box i {
          font-size: 3rem;
          color: #4CAF50;
          margin-bottom: 16px;
        }

        .form-success-box h3 {
          font-family: var(--font-serif, serif);
          font-size: 1.6rem;
          color: #241719;
          margin-bottom: 8px;
        }

        .form-success-box p {
          color: #665255;
          margin-bottom: 20px;
        }

        .btn-reset-form {
          padding: 10px 20px;
          background: #94181B;
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
