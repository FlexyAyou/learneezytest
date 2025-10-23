import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionBuilder } from './QuestionBuilder';
import type { CertificationConfig, Question } from '@/types/quiz';

interface CertificationBuilderProps {
  certification?: CertificationConfig;
  onSave: (certification: CertificationConfig) => void;
  onCancel: () => void;
  availableModules?: { id: string; title: string }[];
}

export const CertificationBuilder: React.FC<CertificationBuilderProps> = ({
  certification,
  onSave,
  onCancel,
  availableModules = []
}) => {
  const [title, setTitle] = useState(certification?.title || '');
  const [description, setDescription] = useState(certification?.description || '');
  const [questions, setQuestions] = useState<Question[]>(certification?.questions || []);
  const [settings, setSettings] = useState(certification?.settings || {
    examMode: true,
    timeLimit: 120,
    passingScore: 75,
    maxAttempts: 2,
    randomizeQuestions: true,
    showResultsImmediately: false,
    prerequisites: [],
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  const handleSaveQuestion = (question: Question) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === question.id ? question : q));
    } else {
      setQuestions([...questions, question]);
    }
    setShowQuestionBuilder(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSaveCertification = () => {
    const newCertification: CertificationConfig = {
      id: certification?.id || `cert-${Date.now()}`,
      type: 'certification',
      title,
      description,
      questions,
      settings
    };
    onSave(newCertification);
  };

  if (showQuestionBuilder) {
    return (
      <QuestionBuilder
        question={editingQuestion || undefined}
        onSave={handleSaveQuestion}
        onCancel={() => {
          setShowQuestionBuilder(false);
          setEditingQuestion(null);
        }}
      />
    );
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <Card className="border-primary">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Configuration de la Certification (Cours Complet)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Titre de la certification *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Certification React Développeur"
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la certification et des compétences validées..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'examen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Temps limite (minutes) *</Label>
              <Input
                type="number"
                value={settings.timeLimit}
                onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) })}
                min={30}
              />
            </div>
            <div>
              <Label>Note de passage (%)</Label>
              <Input
                type="number"
                value={settings.passingScore}
                onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) })}
                min={50}
                max={100}
              />
            </div>
          </div>

          <div>
            <Label>Tentatives max</Label>
            <Input
              type="number"
              value={settings.maxAttempts}
              onChange={(e) => setSettings({ ...settings, maxAttempts: Number(e.target.value) })}
              min={1}
              max={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Switch
                checked={settings.examMode}
                onCheckedChange={(checked) => setSettings({ ...settings, examMode: checked })}
              />
              <div className="flex-1">
                <Label>Mode examen</Label>
                <p className="text-xs text-muted-foreground">
                  Désactive copier/coller, sortie d'écran détectée, plein écran obligatoire
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.randomizeQuestions}
                onCheckedChange={(checked) => setSettings({ ...settings, randomizeQuestions: checked })}
              />
              <Label>Ordre aléatoire des questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.showResultsImmediately}
                onCheckedChange={(checked) => setSettings({ ...settings, showResultsImmediately: checked })}
              />
              <Label>Afficher les résultats immédiatement</Label>
            </div>
          </div>

          {availableModules.length > 0 && (
            <div>
              <Label>Prérequis (modules à valider avant)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableModules.map(module => (
                  <Badge
                    key={module.id}
                    variant={(settings.prerequisites || []).includes(module.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const prerequisites = settings.prerequisites || [];
                      setSettings({
                        ...settings,
                        prerequisites: prerequisites.includes(module.id)
                          ? prerequisites.filter(id => id !== module.id)
                          : [...prerequisites, module.id]
                      });
                    }}
                  >
                    {module.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Questions ({questions.length})</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total des points : {totalPoints}
            </p>
          </div>
          <Button onClick={() => setShowQuestionBuilder(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une question
          </Button>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune question. Cliquez sur "Ajouter une question" pour commencer.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {index + 1}. {question.question}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex gap-3">
                      <span>Type: {question.type}</span>
                      <span>Points: {question.points}</span>
                      {question.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingQuestion(question);
                        setShowQuestionBuilder(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSaveCertification} disabled={!title || !description || questions.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer la certification
        </Button>
      </div>
    </div>
  );
};
