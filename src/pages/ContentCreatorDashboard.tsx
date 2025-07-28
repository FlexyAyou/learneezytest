import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Upload, 
  Users, 
  CheckCircle, 
  Clock,
  FileText,
  Video,
  Brain,
  Star,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

import { ModuleCreation } from '@/components/content-creator/ModuleCreation';
import { ResourceManagement } from '@/components/content-creator/ResourceManagement';
import { TrainerCollaboration } from '@/components/content-creator/TrainerCollaboration';
import { ContentValidation } from '@/components/content-creator/ContentValidation';

export default function ContentCreatorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    {
      title: "Modules créés",
      value: "24",
      description: "Ce mois",
      icon: BookOpen,
      trend: "+12%"
    },
    {
      title: "Collaborations",
      value: "8",
      description: "En cours",
      icon: Users,
      trend: "+3"
    },
    {
      title: "En validation",
      value: "5",
      description: "En attente",
      icon: Clock,
      trend: "-2"
    },
    {
      title: "Taux d'approbation",
      value: "92%",
      description: "Ce trimestre",
      icon: CheckCircle,
      trend: "+5%"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Module validé",
      title: "Formation Mathématiquese",
      time: "Il y a 2h",
      icon: CheckCircle,
      iconColor: "text-green-500"
    },
    {
      id: 2,
      action: "Nouveau commentaire",
      title: "Quiz JavaScript ES6",
      time: "Il y a 4h",
      icon: Users,
      iconColor: "text-blue-500"
    },
    {
      id: 3,
      action: "Ressource importée",
      title: "Vidéo TypeScript Basics.mp4",
      time: "Il y a 6h",
      icon: Upload,
      iconColor: "text-purple-500"
    },
    {
      id: 4,
      action: "Validation requise",
      title: "Formation Sécurité Web",
      time: "Il y a 1j",
      icon: AlertTriangle,
      iconColor: "text-orange-500"
    }
  ];

  if (activeTab !== 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
                <TabsTrigger value="creation">Création modules</TabsTrigger>
                <TabsTrigger value="ressources">Ressources</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
              </TabsList>
            </div>

            <div className="py-6">
              <TabsContent value="creation">
                <ModuleCreation />
              </TabsContent>
              <TabsContent value="ressources">
                <ResourceManagement />
              </TabsContent>
              <TabsContent value="collaboration">
                <TrainerCollaboration />
              </TabsContent>
              <TabsContent value="validation">
                <ContentValidation />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="creation">Création modules</TabsTrigger>
              <TabsTrigger value="ressources">Ressources</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="py-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Créateur de contenu pédagogique</h1>
            <p className="text-muted-foreground">
              Créez, gérez et validez vos contenus e-learning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Nouveau module
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stat.description}</span>
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Vos dernières actions et notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.title}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accédez rapidement à vos outils principaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('creation')}
              >
                <Brain className="mr-2 h-4 w-4" />
                Créer un module H5P interactif
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('ressources')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importer des ressources
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('collaboration')}
              >
                <Users className="mr-2 h-4 w-4" />
                Gérer les collaborations
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('validation')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider les contenus
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu des modules en cours */}
        <Card>
          <CardHeader>
            <CardTitle>Modules en cours de création</CardTitle>
            <CardDescription>
              Vos projets en développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Formation Sécurité Avancée",
                  type: "SCORM",
                  progress: 75,
                  status: "En révision",
                  collaborators: 2
                },
                {
                  title: "Quiz Machine Learning",
                  type: "H5P",
                  progress: 40,
                  status: "En développement",
                  collaborators: 1
                },
                {
                  title: "Vidéo API REST",
                  type: "Vidéo",
                  progress: 90,
                  status: "Finalisation",
                  collaborators: 0
                }
              ].map((module, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {module.type === 'SCORM' && <FileText className="h-5 w-5 text-purple-500" />}
                    {module.type === 'H5P' && <Brain className="h-5 w-5 text-green-500" />}
                    {module.type === 'Vidéo' && <Video className="h-5 w-5 text-blue-500" />}
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{module.type}</span>
                        <span>•</span>
                        <span>{module.status}</span>
                        {module.collaborators > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              {module.collaborators}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{module.progress}%</div>
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Continuer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}