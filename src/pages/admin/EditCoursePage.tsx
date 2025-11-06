import React, { useState, useEffect } from 'react';
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
  Check,
  X,
  Upload,
  Eye,
  Clock,
  BookOpen,
  HelpCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fastAPIClient } from '@/services/fastapi-client';
import { uploadDirect } from '@/utils/upload';
import type { CourseResponse, Module, Content, Quiz, QuizCreate } from '@/types/fastapi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { QuizBuilder } from '@/components/quiz';
import type { QuizConfig } from '@/types/quiz';

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
}

interface EditableModule {
  index: number;
  title: string;
  description: string;
  duration: string;
  lessons: EditableLesson[];
  quizzes?: Quiz[];
}

interface EditableLesson {
  index: number;
  title: string;
  description: string;
  duration: string;
  video_key?: string;
  videoFileName?: string;
  transcription?: string;
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

  // Editable course data
  const [courseData, setCourseData] = useState<EditableCourseData>({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'débutant',
    status: 'draft',
    imagePreview: null,
    programFileName: '',
  });

  const [modules, setModules] = useState<EditableModule[]>([]);
  const [resources, setResources] = useState<PedagogicalResource[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newProgram, setNewProgram] = useState<File | null>(null);

  // Editing states
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<{ moduleIdx: number; lessonIdx: number } | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [showQuizBuilder, setShowQuizBuilder] = useState<number | null>(null);
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<number | null>(null);

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
        const baseEditable: EditableCourseData = {
          title: courseData.title || '',
          description: courseData.description || '',
          price: courseData.price?.toString() || '',
          category: courseData.category || '',
          duration: courseData.duration || '',
          level: courseData.level || 'débutant',
          status: (courseData.status as any) || 'draft',
          imagePreview: null,
          programFileName: courseData.program_pdf_key ? 'Programme.pdf' : '',
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
        const editableModules: EditableModule[] = (courseData.modules || []).map((mod: Module, idx: number) => ({
          index: idx,
          title: mod.title || '',
          description: mod.description || '',
          duration: mod.duration || '',
          lessons: (mod.content || []).map((lesson: Content, lessonIdx: number) => ({
            index: lessonIdx,
            title: lesson.title || '',
            description: lesson.description || '',
            duration: lesson.duration || '',
            video_key: lesson.video_key,
            videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
            transcription: lesson.transcription || undefined,
          })),
          quizzes: mod.quizzes || [],
        }));
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
      toast({ title: "✅ Module sauvegardé", description: moduleToSave.title });
      
      // Refresh course data
      const updatedCourse = await fastAPIClient.getCourse(id);
      const modulesData: EditableModule[] = updatedCourse.modules.map((mod, idx) => ({
        index: idx,
        title: mod.title,
        description: mod.description || '',
        duration: mod.duration,
        lessons: mod.content.map((lesson, lessonIdx) => ({
          index: lessonIdx,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
        })),
        quizzes: mod.quizzes || []
      }));
      setModules(modulesData);
    } catch (error) {
      console.error('Error saving module:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder le module", variant: "destructive" });
    }
  };

