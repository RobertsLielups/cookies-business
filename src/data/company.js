export const company = {
  name: 'Cepumbums',
  tagline: 'Handcrafted cookies, baked with love since 1987',
  email: 'hello@goldencrumbbakery.com',
  phone: '(555) 123-4567',
  address: '42 Maple Lane, Portland, OR',

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
  logo: '/cepumbums-logo.png',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const values = [
  {
    title: 'Family First',
    description:
      'Three generations of bakers share the same kitchen, the same recipes, and the same pride in every batch.',
  },
  {
    title: 'Honest Ingredients',
    description:
      'We source real butter, pure vanilla, and premium chocolate — never shortcuts, never substitutes.',
  },
  {
    title: 'Small-Batch Care',
    description:
      'Every order is baked in small batches so freshness and quality never get lost at scale.',
  },
];

export const benefits = [
  {
    title: 'Handmade',
    description: 'Each cookie is shaped, scooped, and finished by hand in our family kitchen.',
  },
  {
    title: 'Premium Ingredients',
    description: 'European butter, Belgian chocolate, and organic flour in every recipe.',
  },
  {
    title: 'Family Recipes',
    description: 'Time-tested formulas passed down and refined over thirty years.',
  },
  {
    title: 'Quality Production',
    description: 'Strict standards from mixing bowl to packaging — consistency you can taste.',
  },
];

export const aboutStory = {
  headline: 'A family tradition, baked fresh every day',
  paragraphs: [
    'Golden Crumb Bakery began in a small home kitchen when our grandmother started selling cookies at the local farmers market. Word spread quickly — neighbors, friends, and soon entire communities came back for more.',
    'Today, we still bake the same way she taught us: slowly, carefully, and with ingredients we would serve our own family. Our shop may have grown, but the heart of what we do has never changed.',
  ],
};
