const loginBtn = document.getElementById("steam-login");
const balance = document.getElementById("balance");
const avatar = document.getElementById("avatar");
const settings = document.getElementById("settings");
const inventoryGUI = document.getElementById("inventory-gui");
const inventoryItems = document.getElementById("inventory-items");
const sellAllBtn = document.getElementById("sell-all");
const sortSelect = document.getElementById("sort-items");

let inventory = [];
let userBalance = parseFloat(localStorage.getItem("balance")) || 0;

// Sprawdź logowanie
const isLogged = localStorage.getItem("logged");
if (isLogged) {
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";
  balance.textContent = `${userBalance.toFixed(2)} zł`;
}

// Logowanie
loginBtn.addEventListener("click", () => {
  localStorage.setItem("logged", "true");
  if (!localStorage.getItem("balance")) {
    localStorage.setItem("balance", "250");
    userBalance = 250;
  }
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";
  balance.textContent = `${userBalance.toFixed(2)} zł`;
});

// Kliknięcie avatara → otwiera GUI ekwipunku (z warunkiem)
avatar.addEventListener("click", () => {
  const isHidden = inventoryGUI.style.display === "none" || inventoryGUI.style.display === "";
  inventoryGUI.style.display = isHidden ? "block" : "none";
  if (isHidden) renderInventory();
});

// Renderowanie ekwipunku
function renderInventory() {
  inventoryItems.innerHTML = "";
  if (inventory.length === 0) {
    inventoryItems.innerHTML = "<p>Twój ekwipunek jest pusty. Otwórz parę skrzynek!</p>";
    return;
  }
  inventory.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.textContent = `${item.name} (${item.value.toFixed(2)} zł)`;
    inventoryItems.appendChild(div);
  });
}

// Sortowanie
sortSelect.addEventListener("change", () => {
  if (sortSelect.value === "newest") {
    inventory.sort((a, b) => b.id - a.id);
  } else if (sortSelect.value === "expensive") {
    inventory.sort((a, b) => b.value - a.value);
  }
  renderInventory();
});

// Sprzedaj wszystko
sellAllBtn.addEventListener("click", () => {
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
  userBalance += totalValue;
  localStorage.setItem("balance", userBalance);
  balance.textContent = `${userBalance.toFixed(2)} zł`;
  inventory = [];
  renderInventory();
});

// Kliknięcie "Skrzynki" zamyka ekwipunek
const navCases = document.getElementById("nav-cases");
navCases.addEventListener("click", () => {
  inventoryGUI.style.display = "none";
});

// Testowe przedmioty (tymczasowo)
inventory = [
  { id: 1, name: "Nóż", value: 120.00 },
  { id: 2, name: "Karabin", value: 80.00 },
  { id: 3, name: "Pistolet", value: 45.00 },
  { id: 4, name: "Rękawice", value: 60.00 }
];
