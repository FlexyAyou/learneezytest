import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { 
  ArrowLeft, 
  User, 
  Mail,
  Phone,
  Calendar,
  Building,
  Home,
  Users,
  BookOpen,
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
  MessageSquare
} from 'lucide-react';

// Import des composants spécialisés
import { StudentDetailView } from './user-details/StudentDetailView';
import { TrainerDetailView } from './user-details/TrainerDetailView';
import { IndependentTrainerDetailView } from './user-details/IndependentTrainerDetailView';
import { ManagerDetailView } from './user-details/ManagerDetailView';
import { AnimatorDetailView } from './user-details/AnimatorDetailView';
import { AdminDetailView } from './user-details/AdminDetailView';

const UserDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const currentPath = `/dashboard/superadmin/users/${userSlug}`;

  // Mock data étendu - normalement récupéré depuis l'API
  const user = {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    role: 'Apprenant', // Peut être: Apprenant, Formateur, Formateur indépendant, Gestionnaire, Animateur, Administrateur
    status: 'active',
    lastLogin: '2024-01-15',
    joinDate: '2023-09-15',
    organisation: 'Formation Excellence',
    organisationType: 'OF', // OF, Direct, Admin
    address: '123 Rue de la Formation, 75001 Paris',
    totalCourses: 3,
    completedModules: 12,
    inProgressModules: 5,
    avgScore: 85
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
      active: { variant: 'default' as const, label: 'Actif', color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, label: 'Inactif', color: 'text-yellow-600' },
      suspended: { variant: 'destructive' as const, label: 'Suspendu', color: 'text-red-600' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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

  // Fonction pour rendre le composant spécialisé selon le rôle
  const renderUserSpecificContent = () => {
    switch (user.role) {
      case 'Apprenant':
        return <StudentDetailView user={user} />;
      case 'Formateur':
        return <TrainerDetailView user={user} />;
      case 'Formateur indépendant':
        return <IndependentTrainerDetailView user={user} />;
      case 'Gestionnaire':
        return <ManagerDetailView user={user} />;
      case 'Animateur':
        return <AnimatorDetailView user={user} />;
      case 'Administrateur':
        return <AdminDetailView user={user} />;
      default:
        return <StudentDetailView user={user} />; // Fallback
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
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* En-tête avec bouton retour */}
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

            {/* Contenu spécialisé selon le rôle */}
            {renderUserSpecificContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetailPage;
