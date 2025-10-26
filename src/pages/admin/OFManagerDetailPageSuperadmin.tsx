import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ManagerDetailView } from '@/components/admin/user-details/ManagerDetailView';
import { useSuperadminUsers } from '@/hooks/useApi';
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

const OFManagerDetailPageSuperadmin = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allUsers, isLoading: usersLoading } = useSuperadminUsers();
  
  const foundUser = allUsers?.find(u => {
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
    const userSlugGenerated = fullName.toLowerCase().replace(/\s+/g, '-');
    return userSlugGenerated === userSlug;
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
          <p className="text-muted-foreground">Le slug "{userSlug}" ne correspond à aucun gestionnaire OF</p>
          <Button onClick={() => navigate('/dashboard/superadmin/users')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const user = {
    id: foundUser.id,
    name: `${foundUser.first_name} ${foundUser.last_name}`,
    email: foundUser.email,
    phone: '+33 6 12 34 56 78',
    role: 'Gestionnaire OF',
    status: foundUser.is_active ? 'active' : 'inactive',
    lastLogin: foundUser.last_login || new Date().toISOString(),
    joinDate: foundUser.created_at,
    organisation: foundUser.of_id ? `Organisation #${foundUser.of_id}` : 'N/A',
    organisationType: 'OF',
    address: 'Non renseignée'
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

      <ManagerDetailView user={user} />
    </div>
  );
};

export default OFManagerDetailPageSuperadmin;
