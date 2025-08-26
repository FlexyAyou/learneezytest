
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface StudentDetailViewProps {
  user: any;
}

export const StudentDetailView = ({ user }: StudentDetailViewProps) => {
  // Mock data spécifique aux apprenants
  const studentData = {
    courses: [
      { id: 1, name: 'React Avancé', progress: 75, status: 'en_cours', grade: 'A-', timeSpent: '24h' },
      { id: 2, name: 'JavaScript ES6+', progress: 100, status: 'terminé', grade: 'A', timeSpent: '32h' },
      { id: 3, name: 'HTML/CSS', progress: 30, status: 'en_cours', grade: '-', timeSpent: '8h' }
    ],
    certificates: [
      { id: 1, name: 'Certificat React', date: '2024-01-15', grade: 'A' },
      { id: 2, name: 'Attestation JavaScript', date: '2024-01-10', grade: 'A-' }
    ],
    evaluations: [
      { id: 1, course: 'React Avancé', type: 'Quiz', score: '16/20', date: '2024-01-20' },
      { id: 2, course: 'JavaScript ES6+', type: 'Projet final', score: '18/20', date: '2024-01-15' }
    ],
    stats: {
      totalStudyTime: '64h',
      averageGrade: 8.5,
      completedCourses: 2,
      inProgressCourses: 1
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      en_cours: { variant: 'outline' as const, label: 'En cours', color: 'text-blue-600' },
      terminé: { variant: 'default' as const, label: 'Terminé', color: 'text-green-600' },
      non_commencé: { variant: 'secondary' as const, label: 'Non commencé', color: 'text-gray-600' }
    };
    return configs[status as keyof typeof configs] || configs.non_commencé;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de l'apprenant */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {studentData.stats.completedCourses}
            </div>
            <div className="text-sm text-gray-600">Cours terminés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {studentData.stats.inProgressCourses}
            </div>
            <div className="text-sm text-gray-600">Cours en cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {studentData.stats.totalStudyTime}
            </div>
            <div className="text-sm text-gray-600">Temps d'étude</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {studentData.stats.averageGrade}/10
            </div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Formations en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Formations et progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.courses.map((course) => {
              const config = getStatusBadge(course.status);
              return (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-gray-600">Temps passé: {course.timeSpent}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      {course.grade !== '-' && (
                        <div className="text-sm font-medium mt-1">Note: {course.grade}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Évaluations récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évaluations récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.evaluations.map((evaluation) => (
              <div key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{evaluation.type} - {evaluation.course}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {evaluation.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{evaluation.score}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificats obtenus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificats et attestations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Obtenu le {cert.date}
                  </p>
                </div>
                <Badge className="bg-green-500">Grade: {cert.grade}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
