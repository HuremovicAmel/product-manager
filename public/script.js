
// DOM elements

const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const errorMessage = document.querySelector("#error-message");
const submitButton = document.querySelector(".primary-button");

let products = [];


// Show error message

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// Hide error message

function hideError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}


// Fetch products from API

async function fetchProducts() {
    try {
        hideError();

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Kunde inte hämta produkter.");
        }

        products = await response.json();

        renderProducts(products);

    } catch (error) {
        showError(error.message);
    }
}


// Render products in the table

function renderProducts(products) {

    productList.innerHTML = "";

    productCount.textContent =
        products.length === 1
            ? "1 produkt"
            : `${products.length} produkter`;

    if (products.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.className = "empty-state";
        cell.textContent = "Inga produkter har lagts till ännu.";

        row.appendChild(cell);
        productList.appendChild(row);

        return;
    }

    products.forEach((product) => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const skuCell = document.createElement("td");
        skuCell.textContent = product.sku;

        const priceCell = document.createElement("td");
        priceCell.textContent = `${product.price.toFixed(2)} kr`;

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Ta bort";
        deleteButton.className = "delete-button";
        deleteButton.dataset.id = product.id;
        deleteButton.type = "button";

        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(skuCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);

        productList.appendChild(row);
    });
}


// Add a new product

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideError();

    const newProduct = {
        name: document.querySelector("#name").value.trim(),
        price: Number(document.querySelector("#price").value),
        sku: document.querySelector("#sku").value.trim(),
        description: document.querySelector("#description").value.trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Sparar...";

    try {

        const response = await fetch("/api/products", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newProduct)
        });

        if (response.status !== 201) {

            const errorData = await response.json();

            throw new Error(
                errorData.message || "Kunde inte lägga till produkten."
            );
        }

        const createdProduct = await response.json();

        products.push(createdProduct);

        renderProducts(products);

        productForm.reset();

    } catch (error) {

        showError(error.message);

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "+ Lägg till produkt";

    }
});


// Load products when the page opens

fetchProducts();
