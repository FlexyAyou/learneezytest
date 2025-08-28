
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { 
  ArrowLeft, 
  Mail,
  Phone,
  Calendar,
  Building,
  Home,
  Users,
  BookOpen,
  CreditCard,
  GraduationCap,
  Send,
  Plug,
  FileText,
  Settings,
  File,
  Video
} from 'lucide-react';

// Import des composants spécialisés existants
import { StudentDetailView } from './user-details/StudentDetailView';
import { TrainerDetailView } from './user-details/TrainerDetailView';
import { ManagerDetailView } from './user-details/ManagerDetailView';

const OFUserDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const currentPath = `/dashboard/organisme-formation/utilisateurs/${userSlug}`;

  // Mock data étendu - normalement récupéré depuis l'API
  const user = {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    role: 'Apprenant', // Peut être: Apprenant, Formateur, Gestionnaire
    status: 'active',
    lastLogin: '2024-01-15',
    joinDate: '2023-09-15',
    organisation: 'Centre de Formation Digital',
    organisationType: 'OF',
    address: '123 Rue de la Formation, 75001 Paris',
    totalCourses: 3,
    completedModules: 12,
    inProgressModules: 5,
    avgScore: 85
  };

  const sidebarItems = [
    {
      title: 'Tableau de bord',
      href: '/dashboard/organisme-formation',
      icon: Home,
      isActive: false
    },
    {
      title: 'Utilisateurs',
      href: '/dashboard/organisme-formation/utilisateurs',
      icon: Users,
      isActive: currentPath.startsWith("/dashboard/organisme-formation/utilisateurs")
    },
    {
      title: 'Formations',
      href: '/dashboard/organisme-formation/formations',
      icon: BookOpen,
      isActive: false
    },
    {
      title: 'Documents OF',
      href: '/dashboard/organisme-formation/documents-of',
      icon: FileText,
      isActive: false
    },
    {
      title: 'Document',
      href: '/dashboard/organisme-formation/documents',
      icon: File,
      isActive: false
    },
    {
      title: 'Licences',
      href: '/dashboard/organisme-formation/licences',
      icon: CreditCard,
      isActive: false
    },
    {
      title: 'Suivi pédagogique',
      href: '/dashboard/organisme-formation/suivi-pedagogique',
      icon: GraduationCap,
      isActive: false
    },
    {
      title: 'Visio',
      href: '/dashboard/organisme-formation/visio',
      icon: Video,
      isActive: false
    },
    {
      title: 'Envois',
      href: '/dashboard/organisme-formation/envois',
      icon: Send,
      isActive: false
    },
    {
      title: 'Intégrations',
      href: '/dashboard/organisme-formation/integrations',
      icon: Plug,
      isActive: false
    },
    {
      title: 'Logs',
      href: '/dashboard/organisme-formation/logs',
      icon: FileText,
      isActive: false
    },
    {
      title: 'Paramètres',
      href: '/dashboard/organisme-formation/parametres',
      icon: Settings,
      isActive: false
    }
  ];

  const userInfo = {
    name: "Marie Gestionnaire",
    email: "marie@cfdigital.fr"
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
    switch (role) {
      case 'Formateur': return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Apprenant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour rendre le composant spécialisé selon le rôle
  const renderUserSpecificContent = () => {
    switch (user.role) {
      case 'Apprenant':
        return <StudentDetailView user={user} />;
      case 'Formateur':
        return <TrainerDetailView user={user} />;
      case 'Gestionnaire':
        return <ManagerDetailView user={user} />;
      default:
        return <StudentDetailView user={user} />; // Fallback
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Organisme de Formation"
          subtitle="Centre de Formation Digital"
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
                onClick={() => navigate('/dashboard/organisme-formation/utilisateurs')}
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
                      <Badge className="bg-blue-50 text-blue-700">
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

export default OFUserDetailPage;
