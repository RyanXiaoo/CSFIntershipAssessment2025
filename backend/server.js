require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const setupDatabase = require("./database");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Spoonacular API credentials from environment variables
const API_KEY = process.env.SPOONACULAR_API_KEY;
const API_BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

let db;

(async () => {
    db = await setupDatabase();
})();

// API Route for searching recipes
app.get("/api/search", async (req, res) => {
    if (!API_KEY) {
        return res
            .status(500)
            .json({ message: "API key is not configured on the server." });
    }

    try {
        const response = await axios.get(API_BASE_URL, {
            params: {
                ...req.query,
                apiKey: API_KEY,
                addRecipeNutrition: true, // To get detailed nutrition info
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(
            "Error proxying Spoonacular API:",
            error.response ? error.response.data : error.message
        );
        res.status(error.response ? error.response.status : 500).json({
            message: "Failed to fetch recipes.",
            details: error.response ? error.response.data : null,
        });
    }
});

// Intercept favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).send());

// === Your Custom API for Saved Recipes ===

// POST /api/recipes: Takes in the recipe and stores it.
app.post("/api/recipes", async (req, res) => {
    const recipe = req.body;
    try {
        const result = await db.run(
            `INSERT INTO saved_recipes (spoonacularId, title, image, servings, readyInMinutes, sourceUrl, sourceName, diets, calories, protein, fat, carbs)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                recipe.id,
                recipe.title,
                recipe.image,
                recipe.servings,
                recipe.readyInMinutes,
                recipe.sourceUrl,
                recipe.sourceName,
                recipe.diets.join(","),
                recipe.calories,
                recipe.protein,
                recipe.fat,
                recipe.carbs,
            ]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT") {
            return res
                .status(409)
                .json({ message: "Recipe is already saved." });
        }
        console.error("Failed to save recipe:", error);
        res.status(500).json({ message: "Failed to save recipe." });
    }
});

// GET /api/recipes: Returns all saved recipes.
app.get("/api/recipes", async (req, res) => {
    try {
        const recipes = await db.all(
            "SELECT * FROM saved_recipes ORDER BY id DESC"
        );
        res.json(recipes);
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        res.status(500).json({ message: "Failed to fetch recipes." });
    }
});

// GET /api/recipes/{id}: Returns the recipe corresponding to the id.
app.get("/api/recipes/:id", async (req, res) => {
    try {
        const recipe = await db.get(
            "SELECT * FROM saved_recipes WHERE id = ?",
            [req.params.id]
        );
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found." });
        }
    } catch (error) {
        console.error("Failed to fetch recipe:", error);
        res.status(500).json({ message: "Failed to fetch recipe." });
    }
});

// DELETE /api/recipes/{id}: Deletes a saved recipe.
app.delete("/api/recipes/:id", async (req, res) => {
    try {
        const result = await db.run("DELETE FROM saved_recipes WHERE id = ?", [
            req.params.id,
        ]);
        if (result.changes === 0) {
            return res
                .status(404)
                .json({ message: "Recipe not found or already deleted." });
        }
        res.status(200).json({ message: "Recipe deleted successfully." });
    } catch (error) {
        console.error("Failed to delete recipe:", error);
        res.status(500).json({ message: "Failed to delete recipe." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
