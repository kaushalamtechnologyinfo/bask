import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenBook }) {
  const mapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=Baskk+Italian+52-58+Marine+Parade+Coolangatta+QLD+4225+Australia";

  return (
    <footer className="baskk-site-footer" id="contact-footer">
      {/* Background Atmosphere: Subtle Beachfront Cafe Terrace Backdrop */}
      <div className="footer-bg-atmosphere" aria-hidden="true">
        <img 
          src="/baskk-photos/DSC_0389.JPG" 
          alt="" 
          className="footer-bg-cafe-img" 
        />
        <div className="footer-bg-overlay"></div>
      </div>

      {/* Subtle Warm Decorative Top Border */}
      <div className="footer-top-divider" aria-hidden="true"></div>

      <div className="footer-main-container">
        {/* 3-Column Luxury Balanced Grid */}
        <div className="footer-columns-row">

          {/* 1. BRAND COLUMN */}
          <div className="footer-col col-brand">
            <div className="footer-brand-header">
              <Link to="/" className="footer-brand-logo-link" aria-label="Baskk">
                <img 
                  src="/baskk_logo.png" 
                  alt="Baskk" 
                  className="footer-brand-logo-img" 
                />
              </Link>
            </div>

            <div className="footer-tagline-wrap">
              <span className="footer-script-tagline">Modern Italian Dining</span>
            </div>

            <p className="footer-lead-text">
              A taste of modern Italy — freshly crafted Italian cuisine, house-made pasta, pizzas prepared with our house-made dough, and signature cocktails overlooking Coolangatta Beach.
            </p>

            {/* Outlined Circular Social Icons */}
            <div className="footer-social-row">
              <a 
                href="https://www.facebook.com/baskkitalian" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="social-outline-btn"
                title="Follow us on Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              <a 
                href="https://www.instagram.com/baskkitaliangc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="social-outline-btn"
                title="Follow us on Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              {/* TripAdvisor - Reliable Official SVG */}
              <a 
                href="https://www.tripadvisor.com.au/Restaurant_Review-g255335-d12550029-Reviews-Baskk-Coolangatta_Gold_Coast_Queensland.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Tripadvisor"
                className="social-outline-btn social-tripadvisor"
                title="Review us on Tripadvisor"
              >
                <svg width="17" height="17" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                  <path d="M224 80c-51.7 0-97 27.6-122.3 68.7C86.8 139.7 70.8 136 54 136 24.2 136 0 160.2 0 190s24.2 54 54 54c4.8 0 9.4-.6 13.8-1.8C75.2 278.4 116.8 304 165 304c10.8 0 21.2-1.4 31.2-4.1l27.8 48.2 27.8-48.2c10 2.7 20.4 4.1 31.2 4.1 48.2 0 89.8-25.6 97.2-61.8 4.4 1.2 9 1.8 13.8 1.8 29.8 0 54-24.2 54-54s-24.2-54-54-54c-16.8 0-32.8 3.7-47.7 12.7C321 107.6 275.7 80 224 80zm-72 152c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm144 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm-144-64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm144 0c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z"/>
                </svg>
              </a>

              <a 
                href={mapsSearchUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Location on Google Maps"
                className="social-outline-btn"
                title="Find us on Google Maps"
              >
                <i className="fa-solid fa-location-dot"></i>
              </a>
            </div>

            {/* Micro Editorial Badge */}
            <div className="footer-brand-statement-micro">
              <span>GOOD FOOD</span>
              <span className="dot-sep">&bull;</span>
              <span>GREAT COMPANY</span>
              <span className="dot-sep">&bull;</span>
              <span>OCEAN VIEWS</span>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="footer-col col-links">
            <div className="footer-heading-wrap">
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-heading-line"></div>
            </div>

            <ul className="footer-editorial-links">
              <li>
                <Link to="/" className="footer-nav-link">
                  <span className="link-text">Home</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-nav-link">
                  <span className="link-text">About</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/menu" className="footer-nav-link">
                  <span className="link-text">Menu</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/booking-enquiry" className="footer-nav-link">
                  <span className="link-text">Booking Enquiry</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-nav-link">
                  <span className="link-text">Blog</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  <span className="link-text">Book a table</span>
                  <span className="hover-arrow">&rarr;</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  <span className="link-text">Order online</span>
                  <span className="hover-arrow">&rarr;</span>
                </a>
              </li>
              <li>
                <Link to="/gifts" className="footer-nav-link">
                  <span className="link-text">Gift Vouchers ($50, $100, $200)</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">
                  <span className="link-text">Contact Us</span>
                  <span className="hover-arrow">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. CONTACT & CAFE VIEW */}
          <div className="footer-col col-contact">
            <div className="footer-heading-wrap">
              <h3 className="footer-heading">Contact &amp; Location</h3>
              <div className="footer-heading-line"></div>
            </div>

            <div className="footer-contact-list">
              <div className="contact-item-row">
                <span className="contact-icon-badge" aria-hidden="true">
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                <a 
                  href={mapsSearchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-item-link contact-address-link"
                >
                  52–58 Marine Parade, Coolangatta, QLD 4225, Australia
                </a>
              </div>

              <div className="contact-item-row">
                <span className="contact-icon-badge" aria-hidden="true">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <a href="mailto:request@baskk.co" className="contact-item-link">
                  request@baskk.co
                </a>
              </div>


            </div>

            {/* Quick Dining Hours Notice */}
            <div className="footer-hours-quickpill">
              <i className="fa-regular fa-clock"></i>
              <span>Dinner from 5PM Mon–Thu &bull; Lunch &amp; Dinner from 12PM Fri–Sun</span>
            </div>

            {/* Modern Beachfront Cafe & Terrace View Card */}
            <div className="footer-cafe-card">
              <div className="cafe-img-container">
                <img 
                  src="/baskk-photos/about-beach-view.jpg" 
                  alt="Baskk Oceanfront Cafe Terrace & Ocean View" 
                  className="footer-cafe-img"
                  loading="lazy"
                />
                <div className="footer-cafe-overlay">
                  <span className="cafe-view-badge">
                    <i className="fa-solid fa-water"></i>
                    <span>BEACHFRONT CAFE &amp; TERRACE</span>
                  </span>

                  <a 
                    href={mapsSearchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-cafe-map-pill"
                    aria-label="Get Directions to Baskk Cafe"
                  >
                    <span>Directions</span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>
              <div className="cafe-card-footer">
                <i className="fa-solid fa-sun text-crimson"></i>
                <span>Al fresco dining right across Marine Parade &amp; Coolangatta Beach</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. SIGNATURE STRIP WITH FLOATING SEA WAVES */}
      <div className="footer-signature-strip">
        {/* Animated Floating Sea Waves Layer */}
        <div className="floating-sea-waves-container" aria-hidden="true">
          <svg className="floating-sea-wave wave-back" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,35 C280,75 520,10 780,50 C1040,90 1260,20 1440,45 L1440,120 L0,120 Z" fill="rgba(232, 160, 168, 0.35)" />
          </svg>
          <svg className="floating-sea-wave wave-mid" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,55 C220,15 480,80 760,40 C1040,85 1280,25 1440,55 L1440,120 L0,120 Z" fill="rgba(148, 24, 27, 0.09)" />
          </svg>
          <svg className="floating-sea-wave wave-front" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,70 C320,30 640,80 980,45 C1220,25 1360,65 1440,60 L1440,120 L0,120 Z" fill="rgba(255, 255, 255, 0.7)" />
          </svg>
        </div>

        <div className="footer-main-container signature-container-inner">
          <div className="signature-center-col">
            <span className="signature-script-text floating-script">See you by the sea.</span>
          </div>

          <div className="signature-right-col" aria-hidden="true">
            <div className="coastal-editorial-pills">
              <span>PASTA</span>
              <span className="pill-divider">&bull;</span>
              <span>COCKTAILS</span>
              <span className="pill-divider">&bull;</span>
              <span>OCEAN VIEWS</span>
              <span className="pill-accent">ALWAYS A GOOD IDEA</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM COPYRIGHT STRIP */}
      <div className="footer-copyright-strip">
        <div className="footer-main-container copyright-container">
          <div className="copyright-left">
            &copy; {new Date().getFullYear()} Baskk. All Rights Reserved.
          </div>
          <div className="copyright-right">
            <span>52–58 Marine Parade, Coolangatta, QLD 4225, Australia</span>
            <span className="copyright-sep">&bull;</span>
            <span>Coastal Soul by the Beach</span>
            <span className="copyright-sep">&bull;</span>
            <span className="powered-by-wrap">
              Powered by{' '}
              <a 
                href="https://kaushalamtechnology.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="powered-by-link"
                title="Kaushalam Technology"
              >
                Kaushalam Technology
              </a>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        /* =========================================================
           BASKK LUXURY COASTAL FOOTER WITH CAFE VIEW & FLOATING SEA
           ========================================================= */
        .baskk-site-footer {
          position: relative;
          background: #FAF2F4;
          color: #2E1E23;
          padding-top: 60px;
          border-top: 1px solid #ECD0D6;
          font-family: var(--font-sans, 'Plus Jakarta Sans', Arial, sans-serif);
          overflow: hidden;
        }

        /* Ambient Cafe Terrace Backdrop */
        .footer-bg-atmosphere {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .footer-bg-cafe-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.08;
          filter: saturate(1.3) contrast(1.1);
        }

        .footer-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(250, 242, 244, 0.92) 0%, rgba(250, 242, 244, 0.98) 100%);
        }

        .footer-top-divider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #E8A0A8 25%, #94181B 50%, #E8A0A8 75%, transparent 100%);
          opacity: 0.8;
          z-index: 3;
        }

        .footer-main-container {
          position: relative;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 36px;
          z-index: 2;
        }

        /* 3-Column Layout */
        .footer-columns-row {
          display: grid;
          grid-template-columns: 1.15fr 0.75fr 1.65fr;
          gap: 40px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        /* =========================================================
           COLUMN 1: BRAND BLOCK
           ========================================================= */
        .col-brand {
          padding-right: 16px;
        }

        .footer-brand-header {
          margin-bottom: 12px;
        }

        .footer-brand-logo-link {
          display: inline-block;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer-brand-logo-link:hover {
          transform: scale(1.04);
        }

        .footer-brand-logo-img {
          width: 105px;
          height: 105px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(148, 24, 27, 0.12));
        }

        .footer-tagline-wrap {
          margin: 14px 0 12px 0;
        }

        .footer-script-tagline {
          font-family: 'Alex Brush', cursive, var(--font-serif);
          font-size: 2.2rem;
          color: #94181B;
          line-height: 1.1;
          display: inline-block;
        }

        .footer-lead-text {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #553D43;
          margin-bottom: 22px;
          max-width: 380px;
        }

        /* Outlined Social Circles */
        .footer-social-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .social-outline-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #DFACB5;
          background: #FFFFFF;
          color: #94181B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(148, 24, 27, 0.06);
        }

        .social-outline-btn svg {
          display: block;
          fill: currentColor;
        }

        .social-outline-btn:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(148, 24, 27, 0.25);
        }

        .footer-brand-statement-micro {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #7A4E58;
          text-transform: uppercase;
        }

        .dot-sep {
          color: #C88490;
        }

        /* =========================================================
           HEADINGS & ACCENT LINE
           ========================================================= */
        .footer-heading-wrap {
          margin-bottom: 22px;
        }

        .footer-heading {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: #241719;
          margin: 0;
          letter-spacing: 0.04em;
        }

        .footer-heading-line {
          width: 32px;
          height: 2px;
          background: #94181B;
          margin-top: 8px;
          border-radius: 2px;
        }

        /* =========================================================
           COLUMN 2: QUICK LINKS
           ========================================================= */
        .footer-editorial-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-nav-link,
        .footer-btn-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #38252B;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 500;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .link-text {
          position: relative;
          transition: color 0.2s ease;
        }

        .link-text::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1.5px;
          background: #94181B;
          transition: width 0.25s ease;
        }

        .hover-arrow {
          font-size: 0.85rem;
          color: #94181B;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
        }

        .footer-nav-link:hover,
        .footer-btn-link:hover {
          color: #94181B;
          transform: translateX(4px);
        }

        .footer-nav-link:hover .link-text::after,
        .footer-btn-link:hover .link-text::after {
          width: 100%;
        }

        .footer-nav-link:hover .hover-arrow,
        .footer-btn-link:hover .hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* =========================================================
           COLUMN 3: CONTACT & CAFE VIEW CARD
           ========================================================= */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 14px;
        }

        .contact-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-icon-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #94181B;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          flex-shrink: 0;
          margin-top: 0;
          box-shadow: 0 2px 6px rgba(148, 24, 27, 0.2);
        }

        .contact-item-link {
          font-size: 0.9rem;
          color: #38252B;
          text-decoration: none;
          font-weight: 500;
          line-height: 1.5;
          transition: color 0.2s ease;
        }

        .contact-address-link {
          white-space: nowrap;
        }

        .contact-item-link:hover {
          color: #94181B;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .contact-address-link {
            white-space: normal;
          }
        }

        .footer-hours-quickpill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: #FFFFFF;
          border: 1px solid #ECD0D6;
          border-radius: 9999px;
          font-size: 0.76rem;
          color: #6C444E;
          font-weight: 600;
          margin-bottom: 14px;
          box-shadow: 0 2px 8px rgba(148, 24, 27, 0.04);
        }

        .footer-hours-quickpill i {
          color: #94181B;
        }

        /* Modern Beachfront Cafe Card */
        .footer-cafe-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #ECD0D6;
          box-shadow: 0 8px 24px rgba(148, 24, 27, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .footer-cafe-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(148, 24, 27, 0.14);
        }

        .cafe-img-container {
          position: relative;
          height: 140px;
          overflow: hidden;
        }

        .footer-cafe-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease-expo);
        }

        .footer-cafe-card:hover .footer-cafe-img {
          transform: scale(1.05);
        }

        .footer-cafe-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(36, 23, 25, 0.3) 0%, rgba(36, 23, 25, 0.75) 100%);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 12px 14px;
        }

        .cafe-view-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .btn-cafe-map-pill {
          background: #94181B;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .btn-cafe-map-pill:hover {
          background: #B01C20;
          transform: translateY(-1px);
        }

        .cafe-card-footer {
          padding: 8px 14px;
          font-size: 0.74rem;
          color: #553D43;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FCF5F6;
          border-top: 1px solid #F0DADC;
          font-weight: 500;
        }

        .text-crimson {
          color: #94181B;
        }

        /* =========================================================
           4. SIGNATURE STRIP WITH FLOATING SEA WAVES
           ========================================================= */
        .footer-signature-strip {
          position: relative;
          width: 100%;
          padding: 45px 0 30px 0;
          margin-top: 15px;
          border-top: 1px solid #ECD0D6;
          overflow: hidden;
        }

        /* Multi-layered Animated Floating Sea Waves */
        .floating-sea-waves-container {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .floating-sea-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 90px;
        }

        .wave-back {
          animation: seaWaveFloatBack 16s ease-in-out infinite alternate;
          opacity: 0.55;
        }

        .wave-mid {
          animation: seaWaveFloatMid 12s ease-in-out infinite alternate;
          opacity: 0.75;
        }

        .wave-front {
          animation: seaWaveFloatFront 20s ease-in-out infinite alternate;
          opacity: 0.85;
        }

        @keyframes seaWaveFloatBack {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-20%) scaleY(1.15); }
          100% { transform: translateX(-40%) scaleY(1); }
        }

        @keyframes seaWaveFloatMid {
          0% { transform: translateX(-30%) scaleY(1.12); }
          50% { transform: translateX(-10%) scaleY(0.92); }
          100% { transform: translateX(0) scaleY(1.12); }
        }

        @keyframes seaWaveFloatFront {
          0% { transform: translateX(0) scaleY(0.95); }
          50% { transform: translateX(-15%) scaleY(1.1); }
          100% { transform: translateX(-30%) scaleY(0.95); }
        }

        .signature-container-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .signature-center-col {
          flex: 1;
        }

        .signature-script-text {
          font-family: 'Alex Brush', cursive, var(--font-serif);
          font-size: clamp(2.8rem, 5.5vw, 4.2rem);
          color: #94181B;
          line-height: 1;
          display: inline-block;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
        }

        /* Gentle floating animation for script text */
        .floating-script {
          animation: gentleSeaBreeze 4.5s ease-in-out infinite alternate;
        }

        @keyframes gentleSeaBreeze {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }

        .signature-right-col {
          flex-shrink: 0;
          text-align: right;
        }

        .coastal-editorial-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #6C444E;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.6);
          padding: 6px 14px;
          border-radius: 30px;
          border: 1px solid rgba(236, 208, 214, 0.6);
          backdrop-filter: blur(6px);
        }

        .pill-divider {
          color: #C88490;
          font-size: 0.6rem;
        }

        .pill-accent {
          font-style: italic;
          font-weight: 700;
          color: #94181B;
          padding-left: 4px;
        }

        /* =========================================================
           5. BOTTOM COPYRIGHT STRIP
           ========================================================= */
        .footer-copyright-strip {
          position: relative;
          background: #8A1E2D;
          color: #FFFFFF;
          padding: 16px 0;
          font-size: 0.82rem;
          z-index: 3;
        }

        .copyright-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .copyright-left {
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.02em;
        }

        .copyright-right {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          flex-wrap: wrap;
        }

        .copyright-sep {
          color: rgba(255, 255, 255, 0.5);
        }

        .powered-by-wrap {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: rgba(255, 255, 255, 0.85);
        }

        .powered-by-link {
          color: #FFFFFF;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: all 0.2s ease;
        }

        .powered-by-link:hover {
          color: #FFB5BC;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS
           ========================================================= */
        @media (max-width: 1024px) {
          .footer-columns-row {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .col-contact {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .baskk-site-footer {
            padding-top: 40px;
          }
          .footer-main-container {
            padding: 0 20px;
          }
          .footer-columns-row {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 20px;
          }
          .col-contact {
            grid-column: span 1;
          }
          .footer-brand-logo-img {
            width: 85px;
            height: 85px;
          }
          .footer-script-tagline {
            font-size: 1.9rem;
          }
          .signature-container-inner {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          .signature-right-col {
            text-align: center;
          }
          .coastal-editorial-pills {
            flex-wrap: wrap;
            justify-content: center;
            font-size: 0.72rem;
          }
          .copyright-container {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          .copyright-right {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
