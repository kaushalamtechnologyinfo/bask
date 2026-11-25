import React, { useState, useEffect } from 'react';

const REVIEWS = [
  {
    id: 1,
    text: '"Baskk is hands down the best dining spot on the Gold Coast! The beachfront setting paired with fresh homemade pasta and top-tier cocktails made our anniversary dinner absolutely unforgettable."',
    author: 'Sarah & James M.',
    sub: 'Verified Diner - Coolangatta'
  },
  {
    id: 2,
    text: '"Outstanding service, delicious freshly made pizzas, and the Spritz menu is sublime. Eating pasta while taking in the sea breeze right across Marine Parade is magical."',
    author: 'David K.',
    sub: 'Google Review'
  },
  {
    id: 3,
    text: '"We hosted our 30th birthday function here. The team went above and beyond with dietary requirements, drinks flow, and food presentation. 10/10 recommendation!"',
    author: 'Elena R.',
    sub: 'Event Host'
  }
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonials-section section-padding bg-soft-pink">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading">Guest Praises</span>
          <h2 className="section-title">What Our Guests Say</h2>
        </div>

        <div className="reviews-slider">
          {REVIEWS.map((rev, idx) => (
            <div 
              key={rev.id}
              className={`review-card ${idx === activeIdx ? 'active' : ''}`}
            >
              <div className="stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="review-text">{rev.text}</p>
              <div className="review-author">
                <h4>{rev.author}</h4>
                <span>{rev.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="slider-dots">
          {REVIEWS.map((_, idx) => (
            <span 
              key={idx}
              className={`dot ${idx === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
