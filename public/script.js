
// DOM elements

const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const errorMessage = document.querySelector("#error-message");
const successMessage = document.querySelector("#success-message");
const submitButton = document.querySelector(".primary-button");

let products = [];
let messageTimeout;
let isBusy = false;


// Show error message

function showError(message) {
    hideMessages();

    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// Show success message

function showSuccess(message) {
    hideMessages();

    successMessage.textContent = message;
    successMessage.hidden = false;

    messageTimeout = setTimeout(() => {
        successMessage.hidden = true;
    }, 4000);
}


// Hide messages

function hideMessages() {
    clearTimeout(messageTimeout);

    errorMessage.textContent = "";
    errorMessage.hidden = true;

    successMessage.textContent = "";
    successMessage.hidden = true;
}


// Control request state

function setBusy(value) {
    isBusy = value;
    submitButton.disabled = value;

    document.querySelectorAll(".delete-button").forEach((button) => {
        button.disabled = value;
    });
}


// Fetch products from API

async function fetchProducts() {

    setBusy(true);

    try {

        hideMessages();

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Kunde inte hämta produkter.");
        }

        products = await response.json();

        renderProducts(products);

    } catch (error) {

        showError("Kunde inte hämta produkter. Försök igen.");

    } finally {

        setBusy(false);

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

        deleteButton.className = "delete-button";
        deleteButton.dataset.id = product.id;
        deleteButton.type = "button";
        deleteButton.title = "Ta bort produkt";
        deleteButton.disabled = isBusy;

        deleteButton.setAttribute(
            "aria-label",
            `Ta bort ${product.name}`
        );

        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                <path d="M3 6h18"/>
                <path d="M19 6v14H5V6"/>
                <path d="M8 6V3h8v3"/>
                <line x1="10" y1="10" x2="10" y2="17"/>
                <line x1="14" y1="10" x2="14" y2="17"/>
            </svg>
        `;

        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(skuCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);

        productList.appendChild(row);
    });
}


// Validate product

function validateProduct(product) {

    if (!product.name || !product.sku || !product.description) {
        return "Alla fält måste fyllas i.";
    }

    if (!Number.isFinite(product.price) || product.price <= 0) {
        return "Priset måste vara ett positivt nummer.";
    }

    return null;
}


// Read API error

async function getApiError(response, fallbackMessage) {

    try {
        const data = await response.json();

        return data.message || fallbackMessage;

    } catch (error) {

        return fallbackMessage;

    }
}


// Add a new product

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (isBusy) {
        return;
    }

    hideMessages();

    const newProduct = {
        name: document.querySelector("#name").value.trim(),
        price: Number(document.querySelector("#price").value),
        sku: document.querySelector("#sku").value.trim(),
        description: document.querySelector("#description").value.trim()
    };

    const validationError = validateProduct(newProduct);

    if (validationError) {
        showError(validationError);
        return;
    }

    setBusy(true);

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

            const message = await getApiError(
                response,
                "Kunde inte lägga till produkten."
            );

            showError(message);
            return;
        }

        const createdProduct = await response.json();

        products.push(createdProduct);

        renderProducts(products);

        productForm.reset();

        showSuccess("Produkten har lagts till!");

    } catch (error) {

        showError("Kunde inte lägga till produkten. Försök igen.");

    } finally {

        setBusy(false);

        submitButton.textContent = "+ Lägg till produkt";

    }
});


// Delete button event listener

productList.addEventListener("click", async (event) => {

    const deleteButton = event.target.closest(".delete-button");

    if (!deleteButton || isBusy || deleteButton.disabled) {
        return;
    }

    const id = Number(deleteButton.dataset.id);

    const confirmed = confirm(
        "Är du säker på att du vill ta bort produkten?"
    );

    if (!confirmed) {
        return;
    }

    await deleteProduct(id);
});


// Delete product from API

async function deleteProduct(id) {

    hideMessages();

    setBusy(true);

    try {

        const response = await fetch(`/api/products/${id}`, {
            method: "DELETE"
        });

        if (response.status !== 204) {

            const message = await getApiError(
                response,
                "Kunde inte ta bort produkten."
            );

            showError(message);
            return;
        }

        products = products.filter((product) => product.id !== id);

        renderProducts(products);

        showSuccess("Produkten har tagits bort!");

    } catch (error) {

        showError("Kunde inte ta bort produkten. Försök igen.");

    } finally {

        setBusy(false);

    }
}


// Load products when the page opens

fetchProducts();
