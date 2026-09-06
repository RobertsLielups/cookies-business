// PROTOTYPE — throwaway. "Tower Drop" hero: cookies fall and stack into the real product photo.
// A = wide re-render full-bleed (cover). All others = the whole frame simply FIT (contain) into the hero, no fades.
// Switch via ?variant=A|B|C|D on "/". See NOTES.md next to this file.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PrototypeSwitcher, { useVariant } from './PrototypeSwitcher';
import '../styles/hero-prototype.css';

const DIR = '/media/hero/prototype/';
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Plays once and holds its last frame (= the product photo). Poster = empty table, so no flash. */
function TowerVideo({ id, rate, onProgress }) {
  const ref = useRef(null);
  const [o] = useState(() => (isMobile() ? 'mobile' : 'desktop')); // ponytail: decided once at mount
  const [still, setStill] = useState(() => reduced());
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = rate;
    v.play().catch(() => setStill(true));
  }, [rate]);
  if (still) return <img className="proto-hero__media" src={`${DIR}${id}-${o}-tower.webp`} alt="" />;
  return (
    <video ref={ref} className="proto-hero__media" muted playsInline preload="auto"
      src={`${DIR}${id}-${o}.mp4`} poster={`${DIR}${id}-${o}-empty.webp`}
      onError={() => setStill(true)}
      onTimeUpdate={(e) => onProgress(e.target.currentTime / (e.target.duration || 1))} />
  );
}

function TowerHero({ t, video, variant, rate = 1.6, revealAt = [0.12, 0.22] }) { // ponytail: 1.6× → 7–8 s clips play in ~4.5–5 s; copy in at ~0.6 s
  const [p, setP] = useState(0);
  const titleIn = p >= revealAt[0];
  const ctaIn = p >= revealAt[1];
  return (
    <section id="home" className={`hero proto-hero proto-hero--${variant}`}>
      <div className="container proto-hero__grid">
        <div className="proto-hero__content">
          <span className={`hero__eyebrow proto-reveal ${titleIn ? 'is-in' : ''}`}>{t('homepage.heroEyebrow')}</span>
          <h1 className={`hero__title proto-reveal ${titleIn ? 'is-in' : ''}`}>CEPUMBUMS</h1>
          <p className={`hero__description proto-reveal ${ctaIn ? 'is-in' : ''}`}>{t('homepage.heroDescription')}</p>
          <Link to="/products" className={`btn btn--primary hero__cta proto-reveal ${ctaIn ? 'is-in' : ''}`} tabIndex={ctaIn ? 0 : -1}>
            {t('homepage.heroCta')}
          </Link>
        </div>
        <div className="proto-hero__stage" aria-hidden="true">
          <TowerVideo id={video} rate={rate} onProgress={setP} />
        </div>
      </div>
    </section>
  );
}

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
const NAMES = {
  A: 'WIDE re-render · full-bleed cover (no fade)',
  B: 'WIDE re-render · simply fit (whole frame contained, no fade)',
  C: 'Studio original · fit',
  D: 'Cocoa · fit',
  E: 'Plate rosette · fit',
  F: 'Floating cascade · fit',
};

function HeroPrototype() {
  const { t } = useLanguage();
  const [variant, go] = useVariant(KEYS);
  return (
    <>
      {variant === 'A' && <TowerHero key="A" video="w" variant="a" t={t} />}
      {variant === 'B' && <TowerHero key="B" video="w" variant="b" t={t} />}
      {variant === 'C' && <TowerHero key="C" video="a" variant="c" t={t} />}
      {variant === 'D' && <TowerHero key="D" video="b" variant="d" t={t} />}
      {variant === 'E' && <TowerHero key="E" video="e" variant="e" t={t} />}
      {variant === 'F' && <TowerHero key="F" video="f" variant="f" t={t} />}
      <PrototypeSwitcher keys={KEYS} names={NAMES} current={variant} go={go} />
    </>
  );
}

export default HeroPrototype;
