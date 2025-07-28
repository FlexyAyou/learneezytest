
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Users, BookOpen, TrendingUp, Calendar, Award, AlertTriangle, CheckCircle, Clock, Mail, ArrowUp, ArrowDown } from 'lucide-react';

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
    { label: 'Heures dispensées', value: 456, target: 500, increase: 12 },
    { label: 'Taux de satisfaction', value: 87, target: 90, increase: 3 },
    { label: 'Certifications délivrées', value: 23, target: 25, increase: 15 },
    { label: 'Taux d\'assiduité', value: 92, target: 95, increase: 2 },
  ];

  const alerts = [
    { type: 'warning', message: 'Licence Adobe Sign expire dans 30 jours', priority: 'high' },
    { type: 'info', message: 'Intégration Zoom fonctionnelle', priority: 'low' },
    { type: 'success', message: '3 nouvelles demandes d\'inscription', priority: 'medium' },
    { type: 'error', message: 'Erreur sync Microsoft Teams', priority: 'high' },
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

      {/* Graphiques et métriques supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-600" />
              Répartition des formations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'React/JavaScript', value: 45, color: 'bg-blue-500' },
                { name: 'Vue.js', value: 30, color: 'bg-green-500' },
                { name: 'Angular', value: 15, color: 'bg-red-500' },
                { name: 'Node.js', value: 10, color: 'bg-yellow-500' },
              ].map((formation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{formation.name}</span>
                    <span className="text-sm text-gray-600">{formation.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${formation.color}`}
                      style={{ width: `${formation.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Performance des apprenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Excellents (90-100%)', value: 35, color: 'bg-green-500' },
                { label: 'Bons (80-89%)', value: 40, color: 'bg-blue-500' },
                { label: 'Satisfaisants (70-79%)', value: 20, color: 'bg-yellow-500' },
                { label: 'À améliorer (<70%)', value: 5, color: 'bg-red-500' },
              ].map((perf, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{perf.label}</span>
                    <span className="text-sm text-gray-600">{perf.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${perf.color}`}
                      style={{ width: `${perf.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
