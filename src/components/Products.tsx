import React from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import './Products.css';

const Products: React.FC = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  return (
    <section className="products py-4" id="products">
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '2.5rem', color: '#3e2723', fontWeight: 400 }}>Products</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <div>
            <span>Filter: </span>
            <span style={{ marginRight: '1.5rem', cursor: 'pointer' }}>Availability v</span>
            <span style={{ cursor: 'pointer' }}>Price v</span>
          </div>
          <div>
            <span style={{ marginRight: '1.5rem' }}>Sort by: <span style={{ cursor: 'pointer' }}>Alphabetically, A-Z v</span></span>
            <span>{products.length} products</span>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-img-wrapper">
                  <img src={product.image} alt={product.name} />
                  {product.soldOut && <span className="badge">Sold out</span>}
                </div>
                <h3 className="product-title">{product.name}</h3>
              </Link>
              <div className="product-info">
                {product.weight && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '-0.5rem 0 0.5rem 0' }}>{product.weight}</p>}
                <div className="product-pricing">
                  {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                  <span className="price">{product.price}</span>
                </div>
                <button 
                  className="btn outline-btn full-width" 
                  onClick={() => !product.soldOut && addToCart({
                    id: typeof product.id === 'number' ? product.id : parseInt(product.id as string) || Date.now(),
                    name: product.name,
                    price: product.price,
                    image: product.image
                  })}
                  disabled={product.soldOut}
                >
                  {product.soldOut ? 'Sold out' : 'Add to cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
