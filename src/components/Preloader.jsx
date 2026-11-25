import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
        '-=0.4'
      )
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: 'expo.inOut',
        delay: 0.3
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="preloader-overlay" ref={containerRef}>
      <div className="preloader-content">
        <div className="preloader-logo" ref={textRef}>
          <img src="/baskk_logo.png" alt="Baskk" className="preloader-logo-img" />
          <span className="preloader-title">BASKK</span>
          <span className="preloader-sub">COOLANGATTA</span>
        </div>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar" ref={lineRef}></div>
        </div>
      </div>
      <style>{`
        .preloader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--color-espresso);
          color: var(--color-ivory);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .preloader-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .preloader-logo-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: contain;
          margin-bottom: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .preloader-title {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 7vw, 6rem);
          font-weight: 400;
          letter-spacing: 0.25em;
          display: block;
          color: var(--color-ivory);
        }

        .preloader-sub {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          color: var(--color-gold);
          display: block;
          margin-top: 8px;
          text-transform: uppercase;
        }

        .preloader-bar-wrap {
          width: 140px;
          height: 2px;
          background: rgba(255, 255, 255, 0.15);
          margin-top: 24px;
          overflow: hidden;
        }

        .preloader-bar {
          width: 100%;
          height: 100%;
          background: var(--color-terracotta);
          transform-origin: left center;
        }
      `}</style>
    </div>
  );
}
