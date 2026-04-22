import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import './Hero.css';

const Hero: React.FC = () => {
  const { heroTitle, heroSubtitle, heroImages } = useSettings();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!heroImages || heroImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages]);

  const currentImage = heroImages && heroImages.length > 0 
    ? heroImages[currentImageIndex] 
    : '/images/hero_bg.png';

  return (
    <section 
      className="hero" 
      id="home"
      style={{ backgroundImage: `url('${currentImage}')` }}
    >
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-title">{heroTitle}</h1>
        <p className="hero-subtitle">
          {heroSubtitle}
        </p>
        <div className="hero-actions">
          <a href="/#products" className="btn hero-btn">Explore Menu</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
