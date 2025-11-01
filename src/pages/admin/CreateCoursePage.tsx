import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { fastAPIClient } from '@/services/fastapi-client';

const CreateCoursePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'débutant',
    image: null as File | null,
    modules: [{ title: '', duration: '', content: '' }]
  });

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData(prev => ({ ...prev, image: file }));
    }
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', duration: '', content: '' }]
    }));
  };

  const removeModule = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const updateModule = (index: number, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon sauvegardé",
      description: "Votre cours a été sauvegardé en tant que brouillon",
    });
  };

  const handlePublish = async () => {
    if (!courseData.title || !courseData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (courseData.modules.length === 0 || !courseData.modules[0].title) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un module avec un titre",
        variant: "destructive"
      });
      return;
    }

    try {
      // Transformer les données au format attendu par FastAPI
      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price ? parseFloat(courseData.price) : undefined,
        category: courseData.category || undefined,
        duration: courseData.duration || undefined,
        level: courseData.level,
        image_url: courseData.image ? 'uploaded-image-url' : undefined,
        modules: courseData.modules
          .filter(m => m.title)
          .map(m => ({
            title: m.title,
            duration: m.duration || '1h',
            description: m.content || '',
            content: [{
              title: m.title,
              duration: m.duration || '1h',
              description: m.content || 'Contenu à venir'
            }]
          }))
      };

      const createdCourse = await fastAPIClient.createCourse(coursePayload);
      
      toast({
        title: "Cours créé",
        description: "Le cours a été créé avec succès",
      });
      
      navigate('/dashboard/superadmin/courses');
    } catch (error: any) {
      console.error('Erreur lors de la création du cours:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le cours",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/superadmin/courses')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Créer un nouveau cours</h1>
        </div>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre du cours *
                </label>
                <Input
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Maîtrisez React de A à Z"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre cours en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prix (€)
                  </label>
                  <Input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Catégorie
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={courseData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="development">Développement</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Niveau
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="avancé">Avancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Glissez votre image ici ou cliquez pour sélectionner</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choisir un fichier
                    </Button>
                  </label>
                  {courseData.image && (
                    <p className="text-sm text-green-600 mt-2">
                      {courseData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules du cours */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Modules du cours</CardTitle>
                <Button onClick={addModule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un module
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.modules.map((module, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Module {index + 1}</h4>
                    {courseData.modules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Titre du module
                      </label>
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(index, 'title', e.target.value)}
                        placeholder="Ex: Introduction à React"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Durée
                      </label>
                      <Input
                        value={module.duration}
                        onChange={(e) => updateModule(index, 'duration', e.target.value)}
                        placeholder="Ex: 2h 30min"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contenu du module
                    </label>
                    <textarea
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={module.content}
                      onChange={(e) => updateModule(index, 'content', e.target.value)}
                      placeholder="Décrivez le contenu de ce module..."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder en brouillon
            </Button>
            <Button onClick={handlePublish} className="bg-primary">
              Publier le cours
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
