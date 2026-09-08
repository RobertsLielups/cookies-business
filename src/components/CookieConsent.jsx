import { useEffect, useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/cookie-consent.css';

function CookieConsent() {
  const { t } = useLanguage();
  const { hasMadeChoice, savePreferences } = useCookieConsent();
  // The stored choice is only known in the browser; render nothing until mounted so prerendered HTML hydrates cleanly.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || hasMadeChoice) return null;

  return (
    <section className="cookie-banner" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner__content">
        <h2 id="cookie-banner-title" className="cookie-banner__title">{t('cookieConsent.title')}</h2>
        <p className="cookie-banner__text">{t('cookieConsent.bannerDescription')}</p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-button cookie-button--secondary" onClick={() => savePreferences(false)}>
          {t('cookieConsent.rejectAll')}
        </button>
        <button type="button" className="cookie-button cookie-button--primary" onClick={() => savePreferences(true)}>
          {t('cookieConsent.acceptAll')}
        </button>
      </div>
    </section>
  );
}

export default CookieConsent;
