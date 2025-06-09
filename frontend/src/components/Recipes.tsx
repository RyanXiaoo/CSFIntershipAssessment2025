
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Loader2 } from "lucide-react";
import { findRecipesByIngredients, Recipe } from "@/services/mealDbApi";

interface RecipesProps {
  submittedData: any;
}

const Recipes = ({ submittedData }: RecipesProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submittedData) {
      fetchRecipes();
    }
  }, [submittedData]);

  const fetchRecipes = async () => {
    if (!submittedData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const ingredientsList = submittedData.ingredients
        .split(',')
        .map((ingredient: string) => ingredient.trim())
        .filter((ingredient: string) => ingredient.length > 0);
      
      const fetchedRecipes = await findRecipesByIngredients(ingredientsList, submittedData.mealTypes);
      setRecipes(fetchedRecipes);
      
      if (fetchedRecipes.length === 0) {
        setError("No recipes found matching your criteria. Try different ingredients or meal types.");
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!submittedData) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Recipe Search Yet</h2>
            <p className="text-gray-500">
              Use the "Find Recipe" tab to search for recipes based on your ingredients and preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-100 to-green-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Recipe Recommendations</CardTitle>
          <CardDescription className="text-lg">
            Based on your ingredients: <span className="font-semibold">{submittedData.ingredients}</span>
            <br />
            Meal types: {submittedData.mealTypes.map((type: string) => (
              <Badge key={type} variant="secondary" className="ml-1">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Searching for recipes...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Recipe Cards */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              {/* Recipe Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">{recipe.title}</CardTitle>
                <CardDescription className="text-gray-600">{recipe.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Recipe Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <Badge variant={recipe.difficulty === "Easy" ? "default" : "secondary"}>
                    {recipe.difficulty}
                  </Badge>
                </div>

                {/* Category and Area */}
                <div className="flex gap-2">
                  <Badge variant="outline">{recipe.category}</Badge>
                  <Badge variant="outline">{recipe.area}</Badge>
                </div>

                {/* Matching Ingredients */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Ingredients:</p>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {recipe.ingredients.slice(0, 8).map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {recipe.ingredients.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.ingredients.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Instructions Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Instructions:</p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {recipe.instructions.length > 150 
                      ? `${recipe.instructions.substring(0, 150)}...` 
                      : recipe.instructions
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Recipes Message */}
      {!loading && !error && recipes.length === 0 && submittedData && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No recipes found matching your criteria. Try adjusting your ingredients or meal preferences.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Recipes;
