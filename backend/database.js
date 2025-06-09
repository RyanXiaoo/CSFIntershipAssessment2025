// backend/database.js
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function setup() {
    const db = await open({
        filename: "./recipes.db",
        driver: sqlite3.Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS saved_recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            spoonacularId INTEGER UNIQUE,
            title TEXT NOT NULL,
            image TEXT,
            servings INTEGER,
            readyInMinutes INTEGER,
            sourceUrl TEXT,
            sourceName TEXT,
            diets TEXT,
            calories REAL,
            protein REAL,
            fat REAL,
            carbs REAL
        )
    `);

    return db;
}

module.exports = setup;
