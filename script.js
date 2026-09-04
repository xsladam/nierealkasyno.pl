const loginBtn = document.getElementById("steam-login");
const balance = document.getElementById("balance");
const avatar = document.getElementById("avatar");
const settings = document.getElementById("settings");
const inventoryGUI = document.getElementById("inventory-gui");
const inventoryItems = document.getElementById("inventory-items");
const sellAllBtn = document.getElementById("sell-all");
const sortSelect = document.getElementById("sort-items");
const navCases = document.getElementById("nav-cases");

let inventory = [];
let userBalance = parseFloat(localStorage.getItem("balance")) || 0;

// Logowanie
const isLogged = localStorage.getItem("logged");
if (isLogged) {
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";
  balance.textContent = `${userBalance.toFixed(2)} zł`;
}

loginBtn.addEventListener("click", () => {
  localStorage.setItem("logged", "true");
  if (!localStorage.getItem("balance")) {
    localStorage.setItem("balance", "250");
    userBalance = 250;
  }
  loginBtn.style.display = "none";
  balance.style.display = "flex";
