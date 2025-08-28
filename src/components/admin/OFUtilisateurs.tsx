import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Plus, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { AddApprenantModal } from './AddApprenantModal';

export const OFUtilisateurs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Mock data des utilisateurs
  const [users, setUsers] = useState([
    { 
      id: '1', 
      nom: 'Dupont', 
      prenom: 'Marie', 
      email: 'marie.dupont@email.com', 
      role: 'Apprenant', 
      status: 'active',
      phone: '+33 6 12 34 56 78',
      joinDate: '2023-09-15',
      lastLogin: '2024-01-20'
    },
    { 
      id: '2', 
      nom: 'Martin', 
      prenom: 'Jean', 
      email: 'jean.martin@email.com', 
      role: 'Formateur', 
      status: 'active',
      phone: '+33 6 23 45 67 89',
      joinDate: '2023-08-10',
      lastLogin: '2024-01-19'
    },
    { 
      id: '3', 
      nom: 'Bernard', 
      prenom: 'Sophie', 
      email: 'sophie.bernard@email.com', 
      role: 'Apprenant', 
      status: 'pending',
      phone: '+33 6 34 56 78 90',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-18'
    },
    { 
      id: '4', 
      nom: 'Durand', 
      prenom: 'Pierre', 
      email: 'pierre.durand@email.com', 
      role: 'Gestionnaire', 
      status: 'active',
      phone: '+33 6 45 67 89 01',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-21'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-800';
      case 'Formateur': return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Apprenant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewUser = (user: any) => {
    console.log('Viewing user:', user);
    let userType;
    switch(user.role) {
      case 'Apprenant':
        userType = 'apprenant';
        break;
      case 'Formateur':
        userType = 'formateur';
        break;
      case 'Gestionnaire':
        userType = 'gestionnaire';
        break;
      default:
        userType = 'apprenant';
    }
    const userSlug = user.nom.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/organisme-formation/utilisateurs/${userType}/${userSlug}`);
  };

  const handleAddUser = (newUser: any) => {
    setUsers(prev => [...prev, newUser]);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez les utilisateurs de votre organisme de formation</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
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
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'Formateur').length}</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'Apprenant').length}</div>
            <p className="text-xs text-muted-foreground">Inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{users.filter(u => u.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Validation requise</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
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
              <option value="apprenant">Apprenants</option>
              <option value="formateur">Formateurs</option>
              <option value="gestionnaire">Gestionnaires</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.prenom[0]}{user.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.joinDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
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

      <AddApprenantModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};
