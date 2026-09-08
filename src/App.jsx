import { useLayoutEffect, useRef } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PolicyPage from './pages/PolicyPage';
import CookieConsent from './components/CookieConsent';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { LanguageProvider, getPreferredLanguage, supportedLanguages } from './context/LanguageContext';

const stripLanguage = (pathname) => pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const page = stripLanguage(pathname);
  const previousPage = useRef(page);

  useLayoutEffect(() => {
    const languageSwitchOnly = previousPage.current === page;
    previousPage.current = page;

    if (hash) {
      const targetId = hash.slice(1);
      const scrollToSection = () => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
      };

      scrollToSection();
      const frameId = window.requestAnimationFrame(scrollToSection);

      return () => window.cancelAnimationFrame(frameId);
    }

    // Switching language re-renders the same page; keep the reader where they were.
    if (languageSwitchOnly) return undefined;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Run once more after the route has painted to override any late browser scroll.
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, hash, page]);

  return null;
}

/** Everything lives under /en or /lv. A path without a valid prefix (old links, typed URLs) is sent to the preferred one. */
function LocaleLayout() {
  const { lang } = useParams();
  const { pathname, hash } = useLocation();

  if (!supportedLanguages[lang]) {
    return <Navigate to={`/${getPreferredLanguage()}${pathname}${hash}`} replace />;
  }

  return (
    <LanguageProvider language={lang}>
      <CookieConsentProvider>
        <Outlet />
        <CookieConsent />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}

function RootRedirect() {
  const { hash } = useLocation();
  return <Navigate to={`/${getPreferredLanguage()}${hash}`} replace />;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route index element={<RootRedirect />} />
        <Route path=":lang" element={<LocaleLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="privacy" element={<PolicyPage type="privacy" />} />
          <Route path="cookies" element={<PolicyPage type="cookie" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<LocaleLayout />} />
      </Routes>
    </>
  );
}

export default App;
