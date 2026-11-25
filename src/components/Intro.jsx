import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export default function Intro() {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  return (
    <section className="intro-section section-padding" ref={containerRef} id="about">
      <div className="container">
        <div className="intro-grid">
          {/* Left Column: Large Editorial Statement */}
          <div className="intro-col-left">
            <span className="editorial-label">ABOUT BASKK</span>
            <h2 className="intro-statement" data-reveal="text">
              WHERE COASTAL CHARM MEETS THE HEART OF ITALY.
            </h2>
            <p className="intro-sub-statement" data-reveal="text">
              Welcome to Baskk, where coastal charm meets culinary excellence.
            </p>
            <div className="intro-badges-row">
              <div className="intro-badge">
                <strong>4.9 ★</strong>
                <small>Best Coolangatta Dining</small>
              </div>
              <div className="intro-badge">
                <strong>HOUSE-MADE</strong>
                <small>Fresh Pizza Dough</small>
              </div>
              <div className="intro-badge">
                <strong>2-FOR-1</strong>
                <small>Cocktails Happy Hour</small>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Story & Clip-Path Image Reveal */}
          <div className="intro-col-right">
            <p className="intro-body-text" data-reveal="text">
              Nestled right by the beach, we invite you to unwind with our handcrafted cocktails, 
              savour your favourite artisan dishes, and soak in the ocean breeze. 
              From fresh, vibrant flavours to a relaxed seaside vibe, every moment at Baskk is designed to be savoured.
            </p>
            <p className="intro-body-text" data-reveal="text">
              From our freshly made pizzas prepared with house-made dough and slow-simmered ragùs to 
              ice-cold Aperol Spritzes and oceanfront sunsets, Baskk provides the ultimate beachside coastal sanctuary.
            </p>

            <div className="intro-image-wrap" data-reveal="clip">
              <img 
                src="/baskk-photos/DSC_0162.JPG" 
                alt="Baskk Interior & Atmosphere" 
                className="intro-img"
                onError={(e) => { e.target.src = '/baskk-photos/1.jpg'; }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .intro-section {
          background-color: var(--color-blush-bg, #FAF2F3);
          position: relative;
          overflow: hidden;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        .intro-statement {
          font-size: clamp(2.2rem, 4.2vw, 3.8rem);
          color: var(--color-text-dark, #241719);
          line-height: 1.15;
          margin-bottom: 20px;
          font-family: var(--font-serif);
        }

        .intro-sub-statement {
          font-size: 1.15rem;
          color: var(--color-text-muted, #665255);
          line-height: 1.6;
        }

        .intro-badges-row {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }

        .intro-badge {
          display: flex;
          flex-direction: column;
          padding: 16px 20px;
          background: var(--color-blush-card, #FFFFFF);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.08);
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .intro-badge strong {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--color-crimson, #94181B);
          line-height: 1;
        }

        .intro-badge small {
          font-size: 0.72rem;
          color: var(--color-text-muted, #665255);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .intro-body-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--color-text-muted, #665255);
          margin-bottom: 24px;
        }

        .intro-image-wrap {
          position: relative;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-top: 30px;
          box-shadow: 0 20px 40px rgba(28, 25, 23, 0.1);
        }

        .intro-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-expo);
        }

        .intro-image-wrap:hover .intro-img {
          transform: scale(1.06);
        }

        @media (max-width: 992px) {
          .intro-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .intro-image-wrap {
            height: 280px;
          }
        }
      `}</style>
    </section>
  );
}
