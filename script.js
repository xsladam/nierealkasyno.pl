const loginBtn = document.getElementById("steam-login");
const balance = document.getElementById("balance");
const avatar = document.getElementById("avatar");
const settings = document.getElementById("settings");

// Sprawdź, czy użytkownik jest zalogowany
const isLogged = localStorage.getItem("logged");

// Jeśli zalogowany → pokaż GUI, ukryj login
if (isLogged) {
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";

  balance.textContent = localStorage.getItem("balance") || "0,00";
}

// Obsługa logowania
loginBtn.addEventListener("click", () => {

  // Udawane logowanie
  localStorage.setItem("logged", "true");

  // Startowy balans tylko przy pierwszym wejściu
  if (!localStorage.getItem("balance")) {
    localStorage.setItem("balance", "250,00");
  }

  // Aktualizacja GUI
  loginBtn.style.display = "none";
  balance.style.display = "flex";
  avatar.style.display = "block";
  settings.style.display = "block";

  balance.textContent = localStorage.getItem("balance");
});

