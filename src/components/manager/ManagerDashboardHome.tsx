
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
  Edit,
  Mail,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DashboardChart } from '@/components/common/DashboardChart';
import { StatsCard } from '@/components/common/StatsCard';

interface ChartData {
  name: string;
  value: number;
  inscriptions?: number;
  abandons?: number;
}

export const ManagerDashboardHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const chartData: ChartData[] = [
    { name: 'Jan', value: 45, inscriptions: 45, abandons: 5 },
    { name: 'Fév', value: 52, inscriptions: 52, abandons: 8 },
    { name: 'Mar', value: 48, inscriptions: 48, abandons: 3 },
    { name: 'Avr', value: 61, inscriptions: 61, abandons: 7 },
    { name: 'Mai', value: 55, inscriptions: 55, abandons: 4 },
    { name: 'Jun', value: 67, inscriptions: 67, abandons: 6 },
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'inscription', 
      message: 'Nouvelle inscription de Marie Dupont en React Avancé',
      time: '2h',
      icon: UserCheck,
      color: 'text-green-600'
    },
    { 
      id: 2, 
      type: 'completion', 
      message: 'Jean Martin a terminé la formation JavaScript',
      time: '3h',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    { 
      id: 3, 
      type: 'absence', 
      message: 'Sophie Bernard absente à la session Angular',
      time: '4h',
      icon: XCircle,
      color: 'text-red-600'
    },
    { 
      id: 4, 
      type: 'planning', 
      message: 'Nouvelle session Vue.js planifiée pour le 15 février',
      time: '5h',
      icon: Calendar,
      color: 'text-purple-600'
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

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'add-student':
        navigate('/dashboard/gestionnaire/apprenants');
        toast({
          title: "Redirection",
          description: "Ouverture de la page de gestion des apprenants",
        });
        break;
      case 'add-formation':
        navigate('/dashboard/gestionnaire/formations');
        toast({
          title: "Redirection",
          description: "Ouverture de la page de gestion des formations",
        });
        break;
      case 'view-planning':
        navigate('/dashboard/gestionnaire/planning');
        toast({
          title: "Redirection",
          description: "Ouverture du planning",
        });
        break;
      case 'view-reports':
        navigate('/dashboard/gestionnaire/rapports');
        toast({
          title: "Redirection",
          description: "Ouverture des rapports",
        });
        break;
      case 'send-message':
        navigate('/dashboard/gestionnaire/messages');
        toast({
          title: "Redirection",
          description: "Ouverture de la messagerie",
        });
        break;
      default:
        toast({
          title: "Action",
          description: `Action ${action} exécutée`,
        });
    }
  };

  const handleViewActivity = (activity: any) => {
    toast({
      title: "Activité",
      description: `Détail de l'activité: ${activity.message}`,
    });
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

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Gestionnaire</h1>
          <p className="text-gray-600">Vue d'ensemble des activités de formation</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleQuickAction('add-student')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Apprenant
          </Button>
          <Button variant="outline" onClick={() => handleQuickAction('send-message')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Apprenants Actifs"
          value="124"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          onClick={() => navigate('/dashboard/gestionnaire/apprenants')}
        />
        <StatsCard
          title="Formations En Cours"
          value="8"
          icon={BookOpen}
          trend={{ value: 2, isPositive: true }}
          onClick={() => navigate('/dashboard/gestionnaire/formations')}
        />
        <StatsCard
          title="Taux de Réussite"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          onClick={() => navigate('/dashboard/gestionnaire/rapports')}
        />
        <StatsCard
          title="Sessions Planifiées"
          value="15"
          icon={Calendar}
          trend={{ value: 3, isPositive: true }}
          onClick={() => navigate('/dashboard/gestionnaire/planning')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution des Inscriptions"
          data={chartData}
          dataKey="inscriptions"
          color="#3b82f6"
        />
        <DashboardChart
          title="Taux d'Abandon"
          data={chartData}
          dataKey="abandons"
          color="#ef4444"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Activités Récentes
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleQuickAction('view-reports')}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewActivity(activity)}
                  >
                    <IconComponent className={`h-5 w-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Événements à Venir
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleQuickAction('view-planning')}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewEvent(event)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge variant="outline">{event.participants} participants</Badge>
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

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Tâches en Attente
              </span>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <p className="text-sm text-gray-500">Échéance: {task.deadline}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => handleQuickAction('add-student')}
            >
              <UserCheck className="h-5 w-5" />
              <span className="text-xs">Ajouter Apprenant</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => handleQuickAction('add-formation')}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Nouvelle Formation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => handleQuickAction('view-planning')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Planning</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => handleQuickAction('view-reports')}
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Rapports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => handleQuickAction('send-message')}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => navigate('/dashboard/gestionnaire/presences')}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Présences</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
