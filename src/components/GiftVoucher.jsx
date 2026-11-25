import React from 'react';
import { Link } from 'react-router-dom';

const VOUCHER_OPTIONS = [
  {
    id: '50',
    amount: '$50',
    title: 'A Taste of Baskk',
    subtitle: 'Cocktails & Antipasti',
    desc: 'Ideal for an afternoon aperitivo by the sea, artisan spritzes, or handcrafted Italian antipasti.',
    badge: 'Popular Gift',
    stripeUrl: 'https://buy.stripe.com/fZu8wPenPaXD8x4dzB9R604',
    features: ['Instant Digital E-Voucher', 'Personalize with Recipient Message', 'Valid for All Menus & Cocktails', '3-Year Expiry']
  },
  {
    id: '100',
    amount: '$100',
    title: 'Coastal Italian Dining',
    subtitle: 'Pasta & Wine for Two',
    desc: 'The perfect dining gift for couples — enjoy house-made pasta, wood-fired style pizzas, and regional wines.',
    badge: 'Most Popular',
    isFeatured: true,
    stripeUrl: 'https://buy.stripe.com/7sY00jcfH0iZ7t05359R605',
    features: ['Instant Digital E-Voucher', 'Personalize with Recipient Message', 'Complete Dinner for Two', '3-Year Expiry']
  },
  {
    id: '200',
    amount: '$200',
    title: 'The Ultimate Feast',
    subtitle: 'Deluxe Celebration Banquet',
    desc: 'An unforgettable shared celebration feast with premium seafood, wagyu, signature cocktails, and dessert.',
    badge: 'VIP Experience',
    stripeUrl: 'https://buy.stripe.com/00w8wP7Zr0iZdRoanp9R606',
    features: ['Instant Digital E-Voucher', 'Personalize with Recipient Message', 'Multi-Course Shared Banquet', '3-Year Expiry']
  }
];

