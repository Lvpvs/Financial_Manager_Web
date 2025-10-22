import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import { getStoredUser, processRecurringTransactions } from '@/lib/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      processRecurringTransactions();
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    processRecurringTransactions();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>FinTrack - Gestion Financière Personnelle</title>
        <meta name="description" content="Application moderne de gestion financière personnelle pour suivre vos comptes, dépenses et revenus en toute sécurité" />
      </Helmet>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  );
}

export default App;