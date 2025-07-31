import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, Lock, Book, Clock, Star, Users, Award } from 'lucide-react';

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<string[]>(['1.1', '1.2', '2.1']);

  // Données d'exemple pour le cours
  const course = {
    id: 1,
    title: "Mathématiques CE2",
    instructor: "Marie Dubois",
    description: "Ce cours de mathématiques pour CE2 couvre les concepts fondamentaux incluant les nombres, les opérations, la géométrie et la résolution de problèmes. Conçu pour développer progressivement les compétences mathématiques des élèves.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    progress: 45,
    rating: 4.8,
    studentsCount: 1250,
    duration: "8h 30min",
    level: "CE2",
    objectives: [
      "Maîtriser les nombres jusqu'à 1000",
      "Effectuer des additions et soustractions",
      "Comprendre les bases de la multiplication",
      "Reconnaître les formes géométriques",
      "Résoudre des problèmes simples"
    ],
    modules: [
      {
        id: '1',
        title: 'Les nombres et le calcul',
        description: 'Introduction aux nombres et aux opérations de base',
        lessons: [
          {
            id: '1.1',
            title: 'Les nombres de 0 à 100',
            duration: '15 min',
            type: 'video',
            description: 'Apprendre à compter et reconnaître les nombres'
          },
          {
            id: '1.2',
            title: 'Addition simple',
            duration: '20 min',
            type: 'video',
            description: 'Les bases de l\'addition'
          },
          {
            id: '1.3',
            title: 'Soustraction simple',
            duration: '20 min',
            type: 'video',
            description: 'Les bases de la soustraction'
          }
        ]
      },
      {
        id: '2',
        title: 'Géométrie de base',
        description: 'Découverte des formes et de l\'espace',
        lessons: [
          {
            id: '2.1',
            title: 'Les formes géométriques',
            duration: '25 min',
            type: 'interactive',
            description: 'Reconnaître triangles, carrés, cercles'
          },
          {
            id: '2.2',
            title: 'Mesures et comparaisons',
            duration: '30 min',
            type: 'exercise',
            description: 'Comparer les tailles et distances'
          }
        ]
      },
      {
        id: '3',
        title: 'Résolution de problèmes',
        description: 'Application pratique des concepts',
        lessons: [
          {
            id: '3.1',
            title: 'Problèmes d\'addition',
            duration: '25 min',
            type: 'exercise',
            description: 'Résoudre des situations concrètes'
          },
          {
            id: '3.2',
            title: 'Problèmes de géométrie',
            duration: '30 min',
            type: 'exercise',
            description: 'Applications géométriques'
          }
        ]
      }
    ]
  };

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);
  
  const isLessonAvailable = (moduleIndex: number, lessonIndex: number) => {
    if (moduleIndex === 0 && lessonIndex === 0) return true;
    
    // Vérifier si la leçon précédente est terminée
    if (lessonIndex > 0) {
      const previousLesson = course.modules[moduleIndex].lessons[lessonIndex - 1];
      return isLessonCompleted(previousLesson.id);
    }
    
    // Pour les modules suivants, vérifier si le module précédent est terminé
    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      return previousModule.lessons.every(lesson => isLessonCompleted(lesson.id));
    }
    
    return false;
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'interactive': return '🎮';
      case 'exercise': return '📝';
      default: return '📄';
    }
  };

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard/etudiant/courses')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux cours
        </Button>
      </div>

      {/* En-tête du cours */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg opacity-90">par {course.instructor}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.studentsCount} étudiants</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <Badge variant="secondary">{course.level}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Votre progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression du cours</span>
              <span>{completedCount}/{totalLessons} leçons terminées</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-gray-600">{progressPercentage}% complété</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Module {moduleIndex + 1}: {module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isAvailable = isLessonAvailable(moduleIndex, lessonIndex);
                        
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 border rounded-lg ${
                              isCompleted ? 'bg-green-50 border-green-200' :
                              isAvailable ? 'hover:bg-gray-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : isAvailable ? (
                                <Play className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Lock className="w-5 h-5 text-gray-400" />
                              )}
                              <div>
                                <p className={`font-medium ${!isAvailable ? 'text-gray-400' : ''}`}>
                                  {getTypeIcon(lesson.type)} {lesson.title}
                                </p>
                                <p className={`text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {lesson.description} • {lesson.duration}
                                </p>
                              </div>
                            </div>
                            
                            {isAvailable && (
                              <Button
                                size="sm"
                                variant={isCompleted ? "outline" : "default"}
                                onClick={() => {
                                  if (!isCompleted) {
                                    markLessonComplete(lesson.id);
                                  }
                                }}
                              >
                                {isCompleted ? 'Revoir' : 'Commencer'}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description du cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{course.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs d'apprentissage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ressources téléchargeables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Book className="w-5 h-5 text-blue-600" />
                        <span>Guide du cours Mathématiques CE2.pdf</span>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Book className="w-5 h-5 text-blue-600" />
                        <span>Exercices supplémentaires.pdf</span>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Continuer le cours
              </Button>
              <Button variant="outline" className="w-full">
                Télécharger les ressources
              </Button>
              <Button variant="outline" className="w-full">
                Poser une question
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Niveau</span>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Durée totale</span>
                <span className="text-sm font-medium">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Modules</span>
                <span className="text-sm font-medium">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Leçons</span>
                <span className="text-sm font-medium">{totalLessons}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;