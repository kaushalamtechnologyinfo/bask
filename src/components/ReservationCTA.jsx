import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

export default function ReservationCTA({ onOpenBook }) {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  return (
    <section className="reservation-cta-section" ref={containerRef}>
      {/* Background Atmosphere Image */}
      <div className="res-bg-wrap">
        <div className="res-overlay"></div>
        <img 
          src="/baskk-new/reservation-dining-table.jpg" 
          alt="Baskk Evening Candlelit Dining Atmosphere" 
          className="res-bg-img"
          onError={(e) => { e.target.src = '/baskk-new/baskk-coastal-interior.jpg'; }}
        />
      </div>

      <div className="container res-container">
        <div className="res-content text-center">
          <span className="editorial-label text-crimson">RESERVATIONS & EVENINGS</span>

          <h2 className="res-heading" data-reveal="text">
            YOUR TABLE IS WAITING.
          </h2>

          <p className="res-subtext" data-reveal="text">
            Make your next evening unforgettable. Join us on Marine Parade for coastal soul, 
            sunset spritzes, and ocean breezes.
          </p>

          <div className="res-actions" data-reveal="text">
            <a 
              href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-res-primary"
              style={{ textDecoration: 'none' }}
            >
              BOOK A TABLE NOW
            </a>
            <a href="mailto:request@baskk.co" className="btn-res-call">
              <i className="fa-solid fa-envelope"></i>
              <span>EMAIL US</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .reservation-cta-section {
          position: relative;
          min-height: 90vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #ffffff;
        }

        .res-bg-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .res-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.05);
        }

        .res-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(36, 23, 25, 0.65) 0%, 
            rgba(36, 23, 25, 0.85) 60%, 
            rgba(36, 23, 25, 0.96) 100%
          );
          z-index: 2;
        }

        .res-container {
          position: relative;
          z-index: 3;
          max-width: 960px;
        }

        .text-crimson {
          color: var(--color-blush-accent, #E8A0A8);
          letter-spacing: 0.3em;
        }

        .res-heading {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 7vw, 6.2rem);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #ffffff;
          line-height: 1.05;
          margin: 20px 0 24px 0;
          text-shadow: 0 6px 40px rgba(0, 0, 0, 0.6);
        }

        .res-subtext {
          font-size: clamp(1.05rem, 2vw, 1.3rem);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.92);
          max-width: 640px;
          margin: 0 auto 44px auto;
          font-weight: 300;
        }

        .res-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .btn-res-primary {
          padding: 20px 48px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          border-radius: var(--radius-pill);
          box-shadow: 0 16px 45px rgba(148, 24, 27, 0.5);
          transition: all 0.3s ease;
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .btn-res-primary:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 22px 55px rgba(148, 24, 27, 0.7);
        }

        .btn-res-call {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 36px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.35);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-res-call:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: #ffffff;
          transform: translateY(-3px);
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
