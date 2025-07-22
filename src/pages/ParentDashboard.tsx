import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import ParentStudentTracking from '@/components/parent/ParentStudentTracking';
import ParentMessaging from '@/components/parent/ParentMessaging';
import ParentPlanningNotifications from '@/components/parent/ParentPlanningNotifications';
import { 
  User, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Award,
  Clock,
  Bell,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ParentDashboardHome = () => {
  const { toast } = useToast();

  const children = [
    { id: 1, name: 'Emma Durand', age: 16, courses: 3, avgScore: 85 },
    { id: 2, name: 'Lucas Durand', age: 14, courses: 2, avgScore: 92 },
  ];

  const activeCourses = [
    { 
      id: 1, 
      child: 'Emma Durand', 
      course: 'Mathématiques Niveau 1ère', 
      progress: 75, 
      lastActivity: '2024-01-14',
      nextDeadline: '2024-01-20',
      instructor: 'M. Bertrand'
    },
    { 
      id: 2, 
      child: 'Emma Durand', 
      course: 'Anglais Conversation', 
      progress: 60, 
      lastActivity: '2024-01-13',
      nextDeadline: '2024-01-18',
      instructor: 'Mme Johnson'
    },
    { 
      id: 3, 
      child: 'Lucas Durand', 
      course: 'Sciences Physiques 3ème', 
      progress: 90, 
      lastActivity: '2024-01-14',
      nextDeadline: '2024-01-22',
      instructor: 'M. Dupont'
    },
  ];

  const recentFeedback = [
    {
      id: 1,
      child: 'Emma Durand',
      course: 'Mathématiques',
      instructor: 'M. Bertrand',
      date: '2024-01-12',
      message: 'Emma montre de bons progrès en algèbre. Je recommande plus de pratique sur les équations du second degré.',
      grade: 'B+'
    },
    {
      id: 2,
      child: 'Lucas Durand',
      course: 'Sciences Physiques',
      instructor: 'M. Dupont',
      date: '2024-01-10',
      message: 'Excellent travail sur le chapitre électricité. Lucas pose de très bonnes questions.',
      grade: 'A'
    },
  ];

  const upcomingEvents = [
    { id: 1, child: 'Emma Durand', event: 'Contrôle Mathématiques', date: '2024-01-20', time: '14:00' },
    { id: 2, child: 'Lucas Durand', event: 'Présentation Sciences', date: '2024-01-22', time: '10:30' },
    { id: 3, child: 'Emma Durand', event: 'Rendez-vous Orientation', date: '2024-01-25', time: '16:00' },
  ];

  const handleContactInstructor = (instructorName: string, childName: string) => {
    toast({
      title: "Message envoyé",
      description: `Votre message à ${instructorName} concernant ${childName} a été envoyé.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Espace Parent</h1>
        <p className="text-gray-600">Suivez les progrès et résultats de vos enfants</p>
      </div>

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Mes Enfants
          </CardTitle>
          <CardDescription>Vue d'ensemble des performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child) => (
              <div key={child.id} className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.age} ans</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{child.avgScore}%</p>
                    <p className="text-xs text-gray-600">Moyenne générale</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{child.courses} cours actifs</span>
                  <Badge variant="secondary">Actif</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Progression des Cours
            </CardTitle>
            <CardDescription>Suivi détaillé par enfant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeCourses.map((course) => (
              <div key={course.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{course.course}</p>
                    <p className="text-xs text-gray-600">{course.child} • {course.instructor}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.progress}%
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Dernière activité: {course.lastActivity}</span>
                  <span>Échéance: {course.nextDeadline}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Retours Pédagogiques
            </CardTitle>
            <CardDescription>Messages des formateurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{feedback.child}</p>
                    <p className="text-xs text-gray-600">{feedback.course} • {feedback.instructor}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="mb-1">{feedback.grade}</Badge>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{feedback.message}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => handleContactInstructor(feedback.instructor, feedback.child)}
                >
                  Répondre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Schedule and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Événements à Venir
          </CardTitle>
          <CardDescription>Planning et notifications importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{event.event}</p>
                    <p className="text-xs text-gray-600">{event.child}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.date}</p>
                  <p className="text-xs text-gray-600">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ParentDashboard = () => {
  const sidebarItems = [
    { title: 'Vue d\'ensemble', href: '/parent', icon: TrendingUp, isActive: true },
    { title: 'Suivi des élèves', href: '/parent/suivi', icon: User },
    { title: 'Messagerie', href: '/parent/messagerie', icon: MessageSquare, badge: '3' },
    { title: 'Planning & Notifications', href: '/parent/planning', icon: Calendar },
  ];

  const userInfo = {
    name: "Claire Durand",
    email: "claire.durand@email.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Parent/Tuteur"
        subtitle="Suivi pédagogique"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ParentDashboardHome />} />
          <Route path="/suivi" element={<ParentStudentTracking />} />
          <Route path="/messagerie" element={<ParentMessaging />} />
          <Route path="/planning" element={<ParentPlanningNotifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default ParentDashboard;