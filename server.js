
const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));


// GET - Get all products

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


// POST - Create a new product

app.post("/api/products", (req, res) => {

    const { name, price, sku, description } = req.body || {};

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof sku !== "string" ||
        !sku.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {
        return res.status(400).json({
            message: "Alla fält måste fyllas i och priset måste vara positivt."
        });
    }

    const sql = `
        INSERT INTO products (name, price, sku, description)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, price, sku, description], function (error) {

        if (error) {
            return res.status(500).json({
                message: "Kunde inte lägga till produkten."
            });
        }

        const newProduct = {
            id: this.lastID,
            name,
            price,
            sku,
            description
        };

        res.status(201).json(newProduct);
    });
});


// DELETE - Delete a product

app.delete("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Ogiltigt produkt-ID."
        });
    }

    const sql = "DELETE FROM products WHERE id = ?";

    db.run(sql, [id], function (error) {

        if (error) {
            return res.status(500).json({
                message: "Kunde inte ta bort produkten."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Produkten hittades inte."
            });
        }

        res.status(204).end();
    });
});


// Start server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
