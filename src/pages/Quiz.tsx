
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Quiz = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(null);

  const quizData = {
    id: 1,
    title: "Quiz React - Composants et Props",
    description: "Testez vos connaissances sur les composants React et les props",
    course: "Maîtrise complète de React.js",
    duration: 30,
    totalQuestions: 5,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Qu'est-ce qu'un composant React ?",
        options: [
          "Une fonction JavaScript qui retourne du JSX",
          "Un fichier CSS pour styliser les éléments",
          "Une base de données pour stocker les données",
          "Un serveur web pour héberger l'application"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Comment passe-t-on des données à un composant enfant ?",
        options: [
          "En utilisant des cookies",
          "En utilisant les props",
          "En utilisant localStorage",
          "En utilisant une API"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Quelle est la syntaxe correcte pour créer un composant fonctionnel ?",
        options: [
          "function MyComponent() { return <div>Hello</div>; }",
          "const MyComponent = () => { return <div>Hello</div>; }",
          "class MyComponent extends Component { render() { return <div>Hello</div>; } }",
          "Les réponses A et B sont correctes"
        ],
        correctAnswer: 3
      },
      {
        id: 4,
        question: "Que signifie JSX ?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JSON XML",
          "JavaScript Extension"
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Comment peut-on rendre conditionnel l'affichage d'un élément en React ?",
        options: [
          "En utilisant if/else dans le JSX",
          "En utilisant l'opérateur ternaire ou &&",
          "En utilisant des boucles for",
          "En utilisant des fonctions récursives"
        ],
        correctAnswer: 1
      }
    ]
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    quizData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / quizData.questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
  };

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {score >= quizData.passingScore ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">
                {score >= quizData.passingScore ? "Félicitations !" : "Continuez vos efforts !"}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Votre score : {score}%
              </p>
              <p className="text-gray-600">
                {score >= quizData.passingScore 
                  ? "Vous avez réussi le quiz avec succès !" 
                  : `Il vous faut ${quizData.passingScore}% pour réussir. Révisez et réessayez !`
                }
              </p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full bg-pink-600 hover:bg-pink-700" asChild>
                <Link to="/dashboard/apprenant/courses">
                  Retourner aux cours
                </Link>
              </Button>
              {score < quizData.passingScore && (
                <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                  Refaire le quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/dashboard/apprenant/courses">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{quizData.title}</h1>
                <p className="text-sm text-gray-600">{quizData.course}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-gray-600">
                {currentQuestion + 1}/{quizData.questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1}</CardTitle>
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length}/{quizData.questions.length} répondues
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-6">
                  {quizData.questions[currentQuestion].question}
                </h2>
                
                <RadioGroup
                  value={answers[quizData.questions[currentQuestion].id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(quizData.questions[currentQuestion].id, parseInt(value))}
                >
                  {quizData.questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50 border">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </Button>

                <div className="flex space-x-2">
                  {currentQuestion === quizData.questions.length - 1 ? (
                    <Button
                      onClick={submitQuiz}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={Object.keys(answers).length !== quizData.questions.length}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Terminer le quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={nextQuestion}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation rapide */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Navigation rapide</CardTitle>
              <CardDescription>Cliquez sur un numéro pour aller à cette question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quizData.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    className={`w-10 h-10 ${currentQuestion === index ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {answers[quizData.questions[index].id] !== undefined && (
                      <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-500" />
                    )}
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
