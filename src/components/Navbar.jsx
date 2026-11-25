import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

export default function Navbar({ onOpenBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const drawerBackdropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const leftNavItems = [
    { label: 'Home', path: '/', isExternal: false },
    { label: 'About', path: '/about', isExternal: false },
    { label: 'Menu', path: '/menu', isExternal: false },
    { label: 'Gift Vouchers', path: '/gifts', isExternal: false },
    { 
      label: 'Order Online', 
      path: 'https://storefront.hungryhungry.com/baskkitalian-pickup/menu', 
      isExternal: true 
    },
  ];

  const rightNavItems = [
    { label: 'Booking Enquiry', path: '/booking-enquiry', isExternal: false },
    { label: 'Blog', path: '/blog', isExternal: false },
    { label: 'Contact Us', path: '/contact', isExternal: false },
  ];

  const renderNavItem = (item, index) => {
    if (item.isAction) {
      return (
        <li key={index} className="nav-item">
          <button 
            type="button"
            onClick={item.onClick}
            className="nav-link-item btn-inline-link"
          >
            {item.label}
          </button>
        </li>
      );
    }

    if (item.isExternal) {
      return (
        <li key={index} className="nav-item">
          <a 
            href={item.path} 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link-item order-online-badge"
            title="Order pickup directly from Baskk"
          >
            <span>{item.label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="external-icon">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </li>
      );
    }

    return (
      <li key={index} className="nav-item">
        <NavLink
          to={item.path}
          className={({ isActive }) => 
            `nav-link-item ${isActive ? 'is-active' : ''}`
          }
        >
          {item.label}
        </NavLink>
      </li>
    );
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <header className={`baskk-navbar ${scrolled ? 'is-scrolled' : (isHome ? 'is-transparent' : 'is-scrolled')}`}>
        <div className="baskk-nav-inner">
          {/* 1. Left: Main Navigation Links (Home, About, Menu, Blog) */}
          <nav className="baskk-desktop-menu baskk-left-nav" aria-label="Main Navigation">
            <ul className="nav-links-list">
              {leftNavItems.map((item, index) => renderNavItem(item, index))}
            </ul>
          </nav>

          {/* 2. Center: Brand Logo */}
          <div className="baskk-nav-logo-wrap">
            <Link to="/" className="baskk-nav-logo" aria-label="Baskk">
              <img src="/baskk_logo.png" alt="Baskk" className="nav-circle-logo-img" />
            </Link>
          </div>

          {/* 3. Right: AGFG Badge, Divider, Pill CTA, Circular Hamburger */}
          <div className="baskk-nav-right-group">
            {rightNavItems.length > 0 && (
              <nav className="baskk-desktop-menu baskk-right-links" aria-label="Right Navigation">
                <ul className="nav-links-list right-links-list">
                  {rightNavItems.map((item, index) => renderNavItem(item, index))}
                </ul>
              </nav>
            )}

            <div className="baskk-nav-actions">
              {/* AGFG Review Badge */}
              <a
                href="https://www.agfg.com.au/restaurant/bask-115695"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-agfg-badge"
                title="Rate & Review Baskk on Australian Good Food Guide (AGFG)"
              >
                <img 
                  src="/agfg-badge.svg" 
                  alt="AGFG Write A Review" 
                  className="nav-agfg-img"
                />
              </a>

              <div className="nav-vertical-separator" aria-hidden="true"></div>

              {/* Pill 'BOOK A TABLE' Button */}
              <a 
                href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-book"
                style={{ textDecoration: 'none' }}
                aria-label="Book a table reservation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-book-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="nav-book-text-desktop">BOOK A TABLE</span>
                <span className="nav-book-text-mobile">BOOK</span>
              </a>

              {/* Circular Hamburger Outline Button */}
              <button 
                type="button" 
                className={`btn-circle-hamburger ${drawerOpen ? 'active' : ''}`} 
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label="Open quick menu and info"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Off-Canvas Slide Drawer for 9-Dots Grid Menu & Mobile */}
      <div className={`offcanvas-drawer-root ${drawerOpen ? 'open' : ''}`}>
        <div 
          className="offcanvas-backdrop" 
          ref={drawerBackdropRef}
          onClick={() => setDrawerOpen(false)}
        ></div>

        <div className="offcanvas-panel" ref={drawerRef}>
          <div className="drawer-header">
            <div className="drawer-brand">
              <div className="nav-logo-badge-ring" style={{ width: 46, height: 46 }}>
                <img src="/baskk_logo.png" alt="Baskk" className="nav-logo-img" />
              </div>
            </div>
            <button 
              className="btn-drawer-close" 
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="drawer-body">
            {/* Quick Navigation Links */}
            <div className="drawer-section">
              <span className="drawer-section-title">NAVIGATION</span>
              <ul className="drawer-nav-list">
                <li>
                  <NavLink to="/" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-house"></i> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-circle-info"></i> About Baskk
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/menu" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-utensils"></i> Dining & Drink Menu
                  </NavLink>
                </li>
                <li>
                  <a 
                    href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="drawer-highlight-link"
                  >
                    <i className="fa-solid fa-bag-shopping"></i> Order Online (Pickup)
                    <span className="drawer-pill">HOT</span>
                  </a>
                </li>
                <li>
                  <NavLink 
                    to="/gifts" 
                    onClick={() => setDrawerOpen(false)}
                    className="drawer-highlight-link"
                    style={{ color: '#94181B', fontWeight: 700 }}
                  >
                    <i className="fa-solid fa-gift"></i> Gift Vouchers ($50, $100, $200)
                    <span className="drawer-pill" style={{ background: '#94181B' }}>GIFT</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/blog" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-newspaper"></i> Blog & Stories
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/booking-enquiry" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-champagne-glasses"></i> Booking &amp; Function Enquiry
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" onClick={() => setDrawerOpen(false)}>
                    <i className="fa-solid fa-envelope"></i> Contact Us
                  </NavLink>
                </li>
                <li>
                  <a 
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDrawerOpen(false)}
                    className="drawer-action-link"
                  >
                    <i className="fa-regular fa-calendar-check"></i> Book A Table
                  </a>
                </li>
              </ul>
            </div>

            {/* Happy Hour Banner */}
            <div className="drawer-promo-card">
              <div className="promo-badge">HAPPY HOUR</div>
              <h4 className="promo-headline">2 FOR $26 COCKTAILS</h4>
              <p className="promo-sub">Every Friday to Sunday, 3 PM – 5 PM. 2-for-$26 cocktails, $10 beers &amp; wines, and $12 bites.</p>
            </div>

            {/* Quick Contact & Verified Trading Hours */}
            <div className="drawer-section">
              <span className="drawer-section-title">VISIT US</span>
              <p className="drawer-info-line">
                <i className="fa-solid fa-location-dot"></i>
                <span>52–58 Marine Parade, Coolangatta, QLD 4225, Australia</span>
              </p>
              <p className="drawer-info-line">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:request@baskk.co">request@baskk.co</a>
              </p>
              <p className="drawer-info-line">
                <i className="fa-regular fa-clock"></i>
                <span>Mon–Thu: 5pm–9:30pm | Fri: 3pm–10pm | Sat: 12pm–10pm | Sun: 12pm–9:30pm</span>
              </p>
            </div>

            {/* Direct AGFG Write a Review */}
            <div className="drawer-agfg-row">
              <a 
                href="https://www.agfg.com.au/restaurant/bask-115695" 
                target="_blank" 
                rel="noopener noreferrer"
                className="drawer-agfg-btn"
              >
                <img src="/agfg-review-badge.png" alt="AGFG Write A Review" className="agfg-mini-icon" />
                <span>Rate & Review us on Australian Good Food Guide</span>
              </a>
            </div>

            <div className="drawer-social-row" style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
              <a href="https://www.instagram.com/baskkitaliangc/" target="_blank" rel="noopener noreferrer" style={{ color: '#94181B', fontSize: '1.25rem' }} aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/baskkitalian" target="_blank" rel="noopener noreferrer" style={{ color: '#94181B', fontSize: '1.25rem' }} aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div className="drawer-footer">
            <a 
              href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-cta-primary" 
              onClick={() => setDrawerOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              <span>RESERVE YOUR TABLE</span>
              <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /* =========================================================
           TOP NAVBAR STYLES (TRANSLUCENT FROSTED GLASS & BALANCED LAYOUT)
           ========================================================= */
        .baskk-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 92px;
          z-index: 1000;
          background: rgba(254, 248, 249, 0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(240, 206, 210, 0.45);
          box-shadow: 0 2px 16px rgba(36, 23, 25, 0.04);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
        }

        .baskk-navbar.is-transparent {
          background: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: none !important;
        }

        .baskk-navbar.is-transparent .nav-link-item {
          color: #FFFFFF !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .baskk-navbar.is-transparent .nav-link-item:hover {
          color: #FFB5BC !important;
        }

        .baskk-navbar.is-transparent .nav-link-item.is-active {
          color: #FFFFFF !important;
        }

        .baskk-navbar.is-transparent .nav-link-item.is-active::after {
          background: #FFFFFF !important;
        }

        .baskk-navbar.is-transparent .external-icon {
          color: #FFFFFF !important;
        }

        .baskk-navbar.is-transparent .nav-vertical-separator {
          background: rgba(255, 255, 255, 0.35) !important;
        }

        .baskk-navbar.is-transparent .btn-circle-hamburger {
          border-color: rgba(255, 255, 255, 0.6) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .baskk-navbar.is-transparent .btn-circle-hamburger:hover {
          background: rgba(255, 255, 255, 0.22) !important;
          border-color: #FFFFFF !important;
        }

        .baskk-navbar.is-transparent .hamburger-line {
          background: #FFFFFF !important;
        }

        .baskk-navbar.is-transparent .baskk-nav-logo {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
          border: 2px solid rgba(255, 255, 255, 0.85);
        }

        .baskk-navbar.is-scrolled {
          background: rgba(254, 248, 249, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          height: 80px;
          box-shadow: 0 4px 22px rgba(36, 23, 25, 0.09);
          border-bottom-color: rgba(240, 206, 210, 0.75);
        }

        .baskk-navbar.is-scrolled .baskk-nav-logo-wrap {
          top: 4px;
        }

        .baskk-navbar.is-scrolled .baskk-nav-logo {
          width: 112px;
          height: 112px;
        }

        .baskk-nav-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          height: 100%;
          padding: 0 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative; /* REQUIRED: Anchor for true viewport/container absolute center */
        }

        /* 1. Left Navigation Links (All main links in natural reading order after Blog) */
        .baskk-left-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
          padding-right: 88px;
          z-index: 5;
        }

        .baskk-desktop-menu {
          display: flex;
          align-items: center;
        }

        .nav-links-list {
          display: flex;
          align-items: center;
          gap: 18px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* 2. Center Brand Logo (MATHEMATICALLY EXACT 50% VIEWPORT CENTER) */
        .baskk-nav-logo-wrap {
          position: absolute;
          left: 50%;
          top: 6px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: auto;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .baskk-nav-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          width: 148px;
          height: 148px;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 10px 32px rgba(139, 38, 36, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 3px solid rgba(255, 255, 255, 0.95);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: #FFE2E6;
          padding: 2px;
          overflow: hidden;
        }

        .baskk-nav-logo:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 38px rgba(139, 38, 36, 0.3);
        }

        .nav-circle-logo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: contain;
          display: block;
          transform: none;
          pointer-events: none;
        }

        .nav-link-item {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.1rem;
          font-weight: 500;
          color: #3C312D;
          text-decoration: none;
          letter-spacing: 0.02em;
          padding: 4px 0;
          transition: color 0.25s ease;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .nav-link-item:hover {
          color: #8B2624;
        }

        /* Active link with terracotta underline */
        .nav-link-item.is-active {
          color: #8B2624;
        }

        .nav-link-item.is-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #8B2624;
          border-radius: 2px;
        }

        .btn-inline-link {
          font-family: inherit;
        }

        .external-icon {
          font-size: 0.7rem;
          color: #8B2624;
          opacity: 0.85;
          margin-left: 2px;
        }

        /* 3. Right Group: Contact Us, Enlarged AGFG, Book A Table, Hamburger */
        .baskk-nav-right-group {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex: 1;
          padding-left: 88px;
          gap: 24px;
          z-index: 5;
        }

        .baskk-right-links {
          display: flex;
          align-items: center;
        }

        .baskk-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          margin-left: auto;
        }

        /* AGFG Review Badge in Navbar - ENLARGED */
        .nav-agfg-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          line-height: 1;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          padding: 2px;
        }

        .nav-agfg-badge:hover {
          transform: translateY(-2px) scale(1.06);
          filter: drop-shadow(0 6px 16px rgba(183, 28, 28, 0.35));
        }

        .nav-agfg-img {
          height: 62px;
          width: auto;
          object-fit: contain;
          display: block;
          border-radius: 7px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
          border: 1.5px solid rgba(210, 210, 210, 0.95);
          background: #ffffff;
          transition: all 0.28s ease;
        }

        .baskk-navbar.is-scrolled .nav-agfg-img {
          height: 52px;
        }

        /* Subtle Thin Separator */
        .nav-vertical-separator {
          width: 1px;
          height: 34px;
          background: rgba(148, 24, 27, 0.25);
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* Pill BOOK A TABLE Button */
        .btn-pill-book {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #8B2624;
          color: #FFFFFF;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 10px 20px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(139, 38, 36, 0.22);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-pill-book:hover {
          transform: translateY(-2px);
          background: #731F1D;
          box-shadow: 0 6px 18px rgba(139, 38, 36, 0.32);
        }

        .nav-book-icon {
          flex-shrink: 0;
        }

        .nav-book-text-mobile {
          display: none;
        }

        /* Circular Hamburger Outline Button */
        .btn-circle-hamburger {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          aspect-ratio: 1 / 1;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(139, 38, 36, 0.35);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }

        .btn-circle-hamburger:hover {
          border-color: #8B2624;
          background: rgba(139, 38, 36, 0.05);
          transform: scale(1.05);
        }

        .hamburger-line {
          width: 16px;
          height: 1.5px;
          background: #3C312D;
          border-radius: 1px;
          transition: background 0.2s ease;
        }

        .btn-circle-hamburger:hover .hamburger-line {
          background: #8B2624;
        }

        /* =========================================================
           OFF-CANVAS DRAWER STYLES
           ========================================================= */
        .offcanvas-drawer-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1200;
          visibility: hidden;
          pointer-events: none;
          overflow: hidden;
          transition: visibility 0.4s ease;
        }

        .offcanvas-drawer-root.open {
          visibility: visible;
          pointer-events: auto;
        }

        .offcanvas-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .offcanvas-drawer-root.open .offcanvas-backdrop {
          opacity: 0.4;
        }

        .offcanvas-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: min(400px, 90vw);
          max-width: 90vw;
          height: 100%;
          background: #FAF7F2;
          color: #2D2522;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 40px rgba(60, 40, 30, 0.15);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 1px solid rgba(148, 24, 27, 0.14);
          overflow-y: auto;
        }

        .offcanvas-drawer-root.open .offcanvas-panel {
          transform: translateX(0);
        }

        .drawer-header {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(148, 24, 27, 0.1);
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drawer-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #94181B;
        }

        .drawer-title {
          font-family: var(--font-serif, serif);
          font-size: 1.25rem;
          margin: 0;
          letter-spacing: 0.1em;
          color: #1F1A17;
        }

        .drawer-tagline {
          font-size: 0.72rem;
          color: #94181B;
          display: block;
        }

        .btn-drawer-close {
          width: 36px;
          height: 36px;
          background: rgba(148, 24, 27, 0.08);
          border: none;
          color: #2D2522;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .btn-drawer-close:hover {
          background: #94181B;
          color: #FFFFFF;
        }

        .drawer-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 26px;
          flex: 1;
        }

        .drawer-section-title {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          font-weight: 800;
          color: #94181B;
          display: block;
          margin-bottom: 12px;
        }

        .drawer-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-nav-list a, .drawer-action-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #2D2522;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 6px;
          background: rgba(148, 24, 27, 0.03);
          border: 1px solid rgba(148, 24, 27, 0.08);
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .drawer-nav-list a:hover, .drawer-action-link:hover {
          background: rgba(148, 24, 27, 0.08);
          color: #94181B;
          border-color: rgba(148, 24, 27, 0.2);
          transform: translateX(4px);
        }

        .drawer-highlight-link {
          background: rgba(148, 24, 27, 0.07) !important;
          border-color: rgba(148, 24, 27, 0.25) !important;
          color: #94181B !important;
        }

        .drawer-pill {
          margin-left: auto;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .drawer-promo-card {
          background: #FFF9F5;
          border: 1px solid rgba(148, 24, 27, 0.2);
          border-radius: 8px;
          padding: 16px;
        }

        .promo-badge {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #FFFFFF;
          background: #94181B;
          padding: 3px 10px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .promo-headline {
          font-family: var(--font-serif, serif);
          font-size: 1.15rem;
          color: #1F1A17;
          margin-bottom: 4px;
        }

        .promo-sub {
          font-size: 0.8rem;
          color: #5C4F4B;
          line-height: 1.4;
          margin: 0;
        }

        .drawer-info-line {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          color: #5C4F4B;
          margin-bottom: 8px;
          line-height: 1.45;
        }

        .drawer-info-line i {
          color: #94181B;
          margin-top: 3px;
        }

        .drawer-info-line a {
          color: #1F1A17;
          text-decoration: none;
          font-weight: 600;
        }

        .drawer-agfg-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(148, 24, 27, 0.18);
          color: #2D2522;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .drawer-agfg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(60, 40, 30, 0.1);
        }

        .agfg-mini-icon {
          height: 28px;
          width: auto;
        }

        .drawer-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(148, 24, 27, 0.1);
        }

        .drawer-cta-primary {
          width: 100%;
          padding: 14px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(148, 24, 27, 0.25);
          transition: all 0.2s ease;
        }

        .drawer-cta-primary:hover {
          background: #7D1417;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(148, 24, 27, 0.35);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1400px) {
          .nav-links-list {
            gap: 14px;
          }
          .nav-link-item {
            font-size: 0.92rem;
          }
          .baskk-left-nav {
            padding-right: 80px;
          }
          .baskk-nav-right-group {
            padding-left: 80px;
            gap: 16px;
          }
        }

        @media (max-width: 1240px) {
          .baskk-nav-inner {
            padding: 0 20px;
          }
          .baskk-left-nav {
            padding-right: 70px;
          }
          .baskk-nav-right-group {
            padding-left: 70px;
            gap: 14px;
          }
          .baskk-nav-logo {
            width: 128px;
            height: 128px;
          }
          .baskk-navbar.is-scrolled .baskk-nav-logo {
            width: 100px;
            height: 100px;
          }
          .nav-links-list {
            gap: 18px;
          }
          .nav-link-item {
            font-size: 0.95rem;
          }
          .baskk-nav-actions {
            gap: 10px;
          }
          .btn-pill-book {
            padding: 8px 16px;
            font-size: 0.72rem;
          }
          .nav-agfg-img {
            height: 54px;
          }
        }

        @media (max-width: 1060px) {
          .baskk-desktop-menu,
          .baskk-left-nav,
          .nav-vertical-separator {
            display: none !important;
          }
          .baskk-nav-right-group {
            padding-left: 0;
            margin-left: auto;
            flex: none;
            justify-content: flex-end;
            gap: 14px;
          }
          .nav-agfg-img {
            height: 48px;
          }
          .baskk-nav-logo {
            width: 118px;
            height: 118px;
          }
          .baskk-navbar.is-scrolled .baskk-nav-logo {
            width: 94px;
            height: 94px;
          }
        }

        @media (max-width: 860px) {
          .baskk-navbar {
            height: 76px;
          }
          .baskk-nav-inner {
            padding: 0 18px;
          }
          .baskk-desktop-menu {
            display: none !important;
          }
          .baskk-left-nav {
            display: none !important;
          }
          .baskk-nav-right-group {
            margin-left: auto;
            flex: none;
            padding-left: 0;
            gap: 10px;
          }
          .baskk-nav-logo-wrap {
            top: 4px;
          }
          .baskk-nav-logo {
            width: 92px;
            height: 92px;
          }
        }

        @media (max-width: 600px) {
          .baskk-navbar {
            height: 68px;
          }
          .baskk-nav-inner {
            padding: 0 14px;
          }
          .baskk-nav-right-group {
            gap: 8px;
          }
          .baskk-nav-logo-wrap {
            top: 4px;
          }
          .baskk-nav-logo {
            width: 74px;
            height: 74px;
          }
          .btn-pill-book {
            padding: 7px 12px;
            font-size: 0.68rem;
            letter-spacing: 0.08em;
          }
          .nav-book-text-desktop {
            display: none !important;
          }
          .nav-book-text-mobile {
            display: inline !important;
          }
          .btn-circle-hamburger {
            width: 36px;
            height: 36px;
          }
          .nav-agfg-img {
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .nav-agfg-badge {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
