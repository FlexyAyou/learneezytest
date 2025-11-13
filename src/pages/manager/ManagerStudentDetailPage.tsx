import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentDetailView } from '@/components/admin/user-details/StudentDetailView';
import { useUsers, useOrganizations } from '@/hooks/useApi';
import { UserStatusToggleButton } from '@/components/admin/UserStatusToggleButton';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { 
  ArrowLeft, 
  Mail,
  Phone,
  Calendar,
  Building
} from 'lucide-react';

const ManagerStudentDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Récupérer la liste des utilisateurs et des organisations
  const { data: allUsers, isLoading: usersLoading } = useUsers();
  const { data: organizations } = useOrganizations(1, 100);
  
  // Trouver l'utilisateur par slug
  const foundUser = allUsers?.find(u => {
    const userSlugFromId = `${u.id}-${u.first_name?.toLowerCase()}-${u.last_name?.toLowerCase()}`.replace(/\s+/g, '-');
    return userSlugFromId === userSlug;
  });

  if (usersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!foundUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Apprenant non trouvé</h2>
          <p className="text-muted-foreground">Le slug "{userSlug}" ne correspond à aucun apprenant</p>
          <Button onClick={() => navigate('/dashboard/gestionnaire/apprenants')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  // Trouver l'organisation correspondante
  const organisation = foundUser?.of_id && organizations 
    ? organizations.find(o => o.id === foundUser.of_id)
    : null;

  // Construire l'objet user avec les données récupérées
  const user = {
    id: foundUser?.id || 0,
    name: `${foundUser?.first_name || ''} ${foundUser?.last_name || ''}`.trim(),
    email: foundUser?.email || '',
    status: foundUser?.status || 'active',
    role: foundUser?.role || 'apprenant',
    organisation: organisation?.name || 'Learneezy Global',
    organisationType: foundUser?.of_id ? 'of' : 'global',
    joinDate: foundUser?.last_login ? new Date(foundUser.last_login).toLocaleDateString('fr-FR') : 'Non disponible',
    phone: foundUser?.phone || 'Non renseigné',
    address: foundUser?.address || 'Non renseignée',
    of_id: foundUser?.of_id,
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb et retour */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/gestionnaire/apprenants')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux apprenants
        </Button>
        
        <UserStatusToggleButton
          userId={user.id}
          currentStatus={user.status}
          userName={user.name}
          onStatusChanged={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
          }}
        />
      </div>

      {/* En-tête de profil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations générales */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <div className="mt-1">{getStatusBadge(user.status)}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organisation</p>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{user.organisation}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'inscription</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{user.joinDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium mt-1">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu spécialisé pour l'apprenant */}
      <StudentDetailView user={user} userRole="manager" />
    </div>
  );
};

export default ManagerStudentDetailPage;
