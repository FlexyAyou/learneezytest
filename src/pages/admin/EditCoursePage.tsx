import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2, Check, BookOpen, ClipboardList, HelpCircle, Link as LinkIcon, Eye } from 'lucide-react';
import { CycleTagSelector } from '@/components/admin/CycleTagSelector';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder, AssignmentBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig, QuestionType } from '@/types/quiz';
import RichTextEditor from '@/components/admin/RichTextEditor';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fastAPIClient } from '@/services/fastapi-client';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  content: string;
  fileType: 'video' | 'pdf' | 'image' | null;
  fileName: string;
  filePreview?: string;
  file?: File;
  uploadedVideoKey?: string;
  quiz?: QuizConfig;
  mediaUrl?: string;
  useMediaUrl?: boolean;
  video_key?: string; // Existing video key from backend
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz?: QuizConfig;
  assignment?: AssignmentConfig;
  pedagogicalResources: Array<{
    id: string;
    fileName: string;
    file: File;
  }>;
}

const EditCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  const [trainers, setTrainers] = useState<Array<{ id: string; name: string }>>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Détecter si on est dans le contexte gestionnaire ou superadmin
  const isManagerContext = location.pathname.includes('/gestionnaire/');
  const coursesBasePath = isManagerContext ? '/dashboard/gestionnaire/courses' : '/dashboard/superadmin/courses';
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    customCategory: '',
    duration: '',
    level: 'débutant',
    cycle: '' as '' | 'primaire' | 'college' | 'lycee' | 'formation_pro',
    cycleTags: [] as string[],
    image: null as File | null,
    imagePreview: null as string | null,
    objectives: [''],
    programFile: null as File | null,
    programFileName: '',
    ownerId: 'learneezy',
    status: 'draft' as 'draft' | 'published',
  });

  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);
  
  const [showQuizBuilder, setShowQuizBuilder] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<string | null>(null);
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<string | null>(null);

  // Load existing course data
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const course = await fastAPIClient.getCourse(id);
        console.log('Loaded course:', course);
        
        // Populate course data
        setCourseData({
          title: course.title || '',
          description: course.description || '',
          price: course.price?.toString() || '',
          category: course.category || '',
          customCategory: '',
          duration: course.duration || '',
          level: course.level || 'débutant',
          cycle: '' as any,
          cycleTags: [],
          image: null,
          imagePreview: course.image_url || null,
          objectives: [''],
          programFile: null,
          programFileName: '',
          ownerId: course.owner_type || 'learneezy',
          status: course.status || 'draft',
        });

        // Populate modules and lessons
        if (course.modules && course.modules.length > 0) {
          const loadedModules: ModuleWithLessons[] = course.modules.map((mod: any, idx: number) => ({
            id: `module-${idx}`,
            title: mod.title || `Module ${idx + 1}`,
            description: mod.description || '',
            lessons: (mod.content || []).map((lesson: any, lessonIdx: number) => ({
              id: `lesson-${idx}-${lessonIdx}`,
              title: lesson.title || `Leçon ${lessonIdx + 1}`,
              duration: parseInt(lesson.duration) || 0,
              content: lesson.description || '',
              fileType: lesson.video_key || lesson.video_url ? 'video' : null,
              fileName: lesson.video_key ? 'Vidéo existante' : '',
              video_key: lesson.video_key,
              mediaUrl: lesson.video_url || '',
              useMediaUrl: !!lesson.video_url,
            })),
            pedagogicalResources: [],
            quiz: mod.quizzes && mod.quizzes.length > 0 ? {
              id: `quiz-${idx}`,
              type: 'quiz' as const,
              title: mod.quizzes[0].title || 'Quiz',
              settings: {
                showFeedback: 'after-submit' as const,
                allowRetry: true,
                maxAttempts: 3,
                randomizeQuestions: false,
                randomizeOptions: false,
                timeLimit: undefined,
                passingScore: 70,
              },
              questions: (mod.quizzes[0].questions || []).map((q: any, qIdx: number) => ({
                id: `q-${idx}-${qIdx}`,
                type: 'single-choice' as const,
                question: q.question || '',
                options: q.options || [],
                correctAnswer: q.options?.indexOf(q.correct_answer) || 0,
                points: 1,
                explanation: '',
              }))
            } : undefined,
          }));
          setModules(loadedModules);
          if (loadedModules.length > 0) {
            setExpandedModule(loadedModules[0].id);
          }
        } else {
          setModules([{
            id: 'module-1',
            title: 'Module 1',
            description: '',
            lessons: [],
            pedagogicalResources: [],
          }]);
          setExpandedModule('module-1');
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le cours",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, toast]);

  // Load trainers on mount
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainersList = await fastAPIClient.getTrainers();
        setTrainers(trainersList.map(t => ({
          id: t.id.toString(),
          name: `${t.first_name} ${t.last_name}`
        })));
      } catch (error) {
        console.error('Error loading trainers:', error);
      }
    };
    loadTrainers();
  }, []);

  // Load custom categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('customCourseCategories');
    if (savedCategories) {
      try {
        setCustomCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading custom categories:', error);
      }
    }
  }, []);

  const saveCustomCategory = () => {
    if (!courseData.customCategory.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de catégorie",
        variant: "destructive"
      });
      return;
    }

    const newCategory = courseData.customCategory.trim();
    
    if (customCategories.includes(newCategory)) {
      toast({
        title: "Catégorie existante",
        description: "Cette catégorie existe déjà dans la liste",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCategories);
    localStorage.setItem('customCourseCategories', JSON.stringify(updatedCategories));
    
    handleInputChange('category', newCategory);
    handleInputChange('customCategory', '');

    toast({
      title: "Catégorie enregistrée",
      description: `"${newCategory}" a été ajoutée à la liste des catégories`
    });
  };

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

  const handleProgramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Format invalide",
          description: "Veuillez uploader un fichier PDF",
          variant: "destructive"
        });
        return;
      }
      setCourseData(prev => ({ 
        ...prev, 
        programFile: file,
        programFileName: file.name
      }));
      toast({
        title: "Programme ajouté",
        description: file.name
      });
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

  const addModule = () => {
    const newModule: ModuleWithLessons = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: [],
      pedagogicalResources: [],
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
        filePreview: e.target?.result as string,
        file: file
      });
    };
    reader.readAsDataURL(file);

    toast({
      title: "Fichier ajouté",
      description: `${file.name} a été ajouté à la leçon`
    });
  };

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

  const handleSaveModuleQuiz = (moduleId: string, quiz: QuizConfig) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, quiz } : m
    ));
    setShowModuleQuizBuilder(null);
    toast({
      title: "Quiz sauvegardé",
      description: "Le quiz a été ajouté au module",
    });
  };

  const handleRemoveModuleQuiz = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, quiz: undefined } : m
    ));
    toast({
      title: "Quiz supprimé",
      description: "Le quiz a été retiré du module",
    });
  };

  const handleAddPedagogicalResource = (moduleId: string, file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Format invalide",
        description: "Veuillez uploader un fichier PDF",
        variant: "destructive"
      });
      return;
    }

    const resource = {
      id: `resource-${Date.now()}`,
      fileName: file.name,
      file: file
    };

    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, pedagogicalResources: [...m.pedagogicalResources, resource] } 
        : m
    ));

    toast({
      title: "Ressource ajoutée",
      description: file.name
    });
  };

  const handleRemovePedagogicalResource = (moduleId: string, resourceId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, pedagogicalResources: m.pedagogicalResources.filter(r => r.id !== resourceId) } 
        : m
    ));
    toast({
      title: "Ressource supprimée",
      description: "La ressource a été retirée du module",
    });
  };

  const handleToggleStatus = async () => {
    if (!id) return;
    
    try {
      const newStatus = courseData.status === 'published' ? 'draft' : 'published';
      const updatedCourse = await fastAPIClient.updateCourseStatus(id, newStatus);
      setCourseData(prev => ({ ...prev, status: newStatus }));
      toast({
        title: newStatus === 'published' ? "✅ Cours publié" : "📝 Cours en brouillon",
        description: `Le cours est maintenant ${newStatus === 'published' ? 'visible par tous' : 'masqué du public'}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!id || !courseData.title || !courseData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (titre et description)",
        variant: "destructive"
      });
      return;
    }

    if (modules.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un module",
        variant: "destructive"
      });
      return;
    }

    const invalidModules = modules.filter(m => 
      m.lessons.length === 0 && !m.quiz && !m.assignment
    );
    
    if (invalidModules.length > 0) {
      toast({
        title: "Erreur",
        description: "Chaque module doit contenir au moins une leçon, un quiz ou un devoir",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { calculateModuleDuration } = await import('@/utils/courseHelpers');
      
      // Upload new videos
      toast({
        title: "Upload des vidéos...",
        description: "Téléchargement des nouvelles vidéos",
      });

      for (const module of modules) {
        for (const lesson of module.lessons) {
          if (lesson.file && lesson.fileType === 'video' && !lesson.uploadedVideoKey) {
            try {
              console.log(`📤 Upload vidéo: ${lesson.fileName}`);
              
              const prepareResponse = await fastAPIClient.prepareUpload(
                lesson.file.name,
                lesson.file.type,
                lesson.file.size
              );

              if (prepareResponse.strategy === 'single' && prepareResponse.url && prepareResponse.headers) {
                const uploadHeaders = new Headers(prepareResponse.headers);
                await fetch(prepareResponse.url, {
                  method: 'PUT',
                  headers: uploadHeaders,
                  body: lesson.file
                });
              } else if (prepareResponse.strategy === 'multipart' && prepareResponse.parts) {
                const parts = [];
                const partSize = prepareResponse.part_size || 5 * 1024 * 1024;
                
                for (let i = 0; i < prepareResponse.parts.length; i++) {
                  const part = prepareResponse.parts[i];
                  const start = (part.partNumber - 1) * partSize;
                  const end = Math.min(start + partSize, lesson.file.size);
                  const blob = lesson.file.slice(start, end);

                  const response = await fetch(part.url, {
                    method: 'PUT',
                    body: blob
                  });

                  const etag = response.headers.get('ETag')?.replace(/"/g, '') || '';
                  parts.push({
                    ETag: etag,
                    PartNumber: part.partNumber
                  });
                }

                await fastAPIClient.completeUpload({
                  strategy: 'multipart',
                  key: prepareResponse.key,
                  upload_id: prepareResponse.upload_id!,
                  parts,
                  content_type: lesson.file.type,
                  size: lesson.file.size
                });
              }

              if (prepareResponse.strategy === 'single') {
                await fastAPIClient.completeUpload({
                  strategy: 'single',
                  key: prepareResponse.key,
                  content_type: lesson.file.type,
                  size: lesson.file.size
                });
              }

              lesson.uploadedVideoKey = prepareResponse.key;
              
              console.log(`✅ Vidéo uploadée: ${lesson.fileName} → ${prepareResponse.key}`);
              
              toast({
                title: "Vidéo uploadée",
                description: `${lesson.fileName} est prête`,
              });
            } catch (uploadError: any) {
              console.error(`❌ Erreur upload vidéo ${lesson.fileName}:`, uploadError);
              toast({
                title: "Erreur d'upload",
                description: `Impossible d'uploader ${lesson.fileName}`,
                variant: "destructive"
              });
            }
          }
        }
      }

      // Upload image if new one selected
      let imageUrl = courseData.imagePreview;
      if (courseData.image) {
        try {
          const prepareResponse = await fastAPIClient.prepareUpload(
            courseData.image.name,
            courseData.image.type,
            courseData.image.size
          );

          if (prepareResponse.strategy === 'single' && prepareResponse.url) {
            await fetch(prepareResponse.url, {
              method: 'PUT',
              body: courseData.image,
              headers: prepareResponse.headers || {},
            });
          }

          const completeResponse = await fastAPIClient.completeUpload({
            strategy: prepareResponse.strategy,
            key: prepareResponse.key,
            content_type: courseData.image.type,
            size: courseData.image.size,
            upload_id: prepareResponse.upload_id,
          });

          imageUrl = `${import.meta.env.VITE_API_URL || 'https://api.plateforme-test-infinitiax.com'}/api/storage/${completeResponse.key}`;
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      toast({
        title: "Mise à jour du cours...",
        description: "Envoi des données au serveur",
      });

      // Prepare update payload (only fields accepted by CourseUpdate interface)
      const coursePayload: {
        title?: string;
        description?: string;
        price?: number | null;
        status?: 'draft' | 'published';
      } = {
        title: courseData.title,
        description: courseData.description,
        status: courseData.status,
      };

      // Only include price if it's a valid number
      if (courseData.price && !isNaN(parseFloat(courseData.price))) {
        coursePayload.price = parseFloat(courseData.price);
      }

      // Use the update endpoint (only updates top-level fields)
      await fastAPIClient.updateCourse(id, coursePayload);
      
      toast({
        title: "✅ Cours mis à jour",
        description: `Le cours "${courseData.title}" a été mis à jour avec succès`,
      });
      
      navigate(`${coursesBasePath}/${id}`);
      
    } catch (error: any) {
      console.error('Erreur mise à jour cours:', error);
      toast({
        title: "Erreur",
        description: error?.response?.data?.detail || error?.message || "Une erreur est survenue lors de la mise à jour du cours",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
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
    { id: 'modules', label: 'Modules & Leçons', icon: FileText },
    { id: 'review', label: 'Révision', icon: Check }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(coursesBasePath)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Éditer le cours
            </h1>
            <p className="text-gray-600 mt-1">Modifiez tous les aspects de votre cours</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-toggle" className="text-sm font-medium">
                {courseData.status === 'draft' ? 'Publier' : 'Brouillon'}
              </Label>
              <Switch
                id="status-toggle"
                checked={courseData.status === 'published'}
                onCheckedChange={handleToggleStatus}
              />
            </div>
            <Button variant="outline" onClick={() => navigate(`${coursesBasePath}/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
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

        {/* Step Content - Réutiliser la même structure que CreateCoursePage */}
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
                    <RichTextEditor
                      value={courseData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Décrivez votre cours en détail..."
                      height="200px"
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
                    <Select 
                      value={courseData.category === 'custom' ? 'custom' : courseData.category} 
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          handleInputChange('category', 'custom');
                        } else {
                          handleInputChange('category', value);
                          handleInputChange('customCategory', '');
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        {customCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">➕ Ajouter une nouvelle catégorie</SelectItem>
                      </SelectContent>
                    </Select>
                    {courseData.category === 'custom' && (
                      <div className="mt-2 space-y-2">
                        <Input
                          value={courseData.customCategory}
                          onChange={(e) => handleInputChange('customCategory', e.target.value)}
                          placeholder="Entrez une catégorie personnalisée"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={saveCustomCategory}
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer et ajouter à la liste
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-base">Durée totale</Label>
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

            {/* Modules Step - Code identique à CreateCoursePage mais trop long pour tout inclure ici */}
            {currentStep === 'modules' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Modules et contenus</h2>
                  <Button onClick={addModule} className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>

                <p className="text-sm text-gray-600">
                  📚 {modules.length} module{modules.length > 1 ? 's' : ''} • 
                  📝 {modules.reduce((acc, m) => acc + m.lessons.length, 0)} leçon{modules.reduce((acc, m) => acc + m.lessons.length, 0) > 1 ? 's' : ''}
                </p>

                {modules.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">Aucun module pour le moment</p>
                    <Button onClick={addModule} className="bg-pink-600 hover:bg-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le premier module
                    </Button>
                  </div>
                ) : (
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
                                <RichTextEditor
                                  value={module.description}
                                  onChange={(value) => updateModule(module.id, 'description', value)}
                                  placeholder="Description du module"
                                  height="150px"
                                />
                              </div>
                            </div>

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
                                            <RichTextEditor
                                              value={lesson.content}
                                              onChange={(value) => updateLesson(module.id, lesson.id, { content: value })}
                                              placeholder="Description du contenu..."
                                              height="150px"
                                            />
                                          </div>
                                          <div>
                                            <Label>Média (Vidéo, PDF ou Image)</Label>
                                            <div className="mt-2 space-y-3">
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant={!lesson.useMediaUrl ? "default" : "outline"}
                                                  size="sm"
                                                  onClick={() => updateLesson(module.id, lesson.id, { 
                                                    useMediaUrl: false,
                                                    mediaUrl: '',
                                                    fileType: null,
                                                    fileName: '',
                                                    filePreview: undefined
                                                  })}
                                                >
                                                  <Upload className="h-4 w-4 mr-2" />
                                                  Upload fichier
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant={lesson.useMediaUrl ? "default" : "outline"}
                                                  size="sm"
                                                  onClick={() => updateLesson(module.id, lesson.id, { 
                                                    useMediaUrl: true,
                                                    file: undefined,
                                                    fileType: null,
                                                    fileName: '',
                                                    filePreview: undefined
                                                  })}
                                                >
                                                  <LinkIcon className="h-4 w-4 mr-2" />
                                                  Lien URL
                                                </Button>
                                              </div>

                                              {!lesson.useMediaUrl ? (
                                                <>
                                                  {lesson.filePreview || lesson.video_key ? (
                                                    <div className="space-y-2">
                                                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                                                        <div className="flex items-center space-x-3">
                                                          <Video className="h-5 w-5 text-blue-500" />
                                                          <span className="text-sm font-medium">
                                                            {lesson.fileName || 'Vidéo existante'}
                                                          </span>
                                                        </div>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => updateLesson(module.id, lesson.id, { 
                                                            fileType: null, 
                                                            fileName: '', 
                                                            filePreview: undefined,
                                                            file: undefined,
                                                            video_key: undefined
                                                          })}
                                                        >
                                                          <X className="h-4 w-4" />
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="border-2 border-dashed rounded-lg p-6">
                                                      <input
                                                        type="file"
                                                        accept="video/*,application/pdf,image/*"
                                                        onChange={(e) => handleFileUpload(module.id, lesson.id, e)}
                                                        className="hidden"
                                                        id={`file-${module.id}-${lesson.id}`}
                                                      />
                                                      <label htmlFor={`file-${module.id}-${lesson.id}`}>
                                                        <Button variant="outline" type="button" asChild>
                                                          <span>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Choisir un fichier
                                                          </span>
                                                        </Button>
                                                      </label>
                                                    </div>
                                                  )}
                                                </>
                                              ) : (
                                                <Input
                                                  value={lesson.mediaUrl || ''}
                                                  onChange={(e) => updateLesson(module.id, lesson.id, { mediaUrl: e.target.value })}
                                                  placeholder="https://youtube.com/..."
                                                />
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
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Révision finale</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé du cours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-600">Titre</Label>
                      <p className="font-semibold">{courseData.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Description</Label>
                      <p className="text-sm">{courseData.description.substring(0, 200)}...</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Prix</Label>
                        <p className="font-semibold">{courseData.price ? `${courseData.price}€` : 'Gratuit'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Niveau</Label>
                        <p className="font-semibold capitalize">{courseData.level}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Durée</Label>
                        <p className="font-semibold">{courseData.duration || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Statut</Label>
                      <Badge className={courseData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {courseData.status === 'published' ? 'Publié' : 'Brouillon'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contenu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="text-2xl font-bold">{modules.length}</div>
                            <div className="text-sm text-gray-600">Module{modules.length > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="text-2xl font-bold">
                              {modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Leçon{modules.reduce((acc, m) => acc + m.lessons.length, 0) > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
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
              className="bg-pink-600 hover:bg-pink-700"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleUpdateCourse}
              disabled={saving}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Builders (same as CreateCoursePage) */}
      {showQuizBuilder && (
        <Dialog open={!!showQuizBuilder} onOpenChange={() => setShowQuizBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un quiz pour la leçon</DialogTitle>
            </DialogHeader>
            <QuizBuilder
              onSave={(quiz) => handleSaveQuiz(showQuizBuilder.moduleId, showQuizBuilder.lessonId, quiz)}
              onCancel={() => setShowQuizBuilder(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showModuleQuizBuilder && (
        <Dialog open={!!showModuleQuizBuilder} onOpenChange={() => setShowModuleQuizBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un quiz pour le module</DialogTitle>
            </DialogHeader>
            <QuizBuilder
              onSave={(quiz) => handleSaveModuleQuiz(showModuleQuizBuilder, quiz)}
              onCancel={() => setShowModuleQuizBuilder(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAssignmentBuilder && (
        <Dialog open={!!showAssignmentBuilder} onOpenChange={() => setShowAssignmentBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un devoir pour le module</DialogTitle>
            </DialogHeader>
            <AssignmentBuilder
              onSave={(assignment) => handleSaveAssignment(showAssignmentBuilder, assignment)}
              onCancel={() => setShowAssignmentBuilder(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditCoursePage;
