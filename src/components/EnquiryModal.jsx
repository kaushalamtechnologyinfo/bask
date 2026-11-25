import React, { useState, useEffect } from 'react';

export default function EnquiryModal({ isOpen, onClose, onSuccess }) {
  const [eventType, setEventType] = useState('birthday');
  const [guests, setGuests] = useState('30');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [budget, setBudget] = useState('$100 - $150 / person');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const guestCount = guests ? String(guests).replace(/[^0-9]/g, '') || guests : '20';
    const numberOfGuestsFormatted = `${guestCount} People`;

    const enquiryPayload = {
      customerName: name,
      email,
      phone,
      guests,
      numberOfGuests: numberOfGuestsFormatted,
      bookingDate: date,
      bookingTime: 'Dinner / Evening',
      eventType,
      additionalDetails: notes || 'None',
      budget
    };

    // 1. Dispatch to serverless backend API (GoDaddy SMTP + Admin CMS + Google Sheets)
    try {
      const orderId = `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const savedSheetUrl = localStorage.getItem('baskk_google_sheet_webapp_url') || '';
      const fullPayload = { ...enquiryPayload, orderId, orderType: 'Private Event Modal', sheetsWebhookUrl: savedSheetUrl };

      try {
        const rawOrders = localStorage.getItem('baskk_orders_ledger_v1');
        const list = rawOrders ? JSON.parse(rawOrders) : [];
        list.unshift({
          orderId,
          createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderType: 'Private Event Modal',
          status: 'New',
          customerName: enquiryPayload.customerName,
          email: enquiryPayload.email,
          phone: enquiryPayload.phone,
          guests: numberOfGuestsFormatted,
          bookingDate: enquiryPayload.bookingDate,
          bookingTime: enquiryPayload.bookingTime,
          eventType: enquiryPayload.eventType,
          seatingArea: 'Private Event Space',
          menuPreference: budget,
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

    // 2. Also send to FormSubmit as backup with exact required fields
    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Function Modal Enquiry (${numberOfGuestsFormatted}) - ${name}`,
          _template: 'table',
          "Number of Guests": numberOfGuestsFormatted,
          "Booking Date": date,
          "Booking Time": 'Dinner / Evening',
          "Customer Name": name,
          "Email Address": email,
          "Phone Number": phone,
          "Event Type": eventType,
          "Budget": budget,
          "Any additional booking details": notes || 'None',
          _captcha: 'false'
        })
      });
    } catch(err) {
      console.warn('Form submission network fallback:', err);
    }
    if (typeof onSuccess === 'function') {
      try {
        onSuccess('Enquiry Received!', `Thank you ${name}. Our events manager will contact you shortly.`);
      } catch (err) {
        console.error(err);
      }
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div 
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-container" 
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="modal-close-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close Enquiry Window"
        >
          &times;
        </button>
        
        {submitted ? (
          <div className="modal-success-state text-center">
            <i className="fa-solid fa-circle-check success-icon"></i>
            <h2>ENQUIRY RECEIVED</h2>
            <p>Thank you {name || 'Guest'}. Our events coordinator will contact you shortly regarding your {eventType} function on {date}.</p>
          </div>
        ) : (
          <>
            <div className="modal-header-text text-center">
              <span className="modal-sub">PRIVATE EVENTS &amp; FUNCTIONS</span>
              <h2>Book Your Function</h2>
              <p>Host your birthdays, weddings, corporate events, or cocktail parties overlooking Kirra Beachfront at Baskk.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group half">
                  <label>Event Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
                    <option value="birthday">Birthday Party Celebration</option>
                    <option value="wedding">Wedding Reception / Dinner</option>
                    <option value="corporate">Corporate Function</option>
                    <option value="cocktail">Cocktail &amp; Canapé Event</option>
                    <option value="private-dining">Private Dining Room</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Estimated Guests</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="200" 
                    placeholder="e.g. 30" 
                    value={guests} 
                    onChange={(e) => setGuests(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group half">
                  <label>Budget Per Person</label>
                  <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="$75 - $100 / person">$75 - $100 / person</option>
                    <option value="$100 - $150 / person">$100 - $150 / person</option>
                    <option value="$150+ / person (Premium)">$150+ / person (Premium)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah Jenkins" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="sarah@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group half">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="0400 000 000" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Vision &amp; Special Requests</label>
                <textarea 
                  placeholder="Tell us about your celebration vision, catering preferences, or special requests..." 
                  rows="3" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-modal-submit">
                SUBMIT EVENT ENQUIRY
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(36, 23, 25, 0.78);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        .modal-container {
          background-color: #FAF2F3;
          width: 92%;
          max-width: 580px;
          max-height: 86vh;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          touch-action: pan-y !important;
          border-radius: 20px;
          padding: 36px 36px 44px 36px;
          position: relative;
          box-shadow: 0 24px 60px rgba(148, 24, 27, 0.22);
          border: 1px solid #F0CED2;
          color: #241719;
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Custom Sleek Scrollbar */
        .modal-container::-webkit-scrollbar {
          width: 6px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: rgba(148, 24, 27, 0.04);
          border-radius: 10px;
          margin: 14px 0;
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: #D9AAB0;
          border-radius: 10px;
        }

        .modal-container::-webkit-scrollbar-thumb:hover {
          background: #94181B;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 20px;
          font-size: 2rem;
          line-height: 1;
          color: #7A6265;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          padding: 4px 8px;
        }

        .modal-close-btn:hover {
          color: #94181B;
          transform: scale(1.15);
        }

        .modal-header-text h2 {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 2.2rem;
          color: #241719;
          margin: 0 0 6px 0;
          font-weight: 600;
        }

        .modal-sub {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #94181B;
          display: block;
          margin-bottom: 8px;
        }

        .modal-header-text p {
          font-size: 0.92rem;
          color: #665255;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .modal-form .form-row {
          display: flex;
          gap: 16px;
        }

        .modal-form .form-group {
          margin-bottom: 16px;
        }

        .modal-form .half {
          flex: 1;
        }

        .modal-form label {
          display: block;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #241719;
          margin-bottom: 6px;
        }

        .modal-form input, 
        .modal-form select, 
        .modal-form textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #F0CED2;
          border-radius: 8px;
          background-color: #FFFFFF;
          font-size: 0.92rem;
          color: #241719;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .modal-form input:focus, 
        .modal-form select:focus, 
        .modal-form textarea:focus {
          border-color: #94181B;
          box-shadow: 0 0 0 3px rgba(148, 24, 27, 0.12);
        }

        .btn-modal-submit {
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #FFFFFF;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          border-radius: 50px;
          margin-top: 8px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(148, 24, 27, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-modal-submit:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(148, 24, 27, 0.5);
        }

        .modal-success-state {
          padding: 40px 20px;
          text-align: center;
        }

        .success-icon {
          font-size: 3.5rem;
          color: #10B981;
          margin-bottom: 16px;
          display: inline-block;
        }

        .modal-success-state h2 {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 2.1rem;
          color: #241719;
          margin-bottom: 10px;
        }

        .modal-success-state p {
          color: #665255;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .modal-container {
            padding: 28px 20px;
            width: 95%;
          }
          .modal-form .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
