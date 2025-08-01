
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Building, User, Mail, Phone, MapPin, Shield, Bell, Palette, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OFSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // État des paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Centre de Formation Digital',
    description: 'Organisme de formation spécialisé dans le numérique',
    address: '123 Rue de la Formation, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@cfdigital.fr',
    website: 'https://cfdigital.fr',
    siret: '12345678901234',
    numeroDeclaration: '11-75-12345-75',
    qualiopiCertified: true
  });

  // État des paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewStudent: true,
    emailCompletedCourse: true,
    emailDocumentSigned: true,
    smsReminders: false,
    weeklyReports: true,
    monthlyReports: true
  });

  // État des paramètres d'apparence
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#ec4899',
    secondaryColor: '#8b5cf6',
    logoUrl: '/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png',
    customCss: ''
  });

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres généraux ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Notifications sauvegardées",
        description: "Les paramètres de notification ont été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Apparence sauvegardée",
        description: "Les paramètres d'apparence ont été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'apparence.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres de l'organisme</h1>
          <p className="text-gray-600">Gérer les paramètres et la configuration de votre organisme</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nom de l'organisme</Label>
                  <Input
                    id="organizationName"
                    value={generalSettings.organizationName}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      organizationName: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email principal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={generalSettings.website}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      website: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={generalSettings.siret}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      siret: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroDeclaration">Numéro de déclaration</Label>
                  <Input
                    id="numeroDeclaration"
                    value={generalSettings.numeroDeclaration}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      numeroDeclaration: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={generalSettings.description}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="qualiopi"
                  checked={generalSettings.qualiopiCertified}
                  onCheckedChange={(checked) => setGeneralSettings(prev => ({
                    ...prev,
                    qualiopiCertified: checked
                  }))}
                />
                <Label htmlFor="qualiopi">Certifié Qualiopi</Label>
                {generalSettings.qualiopiCertified && (
                  <Badge className="bg-green-100 text-green-800">Certifié</Badge>
                )}
              </div>
              <Button onClick={handleSaveGeneral} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les informations générales
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications email</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNewStudent">Nouvel apprenant inscrit</Label>
                    <Switch
                      id="emailNewStudent"
                      checked={notificationSettings.emailNewStudent}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        emailNewStudent: checked
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailCompletedCourse">Formation terminée</Label>
                    <Switch
                      id="emailCompletedCourse"
                      checked={notificationSettings.emailCompletedCourse}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        emailCompletedCourse: checked
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailDocumentSigned">Document signé</Label>
                    <Switch
                      id="emailDocumentSigned"
                      checked={notificationSettings.emailDocumentSigned}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        emailDocumentSigned: checked
                      }))}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications SMS</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsReminders">Rappels SMS</Label>
                  <Switch
                    id="smsReminders"
                    checked={notificationSettings.smsReminders}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      smsReminders: checked
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Rapports automatiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyReports">Rapports hebdomadaires</Label>
                    <Switch
                      id="weeklyReports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        weeklyReports: checked
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthlyReports">Rapports mensuels</Label>
                    <Switch
                      id="monthlyReports"
                      checked={notificationSettings.monthlyReports}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        monthlyReports: checked
                      }))}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personnalisation de l'apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        primaryColor: e.target.value
                      }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        primaryColor: e.target.value
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        secondaryColor: e.target.value
                      }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        secondaryColor: e.target.value
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL du logo</Label>
                <Input
                  id="logoUrl"
                  value={appearanceSettings.logoUrl}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    logoUrl: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCss">CSS personnalisé</Label>
                <Textarea
                  id="customCss"
                  value={appearanceSettings.customCss}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    customCss: e.target.value
                  }))}
                  rows={5}
                  placeholder="/* Votre CSS personnalisé */"
                />
              </div>
              <Button onClick={handleSaveAppearance} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder l'apparence
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                    <Switch id="twoFactor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="480">8 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Politique de mot de passe</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="minPasswordLength">Longueur minimale</Label>
                    <Select defaultValue="8">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 caractères</SelectItem>
                        <SelectItem value="8">8 caractères</SelectItem>
                        <SelectItem value="10">10 caractères</SelectItem>
                        <SelectItem value="12">12 caractères</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Caractères spéciaux requis</Label>
                    <Switch id="requireSpecialChars" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Chiffres requis</Label>
                    <Switch id="requireNumbers" defaultChecked />
                  </div>
                </div>
              </div>
              <Button disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la sécurité
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
