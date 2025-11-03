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
import type { CourseResponse, Module, Content } from '@/types/fastapi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
}

interface EditableLesson {
  index: number;
  title: string;
  description: string;
  duration: string;
  video_key?: string;
  videoFileName?: string;
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
  const [showQuizBuilder, setShowQuizBuilder] = useState<{ moduleIdx: number; lessonIdx?: number } | null>(null);

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
        setCourseData({
          title: courseData.title || '',
          description: courseData.description || '',
          price: courseData.price?.toString() || '',
          category: courseData.category || '',
          duration: courseData.duration || '',
          level: courseData.level || 'débutant',
          status: (courseData.status as any) || 'draft',
          imagePreview: courseData.image_url || courseData.cover_key ? 
            `${import.meta.env.VITE_API_URL}/api/storage/${courseData.cover_key || courseData.image_url}` : null,
          programFileName: courseData.program_pdf_key ? 'Programme.pdf' : '',
        });

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
          })),
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

      const prepareResponse = await fastAPIClient.prepareUpload(
        file.name,
        file.type,
        file.size
      );

      if (prepareResponse.strategy === 'single' && prepareResponse.url) {
        await fetch(prepareResponse.url, {
          method: 'PUT',
          body: file,
          headers: prepareResponse.headers || {},
        });

        await fastAPIClient.completeUpload({
          strategy: 'single',
          key: prepareResponse.key,
          content_type: file.type,
          size: file.size,
        });

        // Update course with new cover key
        await fastAPIClient.updateCourse(id, { cover_key: prepareResponse.key });
        
        const imageUrl = `${import.meta.env.VITE_API_URL}/api/storage/${prepareResponse.key}`;
        setCourseData(prev => ({ ...prev, imagePreview: imageUrl }));

        toast({ title: "✅ Image mise à jour", description: "La couverture a été modifiée" });
      }
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

      const prepareResponse = await fastAPIClient.prepareUpload(file.name, file.type, file.size);

      if (prepareResponse.strategy === 'single' && prepareResponse.url) {
        await fetch(prepareResponse.url, {
          method: 'PUT',
          body: file,
          headers: prepareResponse.headers || {},
        });

        await fastAPIClient.completeUpload({
          strategy: 'single',
          key: prepareResponse.key,
          content_type: file.type,
          size: file.size,
        });

        await fastAPIClient.updateCourse(id, { program_pdf_key: prepareResponse.key });
        setCourseData(prev => ({ ...prev, programFileName: file.name }));

        toast({ title: "✅ Programme mis à jour", description: file.name });
      }
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
          video_url: l.video_key,
        })),
      });

      setEditingModuleId(null);
      toast({ title: "✅ Module sauvegardé", description: moduleToSave.title });
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
        video_url: lesson.video_key,
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
      await fastAPIClient.deleteModule(id, moduleIdx);
      setModules(prev => prev.filter((_, idx) => idx !== moduleIdx));
      toast({ title: "✅ Module supprimé" });
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

  // Upload lesson video
  const handleLessonVideoUpload = async (moduleIdx: number, lessonIdx: number, file: File) => {
    if (!id) return;

    try {
      toast({ title: "Upload vidéo...", description: file.name });

      const prepareResponse = await fastAPIClient.prepareUpload(file.name, file.type, file.size);

      if (prepareResponse.strategy === 'single' && prepareResponse.url) {
        await fetch(prepareResponse.url, {
          method: 'PUT',
          body: file,
          headers: prepareResponse.headers || {},
        });

        await fastAPIClient.completeUpload({
          strategy: 'single',
          key: prepareResponse.key,
          content_type: file.type,
          size: file.size,
        });

        // Attach video to lesson
        await fastAPIClient.attachLessonVideo(id, moduleIdx, lessonIdx, prepareResponse.key);

        setModules(prev => prev.map((mod, mIdx) => 
          mIdx === moduleIdx 
            ? {
                ...mod,
                lessons: mod.lessons.map((lesson, lIdx) =>
                  lIdx === lessonIdx
                    ? { ...lesson, video_key: prepareResponse.key, videoFileName: file.name }
                    : lesson
                )
              }
            : mod
        ));

        toast({ title: "✅ Vidéo uploadée", description: file.name });
      }
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

      const prepareResponse = await fastAPIClient.prepareUpload(file.name, file.type, file.size);

      if (prepareResponse.strategy === 'single' && prepareResponse.url) {
        await fetch(prepareResponse.url, {
          method: 'PUT',
          body: file,
          headers: prepareResponse.headers || {},
        });

        await fastAPIClient.completeUpload({
          strategy: 'single',
          key: prepareResponse.key,
          content_type: file.type,
          size: file.size,
        });

        await fastAPIClient.attachCourseResource(id, prepareResponse.key, file.name, file.size);

        setResources(prev => [
          ...prev,
          { id: `resource-${Date.now()}`, name: file.name, key: prepareResponse.key, size: file.size }
        ]);

        toast({ title: "✅ Ressource ajoutée", description: file.name });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate(coursesBasePath)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Édition du cours
            </h1>
            <p className="text-gray-600 mt-1">{courseData.title || 'Sans titre'}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Save indicator */}
            {isSaving && (
              <div className="flex items-center gap-2 text-orange-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Sauvegarde...</span>
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            
            {/* Status toggle */}
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

            {/* Preview button */}
            <Button variant="outline" onClick={() => navigate(`${coursesBasePath}/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">
              <BookOpen className="h-4 w-4 mr-2" />
              Informations générales
            </TabsTrigger>
            <TabsTrigger value="modules">
              <FileText className="h-4 w-4 mr-2" />
              Modules & Leçons
            </TabsTrigger>
            <TabsTrigger value="resources">
              <ClipboardList className="h-4 w-4 mr-2" />
              Ressources
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Prévisualisation
            </TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales du cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Titre du cours *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Maîtrisez React de A à Z"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre cours..."
                    rows={5}
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price}
                      onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="89.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration & Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Durée totale</Label>
                    <Input
                      id="duration"
                      value={courseData.duration}
                      onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="10h 30min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select
                      value={courseData.level}
                      onValueChange={(value) => setCourseData(prev => ({ ...prev, level: value }))}
                    >
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

                {/* Course Image */}
                <div>
                  <Label>Image de couverture</Label>
                  {courseData.imagePreview && (
                    <div className="mt-2 mb-3">
                      <img 
                        src={courseData.imagePreview} 
                        alt="Couverture" 
                        className="w-64 h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
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
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {courseData.imagePreview ? 'Remplacer l\'image' : 'Uploader une image'}
                    </Button>
                  </div>
                </div>

                {/* Program PDF */}
                <div>
                  <Label>Programme de formation (PDF)</Label>
                  {courseData.programFileName && (
                    <div className="flex items-center gap-2 mt-2 mb-3 p-2 bg-blue-50 rounded">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{courseData.programFileName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
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
          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Modules et leçons du cours</CardTitle>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucun module disponible</p>
                    <p className="text-sm">Les modules doivent être créés via l'API</p>
                  </div>
                ) : (
                  <Accordion type="multiple" value={expandedModules} onValueChange={setExpandedModules}>
                    {modules.map((module, moduleIdx) => (
                      <AccordionItem key={`module-${moduleIdx}`} value={`module-${moduleIdx}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-5 w-5 text-purple-600" />
                              <div className="text-left">
                                <div className="font-semibold">{module.title || `Module ${moduleIdx + 1}`}</div>
                                <div className="text-sm text-gray-500">
                                  {module.lessons.length} leçon{module.lessons.length > 1 ? 's' : ''}
                                  {module.duration && ` • ${module.duration}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-8 pr-4 pt-4 space-y-4">
                            {/* Module Edit Form */}
                            {editingModuleId === moduleIdx ? (
                              <Card className="bg-gray-50">
                                <CardContent className="pt-6 space-y-3">
                                  <Input
                                    value={module.title}
                                    onChange={(e) => setModules(prev => prev.map((m, idx) => 
                                      idx === moduleIdx ? { ...m, title: e.target.value } : m
                                    ))}
                                    placeholder="Titre du module"
                                  />
                                  <Textarea
                                    value={module.description}
                                    onChange={(e) => setModules(prev => prev.map((m, idx) => 
                                      idx === moduleIdx ? { ...m, description: e.target.value } : m
                                    ))}
                                    placeholder="Description du module"
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleSaveModule(moduleIdx)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Sauvegarder
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingModuleId(null)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Annuler
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">{module.description || 'Aucune description'}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => setEditingModuleId(moduleIdx)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleDeleteModule(moduleIdx)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Lessons */}
                            <div className="space-y-3 mt-4">
                              <h4 className="font-semibold text-sm text-gray-700">Leçons</h4>
                              {module.lessons.map((lesson, lessonIdx) => (
                                <Card key={`lesson-${moduleIdx}-${lessonIdx}`} className="bg-white">
                                  <CardContent className="pt-4">
                                    {editingLessonId?.moduleIdx === moduleIdx && editingLessonId?.lessonIdx === lessonIdx ? (
                                      <div className="space-y-3">
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
                                        />
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
                                        />
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
                                        />
                                        
                                        {/* Video upload */}
                                        <div>
                                          <Label className="text-sm">Vidéo de la leçon</Label>
                                          {lesson.videoFileName && (
                                            <div className="flex items-center gap-2 mt-2 mb-2 p-2 bg-blue-50 rounded">
                                              <Video className="h-4 w-4 text-blue-600" />
                                              <span className="text-sm">{lesson.videoFileName}</span>
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
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {lesson.videoFileName ? 'Remplacer' : 'Uploader'} une vidéo
                                          </Button>
                                        </div>

                                        <div className="flex gap-2">
                                          <Button size="sm" onClick={() => handleSaveLesson(moduleIdx, lessonIdx)}>
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
                                        <div className="flex items-center gap-3">
                                          <Video className="h-5 w-5 text-blue-600" />
                                          <div>
                                            <div className="font-medium">{lesson.title || `Leçon ${lessonIdx + 1}`}</div>
                                            <div className="text-sm text-gray-500">
                                              {lesson.duration && `${lesson.duration}`}
                                              {lesson.videoFileName && ` • ${lesson.videoFileName}`}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => setEditingLessonId({ moduleIdx, lessonIdx })}
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => handleDeleteLesson(moduleIdx, lessonIdx)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
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
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ressources pédagogiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resources.length > 0 && (
                  <div className="space-y-2">
                    {resources.map((resource) => (
                      <Card key={resource.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-red-500" />
                              <div>
                                <div className="font-medium">{resource.name}</div>
                                {resource.size && (
                                  <div className="text-sm text-gray-500">
                                    {(resource.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => resource.key && handleDeleteResource(resource.key)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Fichiers PDF uniquement</p>
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
                    variant="outline"
                    onClick={() => document.getElementById('resources-upload')?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter des ressources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation du cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Header */}
                <div className="flex gap-6">
                  {courseData.imagePreview && (
                    <img 
                      src={courseData.imagePreview} 
                      alt={courseData.title}
                      className="w-64 h-40 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{courseData.title || 'Sans titre'}</h2>
                    <p className="text-gray-600 mb-4">{courseData.description || 'Aucune description'}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge>{courseData.level}</Badge>
                      <Badge variant="outline">{courseData.category || 'Non catégorisé'}</Badge>
                      {courseData.duration && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          {courseData.duration}
                        </div>
                      )}
                      {courseData.price && (
                        <div className="text-lg font-bold text-purple-600">
                          {courseData.price} €
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modules Preview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                  <div className="space-y-2">
                    {modules.map((module, idx) => (
                      <Card key={`preview-${idx}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{module.title}</div>
                              <div className="text-sm text-gray-500">
                                {module.lessons.length} leçon{module.lessons.length > 1 ? 's' : ''}
                                {module.duration && ` • ${module.duration}`}
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
                    <h3 className="text-lg font-semibold mb-4">Ressources disponibles</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{resource.name}</span>
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
    </div>
  );
};

export default EditCoursePage;
