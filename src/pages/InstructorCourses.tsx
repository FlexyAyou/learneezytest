
import React from 'react';
import { BookOpen, Plus, Eye, Edit, BarChart3, Users, Settings, Home, User, MessageSquare, Search, Filter, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const InstructorCourses = () => {
  const navigate = useNavigate();

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: Home },
    { title: "Mes cours", href: "/dashboard/instructeur/courses", icon: BookOpen, isActive: true },
    { title: "Créer un cours", href: "/dashboard/instructeur/create-course", icon: Plus },
    { title: "Analytics", href: "/dashboard/instructeur/analytics", icon: BarChart3 },
    { title: "Étudiants", href: "/dashboard/instructeur/students", icon: Users },
    { title: "Messages", href: "/dashboard/instructeur/messagerie", icon: MessageSquare, badge: "5" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/instructeur/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Marie Dubois",
    email: "marie.dubois@email.com"
  };

  const courses = [
    {
      id: 1,
      title: "React pour Débutants",
      students: 1250,
      rating: 4.8,
      revenue: 15000,
      status: "Publié",
      progress: 100,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "JavaScript Avancé",
      students: 890,
      rating: 4.9,
      revenue: 12500,
      status: "Publié", 
      progress: 100,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Node.js Backend",
      students: 0,
      rating: 0,
      revenue: 0,
      status: "Brouillon",
      progress: 65,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Instructeur"
          subtitle="Gérez vos cours et étudiants"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Cours</h1>
                <p className="text-gray-600">Gérez et suivez vos cours en ligne</p>
              </div>
              <Button onClick={() => navigate('/dashboard/instructeur/create-course')} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </div>

            {/* Filtres et recherche */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  className="max-w-md pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Tous les cours
                </Button>
                <Button variant="outline" size="sm">Publiés</Button>
                <Button variant="outline" size="sm">Brouillons</Button>
              </div>
            </div>

            {/* Liste des cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        course.status === 'Publié' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    >
                      {course.status}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} étudiants
                      </div>
                      {course.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {course.rating}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            course.progress === 100 ? 'bg-green-600' : 'bg-pink-600'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {course.revenue > 0 && (
                      <p className="text-lg font-semibold text-green-600 mb-4">
                        €{course.revenue.toLocaleString()}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/cours/${course.id}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate('/dashboard/instructeur/analytics')}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorCourses;
