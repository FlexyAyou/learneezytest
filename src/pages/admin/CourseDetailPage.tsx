import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Clock, BookOpen, PlayCircle, FileText, CheckCircle, XCircle, Video, Download, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse, Content } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface VideoPlayerProps {
  videoKey?: string;
  videoUrl?: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoKey, videoUrl, title }) => {
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoKey && !videoUrl) {
        setError('Aucune vidéo disponible');
        return;
      }

      if (videoUrl) {
        setPlayUrl(videoUrl);
        return;
      }

      if (videoKey) {
        setLoading(true);
        setError(null);
        try {
          const response = await fastAPIClient.getVideoPlayUrl(videoKey);
          setPlayUrl(response.url);
        } catch (err: any) {
          setError('Erreur lors du chargement de la vidéo');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadVideo();
  }, [videoKey, videoUrl]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-600 mt-2">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-red-200">
        <div className="text-center">
          <Video className="h-12 w-12 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!playUrl) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
        <div className="text-center">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucune vidéo disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
      <video 
        src={playUrl} 
        controls 
        className="w-full h-full"
        title={title}
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Content | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

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
    if (!courseId || !confirm('⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce cours ?')) return;
    
    try {
      await fastAPIClient.deleteCourse(courseId);
      toast({
        title: "✅ Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      navigate('/dashboard/superadmin/courses');
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!courseId || !course) return;
    
    setStatusUpdating(true);
    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      const updatedCourse = await fastAPIClient.updateCourseStatus(courseId, newStatus);
      setCourse(updatedCourse);
      toast({
        title: newStatus === 'published' ? "✅ Cours publié" : "📝 Cours en brouillon",
        description: `Le cours est maintenant ${newStatus === 'published' ? 'visible par tous' : 'masqué du public'}.`,
      });
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Calculer les statistiques
  const totalLessons = course?.modules?.reduce((acc, mod) => acc + (mod.content?.length || 0), 0) || 0;
  const totalQuizzes = course?.modules?.reduce((acc, mod) => acc + (mod.quizzes?.length || 0), 0) || 0;
  const totalVideos = course?.modules?.reduce((acc, mod) => 
    acc + (mod.content?.filter(c => c.video_key || c.key || c.video_url).length || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement du cours...</p>
        </div>
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
            variant={course.status === 'published' ? 'outline' : 'default'}
            onClick={handleToggleStatus}
            disabled={statusUpdating}
            className={course.status === 'published' 
              ? 'hover:bg-yellow-50 hover:text-yellow-700' 
              : 'bg-green-600 hover:bg-green-700'}
          >
            {statusUpdating ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : course.status === 'published' ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Mettre en brouillon
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publier le cours
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/superadmin/courses/${course.id}/edit`)}
            className="hover:bg-blue-50 hover:text-blue-700"
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
          {/* Main Info Card */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{course.title}</CardTitle>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {course.status === 'published' ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Publié
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <XCircle className="h-3 w-3 mr-1" />
                        Brouillon
                      </Badge>
                    )}
                    <Badge className={course.owner_type === 'learneezy' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}>
                      {course.owner_type === 'learneezy' ? '🏢 Learneezy' : '🎓 Organisme'}
                    </Badge>
                    <Badge variant="outline" className="border-2 border-pink-300 text-pink-700">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t-2">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Catégorie</p>
                  <p className="font-bold text-blue-700">{course.category || '-'}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Durée totale</p>
                  <p className="font-bold text-purple-700 flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration || '-'}
                  </p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Prix</p>
                  <p className="font-bold text-pink-700 text-lg">
                    {course.price ? `${course.price}€` : 'Gratuit'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{course.modules?.length || 0}</div>
                <p className="text-xs text-blue-700 font-medium">Modules</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardContent className="pt-6 text-center">
                <PlayCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{totalLessons}</div>
                <p className="text-xs text-green-700 font-medium">Leçons</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardContent className="pt-6 text-center">
                <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{totalVideos}</div>
                <p className="text-xs text-purple-700 font-medium">Vidéos</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="pt-6 text-center">
                <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">{totalQuizzes}</div>
                <p className="text-xs text-orange-700 font-medium">Quiz</p>
              </CardContent>
            </Card>
          </div>

          {/* Modules */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Contenu du cours
              </CardTitle>
              <CardDescription>
                {course.modules?.length || 0} module(s), {totalLessons} leçon(s), {totalQuizzes} quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!course.modules || course.modules.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucun module disponible</p>
                  <p className="text-sm">Ajoutez du contenu à ce cours pour commencer</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index}`} className="border-2 rounded-lg mb-3 overflow-hidden">
                      <AccordionTrigger className="px-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center">
                            <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </span>
                            <span className="font-semibold text-lg">{module.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-blue-300">
                              {module.content?.length || 0} leçons
                            </Badge>
                            <Badge variant="outline" className="border-purple-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-50">
                        <div className="space-y-4 p-4">
                          {module.description && (
                            <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500 shadow-sm">
                              <p className="text-gray-700 leading-relaxed">{module.description}</p>
                            </div>
                          )}
                          
                          {/* Lessons */}
                          {module.content && module.content.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold flex items-center text-gray-900">
                                <PlayCircle className="h-5 w-5 mr-2 text-green-600" />
                                Leçons ({module.content.length})
                              </h4>
                              {module.content.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="space-y-3 bg-white rounded-lg border-2 hover:border-pink-300 transition-all">
                                  <div 
                                    className="flex items-center justify-between p-4 cursor-pointer"
                                    onClick={() => setSelectedLesson(selectedLesson?.title === lesson.title ? null : lesson)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                        {lessonIndex + 1}
                                      </span>
                                      <div>
                                        <p className="font-medium">{lesson.title}</p>
                                        {(lesson.video_key || lesson.key || lesson.video_url) && (
                                          <Badge variant="secondary" className="text-xs mt-1">
                                            <Video className="h-3 w-3 mr-1" />
                                            Vidéo disponible
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {lesson.duration}
                                    </Badge>
                                  </div>
                                  
                                  {selectedLesson?.title === lesson.title && (
                                    <div className="px-4 pb-4 space-y-4 border-t-2 pt-4">
                                      {lesson.description && (
                                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                          <h5 className="font-semibold text-sm mb-2 flex items-center text-blue-900">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Description
                                          </h5>
                                          <p className="text-sm text-gray-700 leading-relaxed">{lesson.description}</p>
                                        </div>
                                      )}
                                      
                                      {(lesson.video_key || lesson.key || lesson.video_url) && (
                                        <div>
                                          <h5 className="font-semibold text-sm mb-3 flex items-center text-gray-900">
                                            <Video className="h-4 w-4 mr-2 text-pink-600" />
                                            Vidéo de la leçon
                                          </h5>
                                          <VideoPlayer 
                                            videoKey={lesson.video_key || lesson.key}
                                            videoUrl={lesson.video_url}
                                            title={lesson.title}
                                          />
                                        </div>
                                      )}
                                      
                                      {lesson.transcription && (
                                        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-400">
                                          <h5 className="font-semibold text-sm mb-2 flex items-center text-gray-900">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Transcription
                                          </h5>
                                          <p className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
                                            {lesson.transcription}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Quizzes */}
                          {module.quizzes && module.quizzes.length > 0 && (
                            <div className="space-y-3 mt-6">
                              <h4 className="font-semibold flex items-center text-gray-900">
                                <Award className="h-5 w-5 mr-2 text-orange-600" />
                                Quiz ({module.quizzes.length})
                              </h4>
                              {module.quizzes.map((quiz, quizIndex) => (
                                <div key={quizIndex} className="bg-white rounded-lg border-2 border-orange-200 overflow-hidden">
                                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
                                    <div className="flex items-center space-x-3">
                                      <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                        {quizIndex + 1}
                                      </span>
                                      <span className="font-semibold">{quiz.title}</span>
                                    </div>
                                    <Badge variant="outline" className="border-orange-400">
                                      {quiz.questions?.length || 0} questions
                                    </Badge>
                                  </div>
                                  
                                  {quiz.questions && quiz.questions.length > 0 && (
                                    <div className="p-4 space-y-4">
                                      {quiz.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                          <p className="font-semibold text-gray-900">
                                            <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm mr-2">
                                              Q{qIndex + 1}
                                            </span>
                                            {question.question}
                                          </p>
                                          <div className="space-y-2 pl-4">
                                            {question.options.map((option, optIndex) => {
                                              const isCorrect = option === question.correct_answer;
                                              return (
                                                <div 
                                                  key={optIndex} 
                                                  className={`text-sm p-3 rounded-lg flex items-center space-x-3 transition-all ${
                                                    isCorrect 
                                                      ? 'bg-green-100 text-green-900 border-2 border-green-400 font-semibold shadow-sm' 
                                                      : 'bg-white text-gray-700 border border-gray-300'
                                                  }`}
                                                >
                                                  {isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                  ) : (
                                                    <XCircle className="h-5 w-5 text-gray-400" />
                                                  )}
                                                  <span>{option}</span>
                                                  {isCorrect && (
                                                    <Badge className="ml-auto bg-green-600">
                                                      Réponse correcte
                                                    </Badge>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
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
            <Card className="border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="text-sm flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Image du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-sm">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Button 
                className="w-full justify-start hover:bg-blue-50" 
                variant="outline"
                onClick={() => navigate(`/dashboard/superadmin/courses/${course.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier le cours
              </Button>
              <Button 
                className={`w-full justify-start ${
                  course.status === 'published' 
                    ? 'hover:bg-yellow-50' 
                    : 'hover:bg-green-50'
                }`}
                variant="outline"
                onClick={handleToggleStatus}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : course.status === 'published' ? (
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
                className="w-full justify-start hover:bg-red-50 hover:text-red-600" 
                variant="outline"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          {course.resources && course.resources.length > 0 && (
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="text-sm flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Ressources ({course.resources.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {course.resources.map((resource: any, index: number) => (
                    <li key={index}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center p-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{resource.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="text-sm">Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">ID du cours</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{course.id}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">Statut</span>
                  {course.status === 'published' ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publié
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white">
                      <XCircle className="h-3 w-3 mr-1" />
                      Brouillon
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">Propriétaire</span>
                  <Badge className={course.owner_type === 'learneezy' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'}>
                    {course.owner_type === 'learneezy' ? '🏢 Learneezy' : '🎓 Organisme'}
                  </Badge>
                </div>
                {course.owner_id && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600 font-medium">ID Propriétaire</span>
                    <span className="font-mono text-xs">{course.owner_id}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;