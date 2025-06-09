import { ChefHat } from "lucide-react";

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <ChefHat className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-800">
                            RecipeHelper
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab("search")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "search"
                                    ? "bg-blue-100 text-blue-700 shadow-sm"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            Search
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "saved"
                                    ? "bg-purple-100 text-purple-700 shadow-sm"
                                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                            }`}
                        >
                            Saved Recipes
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
