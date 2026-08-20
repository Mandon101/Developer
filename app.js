const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#toggle-password');
const toast = document.querySelector('#toast');
const dashboardHome = document.querySelector('#dashboard-home');
const billPage = document.querySelector('#bill-page');
const transferPage = document.querySelector('#transfer-page');
const billProvider = document.querySelector('#bill-provider');
const selectedBill = document.querySelector('#selected-bill');
const selectedBillIcon = document.querySelector('#selected-bill-icon');
const customerReferenceLabel = document.querySelector('#customer-reference-label');
const customerReference = document.querySelector('#customer-reference');
const billSubmit = document.querySelector('#bill-submit');
const balanceDisplay = document.querySelector('.balance');
const transferAvailableBalance = document.querySelector('#transfer-available-balance');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const firstName = email.split('@')[0].split(/[._-]/)[0];
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'Jordan';
  document.querySelector('#customer-name').textContent = displayName;
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
    showToast('Transfer failed: insufficient available balance.');
    return;
  }

  const updatedBalance = balance - amount;
  balanceDisplay.textContent = `$${updatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  transferAvailableBalance.textContent = balanceDisplay.textContent;
  const transactionRow = document.createElement('div');
  transactionRow.className = 'transaction-row';
  transactionRow.innerHTML = `<div class="transaction-name"><span class="merchant-icon mobile">&#8593;</span><div><strong>Transfer to ${phone}</strong><small>Money transfer</small></div></div><span class="date">Just now</span><strong class="amount debit">-$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>`;
  document.querySelector('.transaction-table').appendChild(transactionRow);
  event.target.reset();
  transferPage.hidden = true;
  dashboardHome.hidden = false;
  document.querySelector('.transactions-section').hidden = false;
  window.scrollTo(0, 0);
  showToast(`Transfer of $${amount.toFixed(2)} sent successfully.`);
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
  customerReferenceLabel.textContent = isSatellite ? 'Satellite card number' : isAtm ? 'ATM bank card number' : 'Meter / customer number';
  customerReference.placeholder = isSatellite ? 'Enter your satellite card number' : isAtm ? 'Enter your bank card number' : 'Enter your reference number';
  customerReference.inputMode = isAtm || isSatellite ? 'numeric' : 'text';
  customerReference.pattern = isAtm ? '\\d{12,19}' : isSatellite ? '\\d{8,16}' : '';
  customerReference.title = isAtm ? 'Enter a 12 to 19 digit bank card number' : isSatellite ? 'Enter an 8 to 16 digit satellite card number' : '';
  billSubmit.firstChild.textContent = isAtm || isSatellite ? 'Send payment ' : 'Continue to payment ';
  billProvider.innerHTML = billName === 'Satellite TV'
    ? '<option>Choose a provider</option><option>DStv</option><option>GOtv</option><option>Startimes</option>'
    : billName === 'ATM card payment'
      ? '<option>Choose a bank</option><option>AGLOWBANK LMT</option><option>Access Bank</option><option>First Bank</option><option>GTBank</option><option>UBA</option>'
    : billName === 'Internet'
      ? '<option>Choose an internet provider</option><option>MTN Fibre</option><option>Airtel 5G</option><option>Glo 5G</option><option>9mobile</option><option>Spectranet</option><option>Smile</option><option>Swift Networks</option><option>ipNX</option><option>Starlink</option>'
    : billName === 'Airtime & Data'
      ? '<option>Choose a network</option><option>MTN</option><option>Airtel</option><option>Glo</option><option>9mobile</option><option>Smile</option>'
      : '<option>Choose a provider</option><option>IKEDC</option><option>Eko Electricity</option><option>Abuja Electricity</option><option>Jos Electricity</option><option>Port Harcourt Electricity</option>';
}));

document.querySelector('#bill-form').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast(`${selectedBill.textContent} payment is ready for confirmation.`);
});

document.querySelectorAll('.action-button:not(#pay-bill-button):not(#send-money-button)').forEach((button) => button.addEventListener('click', () => showToast(`${button.textContent.trim()} is ready to use.`)));
