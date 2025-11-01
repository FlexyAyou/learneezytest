import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  description: string;
  video_key?: string;
  video_url?: string;
  file?: File;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const EditCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    learning_cycle: '' as '' | 'primaire' | 'college' | 'lycee' | 'pro',
    selectedLevels: [] as string[],
    level: 'débutant',
    duration: '',
    image_url: ''
  });

  const [modules, setModules] = useState<Module[]>([]);

  // Charger le cours existant
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const courseData = await fastAPIClient.getCourse(id);
        setCourse(courseData);

        // Pré-remplir les données
        setCourseData({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price || 0,
          learning_cycle: (courseData as any).learning_cycle || '',
          selectedLevels: (courseData as any).levels || [],
          level: courseData.level,
          duration: courseData.duration || '',
          image_url: courseData.image_url || ''
        });

        // Mapper les modules
        if (courseData.modules) {
          setModules(courseData.modules.map((m, idx) => ({
            id: `module-${idx}`,
            title: m.title,
            description: m.description || '',
            lessons: m.content.map((l, lidx) => ({
              id: `lesson-${idx}-${lidx}`,
              title: l.title,
              duration: parseInt(l.duration) || 0,
              description: l.description,
              video_key: l.video_key || l.key,
              video_url: l.video_url
            }))
          })));
        }

        // Charger les catégories
        const cats = await fastAPIClient.getCategories();
        setCategories(cats);

      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le cours",
          variant: "destructive"
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // Charger les niveaux quand le cycle change
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

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);

      // Uploader les nouvelles vidéos si nécessaire
      for (const module of modules) {
        for (const lesson of module.lessons) {
          if (lesson.file) {
            try {
              const prepareResponse = await fastAPIClient.prepareUpload(
                lesson.file.name,
                lesson.file.type,
                lesson.file.size
              );

              if (prepareResponse.url && prepareResponse.headers) {
                const uploadHeaders = new Headers(prepareResponse.headers);
                await fetch(prepareResponse.url, {
                  method: 'PUT',
                  headers: uploadHeaders,
                  body: lesson.file
                });
              }

              const completeResp = await fastAPIClient.completeUpload({
                strategy: prepareResponse.strategy,
                key: prepareResponse.key,
                content_type: lesson.file.type,
                size: lesson.file.size,
                upload_id: prepareResponse.upload_id,
              });

              lesson.video_key = completeResp.key;
              lesson.file = undefined;
            } catch (error) {
              console.error(`Erreur upload vidéo:`, error);
            }
          }
        }
      }

      // Mettre à jour le cours
      await fastAPIClient.updateCourse(id, {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
      });

      toast({
        title: "Cours mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });

      navigate('/dashboard/superadmin/courses');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le cours",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'Nouvelle leçon',
      duration: 30,
      description: ''
    };
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ));
    toast({
      title: "Leçon supprimée",
      description: "La leçon a été supprimée du cours.",
    });
  };

  const handleLessonChange = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
    setModules(modules.map(m =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map(l =>
              l.id === lessonId ? { ...l, [field]: value } : l
            )
          }
        : m
    ));
  };

  const handleFileUpload = (moduleId: string, lessonId: string, file: File) => {
    handleLessonChange(moduleId, lessonId, 'file', file);
    toast({
      title: "Fichier ajouté",
      description: `${file.name} sera uploadé lors de la sauvegarde`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Cours introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/superadmin/courses')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Éditer le cours</h1>
              <p className="text-gray-600">Modifiez les détails et le contenu de votre cours</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard/superadmin/courses/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
              {saving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations générales */}
          <div className="lg:col-span-2 space-y-6">
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
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price}
                      onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Durée</Label>
                    <Input
                      id="duration"
                      value={courseData.duration}
                      onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="level">Niveau</Label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value) => setCourseData({...courseData, level: value})}
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
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Modules et Leçons</CardTitle>
                    <CardDescription>Contenu du cours</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{module.title}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddLesson(module.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une leçon
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-500">
                                {lesson.title}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Titre de la leçon</Label>
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => handleLessonChange(module.id, lesson.id, 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Durée (minutes)</Label>
                                <Input
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(e) => handleLessonChange(module.id, lesson.id, 'duration', parseInt(e.target.value))}
                                />
                              </div>
                            </div>

                            {lesson.video_key && (
                              <div className="mt-2">
                                <Badge variant="outline">
                                  📹 Vidéo: {lesson.video_key}
                                </Badge>
                              </div>
                            )}

                            <div className="mt-2">
                              <Label>Nouvelle vidéo (remplacera l'ancienne)</Label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(module.id, lesson.id, file);
                                }}
                                className="block w-full text-sm"
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
                  {courseData.image_url ? (
                    <img
                      src={courseData.image_url}
                      alt="Aperçu du cours"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Pas d'image</span>
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Changer l'image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={course.status === 'published' ? 'default' : 'outline'}
                >
                  {course.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
