import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Award, TrendingUp, Clock, CheckCircle, Star, Trophy, Shield } from 'lucide-react';
import { BadgeDisplay } from '@/components/common/BadgeDisplay';
import { useStudentAchievements } from '@/hooks/useStudentAchievements';

interface StudentDetailViewProps {
  user: any;
  userRole?: string;
}

export const StudentDetailView = ({ user, userRole = 'admin' }: StudentDetailViewProps) => {
  const { badges, loading } = useStudentAchievements(user.id);

  // Mock data spécifique aux apprenants
  const studentData = {
    courses: [
      { id: 1, name: 'React Avancé', progress: 0, status: 'en_cours', timeSpent: '0h' },
      { id: 2, name: 'JavaScript ES6+', progress: 0, status: 'terminé', timeSpent: '0h' },
      { id: 3, name: 'HTML/CSS', progress: 0, status: 'en_cours', timeSpent: '0h' }
    ],
    certificates: [
      { id: 1, name: 'Certificat React', date: '2024-01-15' },
      { id: 2, name: 'Attestation JavaScript', date: '2024-01-10' }
    ],
    evaluations: [
      { id: 1, course: 'React Avancé', type: 'Quiz', score: '0/20', date: '2024-01-20' },
      { id: 2, course: 'JavaScript ES6+', type: 'Projet final', score: '0/20', date: '2024-01-15' }
    ],
    stats: {
      totalStudyTime: '0h',
      averageGrade: 0,
      completedCourses: 0,
      inProgressCourses: 0
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

  // Logique de visibilité pour les badges de financement
  const canViewFundingBadges = ['admin', 'manager', 'of_admin', 'of_manager'].includes(userRole);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques de l'apprenant (mockées) */}
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

      {/* Nouvelle section : Badges et Récompenses */}
      {badges && (
        <div className="space-y-6">
          {/* Badges de mérite (visibles par tous) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Badges de mérite
                <Badge variant="outline" className="ml-2">
                  {badges.achievementBadges.filter(b => b.earnedAt).length} obtenus
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.achievementBadges.map((badge) => (
                  <BadgeDisplay
                    key={badge.id}
                    badge={badge}
                    type="achievement"
                    showProgress={true}
                  />
                ))}
              </div>
              
              {badges.stats.totalBadges > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Statistiques des badges
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-600">{badges.stats.raretyBreakdown.common}</div>
                      <div className="text-xs text-gray-500">Communs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{badges.stats.raretyBreakdown.rare}</div>
                      <div className="text-xs text-gray-500">Rares</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{badges.stats.raretyBreakdown.epic}</div>
                      <div className="text-xs text-gray-500">Épiques</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{badges.stats.raretyBreakdown.legendary}</div>
                      <div className="text-xs text-gray-500">Légendaires</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges de financement (visibles uniquement par OF, Admin, Manager) */}
          {canViewFundingBadges && badges.fundingBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Badges de financement
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    Organisme uniquement
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Ces badges concernent le financement et les documents administratifs de l'apprenant.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {badges.fundingBadges.map((badge) => (
                    <BadgeDisplay
                      key={badge.id}
                      badge={badge}
                      type="funding"
                      showProgress={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
