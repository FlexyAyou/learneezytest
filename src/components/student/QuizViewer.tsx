import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { QuizConfig, Question, UserAnswer } from '@/types/quiz';
import MediaPreview from '@/components/quiz/MediaPreview';

interface QuizViewerProps {
  quiz: QuizConfig;
  onComplete?: (score: number, passed: boolean, answers: UserAnswer[]) => void;
}

// Normaliser les questions pour s'assurer qu'elles ont toutes un id unique et les champs corrects
const normalizeQuestions = (questions: Question[]): Question[] => {
  return questions.map((q, idx) => {
    // Générer un id unique si manquant
    const id = q.id || `question-${idx}-${Date.now()}`;
    
    // Mapper les champs backend en camelCase
    const normalized: any = {
      ...q,
      id,
    };

    // Pour chaque type, s'assurer que les champs sont corrects
    if (q.type === 'single-choice') {
      normalized.correctAnswer = (q as any).correctAnswer ?? (q as any).correct_answer ?? 0;
    } else if (q.type === 'multiple-choice') {
      const raw = (q as any).correctAnswers ?? (q as any).correct_answers ?? [];
      normalized.correctAnswers = Array.isArray(raw) ? raw : [];
    } else if (q.type === 'true-false') {
      const rawAnswer = (q as any).correctAnswer ?? (q as any).correct_answer;
      normalized.correctAnswer = typeof rawAnswer === 'boolean' ? rawAnswer : rawAnswer === 'true' || rawAnswer === 'Vrai';
    } else if (q.type === 'short-answer' || q.type === 'fill-blank') {
      const raw = (q as any).correctAnswers ?? (q as any).correct_answers ?? [];
      normalized.correctAnswers = Array.isArray(raw) ? raw.map(String) : [];
    } else if (q.type === 'long-answer') {
      normalized.minWords = (q as any).minWords ?? (q as any).min_words;
      normalized.maxWords = (q as any).maxWords ?? (q as any).max_words;
      normalized.rubric = (q as any).rubric ?? [];
    } else if (q.type === 'matching') {
      normalized.leftItems = (q as any).leftItems ?? (q as any).left_items ?? [];
      normalized.rightItems = (q as any).rightItems ?? (q as any).right_items ?? [];
      const rawMatches = (q as any).correctMatches ?? (q as any).correct_matches ?? {};
      normalized.correctMatches = rawMatches;
    } else if (q.type === 'ordering') {
      // Older data or some payloads may use `options` instead of `items`
      normalized.items = (q as any).items ?? (q as any).options ?? [];
      const rawOrder = (q as any).correctOrder ?? (q as any).correct_order ?? [];
      normalized.correctOrder = Array.isArray(rawOrder) ? rawOrder : [];
    }

    return normalized as Question;
  });
};

