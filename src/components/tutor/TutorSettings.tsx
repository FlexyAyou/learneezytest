
import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string;
  experience: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const TutorSettings = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
      firstName: 'Claire',
      lastName: 'Durand',
      email: 'claire.durand@email.com',
      phone: '06 12 34 56 78',
      bio: 'Tutrice expérimentée spécialisée dans l\'accompagnement personnalisé des élèves du primaire au lycée.',
      specialties: 'Mathématiques, Sciences, Français',
      experience: '5 ans d\'expérience dans l\'enseignement personnalisé'
    }
  });

  const passwordForm = useForm<PasswordFormData>();

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    } finally {
      setIsUpdating(false);
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

    setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  const updateNotifications = async () => {
    setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
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
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">CD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
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
                  <CardTitle>Informations personnelles</CardTitle>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email', { required: true })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          {...profileForm.register('phone')}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialties">Spécialités</Label>
                      <Input
                        id="specialties"
                        {...profileForm.register('specialties')}
                        placeholder="Matières que vous enseignez..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Expérience</Label>
                      <Input
                        id="experience"
                        {...profileForm.register('experience')}
                        placeholder="Votre expérience professionnelle..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        {...profileForm.register('bio')}
                        placeholder="Décrivez-vous en quelques mots..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>Mise à jour...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
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

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>Modification...</>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Modifier le mot de passe
                    </>
                  )}
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
            <Button onClick={updateNotifications} disabled={isUpdating}>
              {isUpdating ? (
                <>Sauvegarde...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les préférences
                </>
              )}
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
