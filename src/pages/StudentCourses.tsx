
import React from 'react';
import { Book, Play, Clock, Award, Star, Search, Filter, Home, BarChart3, MessageSquare, User, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const StudentCourses = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: Book, isActive: true },
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

  const courses = [
    {
      id: 1,
      title: "React Avancé",
      instructor: "Marie Dubois",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      duration: "8h 30min",
      level: "Intermédiaire",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
      status: "En cours"
    },
    {
      id: 2,
      title: "Design UX/UI",
      instructor: "Pierre Martin",
      progress: 40,
      totalLessons: 20,
      completedLessons: 8,
      duration: "6h 45min",
      level: "Débutant",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop",
      status: "En cours"
    },
    {
      id: 3,
      title: "JavaScript ES6+",
      instructor: "Sophie Laurent",
      progress: 100,
      totalLessons: 16,
      completedLessons: 16,
      duration: "5h 20min",
      level: "Intermédiaire",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
      status: "Terminé"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        title="Espace Étudiant"
        subtitle="Votre parcours d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Cours</h1>
            <p className="text-gray-600">Gérez et suivez vos cours en ligne</p>
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
              <Button variant="outline" size="sm">En cours</Button>
              <Button variant="outline" size="sm">Terminés</Button>
            </div>
          </div>

          {/* Liste des cours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      course.status === 'Terminé' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {course.status}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>par {course.instructor}</CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression</span>
                      <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.progress}% complété</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                      <Play className="h-4 w-4 mr-2" />
                      {course.status === 'Terminé' ? 'Revoir' : 'Continuer'}
                    </Button>
                    {course.status === 'Terminé' && (
                      <Button variant="outline" size="sm">
                        <Award className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentCourses;
