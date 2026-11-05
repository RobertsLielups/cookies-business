import productDetailsSource from './productDetails.public.json' with { type: 'json' };

const productDetailsById = new Map(
  productDetailsSource.products.map((product) => [
    product.id,
    {
      ingredientsLv: product.ingredients_lv || null,
      ingredientsEn: product.ingredients_en || null,
      netWeightG: product.net_weight_g,
      nutrition: {
        energyKj: product.energy_kj,
        energyKcal: product.energy_kcal,
        fatG: product.fat_g,
        saturatesG: product.saturates_g,
        carbsG: product.carbs_g,
        sugarsG: product.sugars_g,
        proteinG: product.protein_g,
        saltG: product.salt_g,
      },
      storyLv: product.story_option_1_lv || null,
    },
  ]),
);

export function getProductDetails(productId) {
  return productDetailsById.get(productId) ?? null;
}
