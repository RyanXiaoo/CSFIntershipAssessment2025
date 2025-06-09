import { useState } from "react";
import Navigation from "@/components/Navigation";
import RecipeForm from "@/components/RecipeForm";
import Recipes from "@/components/Recipes";
import SavedRecipes from "@/pages/SavedRecipes";

const Index = () => {
    const [activeTab, setActiveTab] = useState("search");
    const [submittedData, setSubmittedData] = useState(null);

    const handleFormSubmit = (formData) => {
        setSubmittedData(formData);
    };

    const handleNewSearch = () => {
        setSubmittedData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="container mx-auto px-4 py-8">
                {activeTab === "search" && (
                    <div>
                        {!submittedData ? (
                            <RecipeForm onSubmit={handleFormSubmit} />
                        ) : (
                            <div>
                                <button
                                    onClick={handleNewSearch}
                                    className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    New Search
                                </button>
                                <Recipes submittedData={submittedData} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "saved" && <SavedRecipes />}
            </main>
        </div>
    );
};

export default Index;
