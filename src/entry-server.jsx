// Server entry used only by scripts/prerender.js at build time.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import './styles/global.css';

export { languageCodes } from './context/LanguageContext';
export { getLocalizedProduct } from './data/allProducts';
export { SITE_URL, pageMeta, sitePages } from './seo';

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
