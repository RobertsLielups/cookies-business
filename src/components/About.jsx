import { useEffect, useRef, useState } from 'react';
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { t } = useLanguage();
  const aboutStory = { headline: t('about.headline'), paragraphs: t('about.paragraphs') };

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = marketVideoRef.current;
    const updatePlayback = () => {
      if (preference.matches) video?.pause();
      else video?.play().catch(() => setIsVideoPlaying(false));
    };
    updatePlayback();
    preference.addEventListener('change', updatePlayback);
    return () => preference.removeEventListener('change', updatePlayback);
  }, []);

  const scrollGallery = (direction) => {
    galleryRef.current?.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.82,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const toggleVideoPlayback = () => {
    const video = marketVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setIsVideoPlaying(false));
    } else {
      video.pause();
    }
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
          <div className="about__markets-heading">
            <div>
              <span className="section-label">{t('about.marketsLabel')}</span>
              <h3>{t('about.marketsTitle')}</h3>
              <p>{t('about.marketsDescription')}</p>
            </div>
            <div className="about__gallery-controls" aria-label={t('about.galleryControls')}>
              <button type="button" onClick={() => scrollGallery(-1)} aria-label={t('about.previousPhotos')}>←</button>
              <button type="button" onClick={() => scrollGallery(1)} aria-label={t('about.nextPhotos')}>→</button>
            </div>
          </div>

          <div ref={galleryRef} className="about__market-gallery">
            <article className="about__market-card about__market-card--video">
              <video
                ref={marketVideoRef}
                src={marketVideo}
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                poster={marketPhotos[0]}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
                <div className="about__video-controls">
                  <button type="button" onClick={toggleVideoPlayback} aria-label={isVideoPlaying ? t('about.pauseVideo') : t('about.playVideo')}>
                    {isVideoPlaying ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>
                    )}
                  </button>
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
        </aside>
      </div>

    </section>
  );
}

export default About;
