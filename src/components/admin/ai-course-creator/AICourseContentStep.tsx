
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, Video, FileText, Image as ImageIcon, Edit2, X } from 'lucide-react';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

interface AICourseContentStepProps {
  onNext: () => void;
  onBack: () => void;
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

export const AICourseContentStep = ({ onNext, onBack }: AICourseContentStepProps) => {
  const { toast } = useToast();
  const [modules, setModules] = useState<ModuleWithLessons[]>([
    {
      id: '1',
      title: 'Module 1',
      description: 'Description du module 1',
      lessons: [],
      quizzes: []
    }
  ]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ moduleId: string; quizId: string | null } | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Modules et leçons</h2>
        <p className="text-gray-600">
          Ajoutez des modules avec leurs leçons et quiz
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
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
                      <Textarea
                        value={module.description}
                        onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                        placeholder="Description du module"
                        rows={3}
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
                              <Textarea
                                value={lesson.content}
                                onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                                placeholder="Contenu de la leçon"
                                rows={4}
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

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la structure
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-pink-600 hover:bg-pink-700"
        >
          Finaliser le cours
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
