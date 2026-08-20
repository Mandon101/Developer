const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#toggle-password');
const toast = document.querySelector('#toast');
const transactionResult = document.querySelector('#transaction-result');
const dashboardHome = document.querySelector('#dashboard-home');
const billPage = document.querySelector('#bill-page');
const transferPage = document.querySelector('#transfer-page');
const billProvider = document.querySelector('#bill-provider');
const selectedBill = document.querySelector('#selected-bill');
const selectedBillIcon = document.querySelector('#selected-bill-icon');
const customerReferenceLabel = document.querySelector('#customer-reference-label');
const customerReference = document.querySelector('#customer-reference');
const billSubmit = document.querySelector('#bill-submit');
const cardDetails = document.querySelector('#card-details');
const cardExpiry = document.querySelector('#card-expiry');
const cardCvv = document.querySelector('#card-cvv');
const balanceDisplay = document.querySelector('.balance');
const transferAvailableBalance = document.querySelector('#transfer-available-balance');
const currentDate = document.querySelector('#current-date');
const greeting = document.querySelector('#greeting');
const currentSeason = document.querySelector('#current-season');

function updateDashboardDate() {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth();
  const season = month < 2 || month === 11 ? 'Winter' : month < 5 ? 'Spring' : month < 8 ? 'Summer' : 'Autumn';
  greeting.textContent = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  currentDate.firstChild.textContent = `${new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(now)} `;
  currentSeason.textContent = `· ${season}`;
}

window.setInterval(updateDashboardDate, 60000);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function showTransactionResult(success, message) {
  transactionResult.hidden = false;
  transactionResult.className = `transaction-result ${success ? 'success' : 'failure'}`;
  transactionResult.textContent = `${success ? 'Successful' : 'Failed'}: ${message}`;
  showToast(`${success ? 'Successful' : 'Failed'}: ${message}`);
  window.setTimeout(() => {
    transactionResult.hidden = true;
  }, 5000);
}

function getBalance() {
  return Number(balanceDisplay.textContent.replace(/[$,]/g, ''));
}

