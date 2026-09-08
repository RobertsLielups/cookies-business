import en from './locales/en';
import lv from './locales/lv';
import { allProducts } from './data/allProducts';

const messages = { en, lv };

/** Public origin for canonical, hreflang and sitemap URLs. Set VITE_SITE_URL in the build environment. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://cepumbums.lv').replace(/\/$/, '');

/** Title and description for one page in one language. `data` is the localized product for 'product'. */
export function pageMeta(language, page, data = {}) {
  const m = messages[language];
  switch (page) {
    case 'products':
      return { title: `${m.products.pageTitle} | Cepumbums`, description: m.products.pageDescription };
    case 'product':
      return { title: `${data.name} | Cepumbums`, description: data.description || m.products.pageDescription };
    case 'privacy':
      return { title: m.privacyPolicy.metadataTitle, description: m.privacyPolicy.metadataDescription };
    case 'cookies':
      return { title: m.cookiePolicy.metadataTitle, description: m.cookiePolicy.metadataDescription };
    default:
      return { title: m.metadata.title, description: m.metadata.description };
  }
}

/** Every public page, language-neutral. The prerender emits each one under every language prefix. */
export function sitePages() {
  return [
    { path: '', page: 'home' },
    { path: '/products', page: 'products' },
    ...allProducts.map((product) => ({ path: `/products/${product.slug}`, page: 'product', product })),
    { path: '/privacy', page: 'privacy' },
    { path: '/cookies', page: 'cookies' },
  ];
}
