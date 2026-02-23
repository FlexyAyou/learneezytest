import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
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
import { Upload, Plus, X, Save, ArrowLeft, ArrowRight, Video, FileText, Image as ImageIcon, Edit2, Trash2, Check, BookOpen, ClipboardList, HelpCircle, Link as LinkIcon, Loader2, Download, ChevronDown, GripVertical } from 'lucide-react';
import VideoPlayer from '@/components/common/VideoPlayer';
import { CycleTagSelector } from '@/components/admin/CycleTagSelector';
import { CategoryTagSelector } from '@/components/admin/CategoryTagSelector';
import { CourseTutorialModal } from '@/components/admin/CourseTutorialModal';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder, AssignmentBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig, QuestionType } from '@/types/quiz';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { uploadDirect } from '@/utils/upload';
import { UploadProgressModal, UploadedFile, FileUploadType } from '@/components/course-creation/UploadProgressModal';
import { useCategories, useCreateCategory } from '@/hooks/useApi';
import { UploadNotification, UploadItem } from '@/components/common/UploadNotification';
import { useLocalStorageDraft } from '@/hooks/useLocalStorageDraft';
import { RestoreDraftDialog } from '@/components/admin/RestoreDraftDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2 as TrashIcon } from 'lucide-react';
import { SortableContentList, ContentItem } from '@/components/course-creation/SortableContentList';
import { SortableModuleList } from '@/components/course-creation/SortableModuleList';

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
  uploadedPdfKey?: string; // Store the pdf_key after upload
  uploadedImageKey?: string; // Store the image_key after upload
  mediaUrl?: string; // URL du média (alternative à l'upload)
  useMediaUrl?: boolean; // Indique si on utilise l'URL au lieu de l'upload
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizzes: QuizConfig[]; // Plusieurs quiz au niveau du module
  assignment?: AssignmentConfig; // Devoir optionnel par module
  order?: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }>; // Ordre unifié des contenus
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  const queryClient = useQueryClient();
  const { organization, isOFContext } = useOrganization();

  // Détecter si on est dans le contexte gestionnaire, OF ou superadmin
  const isManagerContext = location.pathname.includes('/gestionnaire/');
  const isOFAdminContext = location.pathname.includes('/organisme-formation/');

  let coursesBasePath = '/dashboard/superadmin/courses';
  if (isManagerContext) {
    coursesBasePath = '/dashboard/gestionnaire/courses';
  } else if (isOFAdminContext) {
    coursesBasePath = '/dashboard/organisme-formation/formations';
  }

  // Déterminer le propriétaire par défaut
  const defaultOwner = isOFContext && organization ? organization.slug : 'Learneezy';
  const defaultOwnerId = isOFContext && organization ? `of_${organization.slug}` : 'learneezy';

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    customCategory: '',
    duration: '',
    level: 'debutant',
    cycle: '' as '' | 'primaire' | 'college' | 'lycee' | 'formation_pro',
    cycleTags: [] as string[],
    image: null as File | null,
    imagePreview: null as string | null,
    objectives: [''],
    programFile: null as File | null,
    programFileName: '',
    ownerId: defaultOwnerId,
    pedagogicalResources: [] as Array<{
      id: string;
      name: string;
      file: File;
      key: string | null;
      size: number | null;
      url: string | null;
    }>,
    resourcesDownloadable: true, // Par défaut, les ressources sont téléchargeables
    isVisible: true,
    isOpenSource: false,
    tokenPrice: 0,
    organisationAccess: 'all' as 'all' | 'restricted' | 'none',
  });

  // Hooks pour les catégories (après courseData)
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const [modules, setModules] = useState<ModuleWithLessons[]>([
    {
      id: '1',
      title: 'Module 1',
      description: '',
      lessons: [],
      quizzes: [],
    }
  ]);

  const [expandedModule, setExpandedModule] = useState<string | null>('1');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string | null } | null>(null);

  // États pour les builders
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<string | null>(null);
  const [editingQuizIndex, setEditingQuizIndex] = useState<number | null>(null); // Pour éditer un quiz existant
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<string | null>(null);

  // États pour le tracking des uploads
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    currentFile: '',
    currentFileType: undefined as FileUploadType | undefined,
    uploadedFiles: [] as UploadedFile[],
    totalFiles: 0,
    progress: 0
  });

  // État pour le tutoriel
  const [showTutorial, setShowTutorial] = useState(false);

  // Upload notification state pour uploads individuels
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  // État de chargement local pour les fichiers en mémoire
  const [fileLoadingState, setFileLoadingState] = useState<{
    [lessonId: string]: { loading: boolean; fileName: string; progress: number }
  }>({});

  // LocalStorage draft hook
  const draftKey = isManagerContext ? 'course-draft-manager' : 'course-draft-superadmin';
  const { saveDraft, loadDraft, clearDraft, hasDraft, lastSaved } = useLocalStorageDraft({ key: draftKey });

  // État pour le dialog de restauration
  const [showRestoreDraftDialog, setShowRestoreDraftDialog] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState<any>(null);

  // Charger le brouillon au montage
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setDraftToRestore(draft);
      setShowRestoreDraftDialog(true);
    }
  }, []);

  // Auto-save avec debounce (toutes les 3 secondes après modification)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDraft({
        courseData,
        modules,
        currentStep,
        expandedModule,
      });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [courseData, modules, currentStep, expandedModule, saveDraft]);

  // Handlers pour le dialog de restauration
  const handleRestoreDraft = () => {
    if (draftToRestore) {
      setCourseData(draftToRestore.courseData);
      setModules(draftToRestore.modules);
      setCurrentStep(draftToRestore.currentStep);
      setExpandedModule(draftToRestore.expandedModule || null);

      toast({
        title: "Brouillon restauré",
        description: "Vous pouvez continuer votre création de cours",
      });
    }
    setShowRestoreDraftDialog(false);
    setDraftToRestore(null);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowRestoreDraftDialog(false);
    setDraftToRestore(null);

    toast({
      title: "Brouillon supprimé",
      description: "Vous repartez avec une création vierge",
    });
  };

  const handleClearDraft = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer le brouillon sauvegardé ?")) {
      clearDraft();
      toast({
        title: "Brouillon supprimé",
        description: "Le brouillon a été effacé",
      });
    }
  };

  const saveCustomCategory = async () => {
    if (!courseData.customCategory.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de catégorie",
        variant: "destructive"
      });
      return;
    }

    const newCategory = courseData.customCategory.trim();

    try {
      const created = await createCategoryMutation.mutateAsync({ name: newCategory });

      // Mettre à jour le cache immédiatement pour que la catégorie apparaisse dans la liste
      queryClient.setQueryData(['categories'], (old: any) => {
        if (Array.isArray(old)) {
          const exists = old.some((c: any) => c?.name === created?.name);
          return exists ? old : [...old, created];
        }
        return created ? [created] : [];
      });

      // Sélectionner automatiquement la nouvelle catégorie
      handleInputChange('category', created?.name || newCategory);
      handleInputChange('customCategory', '');
    } catch (error) {
      // L'erreur est déjà gérée par le hook
      console.error('Error creating category:', error);
    }
  };

  // Plus de création de niveaux: suppression de /api/levels et des niveaux dynamiques

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
      quizzes: [],
    };
    setModules([...modules, newModule]);
    setExpandedModule(newModule.id);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleReorderModules = (reorderedModules: ModuleWithLessons[]) => {
    setModules(reorderedModules);
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
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const newLessons = [...m.lessons, newLesson];
        // Mettre à jour l'ordre unifié
        const newOrder = [...(m.order || []), { type: 'lesson' as const, id: newLesson.id }];
        return { ...m, lessons: newLessons, order: newOrder };
      }
      return m;
    }));
    setEditingLesson({ moduleId, lessonId: newLesson.id });
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const newLessons = m.lessons.filter(l => l.id !== lessonId);
        // Retirer de l'ordre unifié aussi
        const newOrder = (m.order || []).filter(item => !(item.type === 'lesson' && item.id === lessonId));
        return { ...m, lessons: newLessons, order: newOrder };
      }
      return m;
    }));
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

    // Validation de taille de fichier
    const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB pour les vidéos
    const MAX_PDF_SIZE = 50 * 1024 * 1024;    // 50MB pour les PDFs
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10MB pour les images

    let maxSize = MAX_VIDEO_SIZE;
    let maxSizeLabel = "500MB";

    if (fileType === 'pdf') {
      maxSize = MAX_PDF_SIZE;
      maxSizeLabel = "50MB";
    } else if (fileType === 'image') {
      maxSize = MAX_IMAGE_SIZE;
      maxSizeLabel = "10MB";
    }

    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale pour ${fileType === 'video' ? 'une vidéo' : fileType === 'pdf' ? 'un PDF' : 'une image'} est de ${maxSizeLabel}. Votre fichier fait ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        variant: "destructive"
      });
      return;
    }

    const isLargeFile = file.size > 50 * 1024 * 1024; // >50MB

    // Initialiser l'état de chargement
    setFileLoadingState(prev => ({
      ...prev,
      [lessonId]: { loading: true, fileName: file.name, progress: 0 }
    }));

    // Pour les gros fichiers, ajouter à UploadNotification
    let uploadId: string | null = null;
    if (isLargeFile) {
      uploadId = `memory-${lessonId}-${Date.now()}`;
      setUploads(prev => [...prev, {
        id: uploadId!,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      toast({
        title: "⚠️ Chargement en mémoire",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) - Veuillez patienter...`,
      });
    } else {
      toast({
        title: "Chargement du fichier",
        description: `${file.name} en cours de chargement...`,
      });
    }

    // Simuler la progression pour les gros fichiers
    let progressInterval: NodeJS.Timeout | null = null;
    if (isLargeFile) {
      let simulatedProgress = 0;
      progressInterval = setInterval(() => {
        simulatedProgress += 5;
        if (simulatedProgress > 90) {
          if (progressInterval) clearInterval(progressInterval);
          return;
        }

        setFileLoadingState(prev => ({
          ...prev,
          [lessonId]: { ...prev[lessonId], progress: simulatedProgress }
        }));

        if (uploadId) {
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? { ...u, progress: simulatedProgress } : u
          ));
        }
      }, 300);
    }

    const reader = new FileReader();

    reader.onerror = () => {
      if (progressInterval) clearInterval(progressInterval);

      setFileLoadingState(prev => {
        const newState = { ...prev };
        delete newState[lessonId];
        return newState;
      });

      if (uploadId) {
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? { ...u, status: 'error' as const } : u
        ));
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== uploadId));
        }, 3000);
      }

      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire le fichier",
        variant: "destructive"
      });
    };

    reader.onload = (e) => {
      if (progressInterval) clearInterval(progressInterval);

      // Compléter la progression à 100%
      setFileLoadingState(prev => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], progress: 100 }
      }));

      if (uploadId) {
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? { ...u, progress: 100, status: 'completed' as const } : u
        ));
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== uploadId));
        }, 2000);
      }

      updateLesson(moduleId, lessonId, {
        fileType,
        fileName: file.name,
        filePreview: e.target?.result as string,
        file: file // Store the actual file
      });

      // Nettoyer l'état de chargement
      setTimeout(() => {
        setFileLoadingState(prev => {
          const newState = { ...prev };
          delete newState[lessonId];
          return newState;
        });
      }, 500);

      toast({
        title: "Fichier chargé",
        description: `${file.name} prêt pour l'upload`,
      });
    };

    reader.readAsDataURL(file);
  };

  // Quiz/Assignment/Certification functions
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

  const handleContentReorder = (moduleId: string, reorderedItems: ContentItem[]) => {
    const lessons = reorderedItems.filter(item => item.type === 'lesson').map(item => item.data);
    const quizzes = reorderedItems.filter(item => item.type === 'quiz').map(item => item.data);

    setModules(modules.map(m =>
      m.id === moduleId ? { ...m, lessons, quizzes } : m
    ));
  };

  const handleSaveModuleQuiz = (moduleId: string, quiz: QuizConfig) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        let newQuizzes = [...m.quizzes];
        let quizId: string;

        if (editingQuizIndex !== null) {
          // Modifier un quiz existant
          newQuizzes[editingQuizIndex] = quiz;
          quizId = `quiz-${moduleId}-${editingQuizIndex}`;
        } else {
          // Ajouter un nouveau quiz
          newQuizzes = [...m.quizzes, quiz];
          quizId = `quiz-${moduleId}-${newQuizzes.length - 1}`;
          // Ajouter à l'ordre unifié
          const newOrder = [...(m.order || []), { type: 'quiz' as const, id: quizId }];
          return { ...m, quizzes: newQuizzes, order: newOrder };
        }
        return { ...m, quizzes: newQuizzes };
      }
      return m;
    }));
    setShowModuleQuizBuilder(null);
    setEditingQuizIndex(null);
    toast({
      title: editingQuizIndex !== null ? "Quiz modifié" : "Quiz ajouté",
      description: editingQuizIndex !== null ? "Le quiz a été mis à jour" : "Le quiz a été ajouté au module"
    });
  };

  const handleDeleteModuleQuiz = (moduleId: string, quizIndex: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          const updatedQuizzes = m.quizzes.filter((_, idx) => idx !== quizIndex);
          // Retirer de l'ordre unifié aussi
          const quizId = `quiz-${moduleId}-${quizIndex}`;
          const newOrder = (m.order || []).filter(item => !(item.type === 'quiz' && item.id === quizId));
          return { ...m, quizzes: updatedQuizzes, order: newOrder };
        }
        return m;
      }));
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été retiré du module"
      });
    }
  };

  const handleEditModuleQuiz = (moduleId: string, quizIndex: number) => {
    setShowModuleQuizBuilder(moduleId);
    setEditingQuizIndex(quizIndex);
  };

  // Reorder content (lessons and quizzes) within a module
  const handleReorderContent = (moduleId: string, reorderedItems: ContentItem[]) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        // Séparer les leçons et quizzes réorganisés
        const newLessons: Lesson[] = [];
        const newQuizzes: QuizConfig[] = [];

        reorderedItems.forEach(item => {
          if (item.type === 'lesson') {
            newLessons.push(item.data);
          } else {
            newQuizzes.push(item.data);
          }
        });

        return { ...m, lessons: newLessons, quizzes: newQuizzes };
      }
      return m;
    }));
  };

  // Pedagogical Resources functions
  const handleAddPedagogicalResource = (file: File) => {
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
      name: file.name,
      file: file,
      key: null,
      size: null,
      url: null,
    };

    setCourseData({
      ...courseData,
      pedagogicalResources: [...courseData.pedagogicalResources, resource]
    });

    toast({
      title: "Ressource ajoutée",
      description: file.name
    });
  };

  const handleRemovePedagogicalResource = (resourceId: string) => {
    setCourseData({
      ...courseData,
      pedagogicalResources: courseData.pedagogicalResources.filter(r => r.id !== resourceId)
    });

    toast({
      title: "Ressource supprimée",
      description: "La ressource a été retirée du cours",
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
      m.lessons.length === 0 && m.quizzes.length === 0 && !m.assignment
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

      let uploadedCoverKey: string | null = null;
      let uploadedProgramKey: string | null = null;

      // 1. UPLOADER L'IMAGE DE COUVERTURE
      if (courseData.image) {
        try {
          console.log('📤 Upload image de couverture:', courseData.image.name);
          toast({
            title: "Upload de l'image...",
            description: "Téléchargement de l'image de couverture",
          });

          const up = await uploadDirect(courseData.image, 'image');
          uploadedCoverKey = up.key;
          console.log('✅ Image de couverture uploadée:', uploadedCoverKey);
          toast({
            title: "Image uploadée",
            description: "L'image de couverture est prête",
          });
        } catch (error) {
          console.error('❌ Erreur upload image:', error);
          toast({
            title: "Erreur d'upload",
            description: "Impossible d'uploader l'image de couverture",
            variant: "destructive"
          });
        }
      }

      // 2. UPLOADER LE PROGRAMME PDF
      if (courseData.programFile) {
        try {
          console.log('📤 Upload programme PDF:', courseData.programFile.name);
          toast({
            title: "Upload du programme...",
            description: "Téléchargement du programme PDF",
          });

          const up = await uploadDirect(courseData.programFile, 'pdf');
          uploadedProgramKey = up.key;
          console.log('✅ Programme PDF uploadé:', uploadedProgramKey);
          toast({
            title: "Programme uploadé",
            description: "Le programme PDF est prêt",
          });
        } catch (error) {
          console.error('❌ Erreur upload programme:', error);
          toast({
            title: "Erreur d'upload",
            description: "Impossible d'uploader le programme PDF",
            variant: "destructive"
          });
        }
      }

      // Compter le nombre total de TOUS les fichiers à uploader (vidéos, PDFs, images)
      const allLessonsWithFiles = modules.flatMap(m =>
        m.lessons.filter(l => l.file && l.fileType)
      );
      const totalFiles = allLessonsWithFiles.length;

      if (totalFiles > 0) {
        setUploadProgress({
          isUploading: true,
          currentFile: '',
          currentFileType: undefined,
          uploadedFiles: [],
          totalFiles: totalFiles,
          progress: 0
        });

        let uploadedCount = 0;

        // 3. UPLOADER TOUS LES MÉDIAS (VIDÉOS, PDFs, IMAGES) DES LEÇONS AVANT LA CRÉATION DU COURS
        for (const module of modules) {
          for (const lesson of module.lessons) {
            if (lesson.file && lesson.fileType) {
              try {
                const currentFileName = lesson.fileName;
                const currentFileType = lesson.fileType;

                // Déterminer le kind d'upload selon le type
                const uploadKind = lesson.fileType === 'video' ? 'video'
                  : lesson.fileType === 'pdf' ? 'pdf'
                    : 'image';

                // Mettre à jour le fichier en cours
                setUploadProgress(prev => ({
                  ...prev,
                  currentFile: currentFileName,
                  currentFileType: currentFileType,
                  progress: Math.round((uploadedCount / totalFiles) * 100)
                }));

                console.log(`📤 Upload ${currentFileType}: ${currentFileName}`);

                // Upload avec callback de progression
                const uploadResult = await uploadDirect(lesson.file, uploadKind, {
                  onProgress: (uploaded, total) => {
                    const fileProgress = (uploaded / total) * 100;
                    const globalProgress = ((uploadedCount + fileProgress / 100) / totalFiles) * 100;
                    setUploadProgress(prev => ({
                      ...prev,
                      progress: Math.round(globalProgress)
                    }));
                  }
                });

                // Stocker la key selon le type
                if (lesson.fileType === 'video') {
                  lesson.uploadedVideoKey = uploadResult.key;
                } else if (lesson.fileType === 'pdf') {
                  lesson.uploadedPdfKey = uploadResult.key;
                } else if (lesson.fileType === 'image') {
                  lesson.uploadedImageKey = uploadResult.key;
                }

                uploadedCount++;

                // Ajouter à la liste des fichiers uploadés
                setUploadProgress(prev => ({
                  ...prev,
                  uploadedFiles: [...prev.uploadedFiles, { name: currentFileName, type: currentFileType }],
                  progress: Math.round((uploadedCount / totalFiles) * 100)
                }));

                console.log(`✅ ${currentFileType} uploadé: ${currentFileName} → ${uploadResult.key}`);

              } catch (uploadError: any) {
                console.error(`❌ Erreur upload ${lesson.fileType} ${lesson.fileName}:`, uploadError);
                toast({
                  title: "Erreur d'upload",
                  description: `Impossible d'uploader ${lesson.fileName}`,
                  variant: "destructive"
                });
              }
            }
          }
        }

        // Fermer le modal de progression
        setUploadProgress(prev => ({ ...prev, isUploading: false }));
      }

      // 4. UPLOADER LES RESSOURCES PÉDAGOGIQUES
      const uploadedResources: Array<{
        name: string;
        key: string;
        size: number;
        url?: string;
      }> = [];

      for (const resource of courseData.pedagogicalResources) {
        try {
          console.log(`📤 Upload ressource: ${resource.name}`);

          const upRes = await uploadDirect(resource.file, 'pdf');
          uploadedResources.push({
            name: resource.file.name,
            key: upRes.key,
            size: resource.file.size,
            url: upRes.url || undefined
          });
          console.log(`✅ Ressource uploadée: ${resource.file.name}`, {
            key: upRes.key,
            size: resource.file.size,
            url: upRes.url
          });
        } catch (error) {
          console.error(`❌ Erreur upload ressource ${resource.name}:`, error);
          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${resource.name}`,
            variant: "destructive"
          });
        }
      }

      toast({
        title: "Création du cours...",
        description: "Envoi des données au serveur",
      });

      // 5. Construire le payload complet avec toutes les keys
      const finalCategory = courseData.category === 'custom'
        ? courseData.customCategory
        : courseData.category;

      // Préparer les category_names pour la nouvelle API
      const categoryNames = finalCategory ? [finalCategory] : null;

      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        objectives: courseData.objectives.filter(obj => obj.trim() !== ''),
        price: parseFloat(courseData.price) || null,
        category: finalCategory || null, // Legacy field
        category_names: categoryNames, // New field
        allow_create_categories: true, // Allow creating new categories
        duration: courseData.duration || null,
        level: courseData.level || null,
        learning_cycle: courseData.cycle || null,
        levels: courseData.cycleTags.length > 0 ? courseData.cycleTags : null,
        cover_key: uploadedCoverKey,
        program_pdf_key: uploadedProgramKey,
        // Propriétaire du cours: OF si contexte OF, sinon Learneezy
        owner_type: (isOFContext && organization?.organizationId) ? 'of' as const : 'learneezy' as const,
        owner_id: (isOFContext && organization?.organizationId) ? organization.organizationId : null,
        is_visible: courseData.isVisible,
        is_open_source: courseData.isOpenSource,
        token_price: courseData.isOpenSource ? (parseInt(courseData.tokenPrice.toString()) || 0) : 0,
        organisation_access: courseData.organisationAccess,
        modules: modules.map(module => ({
          title: module.title,
          description: module.description || `Description du ${module.title}`,
          duration: calculateModuleDuration(module.lessons),
          content: module.lessons.map(lesson => ({
            title: lesson.title,
            duration: lesson.duration.toString() + 'min',
            description: lesson.content,
            video_key: lesson.uploadedVideoKey || null, // 🔑 Storage key
            pdf_key: lesson.uploadedPdfKey || null, // 🔑 Storage key pour PDF
            image_key: lesson.uploadedImageKey || null, // 🔑 Storage key pour image
            video_url: lesson.mediaUrl || null, // External URL fallback
            transcription: null
          })),
          quizzes: module.quizzes.map(quiz => ({
            title: quiz.title,
            questions: quiz.questions.map(q => {
              // Mapping aligné au modèle backend QuizQuestion (snake_case)
              const base: any = {
                type: q.type,
                question: q.question,
              };

              if (q.type === 'single-choice') {
                const scq: any = q;
                base.options = scq.options || [];
                base.correct_answer = base.options[scq.correctAnswer] ?? base.options[0] ?? '';
              } else if (q.type === 'multiple-choice') {
                const mcq: any = q;
                base.options = mcq.options || [];
                const answers = (mcq.correctAnswers || []).map((idx: number) => base.options[idx]).filter(Boolean);
                base.correct_answer = answers.length ? answers : [base.options[0]].filter(Boolean); // liste attendue
              } else if (q.type === 'true-false') {
                const tfq: any = q;
                base.options = ['Vrai', 'Faux'];
                base.correct_answer = !!tfq.correctAnswer; // bool attendu
              } else if (q.type === 'short-answer') {
                const saq: any = q;
                base.correct_answer = (saq.correctAnswers || []).filter((s: string) => !!s.trim()); // liste de réponses
                base.case_sensitive = !!saq.caseSensitive;
              } else if (q.type === 'long-answer') {
                const laq: any = q;
                base.min_words = laq.minWords || undefined;
                base.max_words = laq.maxWords || undefined;
                base.rubric = laq.rubric || [];
              } else if (q.type === 'fill-blank') {
                const fbq: any = q;
                base.text = fbq.text; // le texte doit contenir [blank] plutôt que la réponse
                base.correct_answer = (fbq.correctAnswers || []);
              } else if (q.type === 'matching') {
                const mq: any = q;
                base.left_items = mq.leftItems || [];
                base.right_items = mq.rightItems || [];
                base.options = base.left_items; // backend exige options non vide
                base.correct_answer = (mq.correctMatches || []).reduce((acc: Record<string, string>, m: any) => {
                  const l = mq.leftItems[m.left];
                  const r = mq.rightItems[m.right];
                  if (l && r) acc[l] = r;
                  return acc;
                }, {});
              } else if (q.type === 'ordering') {
                const oq: any = q;
                base.items = oq.items || [];
                base.options = base.items;
                // correct_answer = permutation d'indices
                base.correct_answer = (oq.correctOrder || []).map((i: number) => i);
              }

              // Métadonnées communes
              const qAny: any = q;
              if (typeof qAny.points !== 'undefined') base.points = qAny.points;
              if (qAny.difficulty) base.difficulty = qAny.difficulty;
              if (qAny.explanation) base.explanation = qAny.explanation;
              if (qAny.tags) base.tags = qAny.tags;

              // Média principal (un seul média par question)
              // Règles: type requis (image|video|pdf); key XOR url; caption optionnel; media: null pour suppression
              if (qAny.media === null) {
                base.media = null;
              } else if (qAny.media && typeof qAny.media === 'object') {
                const m = qAny.media as any;
                const allowed = ['image', 'video', 'pdf'];
                if (m.type && allowed.includes(m.type)) {
                  const hasKey = !!m.key;
                  const hasUrl = !!m.url;
                  if (hasKey && !hasUrl) {
                    base.media = { type: m.type, key: m.key, caption: m.caption || undefined };
                  } else if (!hasKey && hasUrl) {
                    base.media = { type: m.type, url: m.url, caption: m.caption || undefined };
                  } else if (hasKey && hasUrl) {
                    // Préférer key si les deux sont fournis
                    base.media = { type: m.type, key: m.key, caption: m.caption || undefined };
                  }
                  // Si ni key ni url: ne pas inclure base.media
                }
              }

              // Médias des options (seulement choix)
              // Backend: options_media supprimé (plus accepté). Un seul média question-level via base.media

              // Ajustements matching / ordering formes simples
              if (q.type === 'matching') {
                // Utiliser la forme simple: options + correct_answer (dict)
                const mq: any = q;
                base.options = (mq.leftItems || []).filter((s: string) => s && s.trim());
                const dict: Record<string, string> = {};
                (mq.correctMatches || []).forEach((m: any) => {
                  const left = mq.leftItems?.[m.left];
                  const right = mq.rightItems?.[m.right];
                  if (left && right) dict[left] = right;
                });
                // fallback si pas correctMatches mais left/right parallèles
                if (!Object.keys(dict).length && Array.isArray(mq.leftItems) && Array.isArray(mq.rightItems)) {
                  mq.leftItems.forEach((l: string, idx: number) => {
                    const r = mq.rightItems[idx];
                    if (l && r) dict[l] = r;
                  });
                }
                base.correct_answer = dict;
                delete base.left_items;
                delete base.right_items;
              } else if (q.type === 'ordering') {
                const oq: any = q;
                base.options = (oq.items || []).filter((s: string) => s && s.trim());
                const orderIdx = (oq.correctOrder || []).length
                  ? oq.correctOrder
                  : base.options.map((_: any, i: number) => i);
                base.correct_answer = orderIdx;
                delete base.items;
              }

              return base;
            })
          })),
          // Assignment (devoir) optionnel par module - domaine évaluations
          assignment: module.assignment
            ? {
              title: module.assignment.title,
              description: module.assignment.description || '',
              instructions: module.assignment.instructions || '',
              questions: module.assignment.questions.map((q: any) => {
                const base: any = {
                  question: q.question,
                  type: q.type,
                  points: q.points || 1,
                };

                if (q.type === 'single-choice') {
                  // SingleChoiceQuestion: options + correctAnswer (index)
                  base.options = q.options || [];
                  base.correctAnswer = typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
                } else if (q.type === 'multiple-choice') {
                  // MultipleChoiceQuestion: options + correctAnswers (indexes)
                  base.options = q.options || [];
                  base.correctAnswers = q.correctAnswers || [];
                } else if (q.type === 'true-false') {
                  // TrueFalseQuestion: correctAnswer (bool attendu par le backend de domaine évaluations)
                  base.correctAnswer = !!q.correctAnswer;
                } else if (q.type === 'short-answer') {
                  // ShortAnswerQuestion: correctAnswers (liste de chaînes)
                  base.correctAnswers = q.correctAnswers || [];
                } else if (q.type === 'long-answer') {
                  // Long answer: contraintes/rubric
                  base.minWords = q.minWords || undefined;
                  base.maxWords = q.maxWords || undefined;
                  base.rubric = q.rubric || [];
                } else if (q.type === 'fill-blank') {
                  base.text = q.text;
                  base.correctAnswers = q.correctAnswers || [];
                } else if (q.type === 'matching') {
                  const leftItems: string[] = Array.isArray(q.leftItems) ? q.leftItems : [];
                  const rightItems: string[] = Array.isArray(q.rightItems) ? q.rightItems : [];
                  let matches: Array<{ left: number; right: number }> = Array.isArray(q.correctMatches) ? q.correctMatches : [];

                  // Filtrer les paires invalides
                  matches = matches.filter(m =>
                    Number.isInteger(m.left) && Number.isInteger(m.right) &&
                    m.left >= 0 && m.left < leftItems.length &&
                    m.right >= 0 && m.right < rightItems.length
                  );

                  // Fallback si vide: générer des paires 0..n-1
                  if (matches.length === 0 && leftItems.length > 0 && rightItems.length > 0) {
                    const n = Math.min(leftItems.length, rightItems.length);
                    matches = Array.from({ length: n }, (_, i) => ({ left: i, right: i }));
                  }

                  base.leftItems = leftItems;
                  base.rightItems = rightItems;
                  base.correctMatches = matches;
                } else if (q.type === 'ordering') {
                  base.items = q.items || [];
                  base.correctOrder = q.correctOrder || base.items.map((_: any, i: number) => i);
                }

                // Média par question (assignment): mêmes règles que pour quiz
                if (q.media === null) {
                  base.media = null;
                } else if (q.media && typeof (q as any).media === 'object') {
                  const m: any = (q as any).media;
                  const allowed = ['image', 'video', 'pdf'];
                  if (m.type && allowed.includes(m.type)) {
                    const hasKey = !!m.key;
                    const hasUrl = !!m.url;
                    if (hasKey && !hasUrl) {
                      (base as any).media = { type: m.type, key: m.key, caption: m.caption || undefined };
                    } else if (!hasKey && hasUrl) {
                      (base as any).media = { type: m.type, url: m.url, caption: m.caption || undefined };
                    } else if (hasKey && hasUrl) {
                      (base as any).media = { type: m.type, key: m.key, caption: m.caption || undefined };
                    }
                  }
                }

                return base as any;
              }),
              settings: {
                passing_score: module.assignment.settings?.passingScore ?? 70,
                max_attempts: module.assignment.settings?.maxAttempts ?? 1,
                time_limit: module.assignment.settings?.timeLimit ?? null,
                allow_late_submission: module.assignment.settings?.allowLateSubmission ?? false,
                requires_manual_grading: module.assignment.settings?.requiresManualGrading ?? false,
                rubric: module.assignment.settings?.rubric ?? [],
              },
            }
            : null
        })),
        resources: uploadedResources,
        resources_downloadable: courseData.resourcesDownloadable
      };

      // Log payload après completion de tous les uploads (cover, programme, leçons, ressources)
      try {
        console.log('🧾 Payload envoyé à createCourse (pré-API):', coursePayload);
        // Optionnel: version JSON stringifiée (attention à la taille)
        // console.log('🧾 Payload JSON:', JSON.stringify(coursePayload, null, 2));
      } catch (e) {
        // En cas d'objet circulaire ou autre, éviter le crash du log
        console.warn('Impossible de logger le payload de createCourse:', e);
      }

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

      // 5. APPLIQUER L'ORDRE UNIFIÉ DES CONTENUS POUR CHAQUE MODULE
      try {
        // Recharger le cours pour obtenir les IDs backend des modules et contenus
        const createdCourse = await fastAPIClient.getCourse(courseId);
        console.log('📚 Cours rechargé:', createdCourse);

        // Pour chaque module, si on a un ordre unifié défini, l'appliquer
        for (let i = 0; i < modules.length; i++) {
          const localModule = modules[i];
          const backendModule = createdCourse.modules[i];

          if (!backendModule || !localModule.order || localModule.order.length === 0) {
            continue; // Pas d'ordre à appliquer
          }

          // Construire le mapping des IDs locaux vers IDs backend
          const lessonIdMap = new Map<string, string>();
          localModule.lessons.forEach((lesson, idx) => {
            const backendLesson = backendModule.content[idx];
            if (backendLesson) {
              lessonIdMap.set(lesson.id, backendLesson.id);
            }
          });

          const quizIdMap = new Map<string, string>();
          localModule.quizzes.forEach((quiz, idx) => {
            const backendQuiz = backendModule.quizzes?.[idx];
            if (backendQuiz) {
              const localQuizId = `quiz-${localModule.id}-${idx}`;
              quizIdMap.set(localQuizId, backendQuiz.id);
            }
          });

          // Construire l'ordre avec les IDs backend
          const orderItems = localModule.order.map(orderItem => {
            let backendId = orderItem.id;

            if (orderItem.type === 'lesson' && lessonIdMap.has(orderItem.id)) {
              backendId = lessonIdMap.get(orderItem.id)!;
            } else if (orderItem.type === 'quiz' && quizIdMap.has(orderItem.id)) {
              backendId = quizIdMap.get(orderItem.id)!;
            }

            return {
              type: orderItem.type,
              id: backendId
            };
          });

          // Appeler l'API de reorder
          console.log(`🔄 Reorder module ${i + 1}:`, orderItems);
          await fastAPIClient.reorderModuleContent(courseId, backendModule.id, { items: orderItems });
        }

        toast({
          title: "✅ Ordre des contenus appliqué",
          description: "L'organisation de vos modules a été enregistrée",
        });
      } catch (reorderError) {
        console.warn('⚠️ Erreur lors de l\'application de l\'ordre:', reorderError);
        // Ne pas bloquer la création du cours si le reordering échoue
      }

      toast({
        title: "✅ Cours créé avec succès",
        description: `Le cours "${courseData.title}" est maintenant disponible`,
      });

      // Supprimer le brouillon après succès
      clearDraft();

      // Naviguer avec un state pour déclencher le rechargement de la liste
      navigate(coursesBasePath, {
        state: { courseCreated: true, courseId }
      });

    } catch (error: any) {
      console.error('Erreur création cours:', error);

      // Formatter les erreurs de validation FastAPI (422)
      let errorMessage = "Une erreur est survenue lors de la création du cours";

      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;

        // Si detail est un tableau d'erreurs de validation Pydantic
        if (Array.isArray(detail)) {
          errorMessage = detail
            .map((err: any) => {
              const field = err.loc ? err.loc.join(' > ') : 'Champ inconnu';
              return `${field}: ${err.msg || 'Erreur de validation'}`;
            })
            .join('\n');
        }
        // Si detail est une chaîne
        else if (typeof detail === 'string') {
          errorMessage = detail;
        }
        // Si detail est un objet unique
        else if (typeof detail === 'object') {
          errorMessage = detail.msg || JSON.stringify(detail);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      console.error('📋 Erreur formatée:', errorMessage);

      toast({
        title: "Erreur de création",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const canProceedToNextStep = () => {
    if (currentStep === 'info') {
      return courseData.title && courseData.description;
    }
    if (currentStep === 'modules') {
      return modules.length > 0 && modules.some(m =>
        m.lessons.length > 0 || m.quizzes.length > 0 || m.assignment
      );
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

          <div className="flex items-center gap-3">
            {/* Indicateur de sauvegarde */}
            {lastSaved && (
              <Badge variant="outline" className="animate-in fade-in slide-in-from-right-2">
                Sauvegardé à {format(lastSaved, 'HH:mm', { locale: fr })}
              </Badge>
            )}

            {/* Bouton aide/tutoriel */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTutorial(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Aide
            </Button>

            {/* Bouton effacer le brouillon */}
            {hasDraft() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearDraft}
                className="text-destructive hover:text-destructive"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Effacer le brouillon
              </Button>
            )}
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
                    className={`flex flex-col items-center text-center p-4 rounded-lg transition-all ${isActive
                      ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300'
                      : isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isCompleted
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
                    <div className={`font-semibold ${isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
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
                    <RichTextEditor
                      value={courseData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Décrivez votre cours en détail..."
                      height="200px"
                    />
                  </div>

                  <div className="md:col-span-2">
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
                    <Label className="text-base">Prix (€)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={courseData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="89"
                      className="mt-2"
                    />
                  </div>

                  <CategoryTagSelector
                    selectedCategory={courseData.category}
                    onCategoryChange={(category) => handleInputChange('category', category)}
                  />

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
                    <Select
                      value={courseData.level}
                      onValueChange={(value) => handleInputChange('level', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debutant">Débutant</SelectItem>
                        <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                        <SelectItem value="difficile">Difficile</SelectItem>
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

                {/* Pedagogical Resources Section - NEW LOCATION */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Ressources pédagogiques (facultatif)
                  </Label>
                  <p className="text-sm text-gray-600">
                    Ajoutez des documents PDF supplémentaires (guides, fiches de synthèse, etc.)
                  </p>

                  {/* Toggle for downloadable resources */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="resources-downloadable" className="text-sm font-medium cursor-pointer">
                        Autoriser le téléchargement des ressources par les apprenants
                      </Label>
                    </div>
                    <Switch
                      id="resources-downloadable"
                      checked={courseData.resourcesDownloadable}
                      onCheckedChange={(checked) =>
                        setCourseData({ ...courseData, resourcesDownloadable: checked })
                      }
                    />
                  </div>

                  {/* Display existing resources */}
                  {courseData.pedagogicalResources.length > 0 && (
                    <div className="space-y-2">
                      {courseData.pedagogicalResources.map((resource) => (
                        <Card key={resource.id} className="bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-red-500" />
                                <span className="font-medium">{resource.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(resource.file.size / 1024 / 1024).toFixed(2)} MB
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePedagogicalResource(resource.id)}
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
                    <p className="text-sm text-gray-600 mb-3">Fichiers PDF uniquement</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => handleAddPedagogicalResource(file));
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="course-resources-upload"
                    />
                    <label htmlFor="course-resources-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter des ressources
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Propriétaire du cours</Label>
                  <div className="mt-2 px-4 py-3 bg-muted rounded-md border border-border">
                    <p className="font-medium text-foreground">{defaultOwner}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Le propriétaire est le formateur responsable du cours
                  </p>
                </div>

                {/* Visibilité et Accès */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Visibilité et Accès
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <Label className="font-bold">{isOFAdminContext ? "Visible par vos apprenants" : "Visible par tous"}</Label>
                        <p className="text-xs text-gray-500">
                          {isOFAdminContext ? "Rendre le cours visible dans votre catalogue interne" : "Rendre le cours visible dans le catalogue global"}
                        </p>
                      </div>
                      <Switch
                        checked={courseData.isVisible}
                        onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, isVisible: checked }))}
                      />
                    </div>

                    {!isOFAdminContext && (
                      <>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <Label className="font-bold">Open Source / Catalogue Global</Label>
                            <p className="text-xs text-gray-500">Proposer ce cours au catalogue Learneezy</p>
                          </div>
                          <Switch
                            checked={courseData.isOpenSource}
                            onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, isOpenSource: checked }))}
                          />
                        </div>

                        {courseData.isOpenSource && (
                          <div className="md:col-span-2 p-4 bg-pink-50 rounded-xl border border-pink-100 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <Label className="font-bold text-pink-900" htmlFor="course-token-price">Prix en Tokens (catalogue global)</Label>
                              <p className="text-xs text-pink-700">Prix que les autres organisations paieront pour accéder à ce cours</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                id="course-token-price"
                                type="number"
                                min="0"
                                value={courseData.tokenPrice}
                                onChange={(e) => setCourseData(prev => ({ ...prev, tokenPrice: parseInt(e.target.value) || 0 }))}
                                className="w-24 bg-white border-pink-200"
                              />
                              <span className="font-bold text-pink-900">Tokens</span>
                            </div>
                          </div>
                        )}
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

                <SortableModuleList
                  modules={modules}
                  onReorder={handleReorderModules}
                  expandedModule={expandedModule}
                  onExpandModule={setExpandedModule}
                  onRemoveModule={removeModule}
                >
                  {(module, moduleIndex) => (
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
                          <RichTextEditor
                            value={module.description}
                            onChange={(value) => updateModule(module.id, 'description', value)}
                            placeholder="Description du module"
                            height="150px"
                          />
                        </div>
                      </div>

                      {/* Unified Content Section (Lessons + Quizzes with Drag & Drop) */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">Contenu du module</h4>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addLesson(module.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter une leçon
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowModuleQuizBuilder(module.id);
                                setEditingQuizIndex(null);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter un quiz
                            </Button>
                          </div>
                        </div>

                        {/* Mixed Content List */}
                        <div className="space-y-3">
                          {module.lessons.length === 0 && module.quizzes.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">Aucun contenu pour le moment</p>
                              <p className="text-sm text-gray-400 mt-1">Ajoutez des leçons et des quiz pour construire votre module</p>
                            </div>
                          ) : (
                            <SortableContentList
                              items={[
                                ...module.lessons.map((lesson, idx) => ({
                                  id: lesson.id,
                                  type: 'lesson' as const,
                                  originalIndex: idx,
                                  data: lesson
                                })),
                                ...module.quizzes.map((quiz, idx) => ({
                                  id: `quiz-${module.id}-${idx}`,
                                  type: 'quiz' as const,
                                  originalIndex: idx,
                                  data: quiz
                                }))
                              ]}
                              onReorder={(newItems) => handleContentReorder(module.id, newItems)}
                              onEditLesson={(lessonId) => setEditingLesson({ moduleId: module.id, lessonId })}
                              onDeleteLesson={(lessonId) => removeLesson(module.id, lessonId)}
                              onEditQuiz={(quizIndex) => {
                                setShowModuleQuizBuilder(module.id);
                                setEditingQuizIndex(quizIndex);
                              }}
                              onDeleteQuiz={(quizIndex) => handleDeleteModuleQuiz(module.id, quizIndex)}
                            />
                          )}
                        </div>
                      </div>

                      {/* Lesson Edit Form (Conditional) */}
                      {editingLesson?.moduleId === module.id && editingLesson?.lessonId && (
                        <div className="space-y-4 border-t pt-6">
                          {(() => {
                            const lesson = module.lessons.find(l => l.id === editingLesson.lessonId);
                            if (!lesson) return null;

                            return (
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="font-semibold">Édition de la leçon</h5>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingLesson(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div>
                                  <Label>Titre de la leçon</Label>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                    placeholder="Titre de la leçon"
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Durée (minutes)</Label>
                                  <Input
                                    type="number"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                                    placeholder="30"
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Contenu descriptif</Label>
                                  <RichTextEditor
                                    value={lesson.content}
                                    onChange={(value) => updateLesson(module.id, lesson.id, { content: value })}
                                    placeholder="Décrivez le contenu de cette leçon..."
                                    height="200px"
                                  />
                                </div>

                                {/* Media Upload/URL Section */}
                                <div className="space-y-4 pt-4 border-t">
                                  <Label className="text-base font-semibold">Média (Vidéo, PDF ou Image)</Label>
                                  <div className="flex gap-2">
                                    <Button
                                      variant={!lesson.useMediaUrl ? "default" : "outline"}
                                      size="sm"
                                      className={!lesson.useMediaUrl ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
                                      onClick={() => updateLesson(module.id, lesson.id, { useMediaUrl: false })}
                                    >
                                      <Upload className="h-4 w-4 mr-2" /> Upload fichier
                                    </Button>
                                    <Button
                                      variant={lesson.useMediaUrl ? "default" : "outline"}
                                      size="sm"
                                      className={lesson.useMediaUrl ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                                      onClick={() => updateLesson(module.id, lesson.id, { useMediaUrl: true })}
                                    >
                                      <LinkIcon className="h-4 w-4 mr-2" /> Lien URL
                                    </Button>
                                  </div>

                                  {!lesson.useMediaUrl ? (
                                    <>
                                      {!lesson.file && !lesson.filePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                            <p className="mb-2 text-lg font-semibold text-gray-700">Vidéo, PDF ou Image</p>
                                            <p className="text-xs text-gray-500 mb-2">Glissez-déposez ou cliquez pour parcourir</p>
                                            <input type="file" className="hidden" accept="video/*,.pdf,image/*" onChange={(e) => handleFileUpload(module.id, lesson.id, e)} />
                                          </div>
                                        </label>
                                      ) : (
                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                              {lesson.fileType === 'video' && <Video className="h-5 w-5 text-blue-600" />}
                                              {lesson.fileType === 'pdf' && <FileText className="h-5 w-5 text-red-600" />}
                                              {lesson.fileType === 'image' && <ImageIcon className="h-5 w-5 text-green-600" />}
                                              <span className="text-sm font-medium text-gray-700">{lesson.fileName}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => updateLesson(module.id, lesson.id, { file: undefined, fileType: null, fileName: '', filePreview: undefined })}>
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          {lesson.fileType === 'video' && lesson.filePreview && (
                                            <div className="rounded-lg overflow-hidden bg-black border">
                                              <video src={lesson.filePreview} controls className="w-full" />
                                            </div>
                                          )}
                                          {lesson.fileType === 'pdf' && (
                                            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                                              <FileText className="h-8 w-8 text-red-600" />
                                              <div className="flex-1">
                                                <p className="font-medium">{lesson.fileName}</p>
                                                <p className="text-sm text-gray-600">Document PDF</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="space-y-4">
                                      <Input value={lesson.mediaUrl || ''} onChange={(e) => updateLesson(module.id, lesson.id, { mediaUrl: e.target.value })} placeholder="URL du média (YouTube, Vimeo, MP4, PDF...)" />
                                      {lesson.mediaUrl && (
                                        <div className="mt-4 rounded-lg overflow-hidden border bg-black">
                                          <VideoPlayer videoUrl={lesson.mediaUrl} title="Aperçu média" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Assignment Section */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">Devoir du module</h4>
                          {module.assignment && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setShowAssignmentBuilder(module.id)}>
                                <Edit2 className="h-4 w-4 mr-2" /> Modifier
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveAssignment(module.id)} className="hover:bg-red-50">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {module.assignment ? (
                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200 flex items-center gap-3">
                            <ClipboardList className="h-6 w-6 text-orange-600" />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{module.assignment.title}</h5>
                              <p className="text-sm text-gray-600">{module.assignment.questions.length} questions • Note de passage: {module.assignment.settings.passingScore}%</p>
                            </div>
                          </div>
                        ) : (
                          <Button variant="outline" onClick={() => setShowAssignmentBuilder(module.id)} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Créer un devoir
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </SortableModuleList>
              </div>
            )}

            {
              currentStep === 'review' && (
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
                        <div
                          className="mt-1 prose max-w-none"
                          // Le HTML provient de l'éditeur riche. On le sanitize avant rendu pour éviter les XSS.
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(courseData.description || '') }}
                        />
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
                              {modules.reduce((sum, m) => sum + m.quizzes.length, 0)}
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
                                </div>
                                {module.quizzes.length > 0 && (
                                  <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <HelpCircle className="h-4 w-4" />
                                    <span>{module.quizzes.length} quiz ({module.quizzes.reduce((sum, q) => sum + q.questions.length, 0)} questions)</span>
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
              )
            }
          </CardContent >
        </Card >

        {/* Navigation Buttons */}
        < Card >
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


        {/* Module Quiz Builder Modal */}
        {
          showModuleQuizBuilder && (
            <Dialog open={!!showModuleQuizBuilder} onOpenChange={() => {
              setShowModuleQuizBuilder(null);
              setEditingQuizIndex(null);
            }}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuizIndex !== null ? "Modifier le quiz" : "Ajouter un quiz au module"}
                  </DialogTitle>
                </DialogHeader>
                <QuizBuilder
                  quiz={
                    editingQuizIndex !== null
                      ? modules.find(m => m.id === showModuleQuizBuilder)?.quizzes[editingQuizIndex]
                      : undefined
                  }
                  onSave={(quiz) => handleSaveModuleQuiz(showModuleQuizBuilder, quiz)}
                  onCancel={() => {
                    setShowModuleQuizBuilder(null);
                    setEditingQuizIndex(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )
        }

        {/* Assignment Builder Modal */}
        {
          showAssignmentBuilder && (
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
          )
        }
      </div>

      {/* Upload Progress Modal pour tous les fichiers */}
      < UploadProgressModal
        isOpen={uploadProgress.isUploading}
        currentFile={uploadProgress.currentFile}
        currentFileType={uploadProgress.currentFileType}
        uploadedFiles={uploadProgress.uploadedFiles}
        totalFiles={uploadProgress.totalFiles}
        progress={uploadProgress.progress}
      />

      {/* Upload Notifications pour uploads individuels (si ajoutés dans le futur) */}
      < UploadNotification
        uploads={uploads}
        onRemove={(id) => setUploads(prev => prev.filter(u => u.id !== id))}
      />

      {/* Dialog de restauration du brouillon */}
      {
        showRestoreDraftDialog && draftToRestore && (
          <RestoreDraftDialog
            open={showRestoreDraftDialog}
            onRestore={handleRestoreDraft}
            onDiscard={handleDiscardDraft}
            draftTimestamp={draftToRestore.timestamp}
          />
        )
      }

      {/* Tutoriel slideshow */}
      <CourseTutorialModal
        open={showTutorial}
        onOpenChange={setShowTutorial}
      />
    </div>
  );
};

export default CreateCoursePage;
