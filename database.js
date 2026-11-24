
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "products.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK(price > 0),
        sku TEXT NOT NULL,
        description TEXT NOT NULL
    )
`, (error) => {
    if (error) {
        console.error("Could not create table:", error.message);
    } else {
        console.log("Products table is ready");
    }
});

module.exports = db;
