import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2, Check, BookOpen, ClipboardList, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { CycleTagSelector } from '@/components/admin/CycleTagSelector';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder, AssignmentBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig, QuestionType } from '@/types/quiz';
// RichTextEditor removed - using Textarea for plain text

interface Lesson {
  id: string;
  title: string;
  duration: number;
  content: string;
  fileType: 'video' | 'pdf' | 'image' | null;
  fileName: string;
  filePreview?: string;
  file?: File; // Store the actual file for upload
  uploadedVideoKey?: string; // Store the video_key after upload
  quiz?: QuizConfig; // Quiz optionnel par leçon
  mediaUrl?: string; // URL du média (alternative à l'upload)
  useMediaUrl?: boolean; // Indique si on utilise l'URL au lieu de l'upload
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz?: QuizConfig; // Quiz optionnel au niveau du module
  assignment?: AssignmentConfig; // Devoir optionnel par module
  pedagogicalResources: Array<{
    id: string;
    fileName: string;
    file: File;
  }>; // Ressources pédagogiques en PDF
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  const [trainers, setTrainers] = useState<Array<{ id: string; name: string }>>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
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
    ownerId: 'learneezy', // 'learneezy' or trainer user id
  });

  const [modules, setModules] = useState<ModuleWithLessons[]>([
    {
      id: '1',
      title: 'Module 1',
      description: '',
      lessons: [],
      pedagogicalResources: [],
    }
  ]);

  const [expandedModule, setExpandedModule] = useState<string | null>('1');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);
  
  // États pour les builders
  const [showQuizBuilder, setShowQuizBuilder] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<string | null>(null);
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<string | null>(null);

  // Load trainers on mount
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const { fastAPIClient } = await import('@/services/fastapi-client');
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

  // Load custom categories from localStorage on mount
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
    
    // Check if category already exists
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
    
    // Switch to the newly added category
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

  // Module functions
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
        filePreview: e.target?.result as string,
        file: file // Store the actual file
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

  // Pedagogical Resources functions
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


  const handleCreateCourse = async () => {
    // 1. Valider les données
    if (!courseData.title || !courseData.description) {
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

    // Valider que chaque module a au moins un contenu (leçon, quiz ou devoir)
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

    try {
      const { fastAPIClient } = await import('@/services/fastapi-client');
      const { calculateModuleDuration } = await import('@/utils/courseHelpers');
      
      toast({
        title: "Upload des vidéos...",
        description: "Téléchargement des vidéos des leçons",
      });

      // 2. UPLOADER TOUTES LES VIDÉOS DES LEÇONS AVANT LA CRÉATION DU COURS
      for (const module of modules) {
        for (const lesson of module.lessons) {
          if (lesson.file && lesson.fileType === 'video') {
            try {
              console.log(`📤 Upload vidéo: ${lesson.fileName}`);
              
              // a) Préparer l'upload
              const prepareResponse = await fastAPIClient.prepareUpload(
                lesson.file.name,
                lesson.file.type,
                lesson.file.size
              );

              console.log('✅ Prepare response:', prepareResponse);

              // b) Upload direct vers URL présignée
              if (prepareResponse.strategy === 'single' && prepareResponse.url && prepareResponse.headers) {
                // Single-part upload
                const uploadHeaders = new Headers(prepareResponse.headers);
                await fetch(prepareResponse.url, {
                  method: 'PUT',
                  headers: uploadHeaders,
                  body: lesson.file
                });
              } else if (prepareResponse.strategy === 'multipart' && prepareResponse.parts) {
                // Multipart upload
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

                // c) Finaliser l'upload multipart
                await fastAPIClient.completeUpload({
                  strategy: 'multipart',
                  key: prepareResponse.key,
                  upload_id: prepareResponse.upload_id!,
                  parts,
                  content_type: lesson.file.type,
                  size: lesson.file.size
                });
              }

              // c) Finaliser l'upload (single)
              if (prepareResponse.strategy === 'single') {
                await fastAPIClient.completeUpload({
                  strategy: 'single',
                  key: prepareResponse.key,
                  content_type: lesson.file.type,
                  size: lesson.file.size
                });
              }

              // d) Stocker la key dans la leçon
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
                description: `Impossible d'uploader ${lesson.fileName}. Continuer sans cette vidéo ?`,
                variant: "destructive"
              });
            }
          }
        }
      }

      toast({
        title: "Création du cours...",
        description: "Envoi des données au serveur",
      });

      // 3. Construire le payload complet avec toutes les video_key
      const finalCategory = courseData.category === 'custom' 
        ? courseData.customCategory 
        : courseData.category;

      // Préparer les category_names pour la nouvelle API
      const categoryNames = finalCategory ? [finalCategory] : null;

      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        price: parseFloat(courseData.price) || null,
        category: finalCategory || null, // Legacy field
        category_names: categoryNames, // New field
        allow_create_categories: true, // Allow creating new categories
        duration: courseData.duration || null,
        level: courseData.level || null,
        learning_cycle: courseData.cycle || null,
        levels: courseData.cycleTags.length > 0 ? courseData.cycleTags : null,
        cover_key: null, // TODO: Upload cover image
        program_pdf_key: null, // TODO: Upload program PDF
        modules: modules.map(module => ({
          title: module.title,
          description: module.description || `Description du ${module.title}`,
          duration: calculateModuleDuration(module.lessons),
          content: module.lessons.map(lesson => ({
            title: lesson.title,
            duration: lesson.duration.toString() + 'min',
            description: lesson.content,
            video_key: lesson.uploadedVideoKey || null, // 🔑 Storage key
            video_url: lesson.mediaUrl || null, // External URL fallback
            transcription: null
          })),
          quizzes: [] // TODO: Ajouter les quizzes
        })),
        resources: []
      };

      // 4. Créer le cours avec tous les modules et leçons en une seule requête
      const courseResponse = await fastAPIClient.createCourse(coursePayload);
      
      // Logs de débogage pour comprendre la réponse du backend
      console.log('🔍 Réponse complète de createCourse:', courseResponse);
      console.log('📦 Type de courseResponse:', typeof courseResponse);
      console.log('🗂️ Clés disponibles:', Object.keys(courseResponse));
      
      // Gérer différents formats de réponse du backend (id, course.id, course._id, course_id, _id)
      const courseId = 
        courseResponse.id || 
        (courseResponse as any).course?.id || 
        (courseResponse as any).course?._id || 
        (courseResponse as any).course_id || 
        (courseResponse as any)._id;
      console.log('🔑 CourseId extrait:', courseId);

      // Vérifier que l'ID existe avant de continuer
      if (!courseId) {
        console.error('❌ Le backend n\'a pas retourné d\'ID de cours valide');
        console.error('Réponse du backend:', courseResponse);
        throw new Error('Le backend n\'a pas retourné d\'ID de cours valide');
      }

      toast({
        title: "Cours créé",
        description: `Le cours "${courseData.title}" a été créé avec ${modules.length} module(s)`,
      });

      toast({
        title: "✅ Cours créé avec succès",
        description: `Le cours "${courseData.title}" est maintenant disponible`,
      });
      
      // Naviguer avec un state pour déclencher le rechargement de la liste
      navigate(coursesBasePath, { 
        state: { courseCreated: true, courseId } 
      });
      
    } catch (error: any) {
      console.error('Erreur création cours:', error);
      toast({
        title: "Erreur",
        description: error?.response?.data?.detail || error?.message || "Une erreur est survenue lors de la création du cours",
        variant: "destructive"
      });
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
                      rows={8}
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
                    <Label className="text-base">Durée </Label>
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

                <CycleTagSelector
                  selectedCycle={courseData.cycle}
                  selectedTags={courseData.cycleTags}
                  onCycleChange={(cycle) => setCourseData(prev => ({ ...prev, cycle }))}
                  onTagsChange={(tags) => setCourseData(prev => ({ ...prev, cycleTags: tags }))}
                />

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
                  <Label className="text-base">Programme de formation (PDF)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                    {courseData.programFileName ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FileText className="h-6 w-6" />
                          <span className="font-medium">{courseData.programFileName}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCourseData(prev => ({ 
                            ...prev, 
                            programFile: null, 
                            programFileName: '' 
                          }))}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-3">Glissez votre PDF ici ou cliquez pour sélectionner</p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleProgramUpload}
                          className="hidden"
                          id="program-upload"
                        />
                        <label htmlFor="program-upload">
                          <Button variant="outline" size="sm" className="cursor-pointer" type="button" asChild>
                            <span>Choisir un fichier PDF</span>
                          </Button>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base">Propriétaire du cours</Label>
                  <Select 
                    value={courseData.ownerId} 
                    onValueChange={(value) => handleInputChange('ownerId', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner le propriétaire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learneezy">Learneezy</SelectItem>
                      {trainers.map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Le propriétaire est le formateur responsable du cours
                  </p>
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
                                rows={5}
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
                                            rows={5}
                                            className="mt-2"
                                          />
                                        </div>
                                        <div>
                                          <Label>Média (Vidéo, PDF ou Image)</Label>
                                          <div className="mt-2 space-y-3">
                                            {/* Toggle entre Upload et URL */}
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

                                            {/* Upload Mode */}
                                            {!lesson.useMediaUrl && (
                                              <>
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
                                                          filePreview: undefined,
                                                          file: undefined
                                                        })}
                                                      >
                                                        <X className="h-4 w-4" />
                                                      </Button>
                                                     </div>
                                                    
                                                    {/* Aperçu du fichier uploadé */}
                                                    <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                                                      <div className="text-sm font-medium mb-2">Aperçu :</div>
                                                      
                                                      {/* Image preview */}
                                                      {lesson.fileType === 'image' && lesson.filePreview && (
                                                        <img 
                                                          src={lesson.filePreview} 
                                                          alt="Preview" 
                                                          className="max-h-48 rounded border w-full object-contain"
                                                        />
                                                      )}
                                                      
                                                      {/* Video preview */}
                                                      {lesson.fileType === 'video' && lesson.filePreview && (
                                                        <video 
                                                          src={lesson.filePreview} 
                                                          controls 
                                                          className="max-h-64 rounded border w-full"
                                                        >
                                                          Votre navigateur ne supporte pas la lecture vidéo.
                                                        </video>
                                                      )}
                                                      
                                                      {/* PDF preview */}
                                                      {lesson.fileType === 'pdf' && lesson.filePreview && (
                                                        <embed
                                                          src={lesson.filePreview}
                                                          type="application/pdf"
                                                          className="w-full h-96 rounded border"
                                                        />
                                                      )}
                                                    </div>
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
                                              </>
                                            )}

                                            {/* URL Mode */}
                                            {lesson.useMediaUrl && (
                                              <div className="space-y-3">
                                                <div className="flex gap-2">
                                                  <Input
                                                    value={lesson.mediaUrl || ''}
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { mediaUrl: e.target.value })}
                                                    placeholder="https://example.com/video.mp4 ou https://youtube.com/..."
                                                    className="flex-1"
                                                  />
                                                  {lesson.mediaUrl && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => updateLesson(module.id, lesson.id, { mediaUrl: '' })}
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  )}
                                                </div>

                                                {/* Aperçu de l'URL */}
                                                {lesson.mediaUrl && (
                                                  <div className="border rounded-lg p-3 bg-gray-50">
                                                    <div className="text-sm font-medium mb-2">Aperçu :</div>
                                                    {/* Image preview */}
                                                    {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(lesson.mediaUrl) && (
                                                      <img 
                                                        src={lesson.mediaUrl} 
                                                        alt="Preview" 
                                                        className="max-h-48 rounded border"
                                                        onError={(e) => {
                                                          (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                      />
                                                    )}
                                                    {/* Video preview */}
                                                    {/\.(mp4|webm|ogg)$/i.test(lesson.mediaUrl) && (
                                                      <video 
                                                        src={lesson.mediaUrl} 
                                                        controls 
                                                        className="max-h-48 rounded border w-full"
                                                        onError={(e) => {
                                                          (e.target as HTMLVideoElement).style.display = 'none';
                                                        }}
                                                      >
                                                        Votre navigateur ne supporte pas la lecture vidéo.
                                                      </video>
                                                    )}
                                                    {/* YouTube/Vimeo embed preview */}
                                                    {(/youtube\.com|youtu\.be|vimeo\.com/i.test(lesson.mediaUrl)) && (
                                                      <div className="aspect-video">
                                                        <iframe
                                                          src={
                                                            lesson.mediaUrl.includes('youtube.com') || lesson.mediaUrl.includes('youtu.be')
                                                              ? `https://www.youtube.com/embed/${lesson.mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || ''}`
                                                              : lesson.mediaUrl.includes('vimeo.com')
                                                              ? `https://player.vimeo.com/video/${lesson.mediaUrl.match(/vimeo\.com\/(\d+)/)?.[1] || ''}`
                                                              : lesson.mediaUrl
                                                          }
                                                          className="w-full h-full rounded border"
                                                          allowFullScreen
                                                        />
                                                      </div>
                                                    )}
                                                    {/* PDF preview */}
                                                    {/\.pdf$/i.test(lesson.mediaUrl) && (
                                                      <div className="flex items-center gap-2 text-sm">
                                                        <FileText className="h-5 w-5 text-red-500" />
                                                        <span>Fichier PDF</span>
                                                        <a 
                                                          href={lesson.mediaUrl} 
                                                          target="_blank" 
                                                          rel="noopener noreferrer"
                                                          className="text-blue-600 hover:underline"
                                                        >
                                                          Ouvrir
                                                        </a>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
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
                            {module.lessons.length > 0 && (
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
                            )}

                            {/* Quiz Section for Module (Direct) */}
                            <div className="space-y-4 border-t pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="h-5 w-5 text-blue-600" />
                                  <h4 className="font-semibold text-lg">Quiz du module</h4>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-4">
                                Ajoutez un quiz directement au module (sans créer de leçon).
                              </div>
                              {module.quiz ? (
                                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <CardTitle className="text-lg">{module.quiz.title}</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {module.quiz.questions.length} questions • 
                                          Note de passage: {module.quiz.settings.passingScore}%
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setShowModuleQuizBuilder(module.id)}
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveModuleQuiz(module.id)}
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
                                  onClick={() => setShowModuleQuizBuilder(module.id)}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Créer un quiz pour ce module
                                </Button>
                              )}
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

                            {/* Pedagogical Resources Section */}
                            <div className="space-y-4 border-t pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-orange-600" />
                                  <h4 className="font-semibold text-lg">Ressources pédagogiques</h4>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-4">
                                Ajoutez des documents PDF supplémentaires pour enrichir ce module (guides, fiches de synthèse, etc.).
                              </div>
                              
                              {/* Display existing resources */}
                              {module.pedagogicalResources.length > 0 && (
                                <div className="space-y-2">
                                  {module.pedagogicalResources.map((resource) => (
                                    <Card key={resource.id} className="bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-red-500" />
                                            <span className="font-medium">{resource.fileName}</span>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemovePedagogicalResource(module.id, resource.id)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}

                              {/* Add new resource */}
                              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-3">Fichier PDF uniquement</p>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleAddPedagogicalResource(module.id, file);
                                    e.target.value = ''; // Reset input
                                  }}
                                  className="hidden"
                                  id={`pedagogical-resource-${module.id}`}
                                />
                                <label htmlFor={`pedagogical-resource-${module.id}`}>
                                  <Button variant="outline" size="sm" type="button" asChild>
                                    <span>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Ajouter une ressource PDF
                                    </span>
                                  </Button>
                                </label>
                              </div>
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
                      {courseData.cycle && (
                        <>
                          <div>
                            <Label className="text-gray-600">Cycle</Label>
                            <p className="font-medium capitalize">{courseData.cycle.replace('_', ' ')}</p>
                          </div>
                          {courseData.cycleTags.length > 0 && (
                            <div className="col-span-2">
                              <Label className="text-gray-600">Niveaux du cycle</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {courseData.cycleTags.map(tag => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
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
                            {modules.reduce((sum, m) => sum + m.lessons.filter(l => l.quiz).length + (m.quiz ? 1 : 0), 0)}
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
                              {module.quiz && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                  <HelpCircle className="h-4 w-4" />
                                  <span>Quiz du module: {module.quiz.title} ({module.quiz.questions.length} questions)</span>
                                </div>
                              )}
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

        {/* Module Quiz Builder Modal */}
        {showModuleQuizBuilder && (
          <Dialog open={!!showModuleQuizBuilder} onOpenChange={() => setShowModuleQuizBuilder(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurer le quiz du module</DialogTitle>
              </DialogHeader>
              <QuizBuilder
                quiz={modules.find(m => m.id === showModuleQuizBuilder)?.quiz}
                onSave={(quiz) => handleSaveModuleQuiz(showModuleQuizBuilder, quiz)}
                onCancel={() => setShowModuleQuizBuilder(null)}
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
      </div>
    </div>
  );
};

export default CreateCoursePage;
