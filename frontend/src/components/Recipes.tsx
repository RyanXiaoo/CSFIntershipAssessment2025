import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Users,
    ChefHat,
    Loader2,
    BarChart,
    Flame,
    Beef,
    Wheat,
} from "lucide-react";
import { findRecipes, TransformedRecipe } from "@/services/spoonacularApi";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface RecipesProps {
    submittedData: any;
}

const Recipes = ({ submittedData }: RecipesProps) => {
    const [recipes, setRecipes] = useState<TransformedRecipe[]>([]);
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
            const fetchedRecipes = await findRecipes(submittedData);
            setRecipes(fetchedRecipes);

            if (fetchedRecipes.length === 0) {
                setError(
                    "No recipes found matching your criteria. Try adjusting your search filters."
                );
            }
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError(
                "Failed to fetch recipes. The API might be temporarily unavailable. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecipe = async (recipe: TransformedRecipe) => {
        try {
            const response = await fetch("http://localhost:5001/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipe),
            });

            const result = await response.json();

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: result.message || "Failed to save recipe.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Recipe Saved!",
                description: `"${recipe.title}" has been added to your collection.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Could not connect to the server. Please try again later.",
                variant: "destructive",
            });
        }
    };

    if (!submittedData) {
        return null; // Don't show anything if no search has been made
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-8">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-100 to-green-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Recipe Recommendations
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Based on your selected filters.
                    </CardDescription>
                </CardHeader>
            </Card>

            {loading && (
                <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                        Searching for the best recipes...
                    </p>
                </div>
            )}

            {error && !loading && (
                <Card className="shadow-lg border-0 bg-red-50 border-red-200">
                    <CardContent className="py-12 text-center">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </CardContent>
                </Card>
            )}

            {!loading && !error && recipes.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <Card
                            key={recipe.id}
                            className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col"
                        >
                            <a
                                href={recipe.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="relative h-56 overflow-hidden rounded-t-lg">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </a>

                            <CardHeader>
                                <a
                                    href={recipe.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CardTitle className="text-xl font-bold text-gray-800 hover:text-blue-600">
                                        {recipe.title}
                                    </CardTitle>
                                </a>
                                <CardDescription className="text-sm text-gray-500">
                                    by {recipe.sourceName}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 flex flex-col justify-between flex-grow">
                                <div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                        <div
                                            className="flex items-center space-x-1"
                                            title="Prep Time"
                                        >
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {recipe.readyInMinutes > 0
                                                    ? `${recipe.readyInMinutes} mins`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-1"
                                            title="Servings"
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {recipe.servings} servings
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                                        <div className="flex items-center space-x-1.5">
                                            <Flame className="h-4 w-4 text-red-500" />
                                            <span>{recipe.calories} kcal</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Beef className="h-4 w-4 text-orange-500" />
                                            <span>
                                                {recipe.protein}g Protein
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <BarChart className="h-4 w-4 text-yellow-500" />
                                            <span>{recipe.fat}g Fat</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Wheat className="h-4 w-4 text-green-500" />
                                            <span>{recipe.carbs}g Carbs</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {recipe.diets.map((label) => (
                                            <Badge
                                                key={label}
                                                variant="secondary"
                                                className="capitalize"
                                            >
                                                {label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleSaveRecipe(recipe)}
                                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Save Recipe
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && !error && recipes.length === 0 && submittedData && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">
                            No recipes found matching your criteria. Try
                            adjusting your search filters.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Recipes;
