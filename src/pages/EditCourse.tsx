
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import type { CourseResponse, CourseUpdate } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Header from '@/components/Header';

const EditCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<CourseResponse | null>(null);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: '',
    duration: '',
    status: 'draft' as 'draft' | 'published'
  });

  // Charger le cours depuis l'API
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const courseResponse = await fastAPIClient.getCourse(id);
        setCourse(courseResponse);
        
        // Pré-remplir le formulaire
        setCourseData({
          title: courseResponse.title,
          description: courseResponse.description,
          price: courseResponse.price || 0,
          category: courseResponse.category || '',
          level: courseResponse.level,
          duration: courseResponse.duration || '',
          status: courseResponse.status || 'draft'
        });
        
        console.log('✅ Cours chargé:', courseResponse);
      } catch (error: any) {
        console.error('❌ Erreur chargement cours:', error);
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
    if (!id) return;
    
    setSaving(true);
    try {
      const updates: CourseUpdate = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        status: courseData.status
      };
      
      await fastAPIClient.updateCourse(id, updates);
      
      toast({
        title: "Cours mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } catch (error: any) {
      console.error('❌ Erreur mise à jour cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cours",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Cours introuvable</p>
        </div>
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
            <Button variant="outline" onClick={() => navigate(`/cours/${id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-pink-600 hover:bg-pink-700"
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
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
                    onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={courseData.category}
                      onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="level">Niveau</Label>
                  <select
                    id="level"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={courseData.level}
                    onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Modules du cours</CardTitle>
                    <CardDescription>Contenu du cours ({course.modules?.length || 0} modules)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules?.map((module, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">{module.title}</span>
                        <span className="text-xs text-gray-500">{module.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {module.content?.length || 0} leçon(s)
                      </div>
                    </div>
                  ))}
                  {(!course.modules || course.modules.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucun module dans ce cours
                    </p>
                  )}
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
                  {course.image_url && (
                    <img
                      src={course.image_url}
                      alt="Aperçu du cours"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Changer l'image (bientôt disponible)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut</span>
                  <span className="font-medium capitalize">{courseData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Propriétaire</span>
                  <span className="font-medium capitalize">{course.owner_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Modules</span>
                  <span className="font-medium">{course.modules?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
