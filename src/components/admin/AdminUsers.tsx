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

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');
  const [isAddApprenantOpen, setIsAddApprenantOpen] = useState(false);

  // Mock data - tous les types d'utilisateurs de la plateforme
  const users = [
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@email.com', role: 'Apprenant', organisation: 'Formation Excellence', organisationType: 'OF', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Marc Dubois', email: 'marc.dubois@email.com', role: 'Formateur', organisation: 'Formation Excellence', organisationType: 'OF', status: 'active', lastLogin: '2024-01-20' },
    { id: 3, name: 'Claire Moreau', email: 'claire.moreau@email.com', role: 'Formateur indépendant', organisation: 'Learneezy Direct', organisationType: 'Direct', status: 'active', lastLogin: '2024-01-18' },
    { id: 4, name: 'Pierre Lefevre', email: 'pierre.lefevre@email.com', role: 'Gestionnaire', organisation: 'Formation Excellence', organisationType: 'OF', status: 'active', lastLogin: '2024-01-19' },
    { id: 5, name: 'Julie Rousseau', email: 'julie.rousseau@email.com', role: 'Animateur', organisation: 'Learneezy Direct', organisationType: 'Direct', status: 'active', lastLogin: '2024-01-21' },
    { id: 6, name: 'Thomas Bernard', email: 'thomas.bernard@learneezy.com', role: 'Administrateur', organisation: 'Learneezy Administration', organisationType: 'Admin', status: 'active', lastLogin: '2024-01-22' },
    { id: 7, name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Apprenant', organisation: 'TechForm Pro', organisationType: 'OF', status: 'inactive', lastLogin: '2024-01-10' },
    { id: 8, name: 'Antoine Roux', email: 'antoine.roux@email.com', role: 'Formateur indépendant', organisation: 'Learneezy Direct', organisationType: 'Direct', status: 'active', lastLogin: '2024-01-17' },
    { id: 9, name: 'Camille Blanc', email: 'camille.blanc@email.com', role: 'Gestionnaire', organisation: 'EduSoft Academy', organisationType: 'OF', status: 'active', lastLogin: '2024-01-16' },
    { id: 10, name: 'Lucas Petit', email: 'lucas.petit@email.com', role: 'Apprenant', organisation: 'Learneezy Direct', organisationType: 'Direct', status: 'active', lastLogin: '2024-01-14' }
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

  // Statistiques par type d'utilisateur
  const userStats = {
    total: users.length,
    apprenants: users.filter(u => u.role === 'Apprenant').length,
    formateurs: users.filter(u => u.role === 'Formateur').length,
    formateursIndep: users.filter(u => u.role === 'Formateur indépendant').length,
    gestionnaires: users.filter(u => u.role === 'Gestionnaire').length,
    animateurs: users.filter(u => u.role === 'Animateur').length,
    administrateurs: users.filter(u => u.role === 'Administrateur').length,
    of: users.filter(u => u.organisationType === 'OF').length,
    direct: users.filter(u => u.organisationType === 'Direct').length,
    admin: users.filter(u => u.organisationType === 'Admin').length
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesOrg = orgFilter === 'all' || user.organisationType === orgFilter;
    
    return matchesSearch && matchesRole && matchesOrg;
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
    // Ici vous pourriez ajouter l'apprenant à votre liste d'utilisateurs
    // ou faire un appel API pour l'enregistrer
  };

  return (
    <div className="space-y-6">
      {/* Statistiques par type d'utilisateur */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Button onClick={() => navigate('/dashboard/superadmin/users/add')}>
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
                    onClick={() => navigate(getUserDetailUrl(user))}
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
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(getUserDetailUrl(user));
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

      <AddApprenantModal
        isOpen={isAddApprenantOpen}
        onClose={() => setIsAddApprenantOpen(false)}
        onAdd={handleAddApprenant}
      />
    </div>
  );
};
