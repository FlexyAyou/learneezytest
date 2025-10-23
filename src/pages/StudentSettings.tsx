
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Globe, Shield, Trash2, Camera, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProfile } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const StudentSettings = () => {
  const { user, isLoading: authLoading, updateUser } = useFastAPIAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  
  // États du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    courseUpdates: true,
    marketing: false
  });

  // Initialiser les champs avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setBio(user.bio || '');
      setAvatar(user.image || '');
    }
  }, [user]);

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

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et informations personnelles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      <AvatarFallback className="text-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white">
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
                  <User className="h-5 w-5 mr-2 text-pink-600" />
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
                  <Input id="email" type="email" value={user?.email || ''} disabled className="bg-gray-100 cursor-not-allowed" />
                  <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
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
                  <textarea 
                    id="bio"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Parlez-nous de vous..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-pink-600 hover:bg-pink-700"
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                </Button>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-pink-600" />
                  Sécurité
                </CardTitle>
                <CardDescription>Modifiez votre mot de passe et gérez la sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-gray-600">Sécurisez votre compte</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-pink-600" />
                  Notifications
                </CardTitle>
                <CardDescription>Gérez vos préférences de notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-gray-600">Recevez des emails pour les mises à jour</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mises à jour de cours</Label>
                    <p className="text-sm text-gray-600">Nouveaux contenus et annonces</p>
                  </div>
                  <Switch 
                    checked={notifications.courseUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, courseUpdates: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing</Label>
                    <p className="text-sm text-gray-600">Promotions et nouveautés</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Préférences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-pink-600" />
                  Préférences
                </CardTitle>
                <CardDescription>Personnalisez votre expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select defaultValue="fr">
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
                  <Select defaultValue="europe/paris">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                      <SelectItem value="america/new_york">America/New_York</SelectItem>
                      <SelectItem value="asia/tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de danger */}
          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Shield className="h-5 w-5 mr-2" />
                Zone de danger
              </CardTitle>
              <CardDescription>Actions irréversibles sur votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900">Supprimer le compte</h4>
                  <p className="text-sm text-red-600">Cette action est irréversible</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
    </div>
  );
};

export default StudentSettings;