export const QuizViewer: React.FC<QuizViewerProps> = ({ quiz, onComplete }) => {
  // Normaliser les questions au chargement
  const normalizedQuestions = useMemo(() => normalizeQuestions(quiz.questions), [quiz.questions]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{ score: number; totalPoints: number; passed: boolean } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.settings?.timeLimit ? quiz.settings.timeLimit * 60 : null
  );
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [startTime, setStartTime] = useState(Date.now());

  const currentQuestion = normalizedQuestions[currentQuestionIndex];
  const totalQuestions = normalizedQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Reset state when quiz changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    setTimeRemaining(quiz.settings?.timeLimit ? quiz.settings.timeLimit * 60 : null);
    setAttemptNumber(1);
    setStartTime(Date.now());
  }, [quiz.id]);

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = (question: Question, userAnswer: any): number => {
    if (!userAnswer && userAnswer !== 0 && userAnswer !== false) return 0;

    switch (question.type) {
      case 'single-choice': {
        const correctIdx = (question as any).correctAnswer;
        return userAnswer === correctIdx ? question.points : 0;
      }

      case 'multiple-choice': {
        if (!Array.isArray(userAnswer)) return 0;
        const correctAnswers = (question as any).correctAnswers || [];
        const correctSet = new Set(correctAnswers.map((v: any) => Number(v)));
        const userSet = new Set(userAnswer.map((v: any) => Number(v)));
        if (correctSet.size !== userSet.size) return 0;
        for (const ans of userSet) {
          if (!correctSet.has(ans)) return 0;
        }
        return question.points;
      }

      case 'true-false': {
        const correctAnswer = (question as any).correctAnswer;
        return userAnswer === correctAnswer ? question.points : 0;
      }

      case 'short-answer':
      case 'long-answer':
        return 0; // Manual grading required

      case 'fill-blank': {
        if (!Array.isArray(userAnswer)) return 0;
        const correctAnswers = (question as any).correctAnswers || [];
        if (correctAnswers.length === 0) return 0;

        let correctCount = 0;
        correctAnswers.forEach((correctAns: any, index: number) => {
          const userVal = (userAnswer[index] || '').trim().toLowerCase();
          const correctVal = String(correctAns).trim().toLowerCase();
          if (userVal === correctVal) correctCount++;
        });

        return (correctCount / correctAnswers.length) * question.points;
      }

      case 'matching': {
        if (!userAnswer || typeof userAnswer !== 'object') return 0;
        const correctMatches = (question as any).correctMatches || {};
        const userMatches = userAnswer as Record<string, string>;
        let correctCount = 0;
        let totalMatches = 0;
        
        Object.keys(correctMatches).forEach(key => {
          totalMatches++;
          if (userMatches[key] === correctMatches[key]) {
            correctCount++;
          }
        });
        
        return totalMatches > 0 ? (correctCount / totalMatches) * question.points : 0;
      }

      case 'ordering': {
        if (!Array.isArray(userAnswer)) return 0;
        const correctOrder = (question as any).correctOrder || [];
        if (userAnswer.length !== correctOrder.length) return 0;
        const isCorrect = userAnswer.every((item, idx) => item === correctOrder[idx]);
        return isCorrect ? question.points : 0;
      }

      default:
        return 0;
    }
  };

  const getCorrectAnswers = (question: any): string[] => {
    if (!question) return [];
    const raw = (question as any).correctAnswers ?? (question as any).correct_answers;
    if (!raw) return [];
    return Array.isArray(raw) ? raw.map((v) => String(v)) : [];
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    const totalPoints = normalizedQuestions.reduce((sum, q) => sum + q.points, 0);
    const userAnswers: UserAnswer[] = [];

    normalizedQuestions.forEach((question) => {
      const userAnswer = answers[question.id];
      const earnedPoints = checkAnswer(question, userAnswer);
      totalScore += earnedPoints;

      userAnswers.push({
        questionId: question.id,
        answer: userAnswer,
        isCorrect: earnedPoints === question.points,
        pointsEarned: earnedPoints,
        submittedAt: new Date(),
      });
    });

    const percentage = (totalScore / totalPoints) * 100;
    const passed = percentage >= (quiz.settings?.passingScore || 70);

    setResult({ score: totalScore, totalPoints, passed });
    setShowResults(true);

    if (onComplete) {
      onComplete(totalScore, passed, userAnswers);
    }
  };

  const handleRetry = () => {
    if (quiz.settings?.maxAttempts && attemptNumber >= quiz.settings.maxAttempts) {
      return;
    }

    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    setTimeRemaining(quiz.settings?.timeLimit ? quiz.settings.timeLimit * 60 : null);
    setAttemptNumber((prev) => prev + 1);
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'single-choice':
        {
          const selectedIndex =
            typeof userAnswer === 'number' || typeof userAnswer === 'string'
              ? Number(userAnswer)
              : -1;
          return (
            <RadioGroup
              value={selectedIndex >= 0 ? String(selectedIndex) : ''}
              onValueChange={(val) => handleAnswerChange(question.id, Number(val))}
            >
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value={String(idx)} id={`${question.id}-${idx}`} />
                    <Label htmlFor={`${question.id}-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          );
        }

      case 'multiple-choice': {
        const raw = Array.isArray(userAnswer) ? userAnswer : [];
        const selectedIndices = raw.map((v) => Number(v));
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={`${question.id}-${idx}`}
                  checked={selectedIndices.includes(idx)}
                  onCheckedChange={(checked) => {
                    const current = selectedIndices;
                    const newSelected = checked
                      ? [...current, idx]
                      : current.filter((i) => i !== idx);
                    handleAnswerChange(question.id, newSelected);
                  }}
                />
                <Label htmlFor={`${question.id}-${idx}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      }

      case 'true-false': {
        const tfValue = userAnswer === true ? 'true' : userAnswer === false ? 'false' : '';
        return (
          <RadioGroup value={tfValue} onValueChange={(val) => handleAnswerChange(question.id, val === 'true')}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="true" id={`${question.id}-true`} />
                <Label htmlFor={`${question.id}-true`} className="flex-1 cursor-pointer">
                  Vrai
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="false" id={`${question.id}-false`} />
                <Label htmlFor={`${question.id}-false`} className="flex-1 cursor-pointer">
                  Faux
                </Label>
              </div>
            </div>
          </RadioGroup>
        );
      }

      case 'short-answer':
        return (
          <Input
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Entrez votre réponse..."
            className="w-full"
          />
        );

      case 'long-answer':
        return (
          <Textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Entrez votre réponse détaillée..."
            className="w-full min-h-[150px]"
          />
        );

      case 'fill-blank': {
        const correctAnswers = (question as any).correctAnswers || [];
        const text = (question as any).text || '';
        const blanksInText = (text.match(/\[blank\]/g) || []).length;
        const blankCount = blanksInText || correctAnswers.length || 1;

        const blanksAnswers = Array.isArray(userAnswer)
          ? userAnswer
          : Array(blankCount).fill('');

        // Options disponibles pour choisir (basées sur les réponses correctes mélangées avec des distracteurs)
        const allOptions = [...correctAnswers];
        
        return (
          <div className="space-y-4">
            {/* Afficher le texte avec les blancs */}
            <div
              className="text-sm text-gray-700 mb-4 p-4 bg-gray-50 rounded-lg"
              dangerouslySetInnerHTML={{
                __html:
                  text.replace(
                    /\[blank\]/g,
                    '<span class="inline-block w-32 border-b-2 border-blue-500 mx-1">_____</span>'
                  ) || '',
              }}
            />
            
            {/* Options cliquables */}
            {allOptions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Options disponibles (cliquez pour ajouter) :</p>
                <div className="flex flex-wrap gap-2">
                  {allOptions.map((option, optIdx) => (
                    <Button
                      key={optIdx}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // Trouver le premier trou vide ou remplacer le dernier
                        const newAnswers = [...blanksAnswers];
                        const emptyIndex = newAnswers.findIndex(a => !a);
                        if (emptyIndex !== -1) {
                          newAnswers[emptyIndex] = String(option);
                        } else if (newAnswers.length > 0) {
                          newAnswers[newAnswers.length - 1] = String(option);
                        }
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Champs de saisie pour chaque trou */}
            <p className="text-xs text-gray-500 mb-2">
              Remplissez les trous dans l'ordre (vous pouvez aussi saisir directement) :
            </p>
            {Array.from({ length: blankCount }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Label>Trou {idx + 1}</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={blanksAnswers[idx] || ''}
                    onChange={(e) => {
                      const newAnswers = [...blanksAnswers];
                      newAnswers[idx] = e.target.value;
                      handleAnswerChange(question.id, newAnswers);
                    }}
                    placeholder={`Réponse pour le trou ${idx + 1}`}
                  />
                  {blanksAnswers[idx] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newAnswers = [...blanksAnswers];
                        newAnswers[idx] = '';
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'matching':
        const matchingQ = question as any;
        const matchingAnswers = (userAnswer as Record<string, string>) || {};
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Associez les éléments de gauche avec ceux de droite :</p>
            {(matchingQ.leftItems || []).map((leftItem: string, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1 font-medium">{leftItem}</div>
                <div className="text-gray-400">→</div>
                <Select
                  value={matchingAnswers[leftItem] || ''}
                  onValueChange={(value) => {
                    handleAnswerChange(question.id, { ...matchingAnswers, [leftItem]: value });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir une réponse" />
                  </SelectTrigger>
                  <SelectContent>
                    {(matchingQ.rightItems || []).map((rightItem: string, ridx: number) => (
                      <SelectItem key={ridx} value={rightItem}>
                        {rightItem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case 'ordering':
        const orderingQ = question as any;
        const orderingAnswers = Array.isArray(userAnswer) ? userAnswer : [...(orderingQ.items || [])];
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Réorganisez les éléments dans le bon ordre (du premier au dernier) :</p>
            <div className="space-y-2">
              {orderingAnswers.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                  <span className="font-bold text-gray-500">{idx + 1}.</span>
                  <span className="flex-1">{item}</span>
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newOrder = [...orderingAnswers];
                          [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
                          handleAnswerChange(question.id, newOrder);
                        }}
                      >
                        ↑
                      </Button>
                    )}
                    {idx < orderingAnswers.length - 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newOrder = [...orderingAnswers];
                          [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                          handleAnswerChange(question.id, newOrder);
                        }}
                      >
                        ↓
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>Type de question non supporté</p>;
    }
  };

  if (showResults && result) {
    const percentage = (result.score / result.totalPoints) * 100;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    return (
      <div className="space-y-6">
        <Card className={`border-2 ${result.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {result.passed ? (
                <Trophy className="w-16 h-16 text-green-600" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {result.passed ? '🎉 Félicitations !' : '😔 Pas encore réussi'}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Score : {result.score} / {result.totalPoints} ({percentage.toFixed(1)}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Temps passé</p>
                <p className="text-xl font-bold">{formatTime(timeSpent)}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Tentative</p>
                <p className="text-xl font-bold">{attemptNumber} / {quiz.settings?.maxAttempts || '∞'}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <Button onClick={handleRetry} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Recommencer le quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Détail des réponses */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des réponses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {normalizedQuestions.map((question, idx) => {
              const userAnswer = answers[question.id];
              const earnedPoints = checkAnswer(question, userAnswer);
              const isCorrect = earnedPoints === question.points;

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      Question {idx + 1}
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </h4>
                    <Badge variant={isCorrect ? 'default' : 'destructive'}>
                      {earnedPoints} / {question.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                  
                  {question.type === 'single-choice' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">
                        Votre réponse:{' '}
                        <span className="font-medium">
                          {(() => {
                            if (userAnswer === null || userAnswer === undefined) return 'Aucune réponse';
                            const idx = Number(userAnswer);
                            return question.options[idx] ?? 'Aucune réponse';
                          })()}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600">
                          Bonne réponse:{' '}
                          <span className="font-medium">
                            {question.options[Number((question as any).correctAnswer)]}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                  
                  {question.type === 'multiple-choice' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">
                        Vos réponses:{' '}
                        <span className="font-medium">
                          {(() => {
                            if (!Array.isArray(userAnswer) || userAnswer.length === 0)
                              return 'Aucune réponse';
                            const indices = userAnswer.map((v: any) => Number(v));
                            const labels = indices
                              .map((i) => question.options[i])
                              .filter((v) => v !== undefined);
                            return labels.length ? labels.join(', ') : 'Aucune réponse';
                          })()}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600">
                          Bonnes réponses:{' '}
                          <span className="font-medium">
                            {(() => {
                              const correctAnswers = (question as any).correctAnswers || [];
                              const indices = correctAnswers.map((v: any) => Number(v));
                              const labels = indices
                                .map((i) => question.options[i])
                                .filter((v) => v !== undefined);
                              return labels.join(', ');
                            })()}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">Votre réponse: <span className="font-medium">{userAnswer === true ? 'Vrai' : userAnswer === false ? 'Faux' : 'Aucune réponse'}</span></p>
                      {!isCorrect && (
                        <p className="text-green-600">Bonne réponse: <span className="font-medium">{(question as any).correctAnswer ? 'Vrai' : 'Faux'}</span></p>
                      )}
                    </div>
                  )}
                  
                  {question.type === 'short-answer' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">Votre réponse: <span className="font-medium">{userAnswer || 'Aucune réponse'}</span></p>
                      <p className="text-green-600">Réponses acceptées: <span className="font-medium">{((question as any).correctAnswers || []).join(', ')}</span></p>
                    </div>
                  )}

                  {question.type === 'long-answer' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">Votre réponse: <span className="font-medium whitespace-pre-wrap">{userAnswer || 'Aucune réponse'}</span></p>
                      <p className="text-orange-600 mt-2">⚠️ Cette question nécessite une correction manuelle</p>
                      {(question as any).minWords && (
                        <p className="text-gray-500 text-xs mt-1">Minimum de mots requis: {(question as any).minWords}</p>
                      )}
                    </div>
                  )}

                  {question.type === 'fill-blank' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600 mb-2">Vos réponses:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {Array.isArray(userAnswer) ? userAnswer.map((ans: string, idx: number) => (
                          <li key={idx}>Trou {idx + 1}: <span className="font-medium">{ans || '(vide)'}</span></li>
                        )) : <li>(Aucune réponse)</li>}
                      </ul>
                      {!isCorrect && (
                        <div className="mt-2">
                          <p className="text-green-600">Bonnes réponses:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2 text-green-600">
                            {((question as any).correctAnswers || []).map((ans: string, idx: number) => (
                              <li key={idx}>Trou {idx + 1}: <span className="font-medium">{ans}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === 'matching' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600 mb-2">Vos associations:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {userAnswer && typeof userAnswer === 'object' ? 
                          Object.entries(userAnswer as Record<string, string>).map(([left, right], idx) => (
                            <li key={idx}>{left} → <span className="font-medium">{right}</span></li>
                          )) : <li>(Aucune réponse)</li>
                        }
                      </ul>
                      {!isCorrect && (question as any).correctMatches && (
                        <div className="mt-2">
                          <p className="text-green-600">Bonnes associations:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2 text-green-600">
                            {Object.entries((question as any).correctMatches as Record<string, string>).map(([left, right], idx) => (
                              <li key={idx}>{left} → <span className="font-medium">{right}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === 'ordering' && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-600 mb-2">Votre ordre:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        {Array.isArray(userAnswer) ? userAnswer.map((item: string, idx: number) => (
                          <li key={idx}><span className="font-medium">{item}</span></li>
                        )) : <li>(Aucune réponse)</li>}
                      </ol>
                      {!isCorrect && (question as any).correctOrder && (
                        <div className="mt-2">
                          <p className="text-green-600">Bon ordre:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2 text-green-600">
                            {((question as any).correctOrder as string[]).map((item: string, idx: number) => (
                              <li key={idx}><span className="font-medium">{item}</span></li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec timer et progression */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className={`font-mono text-lg font-semibold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Navigation par points */}
          <div className="flex flex-wrap gap-2 mt-4">
            {normalizedQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleQuestionJump(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question actuelle */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription className="text-base mt-2">{currentQuestion.question}</CardDescription>
            </div>
            <Badge variant="secondary">{currentQuestion.points} pts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentQuestion.media && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3 font-medium">Média associé à la question :</p>
              <MediaPreview
                mediaType={currentQuestion.media.type}
                mediaKey={currentQuestion.media.key}
                mediaUrl={currentQuestion.media.url}
              />
            </div>
          )}
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
            Terminer le quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
