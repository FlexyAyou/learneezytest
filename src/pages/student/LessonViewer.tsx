
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Clock, Star, MessageSquare, Download, ChevronRight, ChevronLeft, Home } from 'lucide-react';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  // Données d'exemple pour la leçon
  const lesson = {
    id: lessonId,
    title: "Les nombres de 0 à 100",
    moduleTitle: "Les nombres et le calcul",
    duration: "15 min",
    type: "video",
    description: "Dans cette leçon, nous allons apprendre à compter et reconnaître les nombres de 0 à 100.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    transcript: `
Bonjour les enfants ! Aujourd'hui, nous allons apprendre les nombres de 0 à 100.

Commençons par les nombres de 0 à 10 :
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

Ces nombres sont très importants car ils forment la base de tous les autres nombres.

Maintenant, regardons les dizaines :
10, 20, 30, 40, 50, 60, 70, 80, 90, 100

Pouvez-vous voir le pattern ? Chaque dizaine se termine par 0 !
    `,
    resources: [
      { name: "Fiche d'exercices - Les nombres", url: "#", type: "pdf" },
      { name: "Jeu interactif - Compter jusqu'à 100", url: "#", type: "game" }
    ],
    nextLesson: {
      id: "1.2",
      title: "Addition simple",
      duration: "20 min"
    },
    course: {
      title: "Mathématiques CE2",
      totalLessons: 7,
      currentLessonIndex: 1
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

  const progressPercentage = Math.round((lesson.course.currentLessonIndex / lesson.course.totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* En-tête de la leçon */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">{lesson.type === 'video' ? '🎥' : '📄'} {lesson.type}</Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {lesson.duration}
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="text-sm text-gray-500">
                Module : {lesson.moduleTitle}
              </div>
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
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
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
                        <li>Reconnaître et nommer les nombres de 0 à 100</li>
                        <li>Comprendre la suite numérique</li>
                        <li>Identifier les patterns dans les nombres</li>
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
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>Posez vos questions et échangez avec les autres étudiants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                      <p>Aucune discussion pour le moment.</p>
                      <p className="text-sm">Soyez le premier à poser une question !</p>
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
  );
};

export default LessonViewer;
