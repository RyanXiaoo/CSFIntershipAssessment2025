
export interface MealDbRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  instructions: string;
  category: string;
  area: string;
  ingredients: string[];
  prepTime: string;
  servings: number;
  difficulty: string;
}

const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchRecipesByIngredient = async (ingredient: string): Promise<MealDbRecipe[]> => {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by ingredient:', error);
    return [];
  }
};

export const getRecipeDetails = async (id: string): Promise<MealDbRecipe | null> => {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

export const searchRecipesByCategory = async (category: string): Promise<MealDbRecipe[]> => {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
};

export const transformMealDbRecipe = (mealDbRecipe: MealDbRecipe): Recipe => {
  const ingredients: string[] = [];
  
  // Extract ingredients from the MealDB format (strIngredient1, strIngredient2, etc.)
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDbRecipe[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim().toLowerCase());
    }
  }

  return {
    id: mealDbRecipe.idMeal,
    title: mealDbRecipe.strMeal,
    description: `A delicious ${mealDbRecipe.strCategory} dish from ${mealDbRecipe.strArea}`,
    image: mealDbRecipe.strMealThumb,
    instructions: mealDbRecipe.strInstructions,
    category: mealDbRecipe.strCategory,
    area: mealDbRecipe.strArea,
    ingredients,
    prepTime: "30 mins", // MealDB doesn't provide prep time, so we'll use a default
    servings: 4, // Default servings
    difficulty: ingredients.length > 10 ? "Medium" : "Easy" // Simple difficulty calculation
  };
};

export const findRecipesByIngredients = async (ingredientsList: string[], mealTypes: string[]): Promise<Recipe[]> => {
  console.log('Searching for recipes with ingredients:', ingredientsList);
  console.log('Meal types:', mealTypes);
  
  const allRecipes: MealDbRecipe[] = [];
  const seenIds = new Set<string>();

  // Search by each ingredient
  for (const ingredient of ingredientsList) {
    const recipes = await searchRecipesByIngredient(ingredient.trim());
    recipes.forEach(recipe => {
      if (!seenIds.has(recipe.idMeal)) {
        allRecipes.push(recipe);
        seenIds.add(recipe.idMeal);
      }
    });
  }

  // Get detailed information for each recipe
  const detailedRecipes: Recipe[] = [];
  const maxRecipes = Math.min(allRecipes.length, 12); // Limit to 12 recipes

  for (let i = 0; i < maxRecipes; i++) {
    const recipeDetails = await getRecipeDetails(allRecipes[i].idMeal);
    if (recipeDetails) {
      const transformedRecipe = transformMealDbRecipe(recipeDetails);
      
      // Filter by meal type if specified
      if (mealTypes.length > 0) {
        const category = transformedRecipe.category.toLowerCase();
        const isValidMealType = mealTypes.some(mealType => {
          if (mealType === 'breakfast' && (category.includes('breakfast') || category.includes('starter'))) return true;
          if (mealType === 'lunch' && (category.includes('chicken') || category.includes('beef') || category.includes('pork'))) return true;
          if (mealType === 'dinner' && (category.includes('chicken') || category.includes('beef') || category.includes('pork') || category.includes('seafood'))) return true;
          if (mealType === 'dessert' && category.includes('dessert')) return true;
          if (mealType === 'snack' && (category.includes('side') || category.includes('miscellaneous'))) return true;
          return false;
        });
        
        if (isValidMealType) {
          detailedRecipes.push(transformedRecipe);
        }
      } else {
        detailedRecipes.push(transformedRecipe);
      }
    }
  }

  console.log('Found recipes:', detailedRecipes);
  return detailedRecipes;
};
