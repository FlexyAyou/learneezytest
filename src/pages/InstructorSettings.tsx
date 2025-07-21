
import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Globe, Shield, Camera, Save, BookOpen, Plus, BarChart3, Users, MessageSquare, Settings, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const InstructorSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Développeuse passionnée avec plus de 10 ans d\'expérience...',
    website: 'https://marie-dubois.dev',
    linkedin: 'https://linkedin.com/in/marie-dubois',
    twitter: '@marie_dubois',
    specialities: 'React, JavaScript, Node.js',
    experience: '10+ ans'
  });

  const [notifications, setNotifications] = useState({
    emailNewStudent: true,
    emailCourseComments: true,
    emailWeeklyReport: false,
    pushNotifications: true,
    marketingEmails: false
  });

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: Home },
    { title: "Mes cours", href: "/dashboard/instructeur/courses", icon: BookOpen },
    { title: "Créer un cours", href: "/dashboard/instructeur/create-course", icon: Plus },
    { title: "Analytics", href: "/dashboard/instructeur/analytics", icon: BarChart3 },
    { title: "Étudiants", href: "/dashboard/instructeur/students", icon: Users },
    { title: "Messages", href: "/dashboard/instructeur/messagerie", icon: MessageSquare, badge: "5" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/instructeur/settings", icon: Settings, isActive: true },
  ];

  const userInfo = {
    name: "Marie Dubois",
    email: "marie.dubois@email.com"
  };

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Instructeur"
          subtitle="Gérez vos cours et étudiants"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez votre profil et vos préférences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="account">Compte</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles visibles par les étudiants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-pink-600" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialities">Spécialités</Label>
                      <Input
                        id="specialities"
                        value={formData.specialities}
                        onChange={(e) => setFormData({...formData, specialities: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Expérience</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Ajoutez vos liens de réseaux sociaux
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>
                    Gérez vos informations de compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouveaux étudiants</Label>
                      <p className="text-sm text-gray-600">Recevoir un email quand un étudiant s'inscrit</p>
                    </div>
                    <Switch
                      checked={notifications.emailNewStudent}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailNewStudent: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Commentaires de cours</Label>
                      <p className="text-sm text-gray-600">Recevoir un email pour les nouveaux commentaires</p>
                    </div>
                    <Switch
                      checked={notifications.emailCourseComments}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailCourseComments: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rapport hebdomadaire</Label>
                      <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire de vos performances</p>
                    </div>
                    <Switch
                      checked={notifications.emailWeeklyReport}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailWeeklyReport: checked})
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mot de passe actuel</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nouveau mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmer le mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                  <CardDescription>
                    Ajoutez une couche de sécurité supplémentaire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activer 2FA</Label>
                      <p className="text-sm text-gray-600">Utiliser une app d'authentification</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorSettings;
