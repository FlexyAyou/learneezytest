import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, TrendingUp, Clock, Video, Brain, TestTube, Target, Calendar, MessageSquare, Building2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { InteractiveChart } from '@/components/common/InteractiveChart';
import { BadgeDisplay } from '@/components/common/BadgeDisplay';
import { useStudentAchievements } from '@/hooks/useStudentAchievements';
import { useNavigate } from 'react-router-dom';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useStudentContext } from '@/hooks/useStudentContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const StudentDashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useFastAPIAuth();
  const { isOFStudent, ofName, hasAccess } = useStudentContext();
  const { badges, loading } = useStudentAchievements('1');

  const stats = [
    {
      title: isOFStudent ? "Formations assignées" : "Cours en cours",
      value: "0",
      icon: BookOpen,
      change: "0 à terminer",
      trend: "neutral" as const
    },
    {
      title: "Cours terminés",
      value: "0",
      icon: Award,
      change: "+0 ce mois",
      trend: "neutral" as const
    },
    {
      title: "Certificats obtenus",
      value: "0",
      icon: Award,
      change: "+0 cette semaine",
      trend: "neutral" as const
    },
    {
      title: "Heures d'étude",
      value: "0h",
      icon: Clock,
      change: "+0h cette semaine",
      trend: "neutral" as const
    }
  ];

  const recentCourses: Array<{ id: number; title: string; progress: number; instructor: string; nextLesson: string }> = [];

  const upcomingEvents: Array<{ id: number; title: string; date: string; time: string; type: string }> = [];

  const progressData = [
    { name: 'Sem 1', value: 0, progression: 0 },
    { name: 'Sem 2', value: 0, progression: 0 },
    { name: 'Sem 3', value: 0, progression: 0 },
    { name: 'Sem 4', value: 0, progression: 0 },
    { name: 'Sem 5', value: 0, progression: 0 },
    { name: 'Sem 6', value: 0, progression: 0 },
  ];

  const studyTimeData = [
    { name: 'Lun', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Mer', value: 0 },
    { name: 'Jeu', value: 0 },
    { name: 'Ven', value: 0 },
    { name: 'Sam', value: 0 },
    { name: 'Dim', value: 0 },
  ];

  const skillsData = [
    { name: 'React', value: 0 },
    { name: 'JavaScript', value: 0 },
    { name: 'CSS', value: 0 },
    { name: 'Node.js', value: 0 },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-red-600 bg-red-50 border-red-200';
      case 'review': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assignment': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get recent earned badges (last 3)
  const recentBadges = badges?.achievementBadges
    .filter(badge => badge.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 3) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bandeau OF si apprenant OF */}
      {isOFStudent && ofName && (
        <Alert className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Vous êtes en formation avec <strong>{ofName}</strong>
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/apprenant/messages')}
              className="ml-4"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacter mon organisme
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header avec animation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.first_name || 'Apprenant'} ! 
            <span className="inline-block animate-bounce ml-2">👋</span>
          </h1>
          <p className="text-gray-600">
            {isOFStudent 
              ? "Continuez vos formations assignées" 
              : "Continuez votre apprentissage"
            }
          </p>
        </div>
        {/* Bouton principal adapté */}
        {hasAccess('catalogue') ? (
          <Button 
            onClick={() => navigate('/dashboard/apprenant/catalogue')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Catalogue de formations
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/dashboard/apprenant/courses')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
          >
            Mes formations
          </Button>
        )}
      </div>

      {/* Stats rapides avec animations */}
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

      {/* Section Badges de Mérite */}
      {!loading && recentBadges.length > 0 && (
        <Card className="hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-600 animate-pulse" />
                Mes Badges de Mérite
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/apprenant/progress')}
                className="hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all duration-300"
              >
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentBadges.map((badge) => (
                <div key={badge.id} className="transform hover:scale-105 transition-all duration-300">
                  <BadgeDisplay badge={badge} type="achievement" showProgress={false} />
                </div>
              ))}
            </div>
            {badges && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  🏆 <strong>{badges.stats.totalBadges} badges obtenus</strong> sur votre parcours d'apprentissage !
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Graphiques interactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart
          title="Progression hebdomadaire"
          data={progressData}
          type="line"
          dataKey="progression"
          color="#3b82f6"
          showControls={true}
        />
        <InteractiveChart
          title="Temps d'étude quotidien (heures)"
          data={studyTimeData}
          type="bar"
          dataKey="value"
          color="#10b981"
          showControls={true}
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cours récents améliorés */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-pink-600" />
              {isOFStudent ? "Formations en cours" : "Cours en cours"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isOFStudent 
                  ? "Aucune formation ne vous a encore été assignée."
                  : "Aucun cours en cours. Découvrez notre catalogue !"
                }
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="space-y-3 p-4 border rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium group-hover:text-pink-700 transition-colors">{course.title}</h4>
                        <p className="text-sm text-gray-600">Prochain: {course.nextLesson}</p>
                        <p className="text-xs text-gray-500">Formateur: {course.instructor}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300"
                      >
                        Continuer
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prochaines échéances améliorées */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-pink-600" />
              Prochaines échéances
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune échéance à venir
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className={`p-4 rounded-lg border-2 ${getEventTypeColor(event.type)} hover:shadow-md transition-all duration-300 cursor-pointer group`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium group-hover:opacity-80 transition-opacity">{event.title}</h4>
                        <p className="text-sm">{event.date} à {event.time}</p>
                      </div>
                      <Target className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compétences et Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compétences améliorées */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-pink-600" />
              Mes compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.map((skill) => (
                <div key={skill.name} className="space-y-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.value}%</span>
                  </div>
                  <Progress value={skill.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides adaptées */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-2 w-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 group" 
              variant="outline"
              onClick={() => navigate('/dashboard/apprenant/evaluations')}
            >
              <TestTube className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              {isOFStudent ? "Mes évaluations" : "Passer un test de positionnement"}
            </Button>
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all duration-300 group" 
              variant="outline"
              onClick={() => navigate('/dashboard/apprenant/video')}
            >
              <Video className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Rejoindre une session
            </Button>
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all duration-300 group" 
              variant="outline"
              onClick={() => navigate('/dashboard/apprenant/chat')}
            >
              <Brain className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Chat avec l'IA
            </Button>
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all duration-300 group" 
              variant="outline"
              onClick={() => navigate('/dashboard/apprenant/messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              {isOFStudent ? "Contacter mon formateur" : "Messages"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
