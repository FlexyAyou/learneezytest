import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Users,
  Mail,
  Phone,
  Building,
  Camera,
  X,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useUpdateProfile } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ManagerSettings = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading, updateUser } = useFastAPIAuth();
  const updateProfileMutation = useUpdateProfile();
  
  // États du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  
  // Valeurs initiales pour détecter les changements
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    avatar: ''
  });
  
  const [settings, setSettings] = useState({
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

  // Initialiser les champs avec les données utilisateur
  useEffect(() => {
    if (user) {
      const values = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.image || ''
      };
      
      setFirstName(values.firstName);
      setLastName(values.lastName);
      setPhone(values.phone);
      setAddress(values.address);
      setBio(values.bio);
      setAvatar(values.avatar);
      setInitialValues(values);
    }
  }, [user]);

  // Détection des changements
  const hasChanges = 
    firstName !== initialValues.firstName ||
    lastName !== initialValues.lastName ||
    phone !== initialValues.phone ||
    address !== initialValues.address ||
    bio !== initialValues.bio ||
    avatar !== initialValues.avatar;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez choisir une image JPG, PNG ou WEBP",
        variant: "destructive",
      });
      return;
    }

    // Validation de la taille (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5 MB",
        variant: "destructive",
      });
      return;
    }

    // Conversion en base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      
      toast({
        title: "Photo sélectionnée",
        description: "Cliquez sur 'Sauvegarder' pour enregistrer les modifications",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    toast({
      title: "Photo retirée",
      description: "Cliquez sur 'Sauvegarder' pour enregistrer les modifications",
    });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfileMutation.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        bio,
        image: avatar,
      });
      
      // Mettre à jour immédiatement la sidebar sans rechargement
      updateUser(updatedUser);
      
      // Mettre à jour les valeurs initiales
      const newValues = {
        firstName: updatedUser.first_name || '',
        lastName: updatedUser.last_name || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        bio: updatedUser.bio || '',
        avatar: updatedUser.image || ''
      };
      setInitialValues(newValues);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    toast({
      title: "Mot de passe",
      description: "Fonctionnalité de changement de mot de passe à venir",
    });
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
        </div>
      </div>

      {/* Photo de profil et Informations personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                {avatar ? (
                  <AvatarImage src={avatar} alt={`${user?.first_name} ${user?.last_name}`} />
                ) : (
                  <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Changer
                </Button>
                {avatar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Informations personnelles
            </CardTitle>
            <CardDescription>Modifiez vos informations de profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="bg-muted cursor-not-allowed" 
              />
              <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Votre adresse complète" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                className="min-h-[100px]"
                placeholder="Parlez-nous de vous, de votre expertise..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={handleSaveProfile}
              disabled={!hasChanges || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" />
            Sécurité
          </CardTitle>
          <CardDescription>Modifiez votre mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <Button variant="outline" className="mt-4" onClick={handleChangePassword}>
            Changer le mot de passe
          </Button>
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

      {/* Options avancées de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Options avancées
          </CardTitle>
          <CardDescription>
            Gérez vos paramètres de sécurité supplémentaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
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