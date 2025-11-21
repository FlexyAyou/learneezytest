import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentCreatorDetailView } from '@/components/admin/user-details/ContentCreatorDetailView';
import { useSuperadminUsers, useOrganizations } from '@/hooks/useApi';
import { UserStatusToggleButton } from '@/components/admin/UserStatusToggleButton';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Page de détails d'un créateur de contenu pour le superadmin
 * Affiche les informations complètes et les statistiques de création de contenu
 */
const ContentCreatorDetailPageSuperadmin = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allUsers, isLoading: usersLoading } = useSuperadminUsers();
  const { data: organizations } = useOrganizations(1, 100);
  
  const foundUser = allUsers?.find(u => {
    const userSlugFromId = `${u.id}-${u.first_name?.toLowerCase()}-${u.last_name?.toLowerCase()}`.replace(/\s+/g, '-');
    return userSlugFromId === userSlug;
  });

  if (usersLoading) {
    return <LoadingSpinner />;
  }

  if (!foundUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Utilisateur non trouvé</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/dashboard/superadmin/users')}>
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
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
    role: foundUser?.role || 'createur_contenu',
    organisation: organisation?.name || 'Learneezy Global',
    organisationType: foundUser?.of_id ? 'of' : 'global',
    joinDate: foundUser?.last_login ? new Date(foundUser.last_login).toLocaleDateString('fr-FR') : 'Non disponible',
    phone: foundUser?.phone || 'Non renseigné',
    address: foundUser?.address || 'Non renseignée',
    of_id: foundUser?.of_id,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' },
      suspended: { variant: 'destructive' as const, label: 'Suspendu' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/superadmin/users')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux utilisateurs
        </Button>

        <UserStatusToggleButton
          userId={user.id}
          currentStatus={user.status}
          userName={user.name}
          onStatusChanged={() => {
            queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
          }}
        />
      </div>

      {/* Carte de profil */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
            {getStatusBadge(user.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rôle</p>
              <p className="text-base">Créateur de contenu</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-base">{user.status === 'active' ? 'Actif' : 'Inactif'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Organisation</p>
              <p className="text-base">{user.organisation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date d'inscription</p>
              <p className="text-base">{user.joinDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p className="text-base">{user.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p className="text-base">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue détaillée du créateur de contenu */}
      <ContentCreatorDetailView user={user} />
    </div>
  );
};

export default ContentCreatorDetailPageSuperadmin;
