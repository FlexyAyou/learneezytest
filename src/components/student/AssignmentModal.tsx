import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Trophy, XCircle } from 'lucide-react';
import { Question, AssignmentConfigLike, UserAnswer, EvaluationResult } from '@/types/quiz';
import { fastAPIClient } from '@/services/fastapi-client';

interface AssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: any; // AssignmentResponse-like
  courseId: string;
  moduleId: string;
  onComplete?: (result: EvaluationResult) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  open,
  onOpenChange,
  assignment,
  courseId,
  moduleId,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setAnswers(new Map());
      setShowResults(false);
      setResult(null);
      setEvaluationId(null);
    }
  }, [open]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(new Map(answers.set(questionId, answer)));
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers.get(question.id);

    switch (question.type) {
      case 'single-choice':
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple-choice':
        const selectedOptions = currentAnswer || [];
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent">
                <Checkbox
                  id={`option-${index}`}
                  checked={selectedOptions.includes(index)}
                  onCheckedChange={(checked) => {
                    const newAnswers = checked
                      ? [...selectedOptions, index]
                      : selectedOptions.filter((i: number) => i !== index);
                    handleAnswerChange(question.id, newAnswers);
                  }}
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, value === 'true')}
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">Vrai</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">Faux</Label>
            </div>
          </RadioGroup>
        );

      case 'short-answer':
        return (
          <Input
            placeholder="Votre réponse..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full"
          />
        );

      case 'long-answer':
        return (
          <Textarea
            placeholder="Votre réponse détaillée..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full min-h-[200px]"
          />
        );

      default:
        return <p className="text-muted-foreground">Type de question non supporté</p>;
    }
  };

  const handleSubmit = async () => {
    if (!assignment) return;
    setSubmitting(true);

    try {
      // 1) Start evaluation session if not already
      let evalId = evaluationId;
      if (!evalId) {
        try {
          const resp = await fastAPIClient.startAssignmentEvaluation(courseId, moduleId, assignment.id);
          evalId = resp?.evaluation_id || resp?.id || null;
          setEvaluationId(evalId);
        } catch (err) {
          console.warn('Erreur création évaluation:', err);
          // proceed without evaluation id
        }
      }

      // 2) Build submission payload
      const answersPayload: any[] = [];
      for (const q of assignment.questions || []) {
        answersPayload.push({
          question_id: q.id || q.question, // best-effort key
          answer: answers.get(q.id) ?? answers.get(q.question) ?? null,
        });
      }

      const payload = {
        evaluation_id: evalId,
        assignment_id: assignment.id,
        answers: answersPayload,
      };

      // 3) Submit via API if evaluation id available, else call generic endpoint
      let submitResp: any = null;
      if (evalId) {
        submitResp = await fastAPIClient.submitEvaluation(evalId, payload);
      } else {
        // fallback: post to generic submit endpoint
        submitResp = await fastAPIClient.post(`/api/evaluations/${evalId || 'unknown'}/submit`, payload);
      }

      const evalResult: EvaluationResult = submitResp?.result || submitResp || {
        evaluationId: evalId || 'local',
        evaluationType: 'assignment',
        userId: 'current-user',
        answers: [],
        score: 0,
        pointsEarned: 0,
        totalPoints: 0,
        isPassing: false,
        attemptNumber: 1,
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent: 0,
      };

      setResult(evalResult as EvaluationResult);
      setShowResults(true);
      onComplete?.(evalResult as EvaluationResult);
    } catch (err) {
      console.error('Erreur soumission devoir:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnswers(new Map());
    setShowResults(false);
    setResult(null);
    setEvaluationId(null);
    onOpenChange(false);
  };

  if (showResults && result) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {result.isPassing ? (
                <>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Félicitations !
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  Devoir soumis
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Résultats de votre devoir
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center p-6 bg-accent rounded-lg">
              <div className="text-5xl font-bold mb-2">
                {Math.round(result.score)}%
              </div>
              <p className="text-muted-foreground">
                {result.pointsEarned} / {result.totalPoints} points
              </p>
              <Badge variant={result.isPassing ? 'default' : 'destructive'} className="mt-2">
                {result.isPassing ? 'Réussi' : 'Non réussi'}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Devoir: {assignment?.title}</DialogTitle>
          <DialogDescription>
            {assignment?.instructions}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {assignment?.questions?.map((q: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="font-semibold mb-2">Question {idx + 1}</div>
              <div className="text-sm text-gray-700 mb-2">{q.question}</div>
              {renderQuestion(q as Question)}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Envoi...' : 'Soumettre le devoir'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
