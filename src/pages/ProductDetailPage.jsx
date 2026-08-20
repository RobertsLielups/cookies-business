import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { allProducts } from '../data/allProducts';
import '../styles/product-detail.css';

const purchaseOptions = [
  { value: 'box-6', label: 'Box of 6', description: 'A small box for enjoying now.' },
  { value: 'box-12', label: 'Box of 12', description: 'A generous box to share.' },
  { value: 'box-24', label: 'Box of 24', description: 'Our party-size cookie box.' },
];

function ProductDetailPage() {
  const { productId } = useParams();
  const product = allProducts.find((item) => item.id === productId);
  const [selectedOption, setSelectedOption] = useState('box-6');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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

  function handleSubmit(event) {
    event.preventDefault();
    setAdded(true);
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

            <div className="product-detail__grid">
              <img
                className="product-detail__image"
                src={product.image}
                alt={product.imageAlt}
              />

              <div className="product-detail__content">
                <h1 className="section-title">{product.name}</h1>
                <p className="product-detail__description">{product.description}</p>

                <form className="product-detail__purchase" onSubmit={handleSubmit}>
                  <fieldset>
                    <legend>Choose your box</legend>
                    <div className="product-detail__options">
                      {purchaseOptions.map((option) => (
                        <label
                          className="product-detail__option"
                          key={option.value}
                        >
                          <input
                            type="radio"
                            name="box-size"
                            value={option.value}
                            checked={selectedOption === option.value}
                            onChange={() => {
                              setSelectedOption(option.value);
                              setAdded(false);
                            }}
                          />
                          <span>
                            <strong>{option.label}</strong>
                            <small>{option.description}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="product-detail__quantity" htmlFor="quantity">
                    Quantity
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(Math.max(1, Number(event.target.value) || 1));
                        setAdded(false);
                      }}
                    />
                  </label>

                  <button type="submit" className="btn btn--primary">
                    Add to order
                  </button>
                  {added && (
                    <p className="product-detail__confirmation" role="status">
                      {quantity} {selectedOption.replace('box-', 'box of ')} added to your order.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetailPage;
