import { FoodRepo, Recipe } from "@/lib/dataRepo";

export async function computeRecipe(recipe: Recipe) {
  const foods = await FoodRepo.all();
  let kcal = 0,
    p = 0,
    c = 0,
    f = 0;
  for (const ing of recipe.ingredients) {
    const food = foods.find((x) => x.id === ing.foodId);
    if (!food) continue;
    const factor = ing.grams / 100;
    kcal += food.calories * factor;
    p += food.protein * factor;
    c += food.carbs * factor;
    f += food.fat * factor;
  }
  return {
    kcal: Math.round(kcal),
    protein: Math.round(p),
    carbs: Math.round(c),
    fat: Math.round(f),
  };
}
