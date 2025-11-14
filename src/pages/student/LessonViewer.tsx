import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Clock, MessageSquare, Download, ChevronRight, ChevronLeft, Home, User, X, Menu, Video, FileText, Image as ImageIcon, ClipboardList } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourse } from '@/hooks/useApi';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import VideoPlayer from '@/components/common/VideoPlayer';
import PDFViewer from '@/components/common/PDFViewer';
import { QuizViewer } from '@/components/student/QuizViewer';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import { QuizConfig } from '@/types/quiz';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTableOfContents, setShowTableOfContents] = useState(true);

  // Fetch course data
  const { data: course, isLoading } = useCourse(courseId!);
  
  // Progress tracking
  const { 
    completedLessons, 
    markLessonComplete, 
    isLessonCompleted, 
    calculateProgress,
    completedQuizzes,
    markQuizComplete,
    isQuizCompleted,
    getQuizResult,
  } = useLearnerProgress(courseId!);

  // Find current lesson/quiz and module
  const { currentItem, currentModule, itemIndex, allItems, itemType } = useMemo(() => {
    if (!course) return { currentItem: null, currentModule: null, itemIndex: -1, allItems: [], itemType: null };

    const items: any[] = [];
    let foundItem = null;
    let foundModule = null;
    let foundIndex = -1;
    let foundType: 'lesson' | 'quiz' | null = null;

    course.modules.forEach((module: any) => {
      // Add lessons
      module.content.forEach((lesson: any) => {
        items.push({ ...lesson, module, type: 'lesson' });
        if (lesson.title === lessonId) {
          foundItem = lesson;
          foundModule = module;
          foundIndex = items.length - 1;
          foundType = 'lesson';
        }
      });
      
      // Add quizzes
      if (module.quizzes) {
        module.quizzes.forEach((quiz: any, quizIdx: number) => {
          const quizItem = { 
            ...quiz, 
            module, 
            type: 'quiz',
            id: `${module.id}-quiz-${quizIdx}`,
            title: quiz.title,
            duration: '20min', // Default duration for quizzes
          };
          items.push(quizItem);
          if (quiz.title === lessonId) {
            foundItem = quizItem;
            foundModule = module;
            foundIndex = items.length - 1;
            foundType = 'quiz';
          }
        });
      }
    });

    return { 
      currentItem: foundItem, 
      currentModule: foundModule, 
      itemIndex: foundIndex,
      allItems: items,
      itemType: foundType,
    };
  }, [course, lessonId]);

  // Navigation
  const previousItem = itemIndex > 0 ? allItems[itemIndex - 1] : null;
  const nextItem = itemIndex >= 0 && itemIndex < allItems.length - 1 ? allItems[itemIndex + 1] : null;

  const handleMarkComplete = () => {
    if (currentItem && itemType === 'lesson') {
      markLessonComplete(currentItem.title);
      toast({
        title: "✅ Leçon terminée",
        description: "Votre progression a été mise à jour",
      });
    }
  };

  const handleItemClick = (itemTitle: string) => {
    navigate(`/dashboard/apprenant/courses/${courseId}/lessons/${itemTitle}`);
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (currentItem && itemType === 'quiz') {
      markQuizComplete(currentItem.id, score, passed);
      toast({
        title: passed ? "✅ Quiz réussi !" : "📝 Quiz terminé",
        description: passed 
          ? `Félicitations ! Score: ${score} points`
          : `Score: ${score} points. Vous pouvez réessayer.`,
        variant: passed ? "default" : "destructive",
      });
    }
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

  if (!course || !currentItem || !currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Contenu introuvable</p>
          <Button onClick={() => navigate(`/dashboard/apprenant/courses/${courseId}`)}>
            Retour au cours
          </Button>
        </div>
      </div>
    );
  }

  const totalItems = allItems.length;
  const progressPercentage = calculateProgress(totalItems);
  const isCompleted = itemType === 'lesson' 
    ? isLessonCompleted(currentItem.title)
    : isQuizCompleted(currentItem.id);

  const getContentType = (item: any) => {
    if (item.type === 'quiz') return 'quiz';
    if (item.video_key || item.video_url) return 'video';
    if (item.pdf_key) return 'pdf';
    if (item.image_key) return 'image';
    return 'text';
  };

  const contentType = getContentType(currentItem);

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
                    {/* Lessons */}
                    {module.content.map((lessonItem: any, index: number) => (
                      <div
                        key={lessonItem.title}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          lessonItem.title === lessonId 
                            ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleItemClick(lessonItem.title)}
                      >
                        <div className="flex-shrink-0">
                          {isLessonCompleted(lessonItem.title) ? (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                              lessonItem.title === lessonId 
                                ? 'border-blue-500 bg-blue-500 text-white' 
                                : 'border-gray-300 text-gray-500'
                            }`}>
                              {moduleIndex + 1}.{index + 1}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {lessonItem.video_key && <Video className="w-3 h-3 text-blue-500" />}
                            {lessonItem.pdf_key && <FileText className="w-3 h-3 text-red-500" />}
                            {lessonItem.image_key && <ImageIcon className="w-3 h-3 text-purple-500" />}
                            <p className={`text-sm font-medium truncate ${
                              lessonItem.title === lessonId ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {lessonItem.title}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {lessonItem.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Quizzes */}
                    {module.quizzes && module.quizzes.length > 0 && module.quizzes.map((quiz: any, quizIdx: number) => {
                      const quizId = `${module.id}-quiz-${quizIdx}`;
                      const isQuizDone = isQuizCompleted(quizId);
                      const quizResult = getQuizResult(quizId);
                      
                      return (
                        <div
                          key={quiz.title}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${
                            quiz.title === lessonId 
                              ? 'bg-purple-50 border-l-purple-500' 
                              : isQuizDone
                              ? 'bg-green-50 border-l-green-500 hover:bg-green-100'
                              : 'border-l-purple-300 hover:bg-purple-50'
                          }`}
                          onClick={() => handleItemClick(quiz.title)}
                        >
                          <div className="flex-shrink-0">
                            {isQuizDone ? (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                quizResult?.passed ? 'bg-green-100' : 'bg-orange-100'
                              }`}>
                                <CheckCircle className={`w-4 h-4 ${
                                  quizResult?.passed ? 'text-green-600' : 'text-orange-600'
                                }`} />
                              </div>
                            ) : (
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                quiz.title === lessonId 
                                  ? 'border-purple-500 bg-purple-500' 
                                  : 'border-purple-300 bg-white'
                              }`}>
                                <ClipboardList className={`w-3 h-3 ${
                                  quiz.title === lessonId ? 'text-white' : 'text-purple-500'
                                }`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-3 h-3 text-purple-500" />
                              <p className={`text-sm font-medium truncate ${
                                quiz.title === lessonId ? 'text-purple-900' : 'text-gray-900'
                              }`}>
                                {quiz.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 flex items-center">
                                {quiz.questions?.length || 0} questions
                              </p>
                              {isQuizDone && quizResult && (
                                <Badge variant={quizResult.passed ? "default" : "secondary"} className="text-xs h-4 px-1">
                                  {quizResult.passed ? '✓ Réussi' : '○ À revoir'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                <span className="text-sm font-medium">{currentItem.title}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  {itemIndex + 1}/{totalItems} contenus
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
                      {contentType === 'quiz' && '📝 quiz'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentItem.duration}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-3">{currentItem.title}</h1>
                  {currentItem.description && (
                    <div 
                      className="text-gray-600 text-lg"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentItem.description) }}
                    />
                  )}
                </div>

                {/* Contenu de la leçon */}
                <Card className="mb-6">
                  <CardContent className="p-0">
                    {contentType === 'quiz' ? (
                      <div className="p-6">
                        <QuizViewer 
                          quiz={currentItem as QuizConfig} 
                          onComplete={handleQuizComplete}
                        />
                      </div>
                    ) : (
                      <>
                        {contentType === 'video' && (
                          <VideoPlayer
                            videoKey={currentItem.video_key || currentItem.key}
                            videoUrl={currentItem.video_url}
                            title={currentItem.title}
                          />
                        )}
                        {contentType === 'pdf' && (
                          <PDFViewer
                            pdfKey={currentItem.pdf_key}
                            title={currentItem.title}
                            height="600px"
                          />
                        )}
                        {contentType === 'image' && (
                          <ImageDisplay imageKey={currentItem.image_key} title={currentItem.title} />
                        )}
                      </>
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
                        {currentItem.description && (
                          <div 
                            className="text-gray-700 mb-4"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentItem.description) }}
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
                        {currentItem.transcription ? (
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                              {currentItem.transcription}
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
                    {previousItem && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleItemClick(previousItem.title)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Contenu précédent
                      </Button>
                    )}
                    {nextItem && (
                      <Button
                        className="w-full justify-start"
                        onClick={() => handleItemClick(nextItem.title)}
                      >
                        Contenu suivant
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Ressources */}
                {currentItem.resources && currentItem.resources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ressources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentItem.resources.map((resource: any, idx: number) => (
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