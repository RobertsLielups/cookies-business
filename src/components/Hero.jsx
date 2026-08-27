import { Link } from 'react-router-dom';
import '../styles/hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__media" aria-hidden="true">
        <img className="hero__image" src="/images/hero/cookies-tower-hero.png" alt="" />
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__eyebrow">Ģimenes konditoreja</span>
          <h1 className="hero__title">CEPUMBUMS</h1>
          <p className="hero__description">
            Baked with care.
          </p>
          <Link to="/products" className="btn btn--primary hero__cta">
            Explore our cookies 
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
