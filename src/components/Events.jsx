import React from 'react';
import { Link } from 'react-router-dom';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

export default function Events({ onOpenEnquiry }) {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  return (
    <section className="events-section" ref={containerRef} id="events">
      <div className="container">
        <div className="events-banner" data-reveal="clip">
          <div className="events-overlay"></div>
          <img 
            src="/baskk-photos/DSC_0389.JPG" 
            alt="Baskk Private Function Celebrations" 
            className="events-bg-img"
            onError={(e) => { e.target.src = '/baskk-photos/1.jpg'; }}
          />

          <div className="events-content text-center">
            <span className="editorial-label text-crimson">PRIVATE CELEBRATIONS & FUNCTIONS</span>
            <h2 className="events-heading" data-reveal="text">
              MAKE YOUR NEXT EVENT <br />
              <span className="script-accent text-blush">A BASKK MOMENT.</span>
            </h2>
            <p className="events-desc">
              Planning an event? Let us make it unforgettable! Fill out our functions inquiry form, 
              and one of our friendly team members will be in touch to help create the perfect celebration 
              at Baskk.
            </p>

            <div className="events-specs">
              <div className="spec-pill">
                <span className="spec-num">150</span>
                <span className="spec-text">Cocktail Capacity</span>
              </div>
              <div className="spec-pill">
                <span className="spec-num">160</span>
                <span className="spec-text">Seated Dining Capacity</span>
              </div>
              <div className="spec-pill">
                <span className="spec-num">100%</span>
                <span className="spec-text">Oceanfront Views</span>
              </div>
            </div>

            <div className="events-actions">
              <Link to="/booking-enquiry" className="btn-events-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                FUNCTION ENQUIRY
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .events-section {
          background-color: var(--color-blush-bg, #FAF2F3);
          padding: 25px 0 20px 0;
        }

        .events-banner {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          padding: 100px 40px;
          color: #ffffff;
          box-shadow: 0 16px 45px rgba(148, 24, 27, 0.12);
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .events-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        .events-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(36, 23, 25, 0.65) 0%, rgba(36, 23, 25, 0.88) 100%);
          z-index: 2;
        }

        .events-content {
          position: relative;
          z-index: 3;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .text-crimson {
          color: var(--color-blush-accent, #E8A0A8);
          letter-spacing: 0.28em;
        }

        .text-blush {
          color: #FCE6E8;
        }

        .events-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 5vw, 4.2rem);
          font-weight: 500;
          line-height: 1.1;
          margin: 16px 0 24px 0;
          color: #ffffff;
        }

        .events-desc {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
        }

        .events-specs {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .spec-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: var(--radius-md);
        }

        .spec-num {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 600;
          color: #FCE6E8;
          line-height: 1;
        }

        .spec-text {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 4px;
        }

        .btn-events-primary {
          padding: 16px 40px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #fff;
          font-size: 0.813rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.5);
          transition: all 0.3s ease;
        }

        .btn-events-primary:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(148, 24, 27, 0.7);
        }

        @media (max-width: 768px) {
          .events-section {
            padding: 30px 0 15px 0;
          }
          .events-banner {
            padding: 60px 20px;
          }
        }
      `}</style>
    </section>
  );
}
