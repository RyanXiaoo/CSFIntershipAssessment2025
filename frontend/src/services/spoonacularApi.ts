// src/services/spoonacularApi.ts

const API_BASE_URL = "http://localhost:5001/api/search";

// This interface is based on the `complexSearch` endpoint with `addRecipeNutrition: true`
export interface SpoonacularRecipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
    nutrition: {
        nutrients: Array<{
            name: string;
            amount: number;
            unit: string;
        }>;
    };
    servings: number;
    sourceUrl: string;
    readyInMinutes: number;
    sourceName: string;
    diets: string[];
}

export interface TransformedRecipe {
    id: number;
    title: string;
    image: string;
    servings: number;
    readyInMinutes: number;
    sourceUrl: string;
    sourceName: string;
    diets: string[];
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

export const transformSpoonacularRecipe = (
    recipe: SpoonacularRecipe
): TransformedRecipe => {
    const getNutrient = (name: string) => {
        const nutrient = recipe.nutrition.nutrients.find(
            (n) => n.name === name
        );
        return nutrient ? Math.round(nutrient.amount) : 0;
    };

    return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        servings: recipe.servings,
        readyInMinutes: recipe.readyInMinutes,
        sourceUrl: recipe.sourceUrl,
        sourceName: recipe.sourceName,
        diets: recipe.diets,
        calories: getNutrient("Calories"),
        protein: getNutrient("Protein"),
        fat: getNutrient("Fat"),
        carbs: getNutrient("Carbohydrates"),
    };
};

export const findRecipes = async (
    searchParams: any
): Promise<TransformedRecipe[]> => {
    const url = new URL(API_BASE_URL);

    // Append all search params to the URL
    Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) {
            url.searchParams.append(key, searchParams[key]);
        }
    });

    console.log("Fetching from backend URL:", url.toString());

    try {
        const response = await fetch(url.toString());

        if (!response.ok) {
            const errorBody = await response.json();
            console.error(
                "Backend API Error:",
                response.status,
                errorBody.message
            );
            throw new Error(
                errorBody.message ||
                    `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        console.log("Backend API Response:", data);

        if (data.results) {
            return data.results.map(transformSpoonacularRecipe);
        }
        return [];
    } catch (error) {
        console.error("Error fetching recipes from backend:", error);
        throw error;
    }
};
