import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import TutorStudentTracking from '@/components/tutor/TutorStudentTracking';
import TutorMessaging from '@/components/tutor/TutorMessaging';
import TutorPlanningNotifications from '@/components/tutor/TutorPlanningNotifications';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Bell,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TutorDashboardHome = () => {
  const { toast } = useToast();

  const students = [
    { id: 1, name: 'Emma Martin', age: 16, courses: 3, avgScore: 85, status: 'active' },
    { id: 2, name: 'Lucas Dubois', age: 14, courses: 2, avgScore: 92, status: 'active' },
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
    toast({
      title: "Détails de l'élève",
      description: `Ouverture des détails pour ${studentName}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Tuteur</h1>
        <p className="text-gray-600">Suivez la progression de vos élèves</p>
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
    </div>
  );
};

const TutorDashboard = () => {
  const sidebarItems = [
    { title: 'Vue d\'ensemble', href: '/dashboard/tuteur', icon: TrendingUp, isActive: true },
    { title: 'Suivi des élèves', href: '/dashboard/tuteur/suivi', icon: Users },
    { title: 'Messagerie', href: '/dashboard/tuteur/messagerie', icon: MessageSquare, badge: '3' },
    { title: 'Planning & Notifications', href: '/dashboard/tuteur/planning', icon: Calendar },
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
          <Route path="/messagerie" element={<TutorMessaging />} />
          <Route path="/planning" element={<TutorPlanningNotifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default TutorDashboard;