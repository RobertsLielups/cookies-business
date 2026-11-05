import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let turnstileScriptPromise;

function loadTurnstile() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Turnstile requires a browser.'));
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
      const script = existingScript ?? document.createElement('script');

      function handleLoad() {
        if (window.turnstile) {
          resolve(window.turnstile);
        } else {
          reject(new Error('Turnstile did not initialize.'));
        }
      }

      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', () => reject(new Error('Turnstile failed to load.')), { once: true });

      if (!existingScript) {
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    });
  }

  return turnstileScriptPromise;
}

const TurnstileWidget = forwardRef(function TurnstileWidget(
  { language, onTokenChange, onUnavailable },
  ref,
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset() {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }), []);

  useEffect(() => {
    let cancelled = false;

    if (!siteKey) {
      onUnavailable();
      return undefined;
    }

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language,
          theme: 'light',
          callback: (token) => onTokenChange(token),
          'expired-callback': () => onTokenChange(''),
          'error-callback': () => {
            onTokenChange('');
            onUnavailable();
          },
        });
      })
      .catch(() => {
        if (!cancelled) onUnavailable();
      });

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [language, onTokenChange, onUnavailable, siteKey]);

  return <div ref={containerRef} className="contact__turnstile" />;
});

export default TurnstileWidget;
