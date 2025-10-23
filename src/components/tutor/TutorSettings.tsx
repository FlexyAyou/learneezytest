
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  Shield,
  Clock,
  Mail,
  Upload,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useUpdateProfile } from '@/hooks/useApi';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const TutorSettings = () => {
  const { toast } = useToast();
  const { user, updateUser } = useFastAPIAuth();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const updateProfileMutation = useUpdateProfile();

  // Valeurs initiales pour détecter les changements
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    avatar: ''
  });

  // Notifications settings
  const [notifications, setNotifications] = useState({
    emailNewStudent: true,
    emailProgress: true,
    emailMessages: true,
    pushNewStudent: false,
    pushProgress: true,
    pushMessages: true,
    weeklyReport: true,
    monthlyReport: false,
    marketingEmails: false
  });

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    }
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
      
      profileForm.reset({
        firstName: values.firstName,
        lastName: values.lastName,
        email: user.email || '',
        phone: values.phone,
        address: values.address,
        bio: values.bio
      });
      
      setAvatar(values.avatar);
      setInitialValues(values);
    }
  }, [user, profileForm]);

  // Surveiller les changements du formulaire
  const watchedValues = profileForm.watch();

  // Détection des changements
  const hasChanges = 
    watchedValues.firstName !== initialValues.firstName ||
    watchedValues.lastName !== initialValues.lastName ||
    watchedValues.phone !== initialValues.phone ||
    watchedValues.address !== initialValues.address ||
    watchedValues.bio !== initialValues.bio ||
    avatar !== initialValues.avatar;

  const passwordForm = useForm<PasswordFormData>();

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const updatedData = await updateProfileMutation.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        image: avatar
      });

      // Mettre à jour le contexte utilisateur local (pour la sidebar)
      updateUser(updatedData);

      // Mettre à jour les valeurs initiales
      setInitialValues({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        avatar: avatar
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive"
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe.",
        variant: "destructive"
      });
    }
  };

  const updateNotifications = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences de notification ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences.",
        variant: "destructive"
      });
    }
  };

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
        description: "N'oubliez pas de sauvegarder vos modifications",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    toast({
      title: "Photo supprimée",
      description: "N'oubliez pas de sauvegarder vos modifications",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <p className="text-gray-600">Gérez votre profil et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => inputFileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {avatar ? 'Changer' : 'Ajouter'}
                    </Button>
                    
                    {avatar && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRemovePhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    Tutrice Certifiée
                  </Badge>
                  <div className="text-center text-sm text-gray-600">
                    <p>Membre depuis Mars 2023</p>
                    <p>12 élèves accompagnés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informations personnelles
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Modifiez vos informations de profil</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          {...profileForm.register('firstName', { required: true })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          {...profileForm.register('lastName', { required: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register('email', { required: true })}
                        className="mt-1"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        {...profileForm.register('phone')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        {...profileForm.register('address')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        {...profileForm.register('bio')}
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" disabled={!hasChanges || updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? (
                        <>Mise à jour...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder les modifications
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Changer le mot de passe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...passwordForm.register('currentPassword', { required: true })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...passwordForm.register('newPassword', { 
                        required: true,
                        minLength: { value: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...passwordForm.register('confirmPassword', { required: true })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Le mot de passe doit contenir :</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Au moins 8 caractères</li>
                    <li>• Une lettre majuscule</li>
                    <li>• Une lettre minuscule</li>
                    <li>• Un chiffre</li>
                  </ul>
                </div>

                <Button type="submit">
                  <Lock className="h-4 w-4 mr-2" />
                  Modifier le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Notifications par email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNewStudent">Nouvel élève</Label>
                    <p className="text-sm text-gray-600">Notification lors de l'ajout d'un nouvel élève</p>
                  </div>
                  <Switch
                    id="emailNewStudent"
                    checked={notifications.emailNewStudent}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailNewStudent: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailProgress">Progrès des élèves</Label>
                    <p className="text-sm text-gray-600">Mise à jour sur les performances</p>
                  </div>
                  <Switch
                    id="emailProgress"
                    checked={notifications.emailProgress}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailProgress: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailMessages">Nouveaux messages</Label>
                    <p className="text-sm text-gray-600">Messages des élèves ou parents</p>
                  </div>
                  <Switch
                    id="emailMessages"
                    checked={notifications.emailMessages}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailMessages: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications push
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNewStudent">Nouvel élève</Label>
                    <p className="text-sm text-gray-600">Notification instantanée</p>
                  </div>
                  <Switch
                    id="pushNewStudent"
                    checked={notifications.pushNewStudent}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, pushNewStudent: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushProgress">Progrès des élèves</Label>
                    <p className="text-sm text-gray-600">Alertes de performance</p>
                  </div>
                  <Switch
                    id="pushProgress"
                    checked={notifications.pushProgress}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, pushProgress: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushMessages">Messages</Label>
                    <p className="text-sm text-gray-600">Messages instantanés</p>
                  </div>
                  <Switch
                    id="pushMessages"
                    checked={notifications.pushMessages}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, pushMessages: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Rapports périodiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReport">Rapport hebdomadaire</Label>
                  <p className="text-sm text-gray-600">Résumé des activités de la semaine</p>
                </div>
                <Switch
                  id="weeklyReport"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weeklyReport: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monthlyReport">Rapport mensuel</Label>
                  <p className="text-sm text-gray-600">Bilan mensuel détaillé</p>
                </div>
                <Switch
                  id="monthlyReport"
                  checked={notifications.monthlyReport}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, monthlyReport: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={updateNotifications}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les préférences
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences d'affichage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode sombre</Label>
                    <p className="text-sm text-gray-600">Interface en thème sombre</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animations</Label>
                    <p className="text-sm text-gray-600">Activer les animations de l'interface</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences de suivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Suivi automatique</Label>
                    <p className="text-sm text-gray-600">Mise à jour automatique des progrès</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rappels de session</Label>
                    <p className="text-sm text-gray-600">Notifications avant les sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
