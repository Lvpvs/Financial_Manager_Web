const TRANSACTIONS_KEY = 'fintrack_transactions';
const ACCOUNTS_KEY = 'fintrack_accounts';
const CATEGORIES_KEY = 'fintrack_categories';

const defaultCategories = [
  { id: '1', name: 'Alimentation', color: '#10b981', icon: '🍔' },
  { id: '2', name: 'Transport', color: '#3b82f6', icon: '🚗' },
  { id: '3', name: 'Logement', color: '#8b5cf6', icon: '🏠' },
  { id: '4', name: 'Loisirs', color: '#f59e0b', icon: '🎮' },
  { id: '5', name: 'Santé', color: '#ef4444', icon: '💊' },
  { id: '6', name: 'Salaire', color: '#10b981', icon: '💰' },
  { id: '7', name: 'Autres', color: '#6b7280', icon: '📦' },
  { id: '8', name: 'Transfert', color: '#0ea5e9', icon: '🔄' }
];

export const initializeStorage = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
  } else {
    // Ensure 'Transfert' category exists for existing users
    const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
    if (!categories.find(c => c.name === 'Transfert')) {
      categories.push({ id: '8', name: 'Transfert', color: '#0ea5e9', icon: '🔄' });
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }
  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ACCOUNTS_KEY)) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([]));
  }
};

export const getTransactions = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
};

export const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  if (transaction.id) {
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      transactions[index] = transaction;
    }
  } else {
    transaction.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    transactions.push(transaction);
  }
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getAccounts = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
};

export const saveAccount = (account) => {
  const accounts = getAccounts();
  if (account.id) {
    const index = accounts.findIndex(a => a.id === account.id);
    if (index !== -1) {
      accounts[index] = account;
    }
  } else {
    account.id = Date.now().toString();
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const deleteAccount = (id) => {
  const accounts = getAccounts().filter(a => a.id !== id);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const getCategories = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
};

export const saveCategory = (category) => {
  const categories = getCategories();
  if (category.id) {
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
    }
  } else {
    category.id = Date.now().toString();
    categories.push(category);
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const deleteCategory = (id) => {
  const categories = getCategories().filter(c => c.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getAccountBalance = (accountId, atDate = new Date()) => {
  const accounts = getAccounts();
  const transactions = getTransactions();
  
  const effectiveDate = new Date(atDate);
  effectiveDate.setHours(23, 59, 59, 999);

  const accountsToProcess = accountId ? accounts.filter(a => a.id === accountId) : accounts;

  const totalBalance = accountsToProcess.reduce((total, account) => {
    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.account === account.name && transactionDate <= effectiveDate;
    });

    const balance = relevantTransactions.reduce((acc, t) => {
      if (t.type === 'income') {
        return acc + t.amount;
      } else {
        return acc - t.amount;
      }
    }, account.balance);

    return total + balance;
  }, 0);

  return totalBalance;
};