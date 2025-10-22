import CryptoJS from 'crypto-js';
import { getTransactions, saveTransaction } from './storage';

const USERS_KEY = 'fintrack_users';
const CURRENT_USER_KEY = 'fintrack_current_user';
const LAST_PROCESSED_KEY = 'fintrack_last_processed';

export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const register = (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  if (users.find(u => u.username === username)) {
    return false;
  }

  users.push({
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.username === username && u.passwordHash === hashPassword(password));
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ username }));
    return true;
  }
  
  return false;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const processRecurringTransactions = () => {
  const lastProcessedStr = localStorage.getItem(LAST_PROCESSED_KEY);
  const lastProcessed = lastProcessedStr ? new Date(lastProcessedStr) : new Date(0);
  const today = new Date();
  
  // Only run once per day
  if (
    lastProcessed.getFullYear() === today.getFullYear() &&
    lastProcessed.getMonth() === today.getMonth() &&
    lastProcessed.getDate() === today.getDate()
  ) {
    return;
  }

  const allTransactions = getTransactions();
  const recurring = allTransactions.filter(t => t.isRecurring);

  recurring.forEach(t => {
    const originalDate = new Date(t.date);
    let nextDate = new Date(originalDate);
    
    while (nextDate <= today) {
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      if (nextDate > today) break;

      const alreadyExists = allTransactions.some(existing => 
        existing.name === t.name &&
        new Date(existing.date).toDateString() === nextDate.toDateString()
      );

      if (!alreadyExists) {
        const newTransaction = {
          ...t,
          id: null, // so a new one is created
          date: nextDate.toISOString().split('T')[0],
          isRecurring: false, // The generated one is not recurring itself
          description: `Généré automatiquement depuis la transaction du ${originalDate.toLocaleDateString('fr-FR')}`
        };
        saveTransaction(newTransaction);
      }
    }
  });

  localStorage.setItem(LAST_PROCESSED_KEY, today.toISOString());
};