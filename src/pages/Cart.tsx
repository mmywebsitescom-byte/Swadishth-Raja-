import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleProceed = () => {
    if (!user) {
      alert("Please sign in to place an order.");
      navigate('/auth');
      return;
    }
    setShowAddressForm(true);
  };

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address to place your order.");
      return;
    }

    setIsCheckingOut(true);

    // Simulate network delay
    setTimeout(() => {
      // Create order string from items
      const itemsString = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
      
      addOrder({
        date: new Date().toISOString().split('T')[0],
        customerName: user!.name,
        total: totalPrice,
        status: 'Processing',
        items: itemsString,
        address: shippingAddress
      });

      clearCart();
      setIsCheckingOut(false);
      alert("Order placed successfully! You can track it in your profile.");
      navigate('/profile'); // or wherever makes sense, e.g., a success page
    }, 1000);
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <p>Your cart is currently empty.</p>
          <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: '1rem' }}>Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>{item.price}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  style={{ width: '60px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <button onClick={() => removeFromCart(item.id)} className="btn outline" style={{ padding: '0.5rem 1rem' }}>Remove</button>
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <div style={{ textAlign: 'right', minWidth: '300px' }}>
              <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
              
              {!showAddressForm ? (
                <button 
                  className="btn" 
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={handleProceed}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div style={{ marginTop: '1rem', textAlign: 'left', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shipping Address (Required)</label>
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full address..."
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn outline" 
                      style={{ flex: 1 }}
                      onClick={() => setShowAddressForm(false)}
                      disabled={isCheckingOut}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn" 
                      style={{ flex: 1, opacity: isCheckingOut ? 0.7 : 1 }}
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !shippingAddress.trim()}
                    >
                      {isCheckingOut ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
