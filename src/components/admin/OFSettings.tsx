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
import { fastAPIClient } from '@/services/fastapi-client';

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

  // Organization state
  const [orgData, setOrgData] = useState({
    name: '',
    description: '',
    legal_representative: '',
    contact_email: '',
    address: '',
    postal_code: '',
    city: '',
    phone: '',
    siret: '',
    numero_declaration: '',
  });
  const [initialOrgData, setInitialOrgData] = useState<any>(null);

  // État des paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewStudent: true,
    emailCompletedCourse: true,
    emailDocumentSigned: true,
    smsReminders: false,
    weeklyReports: true,
    monthlyReports: true
  });

  // Load organization data
  React.useEffect(() => {
    const loadOrg = async () => {
      if (user?.of_id) {
        try {
          const org = await fastAPIClient.getOrganization(user.of_id);
          const data = {
            name: org.name || '',
            description: org.description || '',
            legal_representative: org.legal_representative || '',
            contact_email: org.contact_email || '',
            address: org.address || '',
            postal_code: org.postal_code || '',
            city: org.city || '',
            phone: org.phone || '',
            siret: org.siret || '',
            numero_declaration: org.numero_declaration || '',
          };
          setOrgData({ ...data });
          setInitialOrgData({ ...data });
        } catch (error) {
          console.error("Error loading organization details", error);
        }
      }
    };
    loadOrg();
  }, [user?.of_id]);

  const hasOrgChanges = initialOrgData ? JSON.stringify(orgData) !== JSON.stringify(initialOrgData) : false;

  const handleSaveOrganization = async () => {
    if (!user?.of_id) return;
    setIsLoading(true);
    try {
      const updated = await fastAPIClient.updateOrganization(user.of_id, orgData);
      setOrgData({
        name: updated.name || '',
        description: updated.description || '',
        legal_representative: updated.legal_representative || '',
        contact_email: updated.contact_email || '',
        address: updated.address || '',
        postal_code: updated.postal_code || '',
        city: updated.city || '',
        phone: updated.phone || '',
        siret: updated.siret || '',
        numero_declaration: updated.numero_declaration || '',
      });
      setInitialOrgData(orgData);
      toast({
        title: "Organisation mise à jour",
        description: "Les informations de votre organisme ont été enregistrées.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour l'organisation.",
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
                Informations de votre organisme
              </CardTitle>
              <CardDescription>
                Gérez les informations légales et de contact de votre organisme de formation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nom de l'organisme</Label>
                  <Input
                    id="orgName"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalRep">Responsable / Représentant Légal</Label>
                  <Input
                    id="legalRep"
                    value={orgData.legal_representative}
                    onChange={(e) => setOrgData({ ...orgData, legal_representative: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="orgDesc">Description</Label>
                  <textarea
                    id="orgDesc"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={orgData.description}
                    onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="orgAddress">Adresse</Label>
                  <Input
                    id="orgAddress"
                    value={orgData.address}
                    onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgCP">Code Postal</Label>
                  <Input
                    id="orgCP"
                    value={orgData.postal_code}
                    onChange={(e) => setOrgData({ ...orgData, postal_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgCity">Ville</Label>
                  <Input
                    id="orgCity"
                    value={orgData.city}
                    onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgPhone">Téléphone</Label>
                  <Input
                    id="orgPhone"
                    value={orgData.phone}
                    onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Email de contact</Label>
                  <Input
                    id="orgEmail"
                    value={orgData.contact_email}
                    onChange={(e) => setOrgData({ ...orgData, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgSiret">SIRET</Label>
                  <Input
                    id="orgSiret"
                    value={orgData.siret}
                    onChange={(e) => setOrgData({ ...orgData, siret: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgNDA">Numéro Déclaration d'Activité (NDA)</Label>
                  <Input
                    id="orgNDA"
                    value={orgData.numero_declaration}
                    onChange={(e) => setOrgData({ ...orgData, numero_declaration: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveOrganization}
                  disabled={isLoading || !hasOrgChanges}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Enregistrement..." : "Sauvegarder les informations"}
                </Button>
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
