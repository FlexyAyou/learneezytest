
import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, UserX, Shield, Search, Filter, MoreHorizontal, Edit, Ban, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    { id: 1, name: "Marie Dubois", email: "marie@email.com", role: "Instructeur", status: "Actif", courses: 5, students: 42, joinedDate: "2024-01-15" },
    { id: 2, name: "Pierre Martin", email: "pierre@email.com", role: "Étudiant", status: "Actif", courses: 12, progress: "85%", joinedDate: "2024-02-10" },
    { id: 3, name: "Sophie Durand", email: "sophie@email.com", role: "Instructeur", status: "Suspendu", courses: 3, students: 18, joinedDate: "2024-01-20" },
    { id: 4, name: "Jean Dupont", email: "jean@email.com", role: "Admin", status: "Actif", lastLogin: "2024-03-15", joinedDate: "2023-12-01" },
    { id: 5, name: "Lisa Chen", email: "lisa@email.com", role: "Étudiant", status: "Inactif", courses: 8, progress: "45%", joinedDate: "2024-03-01" }
  ];

  const handleUserAction = (userId: number, action: string) => {
    toast({
      title: `Action utilisateur`,
      description: `${action} appliquée à l'utilisateur ${userId}`,
    });
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Action groupée",
      description: `${action} appliquée aux utilisateurs sélectionnés`,
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Ajouter un utilisateur",
      description: "Interface de création d'un nouvel utilisateur",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Instructeur': return 'bg-blue-100 text-blue-800';
      case 'Étudiant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-yellow-100 text-yellow-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
          <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <Button onClick={handleAddUser} className="bg-pink-600 hover:bg-pink-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Instructeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+3 cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,698</div>
            <p className="text-xs text-muted-foreground">+89% d'engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comptes suspendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">25</div>
            <p className="text-xs text-muted-foreground">-5 depuis hier</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="instructor">Instructeurs</option>
              <option value="student">Étudiants</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('Approuver')}>
              <UserCheck className="h-4 w-4 mr-2" />
              Approuver sélection
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('Suspendre')}>
              <Ban className="h-4 w-4 mr-2" />
              Suspendre sélection
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('Envoyer email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email groupé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Gérez tous les comptes utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.role === 'Instructeur' && (
                        <>
                          <p>{user.courses} cours</p>
                          <p className="text-gray-500">{user.students} étudiants</p>
                        </>
                      )}
                      {user.role === 'Étudiant' && (
                        <>
                          <p>{user.courses} cours</p>
                          <p className="text-gray-500">Progression: {user.progress}</p>
                        </>
                      )}
                      {user.role === 'Admin' && (
                        <p className="text-gray-500">Dernière connexion: {user.lastLogin}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.joinedDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'Modifier')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'Voir détails')}>
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'Plus d\'options')}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
