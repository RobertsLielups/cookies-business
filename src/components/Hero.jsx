import '../styles/hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__label">Family-owned since 1987</span>
          <h1 className="hero__title">
            Cookies crafted with care, baked to perfection
          </h1>
          <p className="hero__description">
            Small-batch cookies made from premium ingredients and recipes
            passed down through three generations. Taste the difference that
            handmade quality makes.
          </p>
          <div className="hero__actions">
            <a href="#products" className="btn btn--primary">
              View Our Cookies
            </a>
            <a href="#about" className="btn btn--secondary">
              Our Story
            </a>
          </div>
        </div>

        <div
          className="hero__image image-placeholder"
          role="img"
          aria-label="Assortment of freshly baked cookies"
        >
          Cookie Image
        </div>
      </div>
    </section>
  );
}

export default Hero;
