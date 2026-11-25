import { gsap } from 'gsap';

export const animateHeroEntrance = (container, onComplete) => {
  if (!container) return;

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out', duration: 1.4 },
    onComplete
  });

  const bgImg = container.querySelector('.hero-bg-img');
  const rightVisual = container.querySelector('.hero-right-visual');
  const badge = container.querySelector('.hero-editorial-badge');
  const titleLines = container.querySelectorAll('.hero-title-line');
  const subtitle = container.querySelector('.hero-desc');
  const spotlightCard = container.querySelector('.hero-spotlight-card');
  const buttons = container.querySelectorAll('.hero-btn-wrap');
  const floatingBadge = container.querySelector('.hero-visual-floating-badge');

  if (rightVisual) {
    tl.fromTo(rightVisual, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' }, 0.1);
  }

  if (bgImg) {
    tl.fromTo(bgImg, { scale: 1.15 }, { scale: 1.06, duration: 2.2, ease: 'power3.out' }, 0.1);
  }

  if (badge) {
    tl.fromTo(badge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.3);
  }

  if (titleLines && titleLines.length > 0) {
    tl.fromTo(
      titleLines,
      { y: 80, opacity: 0, rotateX: -15 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.15, duration: 1.2 },
      0.4
    );
  }

  if (subtitle) {
    tl.fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.8);
  }

  if (spotlightCard) {
    tl.fromTo(spotlightCard, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1 }, 1.0);
  }

  if (buttons && buttons.length > 0) {
    tl.fromTo(buttons, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 1 }, 1.1);
  }

  if (floatingBadge) {
    tl.fromTo(floatingBadge, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 1.3);
  }

  return tl;
};
