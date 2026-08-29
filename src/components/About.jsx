import { useRef, useState } from 'react';
import { aboutStory } from '../data/company';
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const scrollGallery = (direction) => {
    galleryRef.current?.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  const toggleVideoPlayback = () => {
    const video = marketVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
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
            <span className="section-label">About Us</span>
            <h2 className="section-title">{aboutStory.headline}</h2>
          </header>

          <div className="about__story">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

        </div>

        <aside className="about__markets" aria-label="Cepumbums at local markets and fairs">
          <div className="about__markets-heading">
            <div>
              <span className="section-label">Meet us in person</span>
              <h3>Local markets &amp; fairs</h3>
              <p>We are also selling our products at local markets and fairs.</p>
            </div>
            <div className="about__gallery-controls" aria-label="Market gallery controls">
              <button type="button" onClick={() => scrollGallery(-1)} aria-label="Show previous market photos">←</button>
              <button type="button" onClick={() => scrollGallery(1)} aria-label="Show next market photos">→</button>
            </div>
          </div>

          <div ref={galleryRef} className="about__market-gallery">
            <article className="about__market-card about__market-card--video">
              <video
                ref={marketVideoRef}
                src={marketVideo}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
                <div className="about__video-controls">
                  <button type="button" onClick={toggleVideoPlayback} aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}>
                    {isVideoPlaying ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>
                    )}
                  </button>
                  <button type="button" onClick={toggleVideoSound} aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}>
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
                <img src={photo} alt={`Cepumbums at a local market, photo ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </aside>
      </div>

    </section>
  );
}

export default About;
