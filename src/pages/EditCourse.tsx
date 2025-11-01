
import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const EditCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  // Mock data - sera remplacé par l'API
  const [courseData, setCourseData] = useState({
    title: 'React pour Débutants',
    description: 'Apprenez les bases de React de manière simple et efficace.',
    price: 99,
    category: 'Développement Web',
    level: 'Débutant',
    duration: 480, // en minutes
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop'
  });

  const [lessons, setLessons] = useState([
    { id: 1, title: 'Introduction à React', duration: 30, order: 1 },
    { id: 2, title: 'Les composants', duration: 45, order: 2 },
    { id: 3, title: 'Props et State', duration: 60, order: 3 }
  ]);

  const handleSave = () => {
    toast({
      title: "Cours mis à jour",
      description: "Les modifications ont été sauvegardées avec succès.",
    });
  };

  const handleAddLesson = () => {
    const newLesson = {
      id: lessons.length + 1,
      title: 'Nouvelle leçon',
      duration: 30,
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
  };

  const handleDeleteLesson = (lessonId: number) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    toast({
      title: "Leçon supprimée",
      description: "La leçon a été supprimée du cours.",
    });
  };

  const handleLessonChange = (lessonId: number, field: string, value: string | number) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/instructeur')}
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
            <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
              <Save className="h-4 w-4 mr-2" />
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
                      onChange={(e) => setCourseData({...courseData, price: parseInt(e.target.value)})}
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

            {/* Leçons */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Leçons</CardTitle>
                    <CardDescription>Contenu du cours</CardDescription>
                  </div>
                  <Button onClick={handleAddLesson} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une leçon
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Leçon {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Titre de la leçon</Label>
                          <Input
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(lesson.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Durée (minutes)</Label>
                          <Input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(lesson.id, 'duration', parseInt(e.target.value))}
                          />
                        </div>
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
                  <img
                    src={courseData.image}
                    alt="Aperçu du cours"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Changer l'image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Étudiants inscrits</span>
                  <span className="font-medium">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Note moyenne</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenus</span>
                  <span className="font-medium text-green-600">€15,000</span>
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
