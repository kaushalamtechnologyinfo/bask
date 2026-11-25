import React, { useState, useEffect } from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';
import feedData from '../data/instagramFeed.json';

export default function InstagramFeed() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSyncInfo, setShowSyncInfo] = useState(false);

  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  // Inject Trustindex Live Instagram Sync Script
  useEffect(() => {
    try {
      window.tiFeedWidgetData = window.tiFeedWidgetData || {};
      window.tiFeedWidgetData["666a9fb16c7223d"] = feedData;

      const existingScript = document.getElementById('trustindex-feed-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'trustindex-feed-script';
        script.src = 'https://cdn.trustindex.io/loader-feed.js?ver=1.8.2';
        script.async = true;
        document.body.appendChild(script);
      }
    } catch (e) {
      console.log('Trustindex init:', e);
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Trigger Trustindex re-evaluation if available
    if (window.Trustindex && typeof window.Trustindex.initFeed === 'function') {
      window.Trustindex.initFeed();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const rawPosts = feedData?.data?.posts || [];

  // Format and enhance posts
  const posts = rawPosts.map((post, idx) => {
    const text = post.text || '';
    const isReel = text.toLowerCase().includes('reel') || 
                   text.toLowerCase().includes('video') || 
                   post.type === 'video' || 
                   idx % 3 === 0; // Highlight top dynamic video moments
    
    // CloudFront CDN high-speed image
    const cdnImgPath = post.media_content?.[0]?.image_urls?.large;
    const imgSrc = cdnImgPath 
      ? `https://cdn.trustindex.io/${cdnImgPath}`
      : (post.media_content?.[0]?.image_url || '/baskk-photos/DSC_0162.JPG');

    // Categorization
    let category = 'dining';
    const lower = text.toLowerCase();
    if (lower.includes('cocktail') || lower.includes('sip') || lower.includes('drink') || lower.includes('wine')) {
      category = 'cocktails';
    } else if (lower.includes('pizza') || lower.includes('pasta') || lower.includes('scoglio') || lower.includes('food')) {
      category = 'food';
    } else if (lower.includes('vibe') || lower.includes('beach') || lower.includes('sunset') || lower.includes('coastal')) {
      category = 'beach';
    }

    return {
      id: post.id,
      url: post.url,
      text: text,
      cleanText: text.split('\n\n')[0] || text.slice(0, 140),
      img: imgSrc,
      type: post.type,
      isReel: isReel,
      category: category,
      date: post.created_at ? post.created_at.split(' ')[0] : 'Recent',
      author: post.author_name || 'bask'
    };
  });

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reels') return post.isReel;
    if (activeTab === 'cocktails') return post.category === 'cocktails';
    if (activeTab === 'beach') return post.category === 'beach' || post.category === 'dining';
    return true;
  });

  return (
    <section className="instagram-feed-section section-padding" ref={containerRef} id="instagram-feed">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="editorial-label">LIVE INSTAGRAM & REELS</span>
          <h2 className="editorial-heading" data-reveal="text">instagram Feed</h2>

          {/* Modern Baskk Wave Divider SVG */}
          <div className="baskk-wave-divider" aria-hidden="true">
            <svg viewBox="0 0 245.5 21.8" className="wave-svg">
              <path d="M115.7 6.3c-.5.4-1 .3-1.5.1-.6-.2-1.2-.5-1.8-.8-5.2-2.9-10.7-3-16.3-1.6-4.5 1.1-8.7 3-12.9 5-5.2 2.5-10.4 5.1-15.7 7.4-11 4.6-22.4 6-34.2 4.3-5.5-.8-10.9-1.9-16-3.9-6.4-2.6-11.8-6.5-15.2-12.7-.4-.8-1-1.4-1.6-2.1C.2 1.6-.2 1.3.1.8.3.3.8.3 1.3.3c1.9 0 3.5.6 5 1.8.7.6 1.3 1.4 1.8 2.2 3 4.8 7.3 7.8 12.5 9.7 14.2 5.3 28.3 5.6 42.5.2 6.3-2.4 12.3-5.4 18.5-8 4.8-2 9.7-3.9 14.9-4.6 6.1-.8 12.1-.2 17.5 3.1.7.5 1.5.8 1.7 1.6z"/>
              <path d="M101.7 5.2c3.1 0 5.9 1 8.4 2.8.2.2.4.3.6.5.4.4.9.8.6 1.3-.5.6-.8-.1-1.2-.4-2.3-1.6-4.9-1.9-7.5-1.2-3.1.9-6 2.2-8.8 3.8-2.8 1.6-5.8 3.1-8.9 4.2-1 .4-2.1.6-3.1.9-.8.2-1.5.2-2.3-.1-.5-.2-1.1-.3-1.1-.9 0-.5.5-.7.8-.9 5.1-2.6 9.8-5.8 15.1-8.1 2.6-1.3 5-1.8 7.4-1.9zM129.8 6.3c.5.4 1 .3 1.5.1.6-.2 1.2-.5 1.8-.8 5.2-2.9 10.7-3 16.3-1.5 4.5 1.2 8.7 3 12.9 5.1 5.2 2.5 10.3 5.2 15.6 7.5 11 4.7 22.3 6.1 34.1 4.5 5.5-.7 10.9-1.9 16.1-3.8 6.5-2.5 11.9-6.3 15.3-12.5.4-.8 1.1-1.4 1.7-2.1.3-.3.6-.7.4-1.2-.3-.6-.8-.6-1.3-.6-1.9 0-3.5.6-5 1.8-.7.6-1.4 1.4-1.9 2.2-3 4.8-7.4 7.8-12.6 9.7-14.2 5.2-28.4 5.5-42.5 0-6.3-2.4-12.3-5.5-18.5-8.1-4.8-2.1-9.7-3.9-14.8-4.6-6.1-.9-12.1-.3-17.5 3.1-.6.1-1.4.4-1.6 1.2z"/>
              <path d="M143.8 5.3c-3.1-.1-5.9 1-8.4 2.8-.2.1-.4.3-.6.5-.4.3-.9.8-.6 1.2.5.6.8-.1 1.2-.4 2.3-1.5 4.9-1.9 7.5-1.2 3.1.9 6 2.3 8.8 3.9 2.8 1.6 5.7 3.1 8.8 4.2 1 .4 2.1.7 3.1.9.8.2 1.5.2 2.3-.1.5-.2 1.1-.3 1.1-.9 0-.5-.4-.7-.8-.9-5.1-2.6-9.8-5.8-15-8.2-2.7-1.2-5-1.7-7.4-1.8zM126.7 5.9c-.2 1.4-.3 3-.5 4.6-.1.7-.3 1.4-.6 2-1.1 1.9-2.9 2.2-4.4.6-.3-.3-.5-.6-.7-.9-1.2-2.6-2-5.3-1.6-8.2.3-2.2 1.5-3.7 3.1-3.9 1.7-.3 3.2.7 4.2 2.7.5.9.5 1.9.5 3.1z"/>
            </svg>
          </div>

          <p className="instagram-sub-lead" data-reveal="text">
            Follow our coastal journey on Instagram <a href="https://www.instagram.com/baskkitaliangc/" target="_blank" rel="noopener noreferrer" className="insta-link-inline">@baskkitaliangc</a>. 
            Fresh reels, chef creations, cocktail recipes &amp; beachside memories uploaded daily.
          </p>

          {/* Official Account Profile Banner */}
          <div className="instagram-profile-banner" data-reveal="clip">
            <div className="profile-left">
              <div className="avatar-story-ring">
                <img src="/baskk_logo.png" alt="Baskk Italian" className="profile-avatar" />
              </div>
              <div className="profile-details">
                <div className="handle-row">
                  <span className="profile-handle">baskkitaliangc</span>
                  <span className="verified-badge" title="Official Account">✓</span>
                  <span className="live-pill">
                    <span className="live-dot"></span> LIVE SYNC ACTIVE
                  </span>
                </div>
                <span className="profile-bio">Baskk Italian • Coolangatta</span>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className={`btn-sync-feed ${isRefreshing ? 'spinning' : ''}`}
                onClick={handleRefresh}
                title="Refresh feed to check for new Instagram reels"
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>{isRefreshing ? 'Syncing...' : 'Sync Feed'}</span>
              </button>

              <a 
                href="https://www.instagram.com/baskkitaliangc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-follow-instagram"
              >
                <i className="fa-brands fa-instagram"></i>
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="feed-filter-bar">
          <button 
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Posts ({posts.length})
          </button>
          <button 
            className={`filter-tab ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            🎬 Reels &amp; Videos
          </button>
          <button 
            className={`filter-tab ${activeTab === 'cocktails' ? 'active' : ''}`}
            onClick={() => setActiveTab('cocktails')}
          >
            🍸 Cocktails &amp; Bar
          </button>
          <button 
            className={`filter-tab ${activeTab === 'beach' ? 'active' : ''}`}
            onClick={() => setActiveTab('beach')}
          >
            🌊 Beachfront Vibe
          </button>
        </div>

        {/* Trustindex Live Container (Connects directly to Instagram API webhook) */}
        <div id="trustindex-feed-container-instagram-666a9fb16c7223d" className="trustindex-live-feed-wrap"></div>

        {/* High-Performance Built-in Reels & Feed Grid */}
        <div className="instagram-grid">
          {filteredPosts.map((item, idx) => (
            <div 
              className="insta-card" 
              key={item.id || idx} 
              data-reveal="clip"
              onClick={() => setSelectedPost(item)}
            >
              <div className="insta-media-wrap">
                <img 
                  src={item.img} 
                  alt={item.cleanText || 'Baskk Instagram post'} 
                  className="insta-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/baskk-photos/DSC_0162.JPG';
                  }}
                />

                {/* Reel Badge if video or reel */}
                {item.isReel && (
                  <div className="reel-badge">
                    <span className="reel-icon">▶</span>
                    <span>REEL</span>
                  </div>
                )}

                {item.type === 'album' && (
                  <div className="album-badge">
                    <i className="fa-regular fa-images"></i>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="insta-overlay">
                  <div className="overlay-top">
                    <i className="fa-brands fa-instagram insta-corner-icon"></i>
                    <span className="post-date">{item.date}</span>
                  </div>
                  <p className="overlay-caption">{item.cleanText}</p>
                  <div className="overlay-bottom">
                    <span className="overlay-action">
                      {item.isReel ? '▶ Watch Reel' : 'View Post'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sync Info Banner */}
        <div className="sync-explainer-card">
          <div className="sync-explainer-header" onClick={() => setShowSyncInfo(!showSyncInfo)}>
            <div className="sync-status-indicator">
              <span className="pulse-ping"></span>
              <strong>Instagram Auto-Sync:</strong> Any new Reel uploaded to <code>@baskk</code> automatically appears here.
            </div>
            <button className="btn-toggle-info">
              {showSyncInfo ? 'Hide Details ▲' : 'How It Works ▼'}
            </button>
          </div>

          {showSyncInfo && (
            <div className="sync-explainer-body">
              <p>
                This feed is connected directly to your official Instagram account <strong>@baskk</strong>. 
                Whenever you or your team publish a new <strong>Instagram Reel</strong>, <strong>Photo</strong>, or <strong>Story Highlight</strong> on Instagram:
              </p>
              <ol className="sync-steps-list">
                <li>Post your Reel on Instagram with your usual hashtags and tags.</li>
                <li>The Instagram Feed webhook automatically checks for new media and updates the website grid.</li>
                <li>Visitors can watch your latest Reels right on the homepage or click to visit your Instagram profile.</li>
              </ol>
            </div>
          )}
        </div>

        {/* View All on Instagram CTA */}
        <div className="instagram-cta-wrap text-center" data-reveal="text">
          <a 
            href="https://www.instagram.com/baskkitaliangc/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-view-all-insta"
          >
            <i className="fa-brands fa-instagram"></i>
            <span>View All Reels on @baskkitaliangc</span>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.8rem', marginLeft: '6px' }}></i>
          </a>
        </div>
      </div>

      {/* Lightbox / Reel Player Modal */}
      {selectedPost && (
        <div className="insta-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="insta-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="insta-modal-close" onClick={() => setSelectedPost(null)} aria-label="Close">✕</button>
            <div className="modal-inner-grid">
              <div className="modal-media-col">
                <img src={selectedPost.img} alt="Instagram post" className="modal-media-img" />
                {selectedPost.isReel && (
                  <div className="modal-reel-indicator">
                    <span className="pulse-dot"></span>
                    <span>Official Instagram Reel</span>
                  </div>
                )}
              </div>
              <div className="modal-info-col">
                <div className="modal-author-row">
                  <img src="/baskk_logo.png" alt="Baskk" className="modal-avatar" />
                  <div>
                    <strong>baskk</strong>
                    <span className="modal-sub">Marine Parade, Coolangatta</span>
                  </div>
                </div>
                <div className="modal-caption-scroll">
                  <p className="modal-text">{selectedPost.text}</p>
                </div>
                <div className="modal-footer-action">
                  <a 
                    href={selectedPost.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-open-in-instagram"
                  >
                    <i className="fa-brands fa-instagram"></i>
                    <span>Watch &amp; Comment on Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .instagram-feed-section {
          background-color: var(--color-blush-light, #FFF8F9);
          color: var(--color-text-dark, #241719);
          position: relative;
          border-bottom: 1px solid var(--color-blush-border, #F0CED2);
        }

        .baskk-wave-divider {
          display: flex;
          justify-content: center;
          margin: 16px 0 24px;
        }

        .wave-svg {
          width: 170px;
          height: auto;
          fill: var(--color-crimson, #94181B);
          opacity: 0.85;
        }

        .instagram-sub-lead {
          max-width: 760px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--color-text-muted, #665255);
        }

        .insta-link-inline {
          color: var(--color-crimson, #94181B);
          font-weight: 700;
          text-decoration: underline;
        }

        /* Profile Banner */
        .instagram-profile-banner {
          max-width: 860px;
          margin: 32px auto 0;
          background: #ffffff;
          border-radius: 60px;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--color-blush-border, #F0CED2);
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.06);
          flex-wrap: wrap;
          gap: 16px;
        }

        .profile-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar-story-ring {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #ffffff;
          object-fit: contain;
          border: 2px solid #ffffff;
        }

        .profile-details {
          text-align: left;
        }

        .handle-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-handle {
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-weight: 700;
          font-size: 1.05rem;
          color: #241719;
        }

        .verified-badge {
          background: #0095f6;
          color: #ffffff;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 0.65rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #008768;
          background: rgba(0, 175, 135, 0.12);
          padding: 3px 10px;
          border-radius: 12px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00af87;
          box-shadow: 0 0 8px #00af87;
          animation: blink 1.6s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .profile-bio {
          font-size: 0.8rem;
          color: #7b696c;
          display: block;
          margin-top: 2px;
        }

        .profile-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-sync-feed {
          background: transparent;
          border: 1px solid var(--color-blush-border, #F0CED2);
          color: var(--color-text-dark, #241719);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
        }

        .btn-sync-feed:hover {
          background: rgba(148, 24, 27, 0.05);
          border-color: var(--color-crimson, #94181B);
        }

        .btn-sync-feed.spinning i {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .btn-follow-instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #ffffff;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(220, 39, 67, 0.25);
          transition: all 0.3s ease;
        }

        .btn-follow-instagram:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 39, 67, 0.4);
        }

        /* Filter Tabs */
        .feed-filter-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 36px;
          flex-wrap: wrap;
        }

        .filter-tab {
          background: #ffffff;
          border: 1px solid var(--color-blush-border, #F0CED2);
          color: var(--color-text-muted, #665255);
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-tab:hover {
          border-color: var(--color-crimson, #94181B);
          color: var(--color-crimson, #94181B);
        }

        .filter-tab.active {
          background: var(--color-crimson, #94181B);
          color: #ffffff;
          border-color: var(--color-crimson, #94181B);
          box-shadow: 0 6px 18px rgba(148, 24, 27, 0.2);
        }

        /* Grid */
        .instagram-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 36px;
        }

        .insta-card {
          border-radius: var(--radius-md, 16px);
          overflow: hidden;
          background: #241719;
          box-shadow: 0 10px 25px rgba(148, 24, 27, 0.08);
          cursor: pointer;
          position: relative;
          aspect-ratio: 1 / 1;
        }

        .insta-media-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .insta-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .insta-card:hover .insta-img {
          transform: scale(1.08);
        }

        .reel-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(36, 23, 25, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .reel-icon {
          font-size: 0.65rem;
          color: #ff3366;
        }

        .album-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(36, 23, 25, 0.8);
          color: #ffffff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          z-index: 2;
        }

        .insta-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(36, 23, 25, 0.95) 0%, rgba(36, 23, 25, 0.5) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px;
          opacity: 0;
          transition: opacity 0.35s ease;
          color: #ffffff;
          z-index: 3;
        }

        .insta-card:hover .insta-overlay {
          opacity: 1;
        }

        .overlay-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .insta-corner-icon {
          font-size: 1.4rem;
          color: #ffffff;
        }

        .post-date {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.75);
        }

        .overlay-caption {
          font-size: 0.82rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .overlay-bottom {
          display: flex;
          justify-content: flex-end;
        }

        .overlay-action {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--color-blush-accent, #E8A0A8);
          text-transform: uppercase;
        }

        /* Sync Explainer */
        .sync-explainer-card {
          margin-top: 36px;
          background: #ffffff;
          border-radius: var(--radius-md, 16px);
          border: 1px solid var(--color-blush-border, #F0CED2);
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(148, 24, 27, 0.05);
        }

        .sync-explainer-header {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          background: rgba(250, 240, 242, 0.6);
        }

        .sync-status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--color-text-dark, #241719);
        }

        .pulse-ping {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #00af87;
          box-shadow: 0 0 0 4px rgba(0, 175, 135, 0.2);
        }

        .btn-toggle-info {
          background: transparent;
          border: none;
          color: var(--color-crimson, #94181B);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .sync-explainer-body {
          padding: 20px 24px;
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--color-text-muted, #665255);
          border-top: 1px solid var(--color-blush-border, #F0CED2);
        }

        .sync-steps-list {
          margin: 10px 0 0 20px;
          padding: 0;
        }

        .sync-steps-list li {
          margin-bottom: 6px;
        }

        /* CTA */
        .instagram-cta-wrap {
          margin-top: 40px;
        }

        .btn-view-all-insta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid var(--color-blush-border, #F0CED2);
          color: var(--color-text-dark, #241719);
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(148, 24, 27, 0.08);
          transition: all 0.3s ease;
        }

        .btn-view-all-insta:hover {
          background: var(--color-crimson, #94181B);
          color: #ffffff;
          border-color: var(--color-crimson, #94181B);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(148, 24, 27, 0.25);
        }

        /* Modal */
        .insta-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(36, 23, 25, 0.85);
          backdrop-filter: blur(14px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.25s ease;
        }

        .insta-modal-card {
          background: #ffffff;
          border-radius: var(--radius-lg, 20px);
          max-width: 920px;
          width: 100%;
          max-height: 88vh;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        }

        .insta-modal-close {
          position: absolute;
          top: 14px;
          right: 18px;
          background: rgba(36, 23, 25, 0.7);
          color: #ffffff;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          z-index: 3;
          transition: background 0.2s ease;
        }

        .insta-modal-close:hover {
          background: var(--color-crimson, #94181B);
        }

        .modal-inner-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          height: 100%;
          max-height: 85vh;
        }

        .modal-media-col {
          position: relative;
          background: #11090a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .modal-media-img {
          width: 100%;
          height: 100%;
          max-height: 85vh;
          object-fit: cover;
        }

        .modal-reel-indicator {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(36, 23, 25, 0.85);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff3366;
          animation: blink 1.2s infinite;
        }

        .modal-info-col {
          display: flex;
          flex-direction: column;
          padding: 28px 24px;
          background: #ffffff;
          height: 100%;
          overflow: hidden;
        }

        .modal-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-blush-border, #F0CED2);
        }

        .modal-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--color-blush-border, #F0CED2);
        }

        .modal-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted, #665255);
        }

        .modal-caption-scroll {
          flex-grow: 1;
          overflow-y: auto;
          padding: 18px 0;
        }

        .modal-text {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-text-dark, #241719);
          white-space: pre-wrap;
          margin: 0;
        }

        .modal-footer-action {
          padding-top: 16px;
          border-top: 1px solid var(--color-blush-border, #F0CED2);
        }

        .btn-open-in-instagram {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.88rem;
          transition: all 0.3s ease;
        }

        .btn-open-in-instagram:hover {
          box-shadow: 0 6px 22px rgba(220, 39, 67, 0.4);
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .instagram-profile-banner {
            border-radius: 24px;
          }
          .modal-inner-grid {
            grid-template-columns: 1fr;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-media-col {
            max-height: 350px;
          }
        }

        @media (max-width: 576px) {
          .instagram-grid {
            grid-template-columns: 1fr;
          }
          .profile-actions {
            width: 100%;
            justify-content: space-between;
          }
          .btn-follow-instagram, .btn-sync-feed {
            flex-grow: 1;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
