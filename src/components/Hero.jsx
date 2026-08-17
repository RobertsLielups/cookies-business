import { Link } from 'react-router-dom';
import '../styles/hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <img
        className="hero__image"
        src="/images/hero/Cookies_tower.png"
        alt="A tower of handmade cookies dusted with sugar"
      />
      <div className="container hero__grid">
        <div className="hero__content">
          <h1 className="hero__title">Cepumbums</h1>
          <p className="hero__description">
            Handmade cookies,<br />
            baked with care.
          </p>
          <Link to="/products" className="btn btn--primary hero__cta">
            Explore our cookies <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
