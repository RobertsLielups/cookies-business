/**
 * A store's `products` list uses the canonical product `id` values from
 * allProducts.js. The relationship means the store carries the product; it does
 * not represent current inventory.
 */
export const stores = [
  {
    id: 'dabigi-produkti-barona-41-43',
    name: 'Dabigi produkti',
    address: 'Krišjāņa Barona iela 41/43, Centra rajons, Rīga, LV-1011',
    city: 'Rīga',
    latitude: 56.955126,
    longitude: 24.12874,
    products: ['Mandeļu Mākoņi'],
  },
];

export function getStoresForProduct(productId) {
  return stores.filter(({ products }) => products.includes(productId));
}
