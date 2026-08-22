import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
