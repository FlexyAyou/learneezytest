
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, Clock, Target, Users, Star, Eye, AlertTriangle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CourseReviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Mock data pour le cours (en attendant l'API)
  const course = {
    id: courseId,
    title: courseId === '3' ? 'Informatique 1ère - Bases de la Programmation' : 'Arts Plastiques CE1',
    instructor: courseId === '3' ? 'Alex Dupont' : 'Clara Roussel',
    category: courseId === '3' ? 'TechnoEdu' : 'Atelier Créatif',
    level: courseId === '3' ? 'Lycée - 1ère' : 'Primaire - CE1',
    price: 0,
    duration: courseId === '3' ? '20h' : '10h',
    createdAt: courseId === '3' ? '2024-03-15' : '2024-03-20',
    status: 'en_attente',
    description: courseId === '3' 
      ? 'Introduction complète aux bases de la programmation pour les élèves de première. Ce cours couvre les concepts fondamentaux de l\'algorithmique et de la programmation avec Python.'
      : 'Cours d\'arts plastiques créatif pour les élèves de CE1. Exploration de différentes techniques artistiques et développement de la créativité.',
    objectives: courseId === '3' 
      ? [
          'Comprendre les concepts de base de l\'algorithmique',
          'Maîtriser les structures de contrôle en Python',
          'Savoir créer des fonctions simples',
          'Résoudre des problèmes par la programmation'
        ]
      : [
          'Découvrir différentes techniques artistiques',
          'Développer sa créativité et son imagination',
          'Apprendre à observer et reproduire',
          'Exprimer ses émotions par l\'art'
        ],
    prerequisites: courseId === '3' 
      ? [
          'Notions de base en mathématiques',
          'Capacité de raisonnement logique'
        ]
      : [
          'Aucun prérequis nécessaire',
          'Curiosité et envie de créer'
        ],
    modules: courseId === '3' 
      ? [
          {
            id: '1',
            title: 'Introduction à l\'algorithmique',
            duration: 300,
            lessons: [
              { id: '1-1', title: 'Qu\'est-ce qu\'un algorithme ?', duration: 45, type: 'video' },
              { id: '1-2', title: 'Les structures de base', duration: 60, type: 'video' },
              { id: '1-3', title: 'Exercices pratiques', duration: 30, type: 'exercise' }
            ]
          },
          {
            id: '2',
            title: 'Premiers pas en Python',
            duration: 360,
            lessons: [
              { id: '2-1', title: 'Installation et prise en main', duration: 45, type: 'video' },
              { id: '2-2', title: 'Variables et types de données', duration: 60, type: 'video' },
              { id: '2-3', title: 'TP : Premier programme', duration: 45, type: 'exercise' }
            ]
          }
        ]
      : [
          {
            id: '1',
            title: 'Découverte des couleurs',
            duration: 180,
            lessons: [
              { id: '1-1', title: 'Les couleurs primaires', duration: 30, type: 'video' },
              { id: '1-2', title: 'Mélanger les couleurs', duration: 45, type: 'activity' },
              { id: '1-3', title: 'Mon premier tableau', duration: 60, type: 'exercise' }
            ]
          },
          {
            id: '2',
            title: 'Techniques de dessin',
            duration: 240,
            lessons: [
              { id: '2-1', title: 'Le trait et la forme', duration: 40, type: 'video' },
              { id: '2-2', title: 'Ombres et lumières', duration: 50, type: 'video' },
              { id: '2-3', title: 'Création libre', duration: 90, type: 'exercise' }
            ]
          }
        ],
    thumbnail: courseId === '3' 
      ? 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      : 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    estimatedDuration: courseId === '3' ? 1200 : 600, // en minutes
    targetAudience: courseId === '3' ? 'Élèves de première' : 'Élèves de CE1',
    difficultyLevel: courseId === '3' ? 'Intermédiaire' : 'Débutant'
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cours non trouvé</h1>
          <p className="text-gray-600 mb-4">Le cours demandé n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate('/dashboard/superadmin/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalExercises = course.modules.reduce((acc, mod) => 
    acc + mod.lessons.reduce((lesAcc, les) => lesAcc + (les.type === 'exercise' ? 1 : 0), 0), 0
  );

  const handleApproveCourse = () => {
    toast({
      title: "Cours approuvé",
      description: `Le cours "${course.title}" a été approuvé et publié avec succès.`,
    });
    navigate('/dashboard/superadmin/courses');
  };

  const handleRejectCourse = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Raison requise",
        description: "Veuillez fournir une raison pour le rejet du cours.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Cours rejeté",
      description: `Le cours "${course.title}" a été rejeté avec commentaires.`,
      variant: "destructive"
    });
    navigate('/dashboard/superadmin/courses');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'exercise':
        return <Target className="h-4 w-4 text-green-600" />;
      case 'activity':
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/superadmin/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review du cours</h1>
            <p className="text-gray-600">Examinez le contenu avant approbation</p>
          </div>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">En attente de validation</Badge>
      </div>

      {/* Course Overview */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-24 h-16 rounded-lg object-cover"
              />
              <div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-base mb-3">
                  {course.description}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Par {course.instructor}</span>
                  <span>•</span>
                  <Badge variant="outline">{course.category}</Badge>
                  <span>•</span>
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{course.modules.length}</div>
              <div className="text-sm text-gray-600">Modules</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Leçons</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{totalExercises}</div>
              <div className="text-sm text-gray-600">Exercices</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(course.estimatedDuration / 60)}h{Math.floor((course.estimatedDuration % 60))}m
              </div>
              <div className="text-sm text-gray-600">Durée totale</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Objectifs pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prérequis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{prerequisite}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Structure du cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <Badge variant="outline">
                        {Math.floor(module.duration / 60)}h{Math.floor((module.duration % 60))}m
                      </Badge>
                    </div>
                    <div className="space-y-3 ml-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(lesson.type)}
                            <span className="font-medium">
                              {lessonIndex + 1}. {lesson.title}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={
                                lesson.type === 'video' ? 'border-blue-200 text-blue-700' :
                                lesson.type === 'exercise' ? 'border-green-200 text-green-700' :
                                'border-purple-200 text-purple-700'
                              }
                            >
                              {lesson.type === 'video' ? 'Vidéo' : 
                               lesson.type === 'exercise' ? 'Exercice' : 'Activité'}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration}min</span>
                        </div>
                      ))}
                    </div>
                    {moduleIndex < course.modules.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Course Info & Actions */}
        <div className="space-y-6">
          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Public cible</label>
                <p className="text-gray-600">{course.targetAudience}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Niveau de difficulté</label>
                <p className="text-gray-600">{course.difficultyLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Durée estimée</label>
                <p className="text-gray-600">{course.duration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Prix</label>
                <p className="text-gray-600">{course.price === 0 ? 'Gratuit' : `${course.price}€`}</p>
              </div>
            </CardContent>
          </Card>

          {/* Validation Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions de validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showRejectionForm ? (
                <div className="space-y-3">
                  <Button 
                    onClick={handleApproveCourse}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approuver le cours
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectionForm(true)}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter le cours
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Raison du rejet *
                    </label>
                    <Textarea
                      placeholder="Expliquez pourquoi ce cours ne peut pas être approuvé..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleRejectCourse}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!rejectionReason.trim()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirmer le rejet
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowRejectionForm(false);
                        setRejectionReason('');
                      }}
                      className="w-full"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quality Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Évaluation qualité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contenu pédagogique</span>
                  <span className="font-semibold text-green-600">9.2/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Structure du cours</span>
                  <span className="font-semibold text-blue-600">8.8/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Adaptation au niveau</span>
                  <span className="font-semibold text-purple-600">9.1/10</span>
                </div>
                <Separator />
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Le cours respecte les standards pédagogiques et peut être approuvé.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewPage;
