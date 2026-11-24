
const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Get all products
app.get("/api/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.all(sql, [], (error, products) => {

        if (error) {
            return res.status(500).json({
                message: "Kunde inte hämta produkter."
            });
        }

        res.status(200).json(products);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
