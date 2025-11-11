
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';

const StudentCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fastAPIClient.getCourses({
        status: 'published',
        page: 1,
        per_page: 20
      });
      setCourses(response.items);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir le nom du propriétaire
  const getOwnerName = (course: CourseResponse) => {
    if (course.owner_type === 'learneezy') {
      return 'Learneezy';
    }
    return `Organisation #${course.owner_id}`;
  };

  // Fonction pour obtenir la catégorie
  const getCategoryName = (course: CourseResponse) => {
    if (course.category_names && course.category_names.length > 0) {
      return course.category_names[0];
    }
    return course.category || 'Non catégorisé';
  };

  // Fonction pour compter le nombre total de leçons
  const getTotalLessons = (course: CourseResponse) => {
    return course.modules?.reduce((total, module) => total + (module.content?.length || 0), 0) || 0;
  };

  // Fonction pour obtenir le cycle d'apprentissage
  const getLearningCycle = (course: CourseResponse) => {
    const cycles: Record<string, string> = {
      'primaire': 'Primaire',
      'college': 'Collège',
      'lycee': 'Lycée',
      'pro': 'Professionnel'
    };
    return course.learning_cycle ? cycles[course.learning_cycle] || course.learning_cycle : null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mes Cours</h1>
        <p className="text-muted-foreground">Gérez et suivez vos cours en ligne</p>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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

      {/* État de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Chargement des cours...</div>
        </div>
      )}

      {/* État d'erreur */}
      {error && (
        <div className="flex justify-center items-center py-12">
          <div className="text-destructive">{error}</div>
        </div>
      )}

      {/* Liste des cours */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Aucun cours disponible pour le moment
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  {course.cover_key ? (
                    <img
                      src={fastAPIClient.getPlayRedirectUrl(course.cover_key)}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Pas d'image</span>
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-blue-500">
                    En cours
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>par {getOwnerName(course)}</CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration || 'Non spécifié'}
                    </div>
                    <Badge variant="outline">{getCategoryName(course)}</Badge>
                    {getLearningCycle(course) && (
                      <Badge variant="secondary">{getLearningCycle(course)}</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression</span>
                      <span>0/{getTotalLessons(course)} leçons</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">0% complété</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                      onClick={() => navigate(`/dashboard/apprenant/courses/${course.id}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
