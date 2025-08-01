
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Eye, Edit, Plus, Search, Filter, Mail, Phone, UserCheck } from 'lucide-react';
import { OFApprenantDetail } from './OFApprenantDetail';
import { OFAddApprenant } from './OFAddApprenant';

export const OFUtilisateurs = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');
  
  const [utilisateurs, setUtilisateurs] = useState([
    { 
      id: '1', 
      nom: 'Dupont', 
      prenom: 'Marie', 
      email: 'marie.dupont@email.com', 
      phone: '06 12 34 56 78',
      role: 'apprenant',
      status: 'active', 
      formation: 'React Avancé', 
      progression: 78,
      derniere_connexion: '2024-01-20'
    },
    { 
      id: '2', 
      nom: 'Martin', 
      prenom: 'Jean', 
      email: 'jean.martin@email.com', 
      phone: '06 23 45 67 89',
      role: 'animateur',
      status: 'active', 
      formation: 'JavaScript', 
      progression: 100,
      derniere_connexion: '2024-01-19'
    },
    { 
      id: '3', 
      nom: 'Bernard', 
      prenom: 'Sophie', 
      email: 'sophie.bernard@email.com', 
      phone: '06 34 56 78 90',
      role: 'administrateur',
      status: 'active', 
      formation: 'Angular', 
      progression: 45,
      derniere_connexion: '2024-01-18'
    },
    { 
      id: '4', 
      nom: 'Durand', 
      prenom: 'Pierre', 
      email: 'pierre.durand@email.com', 
      phone: '06 45 67 89 01',
      role: 'apprenant',
      status: 'pending', 
      formation: 'Vue.js', 
      progression: 62,
      derniere_connexion: '2024-01-17'
    },
    { 
      id: '5', 
      nom: 'Moreau', 
      prenom: 'Claire', 
      email: 'claire.moreau@email.com', 
      phone: '06 56 78 90 12',
      role: 'proprietaire',
      status: 'active', 
      formation: null, 
      progression: null,
      derniere_connexion: '2024-01-21'
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      inactive: { variant: 'destructive' as const, label: 'Inactif' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      apprenant: { variant: 'default' as const, label: 'Apprenant', color: 'bg-blue-100 text-blue-800' },
      animateur: { variant: 'secondary' as const, label: 'Animateur', color: 'bg-green-100 text-green-800' },
      administrateur: { variant: 'outline' as const, label: 'Administrateur', color: 'bg-purple-100 text-purple-800' },
      proprietaire: { variant: 'destructive' as const, label: 'Propriétaire', color: 'bg-red-100 text-red-800' },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { variant: 'outline' as const, label: role, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleAddUser = (newUser: any) => {
    setUtilisateurs(prev => [...prev, newUser]);
  };

  // Filtrage des utilisateurs
  const filteredUsers = utilisateurs.filter(user => {
    const matchesSearch = 
      `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'tous' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'tous' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Statistiques par rôle
  const stats = {
    total: utilisateurs.length,
    apprenants: utilisateurs.filter(u => u.role === 'apprenant').length,
    animateurs: utilisateurs.filter(u => u.role === 'animateur').length,
    administrateurs: utilisateurs.filter(u => u.role === 'administrateur').length,
    proprietaires: utilisateurs.filter(u => u.role === 'proprietaire').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérer tous les utilisateurs de l'organisme de formation</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.apprenants}</p>
                <p className="text-sm text-muted-foreground">Apprenants</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.animateurs}</p>
                <p className="text-sm text-muted-foreground">Animateurs</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.administrateurs}</p>
                <p className="text-sm text-muted-foreground">Administrateurs</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.proprietaires}</p>
                <p className="text-sm text-muted-foreground">Propriétaires</p>
              </div>
              <UserCheck className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les rôles</SelectItem>
                <SelectItem value="apprenant">Apprenants</SelectItem>
                <SelectItem value="animateur">Animateurs</SelectItem>
                <SelectItem value="administrateur">Administrateurs</SelectItem>
                <SelectItem value="proprietaire">Propriétaires</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setRoleFilter('tous');
              setStatusFilter('tous');
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
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
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{user.prenom} {user.nom}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.formation ? user.formation : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.progression !== null ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${user.progression}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{user.progression}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.derniere_connexion}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OFApprenantDetail
        apprenant={selectedUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <OFAddApprenant
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};
