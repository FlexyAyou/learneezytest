
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, Settings, RotateCcw, SkipForward, CheckCircle, BookOpen, MessageCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);
  const [isCompleted, setIsCompleted] = useState(false);

  // Données d'exemple pour la leçon
  const lesson = {
    id: lessonId,
    title: "Les nombres de 0 à 100",
    description: "Dans cette leçon, nous allons apprendre à reconnaître et compter les nombres de 0 à 100. Vous découvrirez les règles de numération et les techniques pour bien mémoriser ces nombres.",
    duration: "15 min",
    videoUrl: "https://example.com/video.mp4",
    course: {
      id: courseId,
      title: "Mathématiques CE2",
      instructor: "Marie Dubois"
    },
    transcript: `Bonjour et bienvenue dans cette leçon sur les nombres de 0 à 100.

Aujourd'hui, nous allons découvrir ensemble comment bien reconnaître et utiliser les nombres jusqu'à 100.

Commençons par les nombres de 0 à 10 que vous connaissez déjà...

Les nombres de 11 à 20 suivent une règle particulière...

Puis nous verrons les dizaines : 20, 30, 40, 50, 60, 70, 80, 90, 100.`,
    resources: [
      { id: 1, name: "Fiche d'exercices - Nombres 0-100", type: "pdf", size: "2.1 MB" },
      { id: 2, name: "Tableau des nombres", type: "pdf", size: "1.5 MB" },
      { id: 3, name: "Jeux de numération", type: "zip", size: "3.2 MB" }
    ],
    keyPoints: [
      "Reconnaître les nombres de 0 à 100",
      "Comprendre la notion de dizaines et d'unités", 
      "Savoir compter de 1 en 1 et de 10 en 10",
      "Utiliser les nombres dans des situations concrètes"
    ],
    nextLesson: {
      id: "1.2", 
      title: "Addition simple"
    },
    prevLesson: null
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const markAsCompleted = () => {
    setIsCompleted(true);
    // Navigation vers la leçon suivante ou retour au cours
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/dashboard/etudiant/courses/${courseId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {lesson.course.title}
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-medium">{lesson.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">{lesson.duration}</div>
              <Progress value={videoProgress} className="w-24 h-2" />
              <div className="text-sm text-gray-600">{videoProgress}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lecteur vidéo */}
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 aspect-video rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div 
                      className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-opacity-30 transition-all"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 ml-0" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </div>
                    <p className="text-lg font-medium">{lesson.title}</p>
                  </div>
                </div>
                
                {/* Contrôles vidéo */}
                <div className="bg-gray-900 p-4 rounded-b-lg">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:bg-gray-800"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm">3:45 / {lesson.duration}</span>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contenu de la leçon */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="transcript">Transcription</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      À propos de cette leçon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{lesson.description}</p>
                    
                    <h3 className="font-semibold mb-4">Points clés de la leçon :</h3>
                    <div className="grid gap-3">
                      {lesson.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcription de la vidéo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {lesson.transcript}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Poser une question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        Vous avez des questions sur cette leçon ? N'hésitez pas à les poser à votre formateur !
                      </p>
                    </div>
                    <div className="space-y-4">
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Posez votre question ici..."
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Envoyer ma question
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
                <CardTitle className="text-lg">Votre progression</CardTitle>
              </CardHeader>
              <CardContent>
                {!isCompleted ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">{videoProgress}%</div>
                      <Progress value={videoProgress} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2">Progression de la vidéo</p>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={markAsCompleted}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme terminé
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Leçon terminée !</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Complété</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            {lesson.nextLesson && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leçon suivante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium mb-1">{lesson.nextLesson.title}</h4>
                    <Button 
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(`/dashboard/etudiant/courses/${courseId}/lessons/${lesson.nextLesson.id}`)}
                    >
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
                  {lesson.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{resource.name}</p>
                          <p className="text-xs text-gray-500">{resource.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
