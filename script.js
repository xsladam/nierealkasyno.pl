```javascript
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTY
    const loginBtn = document.getElementById("steam-login");
    const balanceEl = document.getElementById("balance");
    const avatar = document.getElementById("avatar");

    const casePreview = document.getElementById("case-preview");
    const caseOpen = document.getElementById("case-open");
    const caseClick = document.getElementById("case-click");
    const backBtn = document.getElementById("back-to-cases");
    const openBtn = document.getElementById("open-case");

    const inventoryGUI = document.getElementById("inventory-gui");
    const inventoryItems = document.getElementById("inventory-items");
    const sellAllBtn = document.getElementById("sell-all");
    const sortSelect = document.getElementById("sort-items");

    // DANE
    const CASE_PRICE = 20;

    const items = [
        {
            name: "AK-47 | Redline",
            price: 35,
            rarity: "red"
        },
        {
            name: "M4A4 | Evil Daimyo",
            price: 28,
            rarity: "purple"
        },
        {
            name: "AWP | Atheris",
            price: 22,
            rarity: "blue"
        },
        {
            name: "USP-S | Cortex",
            price: 18,
            rarity: "pink"
        },
        {
            name: "P250 | Valence",
            price: 10,
            rarity: "blue"
        }
    ];

    let balance = Number(localStorage.getItem("balance")) || 0;

    let inventory = JSON.parse(
        localStorage.getItem("inventory") || "[]"
    );


    // =========================
    // SALDO
    // =========================

    function updateBalance() {
        balanceEl.textContent = balance.toFixed(2) + " zł";
        localStorage.setItem("balance", balance);
    }


    // =========================
    // LOGOWANIE
    // =========================

    function login() {

        localStorage.setItem("logged", "true");

        if (balance <= 0) {
            balance = 250;
        }

        localStorage.setItem("balance", balance);

        loginBtn.style.display = "none";
        balanceEl.style.display = "flex";
        avatar.style.display = "block";

        updateBalance();
    }


    if (localStorage.getItem("logged") === "true") {
        login();
    }


    loginBtn.addEventListener("click", login);


    // =========================
    // OTWIERANIE WIDOKU SKRZYNKI
    // =========================

    caseClick.addEventListener("click", () => {

        console.log("Kliknięto skrzynkę");

        casePreview.style.display = "none";
        caseOpen.style.display = "block";

    });


    // =========================
    // POWRÓT
    // =========================

    backBtn.addEventListener("click", (e) => {

        e.preventDefault();

        caseOpen.style.display = "none";
        casePreview.style.display = "block";

    });


    // =========================
    // LOSOWANIE
    // =========================

    function randomItem() {

        const random = Math.random();

        if (random < 0.05) {
            return items[0];
        }

        if (random < 0.15) {
            return items[1];
        }

        if (random < 0.40) {
            return items[2];
        }

        if (random < 0.70) {
            return items[3];
        }

        return items[4];
    }


    // =========================
    // OTWIERANIE SKRZYNKI
    // =========================

    openBtn.addEventListener("click", () => {

        if (localStorage.getItem("logged") !== "true") {
            alert("Najpierw kliknij „Zaloguj przez Steam”.");
            return;
        }

        if (balance < CASE_PRICE) {
            alert("Nie masz wystarczająco dużo pieniędzy.");
            return;
        }

        balance -= CASE_PRICE;
        updateBalance();

        openBtn.disabled = true;
        openBtn.textContent = "Losowanie...";

        const roll = document.querySelector(".case-roll");

        roll.classList.add("rolling");

        setTimeout(() => {

            const item = randomItem();

            const newItem = {
                id: Date.now(),
                name: item.name,
                price: item.price,
                rarity: item.rarity
            };

            inventory.push(newItem);

            localStorage.setItem(
                "inventory",
                JSON.stringify(inventory)
            );

            roll.classList.remove("rolling");

            roll.innerHTML = `
                <div class="won-item ${item.rarity}">
                    <div class="won-label">WYGRAŁEŚ</div>
                    <div class="won-name">${item.name}</div>
                    <div class="won-price">
                        ${item.price.toFixed(2)} zł
                    </div>
                </div>
            `;

            openBtn.disabled = false;
            openBtn.textContent = "Otwórz ponownie za 20 zł";

            renderInventory();

        }, 2000);

    });


    // =========================
    // EKWIPUNEK
    // =========================

    function renderInventory() {

        inventoryItems.innerHTML = "";

        if (inventory.length === 0) {

            inventoryItems.innerHTML = `
                <div class="empty-inventory">
                    Ekwipunek jest pusty
                </div>
            `;

            return;
        }

        let list = [...inventory];

        if (sortSelect.value === "expensive") {

            list.sort((a, b) => b.price - a.price);

        } else {

            list.reverse();

        }

        list.forEach(item => {

            const div = document.createElement("div");

            div.className = `inventory-item ${item.rarity}`;

            div.innerHTML = `
                <div class="inventory-item-name">
                    ${item.name}
                </div>

                <div class="inventory-item-price">
                    ${item.price.toFixed(2)} zł
                </div>

                <button class="sell-item">
                    Sprzedaj
                </button>
            `;

            div.querySelector(".sell-item")
                .addEventListener("click", () => {

                    sellItem(item.id);

                });

            inventoryItems.appendChild(div);

        });

    }


    // =========================
    // OTWIERANIE EKWIPUNKU
    // =========================

    avatar.addEventListener("click", () => {

        if (inventoryGUI.style.display === "block") {

            inventoryGUI.style.display = "none";

        } else {

            inventoryGUI.style.display = "block";
            renderInventory();

        }

    });


    // =========================
    // SPRZEDAŻ
    // =========================

    function sellItem(id) {

        const index = inventory.findIndex(
            item => item.id === id
        );

        if (index === -1) {
            return;
        }

        balance += inventory[index].price;

        inventory.splice(index, 1);

        localStorage.setItem(
            "inventory",
            JSON.stringify(inventory)
        );

        updateBalance();
        renderInventory();

    }


    // =========================
    // SPRZEDAJ WSZYSTKO
    // =========================

    sellAllBtn.addEventListener("click", () => {

        let total = 0;

        inventory.forEach(item => {
            total += item.price;
        });

        balance += total;

        inventory = [];

        localStorage.setItem(
            "inventory",
            JSON.stringify(inventory)
        );

        updateBalance();
        renderInventory();

    });


    // =========================
    // SORTOWANIE
    // =========================

    sortSelect.addEventListener("change", renderInventory);


    // START
    updateBalance();
    renderInventory();

});
```
