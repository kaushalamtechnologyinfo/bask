import React from 'react';

export default function About({ onOpenBook }) {
  return (
    <section className="about-section section-padding" id="about">
      <div className="container">
        <div className="about-wrapper">
          <div className="about-images">
            <div className="image-box img-main">
              <img 
                src="/baskk-new/baskk-signature-feast.png" 
                alt="Modern Coastal Italian Dining at Baskk" 
              />
            </div>
            <div className="image-box img-secondary">
              <img 
                src="/baskk-new/cocktail-signature-pink.jpg" 
                alt="Signature Cocktail at Baskk" 
              />
            </div>
            <div className="badge-experience">
              <span className="number">100%</span>
              <span className="text">Modern Italian Dining</span>
            </div>
          </div>

          <div className="about-content">
            <span className="sub-heading">A Taste of Modern Italy</span>
            <h2 className="section-title">Freshly Crafted Italian Cuisine & Ocean Breezes</h2>
            <p className="description">
              Nested along Marine Parade in beautiful Coolangatta, Baskk brings modern Italian dining right to the Gold Coast shorelines. 
              Our passion lies in crafted simplicity — from slow-simmered ragùs and hand-pulled mozzarella to freshly made pizzas prepared with our house-made dough and ice-cold Aperol Spritzes.
            </p>
            <p className="description">
              Whether you're looking for a romantic sunset dinner, a relaxed weekend lunch with friends, or a memorable celebration with loved ones, Baskk offers an unmissable beachfront escape.
            </p>
            
            <div className="about-highlights">
              <div className="highlight-item">
                <i className="fa-solid fa-check"></i>
                <span>Fresh local seafood & imported artisan cured meats</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-check"></i>
                <span>Extensive international & boutique wine list</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-check"></i>
                <span>Outdoor alfresco seating with direct ocean views</span>
              </div>
            </div>

            <div className="about-cta">
              <a href="#menu" className="btn btn-primary">Explore Our Menu</a>
              <a 
                href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ textDecoration: 'none' }}
              >
                Reserve Your Table
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
