import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Plus, Eye, Edit, BarChart3, MessageSquare, Settings, Home, User, Video, Download, Brain, TestTube, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import { AIChat } from '@/components/common/AIChat';
import { VideoConference } from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';

const InstructorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: Home, isActive: currentPath === "/dashboard/instructeur" },
    { title: "Mes cours", href: "/dashboard/instructeur/courses", icon: BookOpen, isActive: currentPath === "/dashboard/instructeur/courses" },
    { title: "Créer un cours", href: "/dashboard/instructeur/create-course", icon: Plus, isActive: currentPath === "/dashboard/instructeur/create-course" },
    { title: "Tests de positionnement", href: "/dashboard/instructeur/tests", icon: TestTube, isActive: currentPath === "/dashboard/instructeur/tests" },
    { title: "Documents OF", href: "/dashboard/instructeur/of-documents", icon: FileText, isActive: currentPath === "/dashboard/instructeur/of-documents" },
    { title: "Analytics", href: "/dashboard/instructeur/analytics", icon: BarChart3, isActive: currentPath === "/dashboard/instructeur/analytics" },
    { title: "Étudiants", href: "/dashboard/instructeur/students", icon: Users, isActive: currentPath === "/dashboard/instructeur/students" },
    { title: "Visioconférence", href: "/dashboard/instructeur/video", icon: Video, isActive: currentPath === "/dashboard/instructeur/video" },
    { title: "Chat IA", href: "/dashboard/instructeur/chat", icon: Brain, isActive: currentPath === "/dashboard/instructeur/chat" },
    { title: "Documents élèves", href: "/dashboard/instructeur/documents", icon: Download, isActive: currentPath === "/dashboard/instructeur/documents" },
    { title: "Messages", href: "/dashboard/instructeur/messagerie", icon: MessageSquare, badge: "5", isActive: currentPath === "/dashboard/instructeur/messagerie" },
    { title: "Profil", href: "/profil", icon: User, isActive: currentPath === "/profil" },
    { title: "Paramètres", href: "/dashboard/instructeur/settings", icon: Settings, isActive: currentPath === "/dashboard/instructeur/settings" },
  ];

  const userInfo = {
    name: "Dr. Marie Dubois",
    email: "marie.dubois@Learneezy.com"
  };

  const mockStudentDocuments = [
    { id: '1', name: 'Rapport_Alice_Martin.pdf', type: 'PDF', date: '2024-01-20', size: '1.2 MB' },
    { id: '2', name: 'Projet_Jean_Dupont.zip', type: 'ZIP', date: '2024-01-18', size: '5.4 MB' }
  ];

  const myCourses = [
    {
      id: 1,
      title: "React pour Débutants",
      students: 1250,
      rating: 4.8,
      revenue: 15000,
      status: "Publié",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "JavaScript Avancé",
      students: 890,
      rating: 4.9,
      revenue: 12500,
      status: "Publié",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop"
    }
  ];

  const handleCreateCourse = () => {
    navigate('/dashboard/instructeur/create-course');
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/cours/${courseId}`);
  };

  const handleEditCourse = (courseId: number) => {
    navigate(`/dashboard/instructeur/edit-course/${courseId}`);
  };

  const handleCourseAnalytics = (courseId: number) => {
    navigate('/dashboard/instructeur/analytics');
  };

  const handleViewAnalytics = () => {
    navigate('/dashboard/instructeur/analytics');
  };

  const handleManageStudents = () => {
    navigate('/dashboard/instructeur/students');
  };

  const handleMessaging = () => {
    navigate('/dashboard/instructeur/messagerie');
  };

  const handleSettings = () => {
    toast({
      title: "Paramètres",
      description: "Configuration de votre profil instructeur",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Instructeur"
          subtitle="Gérez vos cours et performances"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bonjour, Dr. Dubois ! 👋
            </h1>
            <p className="text-gray-600">Gérez vos cours et suivez vos performances.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total étudiants</CardTitle>
                <Users className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,140</div>
                <p className="text-xs text-muted-foreground">+180 ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours publiés</CardTitle>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 en cours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€45,231</div>
                <p className="text-xs text-muted-foreground">+20.1% vs mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.85</div>
                <p className="text-xs text-muted-foreground">Sur 5 étoiles</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mes cours */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mes cours</CardTitle>
                  <CardDescription>Gérez et suivez vos cours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{course.students} étudiants</span>
                          <span>⭐ {course.rating}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {course.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          €{course.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewCourse(course.id)}
                          title="Voir le cours"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCourse(course.id)}
                          title="Éditer le cours"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCourseAnalytics(course.id)}
                          title="Analytics du cours"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleCreateCourse}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un cours
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/dashboard/instructeur/tests')}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Créer un test
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/dashboard/instructeur/video')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Session vidéo
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/dashboard/instructeur/chat')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Chat IA
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleViewAnalytics}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir les analytics
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleManageStudents}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gérer les étudiants
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleMessaging}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messagerie
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleSettings}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications récentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <p className="text-sm font-medium">Nouveau commentaire</p>
                    <p className="text-xs text-gray-600">Sur "React pour Débutants"</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                    <p className="text-sm font-medium">Cours approuvé</p>
                    <p className="text-xs text-gray-600">"JavaScript Avancé" est maintenant live</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
