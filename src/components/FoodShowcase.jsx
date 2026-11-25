import React from 'react';
import useGSAP from '../hooks/useGSAP';
import { initScrollAnimations } from '../animations/scrollAnimations';

export default function FoodShowcase() {
  const containerRef = useGSAP((element) => {
    initScrollAnimations(element);
  });

  const dishes = [
    {
      title: 'Spaghetti Scoglio',
      category: 'SIGNATURE SEAFOOD',
      desc: 'Spaghetti, seafood mix (Moreton Bay bugs, prawns, scallops, calamari, mussels), chilli, garlic, herbs, choice of neapolitana sauce or bianco.',
      img: '/baskk-new/seafood-linguine-fresh.jpg',
      fallback: '/baskk-photos/2.jpg',
      tag: "CHEF SIGNATURE",
      price: '$37'
    },
    {
      title: 'Burrata Pizza',
      category: 'HOUSE-MADE PIZZA DOUGH',
      desc: 'Freshly made pizzas prepared with our house-made pizza dough, quality ingredients and Italian flavours with modern flair.',
      img: '/baskk-new/fresh-pizzas-stand.jpg',
      fallback: '/baskk-new/pizza-burrata-special.jpg',
      tag: 'HOUSE-MADE DOUGH',
      price: '$30'
    },
    {
      title: 'Lamb Ragù Pappardelle',
      category: 'HANDCRAFTED PASTA',
      desc: '12-hour cooked lamb shoulder ragù pappardelle, pecorino cheese, gremolata.',
      img: '/baskk-new/handcrafted-pasta-ragu.jpg',
      fallback: '/baskk-new/seafood-linguine-fresh.jpg',
      tag: 'HOUSE MADE DAILY',
      price: '$34'
    }
  ];

  return (
    <section className="food-showcase-section section-padding" ref={containerRef}>
      <div className="container">
        <div className="section-header text-center">
          <span className="editorial-label">A TASTE OF MODERN ITALY</span>
          <h2 className="editorial-heading" data-reveal="text">Freshly Crafted Italian Cuisine</h2>
          <p className="section-subtitle">Modern Italian dining with seasonal Queensland produce, house-made dough, and handcrafted pasta.</p>
        </div>

        <div className="showcase-list">
          {dishes.map((dish, idx) => (
            <div className={`showcase-item ${idx % 2 === 1 ? 'reverse' : ''}`} key={idx}>
              <div className="showcase-image-col" data-reveal="clip">
                <img 
                  src={dish.img} 
                  alt={dish.title} 
                  className="showcase-img" 
                  onError={(e) => { e.target.src = dish.fallback; }}
                />
                <div className="showcase-badge-group">
                  <span className="showcase-tag">{dish.tag}</span>
                  <span className="showcase-price">{dish.price}</span>
                </div>
              </div>

              <div className="showcase-content-col" data-reveal="text">
                <span className="dish-category">{dish.category}</span>
                <h3 className="dish-title">{dish.title}</h3>
                <p className="dish-desc">{dish.desc}</p>
                <div className="dish-footer">
                  <div className="dish-divider"></div>
                  <span className="dish-accent">Pair with Australian Pinot Noir</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .food-showcase-section {
          background-color: var(--color-cream);
        }

        .section-subtitle {
          color: var(--color-muted);
          font-size: 1.05rem;
          margin-top: 8px;
        }

        .showcase-list {
          display: flex;
          flex-direction: column;
          gap: 100px;
          margin-top: 60px;
        }

        .showcase-item {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 70px;
          align-items: center;
        }

        .showcase-item.reverse {
          grid-template-columns: 0.9fr 1.1fr;
        }

        .showcase-item.reverse .showcase-image-col {
          order: 2;
        }

        .showcase-item.reverse .showcase-content-col {
          order: 1;
        }

        .showcase-image-col {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 480px;
          box-shadow: 0 24px 50px rgba(28, 25, 23, 0.12);
          background-color: var(--color-sand);
        }

        .showcase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-expo);
        }

        .showcase-image-col:hover .showcase-img {
          transform: scale(1.06);
        }

        .showcase-badge-group {
          position: absolute;
          top: 24px;
          left: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .showcase-tag {
          background-color: var(--color-espresso);
          color: var(--color-ivory);
          font-size: 0.688rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .showcase-price {
          background: rgba(168, 78, 50, 0.9);
          backdrop-filter: blur(8px);
          color: #fff;
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: var(--radius-pill);
        }

        .dish-category {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: var(--color-terracotta);
          display: block;
          margin-bottom: 12px;
        }

        .dish-title {
          font-size: clamp(2rem, 3.5vw, 3rem);
          color: var(--color-espresso);
          margin-bottom: 20px;
        }

        .dish-desc {
          font-size: 1.063rem;
          line-height: 1.8;
          color: var(--color-muted);
          margin-bottom: 30px;
        }

        .dish-footer {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .dish-divider {
          width: 60px;
          height: 2px;
          background-color: var(--color-terracotta);
        }

        .dish-accent {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--color-gold);
          font-size: 0.95rem;
        }

        @media (max-width: 992px) {
          .showcase-list {
            gap: 70px;
          }

          .showcase-item, .showcase-item.reverse {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .showcase-item.reverse .showcase-image-col {
            order: 1;
          }

          .showcase-item.reverse .showcase-content-col {
            order: 2;
          }

          .showcase-image-col {
            height: 340px;
          }
        }
      `}</style>
    </section>
  );
}
