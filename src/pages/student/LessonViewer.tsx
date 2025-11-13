import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X,
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
  Award,
  ClipboardList
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourse } from '@/hooks/useApi';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import { Content } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import VideoPlayer from '@/components/common/VideoPlayer';
import PDFViewer from '@/components/common/PDFViewer';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTableOfContents, setShowTableOfContents] = useState(true);

  // Récupération du cours complet via l'API
  const { data: course, isLoading, error } = useCourse(courseId || '');

  // Gestion de la progression
  const {
    completedLessons,
    isLessonCompleted,
    markLessonComplete,
    setCurrentLesson,
    calculateProgress,
  } = useLearnerProgress(courseId || '');

  // Trouver la leçon actuelle et les informations de navigation
  const lessonData = useMemo(() => {
    if (!course || !lessonId) return null;

    let currentLesson: Content | null = null;
    let currentModule: any = null;
    let moduleIndex = -1;
    let lessonIndex = -1;
    let previousLesson: { id: string; title: string; moduleTitle: string } | null = null;
    let nextLesson: { id: string; title: string; moduleTitle: string } | null = null;
    let allLessons: Array<{ lesson: Content; module: any; moduleIndex: number }> = [];

    // Construire la liste complète de toutes les leçons
    course.modules?.forEach((module, mIdx) => {
      module.content?.forEach((lesson) => {
        allLessons.push({ lesson, module, moduleIndex: mIdx });
      });
    });

    // Trouver la leçon actuelle
    const currentIndex = allLessons.findIndex((item) => item.lesson.title === decodeURIComponent(lessonId));
    
    if (currentIndex !== -1) {
      const current = allLessons[currentIndex];
      currentLesson = current.lesson;
      currentModule = current.module;
      moduleIndex = current.moduleIndex;
      lessonIndex = current.module.content?.indexOf(current.lesson) || 0;

      // Trouver la leçon précédente
      if (currentIndex > 0) {
        const prev = allLessons[currentIndex - 1];
        previousLesson = {
          id: prev.lesson.title,
          title: prev.lesson.title,
          moduleTitle: prev.module.title,
        };
      }

      // Trouver la leçon suivante
      if (currentIndex < allLessons.length - 1) {
        const next = allLessons[currentIndex + 1];
        nextLesson = {
          id: next.lesson.title,
          title: next.lesson.title,
          moduleTitle: next.module.title,
        };
      }
    }

    return {
      currentLesson,
      currentModule,
      moduleIndex,
      lessonIndex,
      previousLesson,
      nextLesson,
      allLessons,
      totalLessons: allLessons.length,
    };
  }, [course, lessonId]);

  // Mettre à jour la leçon actuelle
  useEffect(() => {
    if (lessonData?.currentLesson) {
      setCurrentLesson(lessonData.currentLesson.title);
    }
  }, [lessonData?.currentLesson, setCurrentLesson]);

  // Calcul du pourcentage de progression
  const progressPercentage = useMemo(() => {
    if (!lessonData) return 0;
    return calculateProgress(lessonData.totalLessons);
  }, [lessonData, calculateProgress]);

  const handleMarkComplete = () => {
    if (lessonData?.currentLesson) {
      markLessonComplete(lessonData.currentLesson.title);
      toast({
        title: "Leçon terminée !",
        description: "Votre progression a été enregistrée.",
      });
    }
  };

  const handleNextLesson = () => {
    if (lessonData?.nextLesson) {
      navigate(`/dashboard/apprenant/courses/${courseId}/lessons/${encodeURIComponent(lessonData.nextLesson.id)}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lessonData?.previousLesson) {
      navigate(`/dashboard/apprenant/courses/${courseId}/lessons/${encodeURIComponent(lessonData.previousLesson.id)}`);
    }
  };

  const handleLessonClick = (lessonTitle: string) => {
    navigate(`/dashboard/apprenant/courses/${courseId}/lessons/${encodeURIComponent(lessonTitle)}`);
  };

  // Détection du type de contenu
  const getContentType = (lesson: Content): 'video' | 'pdf' | 'image' | 'none' => {
    if (lesson.video_key || lesson.video_url) return 'video';
    if (lesson.pdf_key) return 'pdf';
    if (lesson.image_key) return 'image';
    return 'none';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
            <CardDescription>Impossible de charger le cours</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard/apprenant/courses')}>
              Retour aux cours
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lessonData?.currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Leçon introuvable</CardTitle>
            <CardDescription>La leçon demandée n'existe pas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/dashboard/apprenant/courses/${courseId}`)}>
              Retour au cours
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { currentLesson, currentModule, moduleIndex, previousLesson, nextLesson } = lessonData;
  const contentType = getContentType(currentLesson);
  const isCompleted = isLessonCompleted(currentLesson.title);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Table des matières */}
      {showTableOfContents && (
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Table des matières</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTableOfContents(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start mb-4"
                onClick={() => navigate(`/dashboard/apprenant/courses/${courseId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au cours
              </Button>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Progression globale</div>
                <Progress value={progressPercentage} className="mb-1" />
                <div className="text-xs text-muted-foreground text-right">
                  {completedLessons.size} / {lessonData.totalLessons} leçons
                </div>
              </div>

              <Accordion type="single" collapsible className="space-y-2" defaultValue={`module-${moduleIndex}`}>
                {course.modules?.map((module, mIdx) => (
                  <AccordionItem key={mIdx} value={`module-${mIdx}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-start text-left">
                        <div>
                          <div className="font-medium text-sm">Module {mIdx + 1}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{module.title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {module.content?.map((lesson, lIdx) => {
                          const lessonCompleted = isLessonCompleted(lesson.title);
                          const isCurrent = lesson.title === currentLesson.title;
                          
                          return (
                            <button
                              key={lIdx}
                              onClick={() => handleLessonClick(lesson.title)}
                              className={`w-full text-left p-3 rounded-lg transition-colors ${
                                isCurrent
                                  ? 'bg-primary text-primary-foreground'
                                  : lessonCompleted
                                  ? 'bg-muted hover:bg-muted/80'
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {lessonCompleted ? (
                                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <div className={`h-4 w-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                    isCurrent ? 'border-primary-foreground' : 'border-muted-foreground'
                                  }`} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium line-clamp-2 ${
                                    isCurrent ? 'text-primary-foreground' : 'text-foreground'
                                  }`}>
                                    {lesson.title}
                                  </div>
                                  <div className={`text-xs mt-1 flex items-center gap-2 ${
                                    isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                  }`}>
                                    <Clock className="h-3 w-3" />
                                    {lesson.duration}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        
                        {/* Quizzes */}
                        {module.quizzes?.map((quiz, qIdx) => (
                          <div
                            key={`quiz-${qIdx}`}
                            className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                          >
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground line-clamp-1">
                                  {quiz.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {quiz.questions?.length || 0} questions
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Assignments */}
                        {module.assignments?.map((assignment, aIdx) => (
                          <div
                            key={`assignment-${aIdx}`}
                            className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                          >
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground line-clamp-1">
                                  {assignment.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Devoir</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* En-tête avec navigation */}
        <div className="bg-card border-b border-border p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {!showTableOfContents && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTableOfContents(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">
                    {course.title} / Module {moduleIndex + 1}
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>
                </div>
              </div>
              {!isCompleted && (
                <Button onClick={handleMarkComplete} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Marquer comme terminé
                </Button>
              )}
              {isCompleted && (
                <Badge variant="default" className="bg-green-600 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Terminé
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Progress value={progressPercentage} className="flex-1" />
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Contenu de la leçon */}
        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-6">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{currentModule.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">
                        {contentType === 'video' && <VideoIcon className="h-3 w-3 mr-1" />}
                        {contentType === 'pdf' && <FileText className="h-3 w-3 mr-1" />}
                        {contentType === 'image' && <ImageIcon className="h-3 w-3 mr-1" />}
                        {contentType === 'video' ? 'Vidéo' : contentType === 'pdf' ? 'PDF' : contentType === 'image' ? 'Image' : 'Contenu'}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {currentLesson.duration}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4 text-foreground">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <div
                    className="content-html prose max-w-none text-muted-foreground mb-6"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentLesson.description) }}
                  />
                )}

                {/* Affichage du contenu selon le type */}
                {contentType === 'video' && (
                  <VideoPlayer
                    videoKey={currentLesson.video_key || currentLesson.key}
                    videoUrl={currentLesson.video_url}
                    title={currentLesson.title}
                    className="mb-6"
                  />
                )}

                {contentType === 'pdf' && currentLesson.pdf_key && (
                  <PDFViewer
                    pdfKey={currentLesson.pdf_key}
                    title={currentLesson.title}
                    height="600px"
                    showDownload
                  />
                )}

                {contentType === 'image' && currentLesson.image_key && (
                  <ImageViewer imageKey={currentLesson.image_key} title={currentLesson.title} />
                )}
              </CardContent>
            </Card>

            {/* Onglets pour transcription et ressources */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="transcript">Transcription</TabsTrigger>
                <TabsTrigger value="resources">Ressources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de cette leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentLesson.description ? (
                      <div
                        className="content-html prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentLesson.description) }}
                      />
                    ) : (
                      <p className="text-muted-foreground">Aucune description disponible.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentLesson.transcription ? (
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {currentLesson.transcription}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Aucune transcription disponible.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Ressources du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.resources && course.resources.length > 0 ? (
                      <div className="space-y-2">
                        {course.resources.map((resource, idx) => (
                          <ResourceItem key={idx} resource={resource} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Aucune ressource disponible.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation entre leçons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={!previousLesson}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Leçon précédente
              </Button>
              <Button
                onClick={handleNextLesson}
                disabled={!nextLesson}
                className="gap-2"
              >
                Leçon suivante
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// Composant pour afficher une image avec presigned URL
const ImageViewer: React.FC<{ imageKey: string; title: string }> = ({ imageKey, title }) => {
  const { url, loading, error } = usePresignedUrl(imageKey);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Impossible de charger l'image</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <img src={url} alt={title} className="w-full h-auto" />
    </div>
  );
};

// Composant pour afficher une ressource
const ResourceItem: React.FC<{ resource: { name: string; url?: string } }> = ({ resource }) => {
  const { url, loading } = usePresignedUrl(resource.url);

  const handleDownload = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">{resource.name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        disabled={loading || !url}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Télécharger
      </Button>
    </div>
  );
};

export default LessonViewer;