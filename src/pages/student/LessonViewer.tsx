
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Clock, Star, MessageSquare, Download, ChevronRight, ChevronLeft, Home, User, X, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(true);

  // Données d'exemple pour le cours et les leçons
  const courseData = {
    id: courseId,
    title: "Mathématiques CE2",
    modules: [
      {
        id: "module-1",
        title: "PARTIE 1 - Les nombres et le calcul",
        lessons: [
          { id: "1.1", title: "Les nombres de 0 à 100", duration: "15 min", isCompleted: true },
          { id: "1.2", title: "Addition simple", duration: "20 min", isCompleted: true },
          { id: "1.3", title: "Soustraction simple", duration: "18 min", isCompleted: false, isCurrent: true },
          { id: "1.4", title: "Les tables de multiplication", duration: "25 min", isCompleted: false },
        ]
      },
      {
        id: "module-2", 
        title: "PARTIE 2 - Géométrie",
        lessons: [
          { id: "2.1", title: "Les formes géométriques", duration: "22 min", isCompleted: false },
          { id: "2.2", title: "Les angles", duration: "18 min", isCompleted: false },
        ]
      }
    ]
  };

  // Données d'exemple pour la leçon actuelle
  const lesson = {
    id: lessonId,
    title: "Soustraction simple",
    moduleTitle: "Les nombres et le calcul",
    duration: "18 min",
    type: "video",
    description: "Dans cette leçon, nous allons apprendre à faire des soustractions simples avec des nombres jusqu'à 100.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    transcript: `
Bonjour les enfants ! Aujourd'hui, nous allons apprendre la soustraction.

La soustraction, c'est enlever une quantité à une autre quantité.

Par exemple : 10 - 3 = 7
Cela veut dire que si j'ai 10 bonbons et que j'en mange 3, il m'en reste 7.

Regardons d'autres exemples :
15 - 5 = 10
20 - 8 = 12
25 - 15 = 10
    `,
    resources: [
      { name: "Fiche d'exercices - La soustraction", url: "#", type: "pdf" },
      { name: "Jeu interactif - Soustractions", url: "#", type: "game" }
    ],
    nextLesson: {
      id: "1.4",
      title: "Les tables de multiplication",
      duration: "25 min"
    },
    course: {
      title: "Mathématiques CE2",
      totalLessons: 6,
      currentLessonIndex: 3,
      instructor: {
        name: "Marie Dupont",
        role: "Professeure de Mathématiques"
      }
    }
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  const handleNextLesson = () => {
    if (lesson.nextLesson) {
      navigate(`/dashboard/etudiant/courses/${courseId}/lessons/${lesson.nextLesson.id}`);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/dashboard/etudiant/courses/${courseId}/lessons/${lessonId}`);
  };

  const progressPercentage = Math.round((lesson.course.currentLessonIndex / lesson.course.totalLessons) * 100);

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
              {courseData.modules.map((module, moduleIndex) => (
                <div key={module.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                    {module.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {module.lessons.map((lessonItem, index) => (
                      <div
                        key={lessonItem.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          lessonItem.isCurrent 
                            ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleLessonClick(lessonItem.id)}
                      >
                        <div className="flex-shrink-0">
                          {lessonItem.isCompleted ? (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                              lessonItem.isCurrent 
                                ? 'border-blue-500 bg-blue-500 text-white' 
                                : 'border-gray-300 text-gray-500'
                            }`}>
                              {moduleIndex + 1}.{index + 1}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            lessonItem.isCurrent ? 'text-blue-900' : 'text-gray-900'
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
                  onClick={() => navigate(`/dashboard/etudiant/courses/${courseId}`)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {lesson.course.title}
                </Button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{lesson.title}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  {lesson.course.currentLessonIndex}/{lesson.course.totalLessons} leçons
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
                {/* En-tête de la leçon avec module en premier */}
                <div className="mb-6">
                  {/* Module title en premier */}
                  <div className="mb-3">
                    <Badge variant="outline" className="text-base px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                      📚 {lesson.moduleTitle}
                    </Badge>
                  </div>
                  
                  {/* Lesson details */}
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">{lesson.type === 'video' ? '🎥' : '📄'} {lesson.type}</Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration}
                    </div>
                  </div>
                  
                  {/* Lesson title */}
                  <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
                  <p className="text-gray-600 text-lg">{lesson.description}</p>
                </div>

                {/* Lecteur vidéo */}
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full"
                        poster="https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&h=450&fit=crop"
                      >
                        <source src={lesson.videoUrl} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                    </div>
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
                        <p className="text-gray-700 mb-4">{lesson.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold">Objectifs d'apprentissage :</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Comprendre le concept de soustraction</li>
                            <li>Effectuer des soustractions simples</li>
                            <li>Résoudre des problèmes pratiques avec la soustraction</li>
                          </ul>
                        </div>
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
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                            {lesson.transcript}
                          </pre>
                        </div>
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
                        <CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {lesson.course.instructor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{lesson.course.instructor.name} - {lesson.course.instructor.role}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                              <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
                              <User className="w-6 h-6 absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-gray-400" />
                            </div>
                          </div>
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
                      <div className="flex justify-between text-sm">
                        <span>Cours complété</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      
                      {!isCompleted ? (
                        <Button 
                          onClick={handleMarkComplete}
                          className="w-full"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marquer comme terminé
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-700 font-medium">Leçon terminée</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Formateur */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Votre formateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {lesson.course.instructor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lesson.course.instructor.name}</p>
                        <p className="text-sm text-gray-600">{lesson.course.instructor.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter le formateur
                    </Button>
                  </CardContent>
                </Card>

                {/* Leçon suivante */}
                {lesson.nextLesson && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Leçon suivante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">{lesson.nextLesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.nextLesson.duration}</p>
                        </div>
                        <Button 
                          onClick={handleNextLesson}
                          className="w-full"
                          variant="outline"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Leçon suivante
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ressources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ressources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lesson.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              {resource.type === 'pdf' ? '📄' : '🎮'}
                            </div>
                            <span className="text-sm font-medium">{resource.name}</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate(`/dashboard/etudiant/courses/${courseId}`)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour au cours
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
