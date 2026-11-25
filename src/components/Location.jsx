import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

const SCHEDULE = [
  { day: 'Monday', short: 'Mon', open: '05:00 pm', close: '09:30 pm', note: 'Dinner' },
  { day: 'Tuesday', short: 'Tue', open: '05:00 pm', close: '09:30 pm', note: 'Dinner' },
  { day: 'Wednesday', short: 'Wed', open: '05:00 pm', close: '09:30 pm', note: 'Dinner' },
  { day: 'Thursday', short: 'Thu', open: '05:00 pm', close: '09:30 pm', note: 'Dinner' },
  { day: 'Friday', short: 'Fri', open: '12:00 pm', close: '10:00 pm', note: 'Lunch, Sunset & Dinner', isWeekend: true },
  { day: 'Saturday', short: 'Sat', open: '12:00 pm', close: '10:00 pm', note: 'All-Day Dining', isWeekend: true },
  { day: 'Sunday', short: 'Sun', open: '12:00 pm', close: '09:30 pm', note: 'All-Day Dining', isWeekend: true }
];

export default function Location({ onOpenBook }) {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Baskk+Italian+52-58+Marine+Parade+Coolangatta+QLD+4225+Australia";
  
  // Detect current day for active day badge
  const dayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const currentScheduleIndex = dayIndex === 0 ? 6 : dayIndex - 1;

  return (
    <section className="location-section" ref={containerRef} id="location">
      <div className="container">
        
        {/* Section Header */}
        <div className="location-header-block text-center" data-reveal="text">
          <span className="editorial-label">BEACHFRONT SANCTUARY &bull; MARINE PARADE</span>
          <h2 className="editorial-heading">Trading Hours &amp; Location</h2>
          <p className="location-sub-text">
            Join us on Marine Parade right across Coolangatta Beach for freshly made pizzas prepared with our house-made dough, handcrafted pasta, and ocean-view cocktails.
          </p>
        </div>

        <div className="location-grid">
          
          {/* Left Column: Address, Contact & Beachfront Visual */}
          <div className="location-info-col" data-reveal="text">
            
            {/* Contact Details Card */}
            <div className="location-card-box">
              <h3 className="card-box-title">Find Us on the Beach</h3>

              <div className="info-item-row">
                <span className="info-icon-badge">
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                <div className="info-item-content">
                  <span className="info-label-mini">ADDRESS</span>
                  <p className="info-value-text">
                    52–58 Marine Parade, Coolangatta, QLD 4225, Australia
                  </p>
                </div>
              </div>



              <div className="info-item-row">
                <span className="info-icon-badge">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <div className="info-item-content">
                  <span className="info-label-mini">EMAIL INQUIRIES</span>
                  <p className="info-value-text">
                    <a href="mailto:request@baskk.co">request@baskk.co</a>
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="location-cta-row">
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-get-directions"
                  aria-label="Get directions on Google Maps"
                >
                  <span>GET DIRECTIONS</span>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>

                <a 
                  href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-book-cta"
                  style={{ textDecoration: 'none' }}
                >
                  <span>BOOK A TABLE</span>
                  <i className="fa-solid fa-calendar-days"></i>
                </a>
              </div>
            </div>

            {/* Beachfront Atmosphere Visual */}
            <div className="minimal-map-card" data-reveal="clip">
              <img 
                src="/baskk-photos/DSC_0162.JPG" 
                alt="Baskk Coolangatta Beachfront Atmosphere" 
                className="map-card-img"
              />
              <div className="map-card-overlay"></div>
              <div className="map-pin-badge">
                <div className="pin-pulse"></div>
                <div className="pin-text">
                  <strong>BASKK</strong>
                  <small>Marine Parade, Coolangatta Beach</small>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Weekly Trading Hours Schedule Showcase */}
          <div className="location-hours-col" data-reveal="text">
            
            <div className="hours-showcase-card">
              
              {/* Card Header with Status Badge */}
              <div className="hours-card-header">
                <div>
                  <span className="hours-card-eyebrow">WEEKLY SCHEDULE</span>
                  <h3 className="hours-card-title">Trading Hours</h3>
                </div>
                <div className="hours-live-status">
                  <span className="status-dot"></span>
                  <span>WELCOME DAILY</span>
                </div>
              </div>

              {/* Schedule Rows */}
              <div className="schedule-table-wrap">
                {SCHEDULE.map((item, idx) => {
                  const isToday = idx === currentScheduleIndex;
                  return (
                    <div key={item.day} className={`schedule-day-row ${isToday ? 'is-today' : ''}`}>
                      <div className="schedule-day-col">
                        <span className="day-full">{item.day}</span>
                        {isToday && <span className="today-badge">TODAY</span>}
                      </div>

                      <div className="schedule-time-col">
                        <span className="time-range">
                          {item.open} &mdash; {item.close}
                        </span>
                        <span className="time-note">{item.note}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Happy Hour Callout Banner */}
              <div className="hours-happy-banner">
                <div className="happy-icon-wrap">
                  <i className="fa-solid fa-martini-glass-citrus"></i>
                </div>
                <div className="happy-text-wrap">
                  <span className="happy-title">HAPPY HOUR — 2 FOR $26 COCKTAILS &amp; $12 BITES</span>
                  <p className="happy-desc">
                    Every Friday to Sunday from <strong>3:00 PM to 5:00 PM</strong>. 2-for-$26 signature cocktails, $10 beers &amp; wines, and $12 bites by the sea.
                  </p>
                </div>
              </div>

              {/* Order & Booking Action Bar */}
              <div className="hours-action-bar">
                <a 
                  href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hours-book"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>RESERVE YOUR TABLE</span>
                </a>

                <a 
                  href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hours-order"
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span>ORDER ONLINE</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      <style>{`
        .location-section {
          background-color: var(--color-blush-bg, #FAF2F3);
          color: var(--color-text-dark, #241719);
          position: relative;
          overflow: hidden;
          padding: 40px 0 80px 0;
        }

        .location-header-block {
          max-width: 720px;
          margin: 0 auto 36px auto;
        }

        .location-sub-text {
          font-size: 1.05rem;
          color: var(--color-text-muted, #665255);
          line-height: 1.65;
          margin-top: 14px;
        }

        .location-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: flex-start;
        }

        /* =========================================================
           LEFT COLUMN: DETAILS & BEACHFRONT PHOTO
           ========================================================= */
        .location-info-col {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .location-card-box {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 36px 32px;
          border: 1px solid #F0CED2;
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.05);
        }

        .card-box-title {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.6rem;
          color: #94181B;
          margin: 0 0 24px 0;
          font-weight: 600;
        }

        .info-item-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .info-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FCE8ED;
          color: #9C3353;
          border: 1px solid #F3BDC8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-item-content {
          display: flex;
          flex-direction: column;
        }

        .info-label-mini {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #9C3353;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .info-value-text {
          font-size: 0.98rem;
          color: #2E1E23;
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
        }

        .info-value-text a {
          color: #2E1E23;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .info-value-text a:hover {
          color: #9C3353;
          text-decoration: underline;
        }

        .location-cta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #F8DFE3;
          flex-wrap: wrap;
        }

        .btn-get-directions {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 24px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          border-radius: 9999px;
          border: 1px solid #7A1215;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.25);
        }

        .btn-get-directions:hover {
          background: #7A1215;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(148, 24, 27, 0.35);
        }

        .btn-book-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 24px;
          background: #FAF2F3;
          border: 1.5px solid #E8A0A8;
          color: #94181B;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-book-cta:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
          transform: translateY(-2px);
        }

        /* Minimal Map Card */
        .minimal-map-card {
          position: relative;
          height: 240px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.08);
          border: 1px solid #F0CED2;
        }

        .map-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.95);
        }

        .map-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(36, 23, 25, 0.6) 100%);
        }

        .map-pin-badge {
          position: absolute;
          bottom: 18px;
          left: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          color: #241719;
          padding: 12px 18px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #F0CED2;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .pin-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #94181B;
          box-shadow: 0 0 10px #94181B;
          animation: pulsePin 2s infinite ease-in-out;
          flex-shrink: 0;
        }

        @keyframes pulsePin {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .pin-text {
          display: flex;
          flex-direction: column;
        }

        .pin-text strong {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          color: #241719;
        }

        .pin-text small {
          font-size: 0.72rem;
          color: #94181B;
          letter-spacing: 0.06em;
        }

        /* =========================================================
           RIGHT COLUMN: TRADING HOURS SHOWCASE CARD
           ========================================================= */
        .hours-showcase-card {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 38px 34px;
          border: 1.5px solid #F0CED2;
          box-shadow: 0 14px 40px rgba(148, 24, 27, 0.08);
          position: relative;
        }

        .hours-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          padding-bottom: 18px;
          border-bottom: 1px solid #F8DFE3;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hours-card-eyebrow {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #9C3353;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .hours-card-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 2.1rem;
          font-weight: 600;
          color: #241719;
          margin: 0;
          line-height: 1.1;
        }

        .hours-live-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: #E8F5E9;
          color: #2E7D32;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          border: 1px solid rgba(46, 125, 50, 0.2);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2E7D32;
          box-shadow: 0 0 6px #2E7D32;
        }

        /* Schedule Day Rows */
        .schedule-table-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .schedule-day-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-radius: 8px;
          background: #FAF7F8;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .schedule-day-row:hover {
          background: #FCE8ED;
          border-color: #F0CED2;
        }

        .schedule-day-row.is-today {
          background: #FCE8ED;
          border-color: #E8A0A8;
          box-shadow: 0 2px 10px rgba(156, 51, 83, 0.08);
        }

        .schedule-day-col {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .day-full {
          font-weight: 700;
          color: #2E1E23;
          font-size: 0.96rem;
        }

        .today-badge {
          font-size: 0.62rem;
          font-weight: 800;
          background: #94181B;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.08em;
        }

        .schedule-time-col {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .time-range {
          font-size: 0.94rem;
          font-weight: 600;
          color: #2E1E23;
          letter-spacing: 0.02em;
        }

        .time-note {
          font-size: 0.72rem;
          color: #9C3353;
          font-weight: 600;
        }

        /* Happy Hour Banner */
        .hours-happy-banner {
          background: linear-gradient(135deg, #FFF0F3 0%, #FDE4EB 100%);
          border: 1px dashed #E8A0A8;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .happy-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #9C3353;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(156, 51, 83, 0.25);
        }

        .happy-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .happy-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #9C3353;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .happy-desc {
          font-size: 0.86rem;
          color: #4A343A;
          margin: 0;
          line-height: 1.4;
        }

        .happy-desc strong {
          color: #241719;
        }

        /* Hours Action Bar */
        .hours-action-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .btn-hours-book,
        .btn-hours-order {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          text-align: center;
        }

        .btn-hours-book {
          background: #94181B;
          color: #FFFFFF;
          border: 1px solid #7A1215;
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.25);
        }

        .btn-hours-book:hover {
          background: #7A1215;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(148, 24, 27, 0.35);
        }

        .btn-hours-order {
          background: #FCE8ED;
          color: #9C3353;
          border: 1px solid #E8A0A8;
        }

        .btn-hours-order:hover {
          background: #9C3353;
          color: #FFFFFF;
          border-color: #9C3353;
          transform: translateY(-2px);
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS
           ========================================================= */
        @media (max-width: 992px) {
          .location-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hours-showcase-card {
            padding: 30px 22px;
          }
        }

        @media (max-width: 768px) {
          .location-section {
            padding: 25px 0 50px 0;
          }
          .location-header-block {
            margin-bottom: 24px;
          }
        }

        @media (max-width: 600px) {
          .location-card-box {
            padding: 24px 18px;
          }
          .hours-action-bar {
            grid-template-columns: 1fr;
          }
          .schedule-day-row {
            padding: 8px 12px;
          }
          .day-full {
            font-size: 0.88rem;
          }
          .time-range {
            font-size: 0.86rem;
          }
          .hours-happy-banner {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
