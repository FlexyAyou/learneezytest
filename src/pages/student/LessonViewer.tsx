import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Clock, MessageSquare, Download, ChevronRight, ChevronLeft, Home, User, X, Menu, Video, FileText, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourse } from '@/hooks/useApi';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { QuizModal } from '@/components/student/QuizModal';
import { QuizConfig } from '@/types/quiz';
import VideoPlayer from '@/components/common/VideoPlayer';
import PDFViewer from '@/components/common/PDFViewer';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizConfig | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Fetch course data
  const { data: course, isLoading } = useCourse(courseId!);

  // Progress tracking
  const {
    completedLessons,
    markLessonComplete,
    isLessonCompleted,
    calculateProgress
  } = useLearnerProgress(courseId!);

  // Find current lesson and module
  const { currentLesson, currentModule, lessonIndex, allLessons } = useMemo(() => {
    if (!course) return { currentLesson: null, currentModule: null, lessonIndex: -1, allLessons: [] };

    const lessons: any[] = [];
    let foundLesson = null;
    let foundModule = null;
    let foundIndex = -1;

    course.modules.forEach((module: any) => {
      module.content.forEach((lesson: any) => {
        lessons.push({ ...lesson, module });
        if (lesson.title === lessonId) {
          foundLesson = lesson;
          foundModule = module;
          foundIndex = lessons.length - 1;
        }
      });
    });

    return {
      currentLesson: foundLesson,
      currentModule: foundModule,
      lessonIndex: foundIndex,
      allLessons: lessons
    };
  }, [course, lessonId]);

  // Navigation
  const previousLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const handleMarkComplete = () => {
    if (currentLesson) {
      markLessonComplete(currentLesson.title);
      toast({
        title: "✅ Leçon terminée",
        description: "Votre progression a été mise à jour",
      });
    }
  };

  const handleLessonClick = (lessonTitle: string) => {
    navigate(`/dashboard/apprenant/courses/${courseId}/lessons/${lessonTitle}`);
  };

  const handleDownloadResource = async (resourceUrl: string, resourceName: string) => {
    try {
      const downloadUrl = await fastAPIClient.getDownloadUrl(resourceUrl);
      const link = document.createElement('a');
      link.href = downloadUrl.download_url;
      link.download = resourceName;
      link.click();

      toast({
        title: "✅ Téléchargement démarré",
        description: resourceName,
      });
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de télécharger la ressource",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course || !currentLesson || !currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Leçon introuvable</p>
          <Button onClick={() => navigate(`/dashboard/apprenant/courses/${courseId}`)}>
            Retour au cours
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = allLessons.length;
  const progressPercentage = calculateProgress(totalLessons);
  const isCompleted = isLessonCompleted(currentLesson.title);

  const getContentType = (lesson: any) => {
    if (lesson.video_key || lesson.video_url) return 'video';
    if (lesson.pdf_key) return 'pdf';
    if (lesson.image_key) return 'image';
    return 'text';
  };

  const contentType = getContentType(currentLesson);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Table des matières */}
      {showTableOfContents && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Table des matières</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTableOfContents(false)}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {course.modules.map((module: any, moduleIndex: number) => (
                <div key={module.title} className="mb-6">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                    {module.title}
                  </h3>

                  <div className="space-y-2">
                    {module.content.map((lessonItem: any, index: number) => (
                      <div
                        key={lessonItem.title}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${lessonItem.title === lessonId
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : 'hover:bg-gray-50'
                          }`}
                        onClick={() => handleLessonClick(lessonItem.title)}
                      >
                        <div className="flex-shrink-0">
                          {isLessonCompleted(lessonItem.title) ? (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${lessonItem.title === lessonId
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 text-gray-500'
                              }`}>
                              {moduleIndex + 1}.{index + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${lessonItem.title === lessonId ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                            {lessonItem.title}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {lessonItem.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header de navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                {!showTableOfContents && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTableOfContents(true)}
                    className="p-2"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="p-2"
                >
                  <Home className="w-4 h-4" />
                </Button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/dashboard/apprenant/courses/${courseId}`)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {course.title}
                </Button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{currentLesson.title}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  {lessonIndex + 1}/{totalLessons} leçons
                </div>
                <Progress value={progressPercentage} className="w-20 h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Contenu principal */}
              <div className="lg:col-span-3">
                {/* En-tête de la leçon */}
                <div className="mb-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-base px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                      📚 {currentModule.title}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">
                      {contentType === 'video' && '🎥 vidéo'}
                      {contentType === 'pdf' && '📄 PDF'}
                      {contentType === 'image' && '🖼️ image'}
                      {contentType === 'text' && '📝 texte'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLesson.duration}
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-3">{currentLesson.title}</h1>
                  {currentLesson.description && (
                    <div
                      className="text-gray-600 text-lg"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentLesson.description) }}
                    />
                  )}

                  {/* Bouton de démarrage du quiz (si le module propose des quizz) */}
                  {currentModule?.quizzes && currentModule.quizzes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Quiz du module</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        {currentModule.quizzes.map((quiz: any, idx: number) => (
                          <Button
                            key={`module-quiz-${idx}`}
                            variant="outline"
                            onClick={() => {
                              setSelectedQuiz(quiz as QuizConfig);
                              setIsQuizModalOpen(true);
                            }}
                            className="mb-2 sm:mb-0"
                          >
                            📝 {quiz.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu de la leçon */}
                <Card className="mb-6">
                  <CardContent className="p-0">
                    {contentType === 'video' && (
                      <VideoPlayer
                        videoKey={currentLesson.video_key || currentLesson.key}
                        videoUrl={currentLesson.video_url}
                        title={currentLesson.title}
                      />
                    )}
                    {contentType === 'pdf' && (
                      <PDFViewer
                        pdfKey={currentLesson.pdf_key}
                        title={currentLesson.title}
                        height="600px"
                      />
                    )}
                    {contentType === 'image' && (
                      <ImageDisplay imageKey={currentLesson.image_key} title={currentLesson.title} />
                    )}
                  </CardContent>
                </Card>

                {/* Onglets de contenu */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="transcript">Transcription</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion avec le formateur</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>À propos de cette leçon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentLesson.description && (
                          <div
                            className="text-gray-700 mb-4"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentLesson.description) }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transcript" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Transcription de la leçon</CardTitle>
                        <CardDescription>Texte intégral de la vidéo</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {currentLesson.transcription ? (
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                              {currentLesson.transcription}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-gray-500">Aucune transcription disponible</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="discussion" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5" />
                          Discussion avec votre formateur
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                          <p className="font-medium mb-1">Aucune discussion pour le moment</p>
                          <p className="text-sm text-gray-400 mb-4">
                            Posez une question à votre formateur sur cette leçon
                          </p>
                          <Button variant="outline" className="mt-2">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Poser une question
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progression */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Cours complété</span>
                          <span className="font-semibold">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <Button
                        onClick={handleMarkComplete}
                        disabled={isCompleted}
                        className="w-full"
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Leçon terminée
                          </>
                        ) : (
                          'Marquer comme terminé'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {previousLesson && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleLessonClick(previousLesson.title)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Leçon précédente
                      </Button>
                    )}
                    {nextLesson && (
                      <Button
                        className="w-full justify-start"
                        onClick={() => handleLessonClick(nextLesson.title)}
                      >
                        Leçon suivante
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Ressources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ressources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentLesson.resources.map((resource: any, idx: number) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => handleDownloadResource(resource.url, resource.name)}
                          >
                            <span className="truncate">{resource.name}</span>
                            <Download className="w-4 h-4 ml-2 flex-shrink-0" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedQuiz && (
        <QuizModal
          open={isQuizModalOpen}
          onOpenChange={(open) => setIsQuizModalOpen(open)}
          quiz={selectedQuiz}
          onComplete={(result) => {
            console.log('Quiz completed:', result);
            // Persister le résultat côté backend si nécessaire
            if (result.isPassing) {
              if (currentLesson) {
                markLessonComplete(currentLesson.title);
                toast({ title: '✅ Quiz réussi', description: 'Le quiz a été complété avec succès' });
              }
            } else {
              toast({ title: '❌ Quiz non réussi', description: 'Vous pouvez réessayer le quiz' });
            }
            setIsQuizModalOpen(false);
            setSelectedQuiz(null);
          }}
        />
      )}

    </div>
  );
};

// Component pour afficher les images
const ImageDisplay: React.FC<{ imageKey?: string; title: string }> = ({ imageKey, title }) => {
  const { url, loading, error } = usePresignedUrl(imageKey);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Image non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <img
        src={url}
        alt={title}
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
};

export default LessonViewer;