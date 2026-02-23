
import React, { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useLearnerProgress } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Calendar,
  BookOpen,
  BarChart3,
  PieChart,
  Target,
  MessageSquare,
  Eye,
  Plus
} from 'lucide-react';
import { InteractiveChart } from '@/components/common/InteractiveChart';
import { StatsCard } from '@/components/common/StatsCard';

export const OFSuiviPedagogiqueEnhanced = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFormation, setSelectedFormation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { organization } = useOrganization();
  const ofId = organization?.organizationId;
  const { data: progressData, isLoading } = useLearnerProgress(ofId, {
    period: selectedPeriod,
    formation_id: selectedFormation === 'all' ? undefined : selectedFormation
  });

  // Mappage des métriques globales
  const globalMetrics = [
    {
      title: 'Total Apprenants',
      value: progressData?.metrics?.total_learners?.value || '0',
      change: progressData?.metrics?.total_learners?.change || '0%',
      icon: Users,
      trend: (progressData?.metrics?.total_learners?.trend || 'neutral') as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Taux de Réussite',
      value: progressData?.metrics?.success_rate?.value || '0%',
      change: progressData?.metrics?.success_rate?.change || '0%',
      icon: Award,
      trend: (progressData?.metrics?.success_rate?.trend || 'neutral') as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Évaluations Complétées',
      value: progressData?.metrics?.completed_evaluations?.value || '0',
      change: progressData?.metrics?.completed_evaluations?.change || '0%',
      icon: Target,
      trend: (progressData?.metrics?.completed_evaluations?.trend || 'neutral') as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Apprenants en Difficulté',
      value: progressData?.metrics?.at_risk_learners?.value || '0',
      change: progressData?.metrics?.at_risk_learners?.change || '0',
      icon: AlertTriangle,
      trend: (progressData?.metrics?.at_risk_learners?.trend || 'neutral') as 'up' | 'down' | 'neutral'
    },
  ];

  // Données des graphiques
  const performanceData = progressData?.charts?.performance || [];
  const competencesData = progressData?.charts?.skills || [];
  const distributionNotes = progressData?.charts?.grades_distribution || [];

  // Données des apprenants
  const apprenantsRaw = progressData?.learners || [];

  // Mapping pour compatibilité UI
  const apprenants = apprenantsRaw.map((a: any) => ({
    id: a.id?.toString(),
    name: `${a.first_name} ${a.last_name}`,
    formation: a.course_name || 'N/A',
    progression: a.progress_percentage || 0,
    dernièreActivité: a.last_activity,
    status: a.status || 'unknown',
    moyenneGlobale: a.average_grade || 0,
    évaluationsComplétées: a.completed_assignments || 0,
    totalÉvaluations: a.total_assignments || 0
  }));

  const formationsList = progressData?.available_formations || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'bien': return 'bg-blue-100 text-blue-800';
      case 'difficulté': return 'bg-red-100 text-red-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'bien': return 'Bien';
      case 'difficulté': return 'En difficulté';
      case 'at_risk': return 'En difficulté';
      default: return 'Non évalué';
    }
  };

  const filteredApprenants = apprenants.filter((apprenant: any) =>
    apprenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprenant.formation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi Pédagogique Avancé</h1>
          <p className="text-gray-600">Tableau de bord complet pour le suivi des apprenants</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Évaluation
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filtres:</span>
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Formation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les formations</SelectItem>
                {formationsList.map((f: any) => (
                  <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un apprenant..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Chargement des données pédagogiques...</p>
        </div>
      ) : (
        <>
          {/* Métriques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalMetrics.map((metric, index) => (
              <StatsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                trend={metric.trend}
              />
            ))}
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              title="Évolution des Performances"
              data={performanceData}
              type="line"
              color="#10b981"
            />

            <InteractiveChart
              title="Distribution des Notes"
              data={distributionNotes}
              type="pie"
            />
          </div>
        </>
      )}

      {/* Onglets principaux */}
      <Tabs defaultValue="apprenants" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apprenants" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Apprenants
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Évaluations
          </TabsTrigger>
          <TabsTrigger value="competences" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Compétences
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apprenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Liste des Apprenants ({filteredApprenants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApprenants.map((apprenant) => (
                  <div key={apprenant.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {apprenant.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{apprenant.name}</h4>
                        <Badge className={getStatusColor(apprenant.status)}>
                          {getStatusLabel(apprenant.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Formation</p>
                          <p className="font-medium">{apprenant.formation}</p>
                        </div>

                        <div>
                          <p className="text-gray-600">Progression</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${apprenant.progression}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{apprenant.progression}%</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-600">Moyenne</p>
                          <p className="font-medium">{apprenant.moyenneGlobale}/20</p>
                        </div>

                        <div>
                          <p className="text-gray-600">Évaluations</p>
                          <p className="font-medium">{apprenant.évaluationsComplétées}/{apprenant.totalÉvaluations}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Quiz React Hooks', date: '2024-01-14', participants: 23, moyenne: 16.2 },
                    { name: 'TP JavaScript ES6', date: '2024-01-13', participants: 18, moyenne: 14.8 },
                    { name: 'Projet Angular', date: '2024-01-12', participants: 15, moyenne: 15.5 },
                  ].map((evaluation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{evaluation.name}</p>
                        <p className="text-sm text-gray-600">{evaluation.date} • {evaluation.participants} participants</p>
                      </div>
                      <Badge variant="outline">Moy: {evaluation.moyenne}/20</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évaluations Planifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Examen TypeScript', date: '2024-01-20', type: 'Examen final' },
                    { name: 'Quiz CSS Grid', date: '2024-01-18', type: 'Quiz' },
                    { name: 'TP Node.js', date: '2024-01-22', type: 'Travaux pratiques' },
                  ].map((evaluation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{evaluation.name}</p>
                        <p className="text-sm text-gray-600">{evaluation.date} • {evaluation.type}</p>
                      </div>
                      <Button size="sm" variant="outline">Configurer</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competences" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              title="Progression par Compétences"
              data={competencesData}
              type="bar"
              color="#8b5cf6"
            />

            <Card>
              <CardHeader>
                <CardTitle>Compétences en Difficulté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { competence: 'TypeScript Avancé', pourcentage: 45, apprenants: 8 },
                    { competence: 'Tests Unitaires', pourcentage: 52, apprenants: 6 },
                    { competence: 'Architecture MVC', pourcentage: 58, apprenants: 4 },
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{item.competence}</p>
                        <Badge variant="destructive">{item.pourcentage}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.apprenants} apprenants en difficulté</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendrier des Évaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { date: '18 Jan', title: 'Quiz CSS Grid', formation: 'Web Design', type: 'quiz' },
                  { date: '20 Jan', title: 'Examen TypeScript', formation: 'JavaScript Avancé', type: 'examen' },
                  { date: '22 Jan', title: 'TP Node.js', formation: 'Backend Development', type: 'tp' },
                  { date: '25 Jan', title: 'Projet React', formation: 'Frontend Framework', type: 'projet' },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={item.type === 'examen' ? 'destructive' : 'default'}>
                        {item.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.formation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
