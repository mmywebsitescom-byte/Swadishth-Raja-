import React from 'react';
import { useSettings } from '../context/SettingsContext';

const AboutUs: React.FC = () => {
  const { aboutText } = useSettings();

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', maxWidth: '800px' }}>
      <h2 style={{ color: '#3e2723', marginBottom: '2rem' }}>About Us</h2>
      <div style={{ lineHeight: '1.6', color: '#555', whiteSpace: 'pre-wrap' }}>
        {aboutText}
      </div>
    </div>
  );
};

export default AboutUs;
