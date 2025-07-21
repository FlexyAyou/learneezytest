import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  ClipboardList,
  Settings,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import ManagerPlanning from '@/components/manager/ManagerPlanning';
import ManagerAttendance from '@/components/manager/ManagerAttendance';
import ManagerEnrollments from '@/components/manager/ManagerEnrollments';
import { useToast } from '@/hooks/use-toast';

const ManagerDashboardHome = () => {
  const { toast } = useToast();

  const handleAssignTraining = (userId: number, trainingId: number) => {
    toast({
      title: "Formation assignée",
      description: `Formation assignée avec succès à l'utilisateur #${userId}`,
    });
  };

  const stats = [
    { title: 'Apprenants gérés', value: '245', icon: Users, color: 'text-blue-600' },
    { title: 'Formations actives', value: '18', icon: BookOpen, color: 'text-green-600' },
    { title: 'Sessions planifiées', value: '8', icon: Calendar, color: 'text-purple-600' },
    { title: 'Taux de réussite', value: '92%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const upcomingSessions = [
    { id: 1, title: 'Formation React Avancé', date: '2024-01-15', participants: 12, instructor: 'Marie Dubois' },
    { id: 2, title: 'Management d\'équipe', date: '2024-01-16', participants: 8, instructor: 'Jean Martin' },
    { id: 3, title: 'Excel pour les managers', date: '2024-01-17', participants: 15, instructor: 'Sophie Laurent' },
  ];

  const learnerProgress = [
    { id: 1, name: 'Alice Bernard', training: 'React Development', progress: 85, status: 'En cours' },
    { id: 2, name: 'Thomas Petit', training: 'UI/UX Design', progress: 92, status: 'Terminé' },
    { id: 3, name: 'Emma Moreau', training: 'Project Management', progress: 67, status: 'En cours' },
    { id: 4, name: 'Lucas Durand', training: 'Marketing Digital', progress: 45, status: 'En cours' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Gestionnaire</h1>
        <p className="text-gray-600">Supervisez les parcours de formation et gérez vos équipes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sessions Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sessions Planifiées
            </CardTitle>
            <CardDescription>Prochaines formations à superviser</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-gray-600">{session.date} • {session.participants} participants</p>
                  <p className="text-xs text-gray-500">Formateur: {session.instructor}</p>
                </div>
                <Button size="sm" variant="outline">
                  Gérer
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learner Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Progression des Apprenants
            </CardTitle>
            <CardDescription>Suivi détaillé des formations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learnerProgress.map((learner) => (
              <div key={learner.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{learner.name}</p>
                    <p className="text-xs text-gray-600">{learner.training}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={learner.status === 'Terminé' ? 'default' : 'secondary'}>
                      {learner.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={learner.progress} className="h-2" />
                <p className="text-xs text-gray-500">{learner.progress}% complété</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Outils de gestion fréquemment utilisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>Gérer les Inscriptions</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <ClipboardList className="h-6 w-6" />
              <span>Rapports de Progression</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>Planifier Session</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ManagerDashboard = () => {
  const sidebarItems = [
    { title: 'Vue d\'ensemble', href: '/dashboard/gestionnaire', icon: TrendingUp, isActive: true },
    { title: 'Apprenants', href: '/dashboard/gestionnaire/apprenants', icon: Users },
    { title: 'Formations', href: '/dashboard/gestionnaire/formations', icon: BookOpen },
    { title: 'Planning', href: '/dashboard/gestionnaire/planning', icon: Calendar },
    { title: 'Inscriptions', href: '/dashboard/gestionnaire/inscriptions', icon: UserCheck },
    { title: 'Suivi des présences', href: '/dashboard/gestionnaire/presences', icon: UserPlus },
    { title: 'Rapports', href: '/dashboard/gestionnaire/rapports', icon: ClipboardList },
    { title: 'Messages', href: '/dashboard/gestionnaire/messages', icon: MessageSquare },
    { title: 'Paramètres', href: '/dashboard/gestionnaire/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Sophie Laurent",
    email: "sophie.laurent@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Gestionnaire"
        subtitle="Supervision des formations"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ManagerDashboardHome />} />
          <Route path="apprenants" element={<div>Gestion des Apprenants</div>} />
          <Route path="formations" element={<div>Gestion des Formations</div>} />
          <Route path="planning" element={<ManagerPlanning />} />
          <Route path="inscriptions" element={<ManagerEnrollments />} />
          <Route path="presences" element={<ManagerAttendance />} />
          <Route path="rapports" element={<div>Rapports Détaillés</div>} />
          <Route path="messages" element={<div>Messagerie</div>} />
          <Route path="parametres" element={<div>Paramètres</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerDashboard;