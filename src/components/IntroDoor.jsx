import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function IntroDoor({ onEnter }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const lightLeakRef = useRef(null);
  const raysRef = useRef(null);
  const handleLeftRef = useRef(null);
  const handleRightRef = useRef(null);
  const crestLeftRef = useRef(null);
  const crestRightRef = useRef(null);
  const bgImgRef = useRef(null);
  const promptRef = useRef(null);

  // Mouse tilt effect
  const handleMouseMove = (e) => {
    if (isOpening || !containerRef.current) return;
    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const yRatio = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

    gsap.to(containerRef.current, {
      rotateY: xRatio * 4,
      rotateX: -yRatio * 4,
      duration: 0.6,
      ease: 'power1.out'
    });
  };

  const handleMouseLeave = () => {
    if (isOpening || !containerRef.current) return;
    gsap.to(containerRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  };

  useEffect(() => {
    // Auto start sequence after short delay if user doesn't click
    const timer = setTimeout(() => {
      startDoorOpeningSequence();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const startDoorOpeningSequence = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Reset mouse tilt
    gsap.to(containerRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.3
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setHasEntered(true);
        if (onEnter) onEnter();
      }
    });

    // 1. Hide interactive enter prompt smoothly
    if (promptRef.current) {
      tl.to(promptRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in'
      }, 0);
    }

    // 2. Door handles click & rotate down to unlock
    tl.to([handleLeftRef.current, handleRightRef.current], {
      rotateZ: (i) => (i === 0 ? -18 : 18),
      y: 6,
      duration: 0.45,
      ease: 'back.out(2)'
    }, 0.1);

    // 3. Seam light leak & radiance ignite
    tl.to(lightLeakRef.current, {
      opacity: 1,
      width: '18px',
      boxShadow: '0 0 100px #FCE6E8, 0 0 160px #E8A0A8, 0 0 240px #94181B',
      duration: 0.7,
      ease: 'power3.out'
    }, 0.2);

    tl.to(raysRef.current, {
      opacity: 0.85,
      scale: 1.25,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.3);

    // 4. Split Crest separation & glow
    tl.to(crestLeftRef.current, {
      x: -30,
      opacity: 0.8,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.4);

    tl.to(crestRightRef.current, {
      x: 30,
      opacity: 0.8,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.4);

    // 5. Background image camera zoom-in transition
    tl.to(bgImgRef.current, {
      scale: 1.0,
      filter: 'brightness(1) contrast(1.05) saturate(1.1)',
      duration: 2.4,
      ease: 'power2.out'
    }, 0.3);

    // 6. Grand 3D Door Swing Open
    tl.to(leftDoorRef.current, {
      xPercent: -105,
      rotateY: -70,
      duration: 2.2,
      ease: 'expo.inOut'
    }, 0.5);

    tl.to(rightDoorRef.current, {
      xPercent: 105,
      rotateY: 70,
      duration: 2.2,
      ease: 'expo.inOut'
    }, 0.5);

    // 7. Light rays fade gracefully as doors complete opening
    tl.to(raysRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in'
    }, '-=1.0');

    // 8. Container overall curtain fade out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, '-=0.5');
  };

  if (hasEntered) return null;

  return (
    <div 
      className="door-intro-wrapper" 
      ref={containerRef} 
      onClick={startDoorOpeningSequence}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Restaurant Interior Preview */}
      <div className="door-bg-preview">
        <img 
          ref={bgImgRef}
          src="/baskk-photos/DSC_0297.JPG" 
          alt="Baskk Atmosphere Preview" 
          className="door-preview-img"
        />
        <div className="door-preview-overlay"></div>
      </div>

      {/* Volumetric Gold Light Rays Backdrop */}
      <div className="light-rays-wrapper" ref={raysRef}>
        <div className="ray ray-1"></div>
        <div className="ray ray-2"></div>
        <div className="ray ray-3"></div>
      </div>

      {/* Center Seam Light Flare */}
      <div className="light-leak-seam" ref={lightLeakRef}></div>

      {/* Left Grand Door */}
      <div className="door-panel door-left" ref={leftDoorRef}>
        <div className="door-wood-texture"></div>
        <div className="door-outer-molding"></div>
        <div className="door-frame-line"></div>
        <div className="door-inner-molding"></div>

        {/* Brass Corner Filigree Accents */}
        <div className="brass-corner corner-top-left"></div>
        <div className="brass-corner corner-bottom-left"></div>

        {/* Left Crest Half with Baskk Logo */}
        <div className="crest-half crest-left" ref={crestLeftRef}>
          <img src="/baskk_logo.png" alt="Baskk Logo" className="crest-logo-img left-half" />
        </div>

        {/* Left Door Handle */}
        <div className="door-handle-plate handle-plate-left">
          <div className="door-handle handle-left" ref={handleLeftRef}>
            <div className="handle-bar"></div>
            <div className="handle-knob"></div>
          </div>
        </div>
      </div>

      {/* Right Grand Door */}
      <div className="door-panel door-right" ref={rightDoorRef}>
        <div className="door-wood-texture"></div>
        <div className="door-outer-molding"></div>
        <div className="door-frame-line"></div>
        <div className="door-inner-molding"></div>

        {/* Rose Filigree Corner Accents */}
        <div className="brass-corner corner-top-right"></div>
        <div className="brass-corner corner-bottom-right"></div>

        {/* Right Crest Half with Baskk Logo */}
        <div className="crest-half crest-right" ref={crestRightRef}>
          <img src="/baskk_logo.png" alt="Baskk Logo" className="crest-logo-img right-half" />
        </div>

        {/* Right Door Handle */}
        <div className="door-handle-plate handle-plate-right">
          <div className="door-handle handle-right" ref={handleRightRef}>
            <div className="handle-bar"></div>
            <div className="handle-knob"></div>
          </div>
        </div>
      </div>

      {/* Interactive Prompt Overlay */}
      <div className="door-prompt-container" ref={promptRef}>
        <div className="door-prompt-badge">
          <span className="door-prompt-icon">✦</span>
          <span className="door-prompt-text">CLICK TO ENTER BASKK</span>
          <span className="door-prompt-icon">✦</span>
        </div>
        <p className="door-prompt-subtext">COASTAL BEACHFRONT SANCTUARY</p>
      </div>

      <style>{`
        .door-intro-wrapper {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background-color: #FAF2F3;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1600px;
          transform-style: preserve-3d;
          cursor: pointer;
          user-select: none;
        }

        .door-bg-preview {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .door-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.18);
          filter: brightness(0.7) contrast(1.1) saturate(1.1);
          will-change: transform, filter;
          transition: filter 0.8s ease;
        }

        .door-preview-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(250, 242, 243, 0.2) 0%, rgba(36, 23, 25, 0.75) 100%);
        }

        /* Volumetric Rays */
        .light-rays-wrapper {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: opacity, transform;
        }

        .ray {
          position: absolute;
          width: 200vw;
          height: 200vh;
          background: radial-gradient(ellipse at center, rgba(232, 160, 168, 0.35) 0%, rgba(148, 24, 27, 0.15) 45%, transparent 70%);
          transform-origin: center;
        }
        .ray-1 { transform: rotate(15deg) scaleY(0.4); }
        .ray-2 { transform: rotate(-25deg) scaleY(0.5); }
        .ray-3 { transform: rotate(45deg) scaleY(0.3); }

        /* Light seam flare */
        .light-leak-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 3px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, 
            rgba(232, 160, 168, 0.5) 0%, 
            rgba(255, 255, 255, 1) 30%, 
            #94181B 50%, 
            rgba(255, 255, 255, 1) 70%, 
            rgba(232, 160, 168, 0.5) 100%
          );
          box-shadow: 0 0 30px rgba(148, 24, 27, 0.8), 0 0 60px rgba(232, 160, 168, 0.8);
          z-index: 5;
          opacity: 0.85;
          pointer-events: none;
        }

        /* Grand Door Panels - Blush Pink Lacquer Finish */
        .door-panel {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50.1%;
          z-index: 3;
          background: linear-gradient(135deg, #FAF0F2 0%, #F5E1E4 45%, #ECD0D5 100%);
          box-shadow: inset 0 0 140px rgba(148, 24, 27, 0.12);
          display: flex;
          align-items: center;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .door-left {
          left: 0;
          border-right: 2px solid rgba(148, 24, 27, 0.35);
          transform-origin: left center;
        }

        .door-right {
          right: 0;
          border-left: 2px solid rgba(148, 24, 27, 0.35);
          transform-origin: right center;
        }

        /* Wood Grain & Moldings */
        .door-wood-texture {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background-image: 
            radial-gradient(ellipse at 50% 50%, rgba(148, 24, 27, 0.08) 0%, transparent 80%),
            repeating-linear-gradient(90deg, rgba(148, 24, 27, 0.03) 0px, transparent 2px, transparent 14px);
        }

        .door-outer-molding {
          position: absolute;
          inset: 20px;
          border: 2px solid rgba(148, 24, 27, 0.2);
          border-radius: 4px;
          box-shadow: inset 0 0 30px rgba(148, 24, 27, 0.06);
          pointer-events: none;
        }

        .door-frame-line {
          position: absolute;
          inset: 45px;
          border: 1.5px solid rgba(148, 24, 27, 0.35);
          border-radius: 6px;
          box-shadow: 0 0 15px rgba(148, 24, 27, 0.08), inset 0 0 25px rgba(148, 24, 27, 0.05);
          pointer-events: none;
        }

        .door-inner-molding {
          position: absolute;
          inset: 85px;
          border: 1px dashed rgba(148, 24, 27, 0.25);
          border-radius: 4px;
          pointer-events: none;
        }

        /* Rose/Crimson Filigree Corner Accents */
        .brass-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: rgba(148, 24, 27, 0.6);
          border-style: solid;
          pointer-events: none;
        }
        .corner-top-left { top: 40px; left: 40px; border-width: 3px 0 0 3px; }
        .corner-bottom-left { bottom: 40px; left: 40px; border-width: 0 0 3px 3px; }
        .corner-top-right { top: 40px; right: 40px; border-width: 3px 3px 0 0; }
        .corner-bottom-right { bottom: 40px; right: 40px; border-width: 0 3px 3px 0; }

        /* Split Circular Logo Seal */
        .crest-half {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: #FAF2F3;
          border: 2.5px solid #94181B;
          box-shadow: 0 0 35px rgba(148, 24, 27, 0.25), inset 0 0 15px rgba(232, 160, 168, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 6;
          overflow: hidden;
        }

        .crest-left {
          right: -75px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: none;
        }

        .crest-right {
          left: -75px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: none;
        }

        .crest-logo-img {
          position: absolute;
          top: 0;
          width: 150px;
          height: 150px;
          object-fit: contain;
          pointer-events: none;
        }

        .crest-logo-img.left-half {
          right: 0;
        }

        .crest-logo-img.right-half {
          left: 0;
        }

        /* Handles & Backplate */
        .door-handle-plate {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 220px;
          background: linear-gradient(180deg, #94181B 0%, #7A1215 50%, #94181B 100%);
          border: 1.5px solid #F0CED2;
          border-radius: 6px;
          box-shadow: 0 8px 30px rgba(148, 24, 27, 0.4), inset 0 0 10px rgba(252, 230, 232, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .handle-plate-left { right: 35px; }
        .handle-plate-right { left: 35px; }

        .door-handle {
          position: relative;
          width: 14px;
          height: 150px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FCE6E8 40%, #E8A0A8 100%);
          border-radius: 7px;
          box-shadow: 0 4px 15px rgba(148, 24, 27, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center 70%;
        }

        .handle-bar {
          width: 4px;
          height: 100px;
          background: rgba(148, 24, 27, 0.2);
          border-radius: 2px;
        }

        .handle-knob {
          position: absolute;
          top: 65%;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff 0%, #FCE6E8 30%, #E8A0A8 70%, #94181B 100%);
          box-shadow: 0 6px 16px rgba(148, 24, 27, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        /* Interactive Enter Prompt */
        .door-prompt-container {
          position: absolute;
          bottom: 50px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          animation: promptPulse 2.5s infinite ease-in-out;
        }

        .door-prompt-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 28px;
          background: rgba(255, 255, 255, 0.95);
          border: 1.5px solid #94181B;
          border-radius: 30px;
          box-shadow: 0 8px 30px rgba(148, 24, 27, 0.25), inset 0 0 10px rgba(252, 230, 232, 0.5);
          backdrop-filter: blur(8px);
        }

        .door-prompt-icon {
          color: #94181B;
          font-size: 11px;
        }

        .door-prompt-text {
          font-family: var(--font-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #241719;
        }

        .door-prompt-subtext {
          font-family: var(--font-sans);
          font-size: 10px;
          letter-spacing: 2.5px;
          color: #94181B;
          text-transform: uppercase;
          font-weight: 600;
        }

        @keyframes promptPulse {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.95; }
          50% { transform: translateY(-4px) scale(1.02); opacity: 1; }
        }

        @media (max-width: 768px) {
          .door-frame-line { inset: 20px; }
          .door-inner-molding { inset: 40px; }
          .crest-half { width: 100px; height: 100px; }
          .crest-left { right: -50px; }
          .crest-right { left: -50px; }
          .crest-logo-img { width: 100px; height: 100px; }
          .door-handle-plate { width: 28px; height: 160px; }
          .handle-plate-left { right: 15px; }
          .handle-plate-right { left: 15px; }
          .door-handle { height: 100px; }
          .brass-corner { width: 20px; height: 20px; }
        }
      `}</style>
    </div>
  );
}

