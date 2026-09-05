import { useRef } from 'react';
import { products } from '../data/products';
import { getLocalizedProduct } from '../data/allProducts';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import '../styles/products.css';

function Products() {
  const railRef = useRef(null);
  const { language, t } = useLanguage();

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
          <span className="section-label">{t('homepage.collectionLabel')}</span>
          <h2 className="section-title">{t('homepage.collectionTitle')}</h2>
          <p className="section-description">
            {t('homepage.collectionDescription')}
          </p>
        </header>

        <div className="products__rail-wrap">
          <div className="products__rail-controls" aria-label={t('homepage.carouselControls')}>
            <button type="button" className="products__rail-button" onClick={() => scrollRail(-1)} aria-label={t('homepage.previousCookies')}>←</button>
            <button type="button" className="products__rail-button" onClick={() => scrollRail(1)} aria-label={t('homepage.nextCookies')}>→</button>
          </div>
          <div ref={railRef} className="products__rail" id="featured-products" aria-label={t('homepage.featuredCookies')}>
            {products.map((product) => (
              <ProductCard key={product.id} {...getLocalizedProduct(product, language)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
