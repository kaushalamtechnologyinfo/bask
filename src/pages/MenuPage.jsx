import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MENU_SECTIONS = [
  {
    id: 'food-menu',
    title: 'Food Menu',
    italianTitle: 'La Cucina 2026',
    badge: 'Dinner & All Day 2026',
    tagline: 'Handcrafted pasta, house-made pizza dough & fresh coastal seafood',
    pdfUrl: '/food-menu.pdf?v=2026-live',
    pdfDownloadName: 'FOOD MENU 2026.pdf',
    icon: 'fa-solid fa-utensils',
    images: [
      { src: '/menu-sheets/food-2026-1.jpg?v=2026', page: 1, title: 'Antipasti & Insalate', desc: 'Insalata Pera Decana, Arancini, Burrata & Artisanal Italian Starters' },
      { src: '/menu-sheets/food-2026-2.jpg?v=2026', page: 2, title: 'Handcrafted Pasta', desc: '12-Hour Lamb Ragù, Pappardelle, House-Made Pastas & Gluten-Free Options' },
      { src: '/menu-sheets/food-2026-3.jpg?v=2026', page: 3, title: 'Artisan Pizzas', desc: 'Margherita, Fresh Byron Bay Burrata, Polpette & House-Made Dough' },
      { src: '/menu-sheets/food-2026-4.jpg?v=2026', page: 4, title: 'Secondi & Coastal Mains', desc: 'Slow-Cooked Tender Beef Cheek, Saffron Rice & Pan-Fried Garlic Prawns' },
      { src: '/menu-sheets/food-2026-5.jpg?v=2026', page: 5, title: 'Dolci & Desserts', desc: 'Traditional Tiramisù with Mascarpone & Savoiardi, Warm Churros' },
      { src: '/menu-sheets/food-2026-6.jpg?v=2026', page: 6, title: 'Signature Cocktails', desc: 'Baskk In The Sun, Strawberry Caipiroska & Refreshing Summer Mixes' },
      { src: '/menu-sheets/food-2026-7.jpg?v=2026', page: 7, title: 'Happy Hour & Beers', desc: 'Baskk Draught Lager, Tropical Pale Ale, Super Crisp & House Shiraz' }
    ]
  },
  {
    id: 'drink-menu',
    title: 'Drinks Menu',
    italianTitle: 'Bevande & Bar 2026',
    badge: 'Bar & Cellar 2026',
    tagline: 'Signature coastal spritzes, Italian wines, craft beers & cocktails',
    pdfUrl: '/drinks-menu.pdf?v=2026-live',
    pdfDownloadName: 'Drinks Menu 2026.pdf',
    icon: 'fa-solid fa-martini-glass-citrus',
    images: [
      { src: '/menu-sheets/drinks-2026-1.jpg?v=2026', page: 1, title: 'Wines & Secret Cellar', desc: 'White, Red, Sparkling & Curated Secret Wines' },
      { src: '/menu-sheets/drinks-2026-2.jpg?v=2026', page: 2, title: 'Signature Cocktails', desc: 'Il Blue, Amalfi, Spritzes & Coastal Mixology' },
      { src: '/menu-sheets/drinks-2026-3.jpg?v=2026', page: 3, title: 'Beers & Draught', desc: 'Baskk Lager, Tropical Pale Ale, Peroni & Craft Beers' },
      { src: '/menu-sheets/drinks-2026-4.jpg?v=2026', page: 4, title: 'Spirits & Alcohol-Free Mocktails', desc: 'Vodka, Gin, Tequila, Whiskey, Digestivi, Artisanal Mocktails & Soft Drinks' }
    ]
  },
  {
    id: 'happy-hour',
    title: 'Happy Hour 2026',
    italianTitle: 'Baskk in the Sun',
    badge: '2 For $26 Cocktails • $12 Bites',
    tagline: '2-for-$26 signature cocktails, $10 beers & house wines, and $12 Italian bar bites',
    pdfUrl: '/happy-hour-2026.pdf?v=2026-live',
    pdfDownloadName: 'Happy Hour 2026.pdf',
    icon: 'fa-solid fa-sun',
    images: [
      { src: '/menu-sheets/food-2026-6.jpg?v=2026', page: 1, title: 'Happy Hour — 2 For $26 Cocktails', desc: 'Baskk In The Sun, Strawberry Caipiroska, Passion, Pineapple Crush, Mexican Sunrise, Weekend Special & Single Spirit' },
      { src: '/menu-sheets/food-2026-7.jpg?v=2026', page: 2, title: 'Happy Hour — Beers, Wines & $12 Bites', desc: 'Baskk Lager, Tropical Ale & Super Crisp ($10/$12), House Wines ($10/$14) & $12 Bites (Garlic Pizza Bread, Arancini, Polpette, Patata Fritti, Mozzarella Sticks)' }
    ]
  },
  {
    id: 'set-menu',
    title: 'Set Menu 2026',
    italianTitle: 'Menu Fisso 2026',
    badge: 'Groups & Functions',
    tagline: 'Multi-course shared feasts & celebration packages for groups',
    pdfUrl: '/set-menu-2026.pdf?v=2026-live',
    pdfDownloadName: 'SET_MENU.2026.pdf',
    icon: 'fa-solid fa-champagne-glasses',
    images: [
      { src: '/menu-sheets/set-2026-1.jpg?v=2026', page: 1, title: 'Menu 1 – Group Feast ($34 / $44 pp)', desc: 'Pane de Casa, Truffle Arancini, Freshly Made Pizzas & Handcrafted Pasta' },
      { src: '/menu-sheets/set-2026-2.jpg?v=2026', page: 2, title: 'Menu 2 – Italian Buffet ($39 pp)', desc: 'Garlic Bread, Penne Bolognese, Carbonara, Pomodoro, Fresh Salad & Tiramisù' },
      { src: '/menu-sheets/set-2026-3.jpg?v=2026', page: 3, title: 'Menu 4 – Walk & Talk Event ($69 pp)', desc: 'Antipasto Grazing Board, Sliders, Sticky Pork Belly, Local Fish & Chips, Calamari' },
      { src: '/menu-sheets/set-2026-4.jpg?v=2026', page: 4, title: 'Menu 5 – Deluxe 4-Course Banquet ($119 pp)', desc: 'Arrival Drink & Canapés, Cold Entrée, Hot Pasta, Premium Mains & Dolce' },
      { src: '/menu-sheets/set-2026-5.jpg?v=2026', page: 5, title: 'Menu 6 – Shared Platters (8–10 Pax)', desc: 'The Farmer’s Meat Feast ($399) & The Farmer’s and Fisherman ($429) Platters' }
    ]
  }
];

