import { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/about.css';

const marketPhotos = [
  '/media/about/market-01.webp',
  '/media/about/market-02.webp',
  '/media/about/market-03.webp',
  '/media/about/market-04.webp',
  '/media/about/market-05.webp',
  '/media/about/market-06.webp',
  '/media/about/market-07.webp',
  '/media/about/market-08.webp',
];

const marketVideo = '/media/video/local-markets.mp4';

function About() {
  const galleryRef = useRef(null);
  const marketVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const { t } = useLanguage();
  const aboutStory = { headline: t('about.headline'), paragraphs: t('about.paragraphs') };

  const scrollGallery = (direction) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    // One card plus the gap; scroll-snap settles it exactly.
    gallery.scrollBy({ left: direction * (gallery.firstElementChild.offsetWidth + 16), behavior: 'smooth' });
  };

  const toggleVideoSound = () => {
    const video = marketVideoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section id="about" className="section">
      <div className="container about__grid">
        <div className="about__content">
          <header className="section-header">
            <span className="section-label">{t('about.label')}</span>
            <h2 className="section-title">{aboutStory.headline}</h2>
          </header>

          <div className="about__story">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

        </div>

        <aside className="about__markets" aria-label={t('about.marketsRegion')}>
          <div ref={galleryRef} className="about__market-gallery">
            <article className="about__market-card about__market-card--video">
              <video
                ref={marketVideoRef}
                src={marketVideo}
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />
                <div className="about__video-controls">
                  <button type="button" onClick={toggleVideoSound} aria-label={isMuted ? t('about.soundOn') : t('about.soundOff')}>
                    {isMuted ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Zm12.5 1.5 4 4m0-4-4 4" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Zm12 2c0-1.4-.8-2.6-2-3.2m4 3.2c0-2.6-1.5-4.9-3.8-6" /></svg>
                    )}
                  </button>
              </div>
            </article>
            {marketPhotos.map((photo, index) => (
              <figure className="about__market-card" key={photo}>
                <img src={photo} alt={t('about.marketPhoto', { number: index + 1 })} loading="lazy" />
              </figure>
            ))}
          </div>
          <button type="button" className="about__gallery-arrow about__gallery-arrow--prev" onClick={() => scrollGallery(-1)} aria-label={t('about.previousPhotos')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <button type="button" className="about__gallery-arrow about__gallery-arrow--next" onClick={() => scrollGallery(1)} aria-label={t('about.nextPhotos')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </aside>
      </div>

    </section>
  );
}

export default About;
