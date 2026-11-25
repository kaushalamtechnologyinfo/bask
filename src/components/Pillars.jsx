import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      icon: 'fa-utensils',
      title: 'Handcrafted Pasta',
      desc: 'Freshly rolled daily with passion, premium ingredients and modern culinary flair.'
    },
    {
      icon: 'fa-glass-martini-alt',
      title: 'Beachside Cocktails',
      desc: 'Signature coastal spritzes, barrel-aged Negronis, and refreshing beachfront concoctions.'
    },
    {
      icon: 'fa-champagne-glasses',
      title: 'Private Functions',
      desc: 'Bespoke event spaces for birthdays, corporate dinners, and intimate seaside wedding receptions.'
    },
    {
      icon: 'fa-water',
      title: 'Beach Breeze Atmosphere',
      desc: 'Located directly opposite Coolangatta beach, combining sun-soaked glamour with luxury dining.'
    }
  ];

  return (
    <section className="pillars-section">
      <div className="container">
        <div className="pillars-grid">
          {pillars.map((p, idx) => (
            <div className="pillar-card" key={idx}>
              <div className="pillar-icon">
                <i className={`fa-solid ${p.icon}`}></i>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
