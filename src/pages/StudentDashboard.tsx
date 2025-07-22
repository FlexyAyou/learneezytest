
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Book, Play, Award, Clock, TrendingUp, Calendar, Star, Home, User, Settings, BookOpen, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import StudentCourses from './StudentCourses';
import StudentProgress from './StudentProgress';
import StudentCertificates from './StudentCertificates';
import StudentMessaging from './StudentMessaging';
import StudentSettings from './StudentSettings';

const StudentDashboardHome = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: "React Avancé",
      instructor: "Marie Dubois",
      progress: 75,
      nextLesson: "Hooks personnalisés",
      duration: "2h 30min",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Design UX/UI",
      instructor: "Pierre Martin",
      progress: 40,
      nextLesson: "Prototypage",
      duration: "1h 45min",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour, Jean-Paul ! 👋
        </h1>
        <p className="text-gray-600">Prêt à continuer votre apprentissage aujourd'hui ?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours suivis</CardTitle>
            <Book className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures d'étude</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48h</div>
            <p className="text-xs text-muted-foreground">+12h cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificats</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Moyenne générale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cours en cours */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mes cours en cours</CardTitle>
              <CardDescription>Continuez là où vous vous êtes arrêté</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">par {course.instructor}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-pink-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      <Play className="h-4 w-4 mr-1" />
                      Continuer
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">{course.duration}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prochains événements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Webinaire React</p>
                  <p className="text-xs text-gray-500">Demain 14h00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Examen UX Design</p>
                  <p className="text-xs text-gray-500">Vendredi 10h00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Recommandé pour vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">JavaScript ES6+</h4>
                  <p className="text-xs text-gray-600 mt-1">Perfectionnez vos bases JS</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    Découvrir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home, isActive: true },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: BookOpen },
    { title: "Progression", href: "/dashboard/etudiant/progress", icon: BarChart3 },
    { title: "Certificats", href: "/dashboard/etudiant/certificates", icon: Award },
    { title: "Messages", href: "/dashboard/etudiant/messages", icon: MessageSquare, badge: "3" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/etudiant/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Jean-Paul Martin",
    email: "jean-paul@email.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Espace Étudiant"
        subtitle="Votre parcours d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<StudentDashboardHome />} />
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/progress" element={<StudentProgress />} />
          <Route path="/certificates" element={<StudentCertificates />} />
          <Route path="/messages" element={<StudentMessaging />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
