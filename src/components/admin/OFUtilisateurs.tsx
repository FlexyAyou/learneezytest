
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Eye,
  UserPlus
} from 'lucide-react';
import { AddApprenantModal } from './AddApprenantModal';
import { AddUser } from './AddUser';

export const OFUtilisateurs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddApprenantOpen, setIsAddApprenantOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Mock data pour l'organisme de formation
  const users = [
    { id: 1, name: 'Marie Dubois', email: 'marie.dubois@email.com', role: 'Apprenant', status: 'active', formation: 'Développement Web', progression: 65, lastLogin: '2024-01-15' },
    { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Formateur', status: 'active', formation: '-', progression: 0, lastLogin: '2024-01-20' },
    { id: 3, name: 'Sophie Leroy', email: 'sophie.leroy@email.com', role: 'Apprenant', status: 'active', formation: 'Marketing Digital', progression: 80, lastLogin: '2024-01-18' },
    { id: 4, name: 'Pierre Moreau', email: 'pierre.moreau@email.com', role: 'Gestionnaire', status: 'active', formation: '-', progression: 0, lastLogin: '2024-01-19' },
    { id: 5, name: 'Claire Bernard', email: 'claire.bernard@email.com', role: 'Apprenant', status: 'inactive', formation: 'Gestion de Projet', progression: 25, lastLogin: '2024-01-10' },
    { id: 6, name: 'Thomas Petit', email: 'thomas.petit@email.com', role: 'Animateur', status: 'active', formation: '-', progression: 0, lastLogin: '2024-01-21' },
  ];

  // Statistiques
  const userStats = {
    total: users.length,
    apprenants: users.filter(u => u.role === 'Apprenant').length,
    formateurs: users.filter(u => u.role === 'Formateur').length,
    gestionnaires: users.filter(u => u.role === 'Gestionnaire').length,
    animateurs: users.filter(u => u.role === 'Animateur').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Formateur': return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Animateur': return 'bg-yellow-100 text-yellow-800';
      case 'Apprenant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' },
      suspended: { variant: 'destructive' as const, label: 'Suspendu' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleAddApprenant = (newApprenant: any) => {
    console.log('Nouvel apprenant ajouté:', newApprenant);
    // Ici vous pourriez ajouter l'apprenant à votre liste d'utilisateurs
    // ou faire un appel API pour l'enregistrer
  };

  const handleAddUser = (newUser: any) => {
    console.log('Nouvel utilisateur ajouté:', newUser);
    // Ici vous pourriez ajouter l'utilisateur à votre liste
    // ou faire un appel API pour l'enregistrer
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.apprenants}</div>
            <div className="text-sm text-gray-600">Apprenants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.formateurs}</div>
            <div className="text-sm text-gray-600">Formateurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.gestionnaires}</div>
            <div className="text-sm text-gray-600">Gestionnaires</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{userStats.animateurs}</div>
            <div className="text-sm text-gray-600">Animateurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{userStats.active}</div>
            <div className="text-sm text-gray-600">Actifs</div>
          </CardContent>
        </Card>
      </div>

      {/* Interface de gestion des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des utilisateurs ({filteredUsers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddApprenantOpen(true)} variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un apprenant
              </Button>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Apprenant">Apprenants</SelectItem>
                <SelectItem value="Formateur">Formateurs</SelectItem>
                <SelectItem value="Gestionnaire">Gestionnaires</SelectItem>
                <SelectItem value="Animateur">Animateurs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="suspended">Suspendus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.formation}</TableCell>
                    <TableCell>
                      {user.role === 'Apprenant' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${user.progression}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{user.progression}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddApprenantModal
        isOpen={isAddApprenantOpen}
        onClose={() => setIsAddApprenantOpen(false)}
        onAdd={handleAddApprenant}
      />

      <AddUser
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};
