let balance = Number(localStorage.getItem("fakeBalance"));

if (!balance) {
    balance = 250;
    localStorage.setItem("fakeBalance", balance);
}

let transactions = JSON.parse(
    localStorage.getItem("fakeTransactions") || "[]"
);

const balanceElement = document.getElementById("balance");
const transactionsElement = document.getElementById("transactions");

function updateBalance() {

    balanceElement.textContent =
        balance.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " zł";

    localStorage.setItem("fakeBalance", balance);
}

function addMoney(amount) {

    balance += amount;

    transactions.unshift({
        amount: amount,
        date: new Date().toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    save();
    updateBalance();
    renderTransactions();
}

function save() {

    localStorage.setItem(
        "fakeTransactions",
        JSON.stringify(transactions)
    );
}

function renderTransactions() {

    if (transactions.length === 0) {

        transactionsElement.innerHTML = `
            <div class="empty">
                Brak transakcji
            </div>
        `;

        return;
    }

    transactionsElement.innerHTML = "";

    transactions.forEach(transaction => {

        const element = document.createElement("div");

        element.className = "transaction";

        element.innerHTML = `
            <div>
                <div class="transaction-name">
                    Dodano wirtualne środki
                </div>

                <div class="transaction-time">
                    ${transaction.date}
                </div>
            </div>

            <div class="transaction-amount">
                +${transaction.amount.toFixed(2)} zł
            </div>
        `;

        transactionsElement.appendChild(element);
    });
}

document.getElementById("add10").addEventListener(
    "click",
    () => addMoney(10)
);

document.getElementById("add50").addEventListener(
    "click",
    () => addMoney(50)
);

document.getElementById("add100").addEventListener(
    "click",
    () => addMoney(100)
);

document.getElementById("addCustom").addEventListener(
    "click",
    () => {

        const input = document.getElementById("customAmount");

        const amount = Number(input.value);

        if (!amount || amount <= 0) {
            alert("Wpisz poprawną kwotę.");
            return;
        }

        addMoney(amount);

        input.value = "";
    }
);

document.getElementById("clearHistory").addEventListener(
    "click",
    () => {

        transactions = [];

        save();
        renderTransactions();
    }
);

document.getElementById("resetBtn").addEventListener(
    "click",
    () => {

        balance = 250;
        transactions = [];

        save();
        updateBalance();
        renderTransactions();
    }
);

updateBalance();
renderTransactions();
