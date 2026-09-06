/**
 * Store records are intentionally separate from product availability so a store
 * can be reused across the catalog. Use the existing product `id` value from
 * allProducts.js when adding a productAvailability entry.
 */
export const stores = [
  {
    id: 'dabigi-produkti-barona-41-43',
    name: 'Dabigi produkti',
    address: 'Krišjāņa Barona iela 41/43, Centra rajons, Rīga, LV-1011',
    city: 'Rīga',
  },
];

/**
 * Add one entry per product/store pairing. Supported statuses are:
 * `available`, `low`, and `out`. Entries marked `out` are kept for future
 * updates but are not shown on product pages.
 *
 * Example:
 * {
 *   storeId: 'example-store',
 *   productId: 'Kokosa Bučas',
 *   status: 'available',
 * }
 */
export const productAvailability = [
  {
    storeId: 'dabigi-produkti-barona-41-43',
    productId: 'Mandeļu Mākoņi',
    status: 'available',
  },
];

const visibleStatuses = new Set(['available', 'low']);

export function getAvailableStoresForProduct(productId) {
  const storesById = new Map(stores.map((store) => [store.id, store]));

  return productAvailability
    .filter(
      ({ storeId, productId: availableProductId, status }) =>
        availableProductId === productId && visibleStatuses.has(status) && storesById.has(storeId),
    )
    .map(({ storeId, status }) => ({
      ...storesById.get(storeId),
      status,
    }));
}
