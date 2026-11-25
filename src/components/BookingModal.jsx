import React, { useState, useEffect } from 'react';

export default function BookingModal({ isOpen, onClose }) {
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('17:00');
  const [seating, setSeating] = useState('terrace');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const orderId = `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const savedSheetUrl = localStorage.getItem('baskk_google_sheet_webapp_url') || '';
    const seatingLabel =
      seating === 'terrace'
        ? 'Alfresco Ocean Terrace'
        : seating === 'indoor'
          ? 'Main Dining Room'
          : 'Cocktail Lounge Bar';

    try {
      const prev = JSON.parse(localStorage.getItem('baskk_orders_ledger_v1') || '[]');
      localStorage.setItem('baskk_orders_ledger_v1', JSON.stringify([{
        orderId,
        createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        orderType: 'Table Reservation',
        status: 'New',
        customerName: name || 'Valued Guest',
        email,
        phone,
        guests: `${guests} People`,
        bookingDate: date,
        bookingTime: time,
        eventType: 'Table Reservation',
        seatingArea: seatingLabel,
        menuPreference: 'A La Carte Dining',
        additionalDetails: notes || 'None',
        adminNotes: ''
      }, ...prev]));
    } catch (_) {}

    fetch('/api/booking-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        orderId,
        orderType: 'Table Reservation',
        customerName: name || 'Valued Guest',
        email,
        phone,
        guests,
        bookingDate: date,
        bookingTime: time,
        eventType: 'Table Reservation',
        seatingArea: seatingLabel,
        menuPreference: 'A La Carte Dining',
        additionalDetails: notes || 'None',
        sheetsWebhookUrl: savedSheetUrl
      })
    }).catch(() => {});

    window.open('https://booking.resdiary.com/widget/Standard/BaskkItalian/11276', '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
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
          aria-label="Close Reservation Window"
        >
          &times;
        </button>
        
        {submitted ? (
          <div className="modal-success-state text-center">
            <i className="fa-solid fa-circle-check success-icon"></i>
            <h2>RESERVATION CONFIRMED</h2>
            <p>Thank you {name || 'Guest'}. Your table for {guests} guests on {date} at {time} has been reserved at Baskk.</p>
          </div>
        ) : (
          <>
            <div className="modal-header-text text-center">
              <span className="modal-sub">TABLE RESERVATION</span>
              <h2>Reserve Your Table</h2>
              <p>
                Join us on Marine Parade for beachfront dining. 
                <br />
                <a 
                  href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#94181B', fontSize: '0.84rem', fontWeight: '700', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}
                >
                  Or Order Online / Pickup Menu <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem', marginLeft: '4px' }}></i>
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group half">
                  <label>Guests</label>
                  <select value={guests} onChange={(e) => setGuests(e.target.value)} required>
                    <option value="2">2 Guests</option>
                    <option value="1">1 Person</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6+">6+ Guests (Group)</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Time Slot</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)} required>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Seating Preference</label>
                  <select value={seating} onChange={(e) => setSeating(e.target.value)}>
                    <option value="terrace">Alfresco Ocean Terrace</option>
                    <option value="indoor">Main Dining Room</option>
                    <option value="lounge">Cocktail Lounge Bar</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Email Address</label>
                  <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group half">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="0400 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label>Special Dietary Needs / Notes</label>
                <textarea placeholder="High chair, birthday, allergy notes..." rows="2" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn-modal-submit">
                CONFIRM RESERVATION
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
          background-color: rgba(36, 23, 25, 0.75);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }

        .modal-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        .modal-container {
          background-color: var(--color-blush-bg, #FAF2F3);
          width: 90%;
          max-width: 580px;
          max-height: 86vh;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          touch-action: pan-y !important;
          border-radius: var(--radius-md);
          padding: 36px 36px 44px 36px;
          position: relative;
          box-shadow: 0 20px 50px rgba(148, 24, 27, 0.18);
          border: 1px solid var(--color-blush-border, #F0CED2);
          color: var(--color-text-dark, #241719);
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

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 1.8rem;
          color: var(--color-text-dark, #241719);
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal-header-text h2 {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--color-text-dark, #241719);
          margin-bottom: 4px;
        }

        .modal-sub {
          font-size: 0.688rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--color-crimson, #94181B);
          display: block;
          margin-bottom: 8px;
        }

        .modal-header-text p {
          font-size: 0.938rem;
          color: var(--color-text-muted, #665255);
          margin-bottom: 24px;
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
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-dark, #241719);
          margin-bottom: 6px;
        }

        .modal-form input, .modal-form select, .modal-form textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--color-blush-border, #F0CED2);
          border-radius: var(--radius-sm);
          background-color: var(--color-white);
          font-size: 0.938rem;
          color: var(--color-text-dark, #241719);
          outline: none;
        }

        .modal-form input:focus, .modal-form select:focus, .modal-form textarea:focus {
          border-color: var(--color-crimson, #94181B);
        }

        .btn-modal-submit {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: var(--color-white);
          border: none;
          font-size: 0.813rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          border-radius: var(--radius-pill);
          margin-top: 12px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.4);
          transition: all 0.3s ease;
        }

        .btn-modal-submit:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(148, 24, 27, 0.6);
        }

        .success-icon {
          font-size: 3.5rem;
          color: #2e7d32;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .modal-container {
            padding: 24px;
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
