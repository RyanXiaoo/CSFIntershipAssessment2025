
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface RecipeFormProps {
  onSubmit: (data: any) => void;
}

const RecipeForm = ({ onSubmit }: RecipeFormProps) => {
  const [ingredients, setIngredients] = useState("");
  const [mealTypes, setMealTypes] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    dessert: false,
    snack: false,
  });

  const handleMealTypeChange = (mealType: string, checked: boolean) => {
    setMealTypes(prev => ({
      ...prev,
      [mealType]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please enter at least one ingredient.",
        variant: "destructive"
      });
      return;
    }

    const selectedMealTypes = Object.entries(mealTypes)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type);

    if (selectedMealTypes.length === 0) {
      toast({
        title: "No meal type selected",
        description: "Please select at least one meal type.",
        variant: "destructive"
      });
      return;
    }

    const formData = {
      ingredients: ingredients.trim(),
      mealTypes: selectedMealTypes,
      timestamp: new Date().toISOString()
    };

    onSubmit(formData);
    
    toast({
      title: "Recipe search started!",
      description: "Finding recipes based on your preferences...",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Find Your Perfect Recipe
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Tell us what ingredients you have and what you'd like to make!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ingredients Input */}
            <div className="space-y-2">
              <Label htmlFor="ingredients" className="text-lg font-semibold text-gray-700">
                Available Ingredients
              </Label>
              <Textarea
                id="ingredients"
                placeholder="List your ingredients separated by commas (e.g., chicken, tomatoes, onions, rice, cheese...)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="min-h-[120px] text-base border-2 border-gray-200 focus:border-blue-400 transition-colors"
              />
              <p className="text-sm text-gray-500">
                The more ingredients you list, the better recipe suggestions we can provide!
              </p>
            </div>

            {/* Meal Type Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700">
                What type of meal are you looking for?
              </Label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "breakfast", label: "Breakfast", icon: "🍳" },
                  { id: "lunch", label: "Lunch", icon: "🥪" },
                  { id: "dinner", label: "Dinner", icon: "🍽️" },
                  { id: "dessert", label: "Dessert", icon: "🍰" },
                  { id: "snack", label: "Snack", icon: "🥨" },
                ].map((mealType) => (
                  <div key={mealType.id} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <Checkbox
                      id={mealType.id}
                      checked={mealTypes[mealType.id]}
                      onCheckedChange={(checked) => handleMealTypeChange(mealType.id, checked as boolean)}
                    />
                    <Label htmlFor={mealType.id} className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-xl">{mealType.icon}</span>
                      <span className="font-medium">{mealType.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
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
