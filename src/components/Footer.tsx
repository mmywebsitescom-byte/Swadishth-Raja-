import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">Swadishth Raja</h2>
          <p>
            Bringing authenticity and pure flavor to every household. Experience the true taste of tradition.
          </p>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/return-policy">Return Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <p>📍 India</p>
          <p>📞 +91 9876543210</p>
          <p>✉️ contact@swadishthraja.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Swadishth Raja. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
