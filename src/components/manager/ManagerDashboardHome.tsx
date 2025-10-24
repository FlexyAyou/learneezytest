
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  ClipboardList,
  MessageSquare,
  Plus,
  Eye,
  Bell,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { StatsCard } from '@/components/common/StatsCard';
import { InteractiveChart } from '@/components/common/InteractiveChart';
import { TimelineComponent } from '@/components/common/TimelineComponent';
import { QuickActionsGrid } from '@/components/common/QuickActionsGrid';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

export const ManagerDashboardHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useFastAPIAuth();

  const chartData = [
    { name: 'Jan', value: 45, inscriptions: 45, abandons: 5 },
    { name: 'Fév', value: 52, inscriptions: 52, abandons: 8 },
    { name: 'Mar', value: 48, inscriptions: 48, abandons: 3 },
    { name: 'Avr', value: 61, inscriptions: 61, abandons: 7 },
    { name: 'Mai', value: 55, inscriptions: 55, abandons: 4 },
    { name: 'Jun', value: 67, inscriptions: 67, abandons: 6 },
  ];

  const timelineItems = [
    { 
      id: '1', 
      title: 'Nouvelle inscription',
      description: 'Marie Dupont s\'est inscrite en React Avancé',
      time: '2h',
      icon: UserCheck,
      color: 'text-green-600',
      type: 'success' as const
    },
    { 
      id: '2', 
      title: 'Formation terminée',
      description: 'Jean Martin a terminé la formation JavaScript',
      time: '3h',
      icon: CheckCircle,
      color: 'text-blue-600',
      type: 'info' as const
    },
    { 
      id: '3', 
      title: 'Absence signalée',
      description: 'Sophie Bernard absente à la session Angular',
      time: '4h',
      icon: XCircle,
      color: 'text-red-600',
      type: 'error' as const
    },
    { 
      id: '4', 
      title: 'Session planifiée',
      description: 'Nouvelle session Vue.js pour le 15 février',
      time: '5h',
      icon: Calendar,
      color: 'text-purple-600',
      type: 'info' as const
    },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Ajouter Apprenant',
      description: 'Nouvelle inscription',
      icon: UserCheck,
      color: 'bg-green-500',
      onClick: () => navigate('/dashboard/gestionnaire/apprenants')
    },
    {
      id: '2',
      title: 'Nouvelle Formation',
      description: 'Créer une formation',
      icon: BookOpen,
      color: 'bg-blue-500',
      onClick: () => navigate('/dashboard/gestionnaire/formations')
    },
    {
      id: '3',
      title: 'Planning',
      description: 'Voir le planning',
      icon: Calendar,
      color: 'bg-purple-500',
      onClick: () => navigate('/dashboard/gestionnaire/planning')
    },
    {
      id: '4',
      title: 'Rapports',
      description: 'Générer rapports',
      icon: ClipboardList,
      color: 'bg-orange-500',
      onClick: () => navigate('/dashboard/gestionnaire/rapports')
    },
    {
      id: '5',
      title: 'Messages',
      description: 'Messagerie',
      icon: MessageSquare,
      color: 'bg-pink-500',
      onClick: () => navigate('/dashboard/gestionnaire/messages')
    },
    {
      id: '6',
      title: 'Présences',
      description: 'Suivi présences',
      icon: Users,
      color: 'bg-teal-500',
      onClick: () => navigate('/dashboard/gestionnaire/presences')
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Session React Avancé',
      date: '2024-01-25',
      time: '09:00',
      participants: 15,
      formateur: 'Marie Dubois'
    },
    {
      id: 2,
      title: 'Évaluation JavaScript',
      date: '2024-01-26',
      time: '14:00',
      participants: 18,
      formateur: 'Jean Martin'
    },
    {
      id: 3,
      title: 'Début formation Angular',
      date: '2024-01-27',
      time: '10:00',
      participants: 12,
      formateur: 'Sophie Laurent'
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      task: 'Valider 3 nouvelles inscriptions',
      priority: 'high',
      deadline: '2024-01-25'
    },
    {
      id: 2,
      task: 'Préparer rapport mensuel',
      priority: 'medium',
      deadline: '2024-01-30'
    },
    {
      id: 3,
      task: 'Planifier réunion formateurs',
      priority: 'low',
      deadline: '2024-02-01'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleViewEvent = (event: any) => {
    toast({
      title: "Événement",
      description: `Détail de l'événement: ${event.title}`,
    });
  };

  const handleCompleteTask = (taskId: number) => {
    toast({
      title: "Tâche terminée",
      description: "La tâche a été marquée comme terminée",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header avec animation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.first_name || 'Gestionnaire'} ! 
            <span className="inline-block animate-bounce ml-2">👋</span>
          </h1>
          <p className="text-gray-600">Vue d'ensemble des activités de formation</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/dashboard/gestionnaire/apprenants')} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Apprenant
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/gestionnaire/messages')} className="border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
        </div>
      </div>

      {/* Stats Cards avec animations améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Apprenants Actifs"
          value="0"
          change=""
          icon={Users}
          trend="up"
          onClick={() => navigate('/dashboard/gestionnaire/apprenants')}
        />
        <StatsCard
          title="Formations En Cours"
          value="0"
          change=""
          icon={BookOpen}
          trend="up"
          onClick={() => navigate('/dashboard/gestionnaire/formations')}
        />
        <StatsCard
          title="Taux de Réussite"
          value="0%"
          change=""
          icon={TrendingUp}
          trend="up"
          onClick={() => navigate('/dashboard/gestionnaire/rapports')}
        />
        <StatsCard
          title="Sessions Planifiées"
          value="0"
          change=""
          icon={Calendar}
          trend="up"
          onClick={() => navigate('/dashboard/gestionnaire/planning')}
        />
      </div>

      {/* Graphiques interactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart
          title="Évolution des Inscriptions"
          data={chartData}
          type="line"
          dataKey="inscriptions"
          color="#3b82f6"
          showControls={true}
        />
        <InteractiveChart
          title="Taux d'Abandon"
          data={chartData}
          type="bar"
          dataKey="abandons"
          color="#ef4444"
          showControls={true}
        />
      </div>

      {/* Timeline et événements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineComponent
          items={timelineItems}
          title="Activités Récentes"
        />

        {/* Événements à venir améliorés */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                Événements à Venir
              </span>
              <Button variant="ghost" size="sm" className="hover:bg-pink-50 transition-colors">
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md cursor-pointer transition-all duration-300 group"
                  onClick={() => handleViewEvent(event)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-pink-700 transition-colors">{event.title}</h4>
                    <Badge variant="outline" className="group-hover:border-pink-300 group-hover:text-pink-700 transition-colors">
                      {event.participants} participants
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.date} à {event.time}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Par {event.formateur}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tâches en attente améliorées */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-pink-600" />
              Tâches en Attente
            </span>
            <Button variant="ghost" size="sm" className="hover:bg-pink-50 transition-colors">
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-pink-50 transition-all duration-300 group">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-pink-700 transition-colors">{task.task}</p>
                  <p className="text-sm text-gray-500">Échéance: {task.deadline}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(task.priority)} transition-all duration-300`}>
                    {task.priority}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCompleteTask(task.id)}
                    className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides avec le nouveau composant */}
      <QuickActionsGrid actions={quickActions} />
    </div>
  );
};
