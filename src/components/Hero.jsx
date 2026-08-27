import { Link } from 'react-router-dom';
import '../styles/hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__eyebrow">Ģimenes konditoreja</span>
          <h1 className="hero__title">
            Cepum<span className="hero__title-break"><br /></span>bums
          </h1>
          <p className="hero__description">
            Handmade cookies,<br />
            baked with care.
          </p>
          <Link to="/products" className="btn btn--primary hero__cta">
            Explore our cookies 
          </Link>
        </div>
        <div className="hero__media">
          <img className="hero__image" src="/images/hero/Cookies_tower-white.png" alt="A tower of handmade cookies dusted with sugar" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
