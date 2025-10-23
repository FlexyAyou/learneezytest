import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { QuestionBuilder } from './QuestionBuilder';
import type { QuizConfig, Question, QuestionType } from '@/types/quiz';

interface QuizBuilderProps {
  quiz?: QuizConfig;
  onSave: (quiz: QuizConfig) => void;
  onCancel: () => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ quiz, onSave, onCancel }) => {
  const [title, setTitle] = useState(quiz?.title || '');
  const [description, setDescription] = useState(quiz?.description || '');
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [settings, setSettings] = useState(quiz?.settings || {
    showFeedback: 'after-submit' as const,
    allowRetry: true,
    maxAttempts: 3,
    randomizeQuestions: false,
    randomizeOptions: false,
    passingScore: 70,
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  // Types de questions autorisés pour les quiz (rapides)
  const allowedQuestionTypes: QuestionType[] = [
    'single-choice',
    'multiple-choice',
    'true-false',
    'short-answer'
  ];

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionBuilder(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionBuilder(true);
  };

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

  const handleSaveQuiz = () => {
    const newQuiz: QuizConfig = {
      id: quiz?.id || `quiz-${Date.now()}`,
      type: 'quiz',
      title,
      description,
      questions,
      settings
    };
    onSave(newQuiz);
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
        availableTypes={allowedQuestionTypes}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Quiz (Leçon)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Titre du quiz *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Quiz sur les bases React"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brève description du quiz..."
              rows={2}
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
            <Label>Affichage du feedback</Label>
            <Select
              value={settings.showFeedback}
              onValueChange={(v) => setSettings({ ...settings, showFeedback: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immédiat (après chaque question)</SelectItem>
                <SelectItem value="after-submit">À la fin du quiz</SelectItem>
                <SelectItem value="never">Jamais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.allowRetry}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRetry: checked })}
              />
              <Label>Autoriser plusieurs tentatives</Label>
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
                checked={settings.randomizeOptions}
                onCheckedChange={(checked) => setSettings({ ...settings, randomizeOptions: checked })}
              />
              <Label>Ordre aléatoire des options</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Questions ({questions.length})</CardTitle>
          <Button onClick={handleAddQuestion} size="sm">
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
                      onClick={() => handleEditQuestion(question)}
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
        <Button onClick={handleSaveQuiz} disabled={!title || questions.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le quiz
        </Button>
      </div>
    </div>
  );
};
