import React from 'react';

const ReturnPolicy: React.FC = () => {
  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', maxWidth: '800px' }}>
      <h2 style={{ color: '#3e2723', marginBottom: '2rem' }}>Return Policy</h2>
      <div style={{ lineHeight: '1.6', color: '#555' }}>
        <p style={{ marginBottom: '1rem' }}>
          At Swadishth Raja, we ensure that every product meets the highest standards of quality and authenticity. Due to the perishable nature of our handmade food products, we have a strict return policy.
        </p>
        <h3 style={{ color: '#3e2723', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Returns</h3>
        <p style={{ marginBottom: '1rem' }}>
          We only accept returns if the product received is damaged, defective, or incorrect. If you encounter such an issue, please notify us within 24 hours of delivery.
        </p>
        <h3 style={{ color: '#3e2723', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Refunds</h3>
        <p style={{ marginBottom: '1rem' }}>
          Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 5-7 business days to your original method of payment.
        </p>
        <h3 style={{ color: '#3e2723', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Exchanges</h3>
        <p style={{ marginBottom: '1rem' }}>
          We only replace items if they are defective or damaged during transit. Contact us at contact@swadishthraja.com to request an exchange.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
