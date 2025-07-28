
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  BookOpen, 
  Mail, 
  Award, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OFRecentActivities = () => {
  const navigate = useNavigate();

  const recentActivities = [
    {
      id: 1,
      type: 'inscription',
      title: 'Nouvelle inscription',
      description: 'Marie Dupont s\'est inscrite à la formation React',
      time: '2h',
      status: 'pending',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'document',
      title: 'Document généré',
      description: 'Attestation de formation pour Jean Martin',
      time: '4h',
      status: 'completed',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'evaluation',
      title: 'Évaluation terminée',
      description: 'Sophie Bernard a terminé son évaluation finale',
      time: '6h',
      status: 'completed',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'envoi',
      title: 'Convocation envoyée',
      description: 'Convocation envoyée à 15 apprenants',
      time: '1j',
      status: 'sent',
      icon: Mail,
      color: 'text-orange-600'
    },
    {
      id: 5,
      type: 'formation',
      title: 'Session terminée',
      description: 'Formation JavaScript - Session du matin',
      time: '1j',
      status: 'completed',
      icon: BookOpen,
      color: 'text-indigo-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'En attente', icon: Clock },
      completed: { variant: 'default' as const, label: 'Terminé', icon: CheckCircle },
      sent: { variant: 'secondary' as const, label: 'Envoyé', icon: Mail },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getActionByType = (type: string) => {
    const actions = {
      inscription: () => navigate('/dashboard/organisme-formation/apprenants'),
      document: () => navigate('/dashboard/organisme-formation/documents'),
      evaluation: () => navigate('/dashboard/organisme-formation/suivi'),
      envoi: () => navigate('/dashboard/organisme-formation/envois'),
      formation: () => navigate('/dashboard/organisme-formation/formations'),
    };
    return actions[type as keyof typeof actions] || (() => {});
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Activités récentes
          </span>
          <Button variant="outline" size="sm">Voir tout</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={getActionByType(activity.type)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
