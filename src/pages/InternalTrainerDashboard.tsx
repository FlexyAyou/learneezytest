import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  MessageSquare,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Target,
  FileText,
  Video,
  Award,
  BarChart3
} from 'lucide-react';

import InternalTrainerContent from '@/components/internal-trainer/InternalTrainerContent';
import InternalTrainerSessions from '@/components/internal-trainer/InternalTrainerSessions';
import InternalTrainerStudents from '@/components/internal-trainer/InternalTrainerStudents';
import InternalTrainerMessaging from '@/components/internal-trainer/InternalTrainerMessaging';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const InternalTrainerDashboardHome = () => {
  const stats = [
    {
      title: "Étudiants actifs",
      value: "48",
      icon: Users,
      change: "+5 ce mois",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Sessions planifiées",
      value: "12",
      icon: Calendar,
      change: "Cette semaine",
      changeType: "neutral" as const,
      color: "text-green-600"
    },
    {
      title: "Modules créés",
      value: "24",
      icon: BookOpen,
      change: "+3 ce mois",
      changeType: "positive" as const,
      color: "text-purple-600"
    },
    {
      title: "Satisfaction",
      value: "4.7/5",
      icon: Star,
      change: "+0.3 ce mois",
      changeType: "positive" as const,
      color: "text-orange-600"
    }
  ];

  const activityData = [
    { name: 'Lun', value: 12, etudiants: 45 },
    { name: 'Mar', value: 8, etudiants: 38 },
    { name: 'Mer', value: 15, etudiants: 52 },
    { name: 'Jeu', value: 10, etudiants: 41 },
    { name: 'Ven', value: 18, etudiants: 58 },
    { name: 'Sam', value: 6, etudiants: 22 }
  ];

  const moduleData = [
    { name: 'Mathématiques', value: 8 },
    { name: 'Français', value: 6 },
    { name: 'Anglais', value: 5 },
    { name: 'Sciences', value: 3 },
    { name: 'Histoire', value: 2 }
  ];

  const upcomingSessions = [
    { id: 1, course: 'React Avancé', date: '2024-01-22', time: '14:00', students: 15 },
    { id: 2, course: 'JavaScript ES6', date: '2024-01-23', time: '10:00', students: 20 },
    { id: 3, course: 'Node.js Backend', date: '2024-01-24', time: '16:00', students: 12 },
  ];

  const recentContent = [
    { id: 1, title: 'Introduction à React', type: 'Vidéo', date: '2024-01-20', status: 'Publié' },
    { id: 2, title: 'Quiz JavaScript ES6', type: 'Quiz', date: '2024-01-18', status: 'Brouillon' },
    { id: 3, title: 'API REST avec Node.js', type: 'Article', date: '2024-01-15', status: 'Publié' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publié': return 'bg-green-100 text-green-800';
      case 'Brouillon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formateur Interne</h1>
          <p className="text-gray-600">Gérez vos contenus et vos sessions de formation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Formateur certifié
          </Badge>
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            Nouveau contenu
          </Button>
        </div>
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
          title="Activité hebdomadaire (sessions)"
          data={activityData}
          type="bar"
          dataKey="value"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Modules par matière"
          data={moduleData}
          type="pie"
          height={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sessions à venir
            </CardTitle>
            <CardDescription>Vos prochaines sessions planifiées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{session.course}</h4>
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

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Contenu récent
            </CardTitle>
            <CardDescription>Vos derniers contenus créés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{content.title}</h4>
                  <p className="text-xs text-gray-600">{content.type}</p>
                  <p className="text-xs text-gray-500">Mis à jour le {content.date}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(content.status)}`}>
                  {content.status}
                </Badge>
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
              <span>Message étudiant</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Video className="h-6 w-6" />
              <span>Ajouter vidéo</span>
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

const InternalTrainerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/interne', icon: TrendingUp, isActive: true },
    { title: 'Contenus', href: '/interne/contenus', icon: BookOpen },
    { title: 'Sessions', href: '/interne/sessions', icon: Calendar },
    { title: 'Étudiants', href: '/interne/etudiants', icon: Users },
    { title: 'Messagerie', href: '/interne/messagerie', icon: MessageSquare },
    { title: 'Planning', href: '/interne/planning', icon: Clock },
    { title: 'Évaluations', href: '/interne/evaluations', icon: Star },
    { title: 'Ressources', href: '/interne/ressources', icon: FileText },
    { title: 'Statistiques', href: '/interne/statistiques', icon: BarChart3 },
    { title: 'Paramètres', href: '/interne/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Jean Martin",
    email: "jean.martin@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Formateur Interne"
        subtitle="Contenus & Sessions"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<InternalTrainerDashboardHome />} />
          <Route path="/contenus" element={<InternalTrainerContent />} />
          <Route path="/sessions" element={<InternalTrainerSessions />} />
          <Route path="/etudiants" element={<InternalTrainerStudents />} />
          <Route path="/messagerie" element={<InternalTrainerMessaging />} />
          <Route path="/planning" element={<InternalTrainerSessions />} />
          <Route path="/evaluations" element={<InternalTrainerStudents />} />
          <Route path="/ressources" element={<InternalTrainerContent />} />
          <Route path="/statistiques" element={<InternalTrainerStudents />} />
          <Route path="/parametres" element={<InternalTrainerContent />} />
        </Routes>
      </main>
    </div>
  );
};

export default InternalTrainerDashboard;
