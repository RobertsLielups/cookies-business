import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { company } from './data/company';
import { setFavicon } from './utils/setFavicon';
import './styles/global.css';

// Keep navigation consistent: every route starts at its top, including browser Back/Forward.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

setFavicon(company.logo);

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages ship their HTML; hydrate it. The bare index.html (dev, unknown routes) renders from scratch.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
