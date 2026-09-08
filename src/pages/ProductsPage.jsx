import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { allProducts, getLocalizedProduct } from '../data/allProducts';
import { useLanguage } from '../context/LanguageContext';
import '../styles/products-page.css';

function ProductsPage() {
  const { language, t } = useLanguage();
  return (
    <>
      <Header />
      <main>
        <section className="products-page">
          <div className="container products-page__head">
            <span className="section-label">{t('products.pageLabel')}</span>
            <h1 className="section-title">{t('products.pageTitle')}</h1>
            <p className="section-description">
              {t('products.pageDescription')}
            </p>
          </div>

          <div className="container products-page__tiles">
            {allProducts.map((product) => {
              const { id, name, image, imageAlt } = getLocalizedProduct(product, language);
              return (
                <Link key={id} to={`/products/${id}`} className="product-tile">
                  <img src={image} alt={imageAlt} loading="lazy" />
                  <span className="product-tile__name">{name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductsPage;
