
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles, Clock, Target, Users, ArrowRight } from 'lucide-react';
import { promptTemplates, estimatedCosts } from '@/data/mockAIData';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';

interface AICourseConfigStepProps {
  onNext: () => void;
}

export const AICourseConfigStep = ({ onNext }: AICourseConfigStepProps) => {
  const { saveConfigData } = useAICourseCreation();
  
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    category: '',
    estimatedDuration: '',
    description: '',
    objectives: ['']
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        category: template.category,
        description: template.example
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, objectives: newObjectives }));
    }
  };

  const handleNext = () => {
    saveConfigData(formData);
    onNext();
  };

  const isFormValid = formData.title && formData.level && formData.category && formData.description;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-800">Configuration du cours</h2>
          <Sparkles className="h-5 w-5 text-pink-600" />
        </div>
        <p className="text-gray-600">
          Définissez les paramètres de base pour que l'IA comprenne vos besoins pédagogiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Titre du cours *
                </label>
                <Input
                  placeholder="Ex: Les Nombres de 0 à 20 pour les CP"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Niveau scolaire *
                  </label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cp">CP</SelectItem>
                      <SelectItem value="ce1">CE1</SelectItem>
                      <SelectItem value="ce2">CE2</SelectItem>
                      <SelectItem value="cm1">CM1</SelectItem>
                      <SelectItem value="cm2">CM2</SelectItem>
                      <SelectItem value="6eme">6ème</SelectItem>
                      <SelectItem value="5eme">5ème</SelectItem>
                      <SelectItem value="4eme">4ème</SelectItem>
                      <SelectItem value="3eme">3ème</SelectItem>
                      <SelectItem value="2nde">2nde</SelectItem>
                      <SelectItem value="1ere">1ère</SelectItem>
                      <SelectItem value="terminale">Terminale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Matière *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la matière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Histoire-Géographie">Histoire-Géographie</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                      <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                      <SelectItem value="SVT">SVT</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Durée estimée
                </label>
                <Select value={formData.estimatedDuration} onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durée approximative" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2h">2 heures</SelectItem>
                    <SelectItem value="5h">5 heures</SelectItem>
                    <SelectItem value="8h">8 heures</SelectItem>
                    <SelectItem value="12h">12 heures</SelectItem>
                    <SelectItem value="20h">20 heures</SelectItem>
                    <SelectItem value="30h">30+ heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                Description du cours
              </CardTitle>
              <CardDescription>
                Décrivez en détail ce que vous souhaitez enseigner. Plus vous êtes précis, meilleur sera le résultat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ex: Je veux créer un cours pour apprendre aux élèves de CP à reconnaître et manipuler les nombres de 0 à 20. Le cours doit inclure des activités ludiques, des exercices de comptage avec des objets concrets, et une introduction aux additions simples. J'aimerais que chaque leçon dure environ 30 minutes..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Objectifs pédagogiques
              </CardTitle>
              <CardDescription>
                Définissez les compétences que les élèves devront maîtriser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Objectif ${index + 1}...`}
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    />
                    {formData.objectives.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addObjective}>
                  + Ajouter un objectif
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec templates et coûts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Templates suggérés</CardTitle>
              <CardDescription>
                Utilisez un template pour démarrer plus rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-pink-300 ${
                      selectedTemplate === template.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {template.description}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      "{template.example}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Estimation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Génération structure:</span>
                  <span className="font-medium">~2 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Génération contenu:</span>
                  <span className="font-medium">~5 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coût estimé:</span>
                  <span className="font-medium text-green-600">€{estimatedCosts.total.cost.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens:</span>
                  <span className="text-xs text-gray-500">{estimatedCosts.total.tokens}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-800 mb-2">IA Éducative</h3>
                <p className="text-sm text-pink-700 mb-4">
                  Notre IA est spécialement entraînée pour créer du contenu pédagogique adapté au système éducatif français.
                </p>
                <Badge className="bg-pink-600 text-white">
                  Prototype v1.0
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleNext}
          disabled={!isFormValid}
          className="bg-pink-600 hover:bg-pink-700"
        >
          Générer la structure
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
