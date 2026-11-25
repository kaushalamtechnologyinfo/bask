import React from 'react';

export default function KineticMarquee({ variant = 'terracotta' }) {
  const itemsRow1 = [
    'MODERN ITALIAN DINING',
    'A TASTE OF MODERN ITALY',
    'FRESHLY CRAFTED ITALIAN CUISINE',
    'HOUSE-MADE ITALIAN PASTA',
    'FRESHLY MADE PIZZA DOUGH',
    'ITALIAN FLAVOURS, MODERN FLAIR',
    'COOLANGATTA BEACHFRONT',
    'SIGNATURE COCKTAILS',
  ];

  const itemsRow2 = [
    'A TASTE OF MODERN ITALY',
    'MODERN ITALIAN DINING',
    'FRESHLY CRAFTED ITALIAN CUISINE',
    'ITALIAN FLAVOURS, MODERN FLAIR',
    'BEACHSIDE ITALIAN DINING',
    'FINE REGIONAL WINES',
    'HOUSE-MADE ITALIAN PASTA',
    'FRESHLY MADE PIZZA DOUGH',
  ];

  return (
    <div className={`kinetic-marquee-wrapper variant-${variant}`}>
      {/* Top Track (Moving Left) */}
      <div className="marquee-track track-left">
        <div className="marquee-content">
          {itemsRow1.concat(itemsRow1).map((item, idx) => (
            <div className="marquee-item" key={idx}>
              <span className="marquee-text">{item}</span>
              <span className="marquee-star">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Track (Moving Right - Reverse) */}
      <div className="marquee-track track-right">
        <div className="marquee-content reverse">
          {itemsRow2.concat(itemsRow2).map((item, idx) => (
            <div className="marquee-item highlight" key={idx}>
              <span className="marquee-text">{item}</span>
              <span className="marquee-dot">•</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .kinetic-marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 24px 0;
          user-select: none;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          border-top: 1px solid var(--color-blush-border, #F0CED2);
          border-bottom: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.2);
        }

        .kinetic-marquee-wrapper.variant-terracotta {
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
        }

        .marquee-track {
          display: flex;
          width: 100%;
          overflow: hidden;
          margin: 6px 0;
        }

        .marquee-content {
          display: flex;
          align-items: center;
          gap: 32px;
          white-space: nowrap;
          animation: marqueeScroll 28s linear infinite;
          will-change: transform;
        }

        .marquee-content.reverse {
          animation: marqueeScrollReverse 32s linear infinite;
        }

        .kinetic-marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marqueeScrollReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .marquee-text {
          font-family: var(--font-serif);
          font-size: clamp(1.1rem, 2.5vw, 1.8rem);
          font-weight: 500;
          letter-spacing: 0.18em;
          color: #fdfbf7;
          text-transform: uppercase;
        }

        .marquee-item.highlight .marquee-text {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(0.85rem, 1.8vw, 1.1rem);
          letter-spacing: 0.25em;
          color: #fce4ec;
        }

        .marquee-star {
          color: #FCE6E8;
          font-size: 1.2rem;
          animation: spinStar 8s linear infinite;
        }

        .marquee-dot {
          color: #e8a5b8;
          font-size: 1.5rem;
        }

        @keyframes spinStar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
