import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar, 
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Award,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerReports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock data for reports
  const globalStats = {
    totalLearners: 245,
    activeCourses: 18,
    completionRate: 87,
    averageScore: 82,
    totalHours: 1420,
    certificatesIssued: 156
  };

  const courseProgress = [
    { 
      id: 1, 
      course: 'React Development', 
      totalStudents: 45, 
      completed: 38, 
      inProgress: 7, 
      averageScore: 85,
      completionRate: 84,
      instructor: 'Marie Dubois'
    },
    { 
      id: 2, 
      course: 'UI/UX Design', 
      totalStudents: 32, 
      completed: 28, 
      inProgress: 4, 
      averageScore: 88,
      completionRate: 88,
      instructor: 'Claire Roussel'
    },
    { 
      id: 3, 
      course: 'Project Management', 
      totalStudents: 28, 
      completed: 22, 
      inProgress: 6, 
      averageScore: 79,
      completionRate: 79,
      instructor: 'Jean Martin'
    },
    { 
      id: 4, 
      course: 'Marketing Digital', 
      totalStudents: 38, 
      completed: 35, 
      inProgress: 3, 
      averageScore: 83,
      completionRate: 92,
      instructor: 'Sophie Blanc'
    }
  ];

  const learnerDetails = [
    {
      id: 1,
      name: 'Alice Bernard',
      totalCourses: 3,
      completed: 2,
      inProgress: 1,
      averageScore: 92,
      totalHours: 45,
      lastActivity: '2024-01-15',
      status: 'Active',
      certificates: 2
    },
    {
      id: 2,
      name: 'Thomas Petit',
      totalCourses: 2,
      completed: 2,
      inProgress: 0,
      averageScore: 88,
      totalHours: 32,
      lastActivity: '2024-01-14',
      status: 'Completed',
      certificates: 2
    },
    {
      id: 3,
      name: 'Emma Moreau',
      totalCourses: 4,
      completed: 3,
      inProgress: 1,
      averageScore: 85,
      totalHours: 58,
      lastActivity: '2024-01-16',
      status: 'Active',
      certificates: 3
    },
    {
      id: 4,
      name: 'Lucas Durand',
      totalCourses: 2,
      completed: 1,
      inProgress: 1,
      averageScore: 76,
      totalHours: 28,
      lastActivity: '2024-01-10',
      status: 'At Risk',
      certificates: 1
    }
  ];

  const handleExport = (format: string) => {
    toast({
      title: `Export ${format.toUpperCase()}`,
      description: `Rapport exporté au format ${format.toUpperCase()} avec succès.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case 'At Risk':
        return <Badge className="bg-red-100 text-red-800">À risque</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports Détaillés</h1>
          <p className="text-gray-600">Analyse approfondie de la progression des apprenants</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button className="flex items-center" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Période</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 derniers jours</SelectItem>
                  <SelectItem value="30days">30 derniers jours</SelectItem>
                  <SelectItem value="3months">3 derniers mois</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les formations</SelectItem>
                  <SelectItem value="react">React Development</SelectItem>
                  <SelectItem value="uiux">UI/UX Design</SelectItem>
                  <SelectItem value="pm">Project Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format d'export</Label>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>PDF</Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('excel')}>Excel</Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>CSV</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.totalLearners}</p>
                <p className="text-gray-600 text-sm">Apprenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.activeCourses}</p>
                <p className="text-gray-600 text-sm">Formations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.completionRate}%</p>
                <p className="text-gray-600 text-sm">Taux de réussite</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.averageScore}</p>
                <p className="text-gray-600 text-sm">Score moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.totalHours}h</p>
                <p className="text-gray-600 text-sm">Heures total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{globalStats.certificatesIssued}</p>
                <p className="text-gray-600 text-sm">Certificats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Par Formation
          </TabsTrigger>
          <TabsTrigger value="learners" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Par Apprenant
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analyses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progression par Formation</CardTitle>
              <CardDescription>Détail des performances pour chaque cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courseProgress.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{course.course}</h3>
                        <p className="text-sm text-gray-600">Formateur: {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{course.completionRate}%</p>
                        <p className="text-sm text-gray-600">Taux de réussite</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{course.totalStudents}</p>
                        <p className="text-sm text-gray-600">Inscrits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">{course.completed}</p>
                        <p className="text-sm text-gray-600">Terminés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">{course.inProgress}</p>
                        <p className="text-sm text-gray-600">En cours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{course.averageScore}/100</p>
                        <p className="text-sm text-gray-600">Score moyen</p>
                      </div>
                    </div>
                    
                    <Progress value={course.completionRate} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Détail par Apprenant</CardTitle>
              <CardDescription>Performance individuelle des apprenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Apprenant</th>
                      <th className="text-center py-3">Formations</th>
                      <th className="text-center py-3">Terminées</th>
                      <th className="text-center py-3">Score Moyen</th>
                      <th className="text-center py-3">Heures</th>
                      <th className="text-center py-3">Certificats</th>
                      <th className="text-center py-3">Statut</th>
                      <th className="text-center py-3">Dernière Activité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learnerDetails.map((learner) => (
                      <tr key={learner.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{learner.name}</p>
                            <p className="text-sm text-gray-600">ID: {learner.id}</p>
                          </div>
                        </td>
                        <td className="text-center py-4">{learner.totalCourses}</td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            {learner.completed}
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <span className={`font-medium ${
                            learner.averageScore >= 85 ? 'text-green-600' : 
                            learner.averageScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {learner.averageScore}%
                          </span>
                        </td>
                        <td className="text-center py-4">{learner.totalHours}h</td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            {learner.certificates}
                          </div>
                        </td>
                        <td className="text-center py-4">
                          {getStatusBadge(learner.status)}
                        </td>
                        <td className="text-center py-4 text-sm text-gray-600">
                          {learner.lastActivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Tendances d'Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Connexions quotidiennes</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Temps moyen de session</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taux d'abandon</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                      <span className="text-green-600 font-medium">-5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Alertes et Risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-red-500 bg-red-50">
                    <div>
                      <p className="font-medium text-red-800">3 apprenants à risque</p>
                      <p className="text-sm text-red-600">Inactifs depuis plus de 7 jours</p>
                    </div>
                    <Button size="sm" variant="outline">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-yellow-500 bg-yellow-50">
                    <div>
                      <p className="font-medium text-yellow-800">2 formations en retard</p>
                      <p className="text-sm text-yellow-600">Délai de livraison dépassé</p>
                    </div>
                    <Button size="sm" variant="outline">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-blue-50">
                    <div>
                      <p className="font-medium text-blue-800">5 certificats à délivrer</p>
                      <p className="text-sm text-blue-600">Formations terminées récemment</p>
                    </div>
                    <Button size="sm" variant="outline">Traiter</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerReports;