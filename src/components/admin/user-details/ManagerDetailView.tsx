
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, TrendingUp, Calendar, Settings, BarChart3 } from 'lucide-react';
import { useUserDetail } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ManagerDetailViewProps {
  user: any;
}

export const ManagerDetailView = ({ user }: ManagerDetailViewProps) => {
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

  // Mock data spécifique aux gestionnaires
  const managerData = {
    teams: [
      { id: 1, name: 'Équipe Développement Web', members: 12, lead: 'Sophie Martin', performance: 85 },
      { id: 2, name: 'Équipe Data Science', members: 8, lead: 'Marc Durand', performance: 92 },
      { id: 3, name: 'Équipe DevOps', members: 6, lead: 'Lisa Chen', performance: 78 }
    ],
    managedCourses: [
      { id: 1, title: 'Formation React', students: 45, completion: 78, satisfaction: 4.6 },
      { id: 2, title: 'Formation Node.js', students: 32, completion: 85, satisfaction: 4.4 },
      { id: 3, title: 'Formation Docker', students: 28, completion: 67, satisfaction: 4.2 }
    ],
    reports: [
      { type: 'Rapport mensuel', period: 'Janvier 2024', status: 'completed' },
      { type: 'Analyse performance', period: 'Q4 2023', status: 'in_progress' },
      { type: 'Budget formation', period: '2024', status: 'pending' }
    ],
    stats: {
      totalTeamMembers: 26,
      managedFormations: 3,
      averagePerformance: 85,
      budgetManaged: 125000
    },
    upcomingMeetings: [
      { date: '2024-01-25', time: '14:00', title: 'Réunion équipe Dev Web', attendees: 12 },
      { date: '2024-01-26', time: '10:00', title: 'Point mensuel Data Science', attendees: 8 },
      { date: '2024-01-27', time: '16:00', title: 'Revue budget formations', attendees: 5 }
    ]
  };

  const getReportStatusBadge = (status: string) => {
    const configs = {
      completed: { variant: 'default' as const, label: 'Terminé' },
      in_progress: { variant: 'outline' as const, label: 'En cours' },
      pending: { variant: 'secondary' as const, label: 'En attente' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques du gestionnaire */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {managerData.stats.totalTeamMembers}
            </div>
            <div className="text-sm text-gray-600">Membres d'équipe</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {managerData.stats.managedFormations}
            </div>
            <div className="text-sm text-gray-600">Formations gérées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {managerData.stats.averagePerformance}%
            </div>
            <div className="text-sm text-gray-600">Performance moyenne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {managerData.stats.budgetManaged.toLocaleString()}€
            </div>
            <div className="text-sm text-gray-600">Budget géré</div>
          </CardContent>
        </Card>
      </div>

      {/* Équipes supervisées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Équipes supervisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {managerData.teams.map((team) => (
              <div key={team.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{team.name}</h4>
                    <p className="text-sm text-gray-600">Chef d'équipe: {team.lead}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{team.members} membres</p>
                    <p className="text-sm text-gray-600">Performance: {team.performance}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formations supervisées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Formations supervisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {managerData.managedCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.students} étudiants inscrits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Taux de réussite: {course.completion}%</p>
                    <p className="text-sm text-gray-600">Satisfaction: {course.satisfaction}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prochaines réunions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Réunions à venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managerData.upcomingMeetings.map((meeting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-gray-600">{meeting.date} à {meeting.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{meeting.attendees} participants</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rapports et analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rapports et analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managerData.reports.map((report, index) => {
              const config = getReportStatusBadge(report.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-gray-600">{report.period}</p>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
