// DOM Elements
const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");

const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const editIdInput = document.getElementById("edit-id");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const transactionListEl = document.getElementById("transaction-list");
const filterCategoryEl = document.getElementById("filter-category");

// State
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Set default date to today
dateInput.valueAsDate = new Date();

// Initialize App
function init() {
  renderTransactions();
  updateTotals();
}

// Update Overview Totals
function updateTotals() {
  const amounts = transactions.map((t) => (t.type === "income" ? t.amount : -t.amount));

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  totalBalanceEl.innerText = `₹${total}`;
  totalIncomeEl.innerText = `₹${income}`;
  totalExpenseEl.innerText = `₹${expense}`;
}

// Render Transaction List
function renderTransactions() {
  const selectedCategory = filterCategoryEl.value;
  transactionListEl.innerHTML = "";

  const filteredTransactions = transactions.filter((t) => {
    return selectedCategory === "all" || t.category === selectedCategory;
  });

  if (filteredTransactions.length === 0) {
    transactionListEl.innerHTML = `<li style="text-align: center; color: #888;">No transactions found.</li>`;
    return;
  }

  filteredTransactions.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item", t.type);

    const sign = t.type === "income" ? "+" : "-";

    li.innerHTML = `
      <div class="item-details">
        <span class="item-title">${t.description}</span>
        <span class="item-meta">${t.category} | ${t.date}</span>
      </div>
      <div class="item-actions">
        <span class="item-amount">${sign}₹${t.amount.toFixed(2)}</span>
        <button class="action-btn edit-btn" onclick="editTransaction('${t.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteTransaction('${t.id}')">Delete</button>
      </div>
    `;

    transactionListEl.appendChild(li);
  });
}

// Save to Local Storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = editIdInput.value ? editIdInput.value : Date.now().toString();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  const transactionData = { id, description, amount, type, category, date };

  if (editIdInput.value) {
    // Update existing transaction
    transactions = transactions.map((t) => (t.id === id ? transactionData : t));
    resetForm();
  } else {
    // Add new transaction
    transactions.push(transactionData);
  }

  updateLocalStorage();
  init();
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Edit Transaction
window.editTransaction = function (id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  editIdInput.value = transaction.id;
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;

  formTitle.innerText = "Edit Transaction";
  submitBtn.innerText = "Update Transaction";
  cancelBtn.classList.remove("hidden");
};

// Cancel Edit Mode
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editIdInput.value = "";
  form.reset();
  dateInput.valueAsDate = new Date();
  formTitle.innerText = "Add New Transaction";
  submitBtn.innerText = "Add Transaction";
  cancelBtn.classList.add("hidden");
}

// Delete Transaction
window.deleteTransaction = function (id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  init();
};

// Category Filter Change
filterCategoryEl.addEventListener("change", renderTransactions);

// Start app
init();
