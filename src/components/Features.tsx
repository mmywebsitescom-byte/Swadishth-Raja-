import React from 'react';
import './Features.css';

const Features: React.FC = () => {
  return (
    <section className="features py-4" id="about">
      <div className="container">
        <h2 className="section-title">Why Swadishth Raja?</h2>
        <p className="section-subtitle">We bring the authentic flavors of our ancestors directly to you.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>100% Pure Ingredients</h3>
            <p>Made with high-quality wheat flour, pure jaggery, and ghee, just like our grandmothers used to make.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏺</div>
            <h3>Authentic Tradition</h3>
            <p>Following the age-old, original recipes directly from the heartlands to preserve the true heritage.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Freshly Delivered</h3>
            <p>Hygienically prepared and shipped out fresh, so every bite is just as rich and crisp as it should be.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