  // Save lesson changes
  const handleSaveLesson = async (moduleIdx: number, lessonIdx: number) => {
    if (!id) return;

    try {
      const lesson = modules[moduleIdx].lessons[lessonIdx];
      await fastAPIClient.updateLesson(id, moduleIdx, lessonIdx, {
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
    if (!id || !confirm('Supprimer ce module ?')) return;

    try {
      await fastAPIClient.deleteModule(id, moduleIdx, true);
      toast({ title: "✅ Module supprimé" });
      
      // Refresh course data
      const updatedCourse = await fastAPIClient.getCourse(id);
      const modulesData: EditableModule[] = updatedCourse.modules.map((mod, idx) => ({
        index: idx,
        title: mod.title,
        description: mod.description || '',
        duration: mod.duration,
        lessons: mod.content.map((lesson, lessonIdx) => ({
          index: lessonIdx,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
        })),
        quizzes: mod.quizzes || []
      }));
      setModules(modulesData);
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer le module", variant: "destructive" });
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (moduleIdx: number, lessonIdx: number) => {
    if (!id || !confirm('Supprimer cette leçon ?')) return;

    try {
      await fastAPIClient.deleteLesson(id, moduleIdx, lessonIdx);
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

  // Save module quiz
  const handleSaveModuleQuiz = async (moduleIdx: number, quiz: QuizConfig) => {
    if (!id) return;
    
    try {
      const module = modules[moduleIdx];
      
      const quizPayload: QuizCreate = {
        title: quiz.title,
        questions: quiz.questions
          .filter(q => ['single-choice', 'true-false', 'multiple-choice'].includes(q.type))
          .map(q => {
            if (q.type === 'single-choice') {
              return {
                question: q.question,
                options: q.options,
                correct_answer: q.options[q.correctAnswer]
              };
            } else if (q.type === 'true-false') {
              return {
                question: q.question,
                options: ['Vrai', 'Faux'],
                correct_answer: q.correctAnswer ? 'Vrai' : 'Faux'
              };
            } else if (q.type === 'multiple-choice') {
              return {
                question: q.question,
                options: q.options,
                correct_answer: q.correctAnswers.map(idx => q.options[idx]).join(', ')
              };
            }
            return null;
          })
          .filter(q => q !== null) as any[]
      };
      
      // Utiliser updateModule avec le payload complet incluant le quiz
      const updatedModuleData = {
        title: module.title,
        description: module.description,
        duration: module.duration,
        content: module.lessons.map(l => ({
          title: l.title,
          description: l.description,
          duration: l.duration,
        })) as any,
        quizzes: [quizPayload],
      };

      await fastAPIClient.updateModule(id, moduleIdx, updatedModuleData);
      
      const updatedCourse = await fastAPIClient.getCourse(id);
      const modulesData: EditableModule[] = updatedCourse.modules.map((mod, idx) => ({
        index: idx,
        title: mod.title,
        description: mod.description || '',
        duration: mod.duration,
        lessons: mod.content.map((lesson, lessonIdx) => ({
          index: lessonIdx,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
        })),
        quizzes: mod.quizzes || []
      }));
      setModules(modulesData);
      
      setShowModuleQuizBuilder(null);
      toast({ 
        title: '✅ Quiz sauvegardé',
        description: 'Le quiz du module a été enregistré avec succès.'
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de sauvegarder le quiz',
        variant: 'destructive'
      });
    }
  };

  // Delete module quiz
  const handleDeleteModuleQuiz = async (moduleIdx: number) => {
    if (!id || !confirm('Supprimer ce quiz ?')) return;
    
    try {
      const module = modules[moduleIdx];
      
      // Utiliser updateModule avec le payload complet sans quiz
      const updatedModuleData = {
        title: module.title,
        description: module.description,
        duration: module.duration,
        content: module.lessons.map(l => ({
          title: l.title,
          description: l.description,
          duration: l.duration,
        })) as any,
        quizzes: [],
      };

      await fastAPIClient.updateModule(id, moduleIdx, updatedModuleData);
      
      const updatedCourse = await fastAPIClient.getCourse(id);
      const modulesData: EditableModule[] = updatedCourse.modules.map((mod, idx) => ({
        index: idx,
        title: mod.title,
        description: mod.description || '',
        duration: mod.duration,
        lessons: mod.content.map((lesson, lessonIdx) => ({
          index: lessonIdx,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
        })),
        quizzes: mod.quizzes || []
      }));
      setModules(modulesData);
      
      toast({ 
        title: '✅ Quiz supprimé',
        description: 'Le quiz du module a été supprimé.'
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de supprimer le quiz',
        variant: 'destructive'
      });
    }
  };

  // Add new lesson to module
  const handleAddLesson = async (moduleIdx: number) => {
    if (!id) return;
    
    try {
      await fastAPIClient.createLesson(id, moduleIdx, {
        title: `Leçon ${modules[moduleIdx].lessons.length + 1}`,
        description: 'Description de la leçon',
        duration: '30min'
      });
      
      const updatedCourse = await fastAPIClient.getCourse(id);
      const modulesData: EditableModule[] = updatedCourse.modules.map((mod, idx) => ({
        index: idx,
        title: mod.title,
        description: mod.description || '',
        duration: mod.duration,
        lessons: mod.content.map((lesson, lessonIdx) => ({
          index: lessonIdx,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_key: lesson.video_key,
          videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
        })),
        quizzes: mod.quizzes || []
      }));
      setModules(modulesData);
      
      toast({ 
        title: '✅ Leçon créée',
        description: 'Une nouvelle leçon a été ajoutée au module.'
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.detail || 'Impossible de créer la leçon',
        variant: 'destructive'
      });
    }
  };

  // Upload lesson video
  const handleLessonVideoUpload = async (moduleIdx: number, lessonIdx: number, file: File) => {
    if (!id) return;

    try {
      toast({ title: "Upload vidéo...", description: file.name });

      const up = await uploadDirect(file, 'video');

      // Attach video to lesson
      await fastAPIClient.attachLessonVideo(id, moduleIdx, lessonIdx, up.key);

      setModules(prev => prev.map((mod, mIdx) =>
        mIdx === moduleIdx
          ? {
            ...mod,
            lessons: mod.lessons.map((lesson, lIdx) =>
              lIdx === lessonIdx
                ? { ...lesson, video_key: up.key, videoFileName: file.name }
                : lesson
            )
          }
          : mod
      ));

      toast({ title: "✅ Vidéo uploadée", description: file.name });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader la vidéo", variant: "destructive" });
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
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre cours de manière détaillée..."
                    rows={6}
                    className="focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
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
                      onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary transition-all">
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">📱 Développement</SelectItem>
                        <SelectItem value="design">🎨 Design</SelectItem>
                        <SelectItem value="marketing">📊 Marketing</SelectItem>
                        <SelectItem value="business">💼 Business</SelectItem>
                        <SelectItem value="other">🔧 Autre</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="débutant">🌱 Débutant</SelectItem>
                        <SelectItem value="intermédiaire">📈 Intermédiaire</SelectItem>
                        <SelectItem value="avancé">🚀 Avancé</SelectItem>
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
                  Modules et leçons du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">Liste des modules</h3>
                  <Button
                    onClick={async () => {
                      if (!id) return;
                      try {
                        const newModuleIndex = modules.length;
                        await fastAPIClient.createModule(id, {
                          title: `Module ${newModuleIndex + 1}`,
                          description: 'Description du nouveau module',
                          duration: '1h',
                          content: []
                        });
                        
                        // Recharger le cours pour obtenir le nouveau module
                        const updatedCourse = await fastAPIClient.getCourse(id);
                        const editableModules: EditableModule[] = (updatedCourse.modules || []).map((mod, idx) => ({
                          index: idx,
                          title: mod.title || '',
                          description: mod.description || '',
                          duration: mod.duration || '',
                          lessons: (mod.content || []).map((lesson, lessonIdx) => ({
                            index: lessonIdx,
                            title: lesson.title || '',
                            description: lesson.description || '',
                            duration: lesson.duration || '',
                            video_key: lesson.video_key,
                            videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
                          })),
                        }));
                        setModules(editableModules);
                        setExpandedModules([...expandedModules, `module-${newModuleIndex}`]);
                        
                        toast({
                          title: "✅ Module créé",
                          description: "Nouveau module ajouté avec succès"
                        });
                      } catch (error) {
                        console.error('Error creating module:', error);
                        toast({
                          title: "Erreur",
                          description: "Impossible de créer le module",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="hover-scale"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>

                {modules.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="inline-flex p-6 bg-muted rounded-full mb-4">
                      <BookOpen className="h-16 w-16" />
                    </div>
                    <p className="text-lg font-medium mb-2">Aucun module disponible</p>
                    <p className="text-sm mb-4">Créez votre premier module pour commencer</p>
                    <Button
                      onClick={async () => {
                        if (!id) return;
                        try {
                          await fastAPIClient.createModule(id, {
                            title: 'Module 1',
                            description: 'Description du module',
                            duration: '1h',
                            content: []
                          });
                          
                          const updatedCourse = await fastAPIClient.getCourse(id);
                          const editableModules: EditableModule[] = (updatedCourse.modules || []).map((mod, idx) => ({
                            index: idx,
                            title: mod.title || '',
                            description: mod.description || '',
                            duration: mod.duration || '',
                            lessons: (mod.content || []).map((lesson, lessonIdx) => ({
                              index: lessonIdx,
                              title: lesson.title || '',
                              description: lesson.description || '',
                              duration: lesson.duration || '',
                              video_key: lesson.video_key,
                              videoFileName: lesson.video_key ? 'Vidéo existante' : undefined,
                            })),
                          }));
                          setModules(editableModules);
                          setExpandedModules(['module-0']);
                          
                          toast({
                            title: "✅ Module créé",
                            description: "Premier module ajouté avec succès"
                          });
                        } catch (error) {
                          console.error('Error creating module:', error);
                          toast({
                            title: "Erreur",
                            description: "Impossible de créer le module",
                            variant: "destructive"
                          });
                        }
                      }}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Créer le premier module
                    </Button>
                  </div>
                ) : (
                  <Accordion type="multiple" value={expandedModules} onValueChange={setExpandedModules} className="space-y-4">
                    {modules.map((module, moduleIdx) => (
                      <AccordionItem
                        key={`module-${moduleIdx}`}
                        value={`module-${moduleIdx}`}
                        className="border-2 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-card"
                      >
                        <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-lg">{module.title || `Module ${moduleIdx + 1}`}</div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                  <Badge variant="secondary" className="font-normal">
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
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="pt-4 space-y-6">
                            {/* Module Edit Form */}
                            {editingModuleId === moduleIdx ? (
                              <Card className="bg-accent/30 border-2 border-primary/20">
                                <CardContent className="pt-6 space-y-4">
                                  <div className="space-y-2">
                                    <Label className="font-semibold">Titre du module</Label>
                                    <Input
                                      value={module.title}
                                      onChange={(e) => setModules(prev => prev.map((m, idx) =>
                                        idx === moduleIdx ? { ...m, title: e.target.value } : m
                                      ))}
                                      placeholder="Titre du module"
                                      className="h-11 focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold">Description</Label>
                                    <Textarea
                                      value={module.description}
                                      onChange={(e) => setModules(prev => prev.map((m, idx) =>
                                        idx === moduleIdx ? { ...m, description: e.target.value } : m
                                      ))}
                                      placeholder="Description du module"
                                      rows={3}
                                      className="focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveModule(moduleIdx)}
                                      className="hover-scale"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Sauvegarder
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingModuleId(null)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Annuler
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="flex items-start justify-between p-4 bg-accent/20 rounded-lg">
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground">{module.description || 'Aucune description'}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingModuleId(moduleIdx)}
                                    className="hover:bg-primary/10"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteModule(moduleIdx)}
                                    className="hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Lessons */}
                            <div className="space-y-4 mt-6">
                              <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-border"></div>
                                <h4 className="font-bold text-sm text-foreground px-3 py-1 bg-muted rounded-full">
                                  Leçons ({module.lessons.length})
                                </h4>
                                <div className="h-px flex-1 bg-border"></div>
                              </div>
                              {module.lessons.map((lesson, lessonIdx) => (
                                <Card
                                  key={`lesson-${moduleIdx}-${lessonIdx}`}
                                  className="bg-card border-2 hover:border-primary/50 transition-all hover-scale shadow-sm"
                                >
                                  <CardContent className="pt-6">
                                    {editingLessonId?.moduleIdx === moduleIdx && editingLessonId?.lessonIdx === lessonIdx ? (
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label className="font-semibold">Titre de la leçon</Label>
                                          <Input
                                            value={lesson.title}
                                            onChange={(e) => setModules(prev => prev.map((m, mIdx) =>
                                              mIdx === moduleIdx
                                                ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l, lIdx) =>
                                                    lIdx === lessonIdx ? { ...l, title: e.target.value } : l
                                                  )
                                                }
                                                : m
                                            ))}
                                            placeholder="Titre de la leçon"
                                            className="h-11 focus:ring-2 focus:ring-primary"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="font-semibold">Description</Label>
                                          <Textarea
                                            value={lesson.description}
                                            onChange={(e) => setModules(prev => prev.map((m, mIdx) =>
                                              mIdx === moduleIdx
                                                ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l, lIdx) =>
                                                    lIdx === lessonIdx ? { ...l, description: e.target.value } : l
                                                  )
                                                }
                                                : m
                                            ))}
                                            placeholder="Description de la leçon"
                                            rows={2}
                                            className="focus:ring-2 focus:ring-primary"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="font-semibold flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Durée
                                          </Label>
                                          <Input
                                            value={lesson.duration}
                                            onChange={(e) => setModules(prev => prev.map((m, mIdx) =>
                                              mIdx === moduleIdx
                                                ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l, lIdx) =>
                                                    lIdx === lessonIdx ? { ...l, duration: e.target.value } : l
                                                  )
                                                }
                                                : m
                                            ))}
                                            placeholder="Durée (ex: 45min)"
                                            className="h-11 focus:ring-2 focus:ring-primary"
                                          />
                                        </div>

                                        {/* Video upload */}
                                        <div className="space-y-2">
                                          <Label className="font-semibold flex items-center gap-2">
                                            <Video className="h-4 w-4" />
                                            Vidéo de la leçon
                                          </Label>
                                          {lesson.videoFileName && (
                                            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                              <Video className="h-5 w-5 text-primary" />
                                              <span className="text-sm font-medium">{lesson.videoFileName}</span>
                                            </div>
                                          )}
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleLessonVideoUpload(moduleIdx, lessonIdx, file);
                                            }}
                                            className="hidden"
                                            id={`lesson-video-${moduleIdx}-${lessonIdx}`}
                                          />
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => document.getElementById(`lesson-video-${moduleIdx}-${lessonIdx}`)?.click()}
                                            className="hover-scale"
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {lesson.videoFileName ? 'Remplacer' : 'Uploader'} une vidéo
                                          </Button>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                          <Button
                                            size="sm"
                                            onClick={() => handleSaveLesson(moduleIdx, lessonIdx)}
                                            className="hover-scale"
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            Sauvegarder
                                          </Button>
                                          <Button size="sm" variant="ghost" onClick={() => setEditingLessonId(null)}>
                                            <X className="h-4 w-4 mr-2" />
                                            Annuler
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="p-2 bg-primary/10 rounded-lg">
                                            <Video className="h-5 w-5 text-primary" />
                                          </div>
                                          <div>
                                            <div className="font-semibold text-base">{lesson.title || `Leçon ${lessonIdx + 1}`}</div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                              {lesson.duration && (
                                                <Badge variant="outline" className="font-normal">
                                                  <Clock className="h-3 w-3 mr-1" />
                                                  {lesson.duration}
                                                </Badge>
                                              )}
                                              {lesson.videoFileName && (
                                                <Badge variant="secondary" className="font-normal">
                                                  <Video className="h-3 w-3 mr-1" />
                                                  {lesson.videoFileName}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingLessonId({ moduleIdx, lessonIdx })}
                                            className="hover:bg-primary/10"
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteLesson(moduleIdx, lessonIdx)}
                                            className="hover:bg-destructive/10"
                                          >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                                ))}
                              </div>

                              {/* Bouton Ajouter une leçon */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddLesson(moduleIdx)}
                                className="w-full mt-4"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter une leçon
                              </Button>

                              {/* Quiz Section */}
                              <div className="space-y-4 border-t pt-6 mt-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-semibold text-lg">Quiz du module</h4>
                                  </div>
                                </div>
                                
                                {module.quizzes && module.quizzes.length > 0 ? (
                                  module.quizzes.map((quiz, quizIdx) => (
                                    <Card key={`quiz-${module.index}-${quizIdx}`} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                                      <CardHeader>
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                              {quiz.questions.length} questions
                                            </p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => setShowModuleQuizBuilder(module.index)}
                                            >
                                              <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => handleDeleteModuleQuiz(module.index)}
                                            >
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardHeader>
                                    </Card>
                                  ))
                                ) : (
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowModuleQuizBuilder(module.index)}
                                    className="w-full"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter un quiz à ce module
                                  </Button>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                    ))}
                  </Accordion>
                )}
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
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed">{courseData.description || 'Aucune description'}</p>
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
              availableTypes={['single-choice', 'multiple-choice', 'true-false']}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditCoursePage;
