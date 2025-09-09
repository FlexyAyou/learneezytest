import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X, Save, BookOpen, Video, FileText, Image, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';

interface CreateFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormationCreated: (formation: any) => void;
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

export const CreateFormationModal = ({ isOpen, onClose, onFormationCreated }: CreateFormationModalProps) => {
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'review'>('info');
  
  const [formationData, setFormationData] = useState({
    titre: '',
    description: '',
    formateur: '',
    niveau: 'Débutant',
    duree: '',
    dateDebut: '',
    dateFin: '',
    capaciteMax: '',
    category: '',
    image: null as File | null,
    objectives: [''],
  });

  const [modules, setModules] = useState<Module[]>([
    { id: '1', title: '', duration: '', content: '', documents: [] }
  ]);

  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormationData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormationData(prev => ({ ...prev, image: file }));
    }
  };

  const addObjective = () => {
    setFormationData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormationData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    if (formationData.objectives.length > 1) {
      setFormationData(prev => ({
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

  const handleCreateFormation = () => {
    if (!formationData.titre || !formationData.description || modules.some(m => !m.title || !m.content)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newFormation = {
      id: Date.now().toString(),
      titre: formationData.titre,
      description: formationData.description,
      formateur: formationData.formateur,
      niveau: formationData.niveau,
      duree: formationData.duree,
      dateDebut: formationData.dateDebut,
      dateFin: formationData.dateFin,
      participants: 0,
      capaciteMax: parseInt(formationData.capaciteMax) || 20,
      inscrits: 0,
      termines: 0,
      status: 'planned',
      progression: 0,
      vues: 0,
      stats: '0',
      modules: modules.filter(m => m.title && m.content),
      objectives: formationData.objectives.filter(obj => obj.trim() !== ''),
      createdAt: new Date().toISOString(),
    };

    console.log('Formation created:', newFormation);
    onFormationCreated(newFormation);
    
    toast.success('Formation créée avec succès !');
    
    // Reset form
    setCurrentStep('info');
    setFormationData({
      titre: '',
      description: '',
      formateur: '',
      niveau: 'Débutant',
      duree: '',
      dateDebut: '',
      dateFin: '',
      capaciteMax: '',
      category: '',
      image: null,
      objectives: [''],
    });
    setModules([{ id: '1', title: '', duration: '', content: '', documents: [] }]);
    
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la formation *
                </label>
                <Input
                  value={formationData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  placeholder="Ex: Développement Web Full Stack - React & Node.js"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={formationData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre formation en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formateur *
                </label>
                <Input
                  value={formationData.formateur}
                  onChange={(e) => handleInputChange('formateur', e.target.value)}
                  placeholder="Nom du formateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <Select value={formationData.niveau} onValueChange={(value) => handleInputChange('niveau', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Avancé">Avancé</SelectItem>
                    <SelectItem value="Professionnel">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée totale
                </label>
                <Input
                  value={formationData.duree}
                  onChange={(e) => handleInputChange('duree', e.target.value)}
                  placeholder="Ex: 120h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité maximale
                </label>
                <Input
                  type="number"
                  value={formationData.capaciteMax}
                  onChange={(e) => handleInputChange('capaciteMax', e.target.value)}
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <Input
                  value={formationData.dateDebut}
                  onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                  placeholder="Ex: 27 mars 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <Input
                  value={formationData.dateFin}
                  onChange={(e) => handleInputChange('dateFin', e.target.value)}
                  placeholder="Ex: 15 mai 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <Select value={formationData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Développement Web">Développement Web</SelectItem>
                    <SelectItem value="Intelligence Artificielle">Intelligence Artificielle</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                    <SelectItem value="Développement Mobile">Développement Mobile</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs pédagogiques
              </label>
              <div className="space-y-2">
                {formationData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objectif ${index + 1}`}
                    />
                    {formationData.objectives.length > 1 && (
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
                  id="formation-image-upload"
                />
                <label htmlFor="formation-image-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choisir un fichier
                  </Button>
                </label>
                {formationData.image && (
                  <p className="text-sm text-green-600 mt-2">
                    {formationData.image.name}
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
              <h3 className="text-lg font-semibold">Modules de la formation</h3>
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
            <h3 className="text-lg font-semibold">Révision de la formation</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Titre:</strong> {formationData.titre}</div>
                <div><strong>Description:</strong> {formationData.description}</div>
                <div><strong>Formateur:</strong> {formationData.formateur}</div>
                <div><strong>Niveau:</strong> {formationData.niveau}</div>
                <div><strong>Durée:</strong> {formationData.duree}</div>
                <div><strong>Capacité:</strong> {formationData.capaciteMax} participants</div>
                <div><strong>Période:</strong> {formationData.dateDebut} - {formationData.dateFin}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modules ({modules.filter(m => m.title && m.content).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modules.filter(m => m.title && m.content).map((module, index) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{module.title}</span>
                        {module.duration && <span className="text-gray-500 ml-2">({module.duration})</span>}
                      </div>
                      <div className="flex space-x-1">
                        {module.videoUrl && <Badge variant="secondary">Vidéo</Badge>}
                        {module.imageUrl && <Badge variant="secondary">Image</Badge>}
                        {module.documents && module.documents.length > 0 && (
                          <Badge variant="secondary">{module.documents.length} doc(s)</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {formationData.objectives.filter(obj => obj.trim() !== '').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs pédagogiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {formationData.objectives.filter(obj => obj.trim() !== '').map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'info': return 'Informations générales';
      case 'modules': return 'Modules et contenu';
      case 'review': return 'Révision et création';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'info':
        return formationData.titre && formationData.description && formationData.formateur;
      case 'modules':
        return modules.some(m => m.title && m.content);
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Créer une nouvelle formation - {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center">
              {['info', 'modules', 'review'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? 'bg-pink-600 text-white' 
                      : index < ['info', 'modules', 'review'].indexOf(currentStep)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      index < ['info', 'modules', 'review'].indexOf(currentStep)
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {renderStepContent()}

        <div className="flex justify-between pt-6 border-t">
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
                handleCreateFormation();
              }
            }}
            disabled={!canProceed()}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {currentStep === 'review' ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Créer la formation
              </>
            ) : (
              'Suivant'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};