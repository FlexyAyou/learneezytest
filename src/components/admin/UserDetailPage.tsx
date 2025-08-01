
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  BookOpen, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  BarChart3,
  Shield,
  Key,
  MessageSquare,
  Video,
  Brain,
  TestTube,
  Home,
  UserCheck,
  PenTool,
  Mail,
  FileSignature,
  Building,
  CreditCard
} from 'lucide-react';

const UserDetailPage = () => {
  const { userSlug } = useParams();
  const navigate = useNavigate();
  const currentPath = `/dashboard/admin/users/${userSlug}`;

  // Mock data - normalement récupéré depuis l'API
  const user = {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    role: 'Étudiant',
    status: 'active',
    lastLogin: '2024-01-15',
    joinDate: '2023-09-15',
    totalCourses: 3,
    completedModules: 12,
    inProgressModules: 5,
    avgScore: 85
  };

  // Documents réels de l'utilisateur selon les spécifications
  const documents = [
    { id: 1, name: 'Attestation de fin de formation', type: 'pdf', status: 'validé', uploadDate: '2024-01-10' },
    { id: 2, name: 'Certificat de réalisation', type: 'pdf', status: 'en_attente', uploadDate: '2024-01-12' },
    { id: 3, name: 'Feuille d\'émargement', type: 'pdf', status: 'validé', uploadDate: '2024-01-08' },
    { id: 4, name: 'Convention de formation', type: 'pdf', status: 'validé', uploadDate: '2024-01-05' },
    { id: 5, name: 'Logs de connexion', type: 'log', status: 'en_attente', uploadDate: '2024-01-14' },
    { id: 6, name: 'Planning de formation', type: 'pdf', status: 'validé', uploadDate: '2024-01-09' },
    { id: 7, name: 'Bilan d\'évaluation', type: 'pdf', status: 'en_attente', uploadDate: '2024-01-13' },
  ];

  // Mock data pour les formations
  const formations = [
    { 
      id: 1, 
      name: 'React Avancé', 
      progress: 75, 
      status: 'en_cours',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      modules: 8,
      completedModules: 6
    },
    { 
      id: 2, 
      name: 'JavaScript ES6+', 
      progress: 100, 
      status: 'terminé',
      startDate: '2023-10-01',
      endDate: '2023-12-01',
      modules: 12,
      completedModules: 12
    },
    { 
      id: 3, 
      name: 'HTML/CSS', 
      progress: 30, 
      status: 'en_cours',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      modules: 6,
      completedModules: 2
    },
  ];

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/admin", icon: Home, isActive: false },
    { title: "Utilisateurs", href: "/dashboard/admin/users", icon: Users, isActive: currentPath.startsWith("/dashboard/admin/users") },
    { title: "Organismes de formations", href: "/dashboard/admin/organisations", icon: Building, isActive: false },
    { title: "Cours", href: "/dashboard/admin/courses", icon: BookOpen, isActive: false },
    // === SECTION OF COMPLÈTE ===
    { title: "Inscriptions", href: "/dashboard/admin/inscriptions", icon: UserCheck, isActive: false },
    { title: "Documents OF", href: "/dashboard/admin/of-documents", icon: FileText, isActive: false },
    { title: "Conventions", href: "/dashboard/admin/conventions", icon: FileSignature, isActive: false },
    { title: "Envois automatiques", href: "/dashboard/admin/mailings", icon: Mail, isActive: false },
    { title: "Émargements", href: "/dashboard/admin/emargements", icon: PenTool, isActive: false },
    // === SECTION ADMINISTRATION ===
    { title: "Gestion licences", href: "/dashboard/admin/licenses", icon: Key, isActive: false },
    { title: "Vérification identité", href: "/dashboard/admin/identity", icon: Shield, isActive: false },
    { title: "Tests positionnement", href: "/dashboard/admin/tests", icon: TestTube, isActive: false },
    { title: "Visioconférence", href: "/dashboard/admin/video", icon: Video, isActive: false },
    { title: "Bibliothèque", href: "/dashboard/admin/library", icon: Download, isActive: false },
    { title: "Abonnements", href: "/dashboard/admin/subscriptions", icon: CreditCard, isActive: false },
    { title: "Paiements", href: "/dashboard/admin/payments", icon: DollarSign, isActive: false },
    { title: "Sécurité", href: "/dashboard/admin/security", icon: Shield, isActive: false },
    { title: "Support", href: "/dashboard/admin/support", icon: MessageSquare, isActive: false },
    { title: "Paramètres", href: "/dashboard/admin/settings", icon: Settings, isActive: false },
  ];

  const userInfo = {
    name: "Admin Système",
    email: "admin@Learneezy.com"
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      validé: { variant: 'default' as const, label: 'Validé', icon: CheckCircle, color: 'text-green-600' },
      en_attente: { variant: 'secondary' as const, label: 'En attente', icon: Clock, color: 'text-yellow-600' },
      rejeté: { variant: 'destructive' as const, label: 'Rejeté', icon: XCircle, color: 'text-red-600' },
      en_cours: { variant: 'outline' as const, label: 'En cours', icon: Clock, color: 'text-blue-600' },
      terminé: { variant: 'default' as const, label: 'Terminé', icon: CheckCircle, color: 'text-green-600' },
    };
    
    const config = configs[status as keyof typeof configs] || configs.en_attente;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Administration"
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
                onClick={() => navigate('/dashboard/admin/users')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email} • {user.role}</p>
              </div>
            </div>

            {/* Métriques en haut */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {user.completedModules}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    Modules complétés
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {user.totalCourses}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    Formations inscrites
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {documents.filter(d => d.status === 'validé').length}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    Documents validés
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {user.avgScore}%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    Score moyen
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Documents */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents de l'utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">
                            Généré le {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Formations */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Parcours et formations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formations.map((formation) => (
                    <div key={formation.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{formation.name}</h4>
                          <p className="text-sm text-gray-600">
                            Du {new Date(formation.startDate).toLocaleDateString()} au {new Date(formation.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(formation.status)}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progression</span>
                            <span className="text-sm text-gray-600">{formation.progress}%</span>
                          </div>
                          <Progress value={formation.progress} className="w-full" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Modules complétés :</span> {formation.completedModules}/{formation.modules}
                          </div>
                          <div>
                            <span className="font-medium">Statut :</span> {formation.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Activité récente */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Module "React Hooks" complété</p>
                      <p className="text-xs text-gray-600">Il y a 2 heures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Connexion à la plateforme</p>
                      <p className="text-xs text-gray-600">Hier à 14:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Document "Attestation de fin de formation" généré</p>
                      <p className="text-xs text-gray-600">Le 10 janvier 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetailPage;
