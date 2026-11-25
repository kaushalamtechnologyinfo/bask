import React, { useState } from 'react';

export default function OrderModal({ isOpen, onClose, onSuccess }) {
  const [orderType, setOrderType] = useState('pickup');
  const [addedItems, setAddedItems] = useState({});
  const [pickupTime, setPickupTime] = useState('ASAP (Approx 20-30 mins)');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (id) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
  };

  const handleProceed = () => {
    const orderId = `BASKK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const savedSheetUrl = localStorage.getItem('baskk_google_sheet_webapp_url') || '';
    const favMap = {
      1: 'Pappardelle Ragù di Agnello ($34)',
      2: 'Margherita DOC Pizza ($26)',
      3: 'Coolangatta Sunset Spritz ($20)'
    };
    const selectedFavorites = Object.keys(addedItems)
      .filter(k => addedItems[k] && favMap[k])
      .map(k => favMap[k])
      .join(', ') || 'Online Menu Selection';

    try {
      const prev = JSON.parse(localStorage.getItem('baskk_orders_ledger_v1') || '[]');
      localStorage.setItem('baskk_orders_ledger_v1', JSON.stringify([{
        orderId,
        createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        orderType: orderType === 'pickup' ? 'Takeaway Pickup Order' : 'Order at Table',
        status: 'New',
        customerName: 'Online Order Guest',
        email: 'Not provided',
        phone: phone || 'Not provided',
        guests: '1 Order',
        bookingDate: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        bookingTime: pickupTime,
        eventType: orderType === 'pickup' ? 'Takeaway Pickup' : 'Order at Table',
        seatingArea: orderType === 'pickup' ? 'Pickup Counter' : 'Dine-In Table',
        menuPreference: selectedFavorites,
        additionalDetails: `Redirected to HungryHungry checkout (${pickupTime})`,
        adminNotes: ''
      }, ...prev]));
    } catch (_) {}

    fetch('/api/booking-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        orderId,
        orderType: orderType === 'pickup' ? 'Takeaway Pickup Order' : 'Order at Table',
        customerName: 'Online Order Guest',
        email: 'Not provided',
        phone: phone || 'Not provided',
        guests: '1',
        bookingDate: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        bookingTime: pickupTime,
        eventType: orderType === 'pickup' ? 'Takeaway Pickup' : 'Order at Table',
        seatingArea: orderType === 'pickup' ? 'Pickup Counter' : 'Dine-In Table',
        menuPreference: selectedFavorites,
        additionalDetails: `Redirected to HungryHungry checkout (${pickupTime})`,
        sheetsWebhookUrl: savedSheetUrl
      })
    }).catch(() => {});

    window.open('https://storefront.hungryhungry.com/baskkitalian-pickup/menu', '_blank');
    onSuccess('Order Initiated', 'Redirecting to Baskk Online Takeaway Menu...');
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <img src="/baskk_logo.png" alt="Baskk" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>
          <h2>Order Online for Takeaway & Pickup</h2>
          <p>Enjoy Baskk in the comfort of your home or beach setup.</p>
        </div>
        
        <div className="order-type-picker">
          <button 
            className={`order-type-btn ${orderType === 'pickup' ? 'active' : ''}`}
            onClick={() => setOrderType('pickup')}
          >
            <i className="fa-solid fa-bag-shopping"></i> Takeaway Pickup
          </button>
          <button 
            className={`order-type-btn ${orderType === 'dine' ? 'active' : ''}`}
            onClick={() => setOrderType('dine')}
          >
            <i className="fa-solid fa-utensils"></i> Order at Table
          </button>
        </div>

        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleProceed(); }}>
          <div className="form-group">
            <label>Pickup Location</label>
            <input type="text" value="52–58 Marine Parade, Coolangatta, QLD 4225, Australia" className="form-control" disabled />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Estimated Pickup Time</label>
              <select className="form-control" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                <option>ASAP (Approx 20-30 mins)</option>
                <option>Today at 6:00 PM</option>
                <option>Today at 7:00 PM</option>
                <option>Today at 8:00 PM</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Your Contact Number</label>
              <input type="tel" placeholder="0400 000 000" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="order-summary-box">
            <h4>Quick Select Favorites</h4>
            {[
              { id: 1, name: 'Pappardelle Ragù di Agnello ($34)' },
              { id: 2, name: 'Margherita DOC Pizza ($26)' },
              { id: 3, name: 'Coolangatta Sunset Spritz ($20)' }
            ].map(item => (
              <div className="quick-item" key={item.id}>
                <span>{item.name}</span>
                <button 
                  type="button" 
                  className="btn-add"
                  style={addedItems[item.id] ? { backgroundColor: '#e8f5e9', color: '#2e7d32' } : {}}
                  onClick={() => handleAddItem(item.id)}
                >
                  {addedItems[item.id] ? '✓ Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <i className="fa-solid fa-arrow-right"></i> Proceed to Checkout Menu
          </button>
        </form>
      </div>
    </div>
  );
}
