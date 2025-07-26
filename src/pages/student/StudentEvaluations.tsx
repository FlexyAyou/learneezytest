import React, { useState } from 'react';
import { BookOpen, Trophy, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const StudentEvaluations = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);

  // Données mockées
  const evaluations = [
    {
      id: '1',
      courseId: 'math-ce2',
      courseName: 'Mathématiques CE2',
      type: 'positionnement',
      score: 15,
      maxScore: 20,
      percentage: 75,
      isCompleted: true,
      completedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      courseId: 'math-ce2', 
      courseName: 'Mathématiques CE2',
      type: 'final',
      score: 18,
      maxScore: 20,
      percentage: 90,
      isCompleted: true,
      completedAt: '2024-02-15T10:30:00Z',
    },
    {
      id: '3',
      courseId: 'francais-cm1',
      courseName: 'Français CM1',
      type: 'positionnement',
      score: null,
      maxScore: 20,
      percentage: null,
      isCompleted: false,
      completedAt: null,
    },
    {
      id: '4',
      courseId: 'math-ce2',
      courseName: 'Mathématiques CE2', 
      type: 'satisfaction',
      score: null,
      maxScore: null,
      percentage: null,
      isCompleted: false,
      completedAt: null,
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'positionnement':
        return 'Test de positionnement';
      case 'final':
        return 'Évaluation finale';
      case 'satisfaction':
        return 'Satisfaction';
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'positionnement':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Positionnement</Badge>;
      case 'final':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Final</Badge>;
      case 'satisfaction':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Satisfaction</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calcul de l'évolution pour les cours avec test initial + final
  const getEvolution = (courseId: string) => {
    const initial = evaluations.find(e => e.courseId === courseId && e.type === 'positionnement' && e.isCompleted);
    const final = evaluations.find(e => e.courseId === courseId && e.type === 'final' && e.isCompleted);
    
    if (initial && final) {
      return {
        initial: initial.percentage,
        final: final.percentage,
        progress: final.percentage - initial.percentage
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Évaluations & Tests</h1>
        <p className="text-gray-600">Suivez votre progression et vos résultats d'évaluation</p>
      </div>

      {/* Évolution des résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Évolution de votre niveau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from(new Set(evaluations.map(e => e.courseId))).map(courseId => {
              const evolution = getEvolution(courseId);
              const courseName = evaluations.find(e => e.courseId === courseId)?.courseName;
              
              if (!evolution) return null;
              
              return (
                <div key={courseId} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">{courseName}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Test initial</p>
                      <p className="text-2xl font-bold text-blue-600">{evolution.initial}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Test final</p>
                      <p className="text-2xl font-bold text-green-600">{evolution.final}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Progression</p>
                      <p className={`text-2xl font-bold ${evolution.progress >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {evolution.progress > 0 ? '+' : ''}{evolution.progress}%
                      </p>
                    </div>
                  </div>
                  <Progress value={evolution.final} className="mt-4" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des évaluations */}
      <div className="grid gap-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{evaluation.courseName}</CardTitle>
                  <CardDescription>
                    {getTypeLabel(evaluation.type)}
                    {evaluation.completedAt && (
                      <span className="ml-2">
                        • Complété le {new Date(evaluation.completedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeBadge(evaluation.type)}
                  {evaluation.isCompleted && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Terminé
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {evaluation.isCompleted ? (
                <div className="space-y-4">
                  {evaluation.type !== 'satisfaction' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Résultat</span>
                        <span className={`text-lg font-bold ${getScoreColor(evaluation.percentage!)}`}>
                          {evaluation.score}/{evaluation.maxScore} ({evaluation.percentage}%)
                        </span>
                      </div>
                      <Progress value={evaluation.percentage!} />
                    </div>
                  )}
                  
                  {evaluation.type === 'satisfaction' && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Merci pour votre retour d'expérience</span>
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm">
                    Voir les détails
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {evaluation.type === 'satisfaction' 
                        ? 'Formulaire de satisfaction disponible à la fin de la formation'
                        : 'Test en attente'
                      }
                    </span>
                  </div>
                  
                  <Button 
                    disabled={evaluation.type === 'satisfaction'}
                    onClick={() => setSelectedEvaluation(evaluation)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {evaluation.type === 'satisfaction' ? 'Pas encore disponible' : 'Commencer le test'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {evaluations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune évaluation</h3>
            <p className="text-gray-600">Les évaluations apparaîtront ici une fois vos formations commencées.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentEvaluations;