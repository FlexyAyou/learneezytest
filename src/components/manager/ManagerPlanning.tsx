import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Users, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerPlanning = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedFormation, setSelectedFormation] = useState('all');

  const users = [
    { id: 1, name: 'Alice Bernard', email: 'alice@learneezy.com', role: 'Apprenant', status: 'Actif' },
    { id: 2, name: 'Thomas Petit', email: 'thomas@learneezy.com', role: 'Apprenant', status: 'Actif' },
    { id: 3, name: 'Emma Moreau', email: 'emma@learneezy.com', role: 'Apprenant', status: 'Inactif' },
    { id: 4, name: 'Lucas Durand', email: 'lucas@learneezy.com', role: 'Apprenant', status: 'Actif' },
    { id: 5, name: 'Sophie Laurent', email: 'sophie@learneezy.com', role: 'Formateur', status: 'Actif' },
  ];

  const formations = [
    { id: 1, title: 'React Development', duration: '40h', level: 'Intermédiaire' },
    { id: 2, title: 'UI/UX Design', duration: '35h', level: 'Débutant' },
    { id: 3, title: 'Project Management', duration: '25h', level: 'Avancé' },
    { id: 4, title: 'Marketing Digital', duration: '30h', level: 'Intermédiaire' },
  ];

  const assignedTrainings = [
    { 
      id: 1, 
      user: 'Alice Bernard', 
      formation: 'React Development', 
      startDate: '2024-01-15', 
      status: 'En cours',
      progress: 65 
    },
    { 
      id: 2, 
      user: 'Thomas Petit', 
      formation: 'UI/UX Design', 
      startDate: '2024-01-10', 
      status: 'Terminé',
      progress: 100 
    },
    { 
      id: 3, 
      user: 'Lucas Durand', 
      formation: 'Marketing Digital', 
      startDate: '2024-01-20', 
      status: 'Planifié',
      progress: 0 
    },
  ];

  const handleAssignTraining = () => {
    if (selectedUser !== 'all' && selectedFormation !== 'all') {
      toast({
        title: "Formation assignée",
        description: `Formation assignée avec succès à l'utilisateur sélectionné.`,
      });
      setSelectedUser('all');
      setSelectedFormation('all');
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur et une formation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Planning Opérationnel</h1>
        <p className="text-muted-foreground">Planification et affectation des formations aux utilisateurs</p>
      </div>

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Assigner une Formation
          </CardTitle>
          <CardDescription>Affectez des formations aux utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Utilisateur</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sélectionner un utilisateur</SelectItem>
                  {users.filter(u => u.role === 'Apprenant').map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Formation</label>
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sélectionner une formation</SelectItem>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id.toString()}>
                      {formation.title} ({formation.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAssignTraining} className="w-full">
                Assigner Formation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Liste des Utilisateurs
          </CardTitle>
          <CardDescription>Tous les utilisateurs du système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
            </div>
          </div>
          
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'Formateur' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'Actif' ? 'default' : 'destructive'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Trainings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Formations Assignées
          </CardTitle>
          <CardDescription>Suivi des affectations en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedTrainings.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{assignment.user}</p>
                  <p className="text-sm text-muted-foreground">{assignment.formation}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Début: {assignment.startDate}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      assignment.status === 'Terminé' ? 'default' : 
                      assignment.status === 'En cours' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {assignment.status}
                  </Badge>
                  <span className="text-sm">{assignment.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerPlanning;