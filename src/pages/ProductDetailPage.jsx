import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { allProducts } from '../data/allProducts';
import '../styles/product-detail.css';

function ProductDetailPage() {
  const { productId } = useParams();
  const product = allProducts.find((item) => item.id === productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') setLightboxOpen(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="product-detail">
          <section className="section">
            <div className="container product-detail__not-found content-panel">
              <h1 className="section-title">Cookie not found</h1>
              <p className="section-description">
                This cookie is not currently in our collection.
              </p>
              <Link to="/products" className="btn btn--primary">
                View all cookies
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const productImages = product.images ?? [
    { src: product.image, alt: product.imageAlt },
  ];
  const activeImage = productImages[activeImageIndex] ?? productImages[0];

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
              ← Back to all cookies
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
                  onClick={() => setLightboxOpen(true)}
                  aria-label={`Open ${activeImage.alt} larger`}
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
                      aria-label="Show previous photo"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="product-detail__gallery-button"
                      onClick={showNextImage}
                      aria-label="Show next photo"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <div className="product-detail__content">
                <h1 className="section-title">{product.name}</h1>
                <p className="product-detail__description">{product.description}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {lightboxOpen && (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded product photo"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="product-lightbox__content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="product-lightbox__close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close expanded photo"
            >
              ×
            </button>
            <img src={activeImage.src} alt={activeImage.alt} />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ProductDetailPage;
