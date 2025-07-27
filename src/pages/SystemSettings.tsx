
import React, { useState } from 'react';
import { Settings, Globe, Mail, Shield, Palette, Bell, Database, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Learneezy',
    siteDescription: 'Plateforme d\'apprentissage en ligne',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    autoApprovalCourses: false,
    allowGuestAccess: false,
    maxFileUploadSize: '100',
    sessionTimeout: '30',
    language: 'fr',
    timezone: 'Europe/Paris',
    emailNotifications: true,
    pushNotifications: false,
    mainColor: '#ec4899',
    logoUrl: ''
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "La configuration système a été mise à jour avec succès",
    });
  };

  const handleBackup = () => {
    toast({
      title: "Sauvegarde initiée",
      description: "La sauvegarde complète du système a été lancée",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Restauration",
      description: "Interface de restauration ouverte",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres système</h1>
            <p className="text-gray-600">Configuration générale de la plateforme</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBackup}>
              <Database className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={handleSaveSettings} className="bg-pink-600 hover:bg-pink-700">
              <Settings className="h-4 w-4 mr-2" />
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Paramètres généraux */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Paramètres généraux
                </CardTitle>
                <CardDescription>Configuration de base de la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du site</label>
                    <Input 
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Langue par défaut</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description du site</label>
                  <Textarea 
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeout session (min)</label>
                    <Input 
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Sécurité et accès
                </CardTitle>
                <CardDescription>Contrôle des accès et de la sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode maintenance</p>
                    <p className="text-sm text-gray-600">Désactive l'accès public au site</p>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Inscription ouverte</p>
                    <p className="text-sm text-gray-600">Permet aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch 
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => handleSettingChange('registrationEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vérification email requise</p>
                    <p className="text-sm text-gray-600">Les utilisateurs doivent vérifier leur email</p>
                  </div>
                  <Switch 
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => handleSettingChange('emailVerificationRequired', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Approbation automatique des cours</p>
                    <p className="text-sm text-gray-600">Les cours sont publiés sans modération</p>
                  </div>
                  <Switch 
                    checked={settings.autoApprovalCourses}
                    onCheckedChange={(checked) => handleSettingChange('autoApprovalCourses', checked)}
                  />
                </div> ²ssdr' 
                
                <div>
                  <label className="block text-sm font-medium mb-2">Taille max upload (MB)</label>
                  <Input 
                    type="number"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => handleSettingChange('maxFileUploadSize', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Configuration email
                </CardTitle>
                <CardDescription>Paramètres des notifications par email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Serveur SMTP</label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Port SMTP</label>
                    <Input placeholder="587" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                    <Input placeholder="user@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mot de passe</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email expéditeur</label>
                  <Input placeholder="noreply@Learneezy.com" />
                </div>
                
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Tester la configuration
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel latéral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo du site</label>
                  <Input 
                    placeholder="URL du logo"
                    value={settings.logoUrl}
                    onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur principale</label>
                  <div className="flex space-x-2">
                    <Input 
                      type="color"
                      value={settings.mainColor}
                      onChange={(e) => handleSettingChange('mainColor', e.target.value)}
                      className="w-16"
                    />
                    <Input 
                      value={settings.mainColor}
                      onChange={(e) => handleSettingChange('mainColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Prévisualiser les changements
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications email</p>
                    <p className="text-sm text-gray-600">Alertes système par email</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-gray-600">Notifications navigateur</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Sauvegarde & maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleBackup}>
                  <Database className="h-4 w-4 mr-2" />
                  Sauvegarde complète
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRestore}>
                  <Code className="h-4 w-4 mr-2" />
                  Restaurer depuis sauvegarde
                </Button>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Dernière sauvegarde</p>
                  <p className="text-xs text-yellow-600">15 mars 2024 - 14:30</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Version plateforme</span>
                  <span className="font-medium">2.1.4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Base de données</span>
                  <span className="font-medium">PostgreSQL 14</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Espace utilisé</span>
                  <span className="font-medium">2.4 GB / 10 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime</span>
                  <span className="font-medium">15 jours 4h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
