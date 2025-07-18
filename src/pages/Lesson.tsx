
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings, ChevronLeft, ChevronRight, CheckCircle, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Lesson = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonData = {
    id: 1,
    title: "Introduction aux composants React",
    description: "Apprenez les bases des composants React et comment les créer",
    duration: "15:30",
    videoUrl: "https://example.com/video.mp4",
    course: {
      id: 1,
      title: "Maîtrise complète de React.js",
      totalLessons: 9
    },
    resources: [
      { id: 1, title: "Notes de cours.pdf", size: "2.5 MB" },
      { id: 2, title: "Code source.zip", size: "1.2 MB" },
      { id: 3, title: "Exercices pratiques.pdf", size: "800 KB" }
    ],
    nextLesson: {
      id: 2,
      title: "Passer des props aux composants"
    },
    prevLesson: {
      id: 0,
      title: "Qu'est-ce que React?"
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const markAsCompleted = () => {
    setIsCompleted(true);
    setProgress(100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to={`/cours/${lessonData.course.id}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour au cours
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{lessonData.title}</h1>
                <p className="text-sm text-gray-600">{lessonData.course.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lecteur vidéo principal */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Zone vidéo simulée */}
                <div className="relative bg-black aspect-video rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </div>
                    <p className="text-lg">{lessonData.title}</p>
                    <p className="text-sm text-gray-300">Durée: {lessonData.duration}</p>
                  </div>
                </div>
                
                {/* Contrôles vidéo */}
                <div className="p-4 bg-gray-900 rounded-b-lg">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={togglePlay}
                        className="text-white hover:bg-gray-800"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">5:30 / {lessonData.duration}</span>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets de contenu */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="transcript">Transcription</TabsTrigger>
                <TabsTrigger value="notes">Mes notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de cette leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{lessonData.description}</p>
                    <h3 className="font-semibold mb-3">Points clés :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Comprendre la structure d'un composant React
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Créer votre premier composant fonctionnel
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Utiliser JSX pour le rendu
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcription de la vidéo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700">
                        Bonjour et bienvenue dans cette leçon sur les composants React. 
                        Aujourd'hui, nous allons apprendre les bases des composants et comment ils fonctionnent...
                      </p>
                      <p className="text-gray-700">
                        Un composant React est essentiellement une fonction JavaScript qui retourne du JSX...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes notes personnelles</CardTitle>
                    <CardDescription>Ajoutez vos notes pour cette leçon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea 
                      className="w-full h-40 p-3 border rounded-lg resize-none"
                      placeholder="Ajoutez vos notes ici..."
                    />
                    <Button className="mt-3 bg-pink-600 hover:bg-pink-700">
                      Sauvegarder les notes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isCompleted ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={markAsCompleted}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marquer comme terminé
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Leçon terminée !</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lessonData.prevLesson && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/lesson/${lessonData.prevLesson.id}`}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Leçon précédente
                    </Link>
                  </Button>
                )}
                {lessonData.nextLesson && (
                  <Button className="w-full justify-start bg-pink-600 hover:bg-pink-700" asChild>
                    <Link to={`/lesson/${lessonData.nextLesson.id}`}>
                      Leçon suivante
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Ressources */}
            <Card>
              <CardHeader>
                <CardTitle>Ressources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessonData.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{resource.title}</p>
                          <p className="text-xs text-gray-500">{resource.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
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

export default Lesson;
