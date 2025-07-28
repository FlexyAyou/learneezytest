
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  Palette,
  Settings
} from 'lucide-react';

import { ModuleCreation } from '@/components/content-creator/ModuleCreation';
import { ResourceManagement } from '@/components/content-creator/ResourceManagement';
import { TrainerCollaboration } from '@/components/content-creator/TrainerCollaboration';
import { ContentValidation } from '@/components/content-creator/ContentValidation';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const ContentCreatorDashboardHome = () => {
  const stats = [
    {
      title: "Modules créés",
      value: "24",
      icon: BookOpen,
      change: "+12% ce mois",
      changeType: "positive" as const,
      description: "Ce mois",
      color: "text-blue-600"
    },
    {
      title: "Collaborations",
      value: "8",
      icon: Users,
      change: "+3 nouvelles",
      changeType: "positive" as const,
      description: "En cours",
      color: "text-green-600"
    },
    {
      title: "En validation",
      value: "5",
      icon: Clock,
      change: "-2 depuis hier",
      changeType: "positive" as const,
      description: "En attente",
      color: "text-orange-600"
    },
    {
      title: "Taux d'approbation",
      value: "92%",
      icon: CheckCircle,
      change: "+5% ce trimestre",
      changeType: "positive" as const,
      description: "Ce trimestre",
      color: "text-purple-600"
    }
  ];

  const creationData = [
    { name: 'Jan', value: 18, validations: 16 },
    { name: 'Fév', value: 22, validations: 20 },
    { name: 'Mar', value: 19, validations: 18 },
    { name: 'Avr', value: 24, validations: 22 },
    { name: 'Mai', value: 26, validations: 24 },
    { name: 'Juin', value: 28, validations: 26 }
  ];

  const contentTypeData = [
    { name: 'Vidéos', value: 45 },
    { name: 'Quiz H5P', value: 30 },
    { name: 'SCORM', value: 15 },
    { name: 'PDF', value: 10 }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Module validé",
      title: "Formation Mathématiques",
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

  const activeProjects = [
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
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créateur de contenu pédagogique</h1>
          <p className="text-gray-600">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution de la création (6 derniers mois)"
          data={creationData}
          type="area"
          dataKey="value"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Répartition par type de contenu"
          data={contentTypeData}
          type="pie"
          height={300}
        />
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
                    <p className="text-sm text-gray-500">
                      {activity.title}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Modules en cours */}
        <Card>
          <CardHeader>
            <CardTitle>Modules en cours de création</CardTitle>
            <CardDescription>
              Vos projets en développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {module.type === 'SCORM' && <FileText className="h-5 w-5 text-purple-500" />}
                    {module.type === 'H5P' && <Brain className="h-5 w-5 text-green-500" />}
                    {module.type === 'Vidéo' && <Video className="h-5 w-5 text-blue-500" />}
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
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
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
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
      </div>
    </div>
  );
};

const ContentCreatorDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/createur-de-contenu', icon: TrendingUp, isActive: true },
    { title: 'Création modules', href: '/createur-de-contenu/creation', icon: Palette },
    { title: 'Ressources', href: '/createur-de-contenu/ressources', icon: Upload },
    { title: 'Collaboration', href: '/createur-de-contenu/collaboration', icon: Users },
    { title: 'Validation', href: '/createur-de-contenu/validation', icon: CheckCircle },
    { title: 'Bibliothèque', href: '/createur-de-contenu/bibliotheque', icon: BookOpen },
    { title: 'Templates', href: '/createur-de-contenu/templates', icon: FileText },
    { title: 'Statistiques', href: '/createur-de-contenu/stats', icon: Star },
    { title: 'Paramètres', href: '/createur-de-contenu/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Sophie Martin",
    email: "sophie.martin@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Créateur de Contenu"
        subtitle="Pédagogie & Création"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ContentCreatorDashboardHome />} />
          <Route path="/creation" element={<ModuleCreation />} />
          <Route path="/ressources" element={<ResourceManagement />} />
          <Route path="/collaboration" element={<TrainerCollaboration />} />
          <Route path="/validation" element={<ContentValidation />} />
          <Route path="/bibliotheque" element={<ResourceManagement />} />
          <Route path="/templates" element={<ModuleCreation />} />
          <Route path="/stats" element={<ContentValidation />} />
          <Route path="/parametres" element={<ModuleCreation />} />
        </Routes>
      </main>
    </div>
  );
};

export default ContentCreatorDashboard;
