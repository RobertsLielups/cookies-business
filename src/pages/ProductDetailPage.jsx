import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import StoreAvailabilityMap from '../components/StoreAvailabilityMap';
import { allProducts, getLocalizedProduct } from '../data/allProducts';
import { getAvailableStoresForProduct } from '../data/stores';
import { useLanguage } from '../context/LanguageContext';
import '../styles/product-detail.css';

function getMapsUrl({ latitude, longitude, address, city }) {
  const location =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `${latitude},${longitude}`
      : `${address}, ${city}`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(value);
}

function ProductDetailPage() {
  const { productId } = useParams();
  // Slug is canonical; the old name-based id keeps existing links working.
  const sourceProduct = allProducts.find((item) => item.slug === productId || item.id === productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const lightboxRef = useRef(null);
  const { language, t } = useLanguage();

  if (!sourceProduct) {
    return (
      <>
        <Header />
        <main className="product-detail">
          <section className="section">
            <div className="container product-detail__not-found">
              <h1 className="section-title">{t('productDetail.notFoundTitle')}</h1>
              <p className="section-description">
                {t('productDetail.notFoundDescription')}
              </p>
              <Link to="/products" className="btn btn--primary">
                {t('productDetail.viewAll')}
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const product = getLocalizedProduct(sourceProduct, language);
  const productImages = product.images ?? [
    { src: product.image, alt: product.imageAlt },
  ];
  const activeImage = productImages[activeImageIndex] ?? productImages[0];
  const availableStores = getAvailableStoresForProduct(product.id);
  const mappableStores = availableStores.filter(
    ({ latitude, longitude }) => Number.isFinite(latitude) && Number.isFinite(longitude),
  );
  const { details } = product;
  const nutritionRows = details
    ? [
        {
          label: t('productDetails.energy'),
          value: details.nutrition.energyKj != null && details.nutrition.energyKcal != null
            ? `${formatNumber(details.nutrition.energyKj, language)} kJ · ${formatNumber(details.nutrition.energyKcal, language)} kcal`
            : null,
        },
        { label: t('productDetails.fat'), value: details.nutrition.fatG },
        { label: t('productDetails.saturates'), value: details.nutrition.saturatesG },
        { label: t('productDetails.carbohydrate'), value: details.nutrition.carbsG },
        { label: t('productDetails.sugars'), value: details.nutrition.sugarsG },
        { label: t('productDetails.protein'), value: details.nutrition.proteinG },
        { label: t('productDetails.salt'), value: details.nutrition.saltG },
      ].filter((row) => row.value != null)
    : [];

  function showPreviousImage() {
    setActiveImageIndex(
      (currentIndex) =>
        (currentIndex - 1 + productImages.length) % productImages.length,
    );
  }

  function showNextImage() {
    setActiveImageIndex(
      (currentIndex) => (currentIndex + 1) % productImages.length,
    );
  }

  return (
    <>
      <Header />
      <main className="product-detail">
        <section className="section product-detail__section">
          <div className="container">
            <Link to="/products" className="product-detail__back">
              ← {t('productDetail.backToProducts')}
            </Link>

            <div
              className={`product-detail__grid${product.imageLayout === 'portrait' ? ' product-detail__grid--portrait' : ''}`}
            >
              <div
                className={`product-detail__gallery${product.imageLayout === 'portrait' ? ' product-detail__gallery--portrait' : ''}`}
              >
                <button
                  type="button"
                  className="product-detail__image-trigger"
                  onClick={() => lightboxRef.current?.showModal()}
                  aria-label={t('productDetail.openImage', { name: activeImage.alt })}
                >
                  <img
                    className={`product-detail__image${product.imageLayout === 'portrait' ? ' product-detail__image--portrait' : ''}`}
                    src={activeImage.src}
                    alt={activeImage.alt}
                  />
                </button>
                {productImages.length > 1 && (
                  <div className="product-detail__gallery-controls">
                    <button
                      type="button"
                      className="product-detail__gallery-button"
                      onClick={showPreviousImage}
                      aria-label={t('productDetail.previousImage')}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      className="product-detail__gallery-button"
                      onClick={showNextImage}
                      aria-label={t('productDetail.nextImage')}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="product-detail__content">
                <header className="product-detail__summary">
                  <span className="section-label">{t('products.pageLabel')}</span>
                  <h1 className="section-title">{product.name}</h1>
                  {product.description && (
                    <p className="product-detail__description">{product.description}</p>
                  )}
                </header>
                <section className="product-facts" aria-label={t('productDetails.nutrition')}>
                  {!details || details.sourceConfidence === 'missing' ? (
                    <p className="product-facts__empty">{t('productDetails.comingSoon')}</p>
                  ) : (
                    <div className="product-facts__grid">
                      {language === 'lv' && details.storyLv && (
                        <div className="product-facts__story">
                          <span className="section-label">{t('productDetails.story')}</span>
                          <p>{details.storyLv}</p>
                        </div>
                      )}
                      {details.ingredientsLv && (
                        <div className="product-facts__block">
                          <h2>{t('productDetails.ingredients')}</h2>
                          <p lang="lv">{details.ingredientsLv}</p>
                        </div>
                      )}
                      {details.netWeightG != null && (
                        <div className="product-facts__block">
                          <h2>{t('productDetails.netWeight')}</h2>
                          <p>{formatNumber(details.netWeightG, language)} g</p>
                        </div>
                      )}
                      {nutritionRows.length > 0 && (
                        <div className="product-facts__nutrition">
                          <h2>{t('productDetails.nutrition')}</h2>
                          <dl>
                            {nutritionRows.map((row) => (
                              <div key={row.label}>
                                <dt>{row.label}</dt>
                                <dd>{typeof row.value === 'number'
                                  ? `${formatNumber(row.value, language)} g`
                                  : row.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  )}
                </section>

              </div>
            </div>

            <section className="product-availability" aria-labelledby="where-to-buy-title">
              <header className="product-availability__header">
                <h2 id="where-to-buy-title" className="product-availability__title">
                  {t('availability.title')}
                </h2>
                <p className="product-availability__intro">{t('availability.intro')}</p>
              </header>

              {availableStores.length > 0 ? (
                <div className={`product-availability__content${mappableStores.length ? '' : ' product-availability__content--list-only'}`}>
                  <ul className="product-availability__list">
                    {availableStores.map((store) => (
                      <li key={store.id} className="product-availability__store">
                        <div className="product-availability__store-details">
                          <h3>{store.name}</h3>
                          <address>
                            {store.address}
                            <br />
                            {store.city}
                          </address>
                          <span className={`product-availability__status product-availability__status--${store.status}`}>
                            <span aria-hidden="true" className="product-availability__status-dot" />
                            {store.status === 'available'
                              ? t('availability.available')
                              : t('availability.lowStock')}
                          </span>
                        </div>
                        <a
                          className="product-availability__maps-link"
                          href={getMapsUrl(store)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t('availability.openInMaps')} →
                        </a>
                      </li>
                    ))}
                  </ul>
                  {mappableStores.length > 0 && <StoreAvailabilityMap stores={mappableStores} />}
                </div>
              ) : (
                <p className="product-availability__empty">{t('availability.empty')}</p>
              )}
            </section>
          </div>
        </section>
      </main>
      {/* Native dialog: Escape closes it; a click on the backdrop (the dialog itself, not its child) closes it too. */}
      <dialog
        ref={lightboxRef}
        className="product-lightbox"
        aria-label={t('productDetail.openImage', { name: activeImage.alt })}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        <img src={activeImage.src} alt={activeImage.alt} />
      </dialog>
      <Footer />
    </>
  );
}

export default ProductDetailPage;
