// =========================================================
// EXPENSE TRACKER - JAVASCRIPT
// =========================================================


// =========================================================
// GLOBAL VARIABLES
// =========================================================

// Store all transactions
let transactions = [];

// Track whether we are editing a transaction
let editingId = null;

// Store the expense chart
let expenseChart = null;


// =========================================================
// DOM ELEMENTS
// =========================================================

const transactionForm = document.getElementById("transaction-form");

const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList = document.getElementById("transaction-list");

const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const currentBalanceElement = document.getElementById("current-balance");

const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");

const submitButton = document.getElementById("submit-btn");


// =========================================================
// LOAD DATA FROM LOCAL STORAGE
// =========================================================

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("expenseTrackerTransactions");

    if (savedTransactions) {

        try {

            transactions = JSON.parse(savedTransactions);

        } catch (error) {

            console.error("Could not load saved transactions:", error);

            transactions = [];

        }

    }

}


// =========================================================
// SAVE DATA TO LOCAL STORAGE
// =========================================================

function saveTransactions() {

    localStorage.setItem(
        "expenseTrackerTransactions",
        JSON.stringify(transactions)
    );

}


// =========================================================
// FORMAT CURRENCY
// =========================================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR"

    }).format(amount);

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(date) {

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


// =========================================================
// SET DEFAULT DATE
// =========================================================

function setDefaultDate() {

    // Automatically set today's date
    dateInput.valueAsDate = new Date();

}


// =========================================================
// ADD / EDIT TRANSACTION
// =========================================================

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get form values

    const type = typeInput.value;

    const amount = Number(amountInput.value);

    const category = categoryInput.value;

    const date = dateInput.value;

    const description = descriptionInput.value.trim();


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!type) {

        alert("Please select a transaction type.");

        typeInput.focus();

        return;

    }


    if (!amount || amount <= 0) {

        alert("Please enter an amount greater than ₹0.");

        amountInput.focus();

        return;

    }


    if (!category) {

        alert("Please select a category.");

        categoryInput.focus();

        return;

    }


    if (!date) {

        alert("Please select a date.");

        dateInput.focus();

        return;

    }


    if (!description) {

        alert("Please enter a description.");

        descriptionInput.focus();

        return;

    }


    if (description.length < 2) {

        alert("Description must contain at least 2 characters.");

        descriptionInput.focus();

        return;

    }


    // =====================================================
    // PREVENT FUTURE DATES
    // =====================================================

    const selectedDate = new Date(date);

    const today = new Date();

    today.setHours(23, 59, 59, 999);


    if (selectedDate > today) {

        alert("Transaction date cannot be in the future.");

        dateInput.focus();

        return;

    }


    // =====================================================
    // EDIT EXISTING TRANSACTION
    // =====================================================

    if (editingId !== null) {

        transactions = transactions.map(function (transaction) {

            if (transaction.id === editingId) {

                return {

                    ...transaction,

                    type: type,

                    amount: amount,

                    category: category,

                    date: date,

                    description: description

                };

            }


            return transaction;

        });


        // Exit edit mode

        editingId = null;

        submitButton.textContent = "Add Transaction";

    }


    // =====================================================
    // ADD NEW TRANSACTION
    // =====================================================

    else {

        const newTransaction = {

            id: Date.now(),

            type: type,

            amount: amount,

            category: category,

            date: date,

            description: description

        };


        transactions.push(newTransaction);

    }


    // =====================================================
    // SAVE DATA
    // =====================================================

    saveTransactions();


    // =====================================================
    // UPDATE APPLICATION
    // =====================================================

    renderTransactions();

    updateSummary();

    updateMonthlySummary();

    updateChart();


    // =====================================================
    // RESET FORM
    // =====================================================

    transactionForm.reset();

    // Restore today's date after resetting the form
    setDefaultDate();

});


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateSummary() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        }


        else if (transaction.type === "expense") {

            totalExpenses += transaction.amount;

        }

    });


    const balance = totalIncome - totalExpenses;


    totalIncomeElement.textContent =
        formatCurrency(totalIncome);

    totalExpensesElement.textContent =
        formatCurrency(totalExpenses);

    currentBalanceElement.textContent =
        formatCurrency(balance);

}


// =========================================================
// RENDER TRANSACTIONS
// =========================================================

