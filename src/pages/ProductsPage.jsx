import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { allProducts } from '../data/allProducts';
import '../styles/products.css';
import '../styles/products-page.css';

function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="products-page section">
          <div className="container">
            <header className="section-header">
              <span className="section-label">Our Collection</span>
              <h1 className="section-title">All our cookies</h1>
              <p className="section-description">
                Browse our full range of handcrafted cookies — each one baked in
                small batches with premium ingredients and family recipes.
              </p>
            </header>

            <div className="products__grid">
              {allProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductsPage;
