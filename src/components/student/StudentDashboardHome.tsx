
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, TrendingUp, Clock, Video, Brain, TestTube, Target, Calendar, MessageSquare } from 'lucide-react';
import { DashboardChart } from '@/components/common/DashboardChart';
import { StatsCard } from '@/components/common/StatsCard';
import { useNavigate } from 'react-router-dom';

export const StudentDashboardHome = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Cours en cours",
      value: "3",
      icon: BookOpen,
      change: "2 à terminer",
      trend: "neutral" as const
    },
    {
      title: "Cours terminés",
      value: "12",
      icon: Award,
      change: "+2 ce mois",
      trend: "up" as const
    },
    {
      title: "Certificats obtenus",
      value: "8",
      icon: Award,
      change: "+1 cette semaine",
      trend: "up" as const
    },
    {
      title: "Heures d'étude",
      value: "156h",
      icon: Clock,
      change: "+12h cette semaine",
      trend: "up" as const
    }
  ];

  const recentCourses = [
    { id: 1, title: 'React pour Débutants', progress: 75, instructor: 'Marie Dubois', nextLesson: 'Hooks avancés' },
    { id: 2, title: 'JavaScript Avancé', progress: 30, instructor: 'Jean Martin', nextLesson: 'Async/Await' },
    { id: 3, title: 'CSS Grid & Flexbox', progress: 90, instructor: 'Sophie Laurent', nextLesson: 'Projet final' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Évaluation React', date: '2024-01-18', time: '14:00', type: 'exam' },
    { id: 2, title: 'Session de révision JS', date: '2024-01-20', time: '10:00', type: 'review' },
    { id: 3, title: 'Remise projet CSS', date: '2024-01-22', time: '23:59', type: 'assignment' },
  ];

  // Données pour les graphiques
  const progressData = [
    { name: 'Sem 1', value: 20, progression: 20 },
    { name: 'Sem 2', value: 35, progression: 35 },
    { name: 'Sem 3', value: 45, progression: 45 },
    { name: 'Sem 4', value: 60, progression: 60 },
    { name: 'Sem 5', value: 72, progression: 72 },
    { name: 'Sem 6', value: 85, progression: 85 },
  ];

  const skillsData = [
    { name: 'React', value: 75 },
    { name: 'JavaScript', value: 60 },
    { name: 'CSS', value: 85 },
    { name: 'Node.js', value: 40 },
  ];

  const studyTimeData = [
    { name: 'Lun', value: 3 },
    { name: 'Mar', value: 2 },
    { name: 'Mer', value: 4 },
    { name: 'Jeu', value: 2.5 },
    { name: 'Ven', value: 3.5 },
    { name: 'Sam', value: 5 },
    { name: 'Dim', value: 1 },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-red-600 bg-red-50';
      case 'review': return 'text-blue-600 bg-blue-50';
      case 'assignment': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour Alice ! 👋
          </h1>
          <p className="text-gray-600">Continuez votre apprentissage</p>
        </div>
        <Button onClick={() => navigate('/cours')}>
          Catalogue de formations
        </Button>
      </div>

      {/* Stats rapides */}
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
          title="Progression hebdomadaire"
          data={progressData}
          type="line"
          dataKey="progression"
          color="#3b82f6"
        />
        <DashboardChart
          title="Temps d'étude quotidien (heures)"
          data={studyTimeData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cours récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Cours en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-gray-600">Prochain: {course.nextLesson}</p>
                      <p className="text-xs text-gray-500">Formateur: {course.instructor}</p>
                    </div>
                    <Button size="sm" variant="outline">
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
          </CardContent>
        </Card>

        {/* Prochaines échéances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Prochaines échéances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm">{event.date} à {event.time}</p>
                    </div>
                    <Target className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compétences et Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compétences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Mes compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.map((skill) => (
                <div key={skill.name} className="space-y-2">
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

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/etudiant/tests')}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Passer un test de positionnement
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/etudiant/video')}
            >
              <Video className="h-4 w-4 mr-2" />
              Rejoindre une session
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/etudiant/chat')}
            >
              <Brain className="h-4 w-4 mr-2" />
              Chat avec l'IA
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/etudiant/messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
