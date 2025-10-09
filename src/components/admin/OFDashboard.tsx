
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText, Users, BookOpen, TrendingUp, Calendar, Award, Clock, Mail, UserPlus, Eye } from 'lucide-react';
import { DashboardChart } from '@/components/common/DashboardChart';
import { StatsCard } from '@/components/common/StatsCard';
import { useNavigate } from 'react-router-dom';

export const OFDashboard = () => {
  const navigate = useNavigate();

  const recentActivity = [
    { type: 'inscription', message: 'Nouvelle inscription - Marie Dupont', time: '2h', icon: Users, color: 'text-green-600' },
    { type: 'document', message: 'Attestation générée pour Jean Martin', time: '3h', icon: FileText, color: 'text-blue-600' },
    { type: 'formation', message: 'Formation JavaScript terminée', time: '5h', icon: BookOpen, color: 'text-purple-600' },
    { type: 'evaluation', message: 'Évaluation finale complétée par Sophie', time: '1j', icon: Award, color: 'text-orange-600' },
  ];

  const upcomingSessions = [
    { title: 'Formation React Avancé', date: '15 février', time: '09:00', participants: 15, formateur: 'Sophie Bernard' },
    { title: 'Évaluation JavaScript', date: '18 février', time: '14:00', participants: 8, formateur: 'Jean Martin' },
    { title: 'Certification Vue.js', date: '20 février', time: '10:00', participants: 12, formateur: 'Marie Dupont' },
    { title: 'Suivi pédagogique', date: '22 février', time: '16:00', participants: 25, formateur: 'Alex Rousseau' },
  ];


  // Données pour les graphiques spécifiques à l'OF
  const inscriptionsData = [
    { name: 'Jan', value: 45, terminees: 38 },
    { name: 'Fév', value: 52, terminees: 45 },
    { name: 'Mar', value: 48, terminees: 42 },
    { name: 'Avr', value: 61, terminees: 55 },
    { name: 'Mai', value: 55, terminees: 48 },
    { name: 'Jun', value: 67, terminees: 58 },
  ];

  const formationsDistribution = [
    { name: 'Développement Web', value: 45 },
    { name: 'Design UI/UX', value: 25 },
    { name: 'Marketing Digital', value: 20 },
    { name: 'Gestion de Projet', value: 10 },
  ];

  const satisfactionData = [
    { name: 'Jan', value: 85 },
    { name: 'Fév', value: 88 },
    { name: 'Mar', value: 92 },
    { name: 'Avr', value: 87 },
    { name: 'Mai', value: 91 },
    { name: 'Jun', value: 89 },
  ];


  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => navigate('/dashboard/organisme-formation/apprenants')} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nouvel apprenant
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/organisme-formation/documents')}>
          <FileText className="h-4 w-4 mr-2" />
          Générer document
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/organisme-formation/formations')}>
          <BookOpen className="h-4 w-4 mr-2" />
          Nouvelle formation
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/organisme-formation/envois')}>
          <Mail className="h-4 w-4 mr-2" />
          Envoi groupé
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Apprenants actifs"
          value="456"
          change="+12 ce mois"
          icon={Users}
          trend="up"
          onClick={() => navigate('/dashboard/organisme-formation/apprenants')}
        />
        <StatsCard
          title="Formations en cours"
          value="24"
          change="+3 ce mois"
          icon={BookOpen}
          trend="up"
          onClick={() => navigate('/dashboard/organisme-formation/formations')}
        />
        <StatsCard
          title="Taux de réussite"
          value="87%"
          change="+2% ce mois"
          icon={Award}
          trend="up"
          onClick={() => navigate('/dashboard/organisme-formation/suivi')}
        />
        <StatsCard
          title="Documents générés"
          value="1,247"
          change="+23 cette semaine"
          icon={FileText}
          trend="up"
          onClick={() => navigate('/dashboard/organisme-formation/documents')}
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution des inscriptions"
          data={inscriptionsData}
          type="line"
          dataKey="value"
          color="#3b82f6"
        />
        <DashboardChart
          title="Répartition par domaine"
          data={formationsDistribution}
          type="pie"
          dataKey="value"
        />
      </div>

      {/* Graphique de satisfaction */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardChart
          title="Évolution de la satisfaction (%)"
          data={satisfactionData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Prochaines sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              Prochaines session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{session.title}</h4>
                    <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/organisme-formation/suivi')}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{session.date} à {session.time}</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {session.participants}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Formateur: {session.formateur}
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
