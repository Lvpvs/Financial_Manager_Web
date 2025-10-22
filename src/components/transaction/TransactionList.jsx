import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ArrowUpRight, ArrowDownRight, Repeat, CalendarClock, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteTransaction } from '@/lib/storage';

const TransactionList = ({ transactions, onEdit, onUpdate }) => {
  const { toast } = useToast();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès"
    });
    onUpdate();
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Aucune transaction pour le moment</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((transaction, index) => {
        // The date string 'YYYY-MM-DD' is treated as UTC midnight.
        // We need to compare dates without timezones getting in the way.
        const transactionDate = new Date(transaction.date);
        const transactionDateOnly = new Date(transactionDate.valueOf() + transactionDate.getTimezoneOffset() * 60 * 1000);
        
        const isFuture = transactionDateOnly > today;
        const isTransfer = transaction.category === 'Transfert';

        let icon;
        let iconBg;

        if (isTransfer) {
          icon = <ArrowRightLeft className="w-6 h-6" />;
          iconBg = 'bg-blue-100 text-blue-600';
        } else if (transaction.type === 'income') {
          icon = <ArrowUpRight className="w-6 h-6" />;
          iconBg = 'bg-green-100 text-green-600';
        } else {
          icon = <ArrowDownRight className="w-6 h-6" />;
          iconBg = 'bg-red-100 text-red-600';
        }

        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-4 hover:shadow-md transition-shadow ${isFuture ? 'bg-gray-50 opacity-70' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                    {icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{transaction.name}</span>
                      {transaction.isRecurring && (
                        <Repeat className="w-4 h-4 text-blue-500" title="Transaction récurrente" />
                      )}
                      {isFuture && (
                        <CalendarClock className="w-4 h-4 text-purple-500" title="Transaction future" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{transaction.account}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      isTransfer ? 'text-blue-600' :
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                    disabled={isTransfer}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  );
};

export default TransactionList;