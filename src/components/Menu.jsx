import React, { useState } from 'react';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'Burrata Pugliese',
    price: '$24',
    category: 'antipasti',
    diet: ['v', 'gf'],
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
    desc: 'Fresh cream burrata, Heirloom vine tomatoes, prosciutto di Parma, aged balsamic glaze, extra virgin olive oil & grilled sourdough.',
    tags: ['Vegetarian Option', 'GF Option']
  },
  {
    id: 2,
    name: 'Calamari Fritti',
    price: '$22',
    category: 'antipasti',
    diet: ['gf'],
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    desc: 'Lightly dusted local calamari, lemon zested sea salt, wild rocket salad & house-made garlic citrus aioli.',
    tags: ['GF Available']
  },
  {
    id: 3,
    name: 'Lamb Ragù Pappardelle',
    price: '$34',
    category: 'pasta',
    diet: ['gf'],
    badge: "House Signature",
    img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288015?auto=format&fit=crop&w=600&q=80',
    desc: '12-hour cooked lamb shoulder ragù pappardelle, pecorino cheese, gremolata.',
    tags: ['GF Available +$4']
  },
  {
    id: 4,
    name: 'Spaghetti Scoglio',
    price: '$37',
    category: 'pasta',
    diet: ['gf'],
    badge: "Signature Seafood",
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    desc: 'Spaghetti, seafood mix (Moreton Bay bugs, prawns, scallops, calamari, mussels), chilli, garlic, herbs, choice of neapolitana sauce or bianco.',
    tags: ['GF Available +$4']
  },
  {
    id: 5,
    name: 'Margherita',
    price: '$24',
    category: 'pizza',
    diet: ['v'],
    img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    desc: 'Fior di latte mozzarella, tomato sugo, basil on our housemade pizza dough.',
    tags: ['Vegetarian', 'VGO']
  },
  {
    id: 6,
    name: 'Diavola',
    price: '$27',
    category: 'pizza',
    diet: [],
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    desc: 'Fior di latte, salami, tomato sugo on our housemade pizza dough.',
    tags: ['Classic']
  },
  {
    id: 7,
    name: 'Beef Cheek',
    price: '$39',
    category: 'secondi',
    diet: ['gf'],
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    desc: 'Slow cooked tender beef cheek with fresh seasonal vegetables.',
    tags: ['Gluten-Free']
  },
  {
    id: 8,
    name: 'Coolangatta Sunset Spritz',
    price: '$20',
    category: 'cocktails',
    diet: [],
    badge: 'Signature Cocktail',
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    desc: 'Select Aperitivo, Malfy Blood Orange Gin, Prosecco, passionfruit puree, soda water & fresh rosemary sprig.',
    tags: ['House Specialty']
  },
  {
    id: 9,
    name: 'Smoked Hazelnut Espresso Martini',
    price: '$22',
    category: 'cocktails',
    diet: [],
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    desc: 'Ketel One Vodka, Frangelico hazelnut liqueur, fresh dark espresso roast & vanilla bean foam.',
    tags: ['Cocktail Classic']
  },
  {
    id: 10,
    name: 'Tiramisù Tradizionale',
    price: '$16',
    category: 'dolci',
    diet: ['v'],
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    desc: 'Savoiardi ladyfingers soaked in espresso & Marsala wine, layered with whipped mascarpone cream & dark cocoa powder.',
    tags: ['Vegetarian']
  }
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDiet, setActiveDiet] = useState(null);
  const [search, setSearch] = useState('');

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesDiet = !activeDiet || item.diet.includes(activeDiet);
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesDiet && matchesSearch;
  });

  return (
    <section className="menu-section section-padding" id="menu">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading">Culinary Delights</span>
          <h2 className="section-title">Our Food & Beverage Menu</h2>
          <p className="section-subtitle">A taste of modern Italy — freshly crafted Italian cuisine, house-made pasta and pizzas prepared with locally sourced ingredients.</p>
        </div>

        {/* Menu Controls */}
        <div className="menu-controls">
          <div className="menu-tabs">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'antipasti', label: 'Antipasti & Starters' },
              { id: 'pasta', label: 'Handcrafted Pasta' },
              { id: 'pizza', label: 'Pizzas' },
              { id: 'secondi', label: 'Secondi (Mains)' },
              { id: 'cocktails', label: 'Cocktails & Drinks' },
              { id: 'dolci', label: 'Dolci (Desserts)' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="menu-filters-bar">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search dishes or drinks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="dietary-filters">
              <button 
                className={`diet-btn ${activeDiet === 'gf' ? 'active' : ''}`}
                onClick={() => setActiveDiet(activeDiet === 'gf' ? null : 'gf')}
              >
                <i className="fa-solid fa-leaf"></i> Gluten-Free Option
              </button>
              <button 
                className={`diet-btn ${activeDiet === 'v' ? 'active' : ''}`}
                onClick={() => setActiveDiet(activeDiet === 'v' ? null : 'v')}
              >
                <i className="fa-solid fa-seedling"></i> Vegetarian
              </button>
              <button 
                className={`diet-btn ${activeDiet === 'vg' ? 'active' : ''}`}
                onClick={() => setActiveDiet(activeDiet === 'vg' ? null : 'vg')}
              >
                <i className="fa-solid fa-carrot"></i> Vegan
              </button>
            </div>
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div className="menu-card" key={item.id}>
              <div className="card-img-wrap">
                <img src={item.img} alt={item.name} />
                {item.badge && <span className="card-badge">{item.badge}</span>}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-price">{item.price}</span>
                </div>
                <p className="item-desc">{item.desc}</p>
                <div className="item-tags">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="menu-footer text-center">
          <button className="btn btn-outline" onClick={() => alert('Downloading Baskk PDF Menu...')}>
            <i className="fa-solid fa-file-pdf"></i> Download Full Menu PDF
          </button>
        </div>
      </div>
    </section>
  );
}
