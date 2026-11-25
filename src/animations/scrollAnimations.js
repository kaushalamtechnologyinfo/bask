import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = (container) => {
  if (!container) return;

  // 1. Text Line Reveal
  const textReveals = container.querySelectorAll('[data-reveal="text"]');
  textReveals.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 2. Image Reveal (Smooth Scale & Fade, 100% Reliable)
  const clipReveals = container.querySelectorAll('[data-reveal="clip"]');
  clipReveals.forEach((el) => {
    const img = el.querySelector('img');
    
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  // 3. Image Parallax Scrolling
  const parallaxImgs = container.querySelectorAll('[data-parallax]');
  parallaxImgs.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
    gsap.fromTo(
      el,
      { y: -20 * speed + '%' },
      {
        y: 20 * speed + '%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
};
