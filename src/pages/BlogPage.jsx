import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MagneticButton from '../components/MagneticButton';
import officialBlogs from '../data/officialBlogs.json';

const FALLBACK_IMAGE = '/blog/blog-beach-view.jpg';

const CATEGORIES = [
  'ALL',
  'BAR & COCKTAILS',
  'ARTISAN PIZZA',
  'HANDCRAFTED PASTA',
  'BEACHFRONT DINING',
  'COASTAL TRADITIONS',
  'ROMANTIC & EVENTS',
  'COASTAL BRUNCH'
];

const INITIAL_DISPLAY_COUNT = 9;

export default function BlogPage({ onOpenBook, onOpenEnquiry }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
  const [activePost, setActivePost] = useState(null);

  // Filtered blogs based on Category and Search
  const filteredBlogs = useMemo(() => {
    return officialBlogs.filter((post) => {
      const matchesCategory =
        selectedCategory === 'ALL' || post.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.snippet.toLowerCase().includes(q) ||
        post.content.some((p) => p.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Sliced for pagination
  const displayedBlogs = useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_DISPLAY_COUNT);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_DISPLAY_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="blog-page-wrap">
      <Navbar onOpenBook={onOpenBook} />

      <main className="blog-main-content">
        {/* Editorial Banner */}
        <section className="blog-hero-banner">
          <div className="container">
            <span className="blog-eyebrow">BASKK JOURNAL • THE OFFICIAL STORIES</span>
            <h1 className="blog-main-title">
              STORIES FROM BASKK: <br />
              <span className="title-accent">BEACHFRONT FLAVOURS &amp; COASTAL CRAFT</span>
            </h1>
            <p className="blog-hero-lead">
              Original stories and articles from the official Baskk Journal ({officialBlogs.length} Stories) — explore our comforting cuisine, beachfront bar secrets, freshly made pizzas, handcrafted pastas, and Coolangatta stories.
            </p>

            {/* Search & Filter Controls Bar */}
            <div className="blog-filter-bar">
              <div className="blog-search-box">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  type="text"
                  placeholder="Search articles by dish, ingredient, or vibe..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="blog-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="blog-category-pills">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === 'ALL'
                      ? officialBlogs.length
                      : officialBlogs.filter((b) => b.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      <span>{cat}</span>
                      <span className="cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Articles Grid */}
        <section className="blog-articles-section section-padding">
          <div className="container">
            {/* Results count & status */}
            <div className="blog-results-meta">
              <span>
                Showing <strong>{displayedBlogs.length}</strong> of <strong>{filteredBlogs.length}</strong> stories
                {selectedCategory !== 'ALL' && ` in ${selectedCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>

            {filteredBlogs.length === 0 ? (
              <div className="blog-no-results">
                <i className="fa-regular fa-newspaper empty-icon"></i>
                <h3>No articles found</h3>
                <p>We couldn't find any articles matching your search. Try adjusting keywords or category filters.</p>
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="blog-articles-grid">
                {displayedBlogs.map((post) => (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card-media" onClick={() => setActivePost(post)}>
                      <img
                        src={post.img || FALLBACK_IMAGE}
                        alt={post.title}
                        className="blog-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className="blog-badge">{post.category}</span>
                    </div>

                    <div className="blog-card-body">
                      <div className="blog-meta-row">
                        <span className="blog-meta-date">{post.date}</span>
                        <span className="blog-meta-dot">&bull;</span>
                        <span className="blog-meta-rt">{post.readTime}</span>
                      </div>

                      <h2 className="blog-post-title" onClick={() => setActivePost(post)}>
                        {post.title}
                      </h2>

                      <p className="blog-post-snippet">{post.snippet}</p>

                      <div className="blog-card-footer">
                        <button
                          type="button"
                          className="btn-read-more"
                          onClick={() => setActivePost(post)}
                        >
                          <span>READ FULL STORY</span>
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredBlogs.length && (
              <div className="blog-load-more-wrap">
                <button
                  type="button"
                  className="btn-load-more-stories"
                  onClick={handleLoadMore}
                >
                  <span>LOAD MORE STORIES ({filteredBlogs.length - visibleCount} REMAINING)</span>
                  <i className="fa-solid fa-angles-down"></i>
                </button>
              </div>
            )}

            {/* Bottom Callout Banner */}
            <div className="blog-cta-banner">
              <div className="cta-text">
                <span className="cta-eyebrow">VISIT BASKK</span>
                <h3 className="cta-headline">Experience the Stories by the Beach</h3>
                <p className="cta-sub">
                  Join us for handcrafted pasta, freshly made pizzas, or sunset cocktails right on Marine Parade, Coolangatta.
                </p>
              </div>
              <div className="cta-btn-wrap">
                <a 
                  href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta-reserve"
                  style={{ textDecoration: 'none' }}
                >
                  <span>BOOK A TABLE NOW</span>
                  <i className="fa-solid fa-calendar-days"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Article Reader Modal */}
        {activePost && (
          <div className="article-modal-backdrop" onClick={() => setActivePost(null)}>
            <div className="article-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn-article-close"
                onClick={() => setActivePost(null)}
                aria-label="Close article"
              >
                &times;
              </button>

              <div className="article-modal-hero">
                <img
                  src={activePost.img || FALLBACK_IMAGE}
                  alt={activePost.title}
                  className="modal-hero-img"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="article-modal-badge">{activePost.category}</div>
              </div>

              <div className="article-modal-content">
                <div className="article-modal-meta">
                  <span>{activePost.date}</span>
                  <span>&bull;</span>
                  <span>{activePost.readTime}</span>
                  <span>&bull;</span>
                  <span>Baskk, Coolangatta</span>
                </div>

                <h1 className="article-modal-title">{activePost.title}</h1>

                <div className="article-modal-body">
                  {activePost.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="article-modal-cta">
                  <a
                    href="https://booking.resdiary.com/widget/Standard/BaskkItalian/11276"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modal-book"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>RESERVE A TABLE</span>
                    <i className="fa-solid fa-calendar-check"></i>
                  </a>

                  <a
                    href="https://storefront.hungryhungry.com/baskkitalian-pickup/menu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modal-order"
                  >
                    <span>ORDER ONLINE PICKUP</span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>

                  {activePost.originalUrl && (
                    <a
                      href={activePost.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-modal-original"
                    >
                      <span>VIEW ON BASKK.CO</span>
                      <i className="fa-solid fa-link"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onOpenBook={onOpenBook} />

      <style>{`
        .blog-page-wrap {
          background-color: #FAF2F3;
          min-height: 100vh;
        }

        .blog-hero-banner {
          background: #1F1A1B;
          color: #FFFFFF;
          padding: 130px 0 50px 0;
          text-align: center;
          border-bottom: 1px solid rgba(232, 160, 168, 0.2);
        }

        .blog-eyebrow {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #E63980;
          display: inline-block;
          margin-bottom: 14px;
        }

        .blog-main-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          line-height: 1.15;
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .title-accent {
          font-style: italic;
          color: #F8B4C0;
        }

        .blog-hero-lead {
          font-size: 1.05rem;
          color: #D6C2C5;
          max-width: 720px;
          margin: 0 auto 36px auto;
          line-height: 1.65;
        }

        /* Search & Filter Bar */
        .blog-filter-bar {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .blog-search-box {
          position: relative;
          width: 100%;
          max-width: 580px;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #E63980;
          font-size: 0.95rem;
        }

        .blog-search-input {
          width: 100%;
          padding: 14px 44px 14px 46px;
          border-radius: 9999px;
          border: 1px solid rgba(230, 57, 128, 0.35);
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.92rem;
          outline: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .blog-search-input:focus {
          border-color: #E63980;
          background: rgba(255, 255, 255, 0.14);
          box-shadow: 0 0 16px rgba(230, 57, 128, 0.3);
        }

        .blog-search-input::placeholder {
          color: rgba(214, 194, 197, 0.6);
        }

        .btn-clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #D6C2C5;
          font-size: 1.4rem;
          cursor: pointer;
          line-height: 1;
        }

        /* Category Filter Pills */
        .blog-category-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .cat-pill {
          background: rgba(255, 255, 255, 0.06);
          color: #E2CDD1;
          border: 1px solid rgba(248, 180, 192, 0.22);
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .cat-pill:hover {
          background: rgba(230, 57, 128, 0.2);
          border-color: #E63980;
          color: #FFFFFF;
        }

        .cat-pill.active {
          background: #E63980;
          color: #FFFFFF;
          border-color: #E63980;
          box-shadow: 0 4px 14px rgba(230, 57, 128, 0.4);
        }

        .cat-count {
          font-size: 0.64rem;
          background: rgba(0, 0, 0, 0.25);
          padding: 2px 6px;
          border-radius: 10px;
        }

        /* Results Meta */
        .blog-results-meta {
          font-size: 0.88rem;
          color: #665255;
          margin-bottom: 28px;
          text-align: left;
        }

        .section-padding {
          padding: 60px 0 100px 0;
        }

        .blog-articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }

        /* Blog Card */
        .blog-card {
          background: #FFFFFF;
          border: 1px solid #EAC8CD;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(148, 24, 27, 0.04);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 34px rgba(148, 24, 27, 0.12);
          border-color: #E63980;
        }

        .blog-card-media {
          position: relative;
          height: 230px;
          overflow: hidden;
          background: #241719;
          cursor: pointer;
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .blog-card:hover .blog-card-img {
          transform: scale(1.08);
        }

        .blog-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(25, 17, 19, 0.88);
          color: #FF709F;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid rgba(230, 57, 128, 0.4);
          backdrop-filter: blur(4px);
        }

        .blog-card-body {
          padding: 26px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blog-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #94181B;
          margin-bottom: 12px;
        }

        .blog-meta-dot {
          opacity: 0.6;
        }

        .blog-post-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.35rem;
          color: #241719;
          line-height: 1.3;
          margin: 0 0 12px 0;
          cursor: pointer;
          transition: color 0.2s ease;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-post-title:hover {
          color: #E63980;
        }

        .blog-post-snippet {
          font-size: 0.9rem;
          color: #665255;
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #F5DDE0;
        }

        .btn-read-more {
          background: none;
          border: none;
          color: #8B2624;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }

        .btn-read-more:hover {
          color: #E63980;
          gap: 12px;
        }

        /* Load More */
        .blog-load-more-wrap {
          margin-top: 50px;
          display: flex;
          justify-content: center;
        }

        .btn-load-more-stories {
          padding: 16px 36px;
          background: #8B2624;
          color: #FFFFFF;
          border: 1px solid #731F1D;
          border-radius: 9999px;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(139, 38, 36, 0.25);
        }

        .btn-load-more-stories:hover {
          background: #E63980;
          border-color: #E63980;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(230, 57, 128, 0.35);
        }

        /* No Results State */
        .blog-no-results {
          text-align: center;
          padding: 60px 20px;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px dashed #E8A0A8;
        }

        .empty-icon {
          font-size: 3rem;
          color: #E63980;
          margin-bottom: 16px;
        }

        .blog-no-results h3 {
          font-family: var(--font-serif, serif);
          font-size: 1.6rem;
          color: #241719;
          margin-bottom: 8px;
        }

        .blog-no-results p {
          color: #665255;
          margin-bottom: 20px;
        }

        .btn-reset-filters {
          padding: 10px 24px;
          background: #94181B;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }

        /* Bottom CTA Banner */
        .blog-cta-banner {
          margin-top: 70px;
          background: #1F1A1B;
          color: #FFFFFF;
          border-radius: 14px;
          padding: 40px 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border: 1px solid rgba(232, 160, 168, 0.3);
        }

        .cta-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #E63980;
          display: block;
          margin-bottom: 6px;
        }

        .cta-headline {
          font-family: var(--font-serif, serif);
          font-size: 1.8rem;
          margin: 0 0 8px 0;
        }

        .cta-sub {
          font-size: 0.95rem;
          color: #D6C2C5;
          margin: 0;
        }

        .btn-cta-reserve {
          padding: 16px 32px;
          background: linear-gradient(135deg, #FF4081 0%, #E63980 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.86rem;
          letter-spacing: 0.12em;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }

        /* Article Reader Modal */
        .article-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 12, 14, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .article-modal-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 16px;
          max-width: 820px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid #E8A0A8;
        }

        .btn-article-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 42px;
          height: 42px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFFFFF;
          border: none;
          border-radius: 50%;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s ease;
        }

        .btn-article-close:hover {
          background: #E63980;
        }

        .article-modal-hero {
          position: relative;
          height: 340px;
          overflow: hidden;
          background: #1F1A1B;
        }

        .modal-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-modal-badge {
          position: absolute;
          bottom: 20px;
          left: 24px;
          background: #94181B;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          padding: 6px 14px;
          border-radius: 6px;
        }

        .article-modal-content {
          padding: 36px 44px 48px 44px;
        }

        .article-modal-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #94181B;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        }

        .article-modal-title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          color: #241719;
          line-height: 1.25;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .article-modal-body p {
          font-size: 1.05rem;
          color: #4A3A3D;
          line-height: 1.85;
          margin-bottom: 20px;
        }

        .article-modal-cta {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid #F0CED2;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-modal-book {
          padding: 13px 26px;
          background: #8B2624;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s ease;
        }

        .btn-modal-book:hover {
          background: #E63980;
        }

        .btn-modal-order {
          padding: 13px 26px;
          background: #FAF2F3;
          border: 1px solid #E8A0A8;
          color: #241719;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          border-radius: 9999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .btn-modal-order:hover {
          background: #FCE6EB;
          border-color: #E63980;
        }

        .btn-modal-original {
          padding: 13px 22px;
          background: transparent;
          border: 1px dashed #A89094;
          color: #665255;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          border-radius: 9999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-modal-original:hover {
          color: #241719;
          border-color: #241719;
        }

        @media (max-width: 768px) {
          .blog-articles-grid {
            grid-template-columns: 1fr;
          }
          .blog-cta-banner {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }
          .article-modal-content {
            padding: 24px 20px;
          }
        }
      `}</style>
    </div>
  );
}
