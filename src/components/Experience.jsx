import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: 'happyhour',
    category: 'HAPPY HOUR',
    title: '2-For-1 Cocktails & Golden Hours',
    tagline: 'Kick off your weekend the right way—drink in hand and ocean breeze on your face. Join us for 2-for-1 cocktails every Friday to Sunday, 3 PM to 5 PM.',
    img: '/baskk-new/cocktail-spritz-refreshing.jpg',
    tag: 'FRI–SUN 3PM–5PM'
  },
  {
    id: 'beachview',
    category: 'ENJOY BEACH VIEW',
    title: 'Coastal Drinks & Ocean Breezes',
    tagline: 'At Baskk, we know that the perfect drink can make any moment even better. Whether you’re a craft beer enthusiast or cocktail connoisseur, we’ve got you covered.',
    img: '/baskk-new/baskk-beachfront-terrace.jpg',
    tag: 'OCEANFRONT'
  },
  {
    id: 'dining',
    category: 'MODERN ITALIAN DINING',
    title: 'A Taste of Modern Italy',
    tagline: 'Freshly crafted Italian cuisine, house-made pizza dough, handcrafted pasta, and quality ingredients with modern coastal flair.',
    img: '/baskk-new/fresh-pizzas-stand.jpg',
    tag: 'HOUSE-MADE DOUGH'
  },
  {
    id: 'functions',
    category: 'FUNCTIONS',
    title: 'Planning an Event? Unforgettable Celebrations',
    tagline: 'Planning an event? Let us make it unforgettable! Fill out our inquiry form for birthdays, weddings, engagements, and corporate events right by the beach.',
    img: '/baskk-new/reservation-dining-table.jpg',
    tag: 'PRIVATE EVENTS'
  }
];

export default function Experience() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Only pin horizontally on desktop screens (>992px)
    const mediaQuery = window.matchMedia('(min-width: 993px)');
    
    let ctx;
    if (mediaQuery.matches && trackRef.current && sectionRef.current) {
      ctx = gsap.context(() => {
        const panels = gsap.utils.toArray('.exp-scene-panel');
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${trackRef.current.offsetWidth}`,
            invalidateOnRefresh: true
          }
        });
      }, sectionRef);
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="experience-section" ref={sectionRef} id="experience">
      <div className="exp-pinned-wrapper">
        <div className="container exp-header-container">
          <span className="editorial-label text-crimson">THE BASKK EXPERIENCE</span>
          <h2 className="editorial-heading">4 Scenes of Coolangatta Life</h2>
          <p className="exp-header-desc">
            Explore the four distinct rhythms of our beachfront sanctuary.
          </p>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="exp-scenes-track" ref={trackRef}>
          {SCENES.map((scene, idx) => (
            <div className="exp-scene-panel" key={scene.id}>
              <div className="scene-card-inner">
                <div className="scene-image-wrap">
                  <img 
                    src={scene.img} 
                    alt={scene.title} 
                    className="scene-img"
                  />
                  <span className="scene-tag">{scene.tag}</span>
                  <span className="scene-number">0{idx + 1}</span>
                </div>

                <div className="scene-info-wrap">
                  <span className="scene-cat">{scene.category}</span>
                  <h3 className="scene-title">{scene.title}</h3>
                  <p className="scene-desc">{scene.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .experience-section {
          background-color: var(--color-blush-light, #FFF8F9);
          color: var(--color-text-dark, #241719);
          position: relative;
          overflow: hidden;
          padding: 40px 0 45px 0;
        }

        .text-crimson {
          color: var(--color-crimson, #94181B);
          letter-spacing: 0.3em;
        }

        .exp-header-container {
          margin-bottom: 50px;
          text-align: center;
        }

        .exp-header-desc {
          font-size: 1.05rem;
          color: var(--color-text-muted, #665255);
          margin-top: 8px;
        }

        .exp-scenes-track {
          display: flex;
          width: 100%;
          gap: 40px;
          padding: 0 4vw;
        }

        .exp-scene-panel {
          flex: 0 0 70vw;
          max-width: 820px;
          min-width: 320px;
        }

        .scene-card-inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          background: var(--color-blush-card, #FFFFFF);
          border: 1px solid var(--color-blush-border, #F0CED2);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.06);
          transition: border-color 0.3s ease;
        }

        .scene-card-inner:hover {
          border-color: var(--color-crimson, #94181B);
        }

        .scene-image-wrap {
          position: relative;
          height: 440px;
          overflow: hidden;
        }

        .scene-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .scene-card-inner:hover .scene-img {
          transform: scale(1.06);
        }

        .scene-tag {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(252, 230, 232, 0.95);
          backdrop-filter: blur(10px);
          color: var(--color-crimson, #94181B);
          font-size: 0.688rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .scene-number {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 600;
          color: rgba(148, 24, 27, 0.2);
        }

        .scene-info-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 36px;
          background: var(--color-blush-card, #FFFFFF);
        }

        .scene-cat {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--color-crimson, #94181B);
          margin-bottom: 10px;
        }

        .scene-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--color-text-dark, #241719);
          line-height: 1.25;
          margin-bottom: 16px;
        }

        .scene-desc {
          font-size: 0.938rem;
          line-height: 1.7;
          color: var(--color-text-muted, #665255);
        }

        @media (max-width: 992px) {
          .exp-scenes-track {
            flex-direction: column;
            gap: 30px;
            padding: 0 16px;
          }
          .exp-scene-panel {
            flex: none;
            width: 100%;
            max-width: 100%;
          }
          .scene-card-inner {
            grid-template-columns: 1fr;
          }
          .scene-image-wrap {
            height: 280px;
          }
          .scene-info-wrap {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
