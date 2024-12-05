// DOM Elements
const productInput = document.getElementById('productName');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('addTransaction');
const transactionList = document.getElementById('transactionList');
const totalAmount = document.getElementById('totalAmount');
const totalTransactions = document.getElementById('totalTransactions');
const splitBillCheckbox = document.getElementById('splitBill');
const todayDateRadio = document.getElementById('todayDate');
const customDateRadio = document.getElementById('customDate');
const transactionDateInput = document.getElementById('transactionDate');
const filterBy = document.getElementById('filterBy');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// Transactions
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let total = 0;

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateSummary() {
  total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  totalAmount.textContent = total.toFixed(2);
  totalTransactions.textContent = transactions.length;
}

function renderTransactions(filteredTransactions = transactions) {
  transactionList.innerHTML = '';
  filteredTransactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.className = 'transaction';

    const transactionDetails = `
      <div>
        <strong>${transaction.product}</strong><br>
        <span>${transaction.date}</span><br>
        <span>${transaction.day}</span>
      </div>
      <strong>$${transaction.amount.toFixed(2)}</strong>
    `;

    li.innerHTML = transactionDetails;
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<span class="material-icons">delete</span>';
    deleteButton.onclick = () => removeTransaction(index);

    li.appendChild(deleteButton);
    transactionList.appendChild(li);
  });
  updateSummary();
}

function addTransaction(product, amount, split, date) {
  if (split) amount /= 2;

  if (!product || isNaN(amount) || amount <= 0 || !date) {
    alert('Please enter valid details!');
    return;
  }

  const transaction = {
    product,
    amount,
    date,
    day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();

  productInput.value = '';
  amountInput.value = '';
  transactionDateInput.value = '';
  splitBillCheckbox.checked = false; // Reset the split checkbox
  todayDateRadio.checked = true; // Reset to today date
  transactionDateInput.classList.add('hidden'); // Hide the date input
}

function addPresetTransaction(product, amount) {
  const split = splitBillCheckbox.checked;
  const date = todayDateRadio.checked
    ? new Date().toISOString().split('T')[0]
    : transactionDateInput.value;
  addTransaction(product, amount, split, date);
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
}

function filterTransactions() {
  const filterValue = filterBy.value;
  let filteredTransactions = transactions;

  if (filterValue === 'latest') {
    filteredTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (filterValue === 'oldest') {
    filteredTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filterValue === 'month') {
    const currentMonth = new Date().getMonth();
    filteredTransactions = transactions.filter(
      (t) => new Date(t.date).getMonth() === currentMonth
    );
  } else if (filterValue === 'dateRange') {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    filteredTransactions = transactions.filter(
      (t) => new Date(t.date) >= start && new Date(t.date) <= end
    );
  }

  renderTransactions(filteredTransactions);
}

// Event Listeners
addTransactionButton.onclick = () => {
  const product = productInput.value;
  const amount = parseFloat(amountInput.value);
  const split = splitBillCheckbox.checked;
  const date = todayDateRadio.checked
    ? new Date().toISOString().split('T')[0]
    : transactionDateInput.value;

  addTransaction(product, amount, split, date);
};

todayDateRadio.onchange = () => (transactionDateInput.classList.add('hidden'));
customDateRadio.onchange = () => (transactionDateInput.classList.remove('hidden'));
filterBy.onchange = filterTransactions;

// Initial Render
renderTransactions();
