import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// This will be the structure of recipes fetched from our own backend
interface SavedRecipe {
    id: number;
    title: string;
    image: string;
    servings: number;
    readyInMinutes: number;
    sourceUrl: string;
    sourceName: string;
    diets: string; // Stored as comma-separated string
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    const fetchSavedRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5001/api/recipes");
            if (!response.ok) {
                throw new Error("Failed to fetch saved recipes.");
            }
            const data = await response.json();
            setSavedRecipes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecipe = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/recipes/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const result = await response.json();
                toast({
                    title: "Error",
                    description: result.message || "Failed to remove recipe.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Recipe Removed",
                description:
                    "The recipe has been removed from your collection.",
            });

            // Refresh the list of saved recipes
            setSavedRecipes((prev) =>
                prev.filter((recipe) => recipe.id !== id)
            );
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Could not connect to the server. Please try again later.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                    Loading your saved recipes...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="shadow-lg border-0 bg-red-50 border-red-200">
                <CardContent className="py-12 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-100 to-pink-100">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        My Saved Recipes
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        Your personal collection of recipes to cook later.
                    </CardDescription>
                </CardHeader>
            </Card>

            {savedRecipes.length === 0 ? (
                <div className="text-center py-20">
                    <ChefHat className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        Your Cookbook is Empty
                    </h2>
                    <p className="text-gray-500">
                        Find recipes in the "Search" tab and click "Save Recipe"
                        to add them here.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedRecipes.map((recipe) => (
                        <Card
                            key={recipe.id}
                            className="shadow-lg border-0 bg-white/90 backdrop-blur-sm flex flex-col"
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
                                        {recipe.diets.split(",").map(
                                            (label) =>
                                                label && (
                                                    <Badge
                                                        key={label}
                                                        variant="secondary"
                                                        className="capitalize"
                                                    >
                                                        {label}
                                                    </Badge>
                                                )
                                        )}
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="mt-4 w-full"
                                        >
                                            Remove
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently remove
                                                this recipe from your saved
                                                collection.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleDeleteRecipe(
                                                        recipe.id
                                                    )
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedRecipes;
