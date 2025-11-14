import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Lock, Book, Clock, Award, Download, MessageSquare } from 'lucide-react';
import { fastAPIClient } from '@/services/fastapi-client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CourseResponse } from '@/types/fastapi';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { QuizModal } from '@/components/student/QuizModal';
import { QuizConfig } from '@/types/quiz';

const CourseViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizConfig | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Refresh presigned URL for cover image
  const { url: coverUrl } = usePresignedUrl(course?.cover_key);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fastAPIClient.getCourse(id);
        setCourse(data);

        // TODO: Fetch user's actual progress from API
        setCompletedLessons([]);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Cours non trouvé</h2>
        <Button onClick={() => navigate('/dashboard/apprenant/courses')}>
          Retour aux cours
        </Button>
      </div>
    );
  }

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);

  const isLessonAvailable = (moduleIndex: number, lessonIndex: number) => {
    if (moduleIndex === 0 && lessonIndex === 0) return true;

    if (lessonIndex > 0) {
      const previousLesson = course.modules[moduleIndex].content[lessonIndex - 1];
      return isLessonCompleted(previousLesson.title);
    }

    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      return previousModule.content.every(lesson => isLessonCompleted(lesson.title));
    }

    return false;
  };

  const getTotalLessons = () => {
    return course.modules.reduce((total, module) => total + module.content.length, 0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'interactive': return '🎮';
      case 'exercise': return '📝';
      default: return '📄';
    }
  };

  const totalLessons = getTotalLessons();
  const completedCount = completedLessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleContinueCourse = () => {
    for (const module of course.modules) {
      for (const lesson of module.content) {
        if (!isLessonCompleted(lesson.title)) {
          navigate(`/dashboard/apprenant/courses/${id}/lessons/${lesson.title}`);
          return;
        }
      }
    }
    if (course.modules[0]?.content[0]) {
      navigate(`/dashboard/apprenant/courses/${id}/lessons/${course.modules[0].content[0].title}`);
    }
  };

  const handleLessonClick = (lessonTitle: string) => {
    navigate(`/dashboard/apprenant/courses/${id}/lessons/${lessonTitle}`);
  };

  const getLearningCycle = () => {
    if (!course.learning_cycle) return null;
    const cycles: Record<string, string> = {
      'primaire': 'Primaire',
      'college': 'Collège',
      'lycee': 'Lycée',
      'pro': 'Professionnel'
    };
    return cycles[course.learning_cycle] || course.learning_cycle.charAt(0).toUpperCase() + course.learning_cycle.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/apprenant/courses')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux cours
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden">
        {coverUrl || (course.thumbnails && course.thumbnails.length > 0) ? (
          <img
            src={coverUrl || course.thumbnails![0]}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-r from-pink-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-6 text-white w-full">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{course.level}</Badge>
              {getLearningCycle() && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {getLearningCycle()}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration || 'Non spécifié'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">
                  {course.owner_type === 'learneezy' ? 'Learneezy' : 'Organisme de Formation'}
                </span>
              </div>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Votre progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression du cours</span>
              <span>{completedCount}/{totalLessons} leçons terminées</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">{progressPercentage}% complété</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Card key={moduleIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">Module {moduleIndex + 1}: {module.title}</CardTitle>
                    {module.description && (
                      <div
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(module.description) }}
                      />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Lessons */}
                      {module.content.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(lesson.title);
                        const isAvailable = isLessonAvailable(moduleIndex, lessonIndex);

                        return (
                          <div
                            key={lessonIndex}
                            className={`flex items-center justify-between p-3 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' :
                                isAvailable ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : isAvailable ? (
                                <Play className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Lock className="w-5 h-5 text-gray-400" />
                              )}
                              <div>
                                <p className={`font-medium ${!isAvailable ? 'text-gray-400' : ''}`}>
                                  {getTypeIcon('video')} {lesson.title}
                                </p>
                                <p className={`text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {lesson.description} • {lesson.duration}
                                </p>
                              </div>
                            </div>

                            {isAvailable && (
                              <Button
                                size="sm"
                                variant={isCompleted ? "outline" : "default"}
                                onClick={() => handleLessonClick(lesson.title)}
                              >
                                {isCompleted ? 'Revoir' : 'Commencer'}
                              </Button>
                            )}
                          </div>
                        );
                      })}

                      {/* Quizzes */}
                      {module.quizzes && module.quizzes.length > 0 && (
                        <>
                          <div className="pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Quiz du module</h4>
                          </div>
                          {module.quizzes.map((quiz, quizIndex) => (
                            <div
                              key={`quiz-${quizIndex}`}
                              className="flex items-center justify-between p-3 border rounded-lg border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Book className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="font-medium">📝 {quiz.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-300 text-purple-700 hover:bg-purple-200"
                                onClick={() => {
                                  if (quiz) {
                                    setSelectedQuiz(quiz as unknown as QuizConfig);
                                    setIsQuizModalOpen(true);
                                  }
                                }}
                              >
                                Démarrer le quiz
                              </Button>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description du cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(course.description || '') }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ressources téléchargeables</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.resources && course.resources.length > 0 ? (
                    <div className="space-y-2">
                      {course.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Book className="w-5 h-5 text-blue-600" />
                            <span>{resource.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune ressource disponible pour ce cours.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleContinueCourse}>
                <Play className="w-4 h-4 mr-2" />
                Continuer le cours
              </Button>
              {course.resources && course.resources.length > 0 && (
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger les ressources
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Poser une question
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Niveau</span>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              {course.learning_cycle && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cycle</span>
                  <Badge variant="outline">{getLearningCycle()}</Badge>
                </div>
              )}
              {course.duration && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durée totale</span>
                  <span className="text-sm font-medium">{course.duration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Modules</span>
                <span className="text-sm font-medium">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Leçons</span>
                <span className="text-sm font-medium">{totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Propriétaire</span>
                <span className="text-sm font-medium">
                  {course.owner_type === 'learneezy' ? 'Learneezy' : 'OF'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          open={isQuizModalOpen}
          onOpenChange={setIsQuizModalOpen}
          quiz={selectedQuiz}
          onComplete={(result) => {
            console.log('Quiz completed:', result);
            // TODO: Save result to backend
            if (result.isPassing) {
              // Mark quiz as completed
              setCompletedLessons([...completedLessons, selectedQuiz.id]);
            }
          }}
        />
      )}
    </div>
  );
};

export default CourseViewer;
