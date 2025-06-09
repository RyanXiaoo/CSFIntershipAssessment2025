import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

// Options based on Spoonacular API documentation
const dietOptions = [
    "Gluten Free",
    "Ketogenic",
    "Vegetarian",
    "Vegan",
    "Paleo",
];
const intoleranceOptions = [
    "Dairy",
    "Egg",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
];
const cuisineTypeOptions = [
    "American",
    "Asian",
    "British",
    "Caribbean",
    "Chinese",
    "French",
    "Indian",
    "Italian",
    "Japanese",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Thai",
];

interface RecipeFormProps {
    onSubmit: (data: any) => void;
}

const RecipeForm = ({ onSubmit }: RecipeFormProps) => {
    const [formData, setFormData] = useState({
        diet: "",
        cuisine: "",
        intolerances: [] as string[],
        minCarbs: "",
        maxCarbs: "",
        minProtein: "",
        maxProtein: "",
        minCalories: "",
        maxCalories: "",
        minFat: "",
        maxFat: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleIntoleranceChange = (option: string) => {
        const lowerCaseOption = option.toLowerCase();
        setFormData((prev) => ({
            ...prev,
            intolerances: prev.intolerances.includes(lowerCaseOption)
                ? prev.intolerances.filter((item) => item !== lowerCaseOption)
                : [...prev.intolerances, lowerCaseOption],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            intolerances: formData.intolerances.join(","), // Join for API
        };
        onSubmit(submittedData);
        toast({
            title: "Recipe search started!",
            description: "Finding recipes based on your preferences...",
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Find Your Perfect Recipe
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        Use the filters below to find the perfect recipe for
                        your needs.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Cuisine</Label>
                                <Select
                                    onValueChange={(v) =>
                                        handleSelectChange("cuisine", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any Cuisine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cuisineTypeOptions.map((opt) => (
                                            <SelectItem
                                                key={opt}
                                                value={opt.toLowerCase()}
                                            >
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Diet</Label>
                                <Select
                                    onValueChange={(v) =>
                                        handleSelectChange("diet", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any Diet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dietOptions.map((opt) => (
                                            <SelectItem
                                                key={opt}
                                                value={opt.toLowerCase()}
                                            >
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-lg font-semibold text-gray-700">
                                Intolerances
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {intoleranceOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={opt}
                                            onCheckedChange={() =>
                                                handleIntoleranceChange(opt)
                                            }
                                        />
                                        <Label
                                            htmlFor={opt}
                                            className="font-medium"
                                        >
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-lg font-semibold text-gray-700">
                                Nutrition (per serving)
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                                {Object.keys(formData)
                                    .filter(
                                        (k) =>
                                            k.includes("Carbs") ||
                                            k.includes("Protein") ||
                                            k.includes("Calories") ||
                                            k.includes("Fat")
                                    )
                                    .map((key) => (
                                        <div key={key}>
                                            <Label
                                                htmlFor={key}
                                                className="text-sm capitalize"
                                            >
                                                {key
                                                    .replace(/([A-Z])/g, " $1")
                                                    .replace(
                                                        /min|max/,
                                                        (m) =>
                                                            `${m
                                                                .charAt(0)
                                                                .toUpperCase()}${m.slice(
                                                                1
                                                            )}`
                                                    )}
                                            </Label>
                                            <Input
                                                id={key}
                                                type="number"
                                                placeholder={
                                                    key.startsWith("min")
                                                        ? "Min"
                                                        : "Max"
                                                }
                                                value={formData[key]}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Find Recipes 🔍
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipeForm;
