const budgetForm = document.querySelector("#budget-form");
const budgetInput = document.querySelector("#budget");
const expensesForm = document.querySelector("#expenses-form");
const expenseNameInput = document.querySelector("#expense-name");
const expenseAmountInput = document.querySelector("#expense-amount");
const expensesList = document.querySelector(".expenses_list");
const errorMessage = document.querySelector(".error_message");
const totalBudgetDisplay = document.querySelector("#total-budget");
const totalExpensesDisplay = document.querySelector("#total-expenses");
const remainingBudgetDisplay = document.querySelector("#remaining-budget");

let budgetAmount = 0;
let expenses = [];

const updateLocalStorage = () => {
  localStorage.setItem("budget", JSON.stringify(budgetAmount));
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

// Updates the data using local storage
const loadFromLocalStorage = () => {
  const budgetStored = JSON.parse(localStorage.getItem("budget"));
  const expensesStored = JSON.parse(localStorage.getItem("expenses"));
  if (budgetStored) budgetAmount = budgetStored;
  if (expensesStored) expenses = expensesStored;
};

const calculatesTotalAmount = () => {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remainingBudget = budgetAmount - totalExpenses;

  totalBudgetDisplay.textContent = budgetAmount;
  totalExpensesDisplay.textContent = totalExpenses;
  remainingBudgetDisplay.textContent = remainingBudget;
};

const updateDisplay = () => {
  expensesList.innerHTML = "";

  expenses.forEach((expense, index) => {
    const expenseElem = document.createElement("div");
    expenseElem.classList.add("expense");
    expenseElem.innerHTML = `
      <span>${expense.name}: $${expense.amount}</span>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expensesList.appendChild(expenseElem);
  });

  calculatesTotalAmount();
};

const deleteExpense = (index) => {
  expenses.splice(index, 1);
  updateLocalStorage();
  updateDisplay();
};

const addExpense = (name, amount) => {
  expenses.push({ name, amount });
  updateLocalStorage();
  updateDisplay();
};

// Adding eventListner to the budgetForm and expensesForm

budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const budget = parseFloat(budgetInput.value);
  if (!isNaN(budget) && budget > 0) {
    budgetAmount = budget;
    errorMessage.style.display = "none";
    updateLocalStorage();
    calculatesTotalAmount();
  } else {
    errorMessage.style.display = "block";
  }
  budgetInput.value = "";
});

expensesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value);
  if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
    addExpense(expenseName, expenseAmount);
    errorMessage.style.display = "none";
  } else {
    errorMessage.style.display = "block";
  }
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  updateDisplay();
});
