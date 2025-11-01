import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, Plus, Trash2, Upload, X, CheckCircle, XCircle, BookOpen, PlayCircle, FileText, Clock, Award, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { fastAPIClient } from '@/services/fastapi-client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [courseData, setCourseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const course = await fastAPIClient.getCourse(id);
        console.log('Loaded course:', course);
        setCourseData(course);
        setImagePreview(course.image_url || '');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !id) return null;

    setUploadingImage(true);
    try {
      const prepareResponse = await fastAPIClient.prepareUpload(
        imageFile.name,
        imageFile.type,
        imageFile.size
      );

      // Upload selon la stratégie (single ou multipart)
      if (prepareResponse.strategy === 'single' && prepareResponse.url) {
        await fetch(prepareResponse.url, {
          method: 'PUT',
          body: imageFile,
          headers: prepareResponse.headers || {},
        });
      }

      const completeResponse = await fastAPIClient.completeUpload({
        strategy: prepareResponse.strategy,
        key: prepareResponse.key,
        content_type: imageFile.type,
        size: imageFile.size,
        upload_id: prepareResponse.upload_id,
      });

      toast({
        title: "✅ Image uploadée",
        description: "L'image a été uploadée avec succès",
      });

      // Construire l'URL depuis la clé
      return `${import.meta.env.VITE_API_URL || 'https://api.plateforme-test-infinitiax.com'}/api/storage/${completeResponse.key}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!id || !courseData) return;
    
    setSaving(true);
    try {
      let imageUrl = courseData.image_url;

      // Upload image si une nouvelle a été sélectionnée
      if (imageFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updates = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        category: courseData.category,
        level: courseData.level,
        status: courseData.status,
        duration: courseData.duration,
        image_url: imageUrl,
        // Note: modules, resources et autres champs complexes nécessitent des endpoints dédiés
      };
      
      await fastAPIClient.updateCourse(id, updates);
      
      toast({
        title: "✅ Cours mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });

      // Recharger les données
      const updatedCourse = await fastAPIClient.getCourse(id);
      setCourseData(updatedCourse);
      setImageFile(null);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!id || !courseData) return;
    
    try {
      const newStatus = courseData.status === 'published' ? 'draft' : 'published';
      const updatedCourse = await fastAPIClient.updateCourseStatus(id, newStatus);
      setCourseData(updatedCourse);
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

  const handleFieldChange = (field: string, value: any) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const handleModuleChange = (moduleIndex: number, field: string, value: any) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex] = { ...newModules[moduleIndex], [field]: value };
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const newModules = [...courseData.modules];
    const newContent = [...newModules[moduleIndex].content];
    newContent[lessonIndex] = { ...newContent[lessonIndex], [field]: value };
    newModules[moduleIndex] = { ...newModules[moduleIndex], content: newContent };
    setCourseData({ ...courseData, modules: newModules });
  };

  const addModule = () => {
    const newModule = {
      title: 'Nouveau module',
      description: '',
      duration: '0h',
      content: [],
      quizzes: []
    };
    setCourseData({ 
      ...courseData, 
      modules: [...(courseData.modules || []), newModule] 
    });
  };

  const deleteModule = (moduleIndex: number) => {
    const newModules = courseData.modules.filter((_: any, i: number) => i !== moduleIndex);
    setCourseData({ ...courseData, modules: newModules });
    toast({
      title: "Module supprimé",
      description: "Le module a été supprimé du cours.",
    });
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...courseData.modules];
    const newLesson = {
      title: 'Nouvelle leçon',
      duration: '30min',
      description: '',
      video_url: '',
      transcription: ''
    };
    newModules[moduleIndex].content = [...(newModules[moduleIndex].content || []), newLesson];
    setCourseData({ ...courseData, modules: newModules });
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].content = newModules[moduleIndex].content.filter(
      (_: any, i: number) => i !== lessonIndex
    );
    setCourseData({ ...courseData, modules: newModules });
    toast({
      title: "Leçon supprimée",
      description: "La leçon a été supprimée du module.",
    });
  };

  const addResource = () => {
    const newResource = { name: 'Nouvelle ressource', url: '' };
    setCourseData({ 
      ...courseData, 
      resources: [...(courseData.resources || []), newResource] 
    });
  };

  const deleteResource = (resourceIndex: number) => {
    const newResources = courseData.resources.filter((_: any, i: number) => i !== resourceIndex);
    setCourseData({ ...courseData, resources: newResources });
  };

  const handleResourceChange = (resourceIndex: number, field: string, value: any) => {
    const newResources = [...(courseData.resources || [])];
    newResources[resourceIndex] = { ...newResources[resourceIndex], [field]: value };
    setCourseData({ ...courseData, resources: newResources });
  };

  const addQuizToModule = (moduleIndex: number) => {
    const newModules = [...courseData.modules];
    const newQuiz = {
      title: 'Nouveau quiz',
      questions: [
        {
          question: 'Question 1',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct_answer: 'Option A'
        }
      ]
    };
    newModules[moduleIndex].quizzes = [...(newModules[moduleIndex].quizzes || []), newQuiz];
    setCourseData({ ...courseData, modules: newModules });
  };

  const deleteQuiz = (moduleIndex: number, quizIndex: number) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].quizzes = newModules[moduleIndex].quizzes.filter(
      (_: any, i: number) => i !== quizIndex
    );
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleQuizChange = (moduleIndex: number, quizIndex: number, field: string, value: any) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].quizzes[quizIndex] = {
      ...newModules[moduleIndex].quizzes[quizIndex],
      [field]: value
    };
    setCourseData({ ...courseData, modules: newModules });
  };

  const addQuestionToQuiz = (moduleIndex: number, quizIndex: number) => {
    const newModules = [...courseData.modules];
    const newQuestion = {
      question: 'Nouvelle question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'Option A'
    };
    newModules[moduleIndex].quizzes[quizIndex].questions = [
      ...(newModules[moduleIndex].quizzes[quizIndex].questions || []),
      newQuestion
    ];
    setCourseData({ ...courseData, modules: newModules });
  };

  const deleteQuestion = (moduleIndex: number, quizIndex: number, questionIndex: number) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].quizzes[quizIndex].questions = 
      newModules[moduleIndex].quizzes[quizIndex].questions.filter((_: any, i: number) => i !== questionIndex);
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleQuestionChange = (moduleIndex: number, quizIndex: number, questionIndex: number, field: string, value: any) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].quizzes[quizIndex].questions[questionIndex] = {
      ...newModules[moduleIndex].quizzes[quizIndex].questions[questionIndex],
      [field]: value
    };
    setCourseData({ ...courseData, modules: newModules });
  };

  // Calculer les statistiques
  const totalLessons = courseData?.modules?.reduce((acc: number, mod: any) => acc + (mod.content?.length || 0), 0) || 0;
  const totalQuizzes = courseData?.modules?.reduce((acc: number, mod: any) => acc + (mod.quizzes?.length || 0), 0) || 0;
  const totalVideos = courseData?.modules?.reduce((acc: number, mod: any) => 
    acc + (mod.content?.filter((c: any) => c.video_key || c.key || c.video_url).length || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">Cours introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">✏️ Éditer le cours</h1>
              <p className="text-muted-foreground">Modifiez tous les aspects de votre cours</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button onClick={handleSave} disabled={saving || uploadingImage}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : uploadingImage ? 'Upload...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        {/* Statut du cours - Toggle */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {courseData?.status === 'published' ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publié
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <XCircle className="h-3 w-3 mr-1" />
                      Brouillon
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {courseData?.status === 'published' 
                      ? 'Le cours est visible par tous les utilisateurs' 
                      : 'Le cours est masqué et en cours de préparation'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="status-toggle" className="text-sm font-medium">
                  {courseData?.status === 'draft' ? 'Publier le cours' : 'Mettre en brouillon'}
                </Label>
                <Switch
                  id="status-toggle"
                  checked={courseData?.status === 'published'}
                  onCheckedChange={handleToggleStatus}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{courseData?.modules?.length || 0}</div>
              <p className="text-xs text-blue-700 font-medium">Modules</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <PlayCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{totalLessons}</div>
              <p className="text-xs text-green-700 font-medium">Leçons</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{totalVideos}</div>
              <p className="text-xs text-purple-700 font-medium">Vidéos</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
            <CardContent className="pt-6 text-center">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{totalQuizzes}</div>
              <p className="text-xs text-orange-700 font-medium">Quiz</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informations générales
                </CardTitle>
                <CardDescription>Détails principaux du cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="title">Titre du cours *</Label>
                  <Input
                    id="title"
                    value={courseData?.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={courseData?.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Description détaillée du cours..."
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={courseData?.price || 0}
                      onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={courseData?.category || ''}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      placeholder="Ex: Développement"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Durée totale</Label>
                    <Input
                      id="duration"
                      value={courseData?.duration || ''}
                      onChange={(e) => handleFieldChange('duration', e.target.value)}
                      placeholder="Ex: 10h"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="level">Niveau *</Label>
                  <Select 
                    value={courseData?.level || 'débutant'} 
                    onValueChange={(value) => handleFieldChange('level', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="débutant">Débutant</SelectItem>
                      <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Ressources téléchargeables
                    </CardTitle>
                    <CardDescription>Fichiers PDF, documents, etc.</CardDescription>
                  </div>
                  <Button onClick={addResource} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une ressource
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!courseData?.resources || courseData.resources.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune ressource ajoutée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courseData.resources.map((resource: any, index: number) => (
                      <div key={index} className="flex gap-2 items-start p-3 border-2 rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={resource.name || ''}
                            onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                            placeholder="Nom de la ressource"
                          />
                          <Input
                            value={resource.url || ''}
                            onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                            placeholder="URL de la ressource"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResource(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modules avec leçons et quiz */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Modules et contenu
                    </CardTitle>
                    <CardDescription>Organisation du cours en modules, leçons et quiz</CardDescription>
                  </div>
                  <Button onClick={addModule} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!courseData?.modules || courseData.modules.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Aucun module</p>
                    <p className="text-sm">Commencez par ajouter un module</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {courseData.modules.map((module: any, moduleIndex: number) => (
                      <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`} className="border-2 rounded-lg mb-4 overflow-hidden">
                        <AccordionTrigger className="px-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {moduleIndex + 1}
                              </span>
                              <span className="font-semibold">{module.title || `Module ${moduleIndex + 1}`}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModule(moduleIndex);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-50 p-4">
                          <div className="space-y-4">
                            <div>
                              <Label>Titre du module *</Label>
                              <Input
                                value={module.title || ''}
                                onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label>Description du module</Label>
                              <Textarea
                                value={module.description || ''}
                                onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                                placeholder="Description du module..."
                                rows={3}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label>Durée estimée</Label>
                              <Input
                                value={module.duration || ''}
                                onChange={(e) => handleModuleChange(moduleIndex, 'duration', e.target.value)}
                                placeholder="Ex: 2h 30min"
                                className="mt-1"
                              />
                            </div>

                            {/* Leçons */}
                            <div className="space-y-3 pt-4 border-t-2">
                              <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                  <PlayCircle className="h-4 w-4" />
                                  Leçons ({module.content?.length || 0})
                                </Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addLesson(moduleIndex)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Ajouter une leçon
                                </Button>
                              </div>

                              {module.content?.map((lesson: any, lessonIndex: number) => (
                                <div key={lessonIndex} className="bg-white p-3 border-2 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-pink-700">
                                      Leçon {lessonIndex + 1}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Titre *</Label>
                                      <Input
                                        value={lesson.title || ''}
                                        onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)}
                                        className="h-8 text-sm mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Durée</Label>
                                      <Input
                                        value={lesson.duration || ''}
                                        onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                        placeholder="Ex: 30min"
                                        className="h-8 text-sm mt-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                      value={lesson.description || ''}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'description', e.target.value)}
                                      placeholder="Description de la leçon..."
                                      rows={2}
                                      className="text-sm mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">URL Vidéo (YouTube ou lien direct)</Label>
                                    <Input
                                      value={lesson.video_url || ''}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'video_url', e.target.value)}
                                      placeholder="https://youtube.com/watch?v=... ou https://..."
                                      className="h-8 text-sm mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">Transcription</Label>
                                    <Textarea
                                      value={lesson.transcription || ''}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'transcription', e.target.value)}
                                      placeholder="Transcription de la vidéo..."
                                      rows={2}
                                      className="text-sm mt-1"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Quiz */}
                            <div className="space-y-3 pt-4 border-t-2">
                              <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Quiz ({module.quizzes?.length || 0})
                                </Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addQuizToModule(moduleIndex)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Ajouter un quiz
                                </Button>
                              </div>

                              {module.quizzes?.map((quiz: any, quizIndex: number) => (
                                <div key={quizIndex} className="bg-white p-3 border-2 border-orange-200 rounded-lg space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-orange-700">
                                      Quiz {quizIndex + 1}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteQuiz(moduleIndex, quizIndex)}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Titre du quiz</Label>
                                    <Input
                                      value={quiz.title || ''}
                                      onChange={(e) => handleQuizChange(moduleIndex, quizIndex, 'title', e.target.value)}
                                      className="h-8 text-sm mt-1"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Questions ({quiz.questions?.length || 0})</Label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addQuestionToQuiz(moduleIndex, quizIndex)}
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Question
                                      </Button>
                                    </div>

                                    {quiz.questions?.map((question: any, questionIndex: number) => (
                                      <div key={questionIndex} className="bg-orange-50 p-2 rounded border">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-xs font-medium">Q{questionIndex + 1}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteQuestion(moduleIndex, quizIndex, questionIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <Input
                                          value={question.question || ''}
                                          onChange={(e) => handleQuestionChange(moduleIndex, quizIndex, questionIndex, 'question', e.target.value)}
                                          placeholder="Question..."
                                          className="h-7 text-xs mb-2"
                                        />
                                        {question.options?.map((option: string, optIndex: number) => (
                                          <Input
                                            key={optIndex}
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...question.options];
                                              newOptions[optIndex] = e.target.value;
                                              handleQuestionChange(moduleIndex, quizIndex, questionIndex, 'options', newOptions);
                                            }}
                                            placeholder={`Option ${optIndex + 1}`}
                                            className="h-7 text-xs mb-1"
                                          />
                                        ))}
                                        <Select 
                                          value={question.correct_answer} 
                                          onValueChange={(value) => handleQuestionChange(moduleIndex, quizIndex, questionIndex, 'correct_answer', value)}
                                        >
                                          <SelectTrigger className="h-7 text-xs mt-1">
                                            <SelectValue placeholder="Réponse correcte" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {question.options?.map((option: string) => (
                                              <SelectItem key={option} value={option} className="text-xs">
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    ))}
                                  </div>
                                </div>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image du cours */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Image du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-40 object-cover rounded-lg border-2"
                    />
                    {imageFile && (
                      <Badge className="absolute top-2 right-2 bg-blue-500">
                        Nouvelle image
                      </Badge>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor="course-image" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Cliquez pour changer l'image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG (max 5MB)
                      </p>
                    </div>
                  </Label>
                  <Input
                    id="course-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle>📊 Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <Badge className={courseData?.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {courseData?.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-muted-foreground">Propriétaire</span>
                  <Badge variant="outline">
                    {courseData?.owner_type === 'learneezy' ? '🏢 Learneezy' : '🎓 Organisme'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium text-blue-700">Modules</span>
                  <span className="font-bold text-blue-900">{courseData?.modules?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium text-green-700">Leçons</span>
                  <span className="font-bold text-green-900">{totalLessons}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm font-medium text-purple-700">Vidéos</span>
                  <span className="font-bold text-purple-900">{totalVideos}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-sm font-medium text-orange-700">Quiz</span>
                  <span className="font-bold text-orange-900">{totalQuizzes}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-cyan-50 rounded">
                  <span className="text-sm font-medium text-cyan-700">Ressources</span>
                  <span className="font-bold text-cyan-900">{courseData?.resources?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="border-2 border-pink-200">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50">
                <CardTitle className="text-pink-800">⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || uploadingImage}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Tout sauvegarder'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
