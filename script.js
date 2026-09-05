const loginBtn = document.getElementById("steam-login");
const balance = document.getElementById("balance");
const avatar = document.getElementById("avatar");
const settings = document.getElementById("settings");

const inventoryGUI = document.getElementById("inventory-gui");
const inventoryItems = document.getElementById("inventory-items");
const sellAllBtn = document.getElementById("sell-all");
const sortSelect = document.getElementById("sort-items");

const navCases = document.getElementById("nav-cases");

const casePreview = document.getElementById("case-preview");
const caseOpen = document.getElementById("case-open");
const caseClick = document.getElementById("case-click");
const backToCases = document.getElementById("back-to-cases");
const openCaseBtn = document.getElementById("open-case");


// =========================
// DANE
// =========================

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

const CASE_PRICE = 20;

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let userBalance = parseFloat(localStorage.getItem("balance")) || 0;


// =========================
// LOGOWANIE
// =========================

const isLogged = localStorage.getItem("logged");

if (isLogged) {
  showLoggedUser();
}

loginBtn.addEventListener("click", () => {

  localStorage.setItem("logged", "true");

  if (!localStorage.getItem("balance")) {
    userBalance = 250;
    localStorage.setItem("balance", "250");
  }

  showLoggedUser();
});


function showLoggedUser() {
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";

  updateBalance();
  renderInventory();
}


// =========================
// SALDO
// =========================

function updateBalance() {
  balance.textContent = `${userBalance.toFixed(2)} zł`;
  localStorage.setItem("balance", userBalance.toString());
}


// =========================
// OTWIERANIE SKRZYNKI
// =========================

// Kliknięcie miniatury skrzynki
caseClick.addEventListener("click", () => {

  casePreview.style.display = "none";
  caseOpen.style.display = "block";

});


// Powrót
backToCases.addEventListener("click", (event) => {

  event.preventDefault();

  caseOpen.style.display = "none";
  casePreview.style.display = "block";

});


// =========================
// LOSOWANIE PRZEDMIOTU
// =========================

function getRandomItem() {

  const random = Math.random();

  // Prosty system szans
  if (random < 0.05) {
    return items[0]; // AK-47
  }

  if (random < 0.15) {
    return items[1]; // M4A4
  }

  if (random < 0.40) {
    return items[2]; // AWP
  }

  if (random < 0.70) {
    return items[3]; // USP-S
  }

  return items[4]; // P250
}


// =========================
// OTWIERANIE
// =========================

openCaseBtn.addEventListener("click", () => {

  if (!isUserLogged()) {
    alert("Najpierw zaloguj się przez Steam.");
    return;
  }

  if (userBalance < CASE_PRICE) {
    alert("Nie masz wystarczająco dużo środków.");
    return;
  }

  // Zabieramy 20 zł
  userBalance -= CASE_PRICE;
  updateBalance();

  openCaseBtn.disabled = true;
  openCaseBtn.textContent = "Losowanie...";

  const roll = document.querySelector(".case-roll");

  roll.classList.add("rolling");

  // Animacja trwa 2 sekundy
  setTimeout(() => {

    const wonItem = getRandomItem();

    // Dodanie przedmiotu do ekwipunku
    inventory.push({
      ...wonItem,
      id: Date.now()
    });

    localStorage.setItem("inventory", JSON.stringify(inventory));

    roll.classList.remove("rolling");

    // Pokazujemy wygraną
    roll.innerHTML = `
      <div class="won-item ${wonItem.rarity}">
        <div class="won-label">WYGRAŁEŚ</div>
        <div class="won-name">${wonItem.name}</div>
        <div class="won-price">${wonItem.price.toFixed(2)} zł</div>
      </div>
    `;

    openCaseBtn.disabled = false;
    openCaseBtn.textContent = "Otwórz ponownie za 20 zł";

    renderInventory();

  }, 2000);

});


// =========================
// SPRAWDZANIE LOGOWANIA
// =========================

function isUserLogged() {
  return localStorage.getItem("logged") === "true";
}


// =========================
// EKWIPUNEK
// =========================

function renderInventory() {

  if (!inventoryItems) return;

  inventoryItems.innerHTML = "";

  if (inventory.length === 0) {

    inventoryItems.innerHTML = `
      <div class="empty-inventory">
        Ekwipunek jest pusty
      </div>
    `;

    return;
  }

  let sortedInventory = [...inventory];

  if (sortSelect.value === "expensive") {

    sortedInventory.sort((a, b) => b.price - a.price);

  } else {

    sortedInventory.reverse();

  }


  sortedInventory.forEach(item => {

    const element = document.createElement("div");

    element.className = `inventory-item ${item.rarity}`;

    element.innerHTML = `
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


    const sellButton = element.querySelector(".sell-item");

    sellButton.addEventListener("click", () => {

      sellItem(item.id);

    });


    inventoryItems.appendChild(element);

  });

}


// =========================
// OTWIERANIE EKWIPUNKU
// =========================

// Kliknięcie avatara otwiera/zamyka ekwipunek
avatar.addEventListener("click", () => {

  if (inventoryGUI.style.display === "none" ||
      inventoryGUI.style.display === "") {

    inventoryGUI.style.display = "block";
    renderInventory();

  } else {

    inventoryGUI.style.display = "none";

  }

});


// =========================
// SPRZEDAŻ PRZEDMIOTU
// =========================

function sellItem(id) {

  const itemIndex = inventory.findIndex(item => item.id === id);

  if (itemIndex === -1) return;

  const item = inventory[itemIndex];

  userBalance += item.price;

  inventory.splice(itemIndex, 1);

  localStorage.setItem("inventory", JSON.stringify(inventory));

  updateBalance();
  renderInventory();

}


// =========================
// SPRZEDAJ WSZYSTKO
// =========================

sellAllBtn.addEventListener("click", () => {

  if (inventory.length === 0) return;

  const total = inventory.reduce(
    (sum, item) => sum + item.price,
    0
  );

  userBalance += total;

  inventory = [];

  localStorage.setItem("inventory", JSON.stringify(inventory));

  updateBalance();
  renderInventory();

});


// =========================
// SORTOWANIE
// =========================

sortSelect.addEventListener("change", () => {

  renderInventory();

});


// =========================
// SKRZYNKI
// =========================

navCases.addEventListener("click", (event) => {

  event.preventDefault();

  caseOpen.style.display = "none";
  inventoryGUI.style.display = "none";
  casePreview.style.display = "block";

});
