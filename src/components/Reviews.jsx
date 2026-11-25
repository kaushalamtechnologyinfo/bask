import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export default function Reviews() {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const reviews = [
    {
      quote: "Baskk is hands down the best dining spot on the Gold Coast! The beachfront setting paired with fresh homemade pasta made our anniversary unforgettable.",
      author: "Sarah & James M.",
      detail: "Verified Diner • Coolangatta",
      stars: 5,
      avatar: "S"
    },
    {
      quote: "Outstanding service, delicious freshly made pizzas, and the Spritz menu is sublime. Eating pasta right across Marine Parade is pure Gold Coast magic.",
      author: "David K.",
      detail: "Google Reviewer",
      stars: 5,
      avatar: "D"
    },
    {
      quote: "We hosted our birthday function here on the terrace. The team went above and beyond with dietary requirements, cocktails flow, and ocean sunset view!",
      author: "Elena R.",
      detail: "Gold Coast Local",
      stars: 5,
      avatar: "E"
    },
    {
      quote: "The slow-cooked lamb ragù pappardelle and fresh seafood pasta were incredible. Best food in Southern QLD by far.",
      author: "Michael T.",
      detail: "TripAdvisor Top Contributor",
      stars: 5,
      avatar: "M"
    },
    {
      quote: "Coolangatta needed a high-end coastal dining joint like Baskk! Warm atmosphere, rich wine list, and incredible sunset cocktails.",
      author: "Chloe & Liam",
      detail: "Diner • Tweed Heads",
      stars: 5,
      avatar: "C"
    }
  ];

  return (
    <section className="reviews-section" ref={containerRef}>
      <div className="container">
        <div className="section-header text-center">
          <span className="editorial-label">GUEST PRAISES & REVIEWS</span>
          <h2 className="editorial-heading" data-reveal="text">What Gold Coast Says</h2>
          <p className="reviews-sub-desc">Over 1,200+ 5-Star reviews on Marine Parade</p>
        </div>
      </div>

      {/* Moving Reviews Infinite Ticker Track */}
      <div className="reviews-ticker-wrapper">
        <div className="reviews-ticker-track">
          {reviews.concat(reviews).map((rev, idx) => (
            <div className="review-card-item" key={idx}>
              <div className="review-card-head">
                <div className="author-avatar">{rev.avatar}</div>
                <div className="author-meta">
                  <h4 className="author-name">{rev.author}</h4>
                  <span className="author-detail">{rev.detail}</span>
                </div>
                <div className="star-rating">
                  {'★'.repeat(rev.stars)}
                </div>
              </div>
              <p className="review-quote">"{rev.quote}"</p>
              <div className="review-badge">
                <span className="badge-icon">📍</span>
                <span>Baskk - Coolangatta</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reviews-section {
          background-color: var(--color-blush-bg, #FAF2F3);
          color: var(--color-text-dark, #241719);
          overflow: hidden;
          padding: 40px 0 20px 0;
        }

        .reviews-sub-desc {
          color: var(--color-text-muted, #665255);
          font-size: 1rem;
          margin-top: 6px;
        }

        .reviews-ticker-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-top: 32px;
          padding: 10px 0 10px 0;
          user-select: none;
        }

        .reviews-ticker-track {
          display: flex;
          gap: 28px;
          white-space: normal;
          width: max-content;
          animation: reviewsScroll 45s linear infinite;
        }

        .reviews-ticker-wrapper:hover .reviews-ticker-track {
          animation-play-state: paused;
        }

        @keyframes reviewsScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .review-card-item {
          width: 380px;
          background: var(--color-blush-card, #FFFFFF);
          border-radius: var(--radius-md);
          padding: 28px;
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.06);
          border: 1px solid var(--color-blush-border, #F0CED2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .review-card-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(148, 24, 27, 0.12);
          border-color: var(--color-crimson, #94181B);
        }

        .review-card-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #94181B 0%, #B83A4B 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: var(--font-serif);
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .author-meta {
          flex-grow: 1;
        }

        .author-name {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-dark, #241719);
          line-height: 1.2;
        }

        .author-detail {
          font-size: 0.72rem;
          color: var(--color-text-muted, #665255);
          display: block;
        }

        .star-rating {
          color: var(--color-crimson, #94181B);
          font-size: 0.95rem;
          letter-spacing: 2px;
        }

        .review-quote {
          font-size: 0.938rem;
          line-height: 1.65;
          color: var(--color-text-dark, #241719);
          font-style: italic;
          margin-bottom: 20px;
        }

        .review-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-crimson, #94181B);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .reviews-section {
            padding: 25px 0 45px 0;
          }
        }

        @media (max-width: 600px) {
          .review-card-item {
            width: 300px;
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}
