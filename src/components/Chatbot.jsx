import React, { useState, useEffect, useRef } from 'react';

const FAQ_DATA = [
  {
    keywords: ['book', 'table', 'reserve', 'reservation', 'seat', 'booking'],
    reply: "I can help you with that! Opening our official table reservation system now. You can pick your date, time, and party size.",
    action: 'open_book',
    link: { label: 'Book a Table via ResDiary', url: 'https://booking.resdiary.com/widget/Standard/BaskkItalian/11276', external: true }
  },
  {
    keywords: ['hour', 'time', 'open', 'close', 'opening', 'trading', 'timing', 'lunch', 'dinner'],
    reply: "Here are our trading hours at Kirra Beach:\n• Mon–Thu: 5:00 PM – 9:30 PM (Dinner)\n• Friday: 3:00 PM – 10:00 PM (Aperitivo & Dinner)\n• Saturday: 12:00 PM – 10:00 PM (All Day Dining & Lunch)\n• Sunday: 12:00 PM – 9:30 PM (Lunch & Sunset Dinner)"
  },
  {
    keywords: ['menu', 'food', 'drink', 'drinks', 'pasta', 'pizza', 'wine', 'cocktail', 'beverage', 'beer'],
    reply: "Here are our 3 official menus with direct PDF attachments ready to download and view:",
    attachments: [
      {
        title: 'Food Menu (PDF)',
        desc: 'Freshly Crafted Italian Cuisine, House-Made Dough & Handcrafted Pasta',
        url: '/food-menu.pdf',
        downloadName: 'Baskk-Food-Menu.pdf',
        icon: 'fa-solid fa-utensils',
        badge: 'PDF'
      },
      {
        title: 'Drinks Menu (PDF)',
        desc: 'Signature Spritzes, Regional Wines & Craft Beers',
        url: '/drinks-menu.pdf',
        downloadName: 'Drinks Menu.pdf',
        icon: 'fa-solid fa-martini-glass-citrus',
        badge: 'PDF'
      },
      {
        title: 'Set Menu 2026 (PDF)',
        desc: 'Multi-Course Shared Feasts & Group Packages',
        url: '/set-menu-2026.pdf',
        downloadName: 'Baskk-Set-Menu-2026.pdf',
        icon: 'fa-solid fa-champagne-glasses',
        badge: 'PDF'
      }
    ],
    link: { label: 'Open Interactive Menu Page', url: '/menu' }
  },
  {
    keywords: ['gluten', 'gf', 'vegan', 'veg', 'vegetarian', 'dietary', 'allergy', 'celiac'],
    reply: "Yes, absolutely! We take dietary requirements very seriously. We offer gluten-free pasta options, gluten-free pizza crusts, and a wide variety of vegetarian and vegan dishes across our kitchen."
  },
  {
    keywords: ['order', 'pickup', 'takeaway', 'online', 'delivery', 'hungryhungry'],
    reply: "You can easily order takeaway pickup directly through our official online ordering portal!",
    link: { label: 'Order Online Pickup (HungryHungry)', url: 'https://storefront.hungryhungry.com/baskkitalian-pickup/menu', external: true }
  },
  {
    keywords: ['where', 'location', 'address', 'map', 'directions', 'park', 'parking', 'kirra'],
    reply: "We are located at:\n📍 52–58 Marine Parade, Coolangatta, QLD 4225, Australia\nRight opposite Coolangatta Beach with direct ocean views! Ample beachfront and street parking is available."
  },
  {
    keywords: ['call', 'phone', 'contact', 'number', 'email', 'speak'],
    reply: "You can reach our team directly at:\n✉️ request@baskk.co\nOr reserve a table online via ResDiary anytime!"
  },
  {
    keywords: ['set menu', 'group menu', 'function menu', 'package', 'banquet'],
    reply: "Our official Set Menu 2026 is available for groups, events, and special celebrations! You can download the PDF attachment directly below:",
    attachments: [
      {
        title: 'Set Menu 2026 (PDF)',
        desc: 'Official 5-Course Feasts & Group Banquet Packages',
        url: '/set-menu-2026.pdf',
        downloadName: 'Baskk-Set-Menu-2026.pdf',
        icon: 'fa-solid fa-champagne-glasses',
        badge: 'PDF'
      }
    ],
    link: { label: 'Submit Function Enquiry', url: '/booking-enquiry' }
  },
  {
    keywords: ['function', 'party', 'event', 'wedding', 'birthday', 'corporate'],
    reply: "We host unforgettable events, weddings, birthdays, and private seaside celebrations with tailored banquet packages. Click below to view events or send an enquiry!",
    link: { label: 'Explore Events & Functions', url: '/about' }
  },
  {
    keywords: ['review', 'agfg', 'rating', 'feedback'],
    reply: "We love hearing from our guests! You can view and write a verified review for Baskk on Australian Good Food Guide (AGFG).",
    link: { label: 'Review on AGFG', url: 'https://www.agfg.com.au/restaurant/bask-115695', external: true }
  }
];

