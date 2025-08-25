import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Award, TrendingUp, CheckCircle, Calendar, Clock, Eye } from 'lucide-react';
import { useStudentEvaluations } from '@/hooks/useStudentEvaluations';
import { useToast } from '@/hooks/use-toast';
import { EvaluationViewModal } from '@/components/student/EvaluationViewModal';

const StudentEvaluations = () => {
  const { evaluations, loading } = useStudentEvaluations();
  const { toast } = useToast();
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const handleDownloadEvaluation = (evaluation: any) => {
    // Simulate PDF download
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'évaluation "${evaluation.title}" en cours...`,
    });
    
    // In a real app, this would generate and download a PDF
    const blob = new Blob([`Évaluation: ${evaluation.title}\nCours: ${evaluation.courseTitle}\nScore: ${evaluation.score}/${evaluation.maxScore} (${evaluation.percentage}%)`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-${evaluation.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    toast({
      title: "Téléchargement groupé",
      description: "Génération du fichier ZIP avec toutes vos évaluations...",
    });
    
    // In a real app, this would create a ZIP file with all evaluations
  };

  const handleViewEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedEvaluations = evaluations.length;
  const averageScore = evaluations.length > 0 
    ? evaluations.reduce((sum, e) => sum + (e.percentage || 0), 0) / evaluations.length 
    : 0;
  const bestScore = evaluations.length > 0 
    ? Math.max(...evaluations.map(e => e.percentage || 0))
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Évaluations Complétées</h1>
          <p className="text-gray-600 mt-2">Consultez et téléchargez toutes vos évaluations</p>
        </div>
        {evaluations.length > 0 && (
          <Button onClick={handleDownloadAll} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Télécharger tout
          </Button>
        )}
      </div>

      {/* Statistiques globales */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Évaluations complétées</p>
                <p className="text-2xl font-bold">{completedEvaluations}</p>
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
                  {bestScore > 0 ? `${bestScore}%` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des évaluations */}
      {evaluations.length > 0 ? (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Historique des évaluations</h2>
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{evaluation.title}</CardTitle>
                      {getTypeBadge(evaluation.type)}
                    </div>
                    <CardDescription>📚 {evaluation.courseTitle}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(evaluation.completedAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(evaluation.completedAt).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.percentage)}`}>
                      {evaluation.score}/{evaluation.maxScore}
                    </div>
                    <div className={`text-sm ${getScoreColor(evaluation.percentage)}`}>
                      {evaluation.percentage}%
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {evaluation.percentage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className={getScoreColor(evaluation.percentage)}>
                          {evaluation.percentage}%
                        </span>
                      </div>
                      <Progress value={evaluation.percentage} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Évaluation terminée</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewEvaluation(evaluation)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadEvaluation(evaluation)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune évaluation complétée</h3>
            <p className="text-gray-600">
              Vos évaluations terminées apparaîtront ici une fois que vous aurez complété des tests ou exercices.
            </p>
          </CardContent>
        </Card>
      )}

      <EvaluationViewModal
        evaluation={selectedEvaluation}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default StudentEvaluations;
