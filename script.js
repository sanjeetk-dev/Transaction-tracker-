const productInput = document.getElementById('productName');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('addTransaction');
const transactionList = document.getElementById('transactionList');
const totalAmount = document.getElementById('totalAmount');
const splitBillCheckbox = document.getElementById('splitBill');
const todayDateRadio = document.getElementById('todayDate');
const customDateRadio = document.getElementById('customDate');
const transactionDateInput = document.getElementById('transactionDate');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let total = 0;

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateTotal() {
  total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.className = 'transaction';

    const transactionDetails = `
      <div>
        <strong>Product:</strong> ${transaction.product}<br>
        <strong>Date:</strong> ${transaction.date}<br>
        <strong>Day:</strong> ${transaction.day}<br>
      </div>
      <strong>$${transaction.amount.toFixed(2)}</strong>
    `;

    li.innerHTML = transactionDetails;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => removeTransaction(index);

    li.appendChild(deleteButton);
    transactionList.appendChild(li);
  });
  updateTotal();
}

function addTransaction(product, amount, split, date) {
  if (split) amount /= 2;

  if (product === '' || isNaN(amount) || amount <= 0 || !date) {
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
}

function addPresetTransaction(product, amount) {
  const split = splitBillCheckbox.checked;
  const date = getDate();
  addTransaction(product, amount, split, date);
}

function getDate() {
  if (todayDateRadio.checked) {
    return new Date().toISOString().split('T')[0];
  } else if (customDateRadio.checked) {
    return transactionDateInput.value;
  }
  return null;
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
}

addTransactionButton.addEventListener('click', () => {
  const product = productInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const split = splitBillCheckbox.checked;
  const date = getDate();

  addTransaction(product, amount, split, date);
  productInput.value = '';
  amountInput.value = '';
  transactionDateInput.value = '';
});

customDateRadio.addEventListener('change', () => {
  transactionDateInput.classList.toggle('hidden', !customDateRadio.checked);
});

todayDateRadio.addEventListener('change', () => {
  transactionDateInput.classList.toggle('hidden', todayDateRadio.checked);
});

renderTransactions();
