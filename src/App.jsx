import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const targetId = hash.slice(1);
      const scrollToSection = () => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
      };

      scrollToSection();
      const frameId = window.requestAnimationFrame(scrollToSection);

      return () => window.cancelAnimationFrame(frameId);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Run once more after the route has painted to override any late browser scroll.
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
