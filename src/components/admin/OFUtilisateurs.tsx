import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Plus, Eye, Edit, MoreHorizontal, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { AddApprenantModal } from './AddApprenantModal';
import { OFAddUtilisateur } from './OFAddUtilisateur';
import { useOFUsers, useCreateOFUser } from '@/hooks/useApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

// Type pour les utilisateurs de l'OF (à adapter selon la réponse API finale)
interface OFUser {
  id: string | number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  joinDate?: string;
  lastLogin?: string;
  created_at?: string;
  last_login?: string;
}

export const OFUtilisateurs = () => {
  const { user } = useFastAPIAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddApprenantOpen, setIsAddApprenantOpen] = useState(false);

  // Récupérer l'ID de l'OF depuis le user connecté
  const ofId = user?.of_id?.toString() || undefined;
  
  // Nom de l'organisation : depuis le contexte subdomain
  const organizationName = organization?.organizationName || undefined;

  // Hook pour récupérer les utilisateurs de l'OF depuis l'API
  const { data: apiUsers, isLoading, isError, error } = useOFUsers(ofId);
  const createOFUser = useCreateOFUser(ofId);
  const { toast } = useToast();

  // Données locales temporaires (utilisées quand l'API n'est pas disponible)
  const [localUsers, setLocalUsers] = useState<OFUser[]>([]);

  // Combiner les utilisateurs API avec les utilisateurs ajoutés localement
  const users = useMemo(() => {
    if (apiUsers && Array.isArray(apiUsers)) {
      // Mapper les données API vers le format attendu
      return [...apiUsers.map((u: any) => ({
        id: u.id,
        nom: u.last_name || u.nom || '',
        prenom: u.first_name || u.prenom || '',
        email: u.email,
        role: mapRoleToFrench(u.role),
        status: u.status || 'active',
        phone: u.phone || '',
        joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '',
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR') : 'N/A',
      })), ...localUsers];
    }
    return localUsers;
  }, [apiUsers, localUsers]);

  // Mapper les rôles anglais vers français
  const mapRoleToFrench = (role: string): string => {
    const roleMap: Record<string, string> = {
      'learner': 'Apprenant',
      'trainer': 'Formateur',
      'manager': 'Gestionnaire',
      'of_admin': 'Administrateur',
      'admin': 'Administrateur',
    };
    return roleMap[role?.toLowerCase()] || role || 'Apprenant';
  };

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

  const handleViewUser = (user: OFUser) => {
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

  const handleAddUser = async (newUser: any) => {
    // Mapper les données du formulaire vers le format API
    const apiPayload = {
      email: newUser.email,
      first_name: newUser.prenom || newUser.first_name || '',
      last_name: newUser.nom || newUser.last_name || '',
      role: mapRoleToBackend(newUser.role) || 'apprenant',
      phone: newUser.phone || newUser.telephone || null,
    };

    try {
      await createOFUser.mutateAsync(apiPayload);
      toast({
        title: "Utilisateur créé",
        description: `${apiPayload.first_name} ${apiPayload.last_name} a été créé. Un email avec ses identifiants lui sera envoyé.`,
      });
    } catch (err: any) {
      console.error('Erreur création utilisateur OF:', err);
      // Fallback local si l'API n'est pas disponible
      setLocalUsers(prev => [...prev, {
        id: newUser.id || Date.now().toString(),
        nom: apiPayload.last_name,
        prenom: apiPayload.first_name,
        email: apiPayload.email,
        role: mapRoleToFrench(apiPayload.role),
        status: 'pending',
        phone: apiPayload.phone || '',
        joinDate: new Date().toLocaleDateString('fr-FR'),
        lastLogin: 'N/A',
      }]);
      toast({
        title: "Ajouté localement",
        description: `L'API n'est pas disponible. ${apiPayload.first_name} a été ajouté localement.`,
        variant: "destructive",
      });
    }
  };

  const handleAddApprenant = async (apprenantData: any) => {
    try {
      await createOFUser.mutateAsync({
        email: apprenantData.email,
        first_name: apprenantData.prenom,
        last_name: apprenantData.nom,
        role: 'apprenant',
        phone: apprenantData.telephone || undefined,
      });
      toast({
        title: "Apprenant créé",
        description: "L'apprenant a été créé avec succès. Un email avec ses identifiants lui a été envoyé.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.response?.data?.detail || "Impossible de créer l'apprenant",
        variant: "destructive",
      });
      throw err;
    }
  };

  const mapRoleToBackend = (role: string): string => {
    const roleMap: Record<string, string> = {
      'Apprenant': 'apprenant',
      'Formateur': 'formateur_interne',
      'Gestionnaire': 'gestionnaire',
      'Administrateur': 'of_admin',
      'apprenant': 'apprenant',
      'animateur': 'formateur_interne',
      'administrateur': 'of_admin',
      'referent': 'gestionnaire',
    };
    return roleMap[role] || role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Statistiques basées sur les utilisateurs disponibles
  const stats = useMemo(() => ({
    total: users.length,
    formateurs: users.filter(u => u.role === 'Formateur').length,
    apprenants: users.filter(u => u.role === 'Apprenant').length,
    pending: users.filter(u => u.status === 'pending').length,
  }), [users]);

  // Affichage du message d'attente backend
  const renderBackendNotice = () => {
    if (isError) {
      const errorMessage = (error as any)?.response?.status === 404 
        ? "L'endpoint GET /api/organizations/{of_id}/users n'est pas encore implémenté côté backend."
        : (error as Error)?.message || "Erreur lors du chargement des utilisateurs";

      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API non disponible</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <br />
            <span className="text-sm mt-2 block">
              En attendant l'implémentation backend, vous pouvez ajouter des utilisateurs localement pour tester l'interface.
            </span>
          </AlertDescription>
        </Alert>
      );
    }

    if (!ofId) {
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration requise</AlertTitle>
          <AlertDescription>
            L'ID de l'organisation n'est pas défini. Assurez-vous d'être connecté avec un compte OF.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez les utilisateurs de votre organisme de formation</p>
        </div>
        <div className="flex space-x-2">
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

      {/* Notice si API non disponible */}
      {renderBackendNotice()}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Chargement...' : 'Dans votre organisation'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formateurs}</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apprenants}</div>
            <p className="text-xs text-muted-foreground">Inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Chargement des utilisateurs...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
              <p className="text-sm mt-1">
                {users.length === 0 
                  ? "Commencez par ajouter des utilisateurs à votre organisation."
                  : "Aucun résultat ne correspond à vos critères de recherche."}
              </p>
            </div>
          ) : (
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
                            {user.prenom?.[0] || ''}{user.nom?.[0] || ''}
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
                      {user.lastLogin || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.joinDate || 'N/A'}
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
          )}
        </CardContent>
      </Card>

      <AddApprenantModal
        isOpen={isAddApprenantOpen}
        onClose={() => setIsAddApprenantOpen(false)}
        onAdd={handleAddApprenant}
        organizationName={organizationName}
      />

      <OFAddUtilisateur
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};