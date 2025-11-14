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
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { Question, QuizConfig, UserAnswer, EvaluationResult } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: QuizConfig;
  onComplete?: (result: EvaluationResult) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onOpenChange,
  quiz,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [startTime] = useState(new Date());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Provide default settings when backend does not include them
  const defaultSettings = {
    timeLimit: null as number | null,
    passingScore: 50,
    allowRetry: true,
    maxAttempts: null as number | null,
    showFeedback: 'always' as 'always' | 'never' | 'on-fail'
  };

  const settings = { ...defaultSettings, ...(quiz?.settings || {}) };

  // Timer effect (only if a timeLimit is provided)
  useEffect(() => {
    if (!open || showResults || !settings.timeLimit) return;

    const timeLimitSeconds = settings.timeLimit * 60;
    setTimeRemaining(timeLimitSeconds);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, showResults, settings.timeLimit]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(new Map(answers.set(questionId, answer)));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to specific question
  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Check if answer is correct
  const checkAnswer = (question: Question, userAnswer: any): { isCorrect: boolean; pointsEarned: number } => {
    let isCorrect = false;

    switch (question.type) {
      case 'single-choice':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      case 'multiple-choice':
        const userAnswers = userAnswer || [];
        isCorrect =
          userAnswers.length === question.correctAnswers.length &&
          userAnswers.every((ans: number) => question.correctAnswers.includes(ans));
        break;
      case 'true-false':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      case 'short-answer':
        const userText = (userAnswer || '').trim();
        isCorrect = question.correctAnswers.some(correct => {
          if (question.caseSensitive) {
            return userText === correct;
          }
          return userText.toLowerCase() === correct.toLowerCase();
        });
        break;
      case 'fill-blank':
        const userFills = userAnswer || [];
        isCorrect = userFills.every((fill: string, idx: number) => {
          const correct = question.correctAnswers[idx];
          return fill.trim().toLowerCase() === correct.toLowerCase();
        });
        break;
      case 'matching':
        const userMatches = userAnswer || [];
        isCorrect = userMatches.every((match: { left: number; right: number }) => {
          return question.correctMatches.some(
            correct => correct.left === match.left && correct.right === match.right
          );
        });
        break;
      case 'ordering':
        const userOrder = userAnswer || [];
        isCorrect =
          userOrder.length === question.correctOrder.length &&
          userOrder.every((item: number, idx: number) => item === question.correctOrder[idx]);
        break;
      default:
        isCorrect = false;
    }

    const pointsEarned = isCorrect ? question.points : 0;
    return { isCorrect, pointsEarned };
  };

  // Submit quiz and calculate results
  const handleSubmitQuiz = () => {
    const userAnswers: UserAnswer[] = [];
    let totalPointsEarned = 0;
    let totalPoints = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = answers.get(question.id);
      const { isCorrect, pointsEarned } = checkAnswer(question, userAnswer);

      totalPoints += question.points;
      totalPointsEarned += pointsEarned;

      userAnswers.push({
        questionId: question.id,
        answer: userAnswer,
        isCorrect,
        pointsEarned,
        timeSpent: 0,
        submittedAt: new Date(),
      });
    });

    const score = totalPoints > 0 ? (totalPointsEarned / totalPoints) * 100 : 0;
    const isPassing = score >= settings.passingScore;
    const completedAt = new Date();
    const timeSpent = Math.floor((completedAt.getTime() - startTime.getTime()) / 1000);

    const evaluationResult: EvaluationResult = {
      evaluationId: quiz.id,
      evaluationType: 'quiz',
      userId: 'current-user', // TODO: Get from auth context
      answers: userAnswers,
      score,
      pointsEarned: totalPointsEarned,
      totalPoints,
      isPassing,
      attemptNumber,
      startedAt: startTime,
      completedAt,
      timeSpent,
    };

    setResult(evaluationResult);
    setShowResults(true);
    onComplete?.(evaluationResult);
  };

  // Retry quiz
  const handleRetry = () => {
    if (settings.maxAttempts && attemptNumber >= settings.maxAttempts) {
      return;
    }

    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setResult(null);
    setAttemptNumber(attemptNumber + 1);
  };

  // Close modal
  const handleClose = () => {
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setResult(null);
    setAttemptNumber(1);
    onOpenChange(false);
  };

  // Render question based on type
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

      case 'fill-blank':
        const blanks = question.text.split('[blank]');
        const userFills = currentAnswer || Array(blanks.length - 1).fill('');
        return (
          <div className="space-y-4">
            {blanks.map((text, index) => (
              <React.Fragment key={index}>
                <span>{text}</span>
                {index < blanks.length - 1 && (
                  <Input
                    placeholder={`Réponse ${index + 1}`}
                    value={userFills[index] || ''}
                    onChange={(e) => {
                      const newFills = [...userFills];
                      newFills[index] = e.target.value;
                      handleAnswerChange(question.id, newFills);
                    }}
                    className="inline-block mx-2 w-48"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        );

      default:
        return <p className="text-muted-foreground">Type de question non supporté</p>;
    }
  };

  // Render results view
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
                  Quiz non réussi
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Voici vos résultats pour ce quiz
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Score display */}
            <div className="text-center p-6 bg-accent rounded-lg">
              <div className="text-5xl font-bold mb-2">
                {Math.round(result.score)}%
              </div>
              <p className="text-muted-foreground">
                {result.pointsEarned} / {result.totalPoints} points
              </p>
              <Badge variant={result.isPassing ? 'default' : 'destructive'} className="mt-2">
                {result.isPassing ? 'Réussi' : 'Non réussi'} (Minimum: {settings.passingScore}%)
              </Badge>
            </div>

            {/* Time spent */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Temps passé: {formatTime(result.timeSpent)}</span>
            </div>

            {/* Question results */}
            {settings.showFeedback !== 'never' && (
              <div className="space-y-3">
                <h3 className="font-semibold">Détails des réponses</h3>
                {result.answers.map((answer, index) => (
                  <div
                    key={answer.questionId}
                    className={cn(
                      'p-4 rounded-lg border',
                      answer.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-1">Question {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {quiz.questions[index].question}
                        </p>
                        {quiz.questions[index].explanation && (
                          <p className="text-sm mt-2 text-muted-foreground italic">
                            {quiz.questions[index].explanation}
                          </p>
                        )}
                      </div>
                      <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                        {answer.pointsEarned} / {quiz.questions[index].points} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              {settings.allowRetry &&
                (!settings.maxAttempts || attemptNumber < settings.maxAttempts) && (
                  <Button onClick={handleRetry} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recommencer
                    {settings.maxAttempts && (
                      <span className="ml-2 text-xs">
                        ({attemptNumber}/{settings.maxAttempts})
                      </span>
                    )}
                  </Button>
                )}
              <Button onClick={handleClose}>Fermer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render quiz view
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{quiz.title}</DialogTitle>
          {quiz.description && (
            <DialogDescription>{quiz.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Progress and timer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </span>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={cn(
                  "font-mono",
                  timeRemaining < 60 && "text-destructive font-bold"
                )}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <Progress value={progressPercentage} />
        </div>

        {/* Question navigation dots */}
        <div className="flex gap-2 flex-wrap">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => handleQuestionJump(index)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                index === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : answers.has(q.id)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current question */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-2 mb-4">
                <Badge variant="outline">{currentQuestion.points} pts</Badge>
                {currentQuestion.difficulty && (
                  <Badge variant={
                    currentQuestion.difficulty === 'easy' ? 'default' :
                      currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {currentQuestion.difficulty === 'easy' ? 'Facile' :
                      currentQuestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              {currentQuestion.media && (
                <div className="mb-4 p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Média: {currentQuestion.media.type}
                  </p>
                </div>
              )}
            </div>

            {renderQuestion(currentQuestion)}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNext}>
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmitQuiz} variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Terminer le quiz
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
