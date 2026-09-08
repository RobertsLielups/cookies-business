// Build the client bundle, then render every page in every language to static HTML in dist/.
// Output: dist/<lang>/<path>/index.html with title, description, canonical and hreflang; sitemap.xml; robots.txt.
// dist/index.html stays as the bare SPA shell for anything not prerendered.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';

const root = process.cwd();
const escapeHtml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

await build({ root, logLevel: 'warn' });
await build({ root, logLevel: 'warn', build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr' } });

const { render, sitePages, pageMeta, getLocalizedProduct, languageCodes, SITE_URL } = await import(
  path.join(root, 'dist-ssr/entry-server.js')
);
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const sitemapEntries = [];

for (const entry of sitePages()) {
  const alternates = languageCodes.map((lang) => ({ lang, href: `${SITE_URL}/${lang}${entry.path}` }));
  const hreflang = [
    ...alternates.map(({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${href}" />`),
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/lv${entry.path}" />`,
  ];

  for (const lang of languageCodes) {
    const url = `/${lang}${entry.path}`;
    const data = entry.product ? getLocalizedProduct(entry.product, lang) : {};
    const { title, description } = pageMeta(lang, entry.page, data);
    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace('</head>', `    <link rel="canonical" href="${SITE_URL}${url}" />\n    ${hreflang.join('\n    ')}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(url)}</div>`);

    const outDir = path.join(root, 'dist', url);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html);
    sitemapEntries.push({ loc: `${SITE_URL}${url}`, alternates });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map(({ loc, alternates }) => `  <url>
    <loc>${loc}</loc>
${alternates.map(({ lang, href }) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(root, 'dist/sitemap.xml'), sitemap);
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`Prerendered ${sitemapEntries.length} pages to dist/ (${SITE_URL})`);
