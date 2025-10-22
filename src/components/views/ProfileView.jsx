import React from 'react';
import { LogOut, User, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getStoredUser, logout } from '@/lib/auth';

const ProfileView = ({ onLogout }) => {
  const { toast } = useToast();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    onLogout();
    toast({
      title: "Déconnexion",
      description: "À bientôt !"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export des données",
      description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀"
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600 mt-1">Gérez vos paramètres et sécurité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nom d'utilisateur</p>
              <p className="text-lg font-semibold">{user?.username}</p>
            </div>
            <Button variant="outline" className="w-full">
              Modifier le profil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Vos données sont chiffrées localement
            </p>
            <Button variant="outline" className="w-full">
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Exportez ou sauvegardez vos données
            </p>
            <Button onClick={handleExport} variant="outline" className="w-full">
              Exporter les données
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="w-full"
            >
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;