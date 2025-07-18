
import React from 'react';
import { Settings, Database, Mail, Globe, Bell, Users, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été appliquées avec succès",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>Configuration de base de la plateforme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nom de la plateforme</Label>
              <Input id="platform-name" defaultValue="InfinitiaX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-url">URL de base</Label>
              <Input id="platform-url" defaultValue="https://infinitiax.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email administrateur</Label>
              <Input id="admin-email" type="email" defaultValue="admin@infinitiax.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email support</Label>
              <Input id="support-email" type="email" defaultValue="support@infinitiax.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            Configuration système
          </CardTitle>
          <CardDescription>Paramètres techniques et de performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode maintenance</Label>
              <p className="text-sm text-muted-foreground">Activer le mode maintenance pour les mises à jour</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cache automatique</Label>
              <p className="text-sm text-muted-foreground">Optimisation des performances</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">Sauvegarde quotidienne des données</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Email & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-purple-600" />
            Email et notifications
          </CardTitle>
          <CardDescription>Configuration des communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">Serveur SMTP</Label>
              <Input id="smtp-server" defaultValue="smtp.infinitiax.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port SMTP</Label>
              <Input id="smtp-port" type="number" defaultValue="587" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications email aux admins</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes importantes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications email aux utilisateurs</Label>
                <p className="text-sm text-muted-foreground">Confirmation et rappels</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-orange-600" />
            Gestion des utilisateurs
          </CardTitle>
          <CardDescription>Paramètres d'inscription et d'accès</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Inscription ouverte</Label>
              <p className="text-sm text-muted-foreground">Permettre les nouvelles inscriptions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Validation email obligatoire</Label>
              <p className="text-sm text-muted-foreground">Vérifier l'email lors de l'inscription</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">Recommandé pour la sécurité</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Platform Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2 text-pink-600" />
            Apparence de la plateforme
          </CardTitle>
          <CardDescription>Personnalisation de l'interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Couleur principale</Label>
              <div className="flex space-x-2">
                <Input id="primary-color" defaultValue="#EC4899" />
                <div className="w-10 h-10 bg-pink-600 rounded border"></div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Couleur secondaire</Label>
              <div className="flex space-x-2">
                <Input id="secondary-color" defaultValue="#F97316" />
                <div className="w-10 h-10 bg-orange-600 rounded border"></div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode sombre</Label>
              <p className="text-sm text-muted-foreground">Interface sombre par défaut</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-pink-600 hover:bg-pink-700">
          <Settings className="h-4 w-4 mr-2" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
