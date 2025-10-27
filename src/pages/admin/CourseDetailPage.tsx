import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Clock, BookOpen, PlayCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const courseData = await fastAPIClient.getCourse(courseId);
        setCourse(courseData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du cours');
        toast({
          title: "Erreur",
          description: "Impossible de charger le cours",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleDelete = async () => {
    if (!courseId || !confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    
    try {
      await fastAPIClient.deleteCourse(courseId);
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      navigate('/dashboard/superadmin/courses');
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!courseId || !course) return;
    
    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      await fastAPIClient.updateCourseStatus(courseId, newStatus);
      setCourse({ ...course, status: newStatus });
      toast({
        title: "Statut modifié",
        description: `Le cours est maintenant ${newStatus === 'published' ? 'publié' : 'en brouillon'}.`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/superadmin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Cours introuvable'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/superadmin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
          >
            {course.status === 'published' ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Mettre en brouillon
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publier
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/superadmin/courses/${course.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className={course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {course.status === 'published' ? 'Publié' : 'Brouillon'}
                    </Badge>
                    <Badge className={course.owner_type === 'learneezy' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                      {course.owner_type === 'learneezy' ? 'Learneezy' : 'Organisme'}
                    </Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium">{course.category || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="font-medium">{course.price ? `${course.price}€` : 'Gratuit'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Modules ({course.modules?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!course.modules || course.modules.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun module disponible</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">{module.title}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{module.content?.length || 0} leçons</Badge>
                            <span className="text-sm text-gray-500">{module.duration}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-4">
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                          
                          {/* Lessons */}
                          {module.content && module.content.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Leçons</h4>
                              {module.content.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <PlayCircle className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Quizzes */}
                          {module.quizzes && module.quizzes.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Quiz</h4>
                              {module.quizzes.map((quiz, quizIndex) => (
                                <div key={quizIndex} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm">{quiz.title}</span>
                                  </div>
                                  <Badge variant="outline">{quiz.questions?.length || 0} questions</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Image */}
          {course.image_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Image du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full rounded-lg object-cover"
                />
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {course.resources && course.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ressources ({course.resources.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{resource.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Propriétaire</p>
                <p className="font-medium">
                  {course.owner_type === 'learneezy' ? 'Learneezy' : `Organisme #${course.owner_id}`}
                </p>
              </div>
              <div>
                <p className="text-gray-500">ID du cours</p>
                <p className="font-mono text-xs">{course.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
