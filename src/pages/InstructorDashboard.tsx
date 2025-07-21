import React from 'react';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Settings, BarChart3, MessageSquare, Calendar, Home, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/DashboardSidebar';

const InstructorDashboard = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: Home, isActive: true },
    { title: "Mes cours", href: "/dashboard/instructeur/courses", icon: BookOpen },
    { title: "Étudiants", href: "/dashboard/instructeur/students", icon: Users },
    { title: "Revenus", href: "/dashboard/instructeur/analytics", icon: DollarSign },
    { title: "Messages", href: "/dashboard/instructeur/messages", icon: MessageSquare, badge: "12" },
    { title: "Planning", href: "/dashboard/instructeur/calendar", icon: Calendar },
    { title: "Paramètres", href: "/dashboard/instructeur/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Marie Dubois",
    email: "marie.dubois@email.com"
  };

  const myCourses = [
    {
      id: 1,
      title: "React.js Avancé",
      students: 156,
      rating: 4.9,
      revenue: "€2,340",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "JavaScript ES6+",
      students: 91,
      rating: 4.7,
      revenue: "€1,507",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Instructeur"
          subtitle="Créez et gérez vos cours"
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
              Bonjour, Marie ! 👩‍🏫
            </h1>
            <p className="text-gray-600">Gérez vos cours et suivez vos performances</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours publiés</CardTitle>
                <BookOpen className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+1 ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Étudiants inscrits</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">+15 cette semaine</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€3,847</div>
                <p className="text-xs text-muted-foreground">+12% depuis le mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mes cours */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Mes cours</CardTitle>
                      <CardDescription>Gérez et modifiez vos cours</CardDescription>
                    </div>
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau cours
                    </Button>
                  </div>
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
                        <p className="text-sm text-gray-600">{course.students} étudiants • {course.rating} ⭐</p>
                        <p className="text-sm text-green-600 font-medium">{course.revenue}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          <Play className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Messages récents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-pink-600" />
                    Messages récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Jean Martin</p>
                      <p className="text-xs text-gray-600">Question sur les hooks React</p>
                      <p className="text-xs text-gray-500">Il y a 2h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Sophie Leroy</p>
                      <p className="text-xs text-gray-600">Problème avec l'exercice 3</p>
                      <p className="text-xs text-gray-500">Il y a 4h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">Taux de complétion</h4>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                      <p className="text-xs text-gray-600">+5% ce mois</p>
                    </div>
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