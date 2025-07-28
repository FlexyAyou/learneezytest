import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp,
  MessageSquare,
  Settings,
  FileText,
  Video,
  Download,
  Brain,
  TestTube,
  Home,
  Clock,
  Target,
  Star,
  BarChart3,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Edit,
  Eye,
  Plus,
  Filter,
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  Phone,
  PhoneOff,
  VideoOff,
  Share,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import des composants spécialisés
import InternalTrainerContent from '@/components/internal-trainer/InternalTrainerContent';
import InternalTrainerSessions from '@/components/internal-trainer/InternalTrainerSessions';
import InternalTrainerStudents from '@/components/internal-trainer/InternalTrainerStudents';
import InternalTrainerMessaging from '@/components/internal-trainer/InternalTrainerMessaging';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import AIChat from '@/components/common/AIChat';
import VideoConference from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';

const InternalTrainerDashboardHome = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: "Sessions ce mois",
      value: "12",
      icon: Calendar,
      change: "+2 vs mois dernier"
    },
    {
      title: "Heures de formation",
      value: "24h",
      icon: Clock,
      change: "Cette semaine"
    },
    {
      title: "Satisfaction moyenne",
      value: "92%",
      icon: Star,
      change: "Basé sur 24 retours"
    },
    {
      title: "Apprenants actifs",
      value: "45",
      icon: Users,
      change: "+5 ce mois"
    }
  ];

  const courseProgress = [
    { id: 1, course: 'React Avancé', progress: 75 },
    { id: 2, course: 'Node.js Déploiement', progress: 50 },
    { id: 3, course: 'UI/UX Design', progress: 90 },
  ];

  const upcomingSessions = [
    { id: 1, course: 'React Avancé', date: '2024-01-15', time: '14:00', status: 'confirmed' },
    { id: 2, course: 'Node.js Déploiement', date: '2024-01-16', time: '10:00', status: 'pending' },
    { id: 3, course: 'UI/UX Design', date: '2024-01-17', time: '15:00', status: 'confirmed' },
  ];

  const notifications = [
    { id: 1, message: 'Nouveau feedback sur React Avancé', type: 'feedback', read: false },
    { id: 2, message: 'Session Node.js à confirmer', type: 'session', read: true },
    { id: 3, message: 'Mise à jour du guide UI/UX', type: 'content', read: false },
  ];

  const handleSessionAction = (sessionId: number, action: string) => {
    toast({
      title: `Session ${action}`,
      description: `Session ${sessionId} ${action} avec succès`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formateur Interne</h1>
        <p className="text-gray-600">Suivez vos sessions et vos apprenants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Progrès des Cours
            </CardTitle>
            <CardDescription>Suivi de l'avancement des cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{course.course}</p>
                  <p className="text-sm text-gray-500">{course.progress}%</p>
                </div>
                <Progress value={course.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sessions à Venir
            </CardTitle>
            <CardDescription>Planning des prochaines sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{session.course}</p>
                  <p className="text-xs text-gray-600">{session.date} - {session.time}</p>
                </div>
                <div>
                  {session.status === 'confirmed' ? (
                    <Badge variant="default">Confirmée</Badge>
                  ) : (
                    <Badge variant="outline">En attente</Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSessionAction(session.id, 'confirmée')}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSessionAction(session.id, 'annulée')}
                  >
                    <AlertCircle className="mr-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notifications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Alertes et mises à jour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {notification.type === 'feedback' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                  {notification.type === 'session' && <Calendar className="h-4 w-4 text-green-600" />}
                  {notification.type === 'content' && <BookOpen className="h-4 w-4 text-purple-600" />}
                  <div>
                    <p className="font-medium text-sm">{notification.message}</p>
                    {!notification.read && <Badge variant="secondary">Nouveau</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Actions Rapides
            </CardTitle>
            <CardDescription>Accès rapide aux outils</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Modifier Cours
            </Button>
            <Button variant="outline" className="justify-start">
              <Eye className="mr-2 h-4 w-4" />
              Voir Profil
            </Button>
            <Button variant="outline" className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Session
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Gérer Apprenants
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InternalTrainerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/formateur-interne', icon: Home, isActive: true },
    { title: 'Contenus pédagogiques', href: '/formateur-interne/contenus', icon: BookOpen },
    { title: 'Sessions de formation', href: '/formateur-interne/sessions', icon: Calendar },
    { title: 'Suivi des apprenants', href: '/formateur-interne/apprenants', icon: Users },
    { title: 'Messagerie interne', href: '/formateur-interne/messagerie', icon: MessageSquare },
    { title: 'Tests de positionnement', href: '/formateur-interne/tests', icon: TestTube },
    { title: 'Visioconférence', href: '/formateur-interne/video', icon: Video },
    { title: 'Chat IA', href: '/formateur-interne/chat', icon: Brain },
    { title: 'Mes documents', href: '/formateur-interne/documents', icon: Download },
    { title: 'Paramètres', href: '/formateur-interne/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Sophie Moreau",
    email: "sophie.moreau@learneezy.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Plan de formation.pdf', type: 'PDF', date: '2024-01-20', size: '2.3 MB' },
    { id: '2', name: 'Guide formateur.pdf', type: 'PDF', date: '2024-01-18', size: '1.8 MB' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Formateur Interne"
        subtitle="Formation continue"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<InternalTrainerDashboardHome />} />
          <Route path="/contenus" element={<InternalTrainerContent />} />
          <Route path="/sessions" element={<InternalTrainerSessions />} />
          <Route path="/apprenants" element={<InternalTrainerStudents />} />
          <Route path="/messagerie" element={<InternalTrainerMessaging />} />
          <Route path="/tests" element={<PositioningTest userRole="instructor" />} />
          <Route path="/video" element={<VideoConference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="instructor" />} />
        </Routes>
      </main>
    </div>
  );
};

export default InternalTrainerDashboard;
