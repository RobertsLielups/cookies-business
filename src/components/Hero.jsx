import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/hero.css';

function Hero() {
  const { t } = useLanguage();
  return (
    <section id="home" className="hero">
      <div className="hero__media" aria-hidden="true">
        <img className="hero__image" src="/media/hero/cookies-tower.webp" alt="" />
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__eyebrow">{t('homepage.heroEyebrow')}</span>
          <h1 className="hero__title">CEPUMBUMS</h1>
          <p className="hero__description">
            {t('homepage.heroDescription')}
          </p>
          <Link to="/products" className="btn btn--primary hero__cta">
            {t('homepage.heroCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
