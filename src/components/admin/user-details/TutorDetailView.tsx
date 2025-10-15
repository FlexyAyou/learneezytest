import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Calendar, TrendingUp, MessageSquare, Award } from 'lucide-react';

interface TutorDetailViewProps {
  user: any;
}

export const TutorDetailView = ({ user }: TutorDetailViewProps) => {
  // Mock data pour les tuteurs
  const tutorData = {
    students: [
      { id: 1, name: 'Alice Dupont', progress: 75, status: 'active', lastActivity: '2024-01-20' },
      { id: 2, name: 'Bob Martin', progress: 60, status: 'active', lastActivity: '2024-01-19' },
      { id: 3, name: 'Claire Leroy', progress: 90, status: 'active', lastActivity: '2024-01-20' }
    ],
    courses: [
      { id: 1, name: 'React Avancé', students: 5, completionRate: 70 },
      { id: 2, name: 'JavaScript ES6+', students: 3, completionRate: 85 },
      { id: 3, name: 'HTML/CSS', students: 2, completionRate: 95 }
    ],
    communications: [
      { id: 1, student: 'Alice Dupont', subject: 'Question sur le module 3', date: '2024-01-20', status: 'answered' },
      { id: 2, student: 'Bob Martin', subject: 'Demande de rendez-vous', date: '2024-01-19', status: 'pending' }
    ],
    stats: {
      totalStudents: 10,
      activeStudents: 8,
      averageProgress: 75,
      messagesThisWeek: 15
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { variant: 'default' as const, label: 'Actif', color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, label: 'Inactif', color: 'text-gray-600' },
      completed: { variant: 'outline' as const, label: 'Terminé', color: 'text-blue-600' }
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const getCommunicationStatusBadge = (status: string) => {
    const configs = {
      answered: { variant: 'default' as const, label: 'Répondu', color: 'bg-green-100 text-green-800' },
      pending: { variant: 'outline' as const, label: 'En attente', color: 'bg-yellow-100 text-yellow-800' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques du tuteur */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {tutorData.stats.totalStudents}
            </div>
            <div className="text-sm text-gray-600">Apprenants totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {tutorData.stats.activeStudents}
            </div>
            <div className="text-sm text-gray-600">Apprenants actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {tutorData.stats.averageProgress}%
            </div>
            <div className="text-sm text-gray-600">Progression moyenne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {tutorData.stats.messagesThisWeek}
            </div>
            <div className="text-sm text-gray-600">Messages cette semaine</div>
          </CardContent>
        </Card>
      </div>

      {/* Apprenants suivis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Apprenants suivis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tutorData.students.map((student) => {
              const config = getStatusBadge(student.status);
              return (
                <div key={student.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{student.name}</h4>
                      <p className="text-sm text-gray-600">Dernière activité: {student.lastActivity}</p>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-gray-600">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cours supervisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Cours supervisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tutorData.courses.map((course) => (
              <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{course.name}</h4>
                    <p className="text-sm text-gray-600">{course.students} apprenant(s)</p>
                  </div>
                  <Badge variant="outline">{course.completionRate}% complété</Badge>
                </div>
                <Progress value={course.completionRate} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communications récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tutorData.communications.map((comm) => {
              const config = getCommunicationStatusBadge(comm.status);
              return (
                <div key={comm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{comm.subject}</p>
                    <p className="text-sm text-gray-600">{comm.student} - {comm.date}</p>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
