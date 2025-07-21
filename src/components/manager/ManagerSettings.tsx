import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Users,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profile
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie.laurent@learneezy.com',
    phone: '+33 1 23 45 67 89',
    department: 'Formation Continue',
    position: 'Gestionnaire de Formation',
    bio: 'Responsable de la supervision des parcours de formation et du suivi des apprenants.',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    urgentAlerts: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // Display
    theme: 'system',
    language: 'fr',
    timezone: 'Europe/Paris'
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
        </div>
        <Button onClick={handleSave} className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Informations Personnelles
          </CardTitle>
          <CardDescription>
            Gérez vos informations de profil et de contact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Département
              </Label>
              <Input
                id="department"
                value={settings.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={settings.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configurez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotif">Notifications par email</Label>
              <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
            </div>
            <Switch
              id="emailNotif"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotif">Notifications push</Label>
              <p className="text-sm text-gray-600">Recevoir les notifications en temps réel</p>
            </div>
            <Switch
              id="pushNotif"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklyReports">Rapports hebdomadaires</Label>
              <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire des activités</p>
            </div>
            <Switch
              id="weeklyReports"
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => handleInputChange('weeklyReports', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="urgentAlerts">Alertes urgentes</Label>
              <p className="text-sm text-gray-600">Recevoir les alertes pour les situations urgentes</p>
            </div>
            <Switch
              id="urgentAlerts"
              checked={settings.urgentAlerts}
              onCheckedChange={(checked) => handleInputChange('urgentAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Gérez vos paramètres de sécurité et confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa">Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="2fa"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
              {settings.twoFactorAuth && <Badge variant="secondary">Activé</Badge>}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
            <Select
              value={settings.sessionTimeout}
              onValueChange={(value) => handleInputChange('sessionTimeout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5" />
            Affichage et Localisation
          </CardTitle>
          <CardDescription>
            Personnalisez votre expérience utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleInputChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleInputChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT)</SelectItem>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerSettings;