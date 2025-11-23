import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  FileText,
  Video,
  Plus,
  Trash2,
  Edit2,
  Eye,
  BookOpen,
  ClipboardList,
  Clock,
  Upload,
  X,
  Check,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { QuizBuilder, AssignmentBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig } from '@/types/quiz';
import { CycleTagSelector } from '@/components/admin/CycleTagSelector';
import { useCategories, useCreateCategory, useCreateModuleQuiz, useUpdateModuleQuiz, useDeleteModuleQuiz, useReorderModuleContent } from '@/hooks/useApi';
import { UploadNotification, UploadItem } from '@/components/common/UploadNotification';
import { useToast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fastAPIClient } from '@/services/fastapi-client';
import { uploadDirect } from '@/utils/upload';
import type { CourseResponse, Module, Content, Quiz, QuizCreate, AssignmentResponse } from '@/types/fastapi';
import { SortableContentList, ContentItem } from '@/components/course-creation/SortableContentList';

interface EditableCourseData {
  title: string;
  description: string;
  price: string;
  category: string;
  duration: string;
  level: string;
  status: 'draft' | 'published';
  imagePreview: string | null;
  programFileName: string;
  objectives: string[];
  cycle: '' | 'primaire' | 'college' | 'lycee' | 'formation_pro';
  cycleTags: string[];
}

interface EditableModule {
  index: number;
  title: string;
  description: string;
  duration: string;
  lessons: EditableLesson[];
  quizzes?: Quiz[];
  assignments?: AssignmentResponse[];
  isPending?: boolean;  // Module temporaire non encore enregistré
  tempId?: string;      // ID temporaire pour les modules pending
  order?: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }>; // Ordre unifié des contenus
}

interface EditableLesson {
  id?: string;  // ID backend de la leçon
  index: number;
  title: string;
  description: string;
  duration: string;
  video_key?: string;
  videoFileName?: string;
  transcription?: string;
  // Media fields
  image_key?: string;
  imageFileName?: string;
  pdf_key?: string;
  pdfFileName?: string;
  resource_key?: string;  // Legacy, use pdf_key instead
  resourceFileName?: string;  // Legacy, use pdfFileName instead
  video_url?: string;
  content_type?: 'video' | 'image' | 'pdf' | 'url';
  useMediaUrl?: boolean;
}

interface PedagogicalResource {
  id: string;
  name: string;
  key?: string;
  size?: number;
  file?: File;
}

const EditCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const queryClient = useQueryClient();

  // Editable course data
  const [courseData, setCourseData] = useState<EditableCourseData>({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'debutant',
    status: 'draft',
    imagePreview: null,
    programFileName: '',
    objectives: [''],
    cycle: '',
    cycleTags: [],
  });

  // Catégories dynamiques (liste + création)
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Module quiz hooks
  const createModuleQuizMutation = useCreateModuleQuiz();
  const updateModuleQuizMutation = useUpdateModuleQuiz();
  const deleteModuleQuizMutation = useDeleteModuleQuiz();
  const reorderModuleContentMutation = useReorderModuleContent();

  const [modules, setModules] = useState<EditableModule[]>([]);
  const [resources, setResources] = useState<PedagogicalResource[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newProgram, setNewProgram] = useState<File | null>(null);

  // Editing states
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<{ moduleIdx: number; lessonIdx: number } | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<number | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null); // ID du quiz en cours d'édition
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<number | null>(null);
  const [moduleHasChanges, setModuleHasChanges] = useState<Record<number, boolean>>({});
  const [savingModule, setSavingModule] = useState<number | null>(null);

  // Upload notification state
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  // Detect context path
  const isManagerContext = location.pathname.includes('/gestionnaire/');
  const coursesBasePath = isManagerContext ? '/dashboard/gestionnaire/courses' : '/dashboard/superadmin/courses';

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const courseData = await fastAPIClient.getCourse(id);
        setCourse(courseData);

        // Populate editable data
        // Normaliser les niveaux vers {debutant|intermediaire|difficile}
        const normalizeLevel = (lv?: string | null) => {
          const s = (lv || '').toString().trim().toLowerCase();
          if (s === 'debutant' || s === 'débutant') return 'debutant';
          if (s === 'intermediaire' || s === 'intermédiaire') return 'intermediaire';
          if (s === 'difficile') return 'difficile';
          if (s === 'avancé' || s === 'avance' || s === 'avancée' || s === 'advanced' || s === 'expert') return 'difficile';
          return 'debutant';
        };

        const baseEditable: EditableCourseData = {
          title: courseData.title || '',
          description: courseData.description || '',
          price: courseData.price?.toString() || '',
          category: courseData.category || '',
          duration: courseData.duration || '',
          level: normalizeLevel(courseData.level),
          status: (courseData.status as any) || 'draft',
          imagePreview: null,
          programFileName: courseData.program_pdf_key ? 'Programme.pdf' : '',
          objectives: (courseData as any).objectives || [''],
          // le backend renvoie learning_cycle & levels
          cycle: (courseData as any).learning_cycle || '',
          cycleTags: (courseData as any).levels || [],
        };

        // Récupérer une URL de lecture pour l'image de couverture si disponible
        if (courseData.cover_key) {
          try {
            const { url } = await fastAPIClient.getPlayUrl(courseData.cover_key);
            console.debug('[EditCourse] cover_key → play_url:', url);
            setCourseData({ ...baseEditable, imagePreview: url });
          } catch (e) {
            console.warn('Impossible de générer une URL de lecture pour la couverture, fallback image_url');
            setCourseData({
              ...baseEditable,
              imagePreview: courseData.image_url || null,
            });
          }
        } else if (courseData.image_url) {
          // Compat: si image_url pointe vers /api/storage/public/<KEY>, dériver la clé et générer une play_url
          try {
            const match = courseData.image_url.match(/\/api\/storage\/public\/(.+)$/);
            if (match && match[1]) {
              const key = decodeURIComponent(match[1]);
              const { url } = await fastAPIClient.getPlayUrl(key);
              console.debug('[EditCourse] image_url public → key → play_url:', { key, url });
              setCourseData({ ...baseEditable, imagePreview: url });
            } else {
              console.debug('[EditCourse] image_url direct (pas de conversion):', courseData.image_url);
              setCourseData({ ...baseEditable, imagePreview: courseData.image_url });
            }
          } catch (e) {
            console.warn('Fallback direct sur image_url suite à échec de conversion:', e);
            setCourseData({ ...baseEditable, imagePreview: courseData.image_url });
          }
        } else {
          setCourseData({ ...baseEditable, imagePreview: null });
        }

        // Populate modules
        const editableModules = mapCourseToEditableModules(courseData);
        setModules(editableModules);

        // Populate resources
        const editableResources: PedagogicalResource[] = (courseData.resources || []).map((res, idx) => ({
          id: `resource-${idx}`,
          name: res.name || 'Ressource',
          key: res.key || undefined,
          size: res.size || undefined,
        }));
        setResources(editableResources);

        // Expand first module by default
        if (editableModules.length > 0) {
          setExpandedModules(['module-0']);
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

  // Helper function to map course data to editable modules
  const mapCourseToEditableModules = (courseData: CourseResponse): EditableModule[] => {
    return (courseData.modules || []).map((mod: Module, idx: number) => {
      // Construire l'ordre unifié à partir du backend si disponible, sinon ordre par défaut
      const buildOrder = (): Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }> => {
        if (mod.order && Array.isArray(mod.order) && mod.order.length > 0) {
          // Le backend fournit déjà un ordre unifié sous forme d'array d'IDs strings
          return mod.order.map((id: any) => {
            // Si c'est déjà un objet {type, id}, on le retourne tel quel
            if (typeof id === 'object' && id.type && id.id) {
              return id;
            }
            // Sinon c'est juste un ID string, déterminer le type
            const idStr = String(id);
            const isLesson = (mod.content || []).some(l => l.id === idStr);
            if (isLesson) return { type: 'lesson' as const, id: idStr };
            
            const isQuiz = (mod.quizzes || []).some(q => q.id === idStr);
            if (isQuiz) return { type: 'quiz' as const, id: idStr };
            
            const isAssignment = (mod.assignments || []).some(a => a.id === idStr);
            if (isAssignment) return { type: 'assignment' as const, id: idStr };
            
            // Fallback: assumer leçon si on ne trouve pas
            return { type: 'lesson' as const, id: idStr };
          });
        }
        
        // Ordre par défaut: leçons → quizzes → assignments
        const order: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }> = [];
        (mod.content || []).forEach(lesson => order.push({ type: 'lesson', id: lesson.id }));
        (mod.quizzes || []).forEach(quiz => order.push({ type: 'quiz', id: quiz.id }));
        (mod.assignments || []).forEach(assignment => order.push({ type: 'assignment', id: assignment.id }));
        return order;
      };

      return {
        index: idx,
        title: mod.title || '',
        description: mod.description || '',
        duration: mod.duration || '',
        lessons: (mod.content || []).map((lesson: Content, lessonIdx: number) => ({
          id: lesson.id,  // Ajouter l'ID backend
          index: lessonIdx,
          title: lesson.title || '',
          description: lesson.description || '',
          duration: lesson.duration || '',
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
          transcription: lesson.transcription || undefined,
          image_key: (lesson as any).image_key,
          imageFileName: (lesson as any).image_key ? 'Image existante' : undefined,
          pdf_key: lesson.pdf_key,
          pdfFileName: lesson.pdf_key ? 'PDF existant' : undefined,
          resource_key: (lesson as any).resource_key,  // Legacy
          resourceFileName: (lesson as any).resource_key ? 'Fichier existant' : undefined,  // Legacy
          video_url: (lesson as any).video_url,
          content_type: (lesson as any).content_type || 'video',
        })),
        quizzes: mod.quizzes || [],
        assignments: mod.assignments || [],
        isPending: false,  // Les modules chargés depuis la DB ne sont jamais pending
        order: buildOrder(),
      };
    });
  };

  // Auto-save for general info
  const saveCourseInfo = async (data: EditableCourseData) => {
    if (!id) return;

    try {
      const updatePayload: any = {
        title: data.title,
        description: data.description,
        status: data.status,
        duration: data.duration,
        category: data.category,
        level: data.level,
        objectives: data.objectives.filter(obj => obj.trim() !== ''),
        // adapter les clefs vers le contrat backend
        learning_cycle: data.cycle || null,
        levels: data.cycleTags,
      };

      if (data.price && !isNaN(parseFloat(data.price))) {
        updatePayload.price = parseFloat(data.price);
      }

      await fastAPIClient.updateCourse(id, updatePayload);
    } catch (error) {
      console.error('Auto-save error:', error);
      throw error;
    }
  };

  const { isSaving, lastSaved, forceSave } = useAutoSave({
    data: courseData,
    onSave: saveCourseInfo,
    delay: 2000,
    enabled: activeTab === 'general' && !loading
  });

  // Création de catégorie personnalisée (sans perturber l'auto-save)
  const saveCustomCategory = async () => {
    const newName = customCategory.trim();
    if (!newName) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un nom de catégorie', variant: 'destructive' });
      return;
    }
    try {
      const created = await createCategoryMutation.mutateAsync({ name: newName });

      // Mettre à jour le cache pour apparition immédiate
      queryClient.setQueryData(['categories'], (old: any) => {
        if (Array.isArray(old)) {
          const exists = old.some((c: any) => c?.name === created?.name);
          return exists ? old : [...old, created];
        }
        return created ? [created] : [];
      });

      // Sélectionner immédiatement
      setCourseData(prev => ({ ...prev, category: created?.name || newName }));
      setCustomCategory('');
      setIsAddingCategory(false);
    } catch (error) {
      // Les toasts d'erreur sont gérés par le hook
      console.error('Error creating category:', error);
    }
  };

  // Functions for managing objectives
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
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  // Toggle course status
  const handleToggleStatus = async () => {
    if (!id) return;

    try {
      const newStatus = courseData.status === 'published' ? 'draft' : 'published';
      await fastAPIClient.updateCourseStatus(id, newStatus);
      setCourseData(prev => ({ ...prev, status: newStatus }));
      toast({
        title: newStatus === 'published' ? "✅ Cours publié" : "📝 Brouillon",
        description: `Le cours est maintenant ${newStatus === 'published' ? 'visible' : 'masqué'}`,
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  // Upload new course image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      toast({ title: "Upload en cours...", description: "Téléchargement de l'image" });
      // Prévisualisation immédiate locale
      const objectUrl = URL.createObjectURL(file);
      setCourseData(prev => ({ ...prev, imagePreview: objectUrl }));

      const up = await uploadDirect(file, 'image');

      // Update course with new cover key
      await fastAPIClient.updateCourse(id, { cover_key: up.key });

      // Remplacer la preview locale par l'URL présignée réutilisable
      try {
        const { url } = await fastAPIClient.getPlayUrl(up.key);
        console.debug('[EditCourse] upload image → play_url:', url);
        setCourseData(prev => ({ ...prev, imagePreview: url }));
      } finally {
        // Nettoyer l'URL temporaire
        URL.revokeObjectURL(objectUrl);
      }

      toast({ title: "✅ Image mise à jour", description: "La couverture a été modifiée" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader l'image", variant: "destructive" });
    }
  };

  // Upload new program PDF
  const handleProgramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    if (file.type !== 'application/pdf') {
      toast({ title: "Format invalide", description: "Veuillez uploader un PDF", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "Upload en cours...", description: "Téléchargement du programme" });

      const up = await uploadDirect(file, 'pdf');
      await fastAPIClient.updateCourse(id, { program_pdf_key: up.key });
      setCourseData(prev => ({ ...prev, programFileName: file.name }));

      toast({ title: "✅ Programme mis à jour", description: file.name });
    } catch (error) {
      console.error('Error uploading program:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader le programme", variant: "destructive" });
    }
  };

  // Save module changes
  const handleSaveModule = async (moduleIdx: number) => {
    if (!id || !course) return;

    const module = modules[moduleIdx];
    
    // Ne pas sauvegarder les modules en attente
    if (module.isPending) {
      toast({ 
        title: "Module non enregistré", 
        description: "Le module sera enregistré automatiquement lors de l'ajout de contenu",
        variant: "destructive"
      });
      return;
    }

    setSavingModule(moduleIdx);
    try {
      const moduleToSave = modules[moduleIdx];
      await fastAPIClient.updateModule(id, moduleIdx, {
        title: moduleToSave.title,
        description: moduleToSave.description,
        duration: moduleToSave.duration,
        content: moduleToSave.lessons.map(l => ({
          title: l.title,
          description: l.description,
          duration: l.duration,
          video_key: l.video_key,
          transcription: l.transcription,
        })),
        quizzes: moduleToSave.quizzes
      });

      setEditingModuleId(null);
      
      // Réinitialiser le flag de modifications
      setModuleHasChanges(prev => ({ ...prev, [moduleIdx]: false }));
      
      toast({ 
        title: "✅ Module sauvegardé", 
        description: moduleToSave.title || `Module ${moduleIdx + 1}` 
      });

      // Refresh course data
      const updatedCourse = await fastAPIClient.getCourse(id);
      setModules(mapCourseToEditableModules(updatedCourse));
    } catch (error) {
      console.error('Error saving module:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder le module", variant: "destructive" });
    } finally {
      setSavingModule(null);
    }
  };

  // Save lesson changes
  const handleSaveLesson = async (moduleIdx: number, lessonIdx: number) => {
    if (!id) return;

    try {
      const lesson = modules[moduleIdx].lessons[lessonIdx];

      // Récupérer le cours pour obtenir les vrais IDs
      const course = await fastAPIClient.getCourse(id);
      const moduleId = course.modules[moduleIdx].id!;
      const lessonId = course.modules[moduleIdx].content[lessonIdx].id!;

      await fastAPIClient.updateLesson(id, moduleId, lessonId, {
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        // Ne pas toucher au média ici
      });

      setEditingLessonId(null);
      toast({ title: "✅ Leçon sauvegardée", description: lesson.title });
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder la leçon", variant: "destructive" });
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleIdx: number) => {
    const module = modules[moduleIdx];

    // Si module en attente, juste le retirer du state local
    if (module.isPending) {
      setModules(prev => prev.filter((_, idx) => idx !== moduleIdx));
      toast({ title: "📝 Module local supprimé" });
      return;
    }

    if (!id || !confirm('Supprimer ce module ?')) return;

    try {
      await fastAPIClient.deleteModule(id, moduleIdx, true);
      toast({ title: "✅ Module supprimé" });

      // Refresh course data
      const updatedCourse = await fastAPIClient.getCourse(id);
      setModules(mapCourseToEditableModules(updatedCourse));
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer le module", variant: "destructive" });
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (moduleIdx: number, lessonIdx: number) => {
    if (!id || !confirm('Supprimer cette leçon ?')) return;

    try {
      // Récupérer le cours pour obtenir les vrais IDs
      const course = await fastAPIClient.getCourse(id);
      const moduleId = course.modules[moduleIdx].id!;
      const lessonId = course.modules[moduleIdx].content[lessonIdx].id!;

      await fastAPIClient.deleteLesson(id, moduleId, lessonId, false);
      setModules(prev => prev.map((mod, idx) =>
        idx === moduleIdx
          ? { ...mod, lessons: mod.lessons.filter((_, lIdx) => lIdx !== lessonIdx) }
          : mod
      ));
      toast({ title: "✅ Leçon supprimée" });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer la leçon", variant: "destructive" });
    }
  };

  // Fonction pour calculer la durée totale
  const calculateTotalDuration = (mods: EditableModule[]): string => {
    let totalMinutes = 0;

    mods.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const durationStr = lesson.duration.toLowerCase();
        const hoursMatch = durationStr.match(/(\d+)h/);
        const minutesMatch = durationStr.match(/(\d+)min/);

        if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
        if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  // Durée totale éditable manuellement par l'utilisateur

  // Save module quiz using new hooks
  const handleSaveModuleQuiz = async (moduleIdx: number, quiz: QuizConfig) => {
    if (!id || !course) return;

    try {
      const module = modules[moduleIdx];

      // Gestion des modules pending
      if (module.isPending) {
        await fastAPIClient.createModule(id, {
          title: module.title,
          description: module.description,
          duration: module.duration,
          content: []
        });

        const updatedCourse = await fastAPIClient.getCourse(id);
        const moduleId = updatedCourse.modules[updatedCourse.modules.length - 1]?.id;

        if (!moduleId) throw new Error('Module ID introuvable');

        // Créer le quiz avec le nouveau hook
        const quizPayload = buildQuizPayload(quiz);
        await createModuleQuizMutation.mutateAsync({
          courseId: id,
          moduleId,
          quizData: quizPayload
        });

        const finalCourse = await fastAPIClient.getCourse(id);
        setModules(mapCourseToEditableModules(finalCourse));
        setShowModuleQuizBuilder(null);
        return;
      }

      // Modules existants
      const moduleId = course.modules[moduleIdx]?.id;
      if (!moduleId) throw new Error('Module ID introuvable');

      const quizPayload = buildQuizPayload(quiz);

      // Créer ou mettre à jour
      if (editingQuizId) {
        await updateModuleQuizMutation.mutateAsync({
          courseId: id,
          moduleId,
          quizId: editingQuizId,
          quizData: quizPayload
        });
      } else {
        await createModuleQuizMutation.mutateAsync({
          courseId: id,
          moduleId,
          quizData: quizPayload
        });
      }

      // Rafraîchir
      const updatedCourse = await fastAPIClient.getCourse(id);
      setModules(mapCourseToEditableModules(updatedCourse));
      setShowModuleQuizBuilder(null);
      setEditingQuizId(null);
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de sauvegarder le quiz',
        variant: 'destructive'
      });
    }
  };

  // Helper to build quiz payload
  const buildQuizPayload = (quiz: QuizConfig): QuizCreate => {
    return {
      title: quiz.title,
      questions: quiz.questions.map(q => {
        const baseQuestion: any = {
          type: q.type,
          question: q.question,
          options: [],
          correct_answer: ''
        };

        if (q.type === 'single-choice') {
          const scq = q as any;
          baseQuestion.options = scq.options || [];
          baseQuestion.correct_answer = scq.options?.[scq.correctAnswer] || '';
        } else if (q.type === 'true-false') {
          const tfq = q as any;
          baseQuestion.options = ['Vrai', 'Faux'];
          baseQuestion.correct_answer = tfq.correctAnswer === true || tfq.correctAnswer === 0;
        } else if (q.type === 'multiple-choice') {
          const mcq = q as any;
          baseQuestion.options = mcq.options || [];
          baseQuestion.correct_answer = mcq.correctAnswers?.map((idx: number) => mcq.options[idx]).join(', ') || '';
          baseQuestion.correct_answers = mcq.correctAnswers?.map((idx: number) => mcq.options[idx]) || [];
        } else if (q.type === 'short-answer') {
          const saq = q as any;
          baseQuestion.correct_answer = saq.correctAnswers?.[0] || '';
          baseQuestion.correct_answers = saq.correctAnswers || [];
          baseQuestion.case_sensitive = saq.caseSensitive || false;
        } else if (q.type === 'long-answer') {
          const laq = q as any;
          baseQuestion.min_words = laq.minWords;
          baseQuestion.max_words = laq.maxWords;
          baseQuestion.rubric = laq.rubric;
        } else if (q.type === 'fill-blank') {
          const fbq = q as any;
          baseQuestion.correct_answer = fbq.correctAnswers?.[0] || '';
          baseQuestion.text = fbq.text;
          baseQuestion.correct_answers = fbq.correctAnswers || [];
        } else if (q.type === 'matching') {
          const mq = q as any;
          baseQuestion.left_items = mq.leftItems || [];
          baseQuestion.right_items = mq.rightItems || [];
          baseQuestion.correct_matches = mq.correctMatches || {};
        } else if (q.type === 'ordering') {
          const oq = q as any;
          baseQuestion.items = oq.items || [];
          baseQuestion.correct_order = oq.correctOrder || [];
        }

        return baseQuestion;
      }) as any[]
    };
  };

  // Delete module quiz using new hooks
  const handleDeleteModuleQuiz = async (moduleIdx: number, quizId: string) => {
    if (!id || !course || !confirm('Supprimer ce quiz ?')) return;

    try {
      const moduleId = course.modules[moduleIdx]?.id;
      if (!moduleId) return;

      await deleteModuleQuizMutation.mutateAsync({
        courseId: id,
        moduleId,
        quizId
      });

      const updatedCourse = await fastAPIClient.getCourse(id);
      setModules(mapCourseToEditableModules(updatedCourse));
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de supprimer le quiz',
        variant: 'destructive'
      });
    }
  };

  // Reorder content with API call
  const handleContentReorder = async (moduleIdx: number, reorderedItems: ContentItem[]) => {
    if (!id) return;

    const module = modules[moduleIdx];
    if (!module) return;

    try {
      // Construire l'ordre unifié uniquement à partir de l'état local
      const orderItems = reorderedItems.map((item) => {
        const data: any = item.data ?? {};
        const contentId: string = data.id ?? item.id;

        return {
          type: item.type as 'lesson' | 'quiz' | 'assignment',
          id: contentId,
        };
      });

      // Si le module est en attente ou que le cours n'est pas encore chargé,
      // on met simplement à jour l'ordre local sans appeler l'API
      if (module.isPending || !course) {
        setModules((prev) =>
          prev.map((m, idx) => (idx === moduleIdx ? { ...m, order: orderItems } : m))
        );
        return;
      }

      const moduleId = course.modules[moduleIdx]?.id;
      if (!moduleId) {
        setModules((prev) =>
          prev.map((m, idx) => (idx === moduleIdx ? { ...m, order: orderItems } : m))
        );
        return;
      }

      // Appeler l'API de reordering
      await reorderModuleContentMutation.mutateAsync({
        courseId: id,
        moduleId,
        items: orderItems,
      });

      // Mettre à jour l'ordre unifié dans l'état local
      setModules((prev) =>
        prev.map((m, idx) => (idx === moduleIdx ? { ...m, order: orderItems } : m))
      );

      toast({
        title: '✅ Ordre mis à jour',
        description: "L'ordre du contenu a été sauvegardé",
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description:
          error.response?.data?.detail || 'Impossible de réorganiser le contenu',
        variant: 'destructive',
      });
    }
  };

  // Save module assignment
  const handleSaveModuleAssignment = async (moduleIdx: number, assignment: AssignmentConfig) => {
    if (!id) return;

    try {
      const module = modules[moduleIdx];

      // Si le module est en attente, le créer d'abord dans la DB
      if (module.isPending) {
        await fastAPIClient.createModule(id, {
          title: module.title,
          description: module.description,
          duration: module.duration,
          content: []
        });

        // Recharger pour obtenir l'index réel du module
        const updatedCourse = await fastAPIClient.getCourse(id);
        const realModuleIdx = updatedCourse.modules.length - 1;

        // Créer l'assignment sur le module réel
        const assignmentPayload = {
          title: assignment.title,
          description: assignment.description || '',
          instructions: assignment.instructions || '',
          questions: assignment.questions.map((q: any) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            correct_answer: q.type === 'single-choice' || q.type === 'true-false' 
              ? q.options[q.correctAnswer] 
              : q.options.filter((_: any, idx: number) => q.correctAnswers?.includes(idx)),
            points: q.points || 1,
          })),
          settings: assignment.settings,
        };

        const updatedModuleData = {
          title: module.title,
          description: module.description,
          duration: module.duration,
          content: module.lessons.map(l => ({
            title: l.title,
            description: l.description,
            duration: l.duration,
          })) as any,
          assignments: [assignmentPayload],
        };

        await fastAPIClient.updateModule(id, realModuleIdx, updatedModuleData);

        // Rafraîchir tout
        const finalCourse = await fastAPIClient.getCourse(id);
        setModules(mapCourseToEditableModules(finalCourse));

        setShowAssignmentBuilder(null);
        toast({
          title: '✅ Module et devoir créés',
          description: 'Le module a été enregistré avec son devoir'
        });
      } else {
        // Mise à jour ou création d'assignment pour module existant
        const assignmentPayload = {
          title: assignment.title,
          description: assignment.description || '',
          instructions: assignment.instructions || '',
          questions: assignment.questions.map((q: any) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            correct_answer: q.type === 'single-choice' || q.type === 'true-false' 
              ? q.options[q.correctAnswer] 
              : q.options.filter((_: any, idx: number) => q.correctAnswers?.includes(idx)),
            points: q.points || 1,
          })),
          settings: assignment.settings,
        };

        const updatedModuleData = {
          title: module.title,
          description: module.description,
          duration: module.duration,
          content: module.lessons.map(l => ({
            title: l.title,
            description: l.description,
            duration: l.duration,
          })) as any,
          assignments: [assignmentPayload],
        };

        await fastAPIClient.updateModule(id, moduleIdx, updatedModuleData);

        const updatedCourse = await fastAPIClient.getCourse(id);
        setModules(mapCourseToEditableModules(updatedCourse));

        setShowAssignmentBuilder(null);
        toast({
          title: '✅ Devoir sauvegardé',
          description: 'Le devoir du module a été enregistré avec succès.'
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de sauvegarder le devoir',
        variant: 'destructive'
      });
    }
  };

  // Delete module assignment
  const handleDeleteModuleAssignment = async (moduleIdx: number) => {
    if (!id || !confirm('Supprimer ce devoir ?')) return;

    try {
      const module = modules[moduleIdx];

      // Utiliser updateModule avec le payload complet sans assignment
      const updatedModuleData = {
        title: module.title,
        description: module.description,
        duration: module.duration,
        content: module.lessons.map(l => ({
          title: l.title,
          description: l.description,
          duration: l.duration,
        })) as any,
        assignments: [],
      };

      await fastAPIClient.updateModule(id, moduleIdx, updatedModuleData);

      const updatedCourse = await fastAPIClient.getCourse(id);
      setModules(mapCourseToEditableModules(updatedCourse));

      toast({
        title: '✅ Devoir supprimé',
        description: 'Le devoir du module a été supprimé.'
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de supprimer le devoir',
        variant: 'destructive'
      });
    }
  };

  // Add new lesson to module
  const handleAddLesson = async (moduleIdx: number) => {
    if (!id) return;

    try {
      const module = modules[moduleIdx];

      // Si le module est en attente, le créer d'abord dans la DB
      if (module.isPending) {
        await fastAPIClient.createModule(id, {
          title: module.title,
          description: module.description,
          duration: module.duration,
          content: []
        });

        // Recharger pour obtenir l'index réel du module
        const updatedCourse = await fastAPIClient.getCourse(id);
        const realModule = updatedCourse.modules[updatedCourse.modules.length - 1];

        // Créer la leçon sur le module réel
        await fastAPIClient.createLesson(id, realModule.id!, {
          title: `Leçon 1`,
          description: 'Description de la leçon',
          duration: '30min'
        });

        // Rafraîchir tout
        const finalCourse = await fastAPIClient.getCourse(id);
        const editableModules = mapCourseToEditableModules(finalCourse);
        setModules(editableModules);

        // Ouvrir automatiquement l'édition de la nouvelle leçon (la première du dernier module)
        const lastModuleIdx = editableModules.length - 1;
        setEditingLessonId({ moduleIdx: lastModuleIdx, lessonIdx: 0 });

        toast({
          title: '✅ Module et leçon créés',
          description: 'Le module a été enregistré avec sa première leçon'
        });
      } else {
        // Comportement actuel pour les modules existants - utiliser l'ID du module
        const dbModule = await fastAPIClient.getCourse(id);
        const targetModule = dbModule.modules[moduleIdx];

        await fastAPIClient.createLesson(id, targetModule.id!, {
          title: `Leçon ${module.lessons.length + 1}`,
          description: 'Description de la leçon',
          duration: '30min'
        });

        const updatedCourse = await fastAPIClient.getCourse(id);
        const editableModules = mapCourseToEditableModules(updatedCourse);
        setModules(editableModules);

        // Ouvrir automatiquement l'édition de la nouvelle leçon (la dernière du module)
        const newLessonIdx = editableModules[moduleIdx].lessons.length - 1;
        setEditingLessonId({ moduleIdx, lessonIdx: newLessonIdx });

        toast({
          title: '✅ Leçon créée',
          description: 'Une nouvelle leçon a été ajoutée au module.'
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de créer la leçon',
        variant: 'destructive'
      });
    }
  };

  // Upload lesson media (video, PDF, or image)
  const handleLessonVideoUpload = async (moduleIdx: number, lessonIdx: number, file: File) => {
    if (!id) return;

    // Detect file type from MIME type
    const mimeType = file.type.toLowerCase();
    let fileKind: 'video' | 'pdf' | 'image';
    let mediaKeyField: 'video_key' | 'pdf_key' | 'image_key';
    let fileTypeLabel: string;

    if (mimeType.startsWith('video/')) {
      fileKind = 'video';
      mediaKeyField = 'video_key';
      fileTypeLabel = 'Vidéo';
    } else if (mimeType === 'application/pdf') {
      fileKind = 'pdf';
      mediaKeyField = 'pdf_key';
      fileTypeLabel = 'PDF';
    } else if (mimeType.startsWith('image/')) {
      fileKind = 'image';
      mediaKeyField = 'image_key';
      fileTypeLabel = 'Image';
    } else {
      toast({
        title: '❌ Type de fichier non supporté',
        description: `Le type ${mimeType} n'est pas accepté`,
        variant: 'destructive'
      });
      return;
    }

    const uploadId = `upload-${Date.now()}`;

    // Ajouter l'upload à la liste
    setUploads(prev => [...prev, {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      const up = await uploadDirect(file, fileKind, {
        onProgress: (uploaded, total) => {
          const progress = Math.round((uploaded / total) * 100);
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? { ...u, progress } : u
          ));
        }
      });

      // Attach media to lesson - récupérer les vrais IDs
      const course = await fastAPIClient.getCourse(id);
      const moduleId = course.modules[moduleIdx].id!;
      const lessonId = course.modules[moduleIdx].content[lessonIdx].id!;

      // Send the correct key field based on file type
      await fastAPIClient.attachLessonMedia(id, moduleId, lessonId, { [mediaKeyField]: up.key });

      setModules(prev => prev.map((mod, mIdx) =>
        mIdx === moduleIdx
          ? {
            ...mod,
            lessons: mod.lessons.map((lesson, lIdx) =>
              lIdx === lessonIdx
                ? { ...lesson, [mediaKeyField]: up.key, videoFileName: file.name, content_type: fileKind }
                : lesson
            )
          }
          : mod
      ));

      // Marquer comme complété
      setUploads(prev => prev.map(u =>
        u.id === uploadId ? { ...u, status: 'completed', progress: 100 } : u
      ));

      // Retirer après 3 secondes
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.id !== uploadId));
      }, 3000);

      toast({ title: `✅ ${fileTypeLabel} uploadé${fileKind === 'image' ? 'e' : ''}`, description: file.name });
    } catch (error) {
      console.error(`Error uploading ${fileKind}:`, error);

      // Marquer comme erreur
      setUploads(prev => prev.map(u =>
        u.id === uploadId ? { ...u, status: 'error', error: 'Échec de l\'upload' } : u
      ));

      toast({ title: "Erreur", description: `Impossible d'uploader ${fileTypeLabel === 'Image' ? "l'image" : fileTypeLabel === 'PDF' ? 'le PDF' : 'la vidéo'}`, variant: "destructive" });
    }
  };

  // Set video URL
  const handleLessonVideoUrl = async (moduleIdx: number, lessonIdx: number, url: string) => {
    if (!id) return;

    try {
      // Récupérer les vrais IDs
      const course = await fastAPIClient.getCourse(id);
      const moduleId = course.modules[moduleIdx].id!;
      const lessonId = course.modules[moduleIdx].content[lessonIdx].id!;

      await fastAPIClient.updateLesson(id, moduleId, lessonId, { video_url: url });

      setModules(prev => prev.map((mod, mIdx) =>
        mIdx === moduleIdx
          ? {
            ...mod,
            lessons: mod.lessons.map((lesson, lIdx) =>
              lIdx === lessonIdx
                ? { ...lesson, video_url: url, content_type: 'url' }
                : lesson
            )
          }
          : mod
      ));

      toast({ title: "✅ URL enregistrée", description: "Lien vidéo sauvegardé" });
    } catch (error) {
      console.error('Error setting video URL:', error);
      toast({ title: "Erreur", description: "Impossible d'enregistrer l'URL", variant: "destructive" });
    }
  };

  // Add new resource
  const handleAddResource = async (file: File) => {
    if (!id || file.type !== 'application/pdf') {
      toast({ title: "Format invalide", description: "Veuillez uploader un PDF", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "Upload ressource...", description: file.name });

      const up = await uploadDirect(file, 'pdf');
      await fastAPIClient.attachCourseResource(id, up.key, file.name, file.size);

      setResources(prev => [
        ...prev,
        { id: `resource-${Date.now()}`, name: file.name, key: up.key, size: file.size }
      ]);

      toast({ title: "✅ Ressource ajoutée", description: file.name });
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader la ressource", variant: "destructive" });
    }
  };

  // Delete resource
  const handleDeleteResource = async (resourceKey: string) => {
    if (!id || !confirm('Supprimer cette ressource ?')) return;

    try {
      await fastAPIClient.detachCourseResource(id, resourceKey);
      setResources(prev => prev.filter(r => r.key !== resourceKey));
      toast({ title: "✅ Ressource supprimée" });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer la ressource", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => navigate(coursesBasePath)}
              className="hover:bg-accent/50 transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Édition du cours
              </h1>
              <p className="text-muted-foreground text-lg mt-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {courseData.title || 'Sans titre'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Save indicator */}
            {isSaving && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Sauvegarde en cours...</span>
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg animate-scale-in">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Status toggle */}
            <div className="flex items-center gap-3 px-4 py-2 bg-card border rounded-lg shadow-sm">
              <Badge variant={courseData.status === 'published' ? 'default' : 'secondary'} className="font-medium">
                {courseData.status === 'published' ? 'Publié' : 'Brouillon'}
              </Badge>
              <Switch
                id="status-toggle"
                checked={courseData.status === 'published'}
                onCheckedChange={handleToggleStatus}
              />
            </div>

            {/* Preview button */}
            <Button
              variant="outline"
              onClick={() => navigate(`${coursesBasePath}/${id}`)}
              className="hover-scale shadow-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-card shadow-md rounded-xl">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all py-3 rounded-lg"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="font-medium">Informations</span>
            </TabsTrigger>
            <TabsTrigger
              value="modules"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all py-3 rounded-lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium">Modules & Leçons</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all py-3 rounded-lg"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              <span className="font-medium">Ressources</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all py-3 rounded-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="font-medium">Prévisualisation</span>
            </TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="general" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Informations générales du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Titre du cours *
                  </Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Maîtrisez React de A à Z"
                    className="text-lg h-12 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description *
                  </Label>
                  <RichTextEditor
                    value={courseData.description}
                    onChange={(value) => setCourseData(prev => ({ ...prev, description: value }))}
                    placeholder="Décrivez votre cours de manière détaillée..."
                    height="220px"
                  />
                </div>

                {/* Cycle d'apprentissage */}
                <div className="space-y-2">
                  <CycleTagSelector
                    selectedCycle={courseData.cycle}
                    selectedTags={courseData.cycleTags}
                    onCycleChange={(cycle) => setCourseData(prev => ({ ...prev, cycle }))}
                    onTagsChange={(tags) => setCourseData(prev => ({ ...prev, cycleTags: tags }))}
                  />
                </div>

                {/* Objectifs pédagogiques */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Objectifs pédagogiques</Label>
                  <div className="space-y-3 mt-2">
                    {courseData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          placeholder={`Objectif ${index + 1}`}
                          className="focus:ring-2 focus:ring-primary transition-all"
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addObjective}
                      className="w-full hover-scale"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un objectif
                    </Button>
                  </div>
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-semibold">
                      Prix (€)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={courseData.price}
                      onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="89.99"
                      className="h-11 focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-semibold">
                      Catégorie
                    </Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setIsAddingCategory(true);
                          return;
                        }
                        setIsAddingCategory(false);
                        setCourseData(prev => ({ ...prev, category: value }));
                      }}
                    >
                      <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary transition-all">
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <>
                          {isLoadingCategories ? (
                            <SelectItem value="__loading" disabled>Chargement...</SelectItem>
                          ) : categories && categories.length > 0 ? (
                            categories.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__empty" disabled>Aucune catégorie disponible</SelectItem>
                          )}
                        </>
                        <SelectItem value="custom">➕ Ajouter une nouvelle catégorie</SelectItem>
                      </SelectContent>
                    </Select>
                    {isAddingCategory && (
                      <div className="mt-2 space-y-2">
                        <Input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Entrez une catégorie personnalisée"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveCustomCategory}
                          className="w-full"
                          disabled={createCategoryMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {createCategoryMutation.isPending ? 'Enregistrement...' : 'Enregistrer et ajouter à la liste'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration & Level */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Durée totale
                    </Label>
                    <Input
                      id="duration"
                      value={courseData.duration}
                      onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Ex: 10h, 2h 30min"
                      className="h-11"
                    />
                    <p className="text-sm text-muted-foreground">
                      Durée totale du cours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-base font-semibold">
                      Niveau
                    </Label>
                    <Select
                      value={courseData.level}
                      onValueChange={(value) => setCourseData(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debutant">🌱 Débutant</SelectItem>
                        <SelectItem value="intermediaire">📈 Intermédiaire</SelectItem>
                        <SelectItem value="difficile">🚀 Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Course Image */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image de couverture
                  </Label>
                  {courseData.imagePreview && (
                    <div className="mt-3 mb-4">
                      <div className="relative group w-full max-w-2xl">
                        <img
                          src={courseData.imagePreview}
                          alt="Couverture"
                          className="w-full h-64 object-cover rounded-xl border-2 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <p className="text-white font-medium">Cliquez pour changer</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="course-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('course-image-upload')?.click()}
                      className="hover-scale shadow-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {courseData.imagePreview ? 'Remplacer l\'image' : 'Uploader une image'}
                    </Button>
                    {courseData.imagePreview && (
                      <span className="text-sm text-muted-foreground">Format recommandé: 16:9 (1920x1080)</span>
                    )}
                  </div>
                </div>

                {/* Program PDF */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Programme de formation (PDF)
                  </Label>
                  {courseData.programFileName && (
                    <div className="flex items-center gap-3 mt-3 mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{courseData.programFileName}</p>
                        <p className="text-sm text-muted-foreground">PDF de formation</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleProgramUpload}
                      className="hidden"
                      id="program-pdf-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('program-pdf-upload')?.click()}
                      className="hover-scale shadow-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {courseData.programFileName ? 'Remplacer le PDF' : 'Uploader un PDF'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules & Lessons Tab */}
          <TabsContent value="modules" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="h-6 w-6 text-primary" />
                  Modules et contenus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Modules et contenus</h2>
                  <Button
                    onClick={() => {
                      const tempId = `temp-${Date.now()}`;
                      const newModule: EditableModule = {
                        index: modules.length,
                        title: `Module ${modules.length + 1}`,
                        description: 'Description du nouveau module',
                        duration: '1h',
                        lessons: [],
                        quizzes: [],
                        isPending: true,
                        tempId: tempId
                      };

                      setModules(prev => [...prev, newModule]);
                      setExpandedModules(prev => [...prev, `module-${modules.length}`]);

                      toast({
                        title: "📝 Module créé localement",
                        description: "Le module sera enregistré lorsque vous ajouterez du contenu"
                      });
                    }}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>

                <Accordion type="single" collapsible value={expandedModules[0] || undefined} onValueChange={(value) => setExpandedModules(value ? [value] : [])}>
                  {modules.map((module, moduleIdx) => (
                    <AccordionItem key={`module-${moduleIdx}`} value={`module-${moduleIdx}`} className="border rounded-lg mb-4 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600">
                              Module {moduleIdx + 1}
                            </Badge>
                            <div className="text-left">
                              <div className="font-semibold text-lg flex items-center gap-2">
                                {module.title || 'Sans titre'}
                                {module.isPending && (
                                  <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-600">
                                    📝 Non enregistré
                                  </Badge>
                                )}
                              </div>
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
                                handleDeleteModule(moduleIdx);
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
                                onChange={(e) => {
                                  setModules(prev => prev.map((m, idx) =>
                                    idx === moduleIdx ? { ...m, title: e.target.value } : m
                                  ));
                                  setModuleHasChanges(prev => ({ ...prev, [moduleIdx]: true }));
                                }}
                                placeholder="Titre du module"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <RichTextEditor
                                value={module.description}
                                onChange={(value) => {
                                  setModules(prev => prev.map((m, idx) =>
                                    idx === moduleIdx ? { ...m, description: value } : m
                                  ));
                                  setModuleHasChanges(prev => ({ ...prev, [moduleIdx]: true }));
                                }}
                                placeholder="Description du module"
                                height="150px"
                              />
                              
                              {/* Bouton de sauvegarde du module */}
                              <div className="flex items-center justify-between mt-4">
                                <div>
                                  {moduleHasChanges[moduleIdx] && !module.isPending && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                                      📝 Modifications non sauvegardées
                                    </Badge>
                                  )}
                                  {module.isPending && (
                                    <p className="text-sm text-muted-foreground">
                                      Le module sera enregistré automatiquement lors de l'ajout de contenu
                                    </p>
                                  )}
                                </div>
                                <Button
                                  onClick={() => handleSaveModule(moduleIdx)}
                                  disabled={module.isPending || !moduleHasChanges[moduleIdx] || savingModule === moduleIdx}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {savingModule === moduleIdx ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Sauvegarde...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="h-4 w-4 mr-2" />
                                      Sauvegarder le module
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>


                          {/* Content Section (Lessons + Quizzes) */}
                          <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-lg">Contenu du module</h4>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddLesson(moduleIdx)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter une leçon
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingQuizId(null); // Nouveau quiz
                                    setShowModuleQuizBuilder(moduleIdx);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter un quiz
                                </Button>
                              </div>
                            </div>

                            {module.lessons.length === 0 && (!module.quizzes || module.quizzes.length === 0) ? (
                              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Aucun contenu pour le moment</p>
                                <p className="text-sm text-gray-400 mt-1">Ajoutez des leçons et des quiz pour construire votre module</p>
                              </div>
                            ) : (
                              <SortableContentList
                                items={(() => {
                                  const lessons = module.lessons || [];
                                  const quizzes = module.quizzes || [];
                                  const assignments = module.assignments || [];

                                  // Construire les items à partir de l'ordre unifié si disponible
                                  if (module.order && module.order.length > 0) {
                                    const orderedItems: ContentItem[] = [];

                                    module.order.forEach((orderItem) => {
                                      if (orderItem.type === 'lesson') {
                                        const lessonIdx = lessons.findIndex((l) => l.id === orderItem.id);
                                        const lesson = lessons[lessonIdx];
                                        if (lesson) {
                                          orderedItems.push({
                                            id: lesson.id || `lesson-${moduleIdx}-${lessonIdx}`,
                                            type: 'lesson',
                                            originalIndex: lessonIdx,
                                            data: lesson,
                                          });
                                        }
                                      } else if (orderItem.type === 'quiz') {
                                        const quizIdx = quizzes.findIndex((q) => q.id === orderItem.id);
                                        const quiz = quizzes[quizIdx];
                                        if (quiz) {
                                          orderedItems.push({
                                            id: quiz.id || `quiz-${moduleIdx}-${quizIdx}`,
                                            type: 'quiz',
                                            originalIndex: quizIdx,
                                            data: quiz,
                                          });
                                        }
                                      } else if (orderItem.type === 'assignment') {
                                        const assignmentIdx = assignments.findIndex((a) => a.id === orderItem.id);
                                        const assignment = assignments[assignmentIdx];
                                        if (assignment) {
                                          orderedItems.push({
                                            id: assignment.id || `assignment-${moduleIdx}-${assignmentIdx}`,
                                            type: 'assignment',
                                            originalIndex: assignmentIdx,
                                            data: assignment,
                                          });
                                        }
                                      }
                                    });

                                    return orderedItems;
                                  }

                                  // Fallback: ordre par défaut (leçons puis quizzes puis assignments)
                                  return [
                                    ...lessons.map((lesson, idx) => ({
                                      id: lesson.id || `lesson-${moduleIdx}-${idx}`,
                                      type: 'lesson' as const,
                                      originalIndex: idx,
                                      data: lesson,
                                    })),
                                    ...quizzes.map((quiz, idx) => ({
                                      id: quiz.id || `quiz-${moduleIdx}-${idx}`,
                                      type: 'quiz' as const,
                                      originalIndex: idx,
                                      data: quiz,
                                    })),
                                    ...assignments.map((assignment, idx) => ({
                                      id: assignment.id || `assignment-${moduleIdx}-${idx}`,
                                      type: 'assignment' as const,
                                      originalIndex: idx,
                                      data: assignment,
                                    })),
                                  ];
                                })()}
                                onReorder={(newItems) => handleContentReorder(moduleIdx, newItems)}
                                onEditLesson={(lessonId) => {
                                  const lessonIdx = module.lessons.findIndex((l) => l.id === lessonId);
                                  if (lessonIdx !== -1) {
                                    setEditingLessonId({ moduleIdx, lessonIdx });
                                  }
                                }}
                                onDeleteLesson={(lessonId) => {
                                  const lessonIdx = module.lessons.findIndex((l) => l.id === lessonId);
                                  if (lessonIdx !== -1) {
                                    handleDeleteLesson(moduleIdx, lessonIdx);
                                  }
                                }}
                                onEditQuiz={(quizIndex) => {
                                  const quiz = module.quizzes?.[quizIndex];
                                  if (quiz?.id) {
                                    setEditingQuizId(quiz.id);
                                  }
                                  setShowModuleQuizBuilder(moduleIdx);
                                }}
                                onDeleteQuiz={(quizIndex) => {
                                  const quiz = module.quizzes?.[quizIndex];
                                  if (quiz?.id) {
                                    handleDeleteModuleQuiz(moduleIdx, quiz.id);
                                  }
                                }}
                                onEditAssignment={() => {
                                  setShowAssignmentBuilder(moduleIdx);
                                }}
                                onDeleteAssignment={() => {
                                  handleDeleteModuleAssignment(moduleIdx);
                                }}
                              />
                            )}

                            {/* Lesson Edit Form - shown below the sortable list */}
                            {editingLessonId?.moduleIdx === moduleIdx && editingLessonId?.lessonIdx !== undefined && (
                              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 mt-6">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-semibold">Édition de la leçon</h5>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingLessonId(null)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {(() => {
                                    const lesson = module.lessons[editingLessonId.lessonIdx];
                                    if (!lesson) return null;

                                    return (
                                      <>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Titre de la leçon</Label>
                                            <Input
                                              value={lesson.title}
                                              onChange={(e) => setModules(prev => prev.map((m, mIdx) =>
                                                mIdx === moduleIdx
                                                  ? {
                                                    ...m,
                                                    lessons: m.lessons.map((l, lIdx) =>
                                                      lIdx === editingLessonId.lessonIdx ? { ...l, title: e.target.value } : l
                                                    )
                                                  }
                                                  : m
                                              ))}
                                              placeholder="Titre"
                                              className="mt-2"
                                            />
                                          </div>
                                          <div>
                                            <Label>Durée (minutes)</Label>
                                            <Input
                                              type="number"
                                              value={lesson.duration}
                                              onChange={(e) => setModules(prev => prev.map((m, mIdx) =>
                                                mIdx === moduleIdx
                                                  ? {
                                                    ...m,
                                                    lessons: m.lessons.map((l, lIdx) =>
                                                      lIdx === editingLessonId.lessonIdx ? { ...l, duration: e.target.value } : l
                                                    )
                                                  }
                                                  : m
                                              ))}
                                              placeholder="30"
                                              className="mt-2"
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Description de la leçon</Label>
                                          <RichTextEditor
                                            value={lesson.description || ''}
                                            onChange={(value) => {
                                              setModules(prev => prev.map((m, mIdx) =>
                                                mIdx === moduleIdx
                                                  ? {
                                                    ...m,
                                                    lessons: m.lessons.map((l, lIdx) =>
                                                      lIdx === editingLessonId.lessonIdx ? { ...l, description: value } : l
                                                    )
                                                  }
                                                  : m
                                              ));
                                            }}
                                            placeholder="Description détaillée de la leçon..."
                                          />
                                        </div>

                                        {/* Media display - read-only for now */}
                                        {(lesson.videoFileName || lesson.pdfFileName || lesson.imageFileName || lesson.video_url) && (
                                          <div className="space-y-2">
                                            <Label>Média de la leçon</Label>
                                            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                              {lesson.videoFileName && (
                                                <>
                                                  <Video className="h-5 w-5 text-blue-600" />
                                                  <span className="text-sm">{lesson.videoFileName}</span>
                                                </>
                                              )}
                                              {lesson.pdfFileName && (
                                                <>
                                                  <FileText className="h-5 w-5 text-blue-600" />
                                                  <span className="text-sm">{lesson.pdfFileName}</span>
                                                </>
                                              )}
                                              {lesson.imageFileName && (
                                                <>
                                                  <ImageIcon className="h-5 w-5 text-blue-600" />
                                                  <span className="text-sm">{lesson.imageFileName}</span>
                                                </>
                                              )}
                                              {lesson.video_url && (
                                                <>
                                                  <LinkIcon className="h-5 w-5 text-blue-600" />
                                                  <span className="text-sm truncate">{lesson.video_url}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                          <Button
                                            size="sm"
                                            onClick={() => handleSaveLesson(moduleIdx, editingLessonId.lessonIdx)}
                                            disabled={isSaving}
                                          >
                                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                            Sauvegarder
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingLessonId(null)}
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Annuler
                                          </Button>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </CardContent>
                              </Card>
                            )}
                          </div>


                          {/* Assignment Section for Module */}
                          <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-orange-600" />
                                <h4 className="font-semibold text-lg">Devoir de fin de module</h4>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                              Un devoir permet d'évaluer l'ensemble des compétences acquises dans ce module.
                            </div>
                            {module.assignments && module.assignments.length > 0 ? (
                              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle className="text-lg">{module.assignments[0].title}</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {module.assignments[0].questions?.length || 0} questions •
                                        Note de passage: {module.assignments[0].settings?.passing_score || 60}%
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAssignmentBuilder(moduleIdx)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteModuleAssignment(moduleIdx)}
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
                                onClick={() => setShowAssignmentBuilder(moduleIdx)}
                                className="w-full"
                                disabled={module.isPending}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un devoir pour ce module
                              </Button>
                            )}
                            {module.isPending && (
                              <p className="text-sm text-amber-600">
                                Le module sera enregistré automatiquement lors de l'ajout de contenu
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  Ressources pédagogiques
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {resources.length > 0 && (
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <Card key={resource.id} className="bg-card border-2 hover:border-primary/50 transition-all hover-scale">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-destructive/10 rounded-lg">
                                <FileText className="h-6 w-6 text-destructive" />
                              </div>
                              <div>
                                <div className="font-semibold text-base">{resource.name}</div>
                                {resource.size && (
                                  <Badge variant="outline" className="mt-1 font-normal">
                                    {(resource.size / 1024 / 1024).toFixed(2)} MB
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => resource.key && handleDeleteResource(resource.key)}
                              className="hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}


                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base font-semibold mb-2">Ajouter des ressources pédagogiques</p>
                  <p className="text-sm text-muted-foreground mb-4">Fichiers PDF uniquement • Glissez-déposez ou cliquez</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handleAddResource(file));
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="resources-upload"
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => document.getElementById('resources-upload')?.click()}
                    className="hover-scale"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sélectionner des fichiers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="h-6 w-6 text-primary" />
                  Prévisualisation du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Course Header */}
                <div className="flex gap-6 items-start">
                  {courseData.imagePreview && (
                    <div className="relative group">
                      <img
                        src={courseData.imagePreview}
                        alt={courseData.title}
                        className="w-80 h-48 object-cover rounded-xl border-2 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-3">{courseData.title || 'Sans titre'}</h2>
                    {courseData.description ? (
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground mb-6 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(courseData.description || '', 'text/html');
                            doc.querySelectorAll('script, style').forEach(n => n.remove());
                            doc.querySelectorAll('*').forEach(el => {
                              [...el.attributes].forEach(attr => {
                                if (/^on/i.test(attr.name) || attr.name === 'style') {
                                  el.removeAttribute(attr.name);
                                }
                              });
                            });
                            return doc.body.innerHTML;
                          })()
                        }}
                      />
                    ) : (
                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">Aucune description</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="default" className="text-base px-3 py-1">
                        {courseData.level}
                      </Badge>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {courseData.category || 'Non catégorisé'}
                      </Badge>
                      {courseData.duration && (
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {courseData.duration}
                        </Badge>
                      )}
                      {courseData.price && (
                        <div className="text-2xl font-bold text-primary">
                          {courseData.price} €
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modules Preview */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Contenu du cours</h3>
                    <Badge variant="secondary">{modules.length} modules</Badge>
                  </div>
                  <div className="space-y-3">
                    {modules.map((module, idx) => (
                      <Card key={`preview-${idx}`} className="bg-card border-2 hover:border-primary/50 transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold text-base">{module.title}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline" className="font-normal">
                                    {module.lessons.length} leçon{module.lessons.length > 1 ? 's' : ''}
                                  </Badge>
                                  {module.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {module.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Resources Preview */}
                {resources.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Ressources disponibles</h3>
                      <Badge variant="secondary">{resources.length} fichiers</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex items-center gap-3 p-4 bg-accent/50 border rounded-lg hover:bg-accent transition-colors">
                          <div className="p-2 bg-destructive/10 rounded-lg">
                            <FileText className="h-5 w-5 text-destructive" />
                          </div>
                          <span className="text-sm font-medium">{resource.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Module Quiz Builder Dialog */}
      {showModuleQuizBuilder !== null && (
        <Dialog open={true} onOpenChange={() => setShowModuleQuizBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configurer le quiz du module</DialogTitle>
            </DialogHeader>
            <QuizBuilder
              quiz={modules[showModuleQuizBuilder]?.quizzes?.[0] ? {
                id: `quiz-${showModuleQuizBuilder}`,
                type: 'quiz',
                title: modules[showModuleQuizBuilder].quizzes![0].title,
                description: '',
                questions: modules[showModuleQuizBuilder].quizzes![0].questions.map((q, idx) => ({
                  id: `q-${idx}`,
                  type: 'single-choice' as const,
                  question: q.question,
                  points: 1,
                  options: q.options,
                  correctAnswer: q.options.indexOf(q.correct_answer)
                })),
                settings: {
                  showFeedback: 'after-submit' as const,
                  allowRetry: true,
                  passingScore: 70,
                }
              } : undefined}
              onSave={(quiz) => handleSaveModuleQuiz(showModuleQuizBuilder, quiz)}
              onCancel={() => setShowModuleQuizBuilder(null)}
              availableTypes={[
                'single-choice',
                'multiple-choice',
                'true-false',
                'short-answer',
                'long-answer',
                'fill-blank',
                'matching',
                'ordering'
              ]}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Module Assignment Builder Dialog */}
      {showAssignmentBuilder !== null && (
        <Dialog open={true} onOpenChange={() => setShowAssignmentBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modules[showAssignmentBuilder]?.assignments?.length > 0 
                  ? "Modifier le devoir du module"
                  : "Créer un devoir pour le module"
                }
              </DialogTitle>
            </DialogHeader>
            <AssignmentBuilder
              assignment={modules[showAssignmentBuilder]?.assignments?.[0] ? {
                id: `assignment-${showAssignmentBuilder}`,
                type: 'assignment' as const,
                title: modules[showAssignmentBuilder].assignments![0].title,
                description: modules[showAssignmentBuilder].assignments![0].description || '',
                instructions: modules[showAssignmentBuilder].assignments![0].instructions || '',
                questions: (modules[showAssignmentBuilder].assignments![0].questions || []).map((q: any, idx: number) => ({
                  id: `q-${idx}`,
                  type: q.type || 'single-choice',
                  question: q.question,
                  points: q.points || 1,
                  options: q.options || [],
                  correctAnswer: q.type === 'single-choice' || q.type === 'true-false'
                    ? (q.options || []).indexOf(q.correct_answer)
                    : undefined,
                  correctAnswers: q.type === 'multiple-choice'
                    ? (q.options || []).map((opt: string, i: number) => 
                        Array.isArray(q.correct_answer) && q.correct_answer.includes(opt) ? i : -1
                      ).filter((i: number) => i >= 0)
                    : undefined,
                })),
                settings: {
                  passingScore: modules[showAssignmentBuilder].assignments![0].settings?.passing_score || 60,
                  maxAttempts: modules[showAssignmentBuilder].assignments![0].settings?.max_attempts || 3,
                  timeLimit: modules[showAssignmentBuilder].assignments![0].settings?.time_limit,
                  allowLateSubmission: modules[showAssignmentBuilder].assignments![0].settings?.allow_late_submission || false,
                  requiresManualGrading: modules[showAssignmentBuilder].assignments![0].settings?.requires_manual_grading || false,
                  rubric: [], // Rubric simplifiée pour l'instant
                }
              } : undefined}
              onSave={(assignment) => handleSaveModuleAssignment(showAssignmentBuilder, assignment)}
              onCancel={() => setShowAssignmentBuilder(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Notifications */}
      <UploadNotification
        uploads={uploads}
        onRemove={(id) => setUploads(prev => prev.filter(u => u.id !== id))}
      />
    </div>
  );
};

export default EditCoursePage;
