
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Users, Star, ChevronRight, CheckCircle, Lock, Download, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CourseDetailStudent = () => {
  const { id } = useParams();
  const [enrollmentProgress, setEnrollmentProgress] = useState(65);

  const courseData = {
    id: 1,
    title: "Maîtrise complète de React.js",
    instructor: "Marie Dubois",
    rating: 4.8,
    students: 1250,
    duration: "12 heures",
    level: "Intermédiaire",
    description: "Apprenez React.js de A à Z avec des projets pratiques et des exercices hands-on.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    price: 89,
    isEnrolled: true,
    modules: [
      {
        id: 1,
        title: "Introduction à React",
        lessons: [
          { id: 1, title: "Qu'est-ce que React?", duration: "10 min", completed: true },
          { id: 2, title: "Installation et configuration", duration: "15 min", completed: true },
          { id: 3, title: "Premier composant", duration: "20 min", completed: true }
        ]
      },
      {
        id: 2,
        title: "Composants et Props",
        lessons: [
          { id: 4, title: "Créer des composants", duration: "25 min", completed: true },
          { id: 5, title: "Passer des props", duration: "20 min", completed: false },
          { id: 6, title: "Props vs State", duration: "30 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Hooks et State Management",
        lessons: [
          { id: 7, title: "useState Hook", duration: "25 min", completed: false },
          { id: 8, title: "useEffect Hook", duration: "35 min", completed: false },
          { id: 9, title: "Custom Hooks", duration: "40 min", completed: false }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image */}
      <div className="relative h-64 bg-gradient-to-r from-pink-600 to-purple-600 overflow-hidden">
        <img 
          src={courseData.image} 
          alt={courseData.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-pink-100 text-pink-700">{courseData.level}</Badge>
              <h1 className="text-4xl font-bold text-white mb-4">{courseData.title}</h1>
              <p className="text-xl text-gray-200 mb-4">par {courseData.instructor}</p>
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{courseData.rating}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{courseData.students} étudiants</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{courseData.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progression du cours</CardTitle>
                    <CardDescription>
                      Vous avez complété {enrollmentProgress}% du cours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={enrollmentProgress} className="mb-4" />
                    <p className="text-sm text-gray-600">
                      4 leçons sur 9 terminées
                    </p>
                  </CardContent>
                </Card>

                {/* Modules et leçons */}
                <div className="space-y-4">
                  {courseData.modules.map((module) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-3">
                                {lesson.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                )}
                                <div>
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <p className="text-sm text-gray-500">{lesson.duration}</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={lesson.completed ? "outline" : "default"}
                                className={lesson.completed ? "" : "bg-pink-600 hover:bg-pink-700"}
                                asChild
                              >
                                <Link to={`/lesson/${lesson.id}`}>
                                  <Play className="h-4 w-4 mr-1" />
                                  {lesson.completed ? "Revoir" : "Commencer"}
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de ce cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{courseData.description}</p>
                    <h3 className="font-semibold mb-3">Ce que vous apprendrez :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Les bases de React et JSX
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Gestion du state avec hooks
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Créer des applications React complètes
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis des étudiants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">Jean Martin</span>
                        </div>
                        <p className="text-gray-700">Excellent cours ! Les explications sont claires et les exercices pratiques.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {courseData.isEnrolled ? (
                    <div>
                      <Badge className="mb-4 bg-green-100 text-green-700">Inscrit</Badge>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700" asChild>
                        <Link to="/dashboard/etudiant/courses">
                          <Play className="h-4 w-4 mr-2" />
                          Continuer le cours
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-pink-600 mb-2">€{courseData.price}</div>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
                        S'inscrire maintenant
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger les ressources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Poser une question
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailStudent;
