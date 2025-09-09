
import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Award, Plus, Users, TrendingUp, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CreateTestModal from './CreateTestModal';

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  participants: number;
  averageScore: number;
  created: string;
  status: 'Actif' | 'Brouillon' | 'Archivé';
}

interface NeedsAnalysis {
  id: string;
  studentName: string;
  domain: string;
  currentLevel: string;
  targetLevel: string;
  date: string;
  status: 'En cours' | 'Terminé' | 'Planifié';
  score?: number;
  recommendations: string[];
}

const TrainerPositioningTests = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [tests, setTests] = useState<Test[]>([
    {
      id: '1',
      title: 'Test de positionnement JavaScript',
      description: 'Évaluez le niveau des apprenants en JavaScript',
      duration: 30,
      difficulty: 'Intermédiaire',
      participants: 24,
      averageScore: 72,
      created: '2024-01-15',
      status: 'Actif'
    },
    {
      id: '2',
      title: 'Test de positionnement React',
      description: 'Évaluation des compétences en React',
      duration: 45,
      difficulty: 'Avancé',
      participants: 18,
      averageScore: 68,
      created: '2024-01-10',
      status: 'Actif'
    },
    {
      id: '3',
      title: 'Test HTML/CSS Débutant',
      description: 'Test de base pour les nouveaux apprenants',
      duration: 20,
      difficulty: 'Débutant',
      participants: 0,
      averageScore: 0,
      created: '2024-01-22',
      status: 'Brouillon'
    }
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const needsAnalyses: NeedsAnalysis[] = [
    {
      id: '1',
      studentName: 'Alice Martin',
      domain: 'JavaScript',
      currentLevel: 'Débutant',
      targetLevel: 'Intermédiaire',
      date: '2024-01-20',
      status: 'Terminé',
      score: 65,
      recommendations: [
        'Renforcer les bases des fonctions',
        'Approfondir les concepts d\'asynchrone',
        'Pratiquer les manipulations DOM'
      ]
    },
    {
      id: '2',
      studentName: 'Thomas Dupont',
      domain: 'React',
      currentLevel: 'Intermédiaire',
      targetLevel: 'Avancé',
      date: '2024-01-19',
      status: 'En cours',
      recommendations: [
        'Maîtriser les hooks avancés',
        'Optimisation des performances',
        'Tests unitaires avec Jest'
      ]
    },
    {
      id: '3',
      studentName: 'Emma Dubois',
      domain: 'UI/UX Design',
      currentLevel: 'Débutant',
      targetLevel: 'Intermédiaire',
      date: '2024-01-25',
      status: 'Planifié',
      recommendations: []
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avancé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateTest = (newTest: Test) => {
    setTests(prev => [...prev, newTest]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Actif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>;
      case 'Brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'Archivé':
        return <Badge variant="secondary">Archivé</Badge>;
      case 'Terminé':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Terminé</Badge>;
      case 'En cours':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En cours</Badge>;
      case 'Planifié':
        return <Badge variant="outline">Planifié</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tests de positionnement</h1>
        <p className="text-muted-foreground">Créez et gérez vos tests de positionnement et analyses de besoins</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tests">Mes tests</TabsTrigger>
          <TabsTrigger value="analyses">Analyses de besoins</TabsTrigger>
        </TabsList>

        {/* Tests de positionnement */}
        <TabsContent value="tests" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tests actifs</p>
                      <p className="text-2xl font-bold">{tests.filter(t => t.status === 'Actif').length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total participants</p>
                      <p className="text-2xl font-bold">{tests.reduce((acc, test) => acc + test.participants, 0)}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Score moyen</p>
                      <p className="text-2xl font-bold">
                        {Math.round(tests.filter(t => t.participants > 0).reduce((acc, test) => acc + test.averageScore, 0) / tests.filter(t => t.participants > 0).length) || 0}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un test
            </Button>
          </div>

          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{test.title}</h3>
                        {getStatusBadge(test.status)}
                        <Badge className={getDifficultyColor(test.difficulty)}>
                          {test.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{test.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {test.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {test.participants} participants
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                          {test.averageScore}% moyenne
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          Créé le {test.created}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analyses de besoins */}
        <TabsContent value="analyses" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Analyses terminées</p>
                      <p className="text-2xl font-bold">{needsAnalyses.filter(a => a.status === 'Terminé').length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">En cours</p>
                      <p className="text-2xl font-bold">{needsAnalyses.filter(a => a.status === 'En cours').length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Planifiées</p>
                      <p className="text-2xl font-bold">{needsAnalyses.filter(a => a.status === 'Planifié').length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle analyse
            </Button>
          </div>

          <div className="space-y-4">
            {needsAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{analysis.studentName}</h3>
                        {getStatusBadge(analysis.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Domaine:</span>
                          <p className="font-medium">{analysis.domain}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Niveau actuel:</span>
                          <p className="font-medium">{analysis.currentLevel}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Objectif:</span>
                          <p className="font-medium">{analysis.targetLevel}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">{analysis.date}</p>
                        </div>
                      </div>
                      
                      {analysis.score && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Score obtenu</span>
                            <span className="font-medium">{analysis.score}%</span>
                          </div>
                          <Progress value={analysis.score} className="h-2" />
                        </div>
                      )}

                      {analysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Recommandations:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateTestModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTestCreated={handleCreateTest}
      />
    </div>
  );
};

export default TrainerPositioningTests;
