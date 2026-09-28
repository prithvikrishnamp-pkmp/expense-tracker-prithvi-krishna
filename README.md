# Expense Tracker

A simple and responsive Expense Tracker web application built using HTML, CSS, and JavaScript.

The application allows users to manage their income and expenses, view their current balance, filter transactions, and analyze expenses by category.

## Features

- Add income and expense transactions
- Enter amount, category, date, and description
- Edit existing transactions
- Delete transactions
- View total income
- View total expenses
- View current balance
- Filter transactions by income or expense
- Filter transactions by category
- Store transaction data using browser LocalStorage
- Automatically restore saved transactions after refreshing the page
- Monthly income, expense, and balance summary
- Category-wise expense chart
- Form validation and helpful error messages
- Responsive design for desktop and mobile devices

## How to Run

### Using VS Code Live Server

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. The Expense Tracker will open in your browser.

### Directly in Browser

You can also open `index.html` directly in a modern web browser.

## How to Use

1. Select **Income** or **Expense** from the Type field.
2. Enter the transaction amount.
3. Select a category.
4. Select the transaction date.
5. Enter a description.
6. Click **Add Transaction**.
7. Use the **Edit** button to modify an existing transaction.
8. Use the **Delete** button to remove a transaction.
9. Use the filters to view transactions by type or category.
10. View the dashboard cards to check total income, total expenses, and current balance.
11. View the **Monthly Summary** for the current month's totals.
12. View the **Expense by Category** chart to understand expense distribution.
13. Transactions are automatically saved in browser LocalStorage and remain available after refreshing the page.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Chart.js

## Project Structure

```text
expense-tracker-prithvi-krishna/
│
├── index.html
├── style.css
├── script.js
└── README.md