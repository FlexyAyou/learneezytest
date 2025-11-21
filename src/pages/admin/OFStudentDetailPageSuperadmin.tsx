import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentDetailView } from '@/components/admin/user-details/StudentDetailView';
import { useSuperadminUsers, useUsers, useOrganizations } from '@/hooks/useApi';
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
import { useUserStatusSync } from '@/hooks/useUserStatusSync';

interface OFStudentDetailPageProps {
  userRole?: 'superadmin' | 'manager';
}

const OFStudentDetailPageSuperadmin = ({ userRole = 'superadmin' }: OFStudentDetailPageProps) => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Récupérer la liste des utilisateurs selon le rôle
  const { data: superadminUsers, isLoading: superadminLoading } = useSuperadminUsers();
  const { data: managerUsers, isLoading: managerLoading } = useUsers();

  const allUsers = userRole === 'superadmin' ? superadminUsers : managerUsers;
  const usersLoading = userRole === 'superadmin' ? superadminLoading : managerLoading;

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
          <h2 className="text-2xl font-bold">Utilisateur non trouvé</h2>
          <p className="text-muted-foreground">Le slug "{userSlug}" ne correspond à aucun utilisateur OF</p>
          <Button onClick={() => navigate('/dashboard/superadmin/users')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const backPath = userRole === 'superadmin'
    ? '/dashboard/superadmin/users'
    : '/dashboard/gestionnaire/apprenants';
  const cacheKey = userRole === 'superadmin' ? 'superadmin-users' : 'users';

  const { userStatus, handleStatusChanged } = useUserStatusSync({
    initialStatus: foundUser?.status || 'active',
    onStatusChanged: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKey] });
    },
  });

  // Trouver l'organisation correspondante
  const organisation = foundUser?.of_id && organizations
    ? organizations.find(o => o.id === foundUser.of_id)
    : null;

  // Construire l'objet user avec les données récupérées
  const user = {
    id: foundUser?.id || 0,
    name: `${foundUser?.first_name || ''} ${foundUser?.last_name || ''}`.trim(),
    email: foundUser?.email || '',
    status: userStatus,
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
          onClick={() => navigate(backPath)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {userRole === 'superadmin' ? 'Retour aux utilisateurs' : 'Retour aux apprenants'}
        </Button>

        <UserStatusToggleButton
          userId={user.id}
          currentStatus={user.status}
          userName={user.name}
          onStatusChanged={handleStatusChanged}
        />
      </div>

      {/* En-tête de profil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Inscrit le {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'organisme */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Organisme de Formation:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {user.organisation}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu spécialisé pour l'apprenant OF */}
      <StudentDetailView user={user} userRole={userRole} />
    </div>
  );
};

export default OFStudentDetailPageSuperadmin;
