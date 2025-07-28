
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Settings,
  Download,
  Brain,
  Video,
  TestTube,
  Bell,
  BookOpen,
  Target,
  Clock,
  Plus
} from 'lucide-react';

import { TutorStudentTrackingActions } from '@/components/tutor/TutorStudentTrackingActions';
import TutorPlanningNotifications from '@/components/tutor/TutorPlanningNotifications';
import TutorMessaging from '@/components/tutor/TutorMessaging';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import { AIChat } from '@/components/common/AIChat';
import { VideoConference } from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const TutorDashboardHome = () => {
  const stats = [
    {
      title: "Étudiants suivis",
      value: "15",
      icon: Users,
      change: "+2 ce mois",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Sessions cette semaine",
      value: "8",
      icon: Calendar,
      change: "Planifiées",
      changeType: "neutral" as const,
      color: "text-green-600"
    },
    {
      title: "Messages en attente",
      value: "3",
      icon: MessageSquare,
      change: "À traiter",
      changeType: "neutral" as const,
      color: "text-orange-600"
    },
    {
      title: "Progression moyenne",
      value: "78%",
      icon: TrendingUp,
      change: "+5% ce mois",
      changeType: "positive" as const,
      color: "text-purple-600"
    }
  ];

  const progressData = [
    { name: 'Sem 1', value: 65 },
    { name: 'Sem 2', value: 68 },
    { name: 'Sem 3', value: 72 },
    { name: 'Sem 4', value: 75 },
    { name: 'Sem 5', value: 78 },
    { name: 'Sem 6', value: 82 }
  ];

  const subjectData = [
    { name: 'Mathématiques', value: 35 },
    { name: 'Français', value: 25 },
    { name: 'Anglais', value: 20 },
    { name: 'Sciences', value: 15 },
    { name: 'Autres', value: 5 }
  ];

  const recentStudents = [
    { id: 1, name: 'Alice Martin', subject: 'Mathématiques', progress: 85, lastActivity: '2024-01-20', status: 'En progrès' },
    { id: 2, name: 'Thomas Petit', subject: 'Français', progress: 72, lastActivity: '2024-01-19', status: 'Difficultés' },
    { id: 3, name: 'Emma Dubois', subject: 'Anglais', progress: 91, lastActivity: '2024-01-21', status: 'Excellent' },
  ];

  const upcomingAppointments = [
    { id: 1, student: 'Alice Martin', date: '2024-01-22', time: '14:00', subject: 'Mathématiques', type: 'Présentiel' },
    { id: 2, student: 'Thomas Petit', date: '2024-01-22', time: '16:00', subject: 'Français', type: 'À distance' },
    { id: 3, student: 'Emma Dubois', date: '2024-01-23', time: '10:00', subject: 'Anglais', type: 'Présentiel' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'En progrès': return 'bg-blue-100 text-blue-800';
      case 'Difficultés': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Tuteur</h1>
          <p className="text-gray-600">Accompagnez vos étudiants dans leur parcours</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau suivi
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution de la progression (6 dernières semaines)"
          data={progressData}
          type="area"
          dataKey="value"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Répartition par matière"
          data={subjectData}
          type="pie"
          height={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Étudiants Récents
            </CardTitle>
            <CardDescription>Activité récente de vos étudiants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{student.name}</h4>
                    <p className="text-xs text-gray-600">{student.subject}</p>
                    <p className="text-xs text-gray-500">{student.lastActivity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{student.progress}%</div>
                  <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Rendez-vous à venir
            </CardTitle>
            <CardDescription>Vos prochaines sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{appointment.student}</h4>
                  <p className="text-xs text-gray-600">{appointment.subject}</p>
                  <p className="text-xs text-gray-500">{appointment.date} à {appointment.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {appointment.type}
                  </Badge>
                  <Button size="sm" className="ml-2">
                    Rejoindre
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accès rapide à vos outils principaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Target className="h-6 w-6" />
              <span>Nouvel objectif</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Message parent</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <BookOpen className="h-6 w-6" />
              <span>Rapport progrès</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Clock className="h-6 w-6" />
              <span>Planifier session</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TutorDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/dashboard/tuteur', icon: TrendingUp, isActive: true },
    { title: 'Suivi étudiants', href: '/dashboard/tuteur/suivi', icon: Users },
    { title: 'Planning & notifications', href: '/dashboard/tuteur/planning', icon: Calendar },
    { title: 'Messagerie', href: '/dashboard/tuteur/messages', icon: MessageSquare },
    { title: 'Tests de positionnement', href: '/dashboard/tuteur/tests', icon: TestTube },
    { title: 'Visioconférence', href: '/dashboard/tuteur/video', icon: Video },
    { title: 'Chat IA', href: '/dashboard/tuteur/chat', icon: Brain },
    { title: 'Mes documents', href: '/dashboard/tuteur/documents', icon: Download },
    { title: 'Notifications', href: '/dashboard/tuteur/notifications', icon: Bell },
    { title: 'Paramètres', href: '/dashboard/tuteur/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Claire Dubois",
    email: "claire.dubois@learneezy.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Rapport progrès.pdf', type: 'PDF', date: '2024-01-20', size: '2.3 MB' },
    { id: '2', name: 'Planning sessions.pdf', type: 'PDF', date: '2024-01-18', size: '1.8 MB' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Tuteur"
        subtitle="Accompagnement personnalisé"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<TutorDashboardHome />} />
          <Route path="/suivi" element={<TutorStudentTrackingActions />} />
          <Route path="/planning" element={<TutorPlanningNotifications />} />
          <Route path="/messages" element={<TutorMessaging />} />
          <Route path="/tests" element={<PositioningTest userRole="admin" />} />
          <Route path="/video" element={<VideoConference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="admin" />} />
          <Route path="/notifications" element={<TutorPlanningNotifications />} />
          <Route path="/parametres" element={<TutorPlanningNotifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default TutorDashboard;
