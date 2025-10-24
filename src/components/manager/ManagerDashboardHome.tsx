
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

  const chartData: any[] = [];
  const timelineItems: any[] = [];

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

  const upcomingEvents: any[] = [];
  const pendingTasks: any[] = [];

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
          change="Aucune donnée"
          icon={Users}
          trend="neutral"
          onClick={() => navigate('/dashboard/gestionnaire/apprenants')}
        />
        <StatsCard
          title="Formations En Cours"
          value="0"
          change="Aucune donnée"
          icon={BookOpen}
          trend="neutral"
          onClick={() => navigate('/dashboard/gestionnaire/formations')}
        />
        <StatsCard
          title="Taux de Réussite"
          value="0%"
          change="Aucune donnée"
          icon={TrendingUp}
          trend="neutral"
          onClick={() => navigate('/dashboard/gestionnaire/rapports')}
        />
        <StatsCard
          title="Sessions Planifiées"
          value="0"
          change="Aucune donnée"
          icon={Calendar}
          trend="neutral"
          onClick={() => navigate('/dashboard/gestionnaire/planning')}
        />
      </div>

      {/* Message d'information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Aucune donnée disponible</h3>
              <p className="text-sm text-blue-700">
                Commencez par ajouter des apprenants et des formations pour voir les statistiques et activités apparaître ici.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides avec le nouveau composant */}
      <QuickActionsGrid actions={quickActions} />
    </div>
  );
};
