import { getTransactions, getAccounts } from './storage';

export const generateForecastData = (months) => {
  const accounts = getAccounts();
  const transactions = getTransactions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialBalance = accounts.reduce((sum, acc) => {
    const pastTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return t.account === acc.name && tDate <= today;
    });
    const accountBalance = pastTransactions.reduce((bal, t) => {
      return t.type === 'income' ? bal + t.amount : bal - t.amount;
    }, acc.balance);
    return sum + accountBalance;
  }, 0);

  const futureTransactions = transactions.filter(t => new Date(t.date) > today);
  const recurringTransactions = transactions.filter(t => t.isRecurring);

  const forecastData = [];
  let currentBalance = initialBalance;

  for (let i = 0; i < months; i++) {
    const forecastMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    // One-time future transactions for this month
    futureTransactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate >= forecastMonth && tDate < nextMonth) {
        if (t.type === 'income') monthlyIncome += t.amount;
        else monthlyExpenses += t.amount;
      }
    });

    // Recurring transactions for this month
    recurringTransactions.forEach(t => {
      const tDate = new Date(t.date);
      // Only consider recurring transactions that started in the past or this month
      if (tDate < nextMonth) {
        if (t.type === 'income') monthlyIncome += t.amount;
        else monthlyExpenses += t.amount;
      }
    });

    currentBalance += monthlyIncome - monthlyExpenses;

    forecastData.push({
      month: forecastMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
      balance: currentBalance,
      income: monthlyIncome,
      expenses: monthlyExpenses,
    });
  }

  return forecastData;
};