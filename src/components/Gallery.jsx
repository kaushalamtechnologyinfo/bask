import React, { useState, useEffect, useMemo } from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export const DEFAULT_GALLERY_IMAGES = [
  { img: '/life-at-bask/DSC08973.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-large' },
  { img: '/life-at-bask/DSC08974.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08975.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08993.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-wide' },
  { img: '/life-at-bask/DSC09003.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC09007.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC09009.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-large' },
  { img: '/life-at-bask/DSC09010.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC09018.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08897.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08898.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08899.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-wide' },
  { img: '/life-at-bask/DSC08900.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08904.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08905.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-large' },
  { img: '/life-at-bask/DSC08906.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08910.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08914.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08916.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08917.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-wide' },
  { img: '/life-at-bask/DSC08929.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08932.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08955.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-large' },
  { img: '/life-at-bask/DSC08956.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08959.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08965.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments', feature: 'feature-wide' },
  { img: '/life-at-bask/DSC08969.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' },
  { img: '/life-at-bask/DSC08972.jpg', alt: 'Life at Baskk - Coastal Italian Dining & Moments' }
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const allImages = DEFAULT_GALLERY_IMAGES;

  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const visibleImages = showAll ? allImages : allImages.slice(0, 12);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, allImages.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="gallery-section" ref={containerRef} id="gallery">
      <div className="container">
        <div className="section-header text-center">
          <div className="tripadvisor-badge-wrap">
            <div className="tripadvisor-verified-tag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 1.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm6.5 4c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-3.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-5 7c-2.48 0-4.5-2.02-4.5-4.5 0-.64.14-1.25.39-1.8.44.49 1.07.8 1.77.8 1.38 0 2.5-1.12 2.5-2.5 0-.17-.02-.34-.06-.5 1.25.5 2.15 1.7 2.22 3.12.18-.08.37-.12.58-.12.83 0 1.5.67 1.5 1.5 0 2.48-2.02 4.5-4.5 4.5z"/>
              </svg>
              <span>Verified Diner Moments</span>
            </div>
          </div>
          <span className="editorial-label">VISUAL JOURNAL</span>
          <h2 className="editorial-heading" data-reveal="text">Life at Baskk</h2>
          <p className="gallery-sub-text">Moments captured at 52–58 Marine Parade, Coolangatta</p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {visibleImages.map((item, idx) => {
            const actualIndex = allImages.indexOf(item);
            return (
              <div 
                className={`masonry-item ${item.feature || ''}`} 
                key={item.id || `${item.img}-${idx}`} 
                data-reveal="clip" 
                onClick={() => setSelectedIndex(actualIndex >= 0 ? actualIndex : idx)}
              >
                <img src={item.img} alt={item.alt} className="masonry-img" loading="lazy" />
                <div className="masonry-hover-overlay">
                  <span className="hover-zoom-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All / Toggle Button */}
        <div className="gallery-cta-row text-center">
          <button 
            type="button" 
            className="btn-gallery-toggle"
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? 'SHOW LESS PHOTOS' : `VIEW ALL ${allImages.length} PHOTOS`}</span>
            <i className={`fa-solid ${showAll ? 'fa-chevron-up' : 'fa-grid-2'}`}></i>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && allImages[selectedIndex] && (
        <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedIndex(null)} aria-label="Close">✕</button>
            
            {/* Arrow Previous */}
            <button className="lightbox-arrow-btn prev" onClick={handlePrev} aria-label="Previous photo">
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {/* Main Lightbox Image */}
            <div className="lightbox-image-stage">
              <img 
                src={allImages[selectedIndex].img} 
                alt={allImages[selectedIndex].alt} 
                className="lightbox-img" 
              />
            </div>

            {/* Arrow Next */}
            <button className="lightbox-arrow-btn next" onClick={handleNext} aria-label="Next photo">
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            {/* Bottom Counter Bar */}
            <div className="lightbox-counter-bar">
              <span>Photo {selectedIndex + 1} of {allImages.length} &bull; {allImages[selectedIndex].alt || 'Life at Baskk'}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-section {
          background-color: var(--color-blush-light, #FFF8F9);
          color: var(--color-text-dark, #241719);
          padding: 40px 0 50px 0;
        }

        .gallery-section .section-header {
          margin-bottom: 32px;
        }

        .tripadvisor-badge-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .tripadvisor-verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 175, 135, 0.1);
          color: #008768;
          border: 1px solid rgba(0, 175, 135, 0.28);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .gallery-section .editorial-label {
          display: block;
          margin-bottom: 10px;
        }

        .tripadvisor-verified-tag svg {
          fill: #00af87;
        }

        .gallery-sub-text {
          color: var(--color-text-muted, #665255);
          font-size: 0.95rem;
          margin-top: 6px;
        }

        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 240px;
          gap: 20px;
          margin-top: 40px;
        }

        .masonry-item {
          position: relative;
          border-radius: var(--radius-md, 12px);
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(148, 24, 27, 0.08);
          border: 1px solid var(--color-blush-border, #F0CED2);
          cursor: pointer;
          background: #EFE6E8;
        }

        .masonry-item.feature-large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .masonry-item.feature-wide {
          grid-column: span 2;
        }

        .masonry-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s var(--ease-expo, cubic-bezier(0.16, 1, 0.3, 1));
        }

        .masonry-item:hover .masonry-img {
          transform: scale(1.06);
        }

        .masonry-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(36, 23, 25, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .masonry-item:hover .masonry-hover-overlay {
          opacity: 1;
        }

        .hover-zoom-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          color: var(--color-crimson, #94181B);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transform: scale(0.85);
          transition: transform 0.3s ease;
        }

        .masonry-item:hover .hover-zoom-icon {
          transform: scale(1);
        }

        /* Toggle Button */
        .gallery-cta-row {
          margin-top: 40px;
        }

        .btn-gallery-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: #FFFFFF;
          color: var(--color-crimson, #94181B);
          border: 1px solid var(--color-blush-border, #F0CED2);
          border-radius: var(--radius-pill, 100px);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.08);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-gallery-toggle:hover {
          background: var(--color-crimson, #94181B);
          color: #FFFFFF;
          border-color: var(--color-crimson, #94181B);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(148, 24, 27, 0.25);
        }

        /* Lightbox Modal */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(20, 14, 16, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.25s ease;
        }

        .lightbox-container {
          position: relative;
          max-width: 960px;
          width: 100%;
          background: #140E10;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
        }

        .lightbox-image-stage {
          width: 100%;
          max-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          display: block;
        }

        .lightbox-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-close-btn:hover {
          background: var(--color-crimson, #94181B);
          transform: scale(1.08);
        }

        .lightbox-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(20, 14, 16, 0.7);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .lightbox-arrow-btn:hover {
          background: var(--color-crimson, #94181B);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-arrow-btn.prev {
          left: 14px;
        }

        .lightbox-arrow-btn.next {
          right: 14px;
        }

        .lightbox-counter-bar {
          padding: 12px 20px;
          background: rgba(20, 14, 16, 0.95);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-align: center;
          font-family: var(--font-sans);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 992px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 200px;
          }
          .masonry-item.feature-large {
            grid-column: span 2;
            grid-row: span 2;
          }
          .masonry-item.feature-wide {
            grid-column: span 2;
          }
        }

        @media (max-width: 576px) {
          .masonry-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 230px;
          }
          .masonry-item.feature-large,
          .masonry-item.feature-wide {
            grid-column: span 1;
            grid-row: span 1;
          }
          .lightbox-arrow-btn {
            width: 38px;
            height: 38px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
}
