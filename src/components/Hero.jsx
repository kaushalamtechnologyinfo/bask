import React, { useState, useRef } from 'react';
import useGSAP from '../hooks/useGSAP';
import { animateHeroEntrance } from '../animations/heroAnimations';

export default function Hero({ onOpenBook }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.play().catch((err) => console.log('Audio playback info:', err));
      }
    }
  };

  const heroRef = useGSAP((element) => {
    animateHeroEntrance(element);
  });

  return (
    <section className="hero-editorial-section hero-full-video-section" ref={heroRef} id="home">
      {/* FULL BACKGROUND VIDEO */}
      <div className="hero-full-video-bg hero-right-visual" aria-hidden="false">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="hero-full-video-element"
          poster="/baskk-photos/hero-right-side.png"
        >
          <source src="/baskk-intro-video.mp4" type="video/mp4" />
          <source src="/baskk-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        {/* Premium Cinematic Vignette & Readability Gradient Overlay */}
        <div className="hero-video-scrim-overlay" aria-hidden="true"></div>
      </div>

      {/* Sound Toggle Button (Bottom Right) */}
      <button
        type="button"
        className="hero-video-sound-toggle"
        onClick={toggleSound}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        title={isMuted ? "Click to unmute" : "Click to mute"}
      >
        {isMuted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
        <span className="sound-toggle-text">{isMuted ? 'SOUND ON' : 'MUTE'}</span>
      </button>

      <style>{`
        /* =========================================================
           FULL VIDEO HERO SECTION STYLES
           ========================================================= */
        .hero-editorial-section.hero-full-video-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #140E10;
          overflow: hidden;
          margin-top: 0;
          display: flex;
          align-items: center;
        }

        /* 100% BACKGROUND VIDEO CONTAINER */
        .hero-full-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .hero-full-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        /* CINEMATIC SUBTLE SCRIM (Light vignette to let the pure video shine through) */
        .hero-video-scrim-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.40) 0%,
            rgba(0, 0, 0, 0.05) 25%,
            transparent 50%,
            rgba(0, 0, 0, 0.15) 75%,
            rgba(20, 14, 16, 0.70) 100%
          );
          pointer-events: none;
        }

        /* SOUND TOGGLE BUTTON (BOTTOM RIGHT) */
        .hero-video-sound-toggle {
          position: absolute;
          bottom: 28px;
          right: 32px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(20, 14, 16, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
        }

        .hero-video-sound-toggle:hover {
          background: #94181B;
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.55);
        }

        .sound-toggle-text {
          letter-spacing: 0.14em;
        }

        @media (max-width: 680px) {
          .hero-scroll-indicator {
            bottom: 22px;
          }
          .hero-video-sound-toggle {
            bottom: 18px;
            right: 18px;
            padding: 8px 14px;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </section>
  );
}
