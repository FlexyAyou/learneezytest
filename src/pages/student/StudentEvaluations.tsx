import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award, TrendingUp, CheckCircle } from 'lucide-react';

interface Evaluation {
  id: string;
  courseTitle: string;
  type: 'quiz' | 'exam' | 'practical';
  title: string;
  description: string;
  status: 'available' | 'completed' | 'locked';
  score?: number;
  maxScore: number;
  percentage?: number;
  completedAt?: string;
  timeLimit?: number; // en minutes
  questionsCount: number;
}

const StudentEvaluations = () => {
  const navigate = useNavigate();
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

  // Données d'exemple
  const evaluations: Evaluation[] = [
    {
      id: '1',
      courseTitle: 'Mathématiques CE2',
      type: 'quiz',
      title: 'Quiz Module 1 - Les nombres',
      description: 'Évaluation des connaissances sur les nombres et le calcul',
      status: 'completed',
      score: 18,
      maxScore: 20,
      percentage: 90,
      completedAt: '2024-01-16',
      timeLimit: 30,
      questionsCount: 10
    },
    {
      id: '2',
      courseTitle: 'Mathématiques CE2',
      type: 'exam',
      title: 'Examen Module 2 - Géométrie',
      description: 'Évaluation approfondie des concepts géométriques',
      status: 'available',
      maxScore: 100,
      timeLimit: 90,
      questionsCount: 25
    },
    {
      id: '3',
      courseTitle: 'Mathématiques CE2',
      type: 'practical',
      title: 'Exercice pratique - Résolution de problèmes',
      description: 'Application des concepts mathématiques à des situations concrètes',
      status: 'locked',
      maxScore: 50,
      timeLimit: 60,
      questionsCount: 8
    }
  ];

  const getTypeLabel = (type: Evaluation['type']) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'exam': return 'Examen';
      case 'practical': return 'Pratique';
      default: return 'Évaluation';
    }
  };

  const getTypeBadge = (type: Evaluation['type']) => {
    switch (type) {
      case 'quiz':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Quiz</Badge>;
      case 'exam':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Examen</Badge>;
      case 'practical':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Pratique</Badge>;
      default:
        return <Badge variant="outline">Évaluation</Badge>;
    }
  };

  const getStatusBadge = (status: Evaluation['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'available':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Disponible</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-gray-500">Verrouillée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return 'text-gray-500';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const completedEvaluations = evaluations.filter(e => e.status === 'completed');
  const averageScore = completedEvaluations.length > 0 
    ? completedEvaluations.reduce((sum, e) => sum + (e.percentage || 0), 0) / completedEvaluations.length 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Évaluations</h1>
      </div>

      {/* Statistiques globales */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Évaluations complétées</p>
                <p className="text-2xl font-bold">{completedEvaluations.length}/{evaluations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Moyenne générale</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore > 0 ? `${averageScore.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meilleur score</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedEvaluations.length > 0 
                    ? `${Math.max(...completedEvaluations.map(e => e.percentage || 0))}%`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des évaluations */}
      <div className="grid gap-6">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{evaluation.title}</CardTitle>
                    {getTypeBadge(evaluation.type)}
                  </div>
                  <CardDescription>{evaluation.description}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📚 {evaluation.courseTitle}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {evaluation.timeLimit}min
                    </span>
                    <span>{evaluation.questionsCount} questions</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(evaluation.status)}
                  {evaluation.status === 'completed' && evaluation.score !== undefined && (
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(evaluation.percentage)}`}>
                        {evaluation.score}/{evaluation.maxScore}
                      </p>
                      <p className={`text-sm ${getScoreColor(evaluation.percentage)}`}>
                        {evaluation.percentage}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {evaluation.status === 'completed' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">
                      Complétée le {new Date(evaluation.completedAt!).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  {evaluation.percentage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className={getScoreColor(evaluation.percentage)}>
                          {evaluation.percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={evaluation.percentage} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/dashboard/etudiant/evaluations/${evaluation.id}/results`)}
                  >
                    Voir les résultats détaillés
                  </Button>
                </div>
              ) : evaluation.status === 'available' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Durée limitée : {evaluation.timeLimit} minutes
                    </span>
                  </div>
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/dashboard/etudiant/evaluations/${evaluation.id}/take`)}
                  >
                    Commencer l'évaluation
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Cette évaluation sera déverrouillée après avoir terminé les prérequis.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {evaluations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune évaluation disponible</h3>
            <p className="text-gray-600">
              Les évaluations apparaîtront ici une fois que vous serez inscrit à des formations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentEvaluations;