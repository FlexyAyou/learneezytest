
import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, X, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useCreateCourse } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { Course, Quiz as QuizType } from '@/types/fastapi';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';
import { QuizConfig, DifficultyLevel } from '@/types/quiz';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  quizzes?: QuizType[];
}

interface ModuleData {
  id: string;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

const CreateCourse = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useFastAPIAuth();
  const createCourseMutation = useCreateCourse();
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'débutant',
    image: null as File | null,
  });

  const [modules, setModules] = useState<ModuleData[]>([
    { 
      id: '1', 
      title: '', 
      duration: '', 
      description: '',
      lessons: []
    }
  ]);

  const [showLessonQuizBuilder, setShowLessonQuizBuilder] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [expandedModule, setExpandedModule] = useState<string>('1');

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData(prev => ({ ...prev, image: file }));
    }
  };

  const addModule = () => {
    const newModule: ModuleData = {
      id: `module-${Date.now()}`,
      title: '',
      duration: '',
      description: '',
      lessons: []
    };
    setModules(prev => [...prev, newModule]);
    setExpandedModule(newModule.id);
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, field: keyof ModuleData, value: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, [field]: value } : m
    ));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      duration: '',
      description: '',
      quizzes: []
    };
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l =>
          l.id === lessonId ? { ...l, [field]: value } : l
        )
      } : m
    ));
  };

  const handleSaveLessonQuiz = (quiz: QuizConfig) => {
    if (!showLessonQuizBuilder) return;

    const { moduleId, lessonId } = showLessonQuizBuilder;

    const quizData: QuizType = {
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: 'options' in q ? q.options : [],
        correct_answer: 'correctAnswer' in q ? String(q.correctAnswer) : ''
      }))
    };

    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l =>
          l.id === lessonId ? { ...l, quizzes: [quizData] } : l
        )
      } : m
    ));

    toast({
      title: "Quiz de leçon créé",
      description: "Le quiz a été ajouté à la leçon"
    });

    setShowLessonQuizBuilder(null);
  };

  const handleDeleteLessonQuiz = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l =>
          l.id === lessonId ? { ...l, quizzes: [] } : l
        )
      } : m
    ));

    toast({
      title: "Quiz supprimé",
      description: "Le quiz de leçon a été supprimé"
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon sauvegardé",
      description: "Votre cours a été sauvegardé en tant que brouillon",
    });
  };

  const handlePublish = async () => {
    if (!courseData.title || !courseData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (modules.length === 0 || !modules[0].title) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un module avec un titre",
        variant: "destructive"
      });
      return;
    }

    try {
      // Transformer les données au format attendu par l'API
      const coursePayload: Course = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price ? parseFloat(courseData.price) : undefined,
        category: courseData.category || undefined,
        duration: courseData.duration || undefined,
        level: courseData.level,
        modules: modules
          .filter(m => m.title && m.lessons.length > 0) // Filtrer les modules vides
          .map(m => ({
            title: m.title,
            duration: m.duration || '1h',
            description: m.description,
            content: m.lessons.map(lesson => ({
              title: lesson.title,
              duration: lesson.duration || '30min',
              description: lesson.description || '',
              quizzes: lesson.quizzes && lesson.quizzes.length > 0 ? lesson.quizzes : undefined
            }))
          }))
      };

      await createCourseMutation.mutateAsync(coursePayload);
      navigate('/dashboard/instructeur');
    } catch (error) {
      // L'erreur est déjà gérée par le hook useCreateCourse
      console.error('Erreur lors de la création du cours:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/instructeur')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau cours</h1>
        </div>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du cours *
                </label>
                <Input
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Maîtrisez React de A à Z"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre cours en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€)
                  </label>
                  <Input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={courseData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="development">Développement</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="avancé">Avancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Glissez votre image ici ou cliquez pour sélectionner</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choisir un fichier
                    </Button>
                  </label>
                  {courseData.image && (
                    <p className="text-sm text-green-600 mt-2">
                      {courseData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules du cours */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Modules du cours</CardTitle>
                <Button onClick={addModule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un module
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible value={expandedModule} onValueChange={setExpandedModule}>
                {modules.map((module, moduleIndex) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">
                          {module.title || `Module ${moduleIndex + 1}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeModule(module.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {/* Module fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Titre du module *
                            </label>
                            <Input
                              value={module.title}
                              onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                              placeholder="Ex: Introduction à React"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Durée
                            </label>
                            <Input
                              value={module.duration}
                              onChange={(e) => updateModule(module.id, 'duration', e.target.value)}
                              placeholder="Ex: 2h 30min"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description du module
                          </label>
                          <textarea
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            placeholder="Décrivez le contenu de ce module..."
                          />
                        </div>

                        {/* Lessons */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-900">Leçons</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addLesson(module.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter une leçon
                            </Button>
                          </div>

                          {module.lessons.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Aucune leçon. Cliquez sur "Ajouter une leçon" pour commencer.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {module.lessons.map((lesson) => (
                                <Card key={lesson.id}>
                                  <CardContent className="pt-6">
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-start">
                                        <h5 className="font-medium text-sm">
                                          {lesson.title || 'Nouvelle leçon'}
                                        </h5>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeLesson(module.id, lesson.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Titre de la leçon *
                                          </label>
                                          <Input
                                            value={lesson.title}
                                            onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                            placeholder="Ex: Les composants React"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Durée
                                          </label>
                                          <Input
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                            placeholder="Ex: 30min"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          className="w-full min-h-[60px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                          value={lesson.description}
                                          onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                                          placeholder="Décrivez le contenu de cette leçon..."
                                        />
                                      </div>

                                      {/* Lesson Quiz Section */}
                                      <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                          <h6 className="text-xs font-medium text-gray-700">
                                            Quiz de leçon (optionnel)
                                          </h6>
                                        </div>

                                        {!lesson.quizzes || lesson.quizzes.length === 0 ? (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowLessonQuizBuilder({ moduleId: module.id, lessonId: lesson.id })}
                                            className="w-full"
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Créer un quiz pour cette leçon
                                          </Button>
                                        ) : (
                                          <div className="bg-gray-50 p-3 rounded-md">
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <p className="text-sm font-medium">
                                                  {lesson.quizzes[0].title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {lesson.quizzes[0].questions.length} question(s)
                                                </p>
                                              </div>
                                              <div className="flex gap-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setShowLessonQuizBuilder({ moduleId: module.id, lessonId: lesson.id })}
                                                >
                                                  Modifier
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleDeleteLessonQuiz(module.id, lesson.id)}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder en brouillon
            </Button>
            <Button onClick={handlePublish} className="bg-pink-600 hover:bg-pink-700">
              Publier le cours
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Quiz Builder Modal */}
      <Dialog open={!!showLessonQuizBuilder} onOpenChange={(open) => !open && setShowLessonQuizBuilder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showLessonQuizBuilder && modules.find(m => m.id === showLessonQuizBuilder.moduleId)?.lessons.find(l => l.id === showLessonQuizBuilder.lessonId)?.quizzes?.[0]
                ? "Modifier le quiz de leçon"
                : "Créer un quiz de leçon"}
            </DialogTitle>
          </DialogHeader>
          {showLessonQuizBuilder && (
            <QuizBuilder
              quiz={
                modules
                  .find(m => m.id === showLessonQuizBuilder.moduleId)
                  ?.lessons.find(l => l.id === showLessonQuizBuilder.lessonId)
                  ?.quizzes?.[0]
                  ? {
                      id: 'lesson-quiz',
                      type: 'quiz' as const,
                      title: modules.find(m => m.id === showLessonQuizBuilder.moduleId)!.lessons.find(l => l.id === showLessonQuizBuilder.lessonId)!.quizzes![0].title,
                      description: '',
                      questions: modules.find(m => m.id === showLessonQuizBuilder.moduleId)!.lessons.find(l => l.id === showLessonQuizBuilder.lessonId)!.quizzes![0].questions.map((q, idx) => ({
                        id: `q-${idx}`,
                        type: 'single-choice' as const,
                        question: q.question,
                        points: 1,
                        difficulty: 'medium' as DifficultyLevel,
                        options: q.options,
                        correctAnswer: q.options.indexOf(q.correct_answer)
                      })),
                      settings: {
                        passingScore: 70,
                        maxAttempts: 3,
                        showFeedback: 'after-submit' as const,
                        allowRetry: true,
                        randomizeQuestions: false,
                        randomizeOptions: false
                      }
                    }
                  : undefined
              }
              onSave={handleSaveLessonQuiz}
              onCancel={() => setShowLessonQuizBuilder(null)}
              availableTypes={['single-choice', 'multiple-choice', 'true-false']}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCourse;
