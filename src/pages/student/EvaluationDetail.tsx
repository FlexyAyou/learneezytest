import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EvaluationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données d'exemple pour les résultats détaillés
  const evaluationDetail = {
    id: '1',
    courseTitle: 'Mathématiques CE2',
    type: 'quiz',
    title: 'Quiz Module 1 - Les nombres',
    description: 'Évaluation des connaissances sur les nombres et le calcul',
    status: 'completed',
    score: 18,
    maxScore: 20,
    percentage: 90,
    completedAt: '2024-01-16T14:30:00',
    timeLimit: 30,
    timeTaken: 25,
    questionsCount: 10,
    questions: [
      {
        id: 1,
        question: "Combien font 15 + 7 ?",
        userAnswer: "22",
        correctAnswer: "22",
        isCorrect: true,
        points: 2,
        maxPoints: 2
      },
      {
        id: 2,
        question: "Quel est le nombre suivant dans la suite : 2, 4, 6, 8, ... ?",
        userAnswer: "10",
        correctAnswer: "10",
        isCorrect: true,
        points: 2,
        maxPoints: 2
      },
      {
        id: 3,
        question: "Combien font 9 × 7 ?",
        userAnswer: "62",
        correctAnswer: "63",
        isCorrect: false,
        points: 0,
        maxPoints: 2
      },
      // ... autres questions
    ]
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Bien</Badge>;
    return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard/etudiant/evaluations')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Résultats détaillés</h1>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{evaluationDetail.title}</CardTitle>
              <CardDescription className="mt-2">{evaluationDetail.description}</CardDescription>
              <p className="text-sm text-gray-500 mt-1">📚 {evaluationDetail.courseTitle}</p>
            </div>
            {getPerformanceBadge(evaluationDetail.percentage)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Score obtenu</p>
                <p className={`text-3xl font-bold ${getScoreColor(evaluationDetail.percentage)}`}>
                  {evaluationDetail.score}/{evaluationDetail.maxScore}
                </p>
                <p className={`text-lg ${getScoreColor(evaluationDetail.percentage)}`}>
                  {evaluationDetail.percentage}%
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{evaluationDetail.percentage}%</span>
                </div>
                <Progress value={evaluationDetail.percentage} className="h-3" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Temps imparti</p>
                  <p className="font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {evaluationDetail.timeLimit} min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps utilisé</p>
                  <p className="font-semibold">{evaluationDetail.timeTaken} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="font-semibold">{evaluationDetail.questionsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Terminé le</p>
                  <p className="font-semibold">
                    {new Date(evaluationDetail.completedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détail des réponses */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des réponses</CardTitle>
          <CardDescription>Revue question par question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluationDetail.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <p className="text-gray-700 mt-1">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {question.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <Badge variant={question.isCorrect ? "default" : "destructive"}>
                      {question.points}/{question.maxPoints} pts
                    </Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Votre réponse</p>
                    <p className={`font-medium ${question.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {question.userAnswer}
                    </p>
                  </div>
                  {!question.isCorrect && (
                    <div>
                      <p className="text-gray-600 mb-1">Réponse correcte</p>
                      <p className="font-medium text-green-700">
                        {question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          variant="outline"
          onClick={() => navigate('/dashboard/etudiant/evaluations')}
        >
          Retour aux évaluations
        </Button>
        <Button>
          Refaire l'évaluation
        </Button>
      </div>
    </div>
  );
};

export default EvaluationDetail;