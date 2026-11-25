import React from 'react';

export default function Functions({ onOpenEnquiry }) {
  return (
    <section className="functions-section section-padding" id="functions">
      <div className="container">
        <div className="functions-wrapper">
          <div className="functions-content">
            <span className="sub-heading">Host Your Event</span>
            <h2 className="section-title">Functions & Celebrations</h2>
            <p className="description">
              From intimate birthday dinners and corporate gatherings to magnificent beachfront wedding celebrations, Baskk provides a captivating backdrop for life’s grandest occasions.
            </p>
            
            <div className="function-specs">
              <div className="spec-card">
                <div className="spec-number">150</div>
                <div className="spec-label">Cocktail Capacity</div>
              </div>
              <div className="spec-card">
                <div className="spec-number">160</div>
                <div className="spec-label">Seated Dining Capacity</div>
              </div>
              <div className="spec-card">
                <div className="spec-number">100%</div>
                <div className="spec-label">Ocean Views</div>
              </div>
            </div>

            <div className="function-actions">
              <button className="btn btn-primary" onClick={onOpenEnquiry}>
                <i className="fa-solid fa-paper-plane"></i> Enquire Now
              </button>
              <button className="btn btn-outline" onClick={() => alert('Downloading Baskk Event Pack PDF...')}>
                <i className="fa-solid fa-download"></i> Event Pack (PDF)
              </button>
            </div>
          </div>

          <div className="functions-image">
            <img 
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80" 
              alt="Baskk Function Space" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