export default function MenuPage({ onOpenBook }) {
  const [activeSectionId, setActiveSectionId] = useState('food-menu');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'grid'
  const [lightboxData, setLightboxData] = useState(null); // { section, index }

  const activeSection = MENU_SECTIONS.find(s => s.id === activeSectionId) || MENU_SECTIONS[0];
  const totalPages = activeSection.images.length;
  const currentImage = activeSection.images[currentPageIndex] || activeSection.images[0];

  const handleSelectSection = (id) => {
    setActiveSectionId(id);
    setCurrentPageIndex(0);
    setViewMode('book');
  };

  const handlePrevPage = () => {
    setCurrentPageIndex(prev => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPageIndex(prev => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for reader & lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxData) {
        if (e.key === 'Escape') setLightboxData(null);
        if (e.key === 'ArrowLeft') {
          const total = lightboxData.section.images.length;
          setLightboxData(prev => ({
            ...prev,
            index: prev.index === 0 ? total - 1 : prev.index - 1
          }));
        }
        if (e.key === 'ArrowRight') {
          const total = lightboxData.section.images.length;
          setLightboxData(prev => ({
            ...prev,
            index: prev.index === total - 1 ? 0 : prev.index + 1
          }));
        }
      } else if (viewMode === 'book' && totalPages > 1) {
        if (e.key === 'ArrowLeft') handlePrevPage();
        if (e.key === 'ArrowRight') handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData, viewMode, totalPages]);

  return (
    <div className="baskk-luxury-menu-page">
      <Navbar onOpenBook={onOpenBook} />

      <main className="menu-page-main">
        {/* --- EDITORIAL HERO SECTION --- */}
        <section className="menu-hero-editorial">
          <div className="container">
            <div className="hero-editorial-center">
              <span className="hero-eyebrow-pill">
                <i className="fa-solid fa-sparkles"></i> A TASTE OF MODERN ITALY • COOLANGATTA
              </span>
              <h1 className="hero-main-title">Our Menus</h1>
              <p className="hero-lead-text">
                Explore our freshly crafted Italian cuisine, house-made pasta, pizza dough prepared daily, 
                curated regional wines, and signature coastal spritzes overlooking Marine Parade.
              </p>

              {/* Luxury Category Navigation Tabs */}
              <div className="luxury-menu-tabs-bar" role="tablist">
                {MENU_SECTIONS.map((sec) => {
                  const isActive = sec.id === activeSectionId;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`luxury-tab-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleSelectSection(sec.id)}
                    >
                      <i className={sec.icon}></i>
                      <span className="tab-btn-title">{sec.title}</span>
                      <span className="tab-btn-badge">{sec.images.length} Pages</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- MAIN MENU STAGE & CONTROLS --- */}
        <section className="menu-showcase-section" id="menu-viewer-stage">
          <div className="container">

            {/* Menu Meta & Action Bar */}
            <div className="menu-controls-header">
              <div className="header-meta-info">
                <span className="meta-italian-accent">{activeSection.italianTitle}</span>
                <h2 className="meta-category-heading">{activeSection.title}</h2>
                <p className="meta-tagline-text">{activeSection.tagline}</p>
              </div>

              <div className="header-actions-group">
                {/* View Mode Toggle: Reader vs Grid */}
                <div className="view-mode-pill-toggle" role="group" aria-label="Menu View Mode">
                  <button
                    type="button"
                    className={`mode-btn ${viewMode === 'book' ? 'active' : ''}`}
                    onClick={() => setViewMode('book')}
                    title="Interactive Book Reader"
                  >
                    <i className="fa-solid fa-book-open"></i>
                    <span>Reader</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="View all pages in a grid"
                  >
                    <i className="fa-solid fa-table-cells-large"></i>
                    <span>Grid ({totalPages})</span>
                  </button>
                </div>

                {/* PDF Download Button */}
                <a
                  href={activeSection.pdfUrl}
                  download={activeSection.pdfDownloadName}
                  className="btn-download-luxury"
                  title={`Download ${activeSection.title} PDF`}
                >
                  <i className="fa-solid fa-file-arrow-down"></i>
                  <span>Download PDF</span>
                </a>

                {/* Order Online Shortcut */}
                <a
                  href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-order-luxury"
                  title="Order takeaway pickup online"
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span>Order Online</span>
                </a>
              </div>
            </div>

            {/* --- VIEW MODE 1: LUXURY BOOK READER --- */}
            {viewMode === 'book' && (
              <div className="luxury-reader-stage">
                <div className="reader-card-viewport">
                  {/* Left Arrow Button */}
                  {totalPages > 1 && (
                    <button
                      type="button"
                      className="reader-nav-arrow arrow-prev"
                      onClick={handlePrevPage}
                      aria-label="Previous Page"
                      title="Previous Page (Arrow Left)"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  )}

                  {/* Main Menu Sheet Card */}
                  <div 
                    className="menu-sheet-frame"
                    onClick={() => setLightboxData({ section: activeSection, index: currentPageIndex })}
                    title="Click to zoom fullscreen"
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={currentImage.src}
                      alt={`${activeSection.title} - Page ${currentPageIndex + 1}: ${currentImage.title}`}
                      className="menu-sheet-image"
                    />

                    {/* Hover Enlarge Pill */}
                    <div className="sheet-hover-tint">
                      <div className="zoom-floating-pill">
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                        <span>Click to view full screen</span>
                      </div>
                    </div>

                    {/* Bottom Corner Page Badge */}
                    <div className="sheet-corner-pill">
                      <span>Baskk &bull; Page {currentPageIndex + 1} of {totalPages}</span>
                    </div>
                  </div>

                  {/* Right Arrow Button */}
                  {totalPages > 1 && (
                    <button
                      type="button"
                      className="reader-nav-arrow arrow-next"
                      onClick={handleNextPage}
                      aria-label="Next Page"
                      title="Next Page (Arrow Right)"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  )}
                </div>

                {/* Reader Meta Caption Bar */}
                <div className="reader-caption-row">
                  <div className="caption-left-info">
                    <span className="caption-badge">Page {currentPageIndex + 1} of {totalPages}</span>
                    <h3 className="caption-title">{currentImage.title}</h3>
                    {currentImage.desc && <span className="caption-description">— {currentImage.desc}</span>}
                  </div>

                  <div className="caption-right-actions">
                    <button
                      type="button"
                      className="btn-zoom-action"
                      onClick={() => setLightboxData({ section: activeSection, index: currentPageIndex })}
                    >
                      <i className="fa-solid fa-expand"></i>
                      <span>Fullscreen</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Quick Jump Thumbnails Strip */}
                {totalPages > 1 && (
                  <div className="reader-thumbnails-container">
                    <span className="thumbnails-eyebrow">Quick Page Selection:</span>
                    <div className="thumbnails-grid">
                      {activeSection.images.map((img, idx) => {
                        const isCurrent = idx === currentPageIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`thumb-button ${isCurrent ? 'is-selected' : ''}`}
                            onClick={() => setCurrentPageIndex(idx)}
                          >
                            <img 
                              src={img.src} 
                              alt={`Thumbnail page ${idx + 1}`} 
                              className="thumb-image-preview" 
                              loading="lazy" 
                            />
                            <div className="thumb-text-col">
                              <span className="thumb-page-num">Page {idx + 1}</span>
                              <span className="thumb-title-text">{img.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- VIEW MODE 2: EDITORIAL GRID VIEW --- */}
            {viewMode === 'grid' && (
              <div className="luxury-grid-stage">
                <div className="grid-notice-banner">
                  <i className="fa-solid fa-sparkles"></i>
                  <span>Showing all {totalPages} pages of {activeSection.title}. Click any page to open fullscreen zoom.</span>
                </div>

                <div className="grid-cards-layout">
                  {activeSection.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="grid-card-item"
                      onClick={() => setLightboxData({ section: activeSection, index: idx })}
                    >
                      <div className="grid-card-media-wrap">
                        <img
                          src={img.src}
                          alt={`${activeSection.title} - Page ${idx + 1}`}
                          className="grid-card-img"
                          loading="lazy"
                        />
                        <div className="grid-card-overlay">
                          <span className="grid-zoom-pill">
                            <i className="fa-solid fa-magnifying-glass-plus"></i> View Page {idx + 1}
                          </span>
                        </div>
                      </div>

                      <div className="grid-card-caption">
                        <span className="grid-page-tag">Page {idx + 1} of {totalPages}</span>
                        <h4 className="grid-card-title">{img.title}</h4>
                        {img.desc && <p className="grid-card-desc">{img.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* --- QUALITY & HOSPITALITY PILLARS BANNER --- */}
        <section className="menu-promises-section">
          <div className="container">
            <div className="promises-grid">
              <div className="promise-card">
                <div className="promise-icon-wrap"><i className="fa-solid fa-wheat-awn-circle-exclamation"></i></div>
                <h4 className="promise-title">Dietary Requirements</h4>
                <p className="promise-desc">Gluten-free pasta, gluten-free pizza bases, vegetarian &amp; vegan options available across our kitchen.</p>
              </div>

              <div className="promise-card">
                <div className="promise-icon-wrap"><i className="fa-solid fa-pizza-slice"></i></div>
                <h4 className="promise-title">Freshly Made Pizza Dough</h4>
                <p className="promise-desc">Our pizzas begin with freshly prepared, house-made dough, crafted with care to deliver delicious flavour and texture in every bite.</p>
              </div>

              <div className="promise-card">
                <div className="promise-icon-wrap"><i className="fa-solid fa-fish"></i></div>
                <h4 className="promise-title">Fresh Ocean Catch</h4>
                <p className="promise-desc">Locally sourced Australian seafood, market fresh fish, and premium artisan imported ingredients.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- IMMERSIVE FULLSCREEN LIGHTBOX MODAL --- */}
      {lightboxData && (
        <div 
          className="fullscreen-lightbox-backdrop"
          onClick={() => setLightboxData(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="lightbox-inner-box" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxData(null)}
              aria-label="Close Lightbox (Esc)"
              title="Close (Esc)"
            >
              &times;
            </button>

            {/* Prev Arrow */}
            {lightboxData.section.images.length > 1 && (
              <button
                type="button"
                className="lightbox-arrow-btn arrow-left"
                onClick={() => {
                  const total = lightboxData.section.images.length;
                  setLightboxData(prev => ({
                    ...prev,
                    index: prev.index === 0 ? total - 1 : prev.index - 1
                  }));
                }}
                aria-label="Previous Page"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {/* Lightbox High-Res Image */}
            <div className="lightbox-img-center-stage">
              <img
                src={lightboxData.section.images[lightboxData.index].src}
                alt={`${lightboxData.section.title} - Page ${lightboxData.index + 1}`}
                className="lightbox-full-img"
              />
            </div>

            {/* Next Arrow */}
            {lightboxData.section.images.length > 1 && (
              <button
                type="button"
                className="lightbox-arrow-btn arrow-right"
                onClick={() => {
                  const total = lightboxData.section.images.length;
                  setLightboxData(prev => ({
                    ...prev,
                    index: prev.index === total - 1 ? 0 : prev.index + 1
                  }));
                }}
                aria-label="Next Page"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}

            {/* Lightbox Footer Bar */}
            <div className="lightbox-bottom-bar">
              <div className="lightbox-meta">
                <span className="lightbox-tag">{lightboxData.section.title}</span>
                <span className="lightbox-page-num">
                  Page {lightboxData.index + 1} of {lightboxData.section.images.length}
                </span>
                {lightboxData.section.images[lightboxData.index].title && (
                  <span className="lightbox-label-text">
                    &bull; {lightboxData.section.images[lightboxData.index].title}
                  </span>
                )}
              </div>

              <div className="lightbox-actions-row">
                <a
                  href={lightboxData.section.pdfUrl}
                  download={lightboxData.section.pdfDownloadName}
                  className="btn-lightbox-action"
                >
                  <i className="fa-solid fa-file-arrow-down"></i>
                  <span>Download PDF</span>
                </a>

                <a
                  href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lightbox-action primary"
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span>Order Online</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        /* =========================================================
           BASKK LUXURY MENU PAGE STYLES
           ========================================================= */
        .baskk-luxury-menu-page {
          background-color: #FAF2F3;
          color: #241719;
          min-height: 100vh;
          font-family: var(--font-sans, 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif);
        }

        .menu-page-main {
          padding-top: 85px;
        }

        /* --- HERO EDITORIAL SECTION --- */
        .menu-hero-editorial {
          background: linear-gradient(180deg, #FFFFFF 0%, #FCF5F6 70%, #FAF2F3 100%);
          border-bottom: 1px solid #F0CED2;
          padding: 60px 0 35px 0;
          text-align: center;
          position: relative;
        }

        .hero-editorial-center {
          max-width: 1120px;
          margin: 0 auto;
        }

        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFF1F3;
          color: #94181B;
          border: 1px solid #F0CED2;
          padding: 6px 18px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .hero-main-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(3rem, 5.5vw, 4.6rem);
          font-weight: 600;
          color: #241719;
          line-height: 1.05;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }

        .hero-lead-text {
          font-size: clamp(0.98rem, 1.8vw, 1.12rem);
          line-height: 1.65;
          color: #695256;
          max-width: 680px;
          margin: 0 auto 32px auto;
        }

        /* --- LUXURY CATEGORY TABS BAR --- */
        .luxury-menu-tabs-bar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: nowrap;
          background: #FFFFFF;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid #F0CED2;
          box-shadow: 0 8px 28px rgba(148, 24, 27, 0.06);
          max-width: 100%;
        }

        .luxury-tab-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 11px 20px;
          border-radius: 999px;
          background: transparent;
          border: 1.5px solid transparent;
          color: #241719;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .luxury-tab-btn i {
          color: #94181B;
          font-size: 1rem;
          transition: color 0.2s ease;
        }

        .luxury-tab-btn .tab-btn-badge {
          font-size: 0.7rem;
          background: #FAF2F3;
          color: #8C6A6F;
          padding: 2px 9px;
          border-radius: 999px;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .luxury-tab-btn:hover {
          color: #94181B;
          background: #FFF8F9;
        }

        .luxury-tab-btn.is-active {
          background: linear-gradient(135deg, #94181B 0%, #7A1215 100%);
          color: #FFFFFF;
          border-color: #94181B;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        .luxury-tab-btn.is-active i {
          color: #FFFFFF;
        }

        .luxury-tab-btn.is-active .tab-btn-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }

        /* --- SHOWCASE SECTION --- */
        .menu-showcase-section {
          padding: 35px 0 60px 0;
        }

        .menu-controls-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
          margin-bottom: 30px;
          border-bottom: 1px solid #F0CED2;
          flex-wrap: wrap;
        }

        .meta-italian-accent {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-style: italic;
          font-size: 1.15rem;
          color: #94181B;
          display: block;
          margin-bottom: 4px;
        }

        .meta-category-heading {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(2rem, 3.6vw, 2.8rem);
          font-weight: 600;
          color: #241719;
          margin: 0 0 6px 0;
          line-height: 1.1;
        }

        .meta-tagline-text {
          font-size: 0.95rem;
          color: #695256;
          margin: 0;
        }

        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .view-mode-pill-toggle {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #F0CED2;
          border-radius: 999px;
          padding: 4px;
        }

        .mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: transparent;
          border: none;
          color: #665255;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn.active {
          background: #241719;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .btn-download-luxury {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #94181B;
          color: #FFFFFF;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(148, 24, 27, 0.25);
          transition: all 0.25s ease;
        }

        .btn-download-luxury:hover {
          background: #731315;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.35);
        }

        .btn-order-luxury {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #FFFFFF;
          color: #241719;
          border: 1px solid #F0CED2;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-order-luxury:hover {
          background: #FFF1F3;
          border-color: #94181B;
          color: #94181B;
        }

        /* --- LUXURY READER STAGE --- */
        .luxury-reader-stage {
          background: #FFFFFF;
          border: 1px solid #F0CED2;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 10px 40px rgba(148, 24, 27, 0.05);
        }

        .reader-card-viewport {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FDF9FA;
          border-radius: 14px;
          padding: 24px;
          min-height: 540px;
        }

        .menu-sheet-frame {
          position: relative;
          cursor: pointer;
          max-width: 800px;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(240, 206, 210, 0.6);
          box-shadow: 0 20px 60px rgba(148, 24, 27, 0.12), 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .menu-sheet-frame:hover {
          transform: translateY(-4px);
          box-shadow: 0 26px 70px rgba(148, 24, 27, 0.18), 0 6px 24px rgba(0, 0, 0, 0.08);
        }

        .menu-sheet-image {
          width: 100%;
          height: auto;
          max-height: 72vh;
          object-fit: contain;
          display: block;
        }

        @media (max-height: 850px) {
          .menu-sheet-image {
            max-height: 58vh;
          }
        }

        .sheet-hover-tint {
          position: absolute;
          inset: 0;
          background: rgba(36, 23, 25, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .menu-sheet-frame:hover .sheet-hover-tint {
          opacity: 1;
        }

        .zoom-floating-pill {
          background: #94181B;
          color: #FFFFFF;
          padding: 11px 24px;
          border-radius: 999px;
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
          transform: scale(0.95);
          transition: transform 0.25s ease;
        }

        .menu-sheet-frame:hover .zoom-floating-pill {
          transform: scale(1);
        }

        .sheet-corner-pill {
          position: absolute;
          bottom: 14px;
          right: 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #7A1215;
          letter-spacing: 0.06em;
          border: 1px solid #F0CED2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .reader-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid #F0CED2;
          color: #94181B;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.12);
          transition: all 0.25s ease;
        }

        .reader-nav-arrow:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(148, 24, 27, 0.3);
        }

        .reader-nav-arrow.arrow-prev {
          left: 14px;
        }

        .reader-nav-arrow.arrow-next {
          right: 14px;
        }

        /* Caption Bar */
        .reader-caption-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 0 16px 0;
          border-bottom: 1px solid #F0CED2;
          flex-wrap: wrap;
        }

        .caption-left-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .caption-badge {
          background: #94181B;
          color: #FFFFFF;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .caption-title {
          font-size: 1.05rem;
          color: #241719;
          font-weight: 700;
          margin: 0;
        }

        .caption-description {
          font-size: 0.92rem;
          color: #7A6265;
        }

        .btn-zoom-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: #FAF2F3;
          border: 1px solid #F0CED2;
          color: #94181B;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-zoom-action:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
        }

        /* Thumbnails Strip */
        .reader-thumbnails-container {
          margin-top: 24px;
        }

        .thumbnails-eyebrow {
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8C6A6F;
          margin-bottom: 12px;
        }

        .thumbnails-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }

        .thumb-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FAF6F6;
          border: 1.5px solid #F0CED2;
          border-radius: 12px;
          padding: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.25s ease;
        }

        .thumb-button:hover {
          border-color: #94181B;
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(148, 24, 27, 0.1);
        }

        .thumb-button.is-selected {
          border-color: #94181B;
          background: #FFF1F3;
          box-shadow: 0 4px 16px rgba(148, 24, 27, 0.18);
        }

        .thumb-image-preview {
          width: 44px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .thumb-text-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .thumb-page-num {
          font-size: 0.7rem;
          font-weight: 800;
          color: #94181B;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .thumb-title-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #241719;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* --- GRID STAGE --- */
        .luxury-grid-stage {
          background: #FFFFFF;
          border: 1px solid #F0CED2;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(148, 24, 27, 0.05);
        }

        .grid-notice-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFF1F3;
          border: 1px solid #F0CED2;
          padding: 12px 20px;
          border-radius: 12px;
          color: #7A1215;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .grid-cards-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .grid-card-item {
          background: #FFFFFF;
          border: 1px solid #F0CED2;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(148, 24, 27, 0.06);
        }

        .grid-card-item:hover {
          transform: translateY(-4px);
          border-color: #94181B;
          box-shadow: 0 12px 30px rgba(148, 24, 27, 0.16);
        }

        .grid-card-media-wrap {
          position: relative;
          background: #FAF6F6;
          overflow: hidden;
        }

        .grid-card-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .grid-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(36, 23, 25, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .grid-card-item:hover .grid-card-overlay {
          opacity: 1;
        }

        .grid-zoom-pill {
          background: #94181B;
          color: #FFFFFF;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .grid-card-caption {
          padding: 16px;
        }

        .grid-page-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #94181B;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .grid-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #241719;
          margin: 0 0 4px 0;
        }

        .grid-card-desc {
          font-size: 0.82rem;
          color: #7A6265;
          margin: 0;
          line-height: 1.4;
        }

        /* --- PROMISES BANNER --- */
        .menu-promises-section {
          padding: 10px 0 60px 0;
        }

        .promises-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .promise-card {
          background: #FFFFFF;
          border: 1px solid #F0CED2;
          border-radius: 16px;
          padding: 26px 22px;
          box-shadow: 0 4px 20px rgba(148, 24, 27, 0.05);
        }

        .promise-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #FFF1F3;
          color: #94181B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          margin-bottom: 16px;
        }

        .promise-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #241719;
          margin: 0 0 8px 0;
        }

        .promise-desc {
          font-size: 0.88rem;
          color: #695256;
          line-height: 1.55;
          margin: 0;
        }

        /* --- FULLSCREEN LIGHTBOX --- */
        .fullscreen-lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 16, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lightbox-inner-box {
          position: relative;
          max-width: 900px;
          width: 100%;
          max-height: 94vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-close-btn {
          position: absolute;
          top: -46px;
          right: 0;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-size: 2.2rem;
          line-height: 1;
          cursor: pointer;
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }

        .lightbox-close-btn:hover {
          opacity: 1;
          color: #F0CED2;
        }

        .lightbox-img-center-stage {
          display: flex;
          justify-content: center;
          align-items: center;
          max-height: 80vh;
          width: 100%;
        }

        .lightbox-full-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }

        .lightbox-arrow-btn {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lightbox-arrow-btn:hover {
          background: #94181B;
          border-color: #94181B;
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-arrow-btn.arrow-left {
          left: -65px;
        }

        .lightbox-arrow-btn.arrow-right {
          right: -65px;
        }

        .lightbox-bottom-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .lightbox-meta {
          color: #FFFFFF;
          font-size: 0.9rem;
        }

        .lightbox-tag {
          font-weight: 700;
          color: #F0CED2;
          margin-right: 8px;
        }

        .lightbox-actions-row {
          display: flex;
          gap: 10px;
        }

        .btn-lightbox-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }

        .btn-lightbox-action:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .btn-lightbox-action.primary {
          background: #94181B;
          border-color: #94181B;
        }

        .btn-lightbox-action.primary:hover {
          background: #B01C20;
        }

        /* --- RESPONSIVE BREAKPOINTS --- */
        @media (max-width: 992px) {
          .luxury-menu-tabs-bar {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            border-radius: 22px;
            width: 100%;
            max-width: 620px;
            padding: 8px;
          }
          .luxury-tab-btn {
            width: 100%;
          }
          .menu-controls-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .promises-grid {
            grid-template-columns: 1fr;
          }
          .lightbox-arrow-btn.arrow-left {
            left: 10px;
          }
          .lightbox-arrow-btn.arrow-right {
            right: 10px;
          }
        }

        @media (max-width: 600px) {
          .hero-main-title {
            font-size: 2.8rem;
          }
          .luxury-menu-tabs-bar {
            grid-template-columns: 1fr;
            border-radius: 16px;
          }
          .reader-card-viewport {
            padding: 12px;
            min-height: 400px;
          }
          .reader-nav-arrow {
            width: 42px;
            height: 42px;
            font-size: 1rem;
          }
          .reader-nav-arrow.arrow-prev {
            left: 4px;
          }
          .reader-nav-arrow.arrow-next {
            right: 4px;
          }
          .header-actions-group {
            width: 100%;
          }
          .btn-download-luxury, .btn-order-luxury {
            flex: 1;
            justify-content: center;
          }
          .thumbnails-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
