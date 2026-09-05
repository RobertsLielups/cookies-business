export const company = {
  name: 'Cepumbums',
  email: 'Cepumbums@gmail.com',
  phone: '+371-29-149-249',
  address: 'Ozolnieki, Jelgava',

  /**
   * Company logo — used in the header and as the browser tab favicon.
   *
   * How to add your logo:
   * 1. Put your logo file in the public/ folder (e.g. public/logo.png)
   * 2. Set logo to the path starting with / (e.g. '/logo.png')
   *
   * Supported formats: .png, .svg, .ico, .jpg, .webp
   * Leave as null to use the default "GC" placeholder.
   */
  logo: '/media/brand/cepumbums-logo.png',
};

export const navLinks = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'about', href: '/#about' },
  { key: 'contact', href: '/#contact' },
];
