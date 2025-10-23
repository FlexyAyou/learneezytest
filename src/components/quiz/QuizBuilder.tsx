import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Check } from 'lucide-react';
import { SimpleQuizQuestion } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';

interface QuizBuilderProps {
  questions: SimpleQuizQuestion[];
  onQuestionsChange: (questions: SimpleQuizQuestion[]) => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ questions, onQuestionsChange }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: SimpleQuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      answerType: 'single',
      points: 1
    };
    onQuestionsChange([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
    if (expandedQuestion === id) setExpandedQuestion(null);
  };

  const updateQuestion = (id: string, updates: Partial<SimpleQuizQuestion>) => {
    onQuestionsChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    updateQuestion(questionId, { options: [...question.options, ''] });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.options.length <= 2) return;
    
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  const toggleCorrectAnswer = (questionId: string, option: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    if (question.answerType === 'single') {
      updateQuestion(questionId, { correctAnswer: option });
    } else {
      const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      updateQuestion(questionId, { correctAnswer: newAnswers });
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question, qIndex) => (
        <Card key={question.id} className="border-l-4 border-l-purple-500">
          <CardHeader className="cursor-pointer" onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {qIndex + 1}
                {question.question && <span className="ml-2 text-sm font-normal text-muted-foreground">: {question.question.substring(0, 50)}{question.question.length > 50 ? '...' : ''}</span>}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{question.answerType === 'single' ? 'Choix unique' : 'Choix multiples'}</Badge>
                <Badge variant="secondary">{question.points || 1} pt{(question.points || 1) > 1 ? 's' : ''}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuestion(question.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedQuestion === question.id && (
            <CardContent className="space-y-4">
              <div>
                <Label>Question</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  placeholder="Posez votre question..."
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de réponse</Label>
                  <Select
                    value={question.answerType}
                    onValueChange={(value: 'single' | 'multiple') => {
                      updateQuestion(question.id, { 
                        answerType: value,
                        correctAnswer: value === 'single' ? '' : []
                      });
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Choix unique</SelectItem>
                      <SelectItem value="multiple">Choix multiples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points || 1}
                    onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Options de réponse</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une option
                  </Button>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={
                          question.answerType === 'single'
                            ? question.correctAnswer === option ? 'default' : 'outline'
                            : Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option) ? 'default' : 'outline'
                        }
                        size="sm"
                        className="w-10"
                        onClick={() => toggleCorrectAnswer(question.id, option)}
                        disabled={!option}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(question.id, optIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {question.answerType === 'single' 
                    ? 'Cliquez sur ✓ pour marquer la bonne réponse'
                    : 'Cliquez sur ✓ pour marquer les bonnes réponses (plusieurs possibles)'}
                </p>
              </div>

              <div>
                <Label>Explication (optionnel)</Label>
                <Textarea
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                  placeholder="Expliquez pourquoi c'est la bonne réponse..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addQuestion}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une question
      </Button>
    </div>
  );
};
