
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText, Users, BookOpen, TrendingUp, Calendar, Award, AlertTriangle, CheckCircle, Clock, Mail, ArrowUp, ArrowDown, UserPlus } from 'lucide-react';
import { DashboardChart } from '@/components/common/DashboardChart';
import { StatsCard } from '@/components/common/StatsCard';
import { AssignTrainingModal } from './AssignTrainingModal';

export const OFDashboard = () => {
  const recentActivity = [
    { type: 'document', message: 'Attestation générée pour Marie Dupont', time: '2h', icon: FileText, color: 'text-blue-600' },
    { type: 'inscription', message: 'Nouvelle inscription - Jean Martin', time: '3h', icon: Users, color: 'text-green-600' },
    { type: 'formation', message: 'Formation React terminée', time: '5h', icon: BookOpen, color: 'text-purple-600' },
    { type: 'envoi', message: 'Convocation envoyée à 12 apprenants', time: '1j', icon: Mail, color: 'text-orange-600' },
  ];

  const upcomingEvents = [
    { title: 'Formation React Avancé', date: '15 février', time: '09:00', participants: 15, status: 'confirmed' },
    { title: 'Évaluation JavaScript', date: '18 février', time: '14:00', participants: 8, status: 'pending' },
    { title: 'Certification Vue.js', date: '20 février', time: '10:00', participants: 12, status: 'confirmed' },
    { title: 'Webinaire Angular', date: '22 février', time: '16:00', participants: 25, status: 'confirmed' },
  ];

  const monthlyStats = [
    { label: 'Heures dispensées', value: 456, target: 500, increase: 12, trend: 'up' as const },
    { label: 'Taux de satisfaction', value: 87, target: 90, increase: 3, trend: 'up' as const },
    { label: 'Certifications délivrées', value: 23, target: 25, increase: 15, trend: 'up' as const },
    { label: 'Taux d\'assiduité', value: 92, target: 95, increase: 2, trend: 'up' as const },
  ];

  const alerts = [
    { type: 'warning', message: 'Licence Adobe Sign expire dans 30 jours', priority: 'high' },
    { type: 'info', message: 'Intégration Zoom fonctionnelle', priority: 'low' },
    { type: 'success', message: '3 nouvelles demandes d\'inscription', priority: 'medium' },
    { type: 'error', message: 'Erreur sync Microsoft Teams', priority: 'high' },
  ];

  // Données pour les graphiques
  const usersGrowthData = [
    { name: 'Jan', value: 120, nouveaux: 15 },
    { name: 'Fév', value: 145, nouveaux: 25 },
    { name: 'Mar', value: 165, nouveaux: 20 },
    { name: 'Avr', value: 185, nouveaux: 20 },
    { name: 'Mai', value: 210, nouveaux: 25 },
    { name: 'Jun', value: 235, nouveaux: 25 },
  ];

  const trainingDistribution = [
    { name: 'React/JavaScript', value: 45 },
    { name: 'Vue.js', value: 30 },
    { name: 'Angular', value: 15 },
    { name: 'Node.js', value: 10 },
  ];

  const revenueData = [
    { name: 'Jan', value: 28500 },
    { name: 'Fév', value: 32000 },
    { name: 'Mar', value: 35500 },
    { name: 'Avr', value: 38000 },
    { name: 'Mai', value: 42000 },
    { name: 'Jun', value: 45000 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, label: 'Confirmé', icon: CheckCircle },
      pending: { variant: 'outline' as const, label: 'En attente', icon: Clock },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    return (
      <Badge variant={config?.variant || 'outline'} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config?.label || status}
      </Badge>
    );
  };

  const getAlertColor = (type: string) => {
    const colors = {
      warning: 'border-orange-200 bg-orange-50 text-orange-800',
      info: 'border-blue-200 bg-blue-50 text-blue-800',
      success: 'border-green-200 bg-green-50 text-green-800',
      error: 'border-red-200 bg-red-50 text-red-800',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <div className="space-y-6">
      {/* Header avec action d'assignation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord Administrateur
          </h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
        </div>
        <AssignTrainingModal />
      </div>

      {/* Statistiques principales avec graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs totaux"
          value="12,547"
          change="+234 ce mois"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Cours actifs"
          value="456"
          change="+12 ce mois"
          icon={BookOpen}
          trend="up"
        />
        <StatsCard
          title="Revenus totaux"
          value="€285,430"
          change="+18% ce mois"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Licences actives"
          value="8,945"
          change="+156 ce mois"
          icon={Award}
          trend="up"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution des utilisateurs"
          data={usersGrowthData}
          type="line"
          dataKey="value"
          color="#3b82f6"
        />
        <DashboardChart
          title="Répartition des formations"
          data={trainingDistribution}
          type="pie"
          dataKey="value"
        />
      </div>

      {/* Statistiques mensuelles avec graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monthlyStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{stat.increase}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{stat.value}{stat.label.includes('Taux') ? '%' : ''}</span>
                  <span className="text-sm text-gray-500">/{stat.target}</span>
                </div>
                <Progress value={(stat.value / stat.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activity.color}`}>
                    <activity.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prochaines échéances */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              Prochaines échéances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{event.date} à {event.time}</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {event.participants}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge 
                      variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des revenus */}
      <DashboardChart
        title="Évolution des revenus (€)"
        data={revenueData}
        type="bar"
        dataKey="value"
        color="#10b981"
      />
    </div>
  );
};
