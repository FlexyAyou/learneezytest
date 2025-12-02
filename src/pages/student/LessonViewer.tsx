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
<<<<<<< HEAD
import { QuizViewer } from '@/components/student/QuizViewer';
import { AssignmentModal } from '@/components/student/AssignmentModal';
=======
import ImageDisplay from '@/components/common/ImageDisplay';
import StudentQuiz from '@/components/quiz/StudentQuiz';
>>>>>>> d75982adc362612c12764cd2ff71327e741e55e8
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
  const [currentAssignment, setCurrentAssignment] = useState<any | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

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

      // Add assignment if present or declared in order
      const hasAssignmentInOrder = module.order?.some((o: any) => o.type === 'assignment');
      if (module.assignment || hasAssignmentInOrder) {
        const assignmentItem = module.assignment
          ? { ...module.assignment, module, type: 'assignment', id: `${module.id}-assignment` }
          : { id: `${module.id}-assignment`, title: 'Devoir du module', module, type: 'assignment' };

        items.push(assignmentItem);
        if ((assignmentItem.title || '') === lessonId) {
          foundItem = assignmentItem;
          foundModule = module;
          foundIndex = items.length - 1;
          foundType = 'assignment';
        }
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
    console.log('[getContentType] Analyzing item:', {
      title: item?.title,
      type: item?.type,
      pdf_key: item?.pdf_key,
      resource_key: item?.resource_key,
      key: item?.key,
      content_type: item?.content_type,
      video_key: item?.video_key,
      video_url: item?.video_url,
      image_key: item?.image_key,
      image_url: item?.image_url,
    });

    if (item.type === 'quiz') {
      console.log('[getContentType] Result: quiz');
      return 'quiz';
    }
    
    // PDF detection: check content_type first (most reliable)
    if (item.content_type === 'application/pdf' || item.content_type === 'pdf') {
      console.log('[getContentType] Result: pdf (via content_type)');
      return 'pdf';
    }
    
    // PDF detection: check pdf_key, resource_key, or key with PDF-related properties
    if (item.pdf_key || item.resource_key) {
      console.log('[getContentType] Result: pdf (via pdf_key or resource_key)');
      return 'pdf';
    }
    
    if (item.key && (item.content_type?.includes('pdf') || item.content_type?.includes('application'))) {
      console.log('[getContentType] Result: pdf (via key + content_type pattern)');
      return 'pdf';
    }
    
    // Video detection: check video_key, video_url, or key without PDF content_type
    if (item.video_key || item.video_url) {
      console.log('[getContentType] Result: video (via video_key or video_url)');
      return 'video';
    }
    
    if (item.key && (!item.content_type || item.content_type.includes('video') || item.content_type.includes('mp4'))) {
      console.log('[getContentType] Result: video (via key as default video)');
      return 'video';
    }
    
    // Image detection
    if (item.image_key || item.image_url) {
      console.log('[getContentType] Result: image');
      return 'image';
    }
    
    if (item.key && item.content_type?.includes('image')) {
      console.log('[getContentType] Result: image (via key + content_type)');
      return 'image';
    }
    
    console.log('[getContentType] Result: text (default)');
    return 'text';
  };

  const contentType = getContentType(currentItem);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Table des matières */}
      {showTableOfContents && (
        <div className="w-80 bg-gradient-to-br from-background to-infinitia-pink-50/30 border-r border-infinitia-pink-100 flex flex-col shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-infinitia-pink-100 bg-gradient-to-r from-infinitia-pink-500 to-infinitia-orange-500">
            <h2 className="font-semibold text-lg text-white">Table des matières</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTableOfContents(false)}
              className="p-1 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4">
              {course.modules.map((module: any, moduleIndex: number) => (
                <div key={module.title} className="mb-6">
                  <h3 className="text-sm font-bold bg-gradient-to-r from-infinitia-pink-600 to-infinitia-orange-600 bg-clip-text text-transparent uppercase tracking-wide mb-3">
                    MODULE {moduleIndex + 1}
                  </h3>
                  
                  <div className="space-y-2">
                    {/* Lessons */}
                    {module.content.map((lessonItem: any, index: number) => (
                      <div
                        key={lessonItem.title}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          lessonItem.title === lessonId 
                            ? 'bg-gradient-to-r from-infinitia-pink-50 to-infinitia-orange-50 border-l-4 border-l-infinitia-pink-500 shadow-md' 
                            : 'hover:bg-infinitia-pink-50/50 hover:shadow-sm'
                        }`}
                        onClick={() => handleItemClick(lessonItem.title)}
                      >
                        <div className="flex-shrink-0">
                          {isLessonCompleted(lessonItem.title) ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-sm ${
                              lessonItem.title === lessonId 
                                ? 'border-infinitia-pink-500 bg-gradient-to-br from-infinitia-pink-500 to-infinitia-orange-500 text-white' 
                                : 'border-gray-300 bg-white text-gray-600'
                            }`}>
                              {moduleIndex + 1}.{index + 1}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {lessonItem.video_key && <Video className="w-3 h-3 text-infinitia-pink-500" />}
                            {lessonItem.pdf_key && <FileText className="w-3 h-3 text-infinitia-orange-500" />}
                            {lessonItem.image_key && <ImageIcon className="w-3 h-3 text-infinitia-pink-600" />}
                            <p className={`text-sm font-semibold truncate ${
                              lessonItem.title === lessonId ? 'text-infinitia-pink-900' : 'text-gray-900'
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
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${
                            quiz.title === lessonId 
                              ? 'bg-gradient-to-r from-infinitia-orange-50 to-infinitia-pink-50 border-l-infinitia-orange-500 shadow-md' 
                              : isQuizDone
                              ? 'bg-green-50 border-l-green-500 hover:bg-green-100 hover:shadow-sm'
                              : 'border-l-infinitia-orange-300 hover:bg-infinitia-orange-50/50 hover:shadow-sm'
                          }`}
                          onClick={() => handleItemClick(quiz.title)}
                        >
                          <div className="flex-shrink-0">
                            {isQuizDone ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                                quizResult?.passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-orange-400 to-amber-500'
                              }`}>
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm ${
                                quiz.title === lessonId 
                                  ? 'border-infinitia-orange-500 bg-gradient-to-br from-infinitia-orange-500 to-infinitia-pink-500' 
                                  : 'border-infinitia-orange-300 bg-white'
                              }`}>
                                <ClipboardList className={`w-4 h-4 ${
                                  quiz.title === lessonId ? 'text-white' : 'text-infinitia-orange-500'
                                }`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-3 h-3 text-infinitia-orange-500" />
                              <p className={`text-sm font-semibold truncate ${
                                quiz.title === lessonId ? 'text-infinitia-orange-900' : 'text-gray-900'
                              }`}>
                                {quiz.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 flex items-center">
                                {quiz.questions?.length || 0} questions
                              </p>
                              {isQuizDone && quizResult && (
                                <Badge variant={quizResult.passed ? "default" : "secondary"} className="text-xs h-5 px-2 font-semibold">
                                  {quizResult.passed ? '✓ Réussi' : '○ À revoir'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Assignments (module-level) */}
                    {((module.assignment) || module.order?.some((o:any)=>o.type==='assignment')) && (
                      <div
                        key={`assignment-${module.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${{}.toString()}`}
                        onClick={() => handleItemClick(module.assignment?.title || `Devoir du module ${module.title}`)}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm ${module.assignment ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'}`}>
                            <ClipboardList className={`w-4 h-4 ${module.assignment ? 'text-yellow-600' : 'text-gray-400'}`} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="w-3 h-3 text-yellow-500" />
                            <p className={`text-sm font-semibold truncate ${module.assignment?.title === lessonId ? 'text-yellow-900' : 'text-gray-900'}`}>
                              {module.assignment?.title || 'Devoir du module'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500 flex items-center">
                              {module.assignment?.questions?.length ?? '–'} questions
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                    {itemType === 'quiz' ? (
                      <div className="p-6">
                        <StudentQuiz
                          quiz={currentItem}
                          onComplete={handleQuizComplete}
                        />
                      </div>
                    ) : itemType === 'assignment' ? (
                      <div className="p-6">
                        {/* Render assignment inline using QuizViewer so questions appear like quizzes */}
                        {(() => {
                          const assignmentQuiz: QuizConfig = {
                            id: currentItem.id || `${currentModule.id}-assignment`,
                            title: currentItem.title || 'Devoir',
                            questions: currentItem.questions || [],
                            settings: {
                              timeLimit: currentItem.time_limit || currentItem.settings?.timeLimit,
                              passingScore: currentItem.passing_score || currentItem.settings?.passingScore || 70,
                            },
                          } as unknown as QuizConfig;

                          const handleAssignmentComplete = (score: number, passed: boolean, answers?: any[]) => {
                            const assignmentId = assignmentQuiz.id;
                            markQuizComplete(assignmentId, score, passed);
                            toast({
                              title: passed ? '✅ Devoir réussi' : '📝 Devoir terminé',
                              description: `Score: ${score}`,
                              variant: passed ? 'default' : 'destructive',
                            });
                          };

                          return (
                            <QuizViewer quiz={assignmentQuiz} onComplete={handleAssignmentComplete} />
                          );
                        })()}
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
                          <div className="bg-gray-50 p-4">
                            <PDFViewer
                              pdfKey={currentItem.pdf_key || currentItem.resource_key || currentItem.key}
                              pdfUrl={currentItem.pdf_url}
                              title={currentItem.title}
                              height="800px"
                              showDownload={true}
                            />
                          </div>
                        )}
                        {contentType === 'image' && (
                          <ImageDisplay 
                            imageKey={currentItem.image_key}
                            imageUrl={currentItem.image_url}
                            title={currentItem.title}
                            height="800px"
                            downloadable={true}
                          />
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {currentAssignment && (
                  <AssignmentModal
                    open={isAssignmentModalOpen}
                    onOpenChange={(open) => {
                      setIsAssignmentModalOpen(open);
                      if (!open) setCurrentAssignment(null);
                    }}
                    assignment={currentAssignment}
                    courseId={courseId!}
                    moduleId={currentModule?.id}
                    onComplete={(result) => {
                      setIsAssignmentModalOpen(false);
                      // Optionally: mark lesson/assignment as completed in progress hook
                    }}
                  />
                )}

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

<<<<<<< HEAD
// Render AssignmentModal at root so it can be opened from lesson page
const _withAssignmentModal = () => null;

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

=======
>>>>>>> d75982adc362612c12764cd2ff71327e741e55e8
export default LessonViewer;