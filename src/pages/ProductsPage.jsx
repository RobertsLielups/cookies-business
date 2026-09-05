import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { allProducts, getLocalizedProduct } from '../data/allProducts';
import { useLanguage } from '../context/LanguageContext';
import '../styles/products.css';
import '../styles/products-page.css';

function ProductsPage() {
  const { language, t } = useLanguage();
  return (
    <>
      <Header />
      <main>
        <section className="products-page section">
          <div className="container">
            <header className="section-header">
              <span className="section-label">{t('products.pageLabel')}</span>
              <h1 className="section-title">{t('products.pageTitle')}</h1>
              <p className="section-description">
                {t('products.pageDescription')}
              </p>
            </header>

            <div className="products__grid">
              {allProducts.map((product) => (
                <ProductCard key={product.id} {...getLocalizedProduct(product, language)} />
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
