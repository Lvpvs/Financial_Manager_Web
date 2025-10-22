import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions, getAccounts, getAccountBalance } from '@/lib/storage';
import ExpenseChart from '@/components/charts/ExpenseChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

const DashboardView = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    accountsCount: 0
  });
  const [key, setKey] = useState(Date.now()); // To force re-render

  useEffect(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Include all of today

    const transactions = getTransactions().filter(t => new Date(t.date) <= today);
    const accounts = getAccounts();
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id, today), 0);

    setStats({
      totalBalance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      accountsCount: accounts.length
    });
  }, [key]);

  // This effect will re-run the calculations when the view becomes visible
  // e.g., after adding a transaction on another view.
  useEffect(() => {
    const handleFocus = () => setKey(Date.now());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);


  const statCards = [
    {
      title: 'Solde Total',
      value: `${stats.totalBalance.toFixed(2)} €`,
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      trend: null
    },
    {
      title: 'Revenus du mois',
      value: `${stats.monthlyIncome.toFixed(2)} €`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Dépenses du mois',
      value: `${stats.monthlyExpenses.toFixed(2)} €`,
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
      trend: 'down'
    },
    {
      title: 'Comptes actifs',
      value: stats.accountsCount,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      trend: null
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de vos finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {stat.trend && (
                    <div className="mt-3 flex items-center text-sm">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        Ce mois
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <CategoryPieChart />
      </div>

      <RecentTransactions />
    </div>
  );
};

export default DashboardView;