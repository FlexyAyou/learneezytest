import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Edit, Ban, Mail, UserCheck, Building, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedOrganisation, setSelectedOrganisation] = useState('all');

  const users = [
    { 
      id: 1, 
      name: "Marie Dubois", 
      email: "marie@email.com", 
      role: "Formateur", 
      status: "Actif", 
      courses: 5, 
      students: 42, 
      joinedDate: "2024-01-15",
      slug: "marie-dubois",
      organisation: "Formation Excellence",
      organisationType: "OF"
    },
    { 
      id: 2, 
      name: "Pierre Martin", 
      email: "pierre@email.com", 
      role: "Apprenant", 
      status: "Actif", 
      courses: 12, 
      progress: "85%", 
      joinedDate: "2024-02-10",
      slug: "pierre-martin",
      organisation: "Learneezy",
      organisationType: "Direct"
    },
    { 
      id: 3, 
      name: "Sophie Durand", 
      email: "sophie@email.com", 
      role: "Formateur indépendant", 
      status: "Suspendu", 
      courses: 3, 
      students: 18, 
      joinedDate: "2024-01-20",
      slug: "sophie-durand",
      organisation: "Learneezy",
      organisationType: "Direct"
    },
    { 
      id: 4, 
      name: "Jean Dupont", 
      email: "jean@email.com", 
      role: "Administrateur", 
      status: "Actif", 
      lastLogin: "2024-03-15", 
      joinedDate: "2023-12-01",
      slug: "jean-dupont",
      organisation: "Learneezy",
      organisationType: "Admin"
    },
    { 
      id: 5, 
      name: "Lisa Chen", 
      email: "lisa@email.com", 
      role: "Gestionnaire", 
      status: "Actif", 
      courses: 8, 
      progress: "45%", 
      joinedDate: "2024-03-01",
      slug: "lisa-chen",
      organisation: "Centre Alpha",
      organisationType: "OF"
    },
    { 
      id: 6, 
      name: "Thomas Bernard", 
      email: "thomas@email.com", 
      role: "Animateur", 
      status: "Actif", 
      courses: 15, 
      students: 67, 
      joinedDate: "2024-02-15",
      slug: "thomas-bernard",
      organisation: "Institut Beta",
      organisationType: "OF"
    }
  ];

  const handleAddUser = () => {
    navigate('/dashboard/superadmin/users/add');
  };

  const handleGroupEnrollment = () => {
    navigate('/dashboard/superadmin/users/group-enrollment');
  };

  const handleUserDetail = (userSlug: string) => {
    navigate(`/dashboard/superadmin/users/${userSlug}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-800';
      case 'Formateur': return 'bg-blue-100 text-blue-800';
      case 'Formateur indépendant': return 'bg-purple-100 text-purple-800';
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Animateur': return 'bg-yellow-100 text-yellow-800';
      case 'Apprenant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-yellow-100 text-yellow-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      case 'En attente': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganisationColor = (organisationType: string) => {
    switch (organisationType) {
      case 'OF': return 'bg-blue-50 text-blue-700';
      case 'Direct': return 'bg-pink-50 text-pink-700';
      case 'Admin': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesOrganisation = selectedOrganisation === 'all' || user.organisationType === selectedOrganisation;
    
    return matchesSearch && matchesRole && matchesOrganisation;
  });

  // Statistiques par type
  const stats = {
    total: users.length,
    apprenants: users.filter(u => u.role === 'Apprenant').length,
    formateurs: users.filter(u => u.role === 'Formateur').length,
    formateurstIndependants: users.filter(u => u.role === 'Formateur indépendant').length,
    gestionnaires: users.filter(u => u.role === 'Gestionnaire').length,
    animateurs: users.filter(u => u.role === 'Animateur').length,
    admins: users.filter(u => u.role === 'Administrateur').length,
    affiliesOF: users.filter(u => u.organisationType === 'OF').length,
    learneezy: users.filter(u => u.organisationType === 'Direct' || u.organisationType === 'Admin').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGroupEnrollment} variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700">
            <UserCheck className="h-4 w-4 mr-2" />
            Inscription groupée
          </Button>
          <Button onClick={handleAddUser} className="bg-pink-600 hover:bg-pink-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tous profils</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.apprenants}</div>
            <p className="text-xs text-muted-foreground">Étudiants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.formateurs}</div>
            <p className="text-xs text-muted-foreground">Internes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Indépendants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.formateurstIndependants}</div>
            <p className="text-xs text-muted-foreground">Externes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Affiliés OF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.affiliesOF}</div>
            <p className="text-xs text-muted-foreground">Organismes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learneezy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{stats.learneezy}</div>
            <p className="text-xs text-muted-foreground">Directs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
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
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Apprenant">Apprenants</SelectItem>
                <SelectItem value="Formateur">Formateurs</SelectItem>
                <SelectItem value="Formateur indépendant">Formateurs indépendants</SelectItem>
                <SelectItem value="Gestionnaire">Gestionnaires</SelectItem>
                <SelectItem value="Animateur">Animateurs</SelectItem>
                <SelectItem value="Administrateur">Administrateurs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedOrganisation} onValueChange={setSelectedOrganisation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Toutes organisations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes organisations</SelectItem>
                <SelectItem value="OF">Affiliés OF</SelectItem>
                <SelectItem value="Direct">Learneezy Direct</SelectItem>
                <SelectItem value="Admin">Learneezy Admin</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs - simplifiée sans actions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>Cliquez sur un utilisateur pour voir ses détails</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleUserDetail(user.slug)}
                >
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
                    <div className="flex items-center space-x-2">
                      <Badge className={getOrganisationColor(user.organisationType)}>
                        {user.organisationType === 'OF' && <Building className="h-3 w-3 mr-1" />}
                        {user.organisationType === 'Direct' && <User className="h-3 w-3 mr-1" />}
                        {user.organisationType === 'Admin' && <Users className="h-3 w-3 mr-1" />}
                        {user.organisation}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {(user.role === 'Formateur' || user.role === 'Formateur indépendant' || user.role === 'Animateur') && (
                        <>
                          <p>{user.courses} cours</p>
                          <p className="text-gray-500">{user.students} étudiants</p>
                        </>
                      )}
                      {user.role === 'Apprenant' && (
                        <>
                          <p>{user.courses} cours</p>
                          <p className="text-gray-500">Progression: {user.progress}</p>
                        </>
                      )}
                      {user.role === 'Administrateur' && (
                        <p className="text-gray-500">Dernière connexion: {user.lastLogin}</p>
                      )}
                      {user.role === 'Gestionnaire' && (
                        <>
                          <p>{user.courses} formations gérées</p>
                          <p className="text-gray-500">Progression: {user.progress}</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.joinedDate}
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
