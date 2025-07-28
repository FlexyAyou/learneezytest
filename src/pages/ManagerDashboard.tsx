
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  MessageSquare,
  TrendingUp,
  ClipboardList,
  Award,
  UserCheck,
  BarChart3,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

import { ManagerPlanning } from '@/components/manager/ManagerPlanning';
import { ManagerAttendance } from '@/components/manager/ManagerAttendance';
import { ManagerEnrollments } from '@/components/manager/ManagerEnrollments';
import { ManagerSettings } from '@/components/manager/ManagerSettings';
import { ManagerMessaging } from '@/components/manager/ManagerMessaging';
import { ManagerReports } from '@/components/manager/ManagerReports';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const ManagerDashboardHome = () => {
  const stats = [
    {
      title: "Inscriptions actives",
      value: "124",
      icon: Users,
      change: "+8 cette semaine",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Sessions planifiées",
      value: "32",
      icon: Calendar,
      change: "Cette semaine",
      changeType: "neutral" as const,
      color: "text-green-600"
    },
    {
      title: "Taux de présence",
      value: "92%",
      icon: UserCheck,
      change: "+3% ce mois",
      changeType: "positive" as const,
      color: "text-purple-600"
    },
    {
      title: "Rapports en attente",
      value: "5",
      icon: FileText,
      change: "À traiter",
      changeType: "neutral" as const,
      color: "text-orange-600"
    }
  ];

  const enrollmentData = [
    { name: 'Jan', inscriptions: 85, abandons: 12 },
    { name: 'Fév', inscriptions: 92, abandons: 8 },
    { name: 'Mar', inscriptions: 78, abandons: 15 },
    { name: 'Avr', inscriptions: 105, abandons: 10 },
    { name: 'Mai', inscriptions: 124, abandons: 7 },
    { name: 'Juin', inscriptions: 118, abandons: 9 }
  ];

  const attendanceData = [
    { name: 'Présentiel', value: 65 },
    { name: 'À distance', value: 25 },
    { name: 'Absent', value: 8 },
    { name: 'Retard', value: 2 }
  ];

  const recentEnrollments = [
    { id: 1, student: 'Alice Martin', course: 'Formation React', date: '2024-01-20', status: 'En cours' },
    { id: 2, student: 'Thomas Petit', course: 'JavaScript Avancé', date: '2024-01-19', status: 'Terminé' },
    { id: 3, student: 'Emma Dubois', course: 'UI/UX Design', date: '2024-01-21', status: 'En attente' },
  ];

  const upcomingSessions = [
    { id: 1, course: 'Formation React', date: '2024-01-22', time: '14:00', instructor: 'Marie Dubois', students: 18 },
    { id: 2, course: 'JavaScript ES6', date: '2024-01-22', time: '16:00', instructor: 'Jean Martin', students: 15 },
    { id: 3, course: 'Node.js Backend', date: '2024-01-23', time: '10:00', instructor: 'Sophie Laurent', students: 22 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Gestionnaire</h1>
          <p className="text-gray-600">Gérez les inscriptions et le suivi pédagogique</p>
        </div>
        <Button>
          <ClipboardList className="mr-2 h-4 w-4" />
          Nouvelle inscription
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
          title="Évolution des inscriptions (6 derniers mois)"
          data={enrollmentData}
          type="line"
          dataKey="inscriptions"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Répartition des présences"
          data={attendanceData}
          type="pie"
          height={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Inscriptions Récentes
            </CardTitle>
            <CardDescription>Dernières demandes d'inscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {enrollment.student.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{enrollment.student}</h4>
                    <p className="text-xs text-gray-600">{enrollment.course}</p>
                    <p className="text-xs text-gray-500">{enrollment.date}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${getStatusColor(enrollment.status)}`}>
                  {enrollment.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sessions à venir
            </CardTitle>
            <CardDescription>Prochaines sessions planifiées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{session.course}</h4>
                  <p className="text-xs text-gray-600">Par {session.instructor}</p>
                  <p className="text-xs text-gray-500">{session.date} à {session.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {session.students} étudiants
                  </Badge>
                  <Button size="sm" className="ml-2">
                    Gérer
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
          <CardDescription>Accès rapide à vos outils de gestion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <CheckCircle className="h-6 w-6" />
              <span>Valider inscription</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Clock className="h-6 w-6" />
              <span>Planifier session</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Générer rapport</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Contacter formateur</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ManagerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/dashboard/gestionnaire', icon: TrendingUp, isActive: true },
    { title: 'Planning formations', href: '/dashboard/gestionnaire/planning', icon: Calendar },
    { title: 'Gestion présences', href: '/dashboard/gestionnaire/presences', icon: UserCheck },
    { title: 'Inscriptions', href: '/dashboard/gestionnaire/inscriptions', icon: ClipboardList },
    { title: 'Rapports', href: '/dashboard/gestionnaire/rapports', icon: FileText },
    { title: 'Messagerie', href: '/dashboard/gestionnaire/messages', icon: MessageSquare },
    { title: 'Statistiques', href: '/dashboard/gestionnaire/stats', icon: BarChart3 },
    { title: 'Téléchargements', href: '/dashboard/gestionnaire/downloads', icon: Download },
    { title: 'Paramètres', href: '/dashboard/gestionnaire/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Pierre Durand",
    email: "pierre.durand@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Gestionnaire"
        subtitle="Gestion & Suivi"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ManagerDashboardHome />} />
          <Route path="/planning" element={<ManagerPlanning />} />
          <Route path="/presences" element={<ManagerAttendance />} />
          <Route path="/inscriptions" element={<ManagerEnrollments />} />
          <Route path="/rapports" element={<ManagerReports />} />
          <Route path="/messages" element={<ManagerMessaging />} />
          <Route path="/stats" element={<ManagerReports />} />
          <Route path="/downloads" element={<ManagerReports />} />
          <Route path="/parametres" element={<ManagerSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerDashboard;