export default function GiftVoucher() {
  return (
    <section className="gift-voucher-section" id="gift-vouchers" aria-label="Baskk Italian Gift Vouchers">
      <div className="gift-voucher-container">
        
        {/* Section Header */}
        <div className="gift-voucher-header">
          <div className="gift-voucher-eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>THE PERFECT ITALIAN GIFT</span>
            <span className="eyebrow-star">✦</span>
          </div>
          <h2 className="gift-voucher-title">
            Give the Gift of Baskk Italian
          </h2>
          <p className="gift-voucher-subtitle">
            Celebrate birthdays, anniversaries, team milestones, or treat someone special to an unforgettable beachfront dining experience on Marine Parade.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div className="voucher-cards-grid">
          {VOUCHER_OPTIONS.map((voucher, idx) => (
            <div 
              key={idx} 
              className={`voucher-card ${voucher.isFeatured ? 'is-featured' : ''}`}
            >
              {voucher.badge && (
                <div className="voucher-badge">
                  <span>{voucher.badge}</span>
                </div>
              )}

              <div className="voucher-card-inner">
                {/* Brand watermark badge */}
                <div className="voucher-brand-watermark">
                  <span>BASKK</span>
                </div>

                <div className="voucher-amount-wrap">
                  <span className="voucher-currency">AUD</span>
                  <span className="voucher-amount">{voucher.amount}</span>
                </div>

                <h3 className="voucher-card-title">{voucher.title}</h3>
                <p className="voucher-card-subtitle">{voucher.subtitle}</p>
                <p className="voucher-card-desc">{voucher.desc}</p>

                {/* Features list */}
                <ul className="voucher-features-list">
                  {voucher.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <i className="fa-solid fa-check"></i>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Button -> Opens dedicated Criniti's-style Gift Voucher Personalizer */}
                <div className="voucher-action-wrap">
                  <Link
                    to={`/gifts?amount=${voucher.id}`}
                    className="btn-voucher-buy"
                    aria-label={`Personalize and Purchase ${voucher.amount} Gift Voucher`}
                  >
                    <span>Buy {voucher.amount} Gift Voucher</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust & Guarantee Banner */}
        <div className="voucher-trust-banner">
          <div className="trust-item">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Secure Stripe Checkout</span>
          </div>
          <div className="trust-divider">•</div>
          <div className="trust-item">
            <i className="fa-solid fa-envelope-circle-check"></i>
            <span>Instant Digital Delivery to Email</span>
          </div>
          <div className="trust-divider">•</div>
          <div className="trust-item">
            <i className="fa-solid fa-calendar-check"></i>
            <span>Valid for 3 Years from Date of Purchase</span>
          </div>
          <div className="trust-divider">•</div>
          <div className="trust-item">
            <i className="fa-solid fa-utensils"></i>
            <span>Redeemable on Food, Drinks &amp; Dine-In</span>
          </div>
        </div>

      </div>

      <style>{`
        .gift-voucher-section {
          padding: 100px 24px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFF8F9 50%, #FAF0F2 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #F0CED2;
          border-bottom: 1px solid #F0CED2;
        }

        .gift-voucher-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .gift-voucher-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 56px auto;
        }

        .gift-voucher-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #94181B;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .eyebrow-star {
          font-size: 0.75rem;
          color: #94181B;
        }

        .gift-voucher-title {
          font-family: var(--font-serif, "Cormorant Garamond", serif);
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 600;
          line-height: 1.15;
          color: #241719;
          margin: 0 0 18px 0;
          letter-spacing: -0.01em;
        }

        .gift-voucher-subtitle {
          font-family: var(--font-sans, "Plus Jakarta Sans", sans-serif);
          font-size: 1.05rem;
          line-height: 1.65;
          color: #695256;
          margin: 0;
        }

        /* Voucher Cards Grid */
        .voucher-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 44px;
          align-items: stretch;
        }

        .voucher-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 18px;
          border: 1.5px solid #F0CED2;
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .voucher-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(148, 24, 27, 0.14);
          border-color: #94181B;
        }

        .voucher-card.is-featured {
          border: 2px solid #94181B;
          box-shadow: 0 14px 40px rgba(148, 24, 27, 0.12);
          transform: scale(1.03);
          background: linear-gradient(180deg, #FFFFFF 0%, #FFFDFD 100%);
        }

        .voucher-card.is-featured:hover {
          transform: scale(1.03) translateY(-8px);
          box-shadow: 0 24px 55px rgba(148, 24, 27, 0.2);
        }

        .voucher-badge {
          position: absolute;
          top: 0;
          right: 28px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px 7px 14px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 12px rgba(148, 24, 27, 0.3);
          z-index: 2;
        }

        .voucher-card-inner {
          position: relative;
          padding: 44px 32px 34px 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .voucher-brand-watermark {
          position: absolute;
          top: 18px;
          left: 28px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #D4A5AB;
          text-transform: uppercase;
        }

        .voucher-amount-wrap {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 14px;
          margin-bottom: 12px;
        }

        .voucher-currency {
          font-size: 0.95rem;
          font-weight: 700;
          color: #94181B;
          letter-spacing: 0.05em;
        }

        .voucher-amount {
          font-family: var(--font-serif, "Cormorant Garamond", serif);
          font-size: 3.4rem;
          font-weight: 700;
          color: #94181B;
          line-height: 1;
        }

        .voucher-card-title {
          font-family: var(--font-serif, "Cormorant Garamond", serif);
          font-size: 1.55rem;
          font-weight: 700;
          color: #241719;
          margin: 0 0 4px 0;
          line-height: 1.25;
        }

        .voucher-card-subtitle {
          font-size: 0.88rem;
          font-weight: 700;
          color: #94181B;
          margin: 0 0 14px 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .voucher-card-desc {
          font-size: 0.92rem;
          line-height: 1.55;
          color: #695256;
          margin: 0 0 24px 0;
          flex-grow: 1;
        }

        .voucher-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 28px 0;
          border-top: 1px dashed #F0CED2;
          padding-top: 20px;
        }

        .voucher-features-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #4A3538;
          margin-bottom: 9px;
          font-weight: 500;
        }

        .voucher-features-list li i {
          color: #94181B;
          font-size: 0.8rem;
        }

        .voucher-action-wrap {
          margin-top: auto;
        }

        .btn-voucher-buy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: #94181B;
          color: #FFFFFF;
          padding: 14px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 16px rgba(148, 24, 27, 0.25);
        }

        .btn-voucher-buy:hover {
          background: #7A1215;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(148, 24, 27, 0.35);
        }

        .btn-voucher-buy i {
          font-size: 0.85rem;
          transition: transform 0.2s ease;
        }

        .btn-voucher-buy:hover i {
          transform: translateX(4px);
        }

        .voucher-card.is-featured .btn-voucher-buy {
          background: #94181B;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        /* Trust Banner */
        .voucher-trust-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          padding: 18px 28px;
          background: #FFFFFF;
          border-radius: 999px;
          border: 1px solid #F0CED2;
          box-shadow: 0 4px 16px rgba(148, 24, 27, 0.04);
          max-width: 980px;
          margin: 0 auto;
        }

        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #4A3538;
        }

        .trust-item i {
          color: #94181B;
          font-size: 0.92rem;
        }

        .trust-divider {
          color: #F0CED2;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .voucher-cards-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
          }

          .voucher-card.is-featured {
            transform: none;
          }

          .voucher-card.is-featured:hover {
            transform: translateY(-8px);
          }

          .voucher-trust-banner {
            border-radius: 16px;
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .trust-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
