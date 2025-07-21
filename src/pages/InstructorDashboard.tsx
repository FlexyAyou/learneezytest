import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Plus, Eye, Edit, BarChart3, MessageSquare, Settings, Home, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const InstructorSidebar = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: Home, isActive: true },
    { title: "Mes cours", href: "/dashboard/instructeur/courses", icon: BookOpen },
    { title: "Créer un cours", href: "/dashboard/instructeur/create-course", icon: Plus },
    { title: "Analytics", href: "/dashboard/instructeur/analytics", icon: BarChart3 },
    { title: "Étudiants", href: "/dashboard/instructeur/students", icon: Users },
    { title: "Messages", href: "/dashboard/instructeur/messagerie", icon: MessageSquare, badge: "5" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/instructeur/settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Espace Instructeur</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const InstructorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <InstructorSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Tableau de bord Instructeur</h1>
                  <p className="text-muted-foreground">Gérez vos cours et suivez vos performances</p>
                </div>
              </div>
              <Button onClick={() => navigate('/dashboard/instructeur/create-course')} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
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
    </SidebarProvider>
  );
};

export default InstructorDashboard;
