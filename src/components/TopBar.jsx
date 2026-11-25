import React from 'react';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        <div className="top-info">
          <span><i className="fa-solid fa-location-dot"></i> 52–58 Marine Parade, Coolangatta, QLD 4225, Australia</span>
          <span className="divider">|</span>
          <span><i class="fa-solid fa-clock"></i> Open Today from 5:00 PM</span>
        </div>
        <div className="top-actions">
          <a href="mailto:request@baskk.co" className="top-link"><i className="fa-solid fa-envelope"></i> request@baskk.co</a>
          <span className="divider">|</span>
          <a href="https://www.facebook.com/baskkitalian" target="_blank" rel="noreferrer" className="top-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/baskkitaliangc/" target="_blank" rel="noreferrer" className="top-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </div>
  );
}
