
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, User, CheckCircle, XCircle } from 'lucide-react';

interface EvaluationViewModalProps {
  evaluation: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationViewModal = ({ evaluation, isOpen, onClose }: EvaluationViewModalProps) => {
  if (!evaluation) return null;

  const getTypeBadge = (type: string) => {
    const config = {
      positionnement: { variant: 'outline' as const, label: 'Test de positionnement', color: 'bg-purple-50 text-purple-700' },
      quiz: { variant: 'outline' as const, label: 'Quiz', color: 'bg-blue-50 text-blue-700' },
      exam: { variant: 'outline' as const, label: 'Examen', color: 'bg-red-50 text-red-700' },
      practical: { variant: 'outline' as const, label: 'Exercice pratique', color: 'bg-green-50 text-green-700' },
      final: { variant: 'outline' as const, label: 'Évaluation finale', color: 'bg-orange-50 text-orange-700' },
      satisfaction: { variant: 'outline' as const, label: 'Satisfaction', color: 'bg-yellow-50 text-yellow-700' },
    };
    
    const typeConfig = config[type as keyof typeof config] || config.quiz;
    return <Badge variant={typeConfig.variant} className={typeConfig.color}>
      {typeConfig.label}
    </Badge>;
  };

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return 'text-gray-500';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mock questions data for demonstration
  const mockQuestions = [
    {
      id: 1,
      question: "Qu'est-ce qu'un composant React ?",
      userAnswer: "Un composant React est une fonction ou classe qui retourne du JSX pour décrire l'interface utilisateur.",
      correctAnswer: "Un composant React est une fonction ou classe qui retourne du JSX pour décrire l'interface utilisateur.",
      isCorrect: true,
      points: 4,
      maxPoints: 4
    },
    {
      id: 2,
      question: "Comment gérer l'état local dans un composant fonctionnel ?",
      userAnswer: "Avec le hook useState",
      correctAnswer: "Avec le hook useState ou useReducer pour des états plus complexes",
      isCorrect: true,
      points: 3,
      maxPoints: 4
    },
    {
      id: 3,
      question: "Qu'est-ce que le Virtual DOM ?",
      userAnswer: "Une représentation en mémoire du DOM réel",
      correctAnswer: "Une représentation virtuelle du DOM réel qui permet à React d'optimiser les mises à jour",
      isCorrect: false,
      points: 1,
      maxPoints: 4
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Détails de l'évaluation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{evaluation.title}</span>
                {getTypeBadge(evaluation.type)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Formation</label>
                  <p className="font-medium">{evaluation.courseTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date de completion</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p>{new Date(evaluation.completedAt).toLocaleDateString('fr-FR')}</p>
                    <Clock className="w-4 h-4 text-gray-500 ml-2" />
                    <p>{new Date(evaluation.completedAt).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</p>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Score obtenu</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(evaluation.percentage)}`}>
                      {evaluation.score}/{evaluation.maxScore}
                    </span>
                    <span className={`text-lg ml-2 ${getScoreColor(evaluation.percentage)}`}>
                      ({evaluation.percentage}%)
                    </span>
                  </div>
                </div>
                <Progress value={evaluation.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Détail des réponses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détail des réponses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQuestions.map((question) => (
                  <div 
                    key={question.id} 
                    className={`border-l-4 p-4 rounded-r-lg ${
                      question.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Question {question.id}</h4>
                      <div className="flex items-center gap-2">
                        {question.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          question.isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {question.points}/{question.maxPoints} points
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium mb-2">{question.question}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Votre réponse :</span>
                        <p className="text-sm bg-white p-2 rounded border">{question.userAnswer}</p>
                      </div>
                      
                      {!question.isCorrect && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">Réponse attendue :</span>
                          <p className="text-sm bg-green-50 p-2 rounded border border-green-200">{question.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Formateur</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Bon travail global ! Vous maîtrisez bien les concepts de base de React. 
                      Je recommande d'approfondir la compréhension du Virtual DOM pour améliorer vos performances.
                      Continuez vos efforts !
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
