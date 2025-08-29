
import React from 'react';
import { BookOpen, Clock, Award, CheckCircle, Circle, TrendingUp, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BadgeDisplay } from '@/components/common/BadgeDisplay';
import { useStudentAchievements } from '@/hooks/useStudentAchievements';

const StudentProgress = () => {
  const { badges, loading } = useStudentAchievements('1');

  // Mock data pour la progression de l'étudiant
  const studentStats = {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 24.5,
    averageProgress: 65,
    certificates: 2,
    currentStreak: 7
  };

  const courses = [
    {
      id: 1,
      title: 'Mathématiques CM1 - Les fractions',
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      timeSpent: 6.5,
      lastActivity: '3 jours',
      certificate: true,
      grade: 'A',
      level: 'CM1',
      cycle: 'élémentaire'
    },
    {
      id: 2,
      title: 'Français 6ème - Analyse de texte',
      progress: 85,
      totalLessons: 10,
      completedLessons: 8,
      timeSpent: 8.2,
      lastActivity: '1 jour',
      certificate: false,
      grade: null,
      level: '6ème',
      cycle: 'secondaire'
    },
    {
      id: 3,
      title: 'Sciences CE2 - Les états de la matière',
      progress: 60,
      totalLessons: 6,
      completedLessons: 4,
      timeSpent: 4.8,
      lastActivity: '2 heures',
      certificate: false,
      grade: null,
      level: 'CE2',
      cycle: 'élémentaire'
    },
    {
      id: 4,
      title: 'Histoire-Géographie 4ème - Révolution française',
      progress: 40,
      totalLessons: 12,
      completedLessons: 5,
      timeSpent: 3.2,
      lastActivity: '5 jours',
      certificate: false,
      grade: null,
      level: '4ème',
      cycle: 'secondaire'
    },
    {
      id: 5,
      title: 'Anglais 5ème - Present Perfect',
      progress: 25,
      totalLessons: 8,
      completedLessons: 2,
      timeSpent: 1.8,
      lastActivity: '1 semaine',
      certificate: false,
      grade: null,
      level: '5ème',
      cycle: 'secondaire'
    }
  ];

  const getCycleColor = (cycle: string) => {
    return cycle === 'élémentaire' 
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Séparer les badges obtenus et en cours
  const earnedBadges = badges?.achievementBadges.filter(badge => badge.earnedAt) || [];
  const inProgressBadges = badges?.achievementBadges.filter(badge => badge.progress) || [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Progrès</h1>
        <p className="text-gray-600">Suivez votre progression dans tous vos cours</p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression moyenne</p>
                <div className="text-2xl font-bold text-gray-900">{studentStats.averageProgress}%</div>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cours terminés</p>
                <div className="text-2xl font-bold text-gray-900">
                  {studentStats.completedCourses}/{studentStats.totalCourses}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps d'étude</p>
                <div className="text-2xl font-bold text-gray-900">{studentStats.totalHours}h</div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Badges obtenus</p>
                <div className="text-2xl font-bold text-gray-900">{earnedBadges.length}</div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Badges et Récompenses */}
      {!loading && badges && (
        <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-yellow-600" />
              Badges et Récompenses
            </CardTitle>
            <CardDescription>
              Vos accomplissements et prochains objectifs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statistiques des badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{badges.stats.totalBadges}</div>
                <p className="text-sm text-gray-600">Total badges</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{badges.stats.raretyBreakdown.common}</div>
                <p className="text-sm text-gray-600">Communs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{badges.stats.raretyBreakdown.rare}</div>
                <p className="text-sm text-gray-600">Rares</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{badges.stats.raretyBreakdown.epic}</div>
                <p className="text-sm text-gray-600">Épiques</p>
              </div>
            </div>

            {/* Badges obtenus */}
            {earnedBadges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Badges obtenus ({earnedBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="transform hover:scale-105 transition-all duration-300">
                      <BadgeDisplay badge={badge} type="achievement" showProgress={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges en cours */}
            {inProgressBadges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Prochains objectifs ({inProgressBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressBadges.map((badge) => (
                    <div key={badge.id} className="transform hover:scale-105 transition-all duration-300">
                      <BadgeDisplay badge={badge} type="achievement" showProgress={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Détails des cours */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Détails par cours</h2>
        
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge className={getCycleColor(course.cycle)}>
                      {course.level}
                    </Badge>
                    {course.certificate && (
                      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Award className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {course.completedLessons}/{course.totalLessons} leçons • {course.timeSpent}h d'étude
                    {course.grade && ` • Note: ${course.grade}`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getProgressColor(course.progress)}`}>
                    {course.progress}%
                  </div>
                  <p className="text-sm text-gray-600">Dernière activité: {course.lastActivity}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={course.progress} className="h-3" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span>{course.completedLessons} leçons terminées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{course.timeSpent}h de temps d'étude</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {course.progress === 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={course.progress === 100 ? 'text-green-600' : 'text-gray-600'}>
                      {course.progress === 100 ? 'Cours terminé' : 'En cours'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommandations basées sur les badges */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour débloquer vos prochains badges</CardTitle>
          <CardDescription>Objectifs personnalisés basés sur votre progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Perfectionniste en vue !</p>
                <p className="text-sm text-blue-700">
                  Il vous reste 1 note parfaite (20/20) pour débloquer le badge "Perfectionniste". 
                  Visez l'excellence dans votre prochain examen !
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Marathon d'apprentissage</p>
                <p className="text-sm text-purple-700">
                  Plus que 14 heures d'étude pour obtenir le badge "Marathon" (50h au total). 
                  Continuez sur cette lancée !
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Régularité récompensée</p>
                <p className="text-sm text-green-700">
                  Vous avez une série de {studentStats.currentStreak} jours de connexion ! 
                  Continuez pour débloquer le badge "Régulier" à 30 jours.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgress;
