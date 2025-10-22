import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { saveAccount } from '@/lib/storage';

const AccountDialog = ({ isOpen, onClose, account }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    color: 'from-blue-500 to-indigo-600'
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    } else {
      setFormData({
        name: '',
        type: 'checking',
        balance: '',
        color: 'from-blue-500 to-indigo-600'
      });
    }
  }, [account, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const accountData = {
      ...formData,
      balance: parseFloat(formData.balance)
    };

    saveAccount(accountData);
    
    toast({
      title: account ? "Compte modifié" : "Compte créé",
      description: "Le compte a été enregistré avec succès"
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {account ? 'Modifier le compte' : 'Nouveau compte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du compte</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Compte courant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de compte</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Compte courant</SelectItem>
                <SelectItem value="savings">Compte épargne</SelectItem>
                <SelectItem value="investment">Compte investissement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Solde initial (€)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              {account ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;