export default function Chatbot({ onOpenBook }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleCloseChat = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setIsOpen(false);
  };
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Ciao! Benvenuto a Baskk. I'm your coastal dining concierge. How can I help you today?",
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGreetingBadge, setShowGreetingBadge] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowGreetingBadge(false);
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Bot response logic
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = FAQ_DATA.find(item => 
        item.keywords.some(kw => lower.includes(kw))
      );

      let botResponse;
      if (matched) {
        botResponse = {
          sender: 'bot',
          text: matched.reply,
          link: matched.link,
          attachments: matched.attachments || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (matched.action === 'open_book' && onOpenBook) {
          onOpenBook();
        }
      } else {
        botResponse = {
          sender: 'bot',
          text: "Grazie! For specific questions or private requests, feel free to email us at request@baskk.co, browse our menus, or book a seaside table.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickPrompts = [
    { label: '📅 Book Table', query: 'I want to book a table' },
    { label: '🍕 Food & Drink Menu', query: 'Show me the menu' },
    { label: '⏰ Trading Hours', query: 'What are your opening hours?' },
    { label: '📍 Location & Parking', query: 'Where are you located?' },
    { label: '🌾 Gluten-Free Options', query: 'Do you have gluten free options?' },
  ];

  return (
    <div className="baskk-chatbot-float-root">
      {/* Floating Prompt Notification Pill (Dismissible/Clickable) */}
      {!isOpen && showGreetingBadge && (
        <div className="chat-greeting-toast" onClick={() => setIsOpen(true)}>
          <div className="toast-avatar">
            <img src="/baskk_logo.png" alt="Baskk" />
          </div>
          <div className="toast-text">
            <strong>Ciao! Need assistance?</strong>
            <span>Table bookings, menus & hours</span>
          </div>
          <button 
            type="button" 
            className="btn-toast-close" 
            onClick={(e) => { e.stopPropagation(); setShowGreetingBadge(false); }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}

      {/* Floating Circular Action Button */}
      <button
        type="button"
        className={`baskk-chat-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle Baskk Concierge Chat"
        title="Chat with Baskk Concierge"
      >
        <span className="trigger-pulse-ring"></span>
        <span className="trigger-status-dot"></span>

        {isOpen ? (
          <i className="fa-solid fa-xmark trigger-icon"></i>
        ) : (
          <div className="trigger-icon-wrap">
            <i className="fa-solid fa-comment-dots trigger-icon"></i>
            <span className="trigger-mini-label">CHAT</span>
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="baskk-chat-window">
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-header-brand">
              <div className="chat-avatar-ring">
                <img src="/baskk_logo.png" alt="Baskk" className="chat-avatar-img" />
                <span className="chat-online-badge"></span>
              </div>
              <div className="chat-brand-details">
                <h3 className="chat-brand-title">Baskk Concierge</h3>
                <span className="chat-brand-status">Online • Kirra Beachfront</span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="btn-chat-header-close btn-minimize"
                onClick={handleCloseChat}
                onTouchEnd={handleCloseChat}
                aria-label="Minimize Chat"
                title="Minimize chat"
              >
                <i className="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                className="btn-chat-header-close btn-close-cross"
                onClick={handleCloseChat}
                onTouchEnd={handleCloseChat}
                aria-label="Close Chat"
                title="Close chat"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* Body / Messages List */}
          <div className="chat-window-body">
            <div className="chat-date-divider">
              <span>Baskk Virtual Host</span>
            </div>

            {messages.map((msg, index) => (
              <div key={index} className={`chat-message-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="msg-bot-avatar">
                    <img src="/baskk_logo.png" alt="B" />
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender}`}>
                  <p className="bubble-text">{msg.text}</p>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="chat-attachments-list">
                      {msg.attachments.map((att, attIdx) => (
                        <a
                          key={attIdx}
                          href={att.url}
                          download={att.downloadName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-attachment-card"
                          title={`Download ${att.title}`}
                        >
                          <div className="attachment-icon-box">
                            <i className={att.icon || 'fa-solid fa-file-pdf'}></i>
                          </div>
                          <div className="attachment-info">
                            <div className="attachment-title-row">
                              <span className="attachment-title">{att.title}</span>
                              {att.badge && <span className="attachment-badge">{att.badge}</span>}
                            </div>
                            {att.desc && <span className="attachment-desc">{att.desc}</span>}
                          </div>
                          <div className="attachment-action-icon">
                            <i className="fa-solid fa-file-arrow-down"></i>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {msg.link && (
                    <a
                      href={msg.link.url}
                      target={msg.link.external ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="bubble-action-link"
                    >
                      <span>{msg.link.label}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  )}

                  <span className="bubble-timestamp">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row bot">
                <div className="msg-bot-avatar">
                  <img src="/baskk_logo.png" alt="B" />
                </div>
                <div className="chat-bubble bot typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="chat-quick-chips-strip">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleSend(chip.query)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="chat-window-footer">
            <input
              type="text"
              className="chat-text-input"
              placeholder="Ask about table booking, menu, hours..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              type="button"
              className="btn-chat-send"
              onClick={() => handleSend()}
              disabled={!inputVal.trim()}
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .baskk-chatbot-float-root {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1100;
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        /* --- GREETING TOAST --- */
        .chat-greeting-toast {
          position: absolute;
          bottom: 74px;
          right: 0;
          background: #FFFFFF;
          border: 1.5px solid #F0CED2;
          border-radius: 14px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(36, 23, 25, 0.15);
          cursor: pointer;
          white-space: nowrap;
          animation: toastPop 0.3s ease-out;
          transition: transform 0.2s ease;
        }

        .chat-greeting-toast:hover {
          transform: translateY(-2px);
          border-color: #94181B;
        }

        .toast-avatar img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #F0CED2;
        }

        .toast-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .toast-text strong {
          font-size: 0.82rem;
          color: #241719;
        }

        .toast-text span {
          font-size: 0.72rem;
          color: #7A6265;
        }

        .btn-toast-close {
          background: none;
          border: none;
          color: #999;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 0 0 6px;
          line-height: 1;
        }

        .btn-toast-close:hover {
          color: #94181B;
        }

        /* --- TRIGGER BUTTON --- */
        .baskk-chat-trigger-btn {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #94181B 0%, #6E1214 100%);
          color: #FFFFFF;
          border: 2px solid #FFFFFF;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(148, 24, 27, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
        }

        .baskk-chat-trigger-btn:hover {
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 10px 30px rgba(148, 24, 27, 0.55);
        }

        .baskk-chat-trigger-btn.active {
          background: #241719;
          transform: rotate(90deg);
        }

        .trigger-icon-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .trigger-icon {
          font-size: 1.3rem;
          line-height: 1;
        }

        .trigger-mini-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .trigger-status-dot {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid #FFFFFF;
        }

        .trigger-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(148, 24, 27, 0.5);
          animation: pulseRing 2.4s infinite;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        /* --- CHAT WINDOW --- */
        .baskk-chat-window {
          position: absolute;
          bottom: 74px;
          right: 0;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: 520px;
          max-height: calc(100vh - 120px);
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 16px 50px rgba(36, 23, 25, 0.22);
          border: 1px solid #F0CED2;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: chatSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Header */
        .chat-window-header {
          background: linear-gradient(135deg, #241719 0%, #3E161A 100%);
          color: #FFFFFF;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-avatar-ring {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        .chat-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .chat-online-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid #241719;
        }

        .chat-brand-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0;
          color: #FFFFFF;
        }

        .chat-brand-status {
          font-size: 0.7rem;
          color: #DFCDD0;
        }

        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 7px;
          position: relative;
          z-index: 20;
        }

        .btn-chat-header-close {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-size: 0.85rem;
          padding: 0;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .btn-chat-header-close:hover {
          background: rgba(255, 255, 255, 0.38);
          transform: scale(1.08);
          color: #FFFFFF;
        }

        .btn-chat-header-close:active {
          transform: scale(0.92);
        }

        .btn-chat-header-close i {
          pointer-events: none;
          display: block;
          line-height: 1;
        }

        .btn-chat-header-close.btn-close-cross:hover {
          background: rgba(239, 68, 68, 0.7);
          border-color: rgba(239, 68, 68, 0.9);
        }

        /* Body */
        .chat-window-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #FAF6F6;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-date-divider {
          text-align: center;
          margin: 4px 0 8px 0;
        }

        .chat-date-divider span {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8C6A6F;
          background: #FFF1F3;
          padding: 3px 12px;
          border-radius: 999px;
          border: 1px solid #F0CED2;
        }

        .chat-message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }

        .chat-message-row.user {
          justify-content: flex-end;
        }

        .msg-bot-avatar img {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid #F0CED2;
          background: #FFFFFF;
        }

        .chat-bubble {
          max-width: 78%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.84rem;
          line-height: 1.45;
          position: relative;
          word-break: break-word;
        }

        .chat-bubble.bot {
          background: #FFFFFF;
          color: #241719;
          border: 1px solid #F0CED2;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .chat-bubble.user {
          background: #94181B;
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(148, 24, 27, 0.25);
        }

        .bubble-text {
          margin: 0;
          white-space: pre-line;
        }

        /* Attachments in Chat Bubble */
        .chat-attachments-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 10px;
          width: 100%;
        }

        .chat-attachment-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #FFF5F6;
          border: 1px solid #F0CED2;
          border-radius: 10px;
          text-decoration: none;
          color: #241719;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 5px rgba(148, 24, 27, 0.05);
        }

        .chat-attachment-card:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(148, 24, 27, 0.25);
        }

        .attachment-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(148, 24, 27, 0.1);
          color: #94181B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .chat-attachment-card:hover .attachment-icon-box {
          background: rgba(255, 255, 255, 0.22);
          color: #FFFFFF;
        }

        .attachment-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .attachment-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .attachment-title {
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .attachment-badge {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 1px 5px;
          border-radius: 4px;
          background: #94181B;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .chat-attachment-card:hover .attachment-badge {
          background: #FFFFFF;
          color: #94181B;
        }

        .attachment-desc {
          font-size: 0.68rem;
          opacity: 0.75;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .attachment-action-icon {
          font-size: 0.82rem;
          color: #94181B;
          flex-shrink: 0;
          padding-left: 2px;
          transition: transform 0.2s ease;
        }

        .chat-attachment-card:hover .attachment-action-icon {
          color: #FFFFFF;
          transform: translateY(1px);
        }

        .bubble-action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 6px 12px;
          background: #FFF1F3;
          color: #94181B;
          border: 1px solid #F0CED2;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .bubble-action-link:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
        }

        .bubble-timestamp {
          display: block;
          font-size: 0.62rem;
          margin-top: 4px;
          opacity: 0.7;
          text-align: right;
        }

        /* Typing Dots */
        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94181B;
          animation: dotBlink 1.4s infinite;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotBlink {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* Quick Chips */
        .chat-quick-chips-strip {
          padding: 8px 12px;
          background: #FFFFFF;
          border-top: 1px solid #F0CED2;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .chat-quick-chips-strip::-webkit-scrollbar {
          display: none;
        }

        .quick-chip-btn {
          white-space: nowrap;
          background: #FFF1F3;
          border: 1px solid #F0CED2;
          color: #94181B;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-chip-btn:hover {
          background: #94181B;
          color: #FFFFFF;
          border-color: #94181B;
        }

        /* Footer */
        .chat-window-footer {
          padding: 10px 12px;
          background: #FFFFFF;
          border-top: 1px solid #F0CED2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-text-input {
          flex: 1;
          border: 1.5px solid #F0CED2;
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 0.82rem;
          outline: none;
          color: #241719;
          transition: border-color 0.2s ease;
        }

        .chat-text-input:focus {
          border-color: #94181B;
        }

        .btn-chat-send {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #94181B;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
        }

        .btn-chat-send:hover:not(:disabled) {
          background: #731315;
          transform: scale(1.08);
        }

        .btn-chat-send:disabled {
          background: #E0C8CB;
          cursor: not-allowed;
        }

        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes toastPop {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .baskk-chatbot-float-root {
            bottom: 18px;
            right: 18px;
          }
          .baskk-chat-window {
            width: calc(100vw - 36px);
            right: 0;
            bottom: 70px;
            height: 480px;
          }
          .chat-greeting-toast {
            bottom: 68px;
          }
        }
      `}</style>
    </div>
  );
}
