
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Search, Filter, Building2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import { useStudentContext } from '@/hooks/useStudentContext';

const StudentCourses = () => {
  const navigate = useNavigate();
  const { isOFStudent, ofName } = useStudentContext();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCourses();
  }, [isOFStudent]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isOFStudent) {
        // Pour les apprenants OF : charger uniquement les cours assignés via enrollments
        try {
          const enrollments = await fastAPIClient.getMyEnrollments();
          // Extraire les cours des enrollments
          const enrolledCourses = enrollments
            .filter((enrollment: any) => enrollment.course)
            .map((enrollment: any) => enrollment.course);
          setCourses(enrolledCourses);
        } catch (enrollError) {
          console.error('Error fetching enrollments:', enrollError);
          // Fallback : pas de cours assignés
          setCourses([]);
        }
      } else {
        // Pour les apprenants Learneezy : charger tous les cours publiés
        const response = await fastAPIClient.getCourses({
          status: 'published',
          page: 1,
          per_page: 20
        });
        setCourses(response.items);
      }
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isOFStudent ? "Mes Formations" : "Mes Cours"}
        </h1>
        <p className="text-muted-foreground">
          {isOFStudent 
            ? "Formations assignées par votre organisme de formation" 
            : "Gérez et suivez vos cours en ligne"
          }
        </p>
      </div>

      {/* Bandeau OF */}
      {isOFStudent && ofName && (
        <Alert className="border-blue-200 bg-blue-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            Ces formations vous ont été assignées par <strong>{ofName}</strong>. 
            Contactez votre organisme pour toute question.
          </AlertDescription>
        </Alert>
      )}

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
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isOFStudent 
                      ? "Aucune formation assignée" 
                      : "Aucun cours disponible"
                    }
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {isOFStudent 
                      ? "Aucune formation ne vous a encore été assignée par votre organisme de formation. Contactez votre responsable pour plus d'informations."
                      : "Découvrez notre catalogue de formations pour commencer votre apprentissage !"
                    }
                  </p>
                  {!isOFStudent && (
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/dashboard/apprenant/catalogue')}
                    >
                      Voir le catalogue
                    </Button>
                  )}
                  {isOFStudent && (
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/dashboard/apprenant/messages')}
                    >
                      Contacter mon organisme
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  {course.image_url || (course.thumbnails && course.thumbnails.length > 0) ? (
                    <img
                      src={course.image_url || course.thumbnails![0]}
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
                  {isOFStudent && (
                    <Badge className="absolute top-3 left-3 bg-indigo-500">
                      <Building2 className="h-3 w-3 mr-1" />
                      Formation OF
                    </Badge>
                  )}
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
