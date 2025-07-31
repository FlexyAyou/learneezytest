
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Edit, Eye, Trash2, Users, Mail, Shield, FileText, Building } from 'lucide-react';
import { UserDocumentProgress } from './UserDocumentProgress';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrganisation, setFilterOrganisation] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDocumentProgress, setShowDocumentProgress] = useState(false);

  // Mock data for users incluant ceux des organismes
  const users = [
    { 
      id: 1, 
      name: 'Marie Dupont', 
      email: 'marie.dupont@email.com', 
      role: 'Étudiant', 
      status: 'active', 
      lastLogin: '2024-01-15',
      organisation: 'Centre de Formation Digital',
      documentProgress: 85
    },
    { 
      id: 2, 
      name: 'Jean Martin', 
      email: 'jean.martin@email.com', 
      role: 'Formateur', 
      status: 'active', 
      lastLogin: '2024-01-14',
      organisation: null,
      documentProgress: null
    },
    { 
      id: 3, 
      name: 'Sophie Bernard', 
      email: 'sophie.bernard@email.com', 
      role: 'Gestionnaire', 
      status: 'inactive', 
      lastLogin: '2024-01-10',
      organisation: 'Institut TechnoPlus',
      documentProgress: 60
    },
    { 
      id: 4, 
      name: 'Pierre Durand', 
      email: 'pierre.durand@email.com', 
      role: 'Étudiant', 
      status: 'pending', 
      lastLogin: 'Jamais',
      organisation: 'Formation Pro Marseille',
      documentProgress: 25
    },
    { 
      id: 5, 
      name: 'Claire Moreau', 
      email: 'claire.moreau@cfdigital.fr', 
      role: 'Étudiant', 
      status: 'active', 
      lastLogin: '2024-01-20',
      organisation: 'Centre de Formation Digital',
      documentProgress: 100
    },
  ];

  const organisations = ['Centre de Formation Digital', 'Institut TechnoPlus', 'Formation Pro Marseille'];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' },
      pending: { variant: 'outline' as const, label: 'En attente' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProgressBadge = (progress: number | null) => {
    if (progress === null) return null;
    
    if (progress === 100) {
      return <Badge className="bg-green-100 text-green-800">Complet</Badge>;
    } else if (progress >= 75) {
      return <Badge className="bg-blue-100 text-blue-800">{progress}%</Badge>;
    } else if (progress >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800">{progress}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">{progress}%</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesOrganisation = filterOrganisation === 'all' || 
                               (filterOrganisation === 'internal' && !user.organisation) ||
                               user.organisation === filterOrganisation;
    
    return matchesSearch && matchesRole && matchesStatus && matchesOrganisation;
  });

  const handleViewDocuments = (user: any) => {
    setSelectedUser(user);
    setShowDocumentProgress(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérer tous les utilisateurs de la plateforme, y compris ceux des organismes partenaires</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/admin/users/group-enrollment')}
            className="flex items-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Inscription groupée
          </Button>
          <Button onClick={() => navigate('/dashboard/admin/users/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Tous organismes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs internes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => !u.organisation).length}</div>
            <p className="text-xs text-muted-foreground">Learneezy direct</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Organismes partenaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.organisation).length}</div>
            <p className="text-xs text-muted-foreground">Centres de formation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dossiers complets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.documentProgress === 100).length}
            </div>
            <p className="text-xs text-muted-foreground">100% des documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.documentProgress && u.documentProgress < 100).length}
            </div>
            <p className="text-xs text-muted-foreground">Dossiers incomplets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Étudiant">Étudiant</SelectItem>
                <SelectItem value="Formateur">Formateur</SelectItem>
                <SelectItem value="Gestionnaire">Gestionnaire</SelectItem>
                <SelectItem value="Administrateur">Administrateur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterOrganisation} onValueChange={setFilterOrganisation}>
              <SelectTrigger className="w-48">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Organisme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les organismes</SelectItem>
                <SelectItem value="internal">Utilisateurs internes</SelectItem>
                {organisations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Organisme</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dossier</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.organisation ? (
                      <Badge variant="outline" className="text-xs">
                        {user.organisation}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Interne</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.documentProgress !== null ? (
                      <div className="flex items-center space-x-2">
                        {getProgressBadge(user.documentProgress)}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocuments(user)}
                        title="Voir le dossier de formation"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Voir les détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Envoyer un email">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Gérer les permissions">
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal pour le suivi des documents */}
      <UserDocumentProgress
        user={selectedUser}
        isOpen={showDocumentProgress}
        onClose={() => {
          setShowDocumentProgress(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default AdminUsers;
