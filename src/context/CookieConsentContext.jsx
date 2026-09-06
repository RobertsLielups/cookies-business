import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const COOKIE_CONSENT_STORAGE_KEY = 'cepumbums_cookie_consent';
export const COOKIE_CONSENT_VERSION = 1;

const defaultConsent = Object.freeze({
  necessary: true,
  analytics: false,
});

const CookieConsentContext = createContext(null);

function readStoredConsent() {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (
      parsed?.necessary === true
      && typeof parsed.analytics === 'boolean'
      && parsed.consentVersion === COOKIE_CONSENT_VERSION
    ) {
      return parsed;
    }
  } catch {
    // Treat malformed or unavailable storage as a new visit.
  }

  return null;
}

export function CookieConsentProvider({ children }) {
  const [savedConsent, setSavedConsent] = useState(readStoredConsent);
  const consent = savedConsent ?? defaultConsent;

  const savePreferences = useCallback((analytics) => {
    const nextConsent = {
      necessary: true,
      analytics: Boolean(analytics),
      consentVersion: COOKIE_CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
    };

    setSavedConsent(nextConsent);
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(nextConsent));
    } catch {
      // Consent remains active for this session when storage is unavailable.
    }
  }, []);

  const value = useMemo(() => ({
    consent,
    hasMadeChoice: savedConsent !== null,
    savePreferences,
    hasAnalyticsConsent: () => consent.analytics === true,
  }), [consent, savedConsent, savePreferences]);

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider.');
  }

  return context;
}
