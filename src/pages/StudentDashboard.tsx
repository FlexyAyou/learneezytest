import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  MessageSquare,
  Settings,
  Download,
  Brain,
  Video,
  TestTube,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  FileText,
  Star,
  Play
} from 'lucide-react';

import { DocumentDownload } from '@/components/common/DocumentDownload';
import { AIChat } from '@/components/common/AIChat';
import { VideoConference } from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const StudentDashboardHome = () => {
  const stats = [
    {
      title: "Cours en cours",
      value: "3",
      icon: BookOpen,
      change: "2 nouveaux ce mois",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Progression globale",
      value: "68%",
      icon: TrendingUp,
      change: "+12% ce mois",
      changeType: "positive" as const,
      color: "text-green-600"
    },
    {
      title: "Heures d'étude",
      value: "24h",
      icon: Clock,
      change: "Cette semaine",
      changeType: "neutral" as const,
      color: "text-purple-600"
    },
    {
      title: "Certificats obtenus",
      value: "2",
      icon: Award,
      change: "1 nouveau",
      changeType: "positive" as const,
      color: "text-orange-600"
    }
  ];

  const progressData = [
    { name: 'Sem 1', value: 45 },
    { name: 'Sem 2', value: 52 },
    { name: 'Sem 3', value: 58 },
    { name: 'Sem 4', value: 63 },
    { name: 'Sem 5', value: 68 },
    { name: 'Sem 6', value: 72 }
  ];

  const subjectData = [
    { name: 'React', value: 85 },
    { name: 'JavaScript', value: 72 },
    { name: 'CSS', value: 68 },
    { name: 'Node.js', value: 45 }
  ];

  const currentCourses = [
    { 
      id: 1, 
      title: 'Formation React Avancée', 
      instructor: 'Marie Dubois', 
      progress: 75, 
      nextSession: '2024-01-22 14:00',
      status: 'En cours'
    },
    { 
      id: 2, 
      title: 'JavaScript ES6 Mastery', 
      instructor: 'Jean Martin', 
      progress: 60, 
      nextSession: '2024-01-23 10:00',
      status: 'En cours'
    },
    { 
      id: 3, 
      title: 'UI/UX Design Fundamentals', 
      instructor: 'Sophie Laurent', 
      progress: 40, 
      nextSession: '2024-01-24 16:00',
      status: 'En cours'
    },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Projet React - Composants', course: 'Formation React', dueDate: '2024-01-25', priority: 'haute' },
    { id: 2, title: 'Quiz JavaScript ES6', course: 'JavaScript Mastery', dueDate: '2024-01-26', priority: 'moyenne' },
    { id: 3, title: 'Maquette Figma', course: 'UI/UX Design', dueDate: '2024-01-28', priority: 'basse' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-orange-100 text-orange-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
          <p className="text-gray-600">Suivez votre progression et gérez vos formations</p>
        </div>
        <Button>
          <Play className="mr-2 h-4 w-4" />
          Continuer le cours
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution de ma progression (6 dernières semaines)"
          data={progressData}
          type="area"
          dataKey="value"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Progression par matière"
          data={subjectData}
          type="bar"
          height={300}
          color="#10B981"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Mes Formations en Cours
            </CardTitle>
            <CardDescription>Continuez là où vous vous êtes arrêté</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-600">Par {course.instructor}</p>
                  </div>
                  <Badge variant="outline">
                    {course.status}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{course.progress}% terminé</span>
                  <span>Prochaine session: {course.nextSession}</span>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Continuer
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Travaux à Rendre
            </CardTitle>
            <CardDescription>Vos prochaines échéances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                  <p className="text-xs text-gray-600">{assignment.course}</p>
                  <p className="text-xs text-gray-500">À rendre le {assignment.dueDate}</p>
                </div>
                <div className="text-right">
                  <Badge className={`text-xs ${getPriorityColor(assignment.priority)}`}>
                    {assignment.priority}
                  </Badge>
                  <Button size="sm" className="ml-2">
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accès rapide à vos outils d'apprentissage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <TestTube className="h-6 w-6" />
              <span>Test de niveau</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Calendar className="h-6 w-6" />
              <span>Mon planning</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Star className="h-6 w-6" />
              <span>Évaluer cours</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Award className="h-6 w-6" />
              <span>Mes certificats</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StudentDashboard = () => {
  const sidebarItems = [
    { title: 'Mon tableau de bord', href: '/dashboard/etudiant', icon: TrendingUp, isActive: true },
    { title: 'Mes cours', href: '/dashboard/etudiant/cours', icon: BookOpen },
    { title: 'Ma progression', href: '/dashboard/etudiant/progression', icon: Target },
    { title: 'Mes inscriptions', href: '/dashboard/etudiant/inscriptions', icon: FileText },
    { title: 'Émargements', href: '/dashboard/etudiant/emargements', icon: CheckCircle },
    { title: 'Évaluations', href: '/dashboard/etudiant/evaluations', icon: Star },
    { title: 'Tests de positionnement', href: '/dashboard/etudiant/tests', icon: TestTube },
    { title: 'Visioconférence', href: '/dashboard/etudiant/video', icon: Video },
    { title: 'Chat IA', href: '/dashboard/etudiant/chat', icon: Brain },
    { title: 'Mes documents', href: '/dashboard/etudiant/documents', icon: Download },
    { title: 'Messagerie', href: '/dashboard/etudiant/messages', icon: MessageSquare },
    { title: 'Paramètres', href: '/dashboard/etudiant/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Antoine Moreau",
    email: "antoine.moreau@student.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Certificat React.pdf', type: 'PDF', date: '2024-01-20', size: '1.2 MB' },
    { id: '2', name: 'Supports de cours.pdf', type: 'PDF', date: '2024-01-18', size: '3.5 MB' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Étudiant"
        subtitle="Mon parcours d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<StudentDashboardHome />} />
          <Route path="/cours" element={<div>Mes cours</div>} />
          <Route path="/progression" element={<div>Ma progression</div>} />
          <Route path="/inscriptions" element={<div>Mes inscriptions</div>} />
          <Route path="/emargements" element={<div>Mes émargements</div>} />
          <Route path="/evaluations" element={<div>Mes évaluations</div>} />
          <Route path="/tests" element={<PositioningTest userRole="student" />} />
          <Route path="/video" element={<VideoConference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="student" />} />
          <Route path="/messages" element={<div>Messagerie</div>} />
          <Route path="/parametres" element={<div>Paramètres</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
