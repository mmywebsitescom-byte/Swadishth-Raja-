import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { User, ShoppingCart } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src="/src/assets/logo.png" alt="Swadishth Raja Logo" className="logo-img" />
          <span className="logo-text">Swadishth Raja</span>
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="/#products" onClick={() => setIsOpen(false)}>Products</a>
          <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <button className="btn outline" style={{ gap: '0.5rem' }} onClick={() => { navigate('/profile'); setIsOpen(false); }}>
              <User size={20} /> Profile
            </button>
          ) : (
            <button className="btn outline" style={{ gap: '0.5rem' }} onClick={() => { navigate('/auth'); setIsOpen(false); }}>
              <User size={20} /> Sign In
            </button>
          )}
          <button className="btn outline cart-btn" style={{ gap: '0.5rem' }} onClick={() => { navigate('/cart'); setIsOpen(false); }}>
            <ShoppingCart size={20} /> Cart {totalItems > 0 && `(${totalItems})`}
          </button>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
