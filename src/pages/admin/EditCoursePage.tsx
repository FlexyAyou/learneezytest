import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { fastAPIClient } from '@/services/fastapi-client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [courseData, setCourseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const course = await fastAPIClient.getCourse(id);
        console.log('Loaded course:', course);
        setCourseData(course);
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

  const handleSave = async () => {
    if (!id || !courseData) return;
    
    setSaving(true);
    try {
      const updates = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        category: courseData.category,
        level: courseData.level,
        status: courseData.status
      };
      
      await fastAPIClient.updateCourse(id, updates);
      
      toast({
        title: "Cours mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Éditer le cours</h1>
              <p className="text-muted-foreground">Modifiez les détails et le contenu de votre cours</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Détails principaux du cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du cours</Label>
                  <Input
                    id="title"
                    value={courseData.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <RichTextEditor
                    value={courseData.description || ''}
                    onChange={(value) => handleFieldChange('description', value)}
                    placeholder="Description du cours..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price || 0}
                      onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={courseData.category || ''}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select 
                      value={courseData.level || 'débutant'} 
                      onValueChange={(value) => handleFieldChange('level', value)}
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
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={courseData.status || 'draft'} 
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Modules et contenu</CardTitle>
                    <CardDescription>Organisation du cours en modules et leçons</CardDescription>
                  </div>
                  <Button onClick={addModule} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courseData.modules?.map((module: any, moduleIndex: number) => (
                    <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Module {moduleIndex + 1}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteModule(moduleIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Titre du module</Label>
                          <Input
                            value={module.title || ''}
                            onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Description du module</Label>
                          <RichTextEditor
                            value={module.description || ''}
                            onChange={(value) => handleModuleChange(moduleIndex, 'description', value)}
                            placeholder="Description du module..."
                          />
                        </div>

                        <div>
                          <Label>Durée estimée</Label>
                          <Input
                            value={module.duration || ''}
                            onChange={(e) => handleModuleChange(moduleIndex, 'duration', e.target.value)}
                            placeholder="Ex: 2h 30min"
                          />
                        </div>
                      </div>

                      {/* Lessons */}
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Leçons</Label>
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
                          <div key={lessonIndex} className="ml-4 p-3 border rounded bg-muted/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">
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
                                <Label className="text-xs">Titre</Label>
                                <Input
                                  value={lesson.title || ''}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Durée</Label>
                                <Input
                                  value={lesson.duration || ''}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                  placeholder="Ex: 30min"
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs">URL Vidéo</Label>
                              <Input
                                value={lesson.video_url || ''}
                                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'video_url', e.target.value)}
                                placeholder="https://..."
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseData.image_url && (
                    <img
                      src={courseData.image_url}
                      alt="Aperçu du cours"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Modification de l'image disponible prochainement
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <span className="font-medium capitalize">{courseData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Propriétaire</span>
                  <span className="font-medium capitalize">{courseData.owner_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Modules</span>
                  <span className="font-medium">{courseData.modules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Leçons</span>
                  <span className="font-medium">
                    {courseData.modules?.reduce((acc: number, module: any) => 
                      acc + (module.content?.length || 0), 0) || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
