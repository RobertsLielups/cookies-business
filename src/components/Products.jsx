import { useRef } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import '../styles/products.css';

function Products() {
  const railRef = useRef(null);

  function scrollRail(direction) {
    railRef.current?.scrollBy({
      left: direction * Math.min(railRef.current.clientWidth * 0.82, 420),
      behavior: 'smooth',
    });
  }

  return (
    <section id="products" className="section">
      <div className="container">
        <header className="section-header content-panel section-header--panel">
          <span className="section-label">Our Collection</span>
          <h2 className="section-title">Cookies worth savoring</h2>
          <p className="section-description">
            Each flavor is baked in small batches using real butter, premium
            chocolate, and the patience that only a family kitchen can offer.
          </p>
        </header>

        <div className="products__rail-wrap">
          <div className="products__rail-controls" aria-label="Product carousel controls">
            <button type="button" className="products__rail-button" onClick={() => scrollRail(-1)} aria-label="Show previous cookies">←</button>
            <button type="button" className="products__rail-button" onClick={() => scrollRail(1)} aria-label="Show more cookies">→</button>
          </div>
          <div ref={railRef} className="products__rail" id="featured-products" aria-label="Featured cookies">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
