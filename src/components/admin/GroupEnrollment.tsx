
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, Calendar, FileText, Building, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
// import { supabase } from '@/integrations/supabase/client';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  instructor_id: string;
  status: string;
}

export const GroupEnrollment = () => {
  const { toast } = useToast();
  
  // États pour l'inscription groupée
  const [enrollmentType, setEnrollmentType] = useState<'individual' | 'role'>('individual');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('none');
  const [notificationSettings, setNotificationSettings] = useState({
    sendEmail: true,
    includeProgramFile: true,
    includeConvocation: true,
    customMessage: ''
  });

  // Données mockées
  const users: User[] = [
    { id: '1', first_name: 'Marie', last_name: 'Dupont', role: 'student', status: 'active' },
    { id: '2', first_name: 'Jean', last_name: 'Martin', role: 'student', status: 'active' },
    { id: '3', first_name: 'Sophie', last_name: 'Bernard', role: 'instructor', status: 'active' },
    { id: '4', first_name: 'Pierre', last_name: 'Durand', role: 'student', status: 'active' },
    { id: '5', first_name: 'Emma', last_name: 'Leroy', role: 'content_creator', status: 'active' },
    { id: '6', first_name: 'Alex', last_name: 'Dubois', role: 'tutor', status: 'active' },
    { id: '7', first_name: 'Sarah', last_name: 'Moreau', role: 'technician', status: 'active' },
  ];

  const courses: Course[] = [
    { id: '1', title: 'Formation React Avancé', description: 'Développement d\'applications React', start_date: '2024-02-15', end_date: '2024-03-15', instructor_id: '3', status: 'active' },
    { id: '2', title: 'Gestion de Projet Agile', description: 'Méthodologies agiles et Scrum', start_date: '2024-02-20', end_date: '2024-03-20', instructor_id: '2', status: 'active' },
    { id: '3', title: 'Marketing Digital', description: 'Stratégies de marketing en ligne', start_date: '2024-03-01', end_date: '2024-04-01', instructor_id: '1', status: 'active' },
  ];

  const roles = ['student', 'instructor', 'manager', 'admin', 'content_creator', 'tutor', 'technician'];
  const usersLoading = false;
  const coursesLoading = false;

  const getFilteredUsers = () => {
    switch (enrollmentType) {
      case 'role':
        return selectedRole && selectedRole !== 'all' ? users.filter(user => user.role === selectedRole) : [];
      default:
        return users;
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => 
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = () => {
    const filteredUsers = getFilteredUsers();
    if (enrollmentType === 'individual') {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleEnrollment = async () => {
    if (!selectedCourse || selectedCourse === 'none') {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une formation",
        variant: "destructive"
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun utilisateur sélectionné",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulation de l'inscription groupée
      const course = courses.find(c => c.id === selectedCourse);
      const enrolledUsers = users.filter(user => selectedUsers.includes(user.id));
      
      console.log('Inscription groupée:', {
        course,
        users: enrolledUsers,
        type: enrollmentType,
        notificationSettings
      });

      // Simulation d'envoi des notifications
      if (notificationSettings.sendEmail) {
        for (const user of enrolledUsers) {
          console.log(`Email envoyé à ${user.first_name}.${user.last_name}@email.com pour la formation ${course?.title}`);
        }
      }

      toast({
        title: "Inscription groupée réussie",
        description: `${selectedUsers.length} utilisateur(s) inscrit(s) à la formation "${course?.title}". ${notificationSettings.sendEmail ? 'Notifications envoyées.' : ''}`
      });

      // Réinitialisation du formulaire
      setSelectedUsers([]);
      setSelectedCourse('none');
      setEnrollmentType('individual');

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription groupée",
        variant: "destructive"
      });
    }
  };

  const selectedUsersData = users.filter(user => selectedUsers.includes(user.id));
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inscription Groupée</h2>
          <p className="text-gray-600">Inscrire plusieurs utilisateurs simultanément à une formation</p>
        </div>
      </div>

      <Tabs defaultValue="selection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="selection">Sélection des utilisateurs</TabsTrigger>
          <TabsTrigger value="course">Formation et paramètres</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
        </TabsList>

        {/* Onglet 1: Sélection des utilisateurs */}
        <TabsContent value="selection">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Critères de sélection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Critères de sélection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Type de sélection</Label>
                  <Select value={enrollmentType} onValueChange={(value: any) => {
                    setEnrollmentType(value);
                    setSelectedUsers([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Sélection individuelle</SelectItem>
                      <SelectItem value="role">Par rôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {enrollmentType === 'role' && (
                  <div>
                    <Label>Rôle</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>
                            {role === 'student' ? 'Étudiant' : 
                             role === 'instructor' ? 'Formateur' :
                             role === 'manager' ? 'Gestionnaire' : 
                             role === 'admin' ? 'Administrateur' :
                             role === 'content_creator' ? 'Créateur de contenu' :
                             role === 'tutor' ? 'Tuteur' :
                             role === 'technician' ? 'Technicien' : role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Tout sélectionner
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Tout désélectionner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des utilisateurs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Utilisateurs disponibles</span>
                  <Badge variant="secondary">
                    {selectedUsers.length} sélectionné(s)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Chargement des utilisateurs...</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getFilteredUsers().map(user => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.first_name} {user.last_name}</span>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Statut: {user.status}</p>
                        </div>
                      </div>
                    ))}
                    {getFilteredUsers().length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        Aucun utilisateur ne correspond aux critères sélectionnés
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet 2: Formation et paramètres */}
        <TabsContent value="course">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sélection de la formation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coursesLoading ? (
                  <div className="text-center py-4">Chargement des formations...</div>
                ) : (
                  <>
                    <div>
                      <Label>Sélectionner une formation</Label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une formation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune formation sélectionnée</SelectItem>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCourseData && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">{selectedCourseData.title}</h4>
                        {selectedCourseData.description && (
                          <p className="text-sm text-gray-600 mb-2">{selectedCourseData.description}</p>
                        )}
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><Calendar className="h-4 w-4 inline mr-1" />
                            Du {new Date(selectedCourseData.start_date).toLocaleDateString()} 
                            au {new Date(selectedCourseData.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Paramètres de notification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Notifications automatiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={notificationSettings.sendEmail}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, sendEmail: checked as boolean }))
                    }
                  />
                  <Label htmlFor="sendEmail">Envoyer une notification par e-mail</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeProgramFile"
                    checked={notificationSettings.includeProgramFile}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, includeProgramFile: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeProgramFile">Inclure le programme de formation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeConvocation"
                    checked={notificationSettings.includeConvocation}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, includeConvocation: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeConvocation">Inclure la convocation</Label>
                </div>

                <div>
                  <Label htmlFor="customMessage">Message personnalisé (optionnel)</Label>
                  <Textarea
                    id="customMessage"
                    value={notificationSettings.customMessage}
                    onChange={(e) => 
                      setNotificationSettings(prev => ({ ...prev, customMessage: e.target.value }))
                    }
                    placeholder="Ajoutez un message personnalisé à inclure dans la notification..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet 3: Confirmation */}
        <TabsContent value="confirmation">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de l'inscription groupée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Résumé de la formation */}
              {selectedCourseData && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Formation sélectionnée</h4>
                  <p className="text-blue-800">{selectedCourseData.title}</p>
                  <p className="text-sm text-blue-600">
                    Du {new Date(selectedCourseData.start_date).toLocaleDateString()} 
                    au {new Date(selectedCourseData.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Résumé des utilisateurs */}
              <div>
                <h4 className="font-medium mb-3">
                  Utilisateurs à inscrire ({selectedUsersData.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedUsersData.map(user => (
                    <div key={user.id} className="p-2 bg-gray-50 rounded flex items-center space-x-2">
                      <UserPlus className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{user.first_name} {user.last_name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé des notifications */}
              {notificationSettings.sendEmail && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Notifications qui seront envoyées</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• E-mail de confirmation d'inscription</li>
                    <li>• Détails de la formation (dates, horaires, lien d'accès)</li>
                    {notificationSettings.includeProgramFile && <li>• Programme de formation</li>}
                    {notificationSettings.includeConvocation && <li>• Convocation officielle</li>}
                    {notificationSettings.customMessage && <li>• Message personnalisé</li>}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button variant="outline">
                  Annuler
                </Button>
                <Button 
                  onClick={handleEnrollment}
                  disabled={!selectedCourse || selectedCourse === 'none' || selectedUsers.length === 0}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Confirmer l'inscription groupée
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
