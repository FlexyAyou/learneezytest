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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  group?: string;
  establishment?: string;
}

interface Course {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  instructor: string;
}

export const GroupEnrollment = () => {
  const { toast } = useToast();
  
  // États pour l'inscription groupée
  const [enrollmentType, setEnrollmentType] = useState<'individual' | 'role' | 'group' | 'establishment'>('individual');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedEstablishment, setSelectedEstablishment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    sendEmail: true,
    includeProgramFile: true,
    includeConvocation: true,
    customMessage: ''
  });

  // Données mockées
  const users: User[] = [
    { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', role: 'student', group: 'Classe A', establishment: 'Campus Paris' },
    { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', role: 'student', group: 'Classe A', establishment: 'Campus Paris' },
    { id: '3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.com', role: 'instructor', establishment: 'Campus Lyon' },
    { id: '4', firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@email.com', role: 'student', group: 'Classe B', establishment: 'Campus Lyon' },
    { id: '5', firstName: 'Emma', lastName: 'Leroy', email: 'emma.leroy@email.com', role: 'student', group: 'Classe B', establishment: 'Campus Paris' },
  ];

  const courses: Course[] = [
    { id: '1', title: 'Formation React Avancé', startDate: '2024-02-15', endDate: '2024-03-15', instructor: 'Sophie Bernard' },
    { id: '2', title: 'Gestion de Projet Agile', startDate: '2024-02-20', endDate: '2024-03-20', instructor: 'Jean Martin' },
    { id: '3', title: 'Marketing Digital', startDate: '2024-03-01', endDate: '2024-04-01', instructor: 'Marie Dupont' },
  ];

  const roles = ['student', 'instructor', 'manager', 'admin'];
  const groups = ['Classe A', 'Classe B', 'Promotion 2024', 'Formation Continue'];
  const establishments = ['Campus Paris', 'Campus Lyon', 'Campus Marseille', 'Centre Formation'];

  const getFilteredUsers = () => {
    switch (enrollmentType) {
      case 'role':
        return selectedRole ? users.filter(user => user.role === selectedRole) : [];
      case 'group':
        return selectedGroup ? users.filter(user => user.group === selectedGroup) : [];
      case 'establishment':
        return selectedEstablishment ? users.filter(user => user.establishment === selectedEstablishment) : [];
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
    if (!selectedCourse) {
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
          console.log(`Email envoyé à ${user.email} pour la formation ${course?.title}`);
        }
      }

      toast({
        title: "Inscription groupée réussie",
        description: `${selectedUsers.length} utilisateur(s) inscrit(s) à la formation "${course?.title}". ${notificationSettings.sendEmail ? 'Notifications envoyées.' : ''}`
      });

      // Réinitialisation du formulaire
      setSelectedUsers([]);
      setSelectedCourse('');
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
                      <SelectItem value="group">Par groupe/classe</SelectItem>
                      <SelectItem value="establishment">Par établissement</SelectItem>
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
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>
                            {role === 'student' ? 'Étudiant' : 
                             role === 'instructor' ? 'Formateur' :
                             role === 'manager' ? 'Gestionnaire' : 'Administrateur'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {enrollmentType === 'group' && (
                  <div>
                    <Label>Groupe/Classe</Label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {enrollmentType === 'establishment' && (
                  <div>
                    <Label>Établissement</Label>
                    <Select value={selectedEstablishment} onValueChange={setSelectedEstablishment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un établissement" />
                      </SelectTrigger>
                      <SelectContent>
                        {establishments.map(establishment => (
                          <SelectItem key={establishment} value={establishment}>{establishment}</SelectItem>
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
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getFilteredUsers().map(user => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.group && (
                          <p className="text-xs text-gray-500">Groupe: {user.group}</p>
                        )}
                        {user.establishment && (
                          <p className="text-xs text-gray-500">Établissement: {user.establishment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {getFilteredUsers().length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Aucun utilisateur ne correspond aux critères sélectionnés
                    </p>
                  )}
                </div>
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
                <div>
                  <Label>Sélectionner une formation</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez une formation" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><Calendar className="h-4 w-4 inline mr-1" />
                        Du {new Date(selectedCourseData.startDate).toLocaleDateString()} 
                        au {new Date(selectedCourseData.endDate).toLocaleDateString()}
                      </p>
                      <p><Users className="h-4 w-4 inline mr-1" />
                        Formateur: {selectedCourseData.instructor}
                      </p>
                    </div>
                  </div>
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
                    Du {new Date(selectedCourseData.startDate).toLocaleDateString()} 
                    au {new Date(selectedCourseData.endDate).toLocaleDateString()}
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
                      <span className="text-sm">{user.firstName} {user.lastName}</span>
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
                  disabled={!selectedCourse || selectedUsers.length === 0}
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