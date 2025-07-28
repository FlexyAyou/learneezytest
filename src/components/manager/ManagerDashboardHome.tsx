
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, ClipboardList, Settings, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardChart } from '@/components/common/DashboardChart';
import { StatsCard } from '@/components/common/StatsCard';

export const ManagerDashboardHome = () => {
  const stats = [
    {
      title: "Inscriptions actives",
      value: "142",
      icon: Users,
      change: "+12 cette semaine",
      trend: "up" as const
    },
    {
      title: "Sessions planifiées",
      value: "28",
      icon: Calendar,
      change: "Cette semaine",
      trend: "neutral" as const
    },
    {
      title: "Rapports en attente",
      value: "5",
      icon: ClipboardList,
      change: "À valider",
      trend: "neutral" as const
    },
    {
      title: "Taux de présence",
      value: "94%",
      icon: TrendingUp,
      change: "+2% ce mois",
      trend: "up" as const
    }
  ];

  const upcomingSessions = [
    { id: 1, title: 'Formation Mathématiques', date: '2024-01-15', participants: 12, instructor: 'Marie Dubois', status: 'confirmed' },
    { id: 2, title: 'Management d\'équipe', date: '2024-01-16', participants: 8, instructor: 'Jean Martin', status: 'pending' },
    { id: 3, title: 'Excel pour les managers', date: '2024-01-17', participants: 15, instructor: 'Sophie Laurent', status: 'confirmed' },
  ];

  const learnerProgress = [
    { id: 1, name: 'Alice Bernard', training: 'React Development', progress: 85, status: 'En cours' },
    { id: 2, name: 'Thomas Petit', training: 'UI/UX Design', progress: 92, status: 'Terminé' },
    { id: 3, name: 'Emma Moreau', training: 'Project Management', progress: 67, status: 'En cours' },
    { id: 4, name: 'Lucas Durand', training: 'Marketing Digital', progress: 45, status: 'En cours' },
  ];

  // Données pour les graphiques
  const enrollmentData = [
    { name: 'Jan', value: 45, inscriptions: 45, abandons: 5 },
    { name: 'Fév', value: 52, inscriptions: 52, abandons: 8 },
    { name: 'Mar', value: 48, inscriptions: 48, abandons: 6 },
    { name: 'Avr', value: 61, inscriptions: 61, abandons: 4 },
    { name: 'Mai', value: 55, inscriptions: 55, abandons: 7 },
    { name: 'Jun', value: 58, inscriptions: 58, abandons: 3 },
  ];

  const trainingCategoriesData = [
    { name: 'Management', value: 35 },
    { name: 'Technique', value: 30 },
    { name: 'Communication', value: 20 },
    { name: 'Qualité', value: 15 },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      confirmed: { variant: 'default' as const, label: 'Confirmé', icon: CheckCircle },
      pending: { variant: 'outline' as const, label: 'En attente', icon: AlertTriangle },
    };
    const statusConfig = config[status as keyof typeof config];
    const Icon = statusConfig?.icon || AlertTriangle;
    return (
      <Badge variant={statusConfig?.variant || 'outline'} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig?.label || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Gestionnaire</h1>
        <p className="text-gray-600">Supervisez les parcours de formation et gérez vos équipes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution des inscriptions"
          data={enrollmentData}
          type="line"
          dataKey="inscriptions"
          color="#3b82f6"
        />
        <DashboardChart
          title="Répartition par catégorie"
          data={trainingCategoriesData}
          type="pie"
          dataKey="value"
        />
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
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-gray-600">{session.date} • {session.participants} participants</p>
                  <p className="text-xs text-gray-500">Formateur: {session.instructor}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(session.status)}
                  <Button size="sm" variant="outline">
                    Gérer
                  </Button>
                </div>
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
