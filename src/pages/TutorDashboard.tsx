
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import TutorStudentTracking from '@/components/tutor/TutorStudentTracking';
import TutorMessaging from '@/components/tutor/TutorMessaging';
import TutorPlanningNotifications from '@/components/tutor/TutorPlanningNotifications';
import { TutorAddStudent } from '@/components/tutor/TutorAddStudent';
import { TutorSettings } from '@/components/tutor/TutorSettings';
import { TutorSubscription } from '@/components/tutor/TutorSubscription';
import { TutorShop } from '@/components/tutor/TutorShop';
import AIChatButton from '@/components/common/AIChatButton';
import { TutorDocuments } from '@/components/tutor/TutorDocuments';
import { TutorStudentDetailedView } from '@/components/tutor/TutorStudentDetailedView';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Bell,
  Eye,
  UserPlus,
  Settings,
  Library,
  CreditCard,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TutorDashboardHome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [showDetailedView, setShowDetailedView] = React.useState(false);

  const students = [
    { 
      id: '1', 
      name: 'Emma Martin', 
      age: 16, 
      courses: 3, 
      avgScore: 85, 
      status: 'active',
      email: 'emma.martin@email.com',
      phone: '06 12 34 56 78',
      course: 'Mathématiques',
      progress: 85,
      lastActivity: '2024-01-20',
      parentContact: 'parent.martin@email.com',
      notes: 'Très motivée, excellente participation'
    },
    { 
      id: '2', 
      name: 'Lucas Dubois', 
      age: 14, 
      courses: 2, 
      avgScore: 92, 
      status: 'active',
      email: 'lucas.dubois@email.com',
      phone: '06 87 65 43 21',
      course: 'Sciences',
      progress: 92,
      lastActivity: '2024-01-19',
      parentContact: 'parent.dubois@email.com',
      notes: 'Très bon niveau, autonome'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      student: 'Emma Martin',
      activity: 'Quiz Mathématiques terminé',
      score: 85,
      date: '2024-01-14',
      type: 'quiz'
    },
    {
      id: 2,
      student: 'Lucas Dubois',
      activity: 'Devoir Sciences rendu',
      score: 95,
      date: '2024-01-13',
      type: 'homework'
    },
    {
      id: 3,
      student: 'Emma Martin',
      activity: 'Session Anglais terminée',
      score: null,
      date: '2024-01-12',
      type: 'session'
    }
  ];

  const upcomingEvents = [
    { id: 1, student: 'Emma Martin', event: 'Cours Mathématiques', date: '2024-01-20', time: '14:00' },
    { id: 2, student: 'Lucas Dubois', event: 'Contrôle Sciences', date: '2024-01-22', time: '10:30' },
    { id: 3, student: 'Emma Martin', event: 'Session Anglais', date: '2024-01-25', time: '16:00' },
  ];

  const notifications = [
    { id: 1, message: 'Changement d\'horaire pour Emma Martin', priority: 'medium', unread: true },
    { id: 2, message: 'Devoir non remis - Lucas Dubois', priority: 'high', unread: true },
    { id: 3, message: 'Nouvelle évaluation disponible', priority: 'low', unread: false },
  ];

  const handleViewDetails = (studentName: string) => {
    const student = students.find(s => s.name === studentName);
    if (student) {
      setSelectedStudent(student);
      setShowDetailedView(true);
    }
  };

  const handleViewCatalog = () => {
    navigate('/nos-formations');
  };

  return (
    <div className="space-y-8">
      {/* Header with Catalog Button */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Tuteur</h1>
          <p className="text-gray-600">Suivez la progression de vos élèves</p>
        </div>
        <Button onClick={handleViewCatalog} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          <Library className="h-4 w-4 mr-2" />
          Catalogue de formation
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/tuteur/ajouter-eleve')}>
          <CardContent className="p-6 text-center">
            <UserPlus className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold">Ajouter un élève</h3>
            <p className="text-sm text-gray-600">Créer un nouveau compte</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/tuteur/suivi')}>
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold">Suivi des élèves</h3>
            <p className="text-sm text-gray-600">Voir les progressions</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/tuteur/abonnements')}>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold">Abonnements</h3>
            <p className="text-sm text-gray-600">Gérer vos crédits</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/tuteur/documents')}>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold">Mes documents</h3>
            <p className="text-sm text-gray-600">Cours et exercices</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Suivis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, student) => acc + student.avgScore, 0) / students.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Sur tous les élèves</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Non Lus</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nouveaux messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Mes Élèves
            </CardTitle>
            <CardDescription>Vue d'ensemble des performances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.age} ans</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{student.avgScore}%</p>
                    <p className="text-xs text-gray-600">Moyenne</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{student.courses} cours actifs</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(student.name)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Activité Récente
            </CardTitle>
            <CardDescription>Dernières activités des élèves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'quiz' && <Award className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'homework' && <BookOpen className="h-4 w-4 text-green-600" />}
                  {activity.type === 'session' && <Calendar className="h-4 w-4 text-purple-600" />}
                  <div>
                    <p className="font-medium text-sm">{activity.activity}</p>
                    <p className="text-xs text-gray-600">{activity.student}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.score && (
                    <p className="font-bold text-green-600">{activity.score}%</p>
                  )}
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Événements à Venir
            </CardTitle>
            <CardDescription>Planning des prochaines sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{event.event}</p>
                  <p className="text-xs text-gray-600">{event.student}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.date}</p>
                  <p className="text-xs text-gray-600">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Messages importants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${notification.unread ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <p className="text-sm">{notification.message}</p>
                </div>
                <Badge variant={
                  notification.priority === 'high' ? 'destructive' :
                  notification.priority === 'medium' ? 'default' : 'secondary'
                }>
                  {notification.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Student Detail Modal */}
      <TutorStudentDetailedView
        student={selectedStudent}
        isOpen={showDetailedView}
        onClose={() => setShowDetailedView(false)}
      />
    </div>
  );
};

const TutorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: 'Vue d\'ensemble', href: '/dashboard/tuteur', icon: TrendingUp, isActive: currentPath === '/dashboard/tuteur' },
    { title: 'Catalogue de formation', href: '/nos-formations', icon: Library, isActive: currentPath === '/nos-formations' },
    { title: 'Suivi des élèves', href: '/dashboard/tuteur/suivi', icon: Users, isActive: currentPath === '/dashboard/tuteur/suivi' },
    { title: 'Ajouter un élève', href: '/dashboard/tuteur/ajouter-eleve', icon: UserPlus, isActive: currentPath === '/dashboard/tuteur/ajouter-eleve' },
    { title: 'Boutique', href: '/dashboard/tuteur/boutique', icon: ShoppingBag, isActive: currentPath === '/dashboard/tuteur/boutique' },
    { title: 'Abonnements', href: '/dashboard/tuteur/abonnements', icon: CreditCard, isActive: currentPath === '/dashboard/tuteur/abonnements' },
    { title: 'Mes documents', href: '/dashboard/tuteur/documents', icon: FileText, isActive: currentPath === '/dashboard/tuteur/documents' },
    { title: 'Messagerie', href: '/dashboard/tuteur/messagerie', icon: MessageSquare, badge: '3', isActive: currentPath === '/dashboard/tuteur/messagerie' },
    { title: 'Planning & Notifications', href: '/dashboard/tuteur/planning', icon: Calendar, isActive: currentPath === '/dashboard/tuteur/planning' },
    { title: 'Paramètres', href: '/dashboard/tuteur/parametres', icon: Settings, isActive: currentPath === '/dashboard/tuteur/parametres' },
  ];

  const userInfo = {
    name: "Claire Durand",
    email: "claire.durand@email.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Tuteur"
        subtitle="Suivi pédagogique"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<TutorDashboardHome />} />
          <Route path="/suivi" element={<TutorStudentTracking />} />
          <Route path="/ajouter-eleve" element={<TutorAddStudent />} />
          <Route path="/boutique" element={<TutorShop />} />
          <Route path="/abonnements" element={<TutorSubscription />} />
          <Route path="/documents" element={<TutorDocuments />} />
          <Route path="/messagerie" element={<TutorMessaging />} />
          <Route path="/planning" element={<TutorPlanningNotifications />} />
          <Route path="/parametres" element={<TutorSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default TutorDashboard;
