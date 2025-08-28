
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
import { useNavigate } from 'react-router-dom';
import { AddApprenantModal } from './AddApprenantModal';
import { AddUser } from './AddUser';

export const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');
  const [isAddApprenantOpen, setIsAddApprenantOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Mock data - tous les utilisateurs de la plateforme
  const users = [
    { id: 1, name: 'Marie Dubois', email: 'marie.dubois@email.com', role: 'Apprenant', status: 'active', organisation: 'Formation Excellence', organisationType: 'OF', formation: 'Développement Web', progression: 65, lastLogin: '2024-01-15' },
    { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Formateur', status: 'active', organisation: 'Formation Excellence', organisationType: 'OF', formation: '-', progression: 0, lastLogin: '2024-01-20' },
    { id: 3, name: 'Sophie Leroy', email: 'sophie.leroy@email.com', role: 'Apprenant', status: 'active', organisation: 'TechForm Pro', organisationType: 'OF', formation: 'Marketing Digital', progression: 80, lastLogin: '2024-01-18' },
    { id: 4, name: 'Pierre Moreau', email: 'pierre.moreau@email.com', role: 'Gestionnaire', status: 'active', organisation: 'Formation Excellence', organisationType: 'OF', formation: '-', progression: 0, lastLogin: '2024-01-19' },
    { id: 5, name: 'Claire Bernard', email: 'claire.bernard@email.com', role: 'Apprenant', status: 'inactive', organisation: 'EduSoft Academy', organisationType: 'OF', formation: 'Gestion de Projet', progression: 25, lastLogin: '2024-01-10' },
    { id: 6, name: 'Thomas Petit', email: 'thomas.petit@email.com', role: 'Formateur indépendant', status: 'active', organisation: 'Learneezy Direct', organisationType: 'Direct', formation: '-', progression: 0, lastLogin: '2024-01-21' },
    { id: 7, name: 'Camille Blanc', email: 'camille.blanc@email.com', role: 'Animateur', status: 'active', organisation: 'Learneezy Direct', organisationType: 'Direct', formation: '-', progression: 0, lastLogin: '2024-01-16' },
    { id: 8, name: 'Lucas Dupont', email: 'lucas.dupont@learneezy.com', role: 'Administrateur', status: 'active', organisation: 'Learneezy Administration', organisationType: 'Admin', formation: '-', progression: 0, lastLogin: '2024-01-22' }
  ];

  // Fonction pour obtenir l'URL de détail selon le rôle
  const getUserDetailUrl = (user: any) => {
    const slug = user.name.toLowerCase().replace(/\s+/g, '-');
    
    switch (user.role) {
      case 'Apprenant':
        return `/dashboard/superadmin/users/student/${slug}`;
      case 'Formateur':
        return `/dashboard/superadmin/users/trainer/${slug}`;
      case 'Formateur indépendant':
        return `/dashboard/superadmin/users/independent-trainer/${slug}`;
      case 'Gestionnaire':
        return `/dashboard/superadmin/users/manager/${slug}`;
      case 'Animateur':
        return `/dashboard/superadmin/users/animator/${slug}`;
      case 'Administrateur':
        return `/dashboard/superadmin/users/admin/${slug}`;
      default:
        return `/dashboard/superadmin/users/student/${slug}`;
    }
  };

  // Statistiques
  const userStats = {
    total: users.length,
    apprenants: users.filter(u => u.role === 'Apprenant').length,
    apprenantsActifs: users.filter(u => u.role === 'Apprenant' && u.status === 'active').length,
    formateurs: users.filter(u => u.role === 'Formateur').length,
    formateursIndep: users.filter(u => u.role === 'Formateur indépendant').length,
    gestionnaires: users.filter(u => u.role === 'Gestionnaire').length,
    animateurs: users.filter(u => u.role === 'Animateur').length,
    administrateurs: users.filter(u => u.role === 'Administrateur').length,
    of: users.filter(u => u.organisationType === 'OF').length,
    direct: users.filter(u => u.organisationType === 'Direct').length,
    admin: users.filter(u => u.organisationType === 'Admin').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesOrg = orgFilter === 'all' || user.organisationType === orgFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesOrg;
  });

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

  const getOrganisationColor = (organisationType: string) => {
    switch (organisationType) {
      case 'OF': return 'bg-blue-50 text-blue-700';
      case 'Direct': return 'bg-pink-50 text-pink-700';
      case 'Admin': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
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
  };

  const handleAddUser = (newUser: any) => {
    console.log('Nouvel utilisateur ajouté:', newUser);
  };

  const handleUserClick = (user: any) => {
    navigate(getUserDetailUrl(user));
  };

  return (
    <div className="space-y-6">
      {/* Statistiques par type d'utilisateur */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
            <div className="text-2xl font-bold text-emerald-600">{userStats.apprenantsActifs}</div>
            <div className="text-sm text-gray-600">A. Actifs</div>
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
            <div className="text-2xl font-bold text-purple-600">{userStats.formateursIndep}</div>
            <div className="text-sm text-gray-600">F. Indép.</div>
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
            <div className="text-2xl font-bold text-red-600">{userStats.administrateurs}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par affiliation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.of}</div>
            <div className="text-sm text-gray-600">Organismes de Formation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{userStats.direct}</div>
            <div className="text-sm text-gray-600">Learneezy Direct</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{userStats.admin}</div>
            <div className="text-sm text-gray-600">Administration</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <div className="text-sm text-gray-600">Utilisateurs actifs</div>
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
                <SelectItem value="Formateur indépendant">Formateurs indépendants</SelectItem>
                <SelectItem value="Gestionnaire">Gestionnaires</SelectItem>
                <SelectItem value="Animateur">Animateurs</SelectItem>
                <SelectItem value="Administrateur">Administrateurs</SelectItem>
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
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par organisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les organisations</SelectItem>
                <SelectItem value="OF">Organismes de Formation</SelectItem>
                <SelectItem value="Direct">Learneezy Direct</SelectItem>
                <SelectItem value="Admin">Administration</SelectItem>
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
                  <TableHead>Organisation</TableHead>
                  <TableHead>Formation/Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOrganisationColor(user.organisationType)}>
                        {user.organisation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === 'Apprenant' ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            <div>{user.formation}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${user.progression}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{user.progression}%</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
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
