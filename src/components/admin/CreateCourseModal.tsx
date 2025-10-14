
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X, Save, Book, Video, FileText, Image, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateCourse, useUploadMedia } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { Course } from '@/types/fastapi';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: any) => void;
}

interface Module {
  id: string;
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  documents?: File[];
}

export const CreateCourseModal = ({ isOpen, onClose, onCourseCreated }: CreateCourseModalProps) => {
  const { toast } = useToast();
  const { user } = useFastAPIAuth();
  const createCourseMutation = useCreateCourse();
  const uploadMediaMutation = useUploadMedia();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  const [isUploading, setIsUploading] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'débutant',
    image: null as File | null,
    objectives: [''],
  });

  const [modules, setModules] = useState<Module[]>([
    { id: '1', title: '', duration: '', content: '', documents: [] }
  ]);

  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData(prev => ({ ...prev, image: file }));
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
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      duration: '',
      content: '',
      documents: []
    };
    setModules(prev => [...prev, newModule]);
  };

  const removeModule = (id: string) => {
    if (modules.length > 1) {
      setModules(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateModule = (id: string, field: keyof Module, value: any) => {
    setModules(prev => prev.map(module => 
      module.id === id ? { ...module, [field]: value } : module
    ));
  };

  const handleVideoUpload = (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate video URL for demo
      updateModule(moduleId, 'videoUrl', URL.createObjectURL(file));
    }
  };

  const handleModuleImageUpload = (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateModule(moduleId, 'imageUrl', URL.createObjectURL(file));
    }
  };

  const handleDocumentUpload = (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentModule = modules.find(m => m.id === moduleId);
    if (currentModule) {
      updateModule(moduleId, 'documents', [...(currentModule.documents || []), ...files]);
    }
  };

  const applyTextFormat = (moduleId: string, format: string) => {
    const textarea = document.getElementById(`content-${moduleId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentModule = modules.find(m => m.id === moduleId);
    
    if (!currentModule || !selectedText) return;

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = currentModule.content.substring(0, start) + formattedText + currentModule.content.substring(end);
    updateModule(moduleId, 'content', newContent);
  };

  const handleCreateCourse = async () => {
    if (!courseData.title || !courseData.description || modules.some(m => !m.title || !m.content)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // 1. Créer le cours
      const coursePayload: Course = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price ? parseFloat(courseData.price) : undefined,
        category: courseData.category || undefined,
        duration: courseData.duration || undefined,
        level: courseData.level,
        modules: modules
          .filter(m => m.title && m.content)
          .map(m => ({
            title: m.title,
            duration: m.duration || '1h',
            description: m.content,
            content: [{
              title: m.title,
              duration: m.duration || '1h',
              description: m.content,
              video_url: m.videoUrl,
            }]
          }))
      };

      const result = await createCourseMutation.mutateAsync(coursePayload);

      // 2. Upload de l'image de couverture si présente (TODO: when upload API is ready)
      // if (courseData.image && result.id) {
      //   const { url } = await uploadMediaMutation.mutateAsync({
      //     courseId: result.id,
      //     fileType: 'image',
      //     fileName: courseData.image.name
      //   });
      //
      //   await fetch(url, {
      //     method: 'PUT',
      //     body: courseData.image,
      //     headers: { 'Content-Type': courseData.image.type }
      //   });
      // }

      // 3. Upload des vidéos pour chaque module (TODO: when upload API is ready)
      // for (const module of modules.filter(m => m.videoUrl)) {
      //   if (result.id) {
      //     const videoBlob = await fetch(module.videoUrl).then(r => r.blob());
      //     const { url } = await uploadMediaMutation.mutateAsync({
      //       courseId: result.id,
      //       fileType: 'video',
      //       fileName: `${module.title}.mp4`
      //     });
      //
      //     await fetch(url, {
      //       method: 'PUT',
      //       body: videoBlob
      //     });
      //   }
      // }

      toast({
        title: "Cours créé",
        description: "Le cours a été créé avec succès",
      });
      
      onCourseCreated(result);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cours. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du cours *
                </label>
                <Input
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Maîtrisez React de A à Z"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre cours en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée
                </label>
                <Input
                  value={courseData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 20h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs pédagogiques
              </label>
              <div className="space-y-2">
                {courseData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objectif ${index + 1}`}
                    />
                    {courseData.objectives.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un objectif
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de couverture
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Glissez votre image ici ou cliquez pour sélectionner</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="course-image-upload"
                />
                <label htmlFor="course-image-upload">
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
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modules du cours</h3>
              <Button onClick={addModule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un module
              </Button>
            </div>

            {modules.map((module, index) => (
              <Card key={module.id} className="p-4">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Module {index + 1}</CardTitle>
                    {modules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(module.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre du module *
                      </label>
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                        placeholder="Ex: Introduction à React"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée
                      </label>
                      <Input
                        value={module.duration}
                        onChange={(e) => updateModule(module.id, 'duration', e.target.value)}
                        placeholder="Ex: 2h 30min"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu du module *
                    </label>
                    
                    {/* Éditeur de texte riche */}
                    <div className="border rounded-md">
                      <div className="flex items-center space-x-1 p-2 border-b bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTextFormat(module.id, 'bold')}
                          className="p-1"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTextFormat(module.id, 'italic')}
                          className="p-1"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTextFormat(module.id, 'underline')}
                          className="p-1"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTextFormat(module.id, 'list')}
                          className="p-1"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTextFormat(module.id, 'orderedList')}
                          className="p-1"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </div>
                      <textarea
                        id={`content-${module.id}`}
                        className="w-full min-h-[200px] px-3 py-2 border-0 focus:outline-none focus:ring-0 resize-none"
                        value={module.content}
                        onChange={(e) => updateModule(module.id, 'content', e.target.value)}
                        placeholder="Décrivez le contenu de ce module..."
                        onFocus={() => setActiveEditor(module.id)}
                        onBlur={() => setActiveEditor(null)}
                      />
                    </div>
                  </div>

                  {/* Médias et documents */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vidéo du module
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Video className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(module.id, e)}
                          className="hidden"
                          id={`video-upload-${module.id}`}
                        />
                        <label htmlFor={`video-upload-${module.id}`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            Ajouter vidéo
                          </Button>
                        </label>
                        {module.videoUrl && (
                          <p className="text-xs text-green-600 mt-1">Vidéo ajoutée</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image du module
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleModuleImageUpload(module.id, e)}
                          className="hidden"
                          id={`image-upload-${module.id}`}
                        />
                        <label htmlFor={`image-upload-${module.id}`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            Ajouter image
                          </Button>
                        </label>
                        {module.imageUrl && (
                          <p className="text-xs text-green-600 mt-1">Image ajoutée</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={(e) => handleDocumentUpload(module.id, e)}
                          className="hidden"
                          id={`docs-upload-${module.id}`}
                        />
                        <label htmlFor={`docs-upload-${module.id}`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            Ajouter docs
                          </Button>
                        </label>
                        {module.documents && module.documents.length > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            {module.documents.length} document(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Récapitulatif du cours</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Titre:</strong> {courseData.title}</div>
                  <div><strong>Catégorie:</strong> {courseData.category}</div>
                  <div><strong>Niveau:</strong> {courseData.level}</div>
                  <div><strong>Prix:</strong> {courseData.price ? `${courseData.price}€` : 'Gratuit'}</div>
                  <div><strong>Durée:</strong> {courseData.duration}</div>
                  <div><strong>Nombre de modules:</strong> {modules.length}</div>
                </div>
                <div className="mt-4">
                  <strong>Description:</strong>
                  <p className="text-gray-600 mt-1">{courseData.description}</p>
                </div>
                <div className="mt-4">
                  <strong>Objectifs:</strong>
                  <ul className="list-disc list-inside text-gray-600 mt-1">
                    {courseData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border-l-4 border-pink-500 pl-4">
                      <h4 className="font-medium">Module {index + 1}: {module.title}</h4>
                      <p className="text-sm text-gray-600">Durée: {module.duration || 'Non spécifiée'}</p>
                      <div className="flex space-x-4 mt-2">
                        {module.videoUrl && <Badge variant="outline">Vidéo</Badge>}
                        {module.imageUrl && <Badge variant="outline">Image</Badge>}
                        {module.documents && module.documents.length > 0 && (
                          <Badge variant="outline">{module.documents.length} document(s)</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center space-x-3">
            <Book className="h-6 w-6 text-pink-600" />
            <DialogTitle className="text-xl font-bold">Créer un nouveau cours</DialogTitle>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 mt-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'info' ? 'text-pink-600' : currentStep === 'modules' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'info' ? 'bg-pink-600 text-white' : currentStep === 'modules' || currentStep === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Informations</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'modules' ? 'text-pink-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'modules' ? 'bg-pink-600 text-white' : currentStep === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Modules</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'review' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Révision</span>
            </div>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              if (currentStep === 'info') {
                onClose();
              } else if (currentStep === 'modules') {
                setCurrentStep('info');
              } else if (currentStep === 'review') {
                setCurrentStep('modules');
              }
            }}
          >
            {currentStep === 'info' ? 'Annuler' : 'Précédent'}
          </Button>
          
          <Button 
            onClick={() => {
              if (currentStep === 'info') {
                setCurrentStep('modules');
              } else if (currentStep === 'modules') {
                setCurrentStep('review');
              } else if (currentStep === 'review') {
                handleCreateCourse();
              }
            }}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {currentStep === 'review' ? 'Créer le cours' : 'Suivant'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
