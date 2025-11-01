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
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuizBuilder, AssignmentBuilder } from '@/components/quiz';
import type { QuizConfig, AssignmentConfig } from '@/types/quiz';
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

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  const [isCreating, setIsCreating] = useState(false);
  
  // Nouveaux états pour catégories et niveaux
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const isManagerContext = location.pathname.includes('/gestionnaire/');
  const coursesBasePath = isManagerContext ? '/dashboard/gestionnaire/courses' : '/dashboard/superadmin/courses';
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    learning_cycle: '' as '' | 'primaire' | 'college' | 'lycee' | 'pro',
    selectedLevels: [] as string[],
    level: 'débutant',
    duration: '',
    image: null as File | null,
    imagePreview: null as string | null,
    objectives: [''],
    programFile: null as File | null,
    programFileName: '',
  });

  const [modules, setModules] = useState<ModuleWithLessons>([
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
  
  const [showQuizBuilder, setShowQuizBuilder] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [showModuleQuizBuilder, setShowModuleQuizBuilder] = useState<string | null>(null);
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState<string | null>(null);

  // Charger les catégories au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fastAPIClient.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories",
          variant: "destructive"
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Charger les niveaux lorsqu'un cycle est sélectionné
  useEffect(() => {
    const loadLevels = async () => {
      if (!courseData.learning_cycle) {
        setLevels([]);
        return;
      }
      try {
        const lvls = await fastAPIClient.getLevels(courseData.learning_cycle);
        setLevels(lvls);
      } catch (error) {
        console.error('Error loading levels:', error);
        setLevels([]);
      }
    };
    loadLevels();
  }, [courseData.learning_cycle]);

  const handleInputChange = (field: string, value: any) => {
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

  const handleCreateCourse = async (shouldPublish: boolean = false) => {
    // Validation
    if (!courseData.title || !courseData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une catégorie",
        variant: "destructive"
      });
      return;
    }

    if (!courseData.learning_cycle || courseData.selectedLevels.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un cycle et des niveaux",
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

    try {
      setIsCreating(true);
      
      toast({
        title: "Upload des vidéos...",
        description: "Téléchargement des vidéos des leçons",
      });

      // 1. UPLOADER TOUTES LES VIDÉOS
      const videosMap = new Map<string, string>(); // lessonId → video_key
      
      for (const module of modules) {
        for (const lesson of module.lessons) {
          if (lesson.file && lesson.fileType === 'video') {
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
                  
                  const uploadResp = await fetch(part.url, {
                    method: 'PUT',
                    body: blob
                  });
                  
                  const etag = uploadResp.headers.get('ETag')?.replace(/\"/g, '');
                  parts.push({
                    PartNumber: part.partNumber,
                    ETag: etag || ''
                  });
                }
                
                await fastAPIClient.completeUpload({
                  strategy: 'multipart',
                  key: prepareResponse.key,
                  content_type: lesson.file.type,
                  size: lesson.file.size,
                  upload_id: prepareResponse.upload_id,
                  parts
                });
              }

              const completeResp = await fastAPIClient.completeUpload({
                strategy: prepareResponse.strategy,
                key: prepareResponse.key,
                content_type: lesson.file.type,
                size: lesson.file.size,
                upload_id: prepareResponse.upload_id,
              });
              
              videosMap.set(lesson.id, completeResp.key);
              console.log(`✅ Vidéo uploadée: ${completeResp.key}`);
            } catch (error) {
              console.error(`❌ Erreur upload vidéo ${lesson.fileName}:`, error);
              throw error;
            }
          }
        }
      }

      toast({
        title: "Création du cours...",
        description: "Enregistrement des données",
      });

      // 2. CRÉER LE COURS
      const calculateModuleDuration = (lessons: Lesson[]) => {
        const totalMinutes = lessons.reduce((sum, l) => sum + l.duration, 0);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
      };

      const coursePayload: any = {
        title: courseData.title,
        description: courseData.description,
        category_ids: selectedCategoryIds,
        learning_cycle: courseData.learning_cycle,
        levels: courseData.selectedLevels,
        level: courseData.level,
        price: courseData.price ? parseFloat(courseData.price) : undefined,
        duration: courseData.duration,
        image_url: courseData.imagePreview,
        modules: modules.map(m => ({
          title: m.title,
          description: m.description,
          duration: calculateModuleDuration(m.lessons),
          content: m.lessons.map(l => ({
            title: l.title,
            duration: l.duration.toString(),
            description: l.content,
            video_key: videosMap.get(l.id),
            video_url: l.useMediaUrl ? l.mediaUrl : undefined,
            quiz: l.quiz
          })),
          quiz: m.quiz,
          assignment: m.assignment
        }))
      };

      const createdCourse = await fastAPIClient.createCourse(coursePayload);
      console.log('✅ Cours créé:', createdCourse);

      // 3. UPLOADER ET ATTACHER LES RESSOURCES PÉDAGOGIQUES
      for (const module of modules) {
        for (const resource of module.pedagogicalResources) {
          try {
            const prepareResp = await fastAPIClient.prepareUpload(
              resource.file.name,
              resource.file.type,
              resource.file.size
            );

            if (prepareResp.url && prepareResp.headers) {
              const uploadHeaders = new Headers(prepareResp.headers);
              await fetch(prepareResp.url, {
                method: 'PUT',
                headers: uploadHeaders,
                body: resource.file
              });
            }

            const completeResp = await fastAPIClient.completeUpload({
              strategy: prepareResp.strategy,
              key: prepareResp.key,
              content_type: resource.file.type,
              size: resource.file.size,
              upload_id: prepareResp.upload_id,
            });

            await fastAPIClient.attachCourseResource(createdCourse.id!, {
              name: resource.fileName,
              key: completeResp.key,
              size: resource.file.size
            });
          } catch (error) {
            console.error(`Erreur upload ressource ${resource.fileName}:`, error);
          }
        }
      }

      // 4. PUBLIER SI DEMANDÉ
      if (shouldPublish) {
        await fastAPIClient.updateCourseStatus(createdCourse.id!, 'published');
      }

      toast({
        title: "✅ Cours créé avec succès!",
        description: `Le cours "${createdCourse.title}" est maintenant disponible.`,
      });

      navigate(coursesBasePath, { state: { courseCreated: true } });
    } catch (error: any) {
      console.error('❌ Erreur création cours:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le cours",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const renderInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales du cours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="title">Titre du cours *</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Maîtriser React en 30 jours"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={courseData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Décrivez le contenu et les objectifs du cours"
            rows={4}
          />
        </div>

        <div>
          <Label>Catégories * (plusieurs possibles)</Label>
          {loadingCategories ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(cat => (
                <Badge
                  key={cat.id}
                  variant={selectedCategoryIds.includes(cat.id.toString()) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategoryIds(prev =>
                      prev.includes(cat.id.toString())
                        ? prev.filter(id => id !== cat.id.toString())
                        : [...prev, cat.id.toString()]
                    );
                  }}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="learning_cycle">Cycle d'apprentissage *</Label>
            <Select
              value={courseData.learning_cycle}
              onValueChange={(value) => handleInputChange('learning_cycle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primaire">Primaire</SelectItem>
                <SelectItem value="college">Collège</SelectItem>
                <SelectItem value="lycee">Lycée</SelectItem>
                <SelectItem value="pro">Formation Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="level">Difficulté *</Label>
            <Select
              value={courseData.level}
              onValueChange={(value) => handleInputChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="débutant">Débutant</SelectItem>
                <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {courseData.learning_cycle && (
          <div>
            <Label>Niveaux du cycle * (plusieurs possibles)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {levels.map(lvl => (
                <Badge
                  key={lvl.id}
                  variant={courseData.selectedLevels.includes(lvl.slug) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    handleInputChange('selectedLevels',
                      courseData.selectedLevels.includes(lvl.slug)
                        ? courseData.selectedLevels.filter(s => s !== lvl.slug)
                        : [...courseData.selectedLevels, lvl.slug]
                    );
                  }}
                >
                  {lvl.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              value={courseData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="duration">Durée estimée</Label>
            <Input
              id="duration"
              value={courseData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="Ex: 10h"
            />
          </div>
        </div>

        <div>
          <Label>Image de couverture</Label>
          <div className="mt-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              {courseData.imagePreview ? (
                <img src={courseData.imagePreview} alt="Preview" className="h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Cliquer pour uploader une image</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderModulesStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modules et leçons</h2>
        <Button onClick={addModule} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un module
        </Button>
      </div>

      {modules.map((module, moduleIndex) => (
        <Card key={module.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <Input
                  value={module.title}
                  onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                  className="font-semibold text-lg"
                  placeholder="Titre du module"
                />
                <Input
                  value={module.description}
                  onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                  placeholder="Description du module"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeModule(module.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => addLesson(module.id)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une leçon
            </Button>

            {module.lessons.map((lesson, lessonIndex) => (
              <Card key={lesson.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Leçon {lessonIndex + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLesson(module.id, lesson.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Titre de la leçon</Label>
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                        placeholder="Ex: Introduction à React"
                      />
                    </div>
                    <div>
                      <Label>Durée (minutes)</Label>
                      <Input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Contenu de la leçon</Label>
                    <Textarea
                      value={lesson.content}
                      onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                      rows={3}
                      placeholder="Description du contenu..."
                    />
                  </div>

                  <div>
                    <Label>Média (vidéo, PDF, image)</Label>
                    <input
                      type="file"
                      accept="video/*,application/pdf,image/*"
                      onChange={(e) => handleFileUpload(module.id, lesson.id, e)}
                      className="block w-full text-sm"
                    />
                    {lesson.fileName && (
                      <p className="text-sm text-gray-600 mt-1">📎 {lesson.fileName}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {lesson.quiz ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveQuiz(module.id, lesson.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Retirer le quiz
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQuizBuilder({ moduleId: module.id, lessonId: lesson.id })}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un quiz
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderReviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif du cours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{courseData.title}</h3>
          <p className="text-sm text-gray-600">{courseData.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Catégories:</span> {selectedCategoryIds.length}
          </div>
          <div>
            <span className="font-medium">Cycle:</span> {courseData.learning_cycle}
          </div>
          <div>
            <span className="font-medium">Niveaux:</span> {courseData.selectedLevels.length}
          </div>
          <div>
            <span className="font-medium">Modules:</span> {modules.length}
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => handleCreateCourse(false)}
            variant="outline"
            disabled={isCreating}
          >
            {isCreating ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
            Sauvegarder en brouillon
          </Button>
          <Button
            onClick={() => handleCreateCourse(true)}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? <LoadingSpinner size="sm" /> : <Check className="h-4 w-4 mr-2" />}
            Publier le cours
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créer un nouveau cours</h1>
          <p className="text-gray-600">Remplissez les informations et ajoutez vos modules</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(coursesBasePath)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-8">
        <Button
          variant={currentStep === 'info' ? 'default' : 'outline'}
          onClick={() => setCurrentStep('info')}
        >
          1. Informations
        </Button>
        <ArrowRight className="h-4 w-4" />
        <Button
          variant={currentStep === 'modules' ? 'default' : 'outline'}
          onClick={() => setCurrentStep('modules')}
        >
          2. Modules
        </Button>
        <ArrowRight className="h-4 w-4" />
        <Button
          variant={currentStep === 'review' ? 'default' : 'outline'}
          onClick={() => setCurrentStep('review')}
        >
          3. Récapitulatif
        </Button>
      </div>

      {currentStep === 'info' && renderInfoStep()}
      {currentStep === 'modules' && renderModulesStep()}
      {currentStep === 'review' && renderReviewStep()}

      {currentStep !== 'review' && (
        <div className="flex justify-end">
          <Button onClick={() => {
            if (currentStep === 'info') setCurrentStep('modules');
            else if (currentStep === 'modules') setCurrentStep('review');
          }}>
            Suivant
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Quiz Builder Dialog */}
      {showQuizBuilder && (
        <Dialog open={!!showQuizBuilder} onOpenChange={() => setShowQuizBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un quiz</DialogTitle>
            </DialogHeader>
            <QuizBuilder
              onSave={(quiz) => handleSaveQuiz(showQuizBuilder.moduleId, showQuizBuilder.lessonId, quiz)}
              onCancel={() => setShowQuizBuilder(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Assignment Builder Dialog */}
      {showAssignmentBuilder && (
        <Dialog open={!!showAssignmentBuilder} onOpenChange={() => setShowAssignmentBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un devoir</DialogTitle>
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

export default CreateCoursePage;
