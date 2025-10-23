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
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2, Check, BookOpen, Award, ClipboardList, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder, AssignmentBuilder, CertificationBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig, CertificationConfig, QuestionType } from '@/types/quiz';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  content: string;
  fileType: 'video' | 'pdf' | 'image' | null;
  fileName: string;
  filePreview?: string;
  quiz?: QuizConfig; // Quiz optionnel par leçon
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  assignment?: AssignmentConfig; // Devoir optionnel par module
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'certification' | 'review'>('info');
  
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
    certification: null as CertificationConfig | null,
  });

  const [modules, setModules] = useState<ModuleWithLessons[]>([
    {
      id: '1',
      title: 'Module 1',
      description: '',
      lessons: [],
    }
  ]);

  const [expandedModule, setExpandedModule] = useState<string | null>('1');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);
  
  // États pour les builders
  const [showQuizBuilder, setShowQuizBuilder] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<string | null>(null);
  const [showCertificationBuilder, setShowCertificationBuilder] = useState(false);
  const [enableCertification, setEnableCertification] = useState(false);

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

  // Quiz/Assignment/Certification functions
  const handleSaveQuiz = (moduleId: string, lessonId: string, quiz: QuizConfig) => {
    updateLesson(moduleId, lessonId, { quiz });
    setShowQuizBuilder(null);
    toast({
      title: "Quiz sauvegardé",
      description: "Le quiz a été ajouté à la leçon",
    });
  };

  const handleRemoveQuiz = (moduleId: string, lessonId: string) => {
    updateLesson(moduleId, lessonId, { quiz: undefined });
    toast({
      title: "Quiz supprimé",
      description: "Le quiz a été retiré de la leçon",
    });
  };

  const handleSaveAssignment = (moduleId: string, assignment: AssignmentConfig) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, assignment } : m
    ));
    setShowAssignmentBuilder(null);
    toast({
      title: "Devoir sauvegardé",
      description: "Le devoir a été ajouté au module",
    });
  };

  const handleRemoveAssignment = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, assignment: undefined } : m
    ));
    toast({
      title: "Devoir supprimé",
      description: "Le devoir a été retiré du module",
    });
  };

  const handleSaveCertification = (certification: CertificationConfig) => {
    setCourseData(prev => ({ ...prev, certification }));
    setShowCertificationBuilder(false);
    toast({
      title: "Certification sauvegardée",
      description: "La certification a été configurée",
    });
  };

  const handleRemoveCertification = () => {
    setCourseData(prev => ({ ...prev, certification: null }));
    setEnableCertification(false);
    toast({
      title: "Certification supprimée",
      description: "La certification a été retirée du cours",
    });
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
    if (currentStep === 'certification') {
      // Si certification activée, au moins 10 questions requises
      if (enableCertification && courseData.certification) {
        return courseData.certification.questions.length >= 10;
      }
      return true; // Peut passer si certification non activée
    }
    return true;
  };

  const steps = [
    { id: 'info', label: 'Informations', icon: BookOpen },
    { id: 'modules', label: 'Modules & Leçons', icon: FileText },
    { id: 'certification', label: 'Certification', icon: Award },
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
            
            <div className="grid grid-cols-4 gap-4">
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
                                  {module.lessons.length} leçon{module.lessons.length !== 1 ? 's' : ''}
                                  {module.lessons.filter(l => l.quiz).length > 0 && ` • ${module.lessons.filter(l => l.quiz).length} quiz`}
                                  {module.assignment && ' • 1 devoir'}
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

                           {/* Quiz Section for Lessons */}
                           <div className="space-y-4 border-t pt-6">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <HelpCircle className="h-5 w-5 text-blue-600" />
                                 <h4 className="font-semibold text-lg">Quiz des leçons</h4>
                               </div>
                             </div>
                             <div className="text-sm text-gray-600 mb-4">
                               Ajoutez des quiz aux leçons pour évaluer la compréhension après chaque contenu.
                             </div>
                             <div className="space-y-2">
                               {module.lessons.map((lesson, idx) => (
                                 <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                   <div className="flex items-center gap-3">
                                     <Badge variant="outline">Leçon {idx + 1}</Badge>
                                     <span className="font-medium">{lesson.title || 'Sans titre'}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                     {lesson.quiz ? (
                                       <>
                                         <Badge className="bg-green-100 text-green-800">
                                           {lesson.quiz.questions.length} questions
                                         </Badge>
                                         <Button
                                           variant="ghost"
                                           size="sm"
                                           onClick={() => setShowQuizBuilder({ moduleId: module.id, lessonId: lesson.id })}
                                         >
                                           <Edit2 className="h-4 w-4" />
                                         </Button>
                                         <Button
                                           variant="ghost"
                                           size="sm"
                                           onClick={() => handleRemoveQuiz(module.id, lesson.id)}
                                         >
                                           <Trash2 className="h-4 w-4 text-red-500" />
                                         </Button>
                                       </>
                                     ) : (
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={() => setShowQuizBuilder({ moduleId: module.id, lessonId: lesson.id })}
                                       >
                                         <Plus className="h-4 w-4 mr-2" />
                                         Ajouter un quiz
                                       </Button>
                                     )}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           {/* Assignment Section for Module */}
                           <div className="space-y-4 border-t pt-6">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <ClipboardList className="h-5 w-5 text-purple-600" />
                                 <h4 className="font-semibold text-lg">Devoir de fin de module</h4>
                               </div>
                             </div>
                             <div className="text-sm text-gray-600 mb-4">
                               Un devoir permet d'évaluer l'ensemble des compétences acquises dans ce module.
                             </div>
                             {module.assignment ? (
                               <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                                 <CardHeader>
                                   <div className="flex items-center justify-between">
                                     <div>
                                       <CardTitle className="text-lg">{module.assignment.title}</CardTitle>
                                       <p className="text-sm text-gray-600 mt-1">
                                         {module.assignment.questions.length} questions • 
                                         Note de passage: {module.assignment.settings.passingScore}%
                                       </p>
                                     </div>
                                     <div className="flex gap-2">
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={() => setShowAssignmentBuilder(module.id)}
                                       >
                                         <Edit2 className="h-4 w-4" />
                                       </Button>
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={() => handleRemoveAssignment(module.id)}
                                       >
                                         <Trash2 className="h-4 w-4 text-red-500" />
                                       </Button>
                                     </div>
                                   </div>
                                 </CardHeader>
                               </Card>
                             ) : (
                               <Button
                                 variant="outline"
                                 onClick={() => setShowAssignmentBuilder(module.id)}
                                 className="w-full"
                               >
                                 <Plus className="h-4 w-4 mr-2" />
                                 Créer un devoir pour ce module
                               </Button>
                             )}
                           </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {currentStep === 'certification' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Certification du cours</h2>
                    <p className="text-gray-600 mt-1">
                      La certification permet de valider les compétences acquises dans l'ensemble du cours
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>Activer la certification</Label>
                    <Switch
                      checked={enableCertification}
                      onCheckedChange={(checked) => {
                        setEnableCertification(checked);
                        if (checked && !courseData.certification) {
                          setShowCertificationBuilder(true);
                        }
                      }}
                    />
                  </div>
                </div>

                {!enableCertification ? (
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Certification désactivée
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Activez la certification pour permettre aux apprenants d'obtenir un certificat à la fin du cours
                      </p>
                    </CardContent>
                  </Card>
                ) : courseData.certification ? (
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Award className="h-6 w-6 text-amber-600" />
                            {courseData.certification.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-2">
                            {courseData.certification.questions.length} questions • 
                            Durée: {courseData.certification.settings.timeLimit} min • 
                            Note de passage: {courseData.certification.settings.passingScore}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCertificationBuilder(true)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCertification}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-sm text-gray-600">Mode examen</div>
                            <div className="text-lg font-semibold">
                              {courseData.certification.settings.examMode ? 'Activé' : 'Désactivé'}
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-sm text-gray-600">Tentatives max</div>
                            <div className="text-lg font-semibold">
                              {courseData.certification.settings.maxAttempts}
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-sm text-gray-600">Questions aléatoires</div>
                            <div className="text-lg font-semibold">
                              {courseData.certification.settings.randomizeQuestions ? 'Oui' : 'Non'}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600 mb-2">Description</div>
                          <p className="text-sm">{courseData.certification.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Configurer la certification
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Créez un examen final pour certifier les compétences des apprenants
                      </p>
                      <Button
                        onClick={() => setShowCertificationBuilder(true)}
                        className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer la certification
                      </Button>
                    </CardContent>
                  </Card>
                )}
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
                      <div className="grid grid-cols-4 gap-4 text-center">
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
                            {modules.reduce((sum, m) => sum + m.lessons.filter(l => l.quiz).length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Quiz</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-3xl font-bold text-orange-600">
                            {modules.filter(m => m.assignment).length}
                          </div>
                          <div className="text-sm text-gray-600">Devoirs</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {modules.map((module, idx) => (
                          <div key={module.id} className="p-4 bg-white rounded-lg border">
                            <div className="font-semibold text-lg mb-2">{idx + 1}. {module.title}</div>
                            <div className="space-y-2 ml-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText className="h-4 w-4" />
                                <span>{module.lessons.length} leçons</span>
                                {module.lessons.filter(l => l.quiz).length > 0 && (
                                  <span className="text-blue-600">
                                    ({module.lessons.filter(l => l.quiz).length} avec quiz)
                                  </span>
                                )}
                              </div>
                              {module.assignment && (
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                  <ClipboardList className="h-4 w-4" />
                                  <span>Devoir: {module.assignment.title} ({module.assignment.questions.length} questions)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {courseData.certification && (
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-6 w-6 text-amber-600" />
                        Certification finale
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-600">Titre</Label>
                            <p className="font-medium">{courseData.certification.title}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Questions</Label>
                            <p className="font-medium">{courseData.certification.questions.length} questions</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Durée</Label>
                            <p className="font-medium">{courseData.certification.settings.timeLimit} minutes</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Note de passage</Label>
                            <p className="font-medium">{courseData.certification.settings.passingScore}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                  else if (currentStep === 'certification') setCurrentStep('modules');
                  else if (currentStep === 'review') setCurrentStep('certification');
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
                    else if (currentStep === 'modules') setCurrentStep('certification');
                    else if (currentStep === 'certification') setCurrentStep('review');
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

        {/* Quiz Builder Modal */}
        {showQuizBuilder && (
          <Dialog open={!!showQuizBuilder} onOpenChange={() => setShowQuizBuilder(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurer le quiz de la leçon</DialogTitle>
              </DialogHeader>
              <QuizBuilder
                quiz={modules
                  .find(m => m.id === showQuizBuilder.moduleId)
                  ?.lessons.find(l => l.id === showQuizBuilder.lessonId)
                  ?.quiz
                }
                onSave={(quiz) => handleSaveQuiz(showQuizBuilder.moduleId, showQuizBuilder.lessonId, quiz)}
                onCancel={() => setShowQuizBuilder(null)}
                availableTypes={['single-choice', 'multiple-choice', 'true-false', 'short-answer'] as QuestionType[]}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Assignment Builder Modal */}
        {showAssignmentBuilder && (
          <Dialog open={!!showAssignmentBuilder} onOpenChange={() => setShowAssignmentBuilder(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurer le devoir du module</DialogTitle>
              </DialogHeader>
              <AssignmentBuilder
                assignment={modules.find(m => m.id === showAssignmentBuilder)?.assignment}
                onSave={(assignment) => handleSaveAssignment(showAssignmentBuilder, assignment)}
                onCancel={() => setShowAssignmentBuilder(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Certification Builder Modal */}
        {showCertificationBuilder && (
          <Dialog open={showCertificationBuilder} onOpenChange={setShowCertificationBuilder}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurer la certification du cours</DialogTitle>
              </DialogHeader>
              <CertificationBuilder
                certification={courseData.certification || undefined}
                onSave={handleSaveCertification}
                onCancel={() => setShowCertificationBuilder(false)}
                availableModules={modules.map(m => ({ id: m.id, title: m.title }))}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CreateCoursePage;
