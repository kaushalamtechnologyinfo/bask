import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function MagneticButton({ children, className = '', onClick, ...props }) {
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Disable magnetic effect on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });

      if (text) {
        gsap.to(text, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });

      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button ref={btnRef} className={`magnetic-btn ${className}`} onClick={onClick} {...props}>
      <span ref={textRef} className="magnetic-btn-inner">
        {children}
      </span>
    </button>
  );
}
