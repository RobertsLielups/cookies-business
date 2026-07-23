import { products } from '../data/products';
import ProductCard from './ProductCard';
import '../styles/products.css';

function Products() {
  return (
    <section id="products" className="section">
      <div className="container">
        <header className="section-header">
          <span className="section-label">Our Collection</span>
          <h2 className="section-title">Cookies worth savoring</h2>
          <p className="section-description">
            Each flavor is baked in small batches using real butter, premium
            chocolate, and the patience that only a family kitchen can offer.
          </p>
        </header>

        <div className="products__grid">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
