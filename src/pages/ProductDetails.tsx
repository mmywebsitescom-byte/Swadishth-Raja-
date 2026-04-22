import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ChevronRight, Star, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import Products from '../components/Products'; // For "You might also like"

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.soldOut) return;
    addToCart({
      id: typeof product.id === 'number' ? product.id : parseInt(product.id as string) || Date.now(),
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleBuyNow = () => {
    if (product.soldOut) return;
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/#products" style={{ color: 'inherit', textDecoration: 'none' }}>Products</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
          
          {/* Left Column - Image */}
          <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0d5c1', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Heart size={20} />
            </button>
            {product.soldOut && (
              <span style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#ef4444', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                Sold Out
              </span>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Swadishth Raja</span>
              <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Share2 size={20} /></button>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-color)' }}>{product.price}</span>
              {product.oldPrice && (
                <>
                  <span style={{ fontSize: '1.25rem', color: '#94a3b8', textDecoration: 'line-through' }}>{product.oldPrice}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    Save!
                  </span>
                </>
              )}
            </div>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#22c55e', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, gap: '0.2rem' }}>
                4.8 <Star size={14} fill="white" />
              </div>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(128 ratings & reviews)</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />

            {/* Size/Weight Variant */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Size / Amount</span>
                <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem', cursor: 'pointer' }}>Size Chart</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{ padding: '0.6rem 1.5rem', borderRadius: '6px', border: '2px solid var(--accent-color)', backgroundColor: 'var(--accent-color)', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' }}>
                  {product.weight || 'Standard'}
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 500, color: '#1e293b' }}
                >
                  Product Details
                  {detailsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {detailsOpen && (
                  <div style={{ paddingBottom: '1.25rem', color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                    {product.description || 'Authentic, homemade preparation following traditional regional recipes. Made with premium, handpicked ingredients without any artificial preservatives. Delivered fresh to preserve the true "Shuddh Swad".'}
                  </div>
                )}
              </div>
              
              <div style={{ borderBottom: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => setShippingOpen(!shippingOpen)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 500, color: '#1e293b' }}
                >
                  Shipping & Returns
                  {shippingOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {shippingOpen && (
                  <div style={{ paddingBottom: '1.25rem', color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Standard shipping takes 3-5 business days. Since these are freshly prepared food items, we do not accept returns. However, if your order arrives damaged, please contact us within 24 hours for a replacement.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                onClick={handleAddToCart}
                disabled={product.soldOut}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--accent-color)', 
                  backgroundColor: 'white', 
                  color: 'var(--accent-color)', 
                  fontWeight: 600, 
                  fontSize: '1.05rem',
                  cursor: product.soldOut ? 'not-allowed' : 'pointer',
                  opacity: product.soldOut ? 0.5 : 1
                }}
              >
                {product.soldOut ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.soldOut}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  border: 'none', 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'var(--text-dark)', 
                  fontWeight: 600, 
                  fontSize: '1.05rem',
                  cursor: product.soldOut ? 'not-allowed' : 'pointer',
                  opacity: product.soldOut ? 0.5 : 1
                }}
              >
                {product.soldOut ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Related Products */}
      <div style={{ backgroundColor: 'white', paddingTop: '4rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#3e2723', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
            You Might Also Like
          </h2>
        </div>
        <Products />
      </div>
    </div>
  );
};

export default ProductDetails;
