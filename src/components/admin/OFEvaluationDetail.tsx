
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, User, Calendar, FileText, CheckCircle } from 'lucide-react';

interface OFEvaluationDetailProps {
  evaluation: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OFEvaluationDetail = ({ evaluation, isOpen, onClose }: OFEvaluationDetailProps) => {
  if (!evaluation) return null;

  const getScoreBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return <Badge variant="default" className="bg-green-500">Excellent</Badge>;
    if (percentage >= 60) return <Badge variant="secondary">Bien</Badge>;
    return <Badge variant="destructive">À améliorer</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Détails de l'évaluation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Apprenant</label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="font-semibold">{evaluation.apprenant}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Formation</label>
                  <p className="font-medium">{evaluation.formation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type d'évaluation</label>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{evaluation.type}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{evaluation.date}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résultats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-2xl font-bold">{evaluation.score}/{evaluation.maxScore}</p>
                    <p className="text-sm text-gray-600">Score obtenu</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{Math.round((evaluation.score / evaluation.maxScore) * 100)}%</p>
                    <div className="mt-1">
                      {getScoreBadge(evaluation.score, evaluation.maxScore)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Progression</label>
                  <Progress value={(evaluation.score / evaluation.maxScore) * 100} className="mt-2" />
                </div>
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
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Question 1: Concepts de base React</h4>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Correct</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">4/4 points</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Question 2: Gestion des états</h4>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Correct</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">3/4 points</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Question 3: Hooks avancés</h4>
                    <div className="flex items-center">
                      <span className="text-sm text-red-600">Incorrect</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">1/4 points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commentaires du formateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  Très bon travail sur les concepts de base et la gestion des états. 
                  Il serait bénéfique de revoir les hooks avancés, notamment useCallback et useMemo. 
                  Dans l'ensemble, une progression satisfaisante.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
