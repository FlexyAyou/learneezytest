import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const TakeEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes en secondes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Données d'exemple pour l'évaluation
  const evaluation = {
    id: '2',
    courseTitle: 'Mathématiques CE2',
    type: 'exam',
    title: 'Examen Module 2 - Géométrie',
    description: 'Évaluation approfondie des concepts géométriques',
    timeLimit: 30,
    questions: [
      {
        id: 1,
        question: "Combien de côtés a un triangle ?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1, // index de la bonne réponse
        points: 4
      },
      {
        id: 2,
        question: "Quelle est la forme d'un carré ?",
        options: ["3 côtés égaux", "4 côtés égaux", "5 côtés égaux", "6 côtés égaux"],
        correctAnswer: 1,
        points: 4
      },
      {
        id: 3,
        question: "Combien d'angles a un rectangle ?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        points: 4
      },
      // ... plus de questions pour arriver à 25 questions
    ]
  };

  // Timer
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answerIndex: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    let maxScore = 0;
    
    evaluation.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer && parseInt(userAnswer) === question.correctAnswer) {
        score += question.points;
      }
    });
    
    return { score, maxScore, percentage: Math.round((score / maxScore) * 100) };
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (evaluation.timeLimit * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults) {
    const results = calculateScore();
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Évaluation terminée !</CardTitle>
            <CardDescription>Voici vos résultats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {results.score}/{results.maxScore}
              </p>
              <p className="text-xl text-gray-600">{results.percentage}%</p>
              <Progress value={results.percentage} className="w-full max-w-md mx-auto mt-4" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Questions répondues</p>
                <p className="text-lg font-semibold">{Object.keys(answers).length}/{evaluation.questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps utilisé</p>
                <p className="text-lg font-semibold">{formatTime((evaluation.timeLimit * 60) - timeRemaining)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <Badge className={results.percentage >= 80 ? "bg-green-100 text-green-800" : results.percentage >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                  {results.percentage >= 80 ? "Excellent" : results.percentage >= 60 ? "Bien" : "À améliorer"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/apprenant/evaluations')}
              >
                Retour aux évaluations
              </Button>
              <Button onClick={() => navigate(`/dashboard/apprenant/evaluations/${id}/results`)}>
                Voir les résultats détaillés
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header avec timer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{evaluation.title}</CardTitle>
              <CardDescription>{evaluation.courseTitle}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Temps restant</p>
              <p className={`text-2xl font-bold ${getTimeColor()}`}>
                <Clock className="w-5 h-5 inline mr-2" />
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestion + 1} sur {evaluation.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / evaluation.questions.length) * 100)}%</span>
            </div>
            <Progress value={((currentQuestion + 1) / evaluation.questions.length) * 100} />
          </div>
        </CardHeader>
      </Card>

      {/* Question actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestion + 1}
            <Badge variant="outline" className="ml-2">
              {evaluation.questions[currentQuestion].points} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{evaluation.questions[currentQuestion].question}</p>
          
          <RadioGroup
            value={answers[evaluation.questions[currentQuestion].id] || ""}
            onValueChange={(value) => handleAnswerChange(evaluation.questions[currentQuestion].id, value)}
          >
            {evaluation.questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
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
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        <div className="flex gap-2">
          {evaluation.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestion
                  ? 'bg-primary text-white'
                  : answers[evaluation.questions[index].id]
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === evaluation.questions.length - 1 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                Terminer l'évaluation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Terminer l'évaluation</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir terminer cette évaluation ? 
                  Vous avez répondu à {Object.keys(answers).length} question(s) sur {evaluation.questions.length}.
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
        ) : (
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(evaluation.questions.length - 1, prev + 1))}
          >
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TakeEvaluation;