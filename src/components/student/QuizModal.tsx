import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string | number;
  points?: number;
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
  onComplete?: (score: number, passed: boolean) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ open, onOpenChange, quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    if (open && quiz) {
      // Reset state when quiz opens
      setCurrentQuestion(0);
      setAnswers({});
      setTimeRemaining(30 * 60);
      setIsSubmitted(false);
      setShowResults(false);
      setShowSubmitDialog(false);
    }
  }, [open, quiz]);

  // Timer
  useEffect(() => {
    if (open && timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted, open]);

  if (!quiz) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
    setShowSubmitDialog(false);
    
    const results = calculateScore();
    const passed = results.percentage >= 50; // 50% passing score
    
    if (onComplete) {
      onComplete(results.percentage, passed);
    }
  };

  const calculateScore = () => {
    let score = 0;
    let maxScore = 0;
    
    quiz.questions.forEach(question => {
      const points = question.points || 1;
      maxScore += points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        // Handle different answer formats
        const correctAnswer = question.correct_answer;
        let isCorrect = false;
        
        if (typeof correctAnswer === 'number') {
          // Single choice - correctAnswer is index
          isCorrect = parseInt(userAnswer) === correctAnswer;
        } else {
          // String comparison
          isCorrect = userAnswer === correctAnswer;
        }
        
        if (isCorrect) {
          score += points;
        }
      }
    });
    
    return { 
      score, 
      maxScore, 
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0 
    };
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (30 * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentQ = quiz.questions[currentQuestion];

  if (showResults) {
    const results = calculateScore();
    const passed = results.percentage >= 50;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              Quiz terminé !
            </DialogTitle>
            <DialogDescription className="text-center">
              {passed ? 'Félicitations ! Vous avez réussi ce quiz.' : 'Vous devez obtenir au moins 50% pour réussir.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {results.score}/{results.maxScore}
              </p>
              <p className="text-xl text-muted-foreground">{results.percentage}%</p>
              <Progress value={results.percentage} className="w-full max-w-md mx-auto mt-4" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Questions répondues</p>
                <p className="text-lg font-semibold">{Object.keys(answers).length}/{quiz.questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps utilisé</p>
                <p className="text-lg font-semibold">{formatTime((30 * 60) - timeRemaining)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Résultat</p>
                <Badge className={passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {passed ? "Réussi" : "Échoué"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
              {!passed && (
                <Button variant="outline" onClick={() => {
                  setShowResults(false);
                  setIsSubmitted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setTimeRemaining(30 * 60);
                }}>
                  Réessayer
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{quiz.title}</DialogTitle>
                <DialogDescription>
                  Question {currentQuestion + 1} sur {quiz.questions.length}
                </DialogDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Temps restant</p>
                <p className={`text-2xl font-bold ${getTimeColor()}`}>
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} />
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                  {currentQ.points && (
                    <Badge variant="outline" className="ml-2">
                      {currentQ.points} point{currentQ.points > 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{currentQ.question}</p>
                
                <RadioGroup
                  value={answers[currentQ.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="flex gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-primary text-primary-foreground'
                        : answers[quiz.questions[index].id] !== undefined
                        ? 'bg-green-100 text-green-800'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)}>
                  Terminer le quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminer le quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir terminer ce quiz ? 
              Vous avez répondu à {Object.keys(answers).length} question(s) sur {quiz.questions.length}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Terminer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuizModal;