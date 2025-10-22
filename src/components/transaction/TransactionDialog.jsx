import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { saveTransaction } from '@/lib/storage';
import { getAccounts, getCategories } from '@/lib/storage';

const TransactionDialog = ({ isOpen, onClose, transaction }) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    account: '', // Source account for transfers
    destinationAccount: '', // Destination account for transfers
    category: '',
    description: '',
    isRecurring: false
  });

  useEffect(() => {
    setAccounts(getAccounts());
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    if (transaction) {
      // Editing transfers is complex, disable for now.
      if (transaction.type === 'transfer') {
        toast({
          title: "Modification non disponible",
          description: "La modification des transferts n'est pas encore prise en charge. Veuillez supprimer et recréer le transfert.",
          variant: "destructive"
        });
        onClose();
        return;
      }
      setFormData(transaction);
    } else {
      setFormData({
        name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        account: '',
        destinationAccount: '',
        category: '',
        description: '',
        isRecurring: false
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);

    if (formData.type === 'transfer') {
      if (formData.account === formData.destinationAccount) {
        toast({
          title: "Erreur",
          description: "Le compte source et de destination ne peuvent pas être identiques.",
          variant: "destructive"
        });
        return;
      }

      // Create two transactions for a transfer
      const expenseTransaction = {
        id: null,
        name: `Transfert vers ${formData.destinationAccount}`,
        amount: amount,
        date: formData.date,
        type: 'expense',
        account: formData.account,
        category: 'Transfert',
        description: formData.description,
        isRecurring: false, // Recurring transfers not supported in this simple model
      };
      
      const incomeTransaction = {
        id: null,
        name: `Transfert depuis ${formData.account}`,
        amount: amount,
        date: formData.date,
        type: 'income',
        account: formData.destinationAccount,
        category: 'Transfert',
        description: formData.description,
        isRecurring: false,
      };

      saveTransaction(expenseTransaction);
      saveTransaction(incomeTransaction);

      toast({
        title: "Transfert effectué",
        description: `Le montant de ${amount.toFixed(2)} € a été transféré.`
      });

    } else {
      const transactionData = {
        ...formData,
        amount: amount
      };
      saveTransaction(transactionData);
      toast({
        title: transaction ? "Transaction modifiée" : "Transaction créée",
        description: "La transaction a été enregistrée avec succès"
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              disabled={!!transaction}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Dépense</SelectItem>
                <SelectItem value="income">Revenu</SelectItem>
                <SelectItem value="transfer">Transfert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type !== 'transfer' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.type === 'transfer' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="account">Compte source</Label>
                <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un compte" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAccount">Compte de destination</Label>
                <Select value={formData.destinationAccount} onValueChange={(value) => setFormData({ ...formData, destinationAccount: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un compte" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="account">Compte</Label>
                <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un compte" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {formData.type !== 'transfer' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                Transaction récurrente mensuelle
              </Label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              {transaction ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;