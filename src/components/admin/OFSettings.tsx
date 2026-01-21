import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, Shield, Bell, Save, Lock, Eye, EyeOff, Info, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OFSignatureManager, getStoredOFSignature } from './OFSignatureManager';

export const OFSettings = () => {
  const { toast } = useToast();
  const { user } = useFastAPIAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [ofSignatureUrl, setOfSignatureUrl] = useState<string | undefined>(() => {
    // Load signature from localStorage on mount
    return getStoredOFSignature() || undefined;
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // État des paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewStudent: true,
    emailCompletedCourse: true,
    emailDocumentSigned: true,
    smsReminders: false,
    weeklyReports: true,
    monthlyReports: true
  });

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

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSignature = (signatureData: string) => {
    // Signature is already stored in localStorage by OFSignatureManager
    setOfSignatureUrl(signatureData);
  };

  const handleDeleteSignature = () => {
    // Signature is already removed from localStorage by OFSignatureManager
    setOfSignatureUrl(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres de l'organisme</h1>
          <p className="text-muted-foreground">Gérer les paramètres et la configuration de votre organisme</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="signature" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            <span className="hidden sm:inline">Signature</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations de votre compte
              </CardTitle>
              <CardDescription>
                Ces informations sont gérées par l'administrateur Learneezy. Contactez le support pour toute modification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Les informations ci-dessous sont en lecture seule. Pour les modifier, veuillez contacter l'équipe Learneezy.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Prénom</Label>
                  <div className="p-3 bg-muted rounded-md text-foreground">
                    {user?.first_name || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Nom</Label>
                  <div className="p-3 bg-muted rounded-md text-foreground">
                    {user?.last_name || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="p-3 bg-muted rounded-md text-foreground">
                    {user?.email || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Rôle</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <Badge variant="secondary">{user?.role || '-'}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Organisme</Label>
                  <div className="p-3 bg-muted rounded-md text-foreground">
                    {(user as any)?.organization_name || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <Badge className="bg-green-100 text-green-800">
                      Actif
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signature">
          <OFSignatureManager 
            currentSignatureUrl={ofSignatureUrl}
            onSave={handleSaveSignature}
            onDelete={handleDeleteSignature}
          />
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

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Modifier votre mot de passe
              </CardTitle>
              <CardDescription>
                Changez votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordChange} 
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
