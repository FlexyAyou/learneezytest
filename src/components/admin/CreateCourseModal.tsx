import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import HtmlTextEditor from '@/components/admin/HtmlTextEditor';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: any) => void;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  content: string;
  fileType: 'video' | 'pdf' | 'image' | null;
  fileName: string;
  filePreview?: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export const CreateCourseModal = ({ isOpen, onClose, onCourseCreated }: CreateCourseModalProps) => {
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

  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ moduleId: string; quizId: string | null } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData(prev => ({ ...prev, image: file }));
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
  const addQuiz = (moduleId: string) => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, quizzes: [...m.quizzes, newQuiz] } : m
    ));
    setEditingQuiz({ moduleId, quizId: newQuiz.id });
  };

  const removeQuiz = (moduleId: string, quizId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, quizzes: m.quizzes.filter(q => q.id !== quizId) } : m
    ));
  };

  const updateQuiz = (moduleId: string, quizId: string, updates: Partial<Quiz>) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { 
            ...m, 
            quizzes: m.quizzes.map(q => 
              q.id === quizId ? { ...q, ...updates } : q
            ) 
          } 
        : m
    ));
  };

  const updateQuizOption = (moduleId: string, quizId: string, optionIndex: number, value: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { 
            ...m, 
            quizzes: m.quizzes.map(q => 
              q.id === quizId 
                ? { 
                    ...q, 
                    options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) 
                  } 
                : q
            ) 
          } 
        : m
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
    onCourseCreated(newCourse);
    
    toast({
      title: "Cours créé",
      description: "Le cours a été créé avec succès",
    });
    
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Titre du cours *</Label>
                <Input
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Maîtrisez React de A à Z"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Description *</Label>
                <HtmlTextEditor
                  value={courseData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Décrivez votre cours en détail..."
                  height="250px"
                />
              </div>

              <div>
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="89"
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
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
                <Label>Durée estimée</Label>
                <Input
                  value={courseData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 20h"
                />
              </div>

              <div>
                <Label>Niveau</Label>
                <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
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
              <Label>Objectifs pédagogiques</Label>
              <div className="space-y-2">
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
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un objectif
                </Button>
              </div>
            </div>

            <div>
              <Label>Image de couverture</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Glissez votre image ici ou cliquez pour sélectionner</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="course-image-upload"
                />
                <label htmlFor="course-image-upload">
                  <Button variant="outline" className="cursor-pointer" type="button">
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
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Liste des modules</h3>
              <Button onClick={addModule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un module
              </Button>
            </div>

            <Accordion type="single" collapsible value={expandedModule || undefined} onValueChange={setExpandedModule}>
              {modules.map((module, moduleIndex) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          Module {moduleIndex + 1}
                        </Badge>
                        <div className="text-left">
                          <div className="font-semibold">{module.title || 'Sans titre'}</div>
                          <div className="text-sm text-gray-600 font-normal">
                            {module.lessons.length} leçons • {module.quizzes.length} quiz
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeModule(module.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-4 pl-4">
                      {/* Module Info */}
                      <div className="space-y-4">
                        <div>
                          <Label>Titre du module</Label>
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            placeholder="Titre du module"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <HtmlTextEditor
                            value={module.description}
                            onChange={(value) => updateModule(module.id, 'description', value)}
                            placeholder="Description du module"
                            height="150px"
                          />
                        </div>
                      </div>

                      {/* Lessons Section */}
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Leçons</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addLesson(module.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une leçon
                          </Button>
                        </div>

                        {module.lessons.map((lesson, lessonIndex) => (
                          <Card key={lesson.id} className="bg-gray-50">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center">
                                  <Badge variant="outline" className="mr-2">
                                    Leçon {lessonIndex + 1}
                                  </Badge>
                                </CardTitle>
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
                            
                            {editingLesson?.lessonId === lesson.id ? (
                              <CardContent className="space-y-4">
                                <div>
                                  <Label>Titre de la leçon</Label>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                    placeholder="Titre de la leçon"
                                  />
                                </div>
                                <div>
                                  <Label>Durée (minutes)</Label>
                                  <Input
                                    type="number"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                                    placeholder="Durée"
                                  />
                                </div>
                                <div>
                                  <Label>Contenu de la leçon</Label>
                                  <HtmlTextEditor
                                    value={lesson.content}
                                    onChange={(value) => updateLesson(module.id, lesson.id, { content: value })}
                                    placeholder="Contenu de la leçon"
                                    height="150px"
                                  />
                                </div>
                                
                                {/* File Upload */}
                                <div className="space-y-2">
                                  <Label>Support de cours (Vidéo, PDF ou Image)</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="file"
                                      accept="video/*,application/pdf,image/*"
                                      onChange={(e) => handleFileUpload(module.id, lesson.id, e)}
                                      className="flex-1"
                                    />
                                    {lesson.fileType && (
                                      <Badge className="flex items-center gap-1">
                                        {lesson.fileType === 'video' && <Video className="h-3 w-3" />}
                                        {lesson.fileType === 'pdf' && <FileText className="h-3 w-3" />}
                                        {lesson.fileType === 'image' && <ImageIcon className="h-3 w-3" />}
                                        {lesson.fileType}
                                      </Badge>
                                    )}
                                  </div>
                                  {lesson.fileName && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded border">
                                      <Upload className="h-4 w-4" />
                                      <span className="flex-1">{lesson.fileName}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateLesson(module.id, lesson.id, { fileType: null, fileName: '', filePreview: '' })}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingLesson(null)}
                                >
                                  Terminer l'édition
                                </Button>
                              </CardContent>
                            ) : (
                              <CardContent>
                                <div className="text-sm space-y-2">
                                  <p className="font-medium">{lesson.title || 'Sans titre'}</p>
                                  <p className="text-gray-600">{lesson.duration} minutes</p>
                                  {lesson.fileName && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      {lesson.fileType === 'video' && <Video className="h-4 w-4" />}
                                      {lesson.fileType === 'pdf' && <FileText className="h-4 w-4" />}
                                      {lesson.fileType === 'image' && <ImageIcon className="h-4 w-4" />}
                                      <span>{lesson.fileName}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>

                      {/* Quiz Section */}
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Quiz</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addQuiz(module.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un quiz
                          </Button>
                        </div>

                        {module.quizzes.map((quiz, quizIndex) => (
                          <Card key={quiz.id} className="bg-blue-50">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center">
                                  <Badge variant="outline" className="mr-2 bg-blue-100">
                                    Quiz {quizIndex + 1}
                                  </Badge>
                                </CardTitle>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingQuiz(
                                      editingQuiz?.quizId === quiz.id ? null : { moduleId: module.id, quizId: quiz.id }
                                    )}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuiz(module.id, quiz.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            
                            {editingQuiz?.quizId === quiz.id ? (
                              <CardContent className="space-y-4">
                                <div>
                                  <Label>Question</Label>
                                  <Textarea
                                    value={quiz.question}
                                    onChange={(e) => updateQuiz(module.id, quiz.id, { question: e.target.value })}
                                    placeholder="Entrez la question"
                                    rows={2}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Options de réponse</Label>
                                  {quiz.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <Badge className="w-8 h-8 flex items-center justify-center">
                                        {String.fromCharCode(65 + optIndex)}
                                      </Badge>
                                      <Input
                                        value={option}
                                        onChange={(e) => updateQuizOption(module.id, quiz.id, optIndex, e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  <Label>Bonne réponse</Label>
                                  <Input
                                    value={quiz.correctAnswer}
                                    onChange={(e) => updateQuiz(module.id, quiz.id, { correctAnswer: e.target.value })}
                                    placeholder="Entrez la bonne réponse"
                                  />
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingQuiz(null)}
                                >
                                  Terminer l'édition
                                </Button>
                              </CardContent>
                            ) : (
                              <CardContent>
                                <div className="text-sm space-y-2">
                                  <p className="font-medium">{quiz.question || 'Sans question'}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {quiz.options.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                                          {String.fromCharCode(65 + optIndex)}
                                        </Badge>
                                        <span className={option === quiz.correctAnswer ? 'font-semibold text-green-700' : ''}>
                                          {option || '(vide)'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Récapitulatif du cours</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Titre:</strong> {courseData.title}</p>
                <p><strong>Description:</strong> {courseData.description}</p>
                <p><strong>Prix:</strong> {courseData.price}€</p>
                <p><strong>Catégorie:</strong> {courseData.category}</p>
                <p><strong>Durée:</strong> {courseData.duration}</p>
                <p><strong>Niveau:</strong> {courseData.level}</p>
                <p><strong>Objectifs:</strong> {courseData.objectives.filter(o => o).length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modules ({modules.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {modules.map((module, index) => (
                  <div key={module.id} className="mb-4 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold">Module {index + 1}: {module.title}</h4>
                    <p className="text-sm text-gray-600">{module.lessons.length} leçons • {module.quizzes.length} quiz</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Créer un nouveau cours</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-4 py-4 border-b">
          <div className={`flex items-center ${currentStep === 'info' ? 'text-pink-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'info' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            Informations
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center ${currentStep === 'modules' ? 'text-pink-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'modules' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            Modules
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center ${currentStep === 'review' ? 'text-pink-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'review' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            Révision
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          {currentStep !== 'info' && (
            <Button variant="outline" onClick={() => {
              if (currentStep === 'modules') setCurrentStep('info');
              if (currentStep === 'review') setCurrentStep('modules');
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
          )}
          {currentStep === 'info' && <div />}
          
          {currentStep !== 'review' ? (
            <Button onClick={() => {
              if (currentStep === 'info') setCurrentStep('modules');
              if (currentStep === 'modules') setCurrentStep('review');
            }}>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreateCourse} className="bg-pink-600 hover:bg-pink-700">
              <Save className="h-4 w-4 mr-2" />
              Créer le cours
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};