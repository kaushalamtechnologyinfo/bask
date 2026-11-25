import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import MagneticButton from './MagneticButton';

const PHOTO_CATEGORIES = [
  { id: 'all', label: 'ALL MOMENTS' },
  { id: 'pizza', label: 'FRESH PIZZA DOUGH' },
  { id: 'pasta', label: 'HOUSE-MADE PASTA' },
  { id: 'cocktails', label: 'COCKTAILS & BAR' },
  { id: 'dining', label: 'COASTAL DINING' }
];

const PHOTO_GALLERY = [
  {
    category: 'pizza',
    img: '/baskk-new/pizza-burrata-special.jpg',
    alt: 'Freshly prepared pizza with house-made dough and quality ingredients'
  },
  {
    category: 'pasta',
    img: '/baskk-new/handcrafted-pasta-ragu.jpg',
    alt: 'Handcrafted fresh Italian pasta'
  },
  {
    category: 'pasta',
    img: '/baskk-new/seafood-linguine-fresh.jpg',
    alt: 'Fresh seafood pasta crafted with coastal flavours'
  },
  {
    category: 'pizza',
    img: '/baskk-new/fresh-pizzas-stand.jpg',
    alt: 'Freshly made pizzas prepared with house-made pizza dough'
  },
  {
    category: 'cocktails',
    img: '/baskk-new/cocktail-spritz-refreshing.jpg',
    alt: 'Baskk signature coastal spritzes & cocktails'
  },
  {
    category: 'pizza',
    img: '/baskk-new/pizza-crust-crispy.jpg',
    alt: 'House-made pizza dough baked to golden perfection'
  },
  {
    category: 'dining',
    img: '/baskk-new/baskk-signature-feast.png',
    alt: 'Beachside Italian dining feast along Marine Parade'
  },
  {
    category: 'cocktails',
    img: '/baskk-new/cocktail-signature-pink.jpg',
    alt: 'Signature cocktails overlooking Coolangatta Beach'
  },
  {
    category: 'dining',
    img: '/baskk-new/baskk-beachfront-terrace.jpg',
    alt: 'Al fresco coastal dining terrace'
  },
  {
    category: 'pasta',
    img: '/baskk-new/fresh-gnocchi-truffle.jpg',
    alt: 'Handcrafted fresh Italian pasta'
  },
  {
    category: 'pizza',
    img: '/baskk-new/pizza-margherita-italian.jpg',
    alt: 'Freshly prepared pizza with house-made dough and Italian flavours'
  },
  {
    category: 'cocktails',
    img: '/baskk-new/baskk-bar-ambiance.jpg',
    alt: 'Baskk bar and cocktail lounge atmosphere'
  }
];

