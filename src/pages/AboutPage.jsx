import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MagneticButton from '../components/MagneticButton';
import KineticMarquee from '../components/KineticMarquee';

export default function AboutPage({ onOpenBook, onOpenEnquiry }) {
  const [activePhoto, setActivePhoto] = useState('clients');

  const photoOptions = {
    clients: {
      src: '/baskk-new/baskk-beachfront-terrace.jpg',
      title: 'Beachside Diners & Guests',
      subtitle: 'Guests dining al fresco across Coolangatta Beach'
    },
    restaurant: {
      src: '/baskk-new/baskk-coastal-interior.jpg',
      title: 'Coolangatta Dining Hall',
      subtitle: 'Coastal rattan interior & beachside hall'
    },
    ambience: {
      src: '/baskk-new/reservation-dining-table.jpg',
      title: 'Warm Table Ambience',
      subtitle: 'Rustic timber tables set for dinner'
    }
  };
  return (
    <div className="about-page-wrap">
      <Navbar onOpenBook={onOpenBook} />

      <main className="about-main-content">
        {/* Editorial Header */}
        <section className="about-hero-banner">
          <div className="container">
            <span className="about-eyebrow">ABOUT BASKK</span>
            <h1 className="about-main-title">
              A TASTE OF MODERN ITALY <br />
              <span className="title-accent">ON THE GOLD COAST SHORES.</span>
            </h1>
            <p className="about-hero-lead">
              Modern Italian dining, freshly crafted cuisine & beachfront cocktails along Marine Parade in Coolangatta.
            </p>
          </div>
        </section>

        {/* Content Section 1: Welcome Story from baskk.co */}
        <section className="about-welcome-section section-padding">
          <div className="container">
            <div className="about-dual-grid">
              <div className="about-text-column">
                <span className="editorial-label">OUR STORY</span>
                <h2 className="editorial-heading">Where Modern Italian Dining Meets the Coast</h2>
                <div className="story-paragraphs">
                  <p className="lead-paragraph">
                    Welcome to Baskk Italian, where freshly crafted Italian cuisine and modern Italian dining meet the relaxed coastal atmosphere of Coolangatta.
                  </p>
                  <p>
                    Located along Marine Parade, Baskk Italian brings together freshly crafted Italian cuisine, house-made pasta, pizzas crafted from our own freshly made dough, quality ingredients and carefully prepared dishes.
                  </p>
                  <p>
                    From relaxed lunches and intimate dinners to celebrations with family and friends, our restaurant offers a welcoming atmosphere, delicious Italian food and a selection of signature cocktails.
                  </p>
                  <p>
                    At Baskk Italian, we believe great dining is about fresh ingredients, genuine hospitality and memorable experiences.
                  </p>
                </div>

                <div className="about-features-badges">
                  <div className="feature-pill">
                    <i className="fa-solid fa-pizza-slice"></i>
                    <div>
                      <strong>FRESHLY MADE PIZZA DOUGH</strong>
                      <span>Freshly prepared house-made dough crafted with care</span>
                    </div>
                  </div>
                  <div className="feature-pill">
                    <i className="fa-solid fa-water"></i>
                    <div>
                      <strong>Beachfront Dining</strong>
                      <span>Direct ocean breeze on Marine Parade</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-image-column">
                <div className="about-photo-switcher">
                  <button 
                    type="button" 
                    className={`photo-tab ${activePhoto === 'clients' ? 'active' : ''}`}
                    onClick={() => setActivePhoto('clients')}
                  >
                    <i className="fa-solid fa-users"></i> Guests Dining
                  </button>
                  <button 
                    type="button" 
                    className={`photo-tab ${activePhoto === 'restaurant' ? 'active' : ''}`}
                    onClick={() => setActivePhoto('restaurant')}
                  >
                    <i className="fa-solid fa-utensils"></i> Restaurant Interior
                  </button>
                  <button 
                    type="button" 
                    className={`photo-tab ${activePhoto === 'ambience' ? 'active' : ''}`}
                    onClick={() => setActivePhoto('ambience')}
                  >
                    <i className="fa-solid fa-wine-glass"></i> Ambience
                  </button>
                </div>

                <div className="image-frame-stacked">
                  <img 
                    src={photoOptions[activePhoto].src} 
                    alt={photoOptions[activePhoto].title} 
                    className="main-about-img" 
                  />
                  <div className="photo-info-bar">
                    <span className="photo-caption-title">{photoOptions[activePhoto].title}</span>
                    <span className="photo-caption-sub">{photoOptions[activePhoto].subtitle}</span>
                  </div>
                  <div className="badge-overlay-about">
                    <span className="badge-rating">4.9 ★★★★★</span>
                    <span className="badge-sub">Best Coastal Dining Coolangatta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Moving Ribbon */}
        <KineticMarquee variant="terracotta" />

        {/* Content Section 2: Happy Hour & Drinks Feature from baskk.co */}
        <section className="about-drinks-section section-padding">
          <div className="container">
            <div className="drinks-showcase-card">
              <div className="drinks-text-wrap">
                <span className="badge-special">SIGNATURE COCKTAIL & BEER</span>
                <h2 className="drinks-heading">Enjoy Beach View &amp; Baskk Happy Hour</h2>
                <p className="drinks-body">
                  At Baskk, we know that the perfect drink can make any moment even better. 
                  Whether you're a craft beer enthusiast, a cocktail connoisseur, or simply looking to enjoy a drink 
                  with friends, we've got you covered.
                </p>

                <div className="happy-hour-highlight-box">
                  <div className="hh-icon-wrap">
                    <i className="fa-solid fa-martini-glass-citrus"></i>
                  </div>
                  <div>
                    <h3 className="hh-title">HAPPY HOUR — 2 FOR $26 COCKTAILS &amp; $12 BITES</h3>
                    <p className="hh-desc">
                      Kick off your weekend the right way—drink in hand and ocean breeze on your face. 
                      Join us for <strong>2-for-$26 signature cocktails, $10 beers &amp; house wines, and $12 Italian bites every Friday to Sunday, from 3 PM to 5 PM</strong>. 
                      Cheers to golden hours at Baskk in the sun!
                    </p>
                  </div>
                </div>

                <div className="drinks-cta-row">
                  <a 
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-about"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>BOOK YOUR TABLE</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                  <a 
                    href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-order-pickup"
                  >
                    <span>ORDER PICKUP MENU</span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>

              <div className="drinks-img-wrap">
                <img 
                  src="/baskk-new/cocktail-spritz-refreshing.jpg" 
                  alt="Baskk Cocktails" 
                  className="drinks-hero-img" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section 3: Functions from baskk.co */}
        <section className="about-functions-section section-padding">
          <div className="container">
            <div className="functions-content-box">
              <div className="functions-inner-text">
                <span className="editorial-label">PRIVATE EVENTS & WEDDINGS</span>
                <h2 className="editorial-heading">Planning an Event? Let Us Make It Unforgettable!</h2>
                <p className="functions-desc">
                  Planning an event? Let us make it unforgettable! Fill out the inquiry form in our functions section, 
                  and one of our friendly team members will be in touch to help create the perfect celebration at Baskk.
                </p>
                <p className="functions-subdesc">
                  Whether it’s a milestone birthday, an intimate beachfront wedding, an engagement lunch, or a corporate 
                  celebration, we tailor custom gourmet feasts and cocktail packages right across from Coolangatta Beach.
                </p>
                <div className="functions-actions">
                  <Link to="/booking-enquiry" className="btn-functions-enquire" style={{ textDecoration: 'none' }}>
                    <span>SUBMIT FUNCTION INQUIRY</span>
                    <i className="fa-solid fa-envelope"></i>
                  </Link>
                  <a href="/set-menu-2026.pdf" download="Baskk-Set-Menu-2026.pdf" className="btn-order-pickup">
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>SET MENU 2026 (PDF)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        .about-page-wrap {
          background-color: #FAF2F3;
          min-height: 100vh;
        }

        .about-hero-banner {
          background: #242223;
          color: #FFFFFF;
          padding: 150px 0 80px 0;
          border-bottom: 1px solid rgba(232, 160, 168, 0.2);
          text-align: center;
        }

        .about-eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.24em;
          color: #E63980;
          margin-bottom: 16px;
        }

        .about-main-title {
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 1.15;
          margin: 0 0 20px 0;
        }

        .title-accent {
          color: #E8A0A8;
          font-style: italic;
        }

        .about-hero-lead {
          font-size: 1.15rem;
          color: #D6C2C5;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .section-padding {
          padding: 90px 0;
        }

        .about-dual-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }

        .editorial-label {
          font-size: 0.76rem;
          letter-spacing: 0.2em;
          font-weight: 800;
          color: #94181B;
          display: block;
          margin-bottom: 12px;
        }

        .editorial-heading {
          font-family: var(--font-serif, serif);
          font-size: clamp(2rem, 3.8vw, 3.2rem);
          color: #241719;
          line-height: 1.15;
          margin-bottom: 24px;
        }

        .lead-paragraph {
          font-size: 1.2rem;
          font-weight: 600;
          color: #241719;
          line-height: 1.6;
        }

        .story-paragraphs p {
          font-size: 1.05rem;
          color: #574447;
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .about-features-badges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
        }

        .feature-pill {
          background: #FFFFFF;
          border: 1px solid #E8A0A8;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 4px 15px rgba(148, 24, 27, 0.05);
        }

        .feature-pill i {
          font-size: 1.6rem;
          color: #94181B;
        }

        .feature-pill strong {
          display: block;
          font-size: 0.92rem;
          color: #241719;
        }

        .feature-pill span {
          font-size: 0.78rem;
          color: #7A6366;
        }

        .about-photo-switcher {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
          background: #FFFFFF;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid #E8A0A8;
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.06);
          overflow-x: auto;
        }

        .photo-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          color: #7A6366;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .photo-tab:hover {
          color: #94181B;
          background: rgba(148, 24, 27, 0.05);
        }

        .photo-tab.active {
          background: #94181B;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(148, 24, 27, 0.25);
        }

        .image-frame-stacked {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(36, 23, 25, 0.18);
          border: 1px solid #E8A0A8;
          height: 480px;
          background: #241719;
        }

        .main-about-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center 35%;
          transition: opacity 0.3s ease, transform 0.5s ease;
        }

        .image-frame-stacked:hover .main-about-img {
          transform: scale(1.02);
        }

        .photo-info-bar {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          background: rgba(36, 23, 25, 0.88);
          backdrop-filter: blur(8px);
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(232, 160, 168, 0.4);
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 2;
        }

        .photo-caption-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .photo-caption-sub {
          font-size: 0.74rem;
          color: #E8D0D3;
        }

        .badge-overlay-about {
          position: absolute;
          bottom: 18px;
          left: 18px;
          background: rgba(36, 23, 25, 0.94);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          padding: 12px 18px;
          border-radius: 8px;
          border: 1px solid #E8A0A8;
          z-index: 2;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .badge-rating {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          color: #FFC107;
        }

        .badge-sub {
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          color: #E8D0D3;
        }

        /* Drinks showcase card */
        .drinks-showcase-card {
          background: #242223;
          color: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border: 1px solid rgba(232, 160, 168, 0.3);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .drinks-text-wrap {
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .badge-special {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #E63980;
          margin-bottom: 12px;
        }

        .drinks-heading {
          font-family: var(--font-serif, serif);
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          line-height: 1.2;
          margin-bottom: 18px;
        }

        .drinks-body {
          font-size: 1.05rem;
          color: #D6C2C5;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .happy-hour-highlight-box {
          background: rgba(230, 57, 128, 0.12);
          border: 1px solid #E63980;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .hh-icon-wrap {
          font-size: 1.8rem;
          color: #FF5E97;
        }

        .hh-title {
          font-size: 1rem;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          font-weight: 800;
        }

        .hh-desc {
          font-size: 0.9rem;
          color: #E8D0D3;
          margin: 0;
          line-height: 1.5;
        }

        .drinks-cta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary-about {
          padding: 14px 28px;
          background: linear-gradient(135deg, #FF4081 0%, #E63980 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.84rem;
          letter-spacing: 0.14em;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 18px rgba(230, 57, 128, 0.4);
        }

        .btn-order-pickup {
          padding: 14px 28px;
          background: #FFFFFF;
          color: #242223;
          font-weight: 800;
          font-size: 0.84rem;
          letter-spacing: 0.14em;
          border-radius: 6px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s ease;
        }

        .btn-order-pickup:hover {
          background: #E8D0D3;
        }

        .drinks-img-wrap {
          position: relative;
        }

        .drinks-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Functions Box */
        .functions-content-box {
          background: #FFFFFF;
          border: 1px solid #E8A0A8;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 10px 35px rgba(148, 24, 27, 0.08);
        }

        .functions-desc {
          font-size: 1.25rem;
          font-weight: 600;
          color: #241719;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .functions-subdesc {
          font-size: 1.05rem;
          color: #665255;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .btn-functions-enquire {
          padding: 16px 36px;
          background: #94181B;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.16em;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        @media (max-width: 960px) {
          .about-dual-grid, .drinks-showcase-card {
            grid-template-columns: 1fr;
          }
          .image-frame-stacked {
            height: 380px;
          }
          .drinks-text-wrap {
            padding: 30px;
          }
          .drinks-img-wrap {
            height: 300px;
          }
          .functions-content-box {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
