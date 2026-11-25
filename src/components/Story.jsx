import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export default function Story() {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  return (
    <section className="story-section" ref={containerRef} id="story">
      <div className="container">
        <div className="story-grid">
          {/* Left Column: Editorial Heading & Story */}
          <div className="story-content-col">
            <span className="editorial-label">OUR STORY</span>
            
            <h2 className="story-heading" data-reveal="text">
              WHERE MODERN ITALIAN DINING <br />
              <span className="script-accent text-crimson">MEETS THE COAST.</span>
            </h2>

            <p className="story-paragraph" data-reveal="text">
              Welcome to Baskk Italian, where freshly crafted Italian cuisine meets the relaxed coastal atmosphere of Coolangatta.
            </p>

            <p className="story-paragraph" data-reveal="text">
              Located along Marine Parade, Baskk Italian brings together freshly crafted Italian cuisine, house-made pasta, pizzas crafted from our own freshly made dough, quality ingredients and carefully prepared dishes.
            </p>

            <p className="story-paragraph" data-reveal="text">
              From relaxed lunches and intimate dinners to celebrations with family and friends, our restaurant offers a welcoming atmosphere, delicious Italian food and a selection of signature cocktails.
            </p>

            <div className="story-quote-box" data-reveal="text">
              <span className="quote-icon">“</span>
              <p className="quote-text">
                "At Baskk Italian, we believe great dining is about fresh ingredients, genuine hospitality and memorable experiences."
              </p>
              <span className="quote-author">— THE BASKK CULINARY TEAM</span>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="story-image-col" data-reveal="clip">
            <div className="story-img-frame">
              <img 
                src="/baskk-photos/5.jpg" 
                alt="Baskk Oceanfront Feast - Italian Cuisine & Handmade Pasta" 
                className="story-img"
              />
              <div className="story-badge-floating">
                <span className="badge-year">EST. 2020</span>
                <small>COOLANGATTA • QUEENSLAND</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .story-section {
          background-color: var(--color-blush-light, #FFF8F9);
          color: var(--color-text-dark, #241719);
          overflow: hidden;
          padding: 50px 0 35px 0;
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 70px;
          align-items: center;
        }

        .text-crimson {
          color: var(--color-crimson, #94181B);
        }

        .story-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.5vw, 4rem);
          font-weight: 500;
          line-height: 1.1;
          margin: 16px 0 30px 0;
          color: var(--color-text-dark, #241719);
        }

        .story-paragraph {
          font-size: 1.063rem;
          line-height: 1.85;
          color: var(--color-text-muted, #665255);
          margin-bottom: 20px;
        }

        .story-quote-box {
          margin-top: 36px;
          padding: 28px;
          background: var(--color-blush-card, #FFFFFF);
          border-left: 4px solid var(--color-crimson, #94181B);
          border-top: 1px solid var(--color-blush-border, #F0CED2);
          border-right: 1px solid var(--color-blush-border, #F0CED2);
          border-bottom: 1px solid var(--color-blush-border, #F0CED2);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.06);
        }

        .quote-icon {
          font-family: var(--font-serif);
          font-size: 3rem;
          color: var(--color-crimson, #94181B);
          line-height: 0.5;
          display: block;
          margin-bottom: 12px;
        }

        .quote-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--color-text-dark, #241719);
          margin-bottom: 12px;
        }

        .quote-author {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--color-crimson, #94181B);
        }

        .story-image-col {
          position: relative;
        }

        .story-img-frame {
          position: relative;
          height: 520px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(148, 24, 27, 0.08);
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .story-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-expo);
        }

        .story-img-frame:hover .story-img {
          transform: scale(1.06);
        }

        .story-badge-floating {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background: rgba(252, 230, 232, 0.95);
          backdrop-filter: blur(12px);
          color: var(--color-text-dark, #241719);
          padding: 16px 24px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.1);
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .badge-year {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-crimson, #94181B);
        }

        .story-badge-floating small {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--color-text-muted, #665255);
        }

        @media (max-width: 992px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .story-img-frame {
            height: 350px;
          }
        }

        @media (max-width: 768px) {
          .story-section {
            padding: 35px 0 25px 0;
          }
        }
      `}</style>
    </section>
  );
}
