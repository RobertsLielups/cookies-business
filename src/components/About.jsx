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
  const stripRef = useRef(null);
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(null); // index into items, or null
  const { t } = useLanguage();
  const paragraphs = t('about.paragraphs');
  const items = [
    { video: marketVideo, alt: t('about.marketsRegion') },
    ...marketPhotos.map((src, index) => ({ src, alt: t('about.marketPhoto', { number: index + 1 }) })),
  ];

  // One card per click; wraps around at either end.
  const scrollStrip = (direction) => {
    const strip = stripRef.current;
    if (!strip) return;
    const first = strip.firstElementChild;
    const step = first.offsetWidth + 8;
    const start = first.offsetLeft; // the first card carries a left margin, so "start" is not 0
    const max = strip.scrollWidth - strip.clientWidth;
    let left = strip.scrollLeft + direction * step;
    if (direction > 0 && strip.scrollLeft >= max - 2) left = start;
    else if (direction < 0 && strip.scrollLeft <= start + 2) left = max;
    strip.scrollTo({ left, behavior: 'smooth' });
  };

  const show = (index) => {
    setOpen(index);
    dialogRef.current?.showModal();
  };
  const current = open === null ? null : items[open];

  return (
    <section id="about" className="section about">
      <div className="about__content">
        <span className="section-label">{t('about.label')}</span>
        <h2 className="section-title">{t('about.headline')}</h2>
        <div className="about__story">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="about__markets">
        <div ref={stripRef} className="about__strip" aria-label={t('about.marketsRegion')}>
          {items.map((item, index) => (
            <button key={item.video ?? item.src} type="button" onClick={() => show(index)} aria-label={item.alt}>
              {item.video
                ? <video src={item.video} autoPlay loop muted playsInline />
                : <img src={item.src} alt="" loading="lazy" />}
            </button>
          ))}
        </div>
        <button type="button" className="about__arrow about__arrow--prev" onClick={() => scrollStrip(-1)} aria-label={t('about.previousPhotos')}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <button type="button" className="about__arrow about__arrow--next" onClick={() => scrollStrip(1)} aria-label={t('about.nextPhotos')}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>

      {/* Native dialog: Escape closes it; a click on the backdrop (the dialog itself, not its child) closes it too. */}
      <dialog
        ref={dialogRef}
        className="about__lightbox"
        onClose={() => setOpen(null)}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        {current?.video && <video src={current.video} autoPlay controls playsInline />}
        {current?.src && <img src={current.src} alt={current.alt} />}
      </dialog>
    </section>
  );
}

export default About;
