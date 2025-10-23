import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2, Check, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';
import { SimpleQuizQuestion } from '@/types/quiz';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  content: string;
  fileType: 'video' | 'pdf' | 'image' | null;
  fileName: string;
  filePreview?: string;
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizzes: SimpleQuizQuestion[];
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'débutant',
    image: null as File | null,
    imagePreview: null as string | null,
    objectives: [''],
  });

  const [modules, setModules] = useState<ModuleWithLessons[]>([
    {
      id: '1',
      title: 'Module 1',
      description: '',
      lessons: [],
      quizzes: []
    }
  ]);

  const [expandedModule, setExpandedModule] = useState<string | null>('1');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({ 
          ...prev, 
          image: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addObjective = () => {
    setCourseData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    if (courseData.objectives.length > 1) {
      setCourseData(prev => ({
        ...prev,
        objectives: prev.objectives.filter((_, i) => i !== index)
      }));
    }
  };

  // Module functions
  const addModule = () => {
    const newModule: ModuleWithLessons = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: [],
      quizzes: []
    };
    setModules([...modules, newModule]);
    setExpandedModule(newModule.id);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, field: 'title' | 'description', value: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, [field]: value } : m
    ));
  };

  // Lesson functions
  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      duration: 0,
      content: '',
      fileType: null,
      fileName: ''
    };
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
    setEditingLesson({ moduleId, lessonId: newLesson.id });
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { 
            ...m, 
            lessons: m.lessons.map(l => 
              l.id === lessonId ? { ...l, ...updates } : l
            ) 
          } 
        : m
    ));
  };

  const handleFileUpload = (moduleId: string, lessonId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type.startsWith('video/') ? 'video' 
      : file.type === 'application/pdf' ? 'pdf' 
      : file.type.startsWith('image/') ? 'image' 
      : null;

    if (!fileType) {
      toast({
        title: "Format non supporté",
        description: "Veuillez uploader une vidéo, PDF ou image",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateLesson(moduleId, lessonId, {
        fileType,
        fileName: file.name,
        filePreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);

    toast({
      title: "Fichier ajouté",
      description: `${file.name} a été ajouté à la leçon`
    });
  };

  // Quiz functions
  const updateModuleQuizzes = (moduleId: string, quizzes: SimpleQuizQuestion[]) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, quizzes } : m
    ));
  };

  const handleCreateCourse = () => {
    if (!courseData.title || !courseData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      modules: modules,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    console.log('Course created:', newCourse);
    
    toast({
      title: "Cours créé",
      description: "Le cours a été créé avec succès",
    });
    
    navigate('/dashboard/superadmin/courses');
  };

  const canProceedToNextStep = () => {
    if (currentStep === 'info') {
      return courseData.title && courseData.description;
    }
    if (currentStep === 'modules') {
      return modules.length > 0 && modules.some(m => m.lessons.length > 0);
    }
    return true;
  };

  const steps = [
    { id: 'info', label: 'Informations', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: FileText },
    { id: 'review', label: 'Révision', icon: Check }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/superadmin/courses')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Créer un nouveau cours
            </h1>
            <p className="text-gray-600 mt-1">Suivez les étapes pour créer votre cours</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  Étape {currentStepIndex + 1} sur {steps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}% complété
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center p-4 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300' 
                        : isCompleted 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className={`font-semibold ${
                      isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {currentStep === 'info' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations générales du cours</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-base">Titre du cours *</Label>
                    <Input
                      value={courseData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Maîtrisez React de A à Z"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label className="text-base">Description *</Label>
                    <Textarea
                      value={courseData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez votre cours en détail..."
                      rows={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base">Prix (€)</Label>
                    <Input
                      type="number"
                      value={courseData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="89"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base">Catégorie</Label>
                    <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base">Durée estimée</Label>
                    <Input
                      value={courseData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Ex: 20h"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base">Niveau</Label>
                    <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="débutant">Débutant</SelectItem>
                        <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="avancé">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Objectifs pédagogiques</Label>
                  <div className="space-y-3 mt-2">
                    {courseData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          placeholder={`Objectif ${index + 1}`}
                        />
                        {courseData.objectives.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeObjective(index)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addObjective} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un objectif
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Image de couverture</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                    {courseData.imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={courseData.imagePreview} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setCourseData(prev => ({ ...prev, image: null, imagePreview: null }))}
                        >
                          Changer l'image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">Glissez votre image ici ou cliquez pour sélectionner</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="course-image-upload"
                        />
                        <label htmlFor="course-image-upload">
                          <Button variant="outline" className="cursor-pointer" type="button" asChild>
                            <span>Choisir un fichier</span>
                          </Button>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'modules' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Modules et contenus</h2>
                  <Button onClick={addModule} className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>

                <Accordion type="single" collapsible value={expandedModule || undefined} onValueChange={setExpandedModule}>
                  {modules.map((module, moduleIndex) => (
                    <AccordionItem key={module.id} value={module.id} className="border rounded-lg mb-4 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600">
                              Module {moduleIndex + 1}
                            </Badge>
                            <div className="text-left">
                              <div className="font-semibold text-lg">{module.title || 'Sans titre'}</div>
                              <div className="text-sm text-gray-600 font-normal">
                                {module.lessons.length} leçon{module.lessons.length !== 1 ? 's' : ''} • {module.quizzes.length} quiz
                              </div>
                            </div>
                          </div>
                          {modules.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeModule(module.id);
                              }}
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-6 bg-white">
                        <div className="space-y-6">
                          {/* Module Info */}
                          <div className="space-y-4">
                            <div>
                              <Label>Titre du module</Label>
                              <Input
                                value={module.title}
                                onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                                placeholder="Titre du module"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={module.description}
                                onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                                placeholder="Description du module"
                                rows={3}
                                className="mt-2"
                              />
                            </div>
                          </div>

                          {/* Lessons Section */}
                          <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-lg">Leçons</h4>
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
                              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Aucune leçon pour le moment</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addLesson(module.id)}
                                  className="mt-4"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Créer la première leçon
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <Card key={lesson.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                                    <CardHeader className="pb-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <Badge variant="outline" className="bg-white">
                                            Leçon {lessonIndex + 1}
                                          </Badge>
                                          <span className="font-medium">{lesson.title || 'Sans titre'}</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingLesson(
                                              editingLesson?.lessonId === lesson.id ? null : { moduleId: module.id, lessonId: lesson.id }
                                            )}
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLesson(module.id, lesson.id)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    {editingLesson?.lessonId === lesson.id && (
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Titre de la leçon</Label>
                                            <Input
                                              value={lesson.title}
                                              onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                              placeholder="Titre"
                                              className="mt-2"
                                            />
                                          </div>
                                          <div>
                                            <Label>Durée (minutes)</Label>
                                            <Input
                                              type="number"
                                              value={lesson.duration || ''}
                                              onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                                              placeholder="30"
                                              className="mt-2"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Contenu de la leçon</Label>
                                          <Textarea
                                            value={lesson.content}
                                            onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                                            placeholder="Description du contenu..."
                                            rows={4}
                                            className="mt-2"
                                          />
                                        </div>
                                        <div>
                                          <Label>Média (Vidéo, PDF ou Image)</Label>
                                          <div className="mt-2">
                                            {lesson.filePreview ? (
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                                  <div className="flex items-center space-x-3">
                                                    {lesson.fileType === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                                                    {lesson.fileType === 'pdf' && <FileText className="h-5 w-5 text-red-500" />}
                                                    {lesson.fileType === 'image' && <ImageIcon className="h-5 w-5 text-green-500" />}
                                                    <span className="text-sm font-medium">{lesson.fileName}</span>
                                                  </div>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateLesson(module.id, lesson.id, { 
                                                      fileType: null, 
                                                      fileName: '', 
                                                      filePreview: undefined 
                                                    })}
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                                {lesson.fileType === 'image' && (
                                                  <img src={lesson.filePreview} alt="Preview" className="max-h-48 rounded" />
                                                )}
                                              </div>
                                            ) : (
                                              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600 mb-3">Vidéo, PDF ou Image</p>
                                                <input
                                                  type="file"
                                                  accept="video/*,application/pdf,image/*"
                                                  onChange={(e) => handleFileUpload(module.id, lesson.id, e)}
                                                  className="hidden"
                                                  id={`file-${lesson.id}`}
                                                />
                                                <label htmlFor={`file-${lesson.id}`}>
                                                  <Button variant="outline" size="sm" type="button" asChild>
                                                    <span>Choisir un fichier</span>
                                                  </Button>
                                                </label>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quizzes Section */}
                          <div className="space-y-4 border-t pt-6">
                            <h4 className="font-semibold text-lg mb-3">Quiz</h4>
                            <QuizBuilder
                              questions={module.quizzes}
                              onQuestionsChange={(quizzes) => updateModuleQuizzes(module.id, quizzes)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Révision finale</h2>
                
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle>Informations du cours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Titre</Label>
                        <p className="font-medium">{courseData.title}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Catégorie</Label>
                        <p className="font-medium">{courseData.category || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Prix</Label>
                        <p className="font-medium">{courseData.price ? `${courseData.price}€` : 'Gratuit'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Niveau</Label>
                        <p className="font-medium capitalize">{courseData.level}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Description</Label>
                      <p className="mt-1">{courseData.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-teal-50">
                  <CardHeader>
                    <CardTitle>Structure du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-3xl font-bold text-pink-600">{modules.length}</div>
                          <div className="text-sm text-gray-600">Modules</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Leçons</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">
                            {modules.reduce((sum, m) => sum + m.quizzes.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Quiz</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {modules.map((module, idx) => (
                          <div key={module.id} className="p-3 bg-white rounded border">
                            <div className="font-semibold">{idx + 1}. {module.title}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {module.lessons.length} leçons • {module.quizzes.length} quiz
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 'modules') setCurrentStep('info');
                  else if (currentStep === 'review') setCurrentStep('modules');
                }}
                disabled={currentStep === 'info'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              {currentStep !== 'review' ? (
                <Button
                  onClick={() => {
                    if (currentStep === 'info') setCurrentStep('modules');
                    else if (currentStep === 'modules') setCurrentStep('review');
                  }}
                  disabled={!canProceedToNextStep()}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateCourse}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Créer le cours
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoursePage;
