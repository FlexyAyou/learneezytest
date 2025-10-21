import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperAdminDetailView } from '@/components/admin/user-details/SuperAdminDetailView';
import { useSuperadminUsers } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fastAPIClient } from '@/services/fastapi-client';
import { 
  ArrowLeft, 
  Mail,
  Phone,
  Calendar,
  Building
} from 'lucide-react';

const SuperAdminDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const currentPath = `/dashboard/superadmin/users/${userSlug}`;

  const { data: allUsers, isLoading: usersLoading } = useSuperadminUsers();
  
  // Récupérer les statistiques dynamiques
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: ['all-courses-stats'],
    queryFn: () => fastAPIClient.getCourses(1, 100),
    retry: false,
  });

  const { data: organizations, isLoading: orgsLoading, isError: orgsError } = useQuery({
    queryKey: ['all-organizations-stats'],
    queryFn: () => fastAPIClient.listOrganizations(1, 100),
    retry: false,
  });
  
  const foundUser = allUsers?.find(u => {
    const userSlugGenerated = `${u.first_name?.toLowerCase().trim()}-${u.last_name?.toLowerCase().trim()}`;
    return userSlugGenerated === userSlug;
  });

  const isLoading = usersLoading || coursesLoading || orgsLoading;

  if (isLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Utilisateur non trouvé</h2>
          <p className="text-gray-600">Le slug "{userSlug}" ne correspond à aucun utilisateur</p>
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
    role: 'Super Administrateur',
    status: foundUser.is_active ? 'active' : 'inactive',
    lastLogin: foundUser.last_login || '2024-01-15',
    joinDate: foundUser.created_at,
    organisation: 'Learneezy',
    organisationType: 'Admin',
    address: '123 Rue de l\'Administration, 75001 Paris'
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

  const getRoleColor = (role: string) => {
    return 'bg-red-100 text-red-800';
  };

  const getOrganisationColor = (organisationType: string) => {
    switch (organisationType) {
      case 'OF': return 'bg-blue-50 text-blue-700';
      case 'Direct': return 'bg-pink-50 text-pink-700';
      case 'Admin': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard/superadmin/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Rôle</label>
              <div className="mt-1">
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Statut</label>
              <div className="mt-1">
                {getStatusBadge(user.status)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Organisation</label>
              <div className="mt-1">
                <Badge className={getOrganisationColor(user.organisationType)}>
                  {user.organisation}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membre depuis
              </label>
              <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </label>
              <p className="font-medium">{user.phone}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Adresse
              </label>
              <p className="font-medium">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SuperAdminDetailView 
        user={user}
        totalUsers={allUsers?.length || 0}
        totalOrganisations={organizations?.length || 0}
        activeCourses={courses?.length || 0}
      />
    </div>
  );
};

export default SuperAdminDetailPage;
