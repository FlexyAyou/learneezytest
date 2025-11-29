import React, { useEffect, useState, useMemo } from 'react';
import normalizeQuestions, { NormalizedQuestion } from '@/utils/normalizeQuestions';
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
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  quizId?: string | number;
  quiz?: any;
  onComplete?: (score: number, passed: boolean) => void;
};

const StudentQuiz: React.FC<Props> = ({ quizId, quiz, onComplete }) => {
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Load quiz data
  useEffect(() => {
    let mounted = true;
    console.log('StudentQuiz init', { quizId, quiz });
    (async () => {
      setLoading(true);
      try {
        if (quiz && quiz.questions) {
          const norm = normalizeQuestions(quiz.questions);
          console.log('StudentQuiz - normalized (from prop)', norm);
          if (mounted) {
            setQuestions(norm);
            // Initialize timer if quiz has timeLimit
            const timeLimit = (quiz.settings?.timeLimit ?? 0) * 60;
            if (timeLimit > 0) setTimeRemaining(timeLimit);
          }
          return;
        }
        if (!quizId) {
          setQuestions([]);
          return;
        }
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const norm = normalizeQuestions(data?.questions ?? data?.items ?? []);
        console.log('StudentQuiz - fetched quiz, normalized', { fetched: data, normalized: norm });
        if (mounted) {
          setQuestions(norm);
          const timeLimit = (data?.settings?.timeLimit ?? 0) * 60;
          if (timeLimit > 0) setTimeRemaining(timeLimit);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [quizId, quiz]);

  // Timer effect
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

  const setQAnswer = (qId: string, value: any) => {
    console.log('StudentQuiz - answer update', { qId, value });
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const toggleOption = (q: NormalizedQuestion, optId: string, single = false) => {
    const cur = answers[q.id] ?? [];
    if (single) {
      setQAnswer(q.id, [optId]);
      return;
    }
    const set = Array.isArray(cur) ? [...cur] : [];
    const idx = set.indexOf(optId);
    if (idx >= 0) set.splice(idx, 1);
    else set.push(optId);
    setQAnswer(q.id, set);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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

  const computeScore = () => {
    let score = 0;
    const totalQuestions = questions.length;

    for (const q of questions) {
      const given = answers[q.id];

      switch (q.type) {
        case 'single-choice':
          if (Array.isArray(given) && given.length === 1 && q.correctAnswers.includes(given[0])) {
            score++;
          }
          break;

        case 'multiple-choice':
          const givenSet = new Set(Array.isArray(given) ? given : []);
          const correctSet = new Set(q.correctAnswers);
          if (givenSet.size === correctSet.size && [...givenSet].every((v) => correctSet.has(v))) {
            score++;
          }
          break;

        case 'true-false':
          if (Array.isArray(given) && given.length === 1 && q.correctAnswers.includes(given[0])) {
            score++;
          }
          break;

        case 'short-answer':
        case 'long-answer':
          // Manual grading - don't auto-score
          break;

        case 'fill-blank': {
          if (!q.cloze) break;
          let correctCount = 0;
          q.cloze.holes.forEach((hole, idx) => {
            const userAnswer = Array.isArray(given) ? (given[idx] ?? '').toString().trim().toLowerCase() : '';
            const correctAnswer = (hole.answer ?? '').toString().trim().toLowerCase();
            if (userAnswer === correctAnswer) correctCount++;
          });
          if (correctCount === q.cloze.holes.length) score++;
          break;
        }

        case 'matching': {
          const userMatches = given as Record<string, string>;
          if (!userMatches || typeof userMatches !== 'object') break;
          let correctMatches = 0;
          const expectedMatches = q.correctAnswers.length; // approximate
          // Simple heuristic: check if all given keys have matching values
          Object.entries(userMatches).forEach(([key, val]) => {
            if (val && val.trim().length > 0) correctMatches++;
          });
          if (correctMatches === expectedMatches) score++;
          break;
        }

        case 'ordering': {
          const userOrder = Array.isArray(given) ? given : [];
          const correctOrder = q.correctOrder || [];
          if (
            userOrder.length === correctOrder.length &&
            userOrder.every((v, i) => v === correctOrder[i])
          ) {
            score++;
          }
          break;
        }

        default:
          break;
      }
    }

    return { score, total: totalQuestions };
  };

  const handleSubmitQuiz = () => {
    console.log('StudentQuiz - submit', { answers });
    const { score, total } = computeScore();
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const passingScore = (quiz?.settings?.passingScore ?? 70);
    const passed = percentage >= passingScore;

    setResult({ score, total, passed });
    setShowResults(true);

    if (onComplete) {
      onComplete(score, passed);
    }
  };

  // Compute detailed question results
  const getDetailedResults = () => {
    const correct: any[] = [];
    const incorrect: any[] = [];

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      switch (q.type) {
        case 'single-choice':
          isCorrect = userAnswer === q.correctAnswers[0];
          break;
        case 'multiple-choice':
          if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswers)) {
            const userSet = new Set(userAnswer.map(String));
            const correctSet = new Set(q.correctAnswers.map(String));
            isCorrect = userSet.size === correctSet.size && [...userSet].every(x => correctSet.has(x));
          }
          break;
        case 'true-false':
          isCorrect = userAnswer === q.correctAnswers[0];
          break;
        case 'short-answer':
          if (userAnswer && q.correctAnswers) {
            const userNorm = String(userAnswer).trim().toLowerCase();
            isCorrect = q.correctAnswers.some(a => String(a).trim().toLowerCase() === userNorm);
          }
          break;
        case 'fill-blank':
          if (Array.isArray(userAnswer) && q.cloze?.holes) {
            let allCorrect = true;
            for (let i = 0; i < q.cloze.holes.length; i++) {
              const userAns = (userAnswer[i] || '').trim().toLowerCase();
              const correctAns = (q.cloze.holes[i]?.answer || '').trim().toLowerCase();
              if (userAns !== correctAns) allCorrect = false;
            }
            isCorrect = allCorrect;
          }
          break;
        case 'ordering':
          if (Array.isArray(userAnswer) && Array.isArray(q.correctOrder)) {
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correctOrder);
          }
          break;
      }

      if (isCorrect) {
        correct.push(q);
      } else {
        incorrect.push(q);
      }
    });

    return { correct, incorrect };
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    if (quiz?.settings?.timeLimit) {
      setTimeRemaining((quiz.settings.timeLimit) * 60);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement du quiz...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-8">Aucune question trouvée.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Results view
  if (showResults && result) {
    const percentage = result.total > 0 ? (result.score / result.total) * 100 : 0;
    const { correct, incorrect } = getDetailedResults();

    return (
      <div className="space-y-6">
        <Card
          className={`border-2 ${
            result.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}
        >
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
              Score : {result.score} / {result.total} ({percentage.toFixed(1)}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Réussies</p>
                <p className="text-2xl font-bold text-green-600">{correct.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Échouées</p>
                <p className="text-2xl font-bold text-red-600">{incorrect.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Taux de réussite</p>
                <p className="text-2xl font-bold text-blue-600">{correct.length > 0 ? Math.round((correct.length / questions.length) * 100) : 0}%</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              {/* Correct Answers */}
              {correct.length > 0 && (
                <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-700">Questions réussies ({correct.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {correct.map((q) => (
                      <div key={q.id} className="p-3 bg-green-50 rounded border-l-4 border-green-600">
                        <p className="text-sm font-medium text-gray-800">{q.stem}</p>
                        {q.raw?.explanation && (
                          <p className="text-xs text-gray-600 mt-2 italic">📝 {q.raw.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incorrect Answers */}
              {incorrect.length > 0 && (
                <div className="bg-white border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-700">Questions non réussies ({incorrect.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {incorrect.map((q) => {
                      const userAnswer = answers[q.id];
                      let displayAnswer = '';
                      
                      if (Array.isArray(userAnswer)) {
                        displayAnswer = userAnswer.join(', ');
                      } else if (typeof userAnswer === 'boolean') {
                        displayAnswer = userAnswer ? 'Vrai' : 'Faux';
                      } else {
                        displayAnswer = String(userAnswer || 'Non répondu');
                      }

                      let correctDisplay = '';
                      if (q.type === 'fill-blank' && q.cloze?.holes) {
                        correctDisplay = q.cloze.holes.map(h => h.answer).join(', ');
                      } else if (Array.isArray(q.correctAnswers)) {
                        correctDisplay = q.correctAnswers.join(', ');
                      } else {
                        correctDisplay = String(q.correctAnswers?.[0] || 'N/A');
                      }

                      return (
                        <div key={q.id} className="p-3 bg-red-50 rounded border-l-4 border-red-600">
                          <p className="text-sm font-medium text-gray-800">{q.stem}</p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p><span className="font-medium text-red-600">Votre réponse:</span> {displayAnswer}</p>
                            <p><span className="font-medium text-green-600">Bonne réponse:</span> {correctDisplay}</p>
                          </div>
                          {q.raw?.explanation && (
                            <p className="text-xs text-gray-600 mt-2 italic">📝 {q.raw.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <Button onClick={handleRetry} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Recommencer le quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz question view
  return (
    <div className="space-y-6">
      {/* Header with timer and progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{quiz?.title || 'Quiz'}</h2>
              <p className="text-sm text-gray-600 mt-1">{quiz?.description || ''}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span
                  className={`font-mono text-lg font-semibold ${
                    timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
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

          {/* Question navigation dots */}
          <div className="flex flex-wrap gap-2 mt-4">
            {questions.map((_, idx) => (
              <button
                key={`nav-${questions[idx]?.id ?? idx}`}
                onClick={() => handleQuestionJump(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[questions[idx]?.id]
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

      {/* Current question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription className="text-base mt-2">{currentQuestion.stem}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderQuestion(currentQuestion, answers, setQAnswer, toggleOption)}</CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
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

/**
 * Render function for each question type (8 types supported)
 */
function renderQuestion(
  q: NormalizedQuestion,
  answers: Record<string, any>,
  setQAnswer: (qId: string, value: any) => void,
  toggleOption: (q: NormalizedQuestion, optId: string, single?: boolean) => void
) {
  const userAnswer = answers[q.id];

  switch (q.type) {
    case 'single-choice': {
      const selectedId = Array.isArray(userAnswer) && userAnswer.length > 0 ? userAnswer[0] : '';
      return (
        <RadioGroup value={selectedId || ''} onValueChange={(val) => toggleOption(q, val, true)}>
          <div className="space-y-3">
            {(q.options || []).map((opt) => (
              <div
                key={`${q.id}-${opt.id}`}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                <Label htmlFor={`${q.id}-${opt.id}`} className="flex-1 cursor-pointer">
                  {opt.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }

    case 'multiple-choice': {
      const selectedIds = Array.isArray(userAnswer) ? userAnswer : [];
      return (
        <div className="space-y-3">
          {(q.options || []).map((opt) => (
            <div
              key={`${q.id}-${opt.id}`}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
              onClick={() => toggleOption(q, opt.id, false)}
            >
              <Checkbox
                id={`${q.id}-${opt.id}`}
                checked={selectedIds.includes(opt.id)}
              />
              <Label htmlFor={`${q.id}-${opt.id}`} className="flex-1 cursor-pointer">
                {opt.text}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    case 'true-false': {
      const selectedId = Array.isArray(userAnswer) && userAnswer.length > 0 ? userAnswer[0] : '';
      return (
        <RadioGroup value={selectedId || ''} onValueChange={(val) => toggleOption(q, val, true)}>
          <div className="space-y-3">
            {(q.options || []).map((opt) => (
              <div
                key={`${q.id}-${opt.id}`}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                <Label htmlFor={`${q.id}-${opt.id}`} className="flex-1 cursor-pointer">
                  {opt.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }

    case 'short-answer':
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Votre réponse (texte court):</p>
          <Input
            value={userAnswer || ''}
            onChange={(e) => setQAnswer(q.id, e.target.value)}
            placeholder="Entrez votre réponse courte (50-100 caractères)..."
            className="w-full h-12 text-base"
          />
          <p className="text-xs text-gray-500">{(userAnswer || '').length} caractères</p>
        </div>
      );

    case 'long-answer':
      return (
        <Textarea
          value={userAnswer || ''}
          onChange={(e) => setQAnswer(q.id, e.target.value)}
          placeholder="Entrez votre réponse développée..."
          className="w-full min-h-[200px]"
        />
      );

    case 'fill-blank': {
      // Handle missing cloze data - fallback to create simple input fields
      if (!q.cloze || (q.cloze.holes && q.cloze.holes.length === 0)) {
        console.warn('Fill-blank question with missing/empty cloze data:', { qId: q.id, qType: q.type, hasOptions: (q.options && q.options.length > 0) });
        
        // Fallback: Use correctAnswers as the number of blanks
        const numBlanks = q.correctAnswers && q.correctAnswers.length > 0 ? q.correctAnswers.length : 1;
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];

        return (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-gray-600 mb-3">
                {q.stem && q.stem.includes('Texte à trous') ? 'Complétez le texte en remplissant les blancs :' : 'Répondez aux questions suivantes :'}
              </p>
              <p className="text-base text-gray-800 font-medium mb-4">{q.stem || 'Question'}</p>
              
              <div className="space-y-4">
                {Array.from({ length: numBlanks }).map((_, idx) => (
                  <div key={`fallback-blank-${q.id}-${idx}`} className="space-y-2">
                    <Label>Réponse {idx + 1}</Label>
                    <Input
                      value={userAnswers[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = [...userAnswers];
                        newAnswers[idx] = e.target.value;
                        setQAnswer(q.id, newAnswers);
                      }}
                      placeholder={`Entrez votre réponse ${idx + 1}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];

      return (
        <div className="space-y-6">
          {/* Display text with inline inputs for blanks */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-3">Complétez le texte en remplissant les blancs :</p>
            <div className="text-base leading-relaxed text-gray-800">
              {q.cloze.textParts.map((part, idx) => (
                <span key={`text-${idx}`}>
                  <span>{part}</span>
                  {q.cloze && q.cloze.holes && q.cloze.holes[idx] && (
                    <Input
                      key={`blank-${q.id}-${idx}`}
                      value={userAnswers[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = [...userAnswers];
                        newAnswers[idx] = e.target.value;
                        setQAnswer(q.id, newAnswers);
                      }}
                      placeholder={`_____`}
                      className="inline-block w-24 h-8 mx-1 text-center border-b-2 border-blue-400 focus:border-blue-600"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Summary of blanks filled */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Résumé des réponses ({userAnswers.filter(a => a && a.trim().length > 0).length}/{q.cloze.holes.length}) :</p>
            <div className="space-y-1">
              {q.cloze.holes.map((hole, idx) => (
                <div key={`summary-${idx}`} className="text-sm text-gray-600">
                  <span className="font-medium">Trou {idx + 1}:</span> {userAnswers[idx] ? `"${userAnswers[idx]}"` : '<vide>'}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'matching': {
      const matches = (userAnswer as Record<string, string>) || {};
      const leftItems = q.options || [];

      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Associez les éléments :</p>
          {leftItems.map((left) => (
            <div key={`${q.id}-${left.id}`} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 font-medium">{left.text}</div>
              <div className="text-gray-400">→</div>
              <Input
                placeholder="Associer à..."
                value={matches[left.id] || ''}
                onChange={(e) => {
                  setQAnswer(q.id, { ...matches, [left.id]: e.target.value });
                }}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      );
    }

    case 'ordering': {
      const userOrder = Array.isArray(userAnswer) ? userAnswer : [];
      const items = q.options || [];

      return (
        <OrderingQuestionRenderer
          questionId={q.id}
          items={items}
          userOrder={userOrder}
          onOrderChange={(newOrder) => setQAnswer(q.id, newOrder)}
        />
      );
    }

    default:
      return <p>Type de question non supporté: {q.type}</p>;
  }
}

/**
 * Drag-and-drop sortable item for ordering questions
 */
function SortableOrderItem({
  id,
  item,
  index,
}: {
  id: string;
  item: any;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-move transition-all ${
        isDragging
          ? 'bg-blue-100 border-blue-400 shadow-lg'
          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <span className="font-bold text-gray-600 min-w-8">{index + 1}.</span>
      <span className="flex-1 text-gray-800">{item.text}</span>
    </div>
  );
}

/**
 * Ordering question renderer with drag-and-drop
 */
function OrderingQuestionRenderer({
  questionId,
  items,
  userOrder,
  onOrderChange,
}: {
  questionId: string;
  items: any[];
  userOrder: string[];
  onOrderChange: (newOrder: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // If no user order yet, initialize with item IDs in original order
  const orderedIds = userOrder.length === items.length ? userOrder : items.map((i) => i.id);
  const orderedItems = orderedIds.map((id) => items.find((i) => i.id === id)).filter(Boolean);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedIds.indexOf(active.id);
      const newIndex = orderedIds.indexOf(over.id);
      const newOrder = arrayMove(orderedIds, oldIndex, newIndex);
      onOrderChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Déplacez les éléments pour les mettre dans le bon ordre. Vous pouvez utiliser la souris ou le clavier.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {orderedItems.map((item, idx) => (
              <SortableOrderItem
                key={`${questionId}-item-${item.id}`}
                id={item.id}
                item={item}
                index={idx}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Preview */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
        <p className="text-xs font-medium text-gray-600 mb-2">Ordre actuel :</p>
        <div className="text-sm text-gray-700">
          {orderedItems.map((item, idx) => (
            <div key={`preview-${item.id}`}>
              {idx + 1}. {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentQuiz;
