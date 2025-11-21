
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { AdminDetailView } from '@/components/admin/user-details/AdminDetailView';
import { UserStatusToggleButton } from '@/components/admin/UserStatusToggleButton';
import { useUserBySlug, useOrganizations } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building,
  BookOpen,
  Users,
  UserCheck,
  FileText,
  FileSignature,
  PenTool,
  Key,
  Shield,
  TestTube,
  Video,
  Download,
  CreditCard,
  DollarSign,
  Settings,
  MessageSquare,
  Home
} from 'lucide-react';
import { useUserStatusSync } from '@/hooks/useUserStatusSync';

const AdminDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentPath = `/dashboard/superadmin/users/${userSlug}`;

  // Récupérer l'utilisateur par son slug
  const { data: foundUser, isLoading: usersLoading, error } = useUserBySlug(userSlug);
  const { data: organizations } = useOrganizations(1, 100);

  const { userStatus, handleStatusChanged } = useUserStatusSync({
    initialStatus: foundUser?.status || 'inactive',
    onStatusChanged: () => {
      queryClient.invalidateQueries({ queryKey: ['userBySlug', userSlug] });
    },
  });

  if (usersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (!foundUser || error) {
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

  // Récupérer le nom réel de l'organisation
  let organisationName = 'Learneezy Administration';
  if (foundUser.of_id && organizations) {
    const org = organizations.find((o: any) => o.id === foundUser.of_id);
    if (org) {
      organisationName = org.name;
    }
  }

  // Construire l'objet user avec les données backend
  const user = {
    id: foundUser.id,
    name: `${foundUser.first_name} ${foundUser.last_name}`,
    email: foundUser.email,
    phone: foundUser.phone || 'Non renseigné',
    role: 'Administrateur',
    status: userStatus,
    lastLogin: foundUser.last_login || '2024-01-22',
    joinDate: foundUser.created_at,
    organisation: organisationName,
    organisationType: foundUser.of_id ? 'OF' : 'Admin',
    address: foundUser.address || 'Non renseignée'
  };

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/superadmin", icon: Home, isActive: false },
    { title: "Utilisateurs", href: "/dashboard/superadmin/users", icon: Users, isActive: currentPath.startsWith("/dashboard/superadmin/users") },
    { title: "Organismes de formations", href: "/dashboard/superadmin/organisations", icon: Building, isActive: false },
    { title: "Cours", href: "/dashboard/superadmin/courses", icon: BookOpen, isActive: false },
    { title: "Inscriptions", href: "/dashboard/superadmin/inscriptions", icon: UserCheck, isActive: false },
    { title: "Documents OF", href: "/dashboard/superadmin/of-documents", icon: FileText, isActive: false },
    { title: "Conventions", href: "/dashboard/superadmin/conventions", icon: FileSignature, isActive: false },
    { title: "Envois automatiques", href: "/dashboard/superadmin/mailings", icon: Mail, isActive: false },
    { title: "Émargements", href: "/dashboard/superadmin/emargements", icon: PenTool, isActive: false },
    { title: "Gestion licences", href: "/dashboard/superadmin/licenses", icon: Key, isActive: false },
    { title: "Vérification identité", href: "/dashboard/superadmin/identity", icon: Shield, isActive: false },
    { title: "Tests positionnement", href: "/dashboard/superadmin/tests", icon: TestTube, isActive: false },
    { title: "Visioconférence", href: "/dashboard/superadmin/video", icon: Video, isActive: false },
    { title: "Bibliothèque", href: "/dashboard/superadmin/library", icon: Download, isActive: false },
    { title: "Abonnements", href: "/dashboard/superadmin/subscriptions", icon: CreditCard, isActive: false },
    { title: "Paiements", href: "/dashboard/superadmin/payments", icon: DollarSign, isActive: false },
    { title: "Sécurité", href: "/dashboard/superadmin/security", icon: Shield, isActive: false },
    { title: "Support", href: "/dashboard/superadmin/support", icon: MessageSquare, isActive: false },
    { title: "Paramètres", href: "/dashboard/superadmin/settings", icon: Settings, isActive: false },
  ];

  const userInfo = {
    name: "Super Admin",
    email: "superadmin@Learneezy.com"
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
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Super Administration"
          subtitle="Gestion de la plateforme"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>

      <div className="flex-1">
        <div className="h-full flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* En-tête avec bouton retour */}
              <div className="flex items-center justify-between gap-4">
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

                <UserStatusToggleButton
                  userId={user.id}
                  currentStatus={user.status}
                  userName={user.name}
                  onStatusChanged={handleStatusChanged}
                />
              </div>

              {/* Informations générales de l'utilisateur */}
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

              {/* Contenu spécialisé pour l'administrateur */}
              <AdminDetailView user={user} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailPage;
