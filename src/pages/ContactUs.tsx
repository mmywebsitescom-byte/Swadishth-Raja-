import React from 'react';
import { useSettings } from '../context/SettingsContext';

const ContactUs: React.FC = () => {
  const { contactAddress, contactPhone, contactEmail } = useSettings();

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', maxWidth: '800px' }}>
      <h2 style={{ color: '#3e2723', marginBottom: '2rem' }}>Contact Us</h2>
      <div style={{ lineHeight: '1.6', color: '#555', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <p style={{ marginBottom: '1rem' }}>
            We'd love to hear from you! Whether you have a question about our products, need help with an order, or just want to share your feedback, feel free to reach out to us.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0d5c1' }}>
            <h3 style={{ color: '#3e2723', marginBottom: '0.5rem' }}>Visit Us</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{contactAddress}</p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0d5c1' }}>
            <h3 style={{ color: '#3e2723', marginBottom: '0.5rem' }}>Call Us</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{contactPhone}</p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0d5c1' }}>
            <h3 style={{ color: '#3e2723', marginBottom: '0.5rem' }}>Email Us</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{contactEmail}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
