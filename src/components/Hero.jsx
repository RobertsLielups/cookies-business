import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import NavLink from './NavLink';
import '../styles/hero.css';

const DIR = '/media/hero/';
const PLAYBACK_RATE = 1.6;
const REVEAL_TITLE = 0.12; // fraction of the clip
const REVEAL_CTA = 0.22;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Opening animation: cookies drop in and stack into the product photo.
 * Plays once and holds its last frame (which is the photo). Poster is the empty table,
 * so there is no flash before play. Reduced motion, autoplay rejection or a load error
 * fall back to the finished-tower still.
 */
function TowerVideo({ onProgress }) {
  const ref = useRef(null);
  const [still, setStill] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.playbackRate = PLAYBACK_RATE;
    video.play().catch(() => setStill(true));
  }, []);

  if (still) {
    return <img className="hero__media" src={`${DIR}tower-desktop-tower.webp`} alt="" />;
  }
  return (
    <video
      ref={ref}
      className="hero__media"
      src={`${DIR}tower-desktop.mp4`}
      poster={`${DIR}tower-desktop-empty.webp`}
      muted
      playsInline
      preload="auto"
      onError={() => setStill(true)}
      onTimeUpdate={(event) => onProgress(event.target.currentTime / (event.target.duration || 1))}
    />
  );
}

function Hero() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const titleIn = progress >= REVEAL_TITLE;
  const ctaIn = progress >= REVEAL_CTA;

  return (
    <section id="home" className="hero">
      <div className="hero__stage" aria-hidden="true">
        <TowerVideo onProgress={setProgress} />
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <span className={`hero__eyebrow hero__reveal${titleIn ? ' is-in' : ''}`}>{t('homepage.heroEyebrow')}</span>
          <h1 className={`hero__title hero__reveal${titleIn ? ' is-in' : ''}`}>CEPUMBUMS</h1>
          <p className={`hero__description hero__reveal${ctaIn ? ' is-in' : ''}`}>{t('homepage.heroDescription')}</p>
          <div className={`hero__actions hero__reveal${ctaIn ? ' is-in' : ''}`}>
            <Link to="/products" className="btn btn--primary" tabIndex={ctaIn ? 0 : -1}>
              {t('homepage.heroCta')}
            </Link>
            <NavLink href="/#contact" className="btn btn--secondary" tabIndex={ctaIn ? 0 : -1}>
              {t('homepage.heroContact')}
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