export default function MenuPreview() {
  const [activeCategory, setActiveCategory] = useState('all');
  const sliderRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const animFrameIdRef = useRef(null);

  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const filteredPhotos = activeCategory === 'all' 
    ? PHOTO_GALLERY 
    : PHOTO_GALLERY.filter(item => item.category === activeCategory);

  // Build a repeating list so that the track always loops continuously without gaps
  const displayPhotos = React.useMemo(() => {
    if (!filteredPhotos || filteredPhotos.length === 0) return [];
    let list = [...filteredPhotos];
    while (list.length < 8) {
      list = [...list, ...filteredPhotos];
    }
    return [...list, ...list];
  }, [filteredPhotos]);

  // Continuous auto-scrolling loop
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let speed = 0.75; // px per frame
    let lastTime = performance.now();

    const loop = (now) => {
      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      if (!isHoveredRef.current && !isInteractingRef.current && slider) {
        slider.scrollLeft += speed * delta;

        const halfWidth = slider.scrollWidth / 2;
        if (halfWidth > 0) {
          if (slider.scrollLeft >= halfWidth) {
            slider.scrollLeft -= halfWidth;
          } else if (slider.scrollLeft <= 0) {
            slider.scrollLeft += halfWidth;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [displayPhotos]);

  // Reset scroll on category change
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

  const handleArrowScroll = (direction) => {
    if (!sliderRef.current) return;
    isInteractingRef.current = true;
    const cardStep = 332;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -cardStep : cardStep,
      behavior: 'smooth'
    });

    setTimeout(() => {
      if (sliderRef.current) {
        const halfWidth = sliderRef.current.scrollWidth / 2;
        if (halfWidth > 0) {
          if (sliderRef.current.scrollLeft >= halfWidth) {
            sliderRef.current.scrollLeft -= halfWidth;
          } else if (sliderRef.current.scrollLeft <= 0) {
            sliderRef.current.scrollLeft += halfWidth;
          }
        }
      }
      isInteractingRef.current = false;
    }, 600);
  };

  const handleTrackScroll = () => {
    if (sliderRef.current) {
      const halfWidth = sliderRef.current.scrollWidth / 2;
      if (halfWidth > 0) {
        if (sliderRef.current.scrollLeft >= halfWidth) {
          sliderRef.current.scrollLeft -= halfWidth;
        } else if (sliderRef.current.scrollLeft <= 0) {
          sliderRef.current.scrollLeft += halfWidth;
        }
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !sliderRef.current) return;
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollStartLeftRef.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    sliderRef.current.scrollLeft = scrollStartLeftRef.current - walk;

    const halfWidth = sliderRef.current.scrollWidth / 2;
    if (halfWidth > 0) {
      if (sliderRef.current.scrollLeft >= halfWidth) {
        sliderRef.current.scrollLeft -= halfWidth;
        scrollStartLeftRef.current -= halfWidth;
      } else if (sliderRef.current.scrollLeft <= 0) {
        sliderRef.current.scrollLeft += halfWidth;
        scrollStartLeftRef.current += halfWidth;
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grab';
      }
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 1000);
    }
  };

  return (
    <section className="menu-preview-section" ref={containerRef} id="menu">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="editorial-label">CULINARY GALLERY</span>
          <h2 className="editorial-heading" data-reveal="text">THE ART OF BASKK ITALIAN</h2>
          <p className="menu-sub-desc">House-Made Pizza Dough &bull; Handcrafted Pasta &bull; Coastal Dining</p>
        </div>

        {/* Category Pill Tabs */}
        <div className="menu-tabs-wrapper">
          <div className="menu-tabs-bar">
            {PHOTO_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`menu-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Carousel with Continuous Motion */}
        <div 
          className="menu-carousel-outer"
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { 
            isHoveredRef.current = false; 
            handleMouseUpOrLeave();
          }}
          onTouchStart={() => { isInteractingRef.current = true; }}
          onTouchEnd={() => { 
            setTimeout(() => { isInteractingRef.current = false; }, 1200); 
          }}
        >
          {/* Left Arrow Button */}
          <button 
            className="carousel-arrow-btn arrow-prev"
            onClick={() => handleArrowScroll('left')}
            aria-label="Scroll left"
            title="Previous photos"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Right Arrow Button */}
          <button 
            className="carousel-arrow-btn arrow-next"
            onClick={() => handleArrowScroll('right')}
            aria-label="Scroll right"
            title="Next photos"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Horizontal Slider Track with Continuous Infinite Gliding */}
          <div 
            className="menu-carousel-track" 
            ref={sliderRef}
            onScroll={handleTrackScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
          >
            {displayPhotos.map((item, idx) => (
              <Link 
                to="/menu" 
                className="menu-carousel-card" 
                key={`photo-${idx}`}
                title="Click to view full menu & prices"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <div className="card-photo-wrapper">
                  <img 
                    src={item.img} 
                    alt={item.alt} 
                    className="card-photo-img" 
                    loading="lazy" 
                  />
                  <div className="card-photo-gradient"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Button to Full Dining Menu */}
        <div className="menu-cta-wrap text-center">
          <Link to="/menu" className="btn-menu-download" style={{ textDecoration: 'none' }}>
            <span>EXPLORE FULL MENU &amp; PRICES</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      <style>{`
        /* =========================================================
           BASKK MENU HORIZONTAL SCROLLING PHOTO CAROUSEL
           ========================================================= */
        .menu-preview-section {
          background-color: var(--color-blush-bg, #FAF2F3);
          color: var(--color-text-dark, #241719);
          position: relative;
          overflow: hidden;
          padding: 45px 0 75px 0;
        }

        .menu-preview-section .section-header {
          margin-bottom: 20px;
        }

        .menu-sub-desc {
          color: var(--color-crimson, #94181B);
          font-size: 0.88rem;
          margin-top: 6px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Category Pill Bar */
        .menu-tabs-wrapper {
          display: flex;
          justify-content: center;
          margin: 20px 0 30px 0;
        }

        .menu-tabs-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          background: #FFFFFF;
          padding: 6px 10px;
          border-radius: var(--radius-pill, 100px);
          border: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.05);
        }

        .menu-tab-btn {
          position: relative;
          padding: 9px 20px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-dark, #241719);
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          border-radius: var(--radius-pill, 100px);
        }

        .menu-tab-btn.active {
          color: #ffffff;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          border-color: #94181B;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        .menu-tab-btn:hover:not(.active) {
          color: #94181B;
          background: #FCE6E8;
        }

        /* =========================================================
           HORIZONTAL CAROUSEL & ARROW BUTTONS
           ========================================================= */
        .menu-carousel-outer {
          position: relative;
          width: 100%;
          margin: 10px 0 35px 0;
        }

        .menu-carousel-track {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-behavior: auto;
          scroll-snap-type: none;
          padding: 10px 6px 20px 6px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
        }

        .menu-carousel-track:active {
          cursor: grabbing;
        }

        .menu-carousel-track::-webkit-scrollbar {
          display: none;
        }

        .carousel-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #241719;
          border: 1px solid #ECD0D6;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 20;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-arrow-btn:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 10px 28px rgba(148, 24, 27, 0.4);
        }

        .arrow-prev {
          left: -18px;
        }

        .arrow-next {
          right: -18px;
        }

        /* =========================================================
           CLEAN LUXURY PHOTO CARD (NO DISH NAMES, DESCRIPTIONS OR PRICES)
           ========================================================= */
        .menu-carousel-card {
          flex: 0 0 310px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.08);
          background: #FFFFFF;
          user-select: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .menu-carousel-card:hover {
          transform: translateY(-6px);
          border-color: #94181B;
          box-shadow: 0 18px 40px rgba(148, 24, 27, 0.18);
        }

        .card-photo-wrapper {
          position: relative;
          width: 100%;
          height: 380px;
          overflow: hidden;
          background: #F2E4E7;
        }

        .card-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          -webkit-user-drag: none;
          user-select: none;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-carousel-card:hover .card-photo-img {
          transform: scale(1.08);
        }

        .card-photo-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(36, 23, 25, 0.12) 0%, transparent 40%, rgba(36, 23, 25, 0.25) 100%);
          pointer-events: none;
        }

        /* =========================================================
           CTA BUTTON
           ========================================================= */
        .menu-cta-wrap {
          margin-top: 15px;
        }

        .btn-menu-download {
          padding: 16px 36px;
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #fff;
          font-size: 0.813rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          border-radius: var(--radius-pill, 100px);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.4);
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
        }

        .btn-menu-download:hover {
          background: linear-gradient(135deg, #B01C20 0%, #94181B 100%);
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(148, 24, 27, 0.6);
          color: #fff;
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS
           ========================================================= */
        @media (max-width: 992px) {
          .menu-carousel-card {
            flex: 0 0 270px;
          }
          .card-photo-wrapper {
            height: 330px;
          }
          .arrow-prev {
            left: -8px;
          }
          .arrow-next {
            right: -8px;
          }
        }

        @media (max-width: 600px) {
          .menu-carousel-card {
            flex: 0 0 240px;
          }
          .card-photo-wrapper {
            height: 300px;
          }
          .carousel-arrow-btn {
            width: 40px;
            height: 40px;
            font-size: 0.95rem;
          }
          .arrow-prev {
            left: 0;
          }
          .arrow-next {
            right: 0;
          }
        }
      `}</style>
    </section>
  );
}
