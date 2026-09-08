import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../locales/en';
import lv from '../locales/lv';

const LANGUAGE_STORAGE_KEY = 'cepumbums-language';
export const supportedLanguages = { en, lv };
export const languageCodes = Object.keys(supportedLanguages);
const LanguageContext = createContext(null);

/** Stored choice, else Latvian. Only used to pick a prefix when the URL has none. */
export function getPreferredLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (supportedLanguages[stored]) return stored;
  } catch {
    // Storage unavailable; use the default.
  }
  return 'lv';
}

function getTranslation(messages, path) {
  return path.split('.').reduce((value, key) => value?.[key], messages);
}

function interpolate(message, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    message,
  );
}

/**
 * The language is the URL prefix (/en, /lv). Switching navigates to the same page under the other
 * prefix; the choice is remembered so the root URL can pick it next time.
 */
export function LanguageProvider({ language, children }) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The application remains usable when browser storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => {
    const messages = supportedLanguages[language];

    return {
      language,
      /** '/products' -> '/lv/products', '/#about' -> '/lv#about', '/' -> '/lv'. */
      localePath: (href) => {
        const [path, fragment] = href.split('#');
        return `/${language}${path === '/' ? '' : path}${fragment ? `#${fragment}` : ''}`;
      },
      setLanguage: (nextLanguage) => {
        if (nextLanguage === language || !supportedLanguages[nextLanguage]) return;
        navigate(pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${nextLanguage}`) + hash, { replace: true });
      },
      t: (path, replacements = {}) => {
        const translation = getTranslation(messages, path) ?? getTranslation(en, path) ?? path;
        return typeof translation === 'string' ? interpolate(translation, replacements) : translation;
      },
    };
  }, [language, navigate, pathname, hash]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return context;
}
