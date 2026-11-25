import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

export default function SignatureDish({ onOpenBook }) {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  return (
    <section className="signature-dish-section" ref={containerRef}>
      {/* Background Full-Bleed Imagery */}
      <div className="dish-bg-wrap" data-parallax="0.12">
        <div className="dish-shade-overlay"></div>
        <img 
          src="/baskk-photos/Fish Of the Day.jpeg" 
          alt="Chef Signature Italian Specialty" 
          className="dish-bg-img"
          onError={(e) => { e.target.src = '/baskk-photos/DSC_0221.JPG'; }}
        />
      </div>

      <div className="container dish-container">
        <div className="dish-content text-center">
          <span className="editorial-label text-crimson">CHEF'S SIGNATURE SPECIALTY</span>
          
          <h2 className="dish-headline" data-reveal="text">
            MADE TO BE REMEMBERED.
          </h2>

          <p className="dish-description" data-reveal="text">
            A taste of modern Italy — freshly crafted Italian cuisine, house-made pasta, and pizzas prepared with our own house-made dough.
          </p>

          <div className="dish-actions" data-reveal="text">
            <a 
              href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-signature-reserve"
              style={{ textDecoration: 'none' }}
            >
              RESERVE YOUR TABLE
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .signature-dish-section {
          position: relative;
          min-height: 85vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #ffffff;
        }

        .dish-bg-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .dish-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.05);
          transition: transform 0.8s ease-out;
        }

        .signature-dish-section:hover .dish-bg-img {
          transform: scale(1.04);
        }

        .dish-shade-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(36, 23, 25, 0.65) 0%, 
            rgba(36, 23, 25, 0.82) 50%, 
            rgba(36, 23, 25, 0.94) 100%
          );
          z-index: 2;
        }

        .dish-container {
          position: relative;
          z-index: 3;
          max-width: 900px;
        }

        .text-crimson {
          color: var(--color-blush-accent, #E8A0A8);
          letter-spacing: 0.3em;
        }

        .dish-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 6vw, 5.2rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #ffffff;
          margin: 20px 0 24px 0;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .dish-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.92);
          max-width: 680px;
          margin: 0 auto 40px auto;
          font-weight: 300;
        }

        .btn-signature-reserve {
          padding: 18px 42px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #ffffff;
          font-size: 0.813rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          border-radius: var(--radius-pill);
          box-shadow: 0 12px 35px rgba(148, 24, 27, 0.5);
          transition: all 0.3s ease;
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .btn-signature-reserve:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-3px);
          box-shadow: 0 16px 45px rgba(148, 24, 27, 0.7);
        }
      `}</style>
    </section>
  );
}