function updateBalance(balance) {
  balanceDisplay.innerHTML = `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  transferAvailableBalance.textContent = balanceDisplay.textContent;
}

function addTransaction(name, amount, status, iconClass = 'mobile') {
  const row = document.createElement('div');
  row.className = `transaction-row ${status}`;
  const nameCell = document.createElement('div');
  nameCell.className = 'transaction-name';
  const icon = document.createElement('span');
  icon.className = `merchant-icon ${iconClass}`;
  icon.textContent = status === 'success' ? '\u2713' : '!';
  const details = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = name;
  const state = document.createElement('small');
  state.textContent = status === 'success' ? 'Successful' : 'Failed';
  details.append(title, state);
  nameCell.append(icon, details);
  const date = document.createElement('span');
  date.className = 'date';
  date.textContent = 'Just now';
  const value = document.createElement('strong');
  value.className = `amount ${status === 'success' ? 'debit' : 'failed-amount'}`;
  value.textContent = `${status === 'success' ? '-' : ''}$${amount.toFixed(2)}`;
  row.append(nameCell, date, value);
  document.querySelector('.transaction-table').append(row);
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const firstName = email.split('@')[0].split(/[._-]/)[0];
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'Jordan';
  document.querySelector('#customer-name').textContent = displayName;
  updateDashboardDate();
  loginPanel.hidden = true;
  dashboard.hidden = false;
  window.scrollTo(0, 0);
});

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? 'Hide' : 'Show';
});

document.querySelector('#sign-out').addEventListener('click', () => {
  dashboard.hidden = true;
  loginPanel.hidden = false;
  transferPage.hidden = true;
  billPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  loginForm.reset();
  passwordInput.type = 'password';
  togglePassword.textContent = 'Show';
});

document.querySelector('#forgot-link').addEventListener('click', (event) => {
  event.preventDefault();
  showToast('Password reset instructions are on their way.');
});

function openTransferPage() {
  dashboardHome.hidden = true;
  document.querySelector('.transactions-section').hidden = true;
  billPage.hidden = true;
  transferPage.hidden = false;
  transferAvailableBalance.textContent = balanceDisplay.textContent.replace(/\s+/g, '');
  window.scrollTo(0, 0);
}

document.querySelector('#transfer-button').addEventListener('click', openTransferPage);
document.querySelector('#send-money-button').addEventListener('click', openTransferPage);
document.querySelector('#view-all').addEventListener('click', () => showToast('You are viewing the latest transactions.'));
document.querySelector('#pay-bill-button').addEventListener('click', () => {
  dashboardHome.hidden = true;
  document.querySelector('.transactions-section').hidden = true;
  billPage.hidden = false;
  window.scrollTo(0, 0);
});

document.querySelector('#back-to-dashboard').addEventListener('click', () => {
  billPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  window.scrollTo(0, 0);
});

document.querySelector('#back-from-transfer').addEventListener('click', () => {
  transferPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  window.scrollTo(0, 0);
});

document.querySelector('#transfer-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const phoneInput = document.querySelector('#recipient-phone');
  const amountInput = document.querySelector('#transfer-amount');
  const phone = phoneInput.value.replace(/\s+/g, '');
  const amount = Number(amountInput.value);
  const balance = Number(balanceDisplay.textContent.replace(/[$,]/g, ''));

  if (!phoneInput.checkValidity()) {
    phoneInput.reportValidity();
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    amountInput.setCustomValidity('Enter an amount greater than zero.');
    amountInput.reportValidity();
    amountInput.setCustomValidity('');
    return;
  }
  if (amount > balance) {
    addTransaction(`Transfer to ${phone}`, amount, 'failure');
    showTransactionResult(false, 'Insufficient funds. Your available balance is not enough for this transfer.');
    return;
  }

  const updatedBalance = balance - amount;
  updateBalance(updatedBalance);
  addTransaction(`Transfer to ${phone}`, amount, 'success');
  event.target.reset();
  transferPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  window.scrollTo(0, 0);
  showTransactionResult(true, `Transfer of $${amount.toFixed(2)} sent successfully.`);
});

document.querySelectorAll('.bill-category').forEach((category) => category.addEventListener('click', () => {
  document.querySelectorAll('.bill-category').forEach((item) => item.classList.remove('selected'));
  category.classList.add('selected');
  const billName = category.dataset.bill;
  selectedBill.textContent = billName;
  selectedBillIcon.className = `selected-bill-icon ${category.querySelector('.bill-icon').classList[1]}`;
  selectedBillIcon.textContent = category.querySelector('.bill-icon').textContent;
  const isSatellite = billName === 'Satellite TV';
  const isAtm = billName === 'ATM card payment';
  const isRecharge = billName === 'Phone recharge';
  customerReferenceLabel.textContent = isSatellite ? 'Satellite card number' : isAtm ? 'ATM bank card number' : isRecharge ? 'Phone number' : 'Meter / customer number';
  customerReference.placeholder = isSatellite ? 'Enter your satellite card number' : isAtm ? 'Enter your bank card number' : isRecharge ? '0812 306 2716' : 'Enter your reference number';
  customerReference.inputMode = isAtm || isSatellite || isRecharge ? 'numeric' : 'text';
  customerReference.pattern = isAtm ? '\\d{12,19}' : isSatellite ? '\\d{8,16}' : isRecharge ? '(?:\\+234|0)[789][01]\\d{8}' : '';
  customerReference.title = isAtm ? 'Enter a 12 to 19 digit bank card number' : isSatellite ? 'Enter an 8 to 16 digit satellite card number' : isRecharge ? 'Enter a valid Nigerian mobile number' : '';
  cardDetails.hidden = !isAtm;
  cardExpiry.required = isAtm;
  cardCvv.required = isAtm;
  billSubmit.firstChild.textContent = isAtm || isSatellite ? 'Send payment ' : isRecharge ? 'Send recharge ' : 'Continue to payment ';
  billProvider.innerHTML = billName === 'Satellite TV'
    ? '<option>Choose a provider</option><option>DStv</option><option>GOtv</option><option>Startimes</option>'
    : billName === 'ATM card payment'
      ? '<option>Choose a bank</option><option>AGLOWBANK LMT</option><option>Access Bank</option><option>First Bank</option><option>GTBank</option><option>UBA</option>'
    : billName === 'Internet'
      ? '<option>Choose an internet provider</option><option>MTN Fibre</option><option>Airtel 5G</option><option>Glo 5G</option><option>9mobile</option><option>Spectranet</option><option>Smile</option><option>Swift Networks</option><option>ipNX</option><option>Starlink</option>'
    : billName === 'Phone recharge'
      ? '<option>Choose a network</option><option>MTN</option><option>Airtel</option><option>Glo</option><option>9mobile</option><option>Smile</option>'
      : '<option>Choose a provider</option><option>IKEDC</option><option>Eko Electricity</option><option>Abuja Electricity</option><option>Jos Electricity</option><option>Port Harcourt Electricity</option>';
}));

document.querySelector('#bill-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(document.querySelector('#bill-amount').value);
  const provider = billProvider.value;
  const reference = customerReference.value.trim();
  const action = selectedBill.textContent === 'Phone recharge' ? 'recharge' : 'payment';
  const balance = getBalance();

  if (!provider || provider.startsWith('Choose')) {
    showTransactionResult(false, 'Choose a provider before sending the transaction.');
    return;
  }
  if (!reference || !customerReference.checkValidity()) {
    customerReference.reportValidity();
    showTransactionResult(false, 'The account, card, or phone number is invalid.');
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showTransactionResult(false, 'Enter an amount greater than zero.');
    return;
  }
  if (amount > balance) {
    addTransaction(`${selectedBill.textContent} ${action}`, amount, 'failure');
    showTransactionResult(false, 'Insufficient funds. Your available balance is not enough for this transaction.');
    return;
  }

  updateBalance(balance - amount);
  addTransaction(`${selectedBill.textContent} ${action}`, amount, 'success');
  event.target.reset();
  cardDetails.hidden = true;
  cardExpiry.required = false;
  cardCvv.required = false;
  billPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  window.scrollTo(0, 0);
  showTransactionResult(true, `${selectedBill.textContent} ${action} completed successfully.`);
});

document.querySelectorAll('.action-button:not(#pay-bill-button):not(#send-money-button)').forEach((button) => button.addEventListener('click', () => showToast(`${button.textContent.trim()} is ready to use.`)));
