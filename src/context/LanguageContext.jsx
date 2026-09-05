import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en';
import lv from '../locales/lv';

const LANGUAGE_STORAGE_KEY = 'cepumbums-language';
const supportedLanguages = { en, lv };
const LanguageContext = createContext(null);

function getStoredLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedLanguages[storedLanguage] ? storedLanguage : 'en';
  } catch {
    return 'en';
  }
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

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = supportedLanguages[language].metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      supportedLanguages[language].metadata.description,
    );

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
      setLanguage: (nextLanguage) => {
        if (supportedLanguages[nextLanguage]) setLanguage(nextLanguage);
      },
      t: (path, replacements = {}) => {
        const translation = getTranslation(messages, path) ?? getTranslation(en, path) ?? path;
        return typeof translation === 'string' ? interpolate(translation, replacements) : translation;
      },
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return context;
}
