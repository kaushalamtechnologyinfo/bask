import React from 'react';

export default function Experiences({ onOpenBook }) {
  const experiences = [
    {
      title: 'Beachfront Ocean Terrace',
      tag: 'Sunset Dining',
      desc: 'Watch the sun set over the Gold Coast shoreline while enjoying fresh pasta and chilled boutique wines in our breezy alfresco terrace.',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'The Cocktail Lounge',
      tag: 'Nightlife & Drinks',
      desc: 'Unwind in our plush, ambient lounge featuring live acoustic music on weekends, artisanal spirits, and bespoke cocktail creations.',
      img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: "Chef's Tasting Menu",
      tag: 'Culinary Artistry',
      desc: 'Embark on a multi-course culinary journey curated by our Executive Chef, paired with premium regional vintage wines.',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="experiences-section section-padding bg-dark" id="experiences">
      <div className="container">
        <div className="section-header text-center light-text">
          <span className="sub-heading">Curated Moments</span>
          <h2 className="section-title">The Baskk Experience</h2>
          <p className="section-subtitle">Discover the distinct atmospheres that make Baskk Coolangatta's premier coastal venue.</p>
        </div>

        <div className="experience-grid">
          {experiences.map((exp, idx) => (
            <div className="exp-card" key={idx}>
              <div className="exp-img">
                <img src={exp.img} alt={exp.title} />
              </div>
              <div className="exp-content">
                <span className="exp-tag">{exp.tag}</span>
                <h3>{exp.title}</h3>
                <p>{exp.desc}</p>
                <a 
                  href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-light exp-btn"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Book A Table
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
