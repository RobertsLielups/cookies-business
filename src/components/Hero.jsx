import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/hero.css';

function Hero({ variant = 'A' }) {
  const { t, language } = useLanguage();
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const cinematic = variant === 'B';
  const playful = variant === 'C';
  const poster = cinematic ? '/media/hero/cookie-cinema.webp' : '/media/hero/cookie-still-life.webp';

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (preference.matches || document.hidden || userPaused.current) video.pause();
      else video.play().catch(() => setIsPlaying(false));
    };
    updatePlayback();
    preference.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      preference.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
    };
  }, [variant]);

  function togglePlayback() {
    const video = videoRef.current;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }

  return (
    <section id="home" className="hero">
      <div className={`hero__media${videoReady ? ' hero__media--ready' : ''}`} aria-hidden="true">
        <picture>
          <source media="(max-width: 700px)" srcSet={cinematic ? '/media/hero/cookie-cinema-mobile.webp' : '/media/hero/cookie-still-life-mobile.webp'} />
          <img className="hero__image" src={poster} alt="" fetchPriority="high" />
        </picture>
        <video
          key={variant}
          ref={videoRef}
          className="hero__video"
          loop muted playsInline preload="metadata" poster={poster}
          onLoadedData={() => setVideoReady(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => { setVideoReady(false); setIsPlaying(false); }}
        >
          <source media="(max-width: 700px)" src={cinematic ? '/media/hero/cookie-cinema-mobile.mp4' : '/media/hero/cookie-stack-mobile.mp4'} type="video/mp4" />
          <source src={cinematic ? '/media/hero/cookie-cinema.mp4' : '/media/hero/cookie-stack.mp4'} type="video/mp4" />
        </video>
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__eyebrow"><span aria-hidden="true">✳</span>{t('homepage.heroEyebrow')}</span>
          <h1 className="hero__title">{playful ? (language === 'lv' ? 'Mazs cepums. Liels prieks.' : 'Little cookies. Big joy.') : 'Cepumbums'}</h1>
          <p className="hero__description">{playful ? (language === 'lv' ? 'Ar rokām gatavoti. Ar mīlestību cepti. Radīti, lai dalītos.' : 'Handmade. Baked with love. Made to be shared.') : t('homepage.heroDescription')}</p>
          <Link to={`/products?variant=${variant}`} className="btn hero__cta">
            {t('homepage.heroCta')}<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero__bottom">
          <a className="hero__scroll" href="#about"><span aria-hidden="true">↓</span>{t('navigation.about')}</a>
          <span className="hero__signature" aria-hidden="true">CEPUMBUMS · 2012</span>
          <button className="hero__playback" type="button" onClick={togglePlayback} aria-label={isPlaying ? t('about.pauseVideo') : t('about.playVideo')} disabled={!videoReady}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{isPlaying ? <path d="M8 5v14M16 5v14" /> : <path d="m8 5 11 7-11 7V5Z" />}</svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
