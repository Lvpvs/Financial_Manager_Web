import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccountCard from '@/components/accounts/AccontCard';
import AccountDialog from '@/components/accounts/AccountDialog';
import { getAccounts } from '@/lib/storage';

const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const data = getAccounts();
    setAccounts(data);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAccount(null);
    loadAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comptes</h1>
          <p className="text-gray-600 mt-1">Gérez vos comptes bancaires</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau compte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={handleEdit}
            onUpdate={loadAccounts}
          />
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun compte pour le moment</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            Créer votre premier compte
          </Button>
        </div>
      )}

      <AccountDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        account={editingAccount}
      />
    </div>
  );
};

export default AccountsView;