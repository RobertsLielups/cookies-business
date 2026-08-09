import '../styles/cookie-visual.css';

/**
 * Decorative foundation for the future scroll-driven cookie sequence.
 *
 * This intentionally contains no scroll logic or image frames yet. When the
 * sequence is added, replace cookie-visual__placeholder with an image/canvas
 * driven by the frames in public/images/cookie-frames/.
 */
function CookieVisual() {
  return (
    <div className="cookie-visual" aria-hidden="true">
      <div className="cookie-visual__placeholder">
        <span className="cookie-visual__chip cookie-visual__chip--one" />
        <span className="cookie-visual__chip cookie-visual__chip--two" />
        <span className="cookie-visual__chip cookie-visual__chip--three" />
        <span className="cookie-visual__chip cookie-visual__chip--four" />
        <span className="cookie-visual__chip cookie-visual__chip--five" />
        <span className="cookie-visual__chip cookie-visual__chip--six" />
      </div>
    </div>
  );
}

export default CookieVisual;
