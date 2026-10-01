// =======================================
// 1. GLOBAL STATE
// =======================================
let bst;
let cats = [];

// =======================================
// 2. FETCH CATS FROM DATABASE
// =======================================
async function loadCatsFromDB() {
    try {
        const response = await fetch('get_cats.php');
        const data = await response.json();

        if (data.success === false) {
            console.error("Database error:", data.message);
            return [];
        }

        return data.map(row => ({
            id: Number(row.id),
            name: row.cat_name,
            age: Number(row.age),
            breed: row.breed,
            emoji: "🐱"
        }));
    } catch (error) {
        console.error("Failed to fetch cats:", error);
        return [];
    }
}

// =======================================
// 3. NODE
// =======================================
class Node {
    constructor(cat) {
        this.cat = cat;
        this.left = null;
        this.right = null;
    }
}

// =======================================
// 4. BINARY SEARCH TREE
// =======================================
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(cat) {
        const newNode = new Node(cat);
        if (this.root === null) {
            this.root = newNode;
            return true;
        }
        let current = this.root;
        while (true) {
            if (cat.id === current.cat.id) return false;
            if (cat.id < current.cat.id) {
                if (current.left === null) { current.left = newNode; return true; }
                current = current.left;
            } else {
                if (current.right === null) { current.right = newNode; return true; }
                current = current.right;
            }
        }
    }

    search(id) {
        let current = this.root;
        while (current !== null) {
            if (id === current.cat.id) return current.cat;
            if (id < current.cat.id) current = current.left;
            else current = current.right;
        }
        return null;
    }
}

// =======================================
// 5. SET UP THE STORE
// =======================================
async function setupStore() {
    cats = await loadCatsFromDB();
    bst = new BinarySearchTree();
    cats.forEach(c => bst.insert(c));
    updateDashboard();
    document.getElementById("searchResult").textContent = "Enter a cat ID to find it.";
    document.getElementById("addMessage").textContent = "";
}

// =======================================
// 6. UPDATE DASHBOARD
// =======================================
function updateDashboard() {
    const grid = document.getElementById("gameGrid");
    grid.innerHTML = "";

    document.getElementById("totalProducts").textContent = cats.length;

    const totalAge = cats.reduce((total, c) => total + c.age, 0);
    document.getElementById("totalStock").textContent = totalAge;

    cats.forEach(cat => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <div class="game-cover">🐱</div>
            <div class="game-info">
                <span class="product-id">CAT ID: ${cat.id}</span>
                <h3></h3>
                <div class="game-price">Age: ${cat.age} years</div>
                <p class="stock">Breed: ${cat.breed}</p>
                <button type="button">Find Cat</button>
            </div>
        `;

        card.querySelector("h3").textContent = cat.name;

        card.querySelector("button").addEventListener("click", () => {
            document.getElementById("searchInput").value = cat.id;
            findProduct(cat.id);
            document.getElementById("searchForm").scrollIntoView({ behavior: "smooth", block: "center" });
        });

        grid.appendChild(card);
    });
}

// =======================================
// 7. FIND CAT (no BST steps)
// =======================================
function findProduct(id) {
    const cat = bst.search(id);
    const resultBox = document.getElementById("searchResult");

    resultBox.innerHTML = "";

    if (cat !== null) {
        const catDiv = document.createElement("div");
        catDiv.className = "found-product";

        catDiv.innerHTML = `
            <div class="result-emoji">🐱</div>
            <div>
                <h3></h3>
                <p>Cat ID: ${cat.id}</p>
                <p>Age: <strong>${cat.age} years</strong></p>
                <p>Breed: ${cat.breed}</p>
            </div>
        `;
        catDiv.querySelector("h3").textContent = cat.name;
        resultBox.appendChild(catDiv);
    } else {
        resultBox.textContent = "❌ Cat not found. Try another ID.";
    }
}

// =======================================
// 8. SEARCH FORM
// =======================================
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const id = Number(document.getElementById("searchInput").value);
    if (!Number.isSafeInteger(id) || id <= 0) return;
    findProduct(id);
});

// =======================================
// 9. ADD NEW CAT
// =======================================
document.getElementById("addForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id    = Number(document.getElementById("newId").value);
    const name  = document.getElementById("newName").value.trim();
    const age   = Number(document.getElementById("newPrice").value);
    const breed = document.getElementById("newStock").value.trim();
    const message = document.getElementById("addMessage");

    if (!Number.isSafeInteger(id) || id <= 0 || name === "" || !Number.isSafeInteger(age) || age < 0 || breed === "") {
        message.textContent = "Please enter valid cat details.";
        return;
    }

    const newCat = { id, cat_name: name, age, breed };

    try {
        const response = await fetch('add_cat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCat)
        });

        const result = await response.json();

        if (result.success === false) {
            message.textContent = result.message;
            return;
        }

        const catForTree = { id, name, age, breed, emoji: "🐱" };
        const inserted = bst.insert(catForTree);
        if (inserted === false) {
            message.textContent = "❌ This Cat ID already exists.";
            return;
        }

        cats.push(catForTree);
        updateDashboard();

        message.textContent = "✅ Cat added to the database!";
        document.getElementById("searchInput").value = id;
        findProduct(id);
        this.reset();

    } catch (error) {
        console.error(error);
        message.textContent = "❌ Could not connect to the database.";
    }
});

// =======================================
// 10. START
// =======================================
setupStore();