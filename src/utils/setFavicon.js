const FAVICON_TYPES = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

/**
 * Sets the browser tab favicon from a path in the public/ folder.
 * Called once on app load using company.logo from src/data/company.js.
 */
export function setFavicon(logoPath) {
  if (!logoPath) {
    return;
  }

  const extension = logoPath.split('.').pop()?.toLowerCase();
  const type = FAVICON_TYPES[extension] ?? 'image/png';

  let link = document.querySelector('link[rel="icon"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.type = type;
  link.href = logoPath;
}
