import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteAccount, getAccountBalance } from '@/lib/storage';

const AccountCard = ({ account, onEdit, onUpdate }) => {
  const { toast } = useToast();
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const balance = getAccountBalance(account.id);
    setCurrentBalance(balance);
  }, [account.id, onUpdate]); // Re-calculate on update

  const handleDelete = () => {
    deleteAccount(account.id);
    toast({
      title: "Compte supprimé",
      description: "Le compte a été supprimé avec succès"
    });
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className={`h-2 bg-gradient-to-r ${account.color || 'from-blue-500 to-indigo-600'}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-lg">{account.name}</span>
                <p className="text-sm text-gray-500">{account.type}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(account)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Solde actuel</p>
              <p className="text-2xl font-bold text-gray-900">{currentBalance.toFixed(2)} €</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AccountCard;