function renderTransactions() {

    const selectedType = filterType.value;

    const selectedCategory = filterCategory.value;


    // =====================================================
    // APPLY FILTERS
    // =====================================================

    const filteredTransactions = transactions.filter(
        function (transaction) {

            const typeMatches =
                selectedType === "all" ||
                transaction.type === selectedType;


            const categoryMatches =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return typeMatches && categoryMatches;

        }
    );


    // =====================================================
    // NO TRANSACTIONS
    // =====================================================

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <p>No transactions found.</p>

                <span>
                    Add a transaction or change your filters.
                </span>

            </div>

        `;

        return;

    }


    // =====================================================
    // DISPLAY TRANSACTIONS
    // =====================================================

    transactionList.innerHTML = filteredTransactions

        .sort(function (a, b) {

            return new Date(b.date) - new Date(a.date);

        })

        .map(function (transaction) {

            const isIncome =
                transaction.type === "income";


            return `

                <div class="transaction">

                    <div class="transaction-info">

                        <div class="transaction-icon ${transaction.type}">

                            ${isIncome ? "+" : "-"}

                        </div>


                        <div class="transaction-details">

                            <h4>

                                ${escapeHTML(
                                    transaction.description
                                )}

                            </h4>


                            <p>

                                ${escapeHTML(
                                    transaction.category
                                )}

                                •
                                
                                ${formatDate(transaction.date)}

                            </p>

                        </div>

                    </div>


                    <div class="transaction-right">

                        <div class="transaction-amount ${transaction.type}">

                            ${isIncome ? "+" : "-"}

                            ${formatCurrency(transaction.amount)}

                        </div>


                        <div class="action-buttons">

                            <button
                                class="edit-btn"
                                onclick="editTransaction(${transaction.id})"
                            >

                                Edit

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteTransaction(${transaction.id})"
                            >

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            `;

        })

        .join("");

}


// =========================================================
// DELETE TRANSACTION
// =========================================================

function deleteTransaction(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );


    if (!confirmed) {

        return;

    }


    transactions = transactions.filter(
        function (transaction) {

            return transaction.id !== id;

        }
    );


    // Save updated data

    saveTransactions();


    // Update application

    renderTransactions();

    updateSummary();

    updateMonthlySummary();

    updateChart();

}


// =========================================================
// EDIT TRANSACTION
// =========================================================

function editTransaction(id) {

    const transaction = transactions.find(
        function (transaction) {

            return transaction.id === id;

        }
    );


    if (!transaction) {

        return;

    }


    // Fill form with existing transaction

    typeInput.value = transaction.type;

    amountInput.value = transaction.amount;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;

    descriptionInput.value = transaction.description;


    // Enable edit mode

    editingId = id;

    submitButton.textContent = "Update Transaction";


    // Scroll to form

    transactionForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =========================================================
// FILTER EVENTS
// =========================================================

filterType.addEventListener("change", function () {

    renderTransactions();

});


filterCategory.addEventListener("change", function () {

    renderTransactions();

});


// =========================================================
// HTML ESCAPE
// Prevents unsafe HTML from user input
// =========================================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// =========================================================
// MONTHLY SUMMARY
// =========================================================

function updateMonthlySummary() {

    const monthlySummary =
        document.getElementById("monthly-summary");


    if (transactions.length === 0) {

        monthlySummary.innerHTML = `

            <p>No monthly data available.</p>

        `;

        return;

    }


    const currentDate = new Date();

    const currentMonth =
        currentDate.getMonth();

    const currentYear =
        currentDate.getFullYear();


    let monthlyIncome = 0;

    let monthlyExpenses = 0;


    transactions.forEach(function (transaction) {

        const transactionDate =
            new Date(transaction.date);


        if (

            transactionDate.getMonth() === currentMonth &&

            transactionDate.getFullYear() === currentYear

        ) {

            if (transaction.type === "income") {

                monthlyIncome += transaction.amount;

            }

            else {

                monthlyExpenses += transaction.amount;

            }

        }

    });


    const monthlyBalance =
        monthlyIncome - monthlyExpenses;


    monthlySummary.innerHTML = `

        <div class="month-summary">


            <div class="month-item">

                <h4>Monthly Income</h4>

                <p style="color: #16a34a;">

                    ${formatCurrency(monthlyIncome)}

                </p>

            </div>


            <div class="month-item">

                <h4>Monthly Expenses</h4>

                <p style="color: #dc2626;">

                    ${formatCurrency(monthlyExpenses)}

                </p>

            </div>


            <div class="month-item">

                <h4>Monthly Balance</h4>

                <p style="color: #2563eb;">

                    ${formatCurrency(monthlyBalance)}

                </p>

            </div>


        </div>

    `;

}


// =========================================================
// EXPENSE CHART
// =========================================================

function updateChart() {

    const categoryTotals = {};


    // =====================================================
    // CALCULATE EXPENSE TOTALS BY CATEGORY
    // =====================================================

    transactions.forEach(function (transaction) {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }


            categoryTotals[transaction.category] +=
                transaction.amount;

        }

    });


    const categories =
        Object.keys(categoryTotals);

    const amounts =
        Object.values(categoryTotals);


    const chartCanvas =
        document.getElementById("expense-chart");


    // =====================================================
    // DESTROY PREVIOUS CHART
    // =====================================================

    if (expenseChart) {

        expenseChart.destroy();

    }


    // =====================================================
    // NO EXPENSES
    // =====================================================

    if (categories.length === 0) {

        return;

    }


    // =====================================================
    // CREATE CHART
    // =====================================================

    expenseChart = new Chart(

        chartCanvas,

        {

            type: "doughnut",


            data: {

                labels: categories,


                datasets: [

                    {

                        label: "Expenses",

                        data: amounts,

                        borderWidth: 1

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {

                        position: "bottom"

                    },


                    tooltip: {

                        callbacks: {

                            label: function (context) {

                                return (

                                    context.label +

                                    ": " +

                                    formatCurrency(
                                        context.raw
                                    )

                                );

                            }

                        }

                    }

                }

            }

        }

    );

}


// =========================================================
// INITIALIZE APPLICATION
// =========================================================

loadTransactions();

// Set today's date when application starts
setDefaultDate();

renderTransactions();

updateSummary();

updateMonthlySummary();

updateChart();