import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { QuestionBuilder } from './QuestionBuilder';
import type { AssignmentConfig, Question } from '@/types/quiz';

interface AssignmentBuilderProps {
  assignment?: AssignmentConfig;
  onSave: (assignment: AssignmentConfig) => void;
  onCancel: () => void;
}

export const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({
  assignment,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(assignment?.title || '');
  const [description, setDescription] = useState(assignment?.description || '');
  const [instructions, setInstructions] = useState(assignment?.instructions || '');
  const [questions, setQuestions] = useState<Question[]>(assignment?.questions || []);
  const [settings, setSettings] = useState(assignment?.settings || {
    allowLateSubmission: false,
    maxAttempts: 1,
    passingScore: 70,
    requiresManualGrading: false,
    rubric: [],
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

  const handleSaveAssignment = () => {
    const newAssignment: AssignmentConfig = {
      id: assignment?.id || `assignment-${Date.now()}`,
      type: 'assignment',
      title,
      description,
      instructions,
      questions,
      settings
    };
    onSave(newAssignment);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Configuration du Devoir (Module)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Titre du devoir *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Évaluation Module 1 - Fondamentaux"
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du devoir et des objectifs..."
              rows={3}
            />
          </div>
          <div>
            <Label>Instructions</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions détaillées pour l'étudiant..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Note de passage (%)</Label>
              <Input
                type="number"
                value={settings.passingScore}
                onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) })}
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label>Tentatives max</Label>
              <Input
                type="number"
                value={settings.maxAttempts}
                onChange={(e) => setSettings({ ...settings, maxAttempts: Number(e.target.value) })}
                min={1}
              />
            </div>
          </div>

          <div>
            <Label>Temps limite (minutes, optionnel)</Label>
            <Input
              type="number"
              value={settings.timeLimit || ''}
              onChange={(e) => setSettings({ ...settings, timeLimit: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Laisser vide pour illimité"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.allowLateSubmission}
                onCheckedChange={(checked) => setSettings({ ...settings, allowLateSubmission: checked })}
              />
              <Label>Autoriser les soumissions en retard</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.requiresManualGrading}
                onCheckedChange={(checked) => setSettings({ ...settings, requiresManualGrading: checked })}
              />
              <Label>Nécessite une correction manuelle</Label>
            </div>
          </div>

          {settings.requiresManualGrading && (
            <div>
              <Label>Grille d'évaluation</Label>
              {(settings.rubric || []).map((criterion, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={criterion}
                    onChange={(e) => {
                      const newRubric = [...(settings.rubric || [])];
                      newRubric[index] = e.target.value;
                      setSettings({ ...settings, rubric: newRubric });
                    }}
                    placeholder={`Critère ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newRubric = (settings.rubric || []).filter((_, i) => i !== index);
                      setSettings({ ...settings, rubric: newRubric });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings({ ...settings, rubric: [...(settings.rubric || []), ''] })}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un critère
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Questions ({questions.length})</CardTitle>
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
                    <div className="text-sm text-muted-foreground mt-1">
                      Type: {question.type} | Points: {question.points}
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
        <Button onClick={handleSaveAssignment} disabled={!title || !description || questions.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le devoir
        </Button>
      </div>
    </div>
  );
};
