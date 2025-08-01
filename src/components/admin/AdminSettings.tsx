import React from 'react';
import { Settings, Database, Mail, Globe, Bell, Users, Shield, Palette, Image, Video, FileText, Key, Sliders, Grid } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
              <Input id="platform-name" defaultValue="Learneezy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-url">URL de base</Label>
              <Input id="platform-url" defaultValue="https://Learneezy.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email administrateur</Label>
              <Input id="admin-email" type="email" defaultValue="admin@Learneezy.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email support</Label>
              <Input id="support-email" type="email" defaultValue="support@Learneezy.com" />
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Apparence et branding
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Logo de la plateforme</Label>
                <Input id="logo-upload" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">Format recommandé : PNG, JPG (max 2MB)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover-upload">Photo de couverture</Label>
                <Input id="cover-upload" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">Dimensions : 1440x480 pixels</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Message d'accueil</Label>
              <Textarea 
                id="welcome-message" 
                defaultValue="Bienvenue sur Learneezy, votre plateforme d'apprentissage personnalisée"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentation-video">Vidéo de présentation (URL)</Label>
              <Input id="presentation-video" placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sliders className="h-5 w-5 mr-2 text-purple-600" />
            Paramètres avancés
          </CardTitle>
          <CardDescription>Configuration avancée et juridique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy-policy">Politique de confidentialité (URL)</Label>
              <Input id="privacy-policy" placeholder="https://votre-site.com/privacy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moderation-charter">Charte de modération (URL)</Label>
              <Input id="moderation-charter" placeholder="https://votre-site.com/moderation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms-of-use">Conditions d'utilisation (URL)</Label>
              <Input id="terms-of-use" placeholder="https://votre-site.com/terms" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-redirect">URL de redirection du logo</Label>
              <Input id="logo-redirect" placeholder="https://votre-site-principal.com" />
              <p className="text-xs text-muted-foreground">Où rediriger quand on clique sur le logo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Champs personnalisés utilisateur
          </CardTitle>
          <CardDescription>Gérer les champs personnalisés pour les profils</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Numéro de téléphone</Label>
                <p className="text-sm text-muted-foreground">Champ obligatoire pour le contact</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Date de naissance</Label>
                <p className="text-sm text-muted-foreground">Pour les statistiques d'âge</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Niveau d'études</Label>
                <p className="text-sm text-muted-foreground">Sélection multiple</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Centres d'intérêt</Label>
                <p className="text-sm text-muted-foreground">Tags personnalisables</p>
              </div>
              <Switch />
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Ajouter un nouveau champ personnalisé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API & Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2 text-orange-600" />
            API & Webhooks
          </CardTitle>
          <CardDescription>Configuration des intégrations et clés API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Clé API principale</Label>
              <div className="flex space-x-2">
                <Input id="api-key" value="sk-proj-..." type="password" readOnly />
                <Button variant="outline">Régénérer</Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Webhooks configurés</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Nouveaux utilisateurs</p>
                    <p className="text-sm text-muted-foreground">https://api.externe.com/users</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Tester</Button>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Achats terminés</p>
                    <p className="text-sm text-muted-foreground">https://api.externe.com/payments</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Tester</Button>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Ajouter un nouveau webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catalog Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid className="h-5 w-5 mr-2 text-indigo-600" />
            Configuration du catalogue
          </CardTitle>
          <CardDescription>Gestion des sections et contenus tiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Section "Formations populaires"</Label>
                <p className="text-sm text-muted-foreground">Afficher sur la page d'accueil</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Section "Nouveautés"</Label>
                <p className="text-sm text-muted-foreground">Derniers cours ajoutés</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Section "Recommandations IA"</Label>
                <p className="text-sm text-muted-foreground">Suggestions personnalisées</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Contenus tiers (YouTube, Coursera)</Label>
                <p className="text-sm text-muted-foreground">Intégration de contenus externes</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Système de badges et certifications</Label>
                <p className="text-sm text-muted-foreground">Gamification des apprentissages</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Mode sombre automatique</Label>
                <p className="text-sm text-muted-foreground">Basculer selon les préférences système</p>
              </div>
              <Switch />
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
              <Input id="smtp-server" defaultValue="smtp.Learneezy.com" />
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
