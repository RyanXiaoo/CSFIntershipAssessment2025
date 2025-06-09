
import { useState } from "react";
import Navigation from "@/components/Navigation";
import RecipeForm from "@/components/RecipeForm";
import Recipes from "@/components/Recipes";

const Index = () => {
  const [activeTab, setActiveTab] = useState("form");
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (formData) => {
    setSubmittedData(formData);
    setActiveTab("recipes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "form" && (
          <RecipeForm onSubmit={handleFormSubmit} />
        )}
        
        {activeTab === "recipes" && (
          <Recipes submittedData={submittedData} />
        )}
      </main>
    </div>
  );
};

export default Index;
