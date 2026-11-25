import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export default function AboutBaskk({ onOpenBook, onOpenEnquiry }) {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const handleBookingClick = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    window.open('https://booking.resdiary.com/widget/Standard/BaskkItalian/11276', '_blank', 'noopener,noreferrer');
  };

  const handleFunctionClick = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    if (typeof onOpenEnquiry === 'function') {
      onOpenEnquiry();
    } else if (typeof onOpenBook === 'function') {
      onOpenBook();
    }
  };

  return (
    <section className="about-baskk-section" ref={containerRef} id="About">
      {/* Subtle organic curved ocean wave background */}
      <div className="section-wave-backdrop" aria-hidden="true">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="bg-wave-svg">
          <path
            fill="rgba(240, 206, 210, 0.28)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="container relative-z">
        {/* --- SECTION HEADER --- */}
        <div className="experience-header text-center" data-reveal="text">
          <span className="experience-eyebrow">EXPERIENCE BASKK</span>
          <h2 className="experience-main-title">Something for Every Occasion</h2>
          <div className="title-divider-line" aria-hidden="true"></div>
          <p className="experience-lead-text">
            From golden-hour cocktails to oceanfront dining and unforgettable celebrations.
          </p>
        </div>

        {/* --- ASYMMETRICAL 2-COLUMN EDITORIAL GRID --- */}
        <div className="asymmetric-editorial-grid">
          {/* LEFT COLUMN: Happy Hour (01) + Baskk Brand & Reservation Card */}
          <div className="editorial-left-column">
            {/* Main Feature: Happy Hour */}
            <div 
              className="feature-hero-card"
              onClick={handleBookingClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBookingClick(); }}
              aria-label="Happy Hour Experience - Click to Book"
            >
              <div className="feature-card-inner">
                {/* Vertical Decorative Tag */}
                <div className="editorial-vertical-tag" aria-hidden="true">
                  <span>BASKK / 01</span>
                </div>

                {/* Image Frame */}
                <div className="feature-image-frame">
                  <img
                    src="/baskk-new/cocktail-spritz-refreshing.jpg"
                    alt="Baskk Happy Hour Cocktails overlooking Kirra Beach"
                    className="editorial-image"
                    onError={(e) => { e.target.src = '/baskk-photos/DSC_0244.JPG'; }}
                    loading="lazy"
                  />
                  <div className="image-soft-overlay"></div>

                  {/* Floating pill badge on image */}
                  <div className="feature-badge-pill">
                    <i className="fa-regular fa-clock"></i>
                    <span>FRI – SUN • 3 PM – 5 PM</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="feature-content-box">
                  <span className="experience-category-label">2 FOR $26 COCKTAILS • $12 BITES</span>
                  <h3 className="experience-item-title feature-title">Happy Hour</h3>
                  <p className="experience-item-desc feature-desc">
                    Kick off your afternoon the right way—drink in hand and ocean breeze on your face. 
                    Enjoy 2-for-$26 signature cocktails, $10 Baskk draught beers &amp; house wines, and $12 Italian bar bites every Friday to Sunday from 3 PM to 5 PM.
                  </p>

                  {/* Feature Highlights Pills */}
                  <div className="feature-perks-row">
                    <span className="feature-perk-item">
                      <i className="fa-solid fa-martini-glass-citrus"></i> 2-for-$26 Cocktails &amp; $12 Bites
                    </span>
                    <span className="feature-perk-item">
                      <i className="fa-solid fa-water"></i> Direct Kirra Beach Views
                    </span>
                  </div>

                  <div className="experience-cta-link">
                    <span>DISCOVER</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow-icon">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Baskk Brand & Book A Table Signature Card */}
            <div 
              className="baskk-brand-reserve-card"
              onClick={handleBookingClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBookingClick(); }}
              aria-label="Reserve a Table at Baskk"
            >
              <div className="reserve-card-inner">
                {/* Brand Seal & Eyebrow */}
                <div className="reserve-card-badge-row">
                  <div className="reserve-logo-circle">
                    <img 
                      src="/baskk_logo.png" 
                      alt="Baskk" 
                      className="reserve-logo-img" 
                    />
                  </div>
                  <div className="reserve-badge-info">
                    <span className="reserve-eyebrow">DINE WITH US</span>
                    <div className="reserve-rating">
                      <span className="rating-stars">★★★★★</span>
                      <span className="rating-label">Kirra Beachfront</span>
                    </div>
                  </div>
                </div>

                <div className="reserve-card-body">
                  <h3 className="reserve-card-title">Book Your Table</h3>
                  <p className="reserve-card-text">
                    Join us on Marine Parade for coastal cuisine, freshly made pizzas prepared with our house-made dough, handcrafted pastas &amp; sunset spritzes. Walk-ins and reservations are always welcome.
                  </p>
                </div>

                <div className="reserve-card-actions">
                  <a 
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-reserve-cta"
                    style={{ textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Book a table at Baskk"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>BOOK A TABLE</span>
                  </a>
                  <a 
                    href="mailto:request@baskk.co" 
                    className="btn-reserve-phone"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Email Baskk at request@baskk.co"
                  >
                    <i className="fa-solid fa-envelope"></i>
                    <span>EMAIL US</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stacked Two Experiences (60% width) */}
          <div className="stacked-editorial-column">
            {/* TOP EXPERIENCE: Coastal Al Fresco */}
            <div 
              className="stacked-card-item"
              onClick={handleBookingClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBookingClick(); }}
              aria-label="Coastal Al Fresco Beach View - Click to Book"
            >
              <div className="stacked-card-inner">
                {/* Vertical Decorative Tag */}
                <div className="editorial-vertical-tag" aria-hidden="true">
                  <span>BASKK / 02</span>
                </div>

                {/* Wide Landscape Image */}
                <div className="stacked-image-frame">
                  <img
                    src="/baskk-new/baskk-beachfront-terrace.jpg"
                    alt="Coastal Al Fresco Beach View on Marine Parade"
                    className="editorial-image"
                    onError={(e) => { e.target.src = '/baskk-photos/DSC_0162.JPG'; }}
                    loading="lazy"
                  />
                  <div className="image-soft-overlay"></div>
                </div>

                {/* Content Box */}
                <div className="stacked-content-box">
                  <span className="experience-category-label">MARINE PARADE • OCEAN BREEZE</span>
                  <h3 className="experience-item-title">Enjoy Beach View</h3>
                  <p className="experience-item-desc">
                    At Baskk, we know that the perfect drink can make any moment even better. 
                    Whether you're a craft beer enthusiast, a cocktail connoisseur, or simply looking to enjoy a drink with friends, we've got you covered.
                  </p>

                  <div className="experience-cta-link">
                    <span>DISCOVER</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow-icon">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Divider Line between right stacked items */}
            <div className="stacked-divider-line" aria-hidden="true"></div>

            {/* BOTTOM EXPERIENCE: Private Celebrations / Functions */}
            <div 
              className="stacked-card-item"
              onClick={handleFunctionClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFunctionClick(); }}
              aria-label="Private Celebrations and Functions - Click to Enquire"
            >
              <div className="stacked-card-inner">
                {/* Vertical Decorative Tag */}
                <div className="editorial-vertical-tag" aria-hidden="true">
                  <span>BASKK / 03</span>
                </div>

                {/* Wide Landscape Image */}
                <div className="stacked-image-frame">
                  <img
                    src="/baskk-new/reservation-dining-table.jpg"
                    alt="Private Celebrations, Birthdays, Weddings and Events at Baskk"
                    className="editorial-image"
                    onError={(e) => { e.target.src = '/baskk-photos/DSC_0389.JPG'; }}
                    loading="lazy"
                  />
                  <div className="image-soft-overlay"></div>
                </div>

                {/* Content Box */}
                <div className="stacked-content-box">
                  <span className="experience-category-label">BIRTHDAYS • WEDDINGS • EVENTS</span>
                  <h3 className="experience-item-title">Functions</h3>
                  <p className="experience-item-desc">
                    Planning an event? Let us make it unforgettable! Fill out the inquiry form in our functions section, 
                    and one of our friendly team members will be in touch to help create the perfect celebration at Baskk.
                  </p>

                  <div className="experience-cta-link">
                    <span>DISCOVER</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow-icon">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM CENTERED PREMIUM CTA --- */}
        <div className="experience-bottom-cta text-center" data-reveal="text">
          <div className="bottom-cta-inner">
            <span className="bottom-cta-sub">Planning something special?</span>
            <h3 className="bottom-cta-heading">Celebrate at Baskk</h3>
            
            <button 
              type="button"
              className="btn-celebrate-action"
              onClick={handleFunctionClick}
              onTouchEnd={handleFunctionClick}
              aria-label="Book your function or special event celebration"
            >
              <span>BOOK YOUR FUNCTION</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <p className="bottom-cta-note">Birthdays • Corporate Events • Weddings • Private Gatherings</p>
          </div>
        </div>
      </div>

      <style>{`
        /* =========================================================
           BASKK EXPERIENCES EDITORIAL SECTION (ASYMMETRICAL LAYOUT)
           ========================================================= */
        .about-baskk-section {
          background-color: #FAF2F3;
          color: #241719;
          position: relative;
          border-top: 1px solid #F0CED2;
          border-bottom: 1px solid #F0CED2;
          padding: 85px 0 80px 0;
          overflow: hidden;
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .relative-z {
          position: relative;
          z-index: 2;
        }

        /* Subtle organic curved wave decorative element */
        .section-wave-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          opacity: 0.65;
        }

        .bg-wave-svg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* --- SECTION HEADER --- */
        .experience-header {
          max-width: 820px;
          margin: 0 auto 56px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .experience-eyebrow {
          display: inline-block;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #94181B;
          margin-bottom: 12px;
        }

        .experience-main-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(2.4rem, 4.4vw, 3.6rem);
          font-weight: 500;
          color: #241719;
          line-height: 1.15;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }

        .title-divider-line {
          width: 64px;
          height: 1.5px;
          background: #94181B;
          opacity: 0.7;
          margin: 0 auto 18px auto;
        }

        .experience-lead-text {
          font-size: clamp(1rem, 1.6vw, 1.15rem);
          line-height: 1.7;
          color: #634F52;
          margin: 0;
          max-width: 620px;
          font-weight: 400;
        }

        /* --- 2-COLUMN ASYMMETRICAL EDITORIAL GRID --- */
        .asymmetric-editorial-grid {
          display: grid;
          grid-template-columns: 4.2fr 5.8fr;
          gap: 44px;
          align-items: start;
          margin-bottom: 64px;
        }

        /* Left Column & Right Column Stacks */
        .editorial-left-column,
        .stacked-editorial-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Common Card Styles */
        .feature-hero-card,
        .stacked-card-item,
        .baskk-brand-reserve-card {
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-hero-card:focus-visible,
        .stacked-card-item:focus-visible,
        .baskk-brand-reserve-card:focus-visible {
          outline: 2px solid #94181B;
          outline-offset: 4px;
          border-radius: 16px;
        }

        .feature-card-inner,
        .stacked-card-inner {
          position: relative;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 6px 24px rgba(36, 23, 25, 0.05);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          display: flex;
          flex-direction: column;
          height: auto;
        }

        .feature-hero-card:hover .feature-card-inner,
        .stacked-card-item:hover .stacked-card-inner {
          transform: translateY(-4px);
          box-shadow: 0 16px 38px rgba(148, 24, 27, 0.11);
        }

        /* --- BASKK BRAND SIGNATURE RESERVATION CARD --- */
        .baskk-brand-reserve-card {
          position: relative;
        }

        .reserve-card-inner {
          position: relative;
          background: linear-gradient(140deg, #241719 0%, #381518 100%);
          color: #FAF2F3;
          border-radius: 16px;
          padding: 26px 24px;
          box-shadow: 0 8px 28px rgba(36, 23, 25, 0.14);
          border: 1px solid rgba(240, 206, 210, 0.18);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
          overflow: hidden;
        }

        .reserve-card-inner::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(148, 24, 27, 0.42) 0%, rgba(36, 23, 25, 0) 70%);
          pointer-events: none;
        }

        .baskk-brand-reserve-card:hover .reserve-card-inner {
          transform: translateY(-4px);
          box-shadow: 0 16px 38px rgba(36, 23, 25, 0.28);
          border-color: rgba(240, 206, 210, 0.35);
        }

        .reserve-card-badge-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .reserve-logo-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #FAF2F3;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          flex-shrink: 0;
          transition: transform 0.35s ease;
        }

        .baskk-brand-reserve-card:hover .reserve-logo-circle {
          transform: rotate(8deg) scale(1.05);
        }

        .reserve-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .reserve-badge-info {
          display: flex;
          flex-direction: column;
        }

        .reserve-eyebrow {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #F0CED2;
          display: block;
          margin-bottom: 2px;
        }

        .reserve-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-stars {
          color: #E2B2B5;
          font-size: 0.76rem;
          letter-spacing: 2px;
        }

        .rating-label {
          font-size: 0.74rem;
          color: rgba(250, 242, 243, 0.75);
          font-weight: 500;
        }

        .reserve-card-body {
          margin-bottom: 16px;
        }

        .reserve-card-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.45rem, 1.8vw, 1.75rem);
          font-weight: 600;
          color: #FFFFFF;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .reserve-card-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(250, 242, 243, 0.82);
          margin: 0;
        }

        .reserve-card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-reserve-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 11px 22px;
          border-radius: 999px;
          border: 1px solid rgba(240, 206, 210, 0.25);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.35);
          transition: all 0.25s ease;
        }

        .btn-reserve-cta:hover {
          background: #B31E22;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(148, 24, 27, 0.55);
        }

        .btn-reserve-phone {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FAF2F3;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 15px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: all 0.25s ease;
        }

        .btn-reserve-phone:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #FFFFFF;
        }

        /* Decorative Vertical Tag (BASKK / 01, 02, 03) */
        .editorial-vertical-tag {
          position: absolute;
          top: 36px;
          right: -16px;
          z-index: 10;
          background: #241719;
          color: #FAF2F3;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }

        /* Image Frames */
        .feature-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 14px;
          overflow: hidden;
          background: #1C1517;
        }

        .stacked-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 8.5;
          border-radius: 14px;
          overflow: hidden;
          background: #1C1517;
        }

        .editorial-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .image-soft-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(36, 23, 25, 0.05) 0%, rgba(36, 23, 25, 0.32) 100%);
          opacity: 0.6;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .feature-hero-card:hover .editorial-image,
        .stacked-card-item:hover .editorial-image {
          transform: scale(1.03);
        }

        .feature-hero-card:hover .image-soft-overlay,
        .stacked-card-item:hover .image-soft-overlay {
          opacity: 0.8;
        }

        /* Feature Badge Pill on Happy Hour */
        .feature-badge-pill {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #94181B;
          border: 1px solid #F0CED2;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }

        /* Content Boxes */
        .feature-content-box {
          padding: 24px 8px 8px 8px;
          display: flex;
          flex-direction: column;
        }

        .stacked-content-box {
          padding: 20px 8px 6px 8px;
          display: flex;
          flex-direction: column;
        }

        .experience-category-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94181B;
          margin-bottom: 6px;
        }

        .experience-item-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.6rem, 2.2vw, 2.1rem);
          font-weight: 600;
          color: #241719;
          margin: 0 0 10px 0;
          line-height: 1.2;
        }

        .feature-title {
          font-size: clamp(1.85rem, 2.5vw, 2.4rem);
        }

        .experience-item-desc {
          font-size: 0.92rem;
          line-height: 1.65;
          color: #634F52;
          margin: 0 0 14px 0;
        }

        .feature-desc {
          max-width: 480px;
        }

        /* Feature Highlights Pills */
        .feature-perks-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .feature-perk-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #94181B;
          background: #FFF1F3;
          border: 1px solid #F0CED2;
          padding: 5px 12px;
          border-radius: 999px;
        }

        /* Clean DISCOVER CTA Link with smooth animated arrow */
        .experience-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94181B;
          margin-top: 6px;
          transition: color 0.25s ease;
        }

        .cta-arrow-icon {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-hero-card:hover .cta-arrow-icon,
        .stacked-card-item:hover .cta-arrow-icon {
          transform: translateX(6px);
        }

        .feature-hero-card:hover .experience-cta-link,
        .stacked-card-item:hover .experience-cta-link {
          color: #731315;
        }

        .stacked-divider-line {
          height: 1px;
          background: #F0CED2;
          opacity: 0.6;
          margin: 4px 0;
        }

        /* --- BOTTOM CENTERED PREMIUM CTA --- */
        .experience-bottom-cta {
          margin-top: 50px;
          padding-top: 36px;
          border-top: 1px solid #F0CED2;
        }

        .bottom-cta-inner {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bottom-cta-sub {
          font-size: 0.88rem;
          font-weight: 500;
          color: #755B5F;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .bottom-cta-heading {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          font-weight: 500;
          color: #241719;
          margin: 0 0 20px 0;
          line-height: 1.15;
        }

        .btn-celebrate-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #94181B;
          color: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 15px 36px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.28);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-celebrate-action:hover {
          background-color: #731315;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(148, 24, 27, 0.4);
        }

        .btn-arrow-icon {
          transition: transform 0.25s ease;
        }

        .btn-celebrate-action:hover .btn-arrow-icon {
          transform: translateX(4px);
        }

        .bottom-cta-note {
          font-size: 0.8rem;
          color: #7A6265;
          margin: 12px 0 0 0;
          letter-spacing: 0.05em;
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS
           ========================================================= */
        @media (max-width: 1024px) {
          .asymmetric-editorial-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
          .feature-image-frame {
            aspect-ratio: 16 / 10;
          }
          .stacked-image-frame {
            aspect-ratio: 16 / 9;
          }
          .editorial-vertical-tag {
            top: 24px;
            right: 14px;
          }
        }

        @media (max-width: 768px) {
          .about-baskk-section {
            padding: 55px 0 50px 0;
          }
          .experience-header {
            margin-bottom: 38px;
          }
          .asymmetric-editorial-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .feature-card-inner,
          .stacked-card-inner {
            padding: 18px;
          }
          .reserve-card-inner {
            padding: 22px 18px;
          }
          .feature-image-frame {
            aspect-ratio: 16 / 11;
          }
          .stacked-image-frame {
            aspect-ratio: 16 / 9.5;
          }
          .editorial-vertical-tag {
            top: 20px;
            right: 20px;
          }
          .reserve-card-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-reserve-cta,
          .btn-reserve-phone {
            width: 100%;
            justify-content: center;
          }
          .btn-celebrate-action {
            width: 100%;
            padding: 14px 20px;
          }
        }
      `}</style>
    </section>
  );
}
