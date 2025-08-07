
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, BookOpen, Shield, CreditCard, Settings, AlertTriangle } from 'lucide-react';

export const SuperAdminActivity = () => {
  const recentActivity = [
    { 
      type: 'organization', 
      title: 'Nouvel organisme inscrit', 
      description: 'TechFormation Pro a rejoint la plateforme',
      time: '2 min',
      icon: Building,
      color: 'text-blue-600'
    },
    { 
      type: 'security', 
      title: 'Mise à jour sécurité appliquée', 
      description: 'Correctif de sécurité v2.1.4 déployé avec succès',
      time: '15 min',
      icon: Shield,
      color: 'text-green-600'
    },
    { 
      type: 'user', 
      title: 'Pic d\'inscriptions détecté', 
      description: '127 nouveaux utilisateurs en 1h (FormationExpert)',
      time: '1h',
      icon: Users,
      color: 'text-purple-600'
    },
    { 
      type: 'payment', 
      title: 'Paiement important traité', 
      description: 'Renouvellement annuel - 50,000€ (MegaFormation)',
      time: '2h',
      icon: CreditCard,
      color: 'text-green-600'
    },
    { 
      type: 'course', 
      title: 'Cours signalé pour modération', 
      description: 'Contenu inapproprié signalé dans "Formation Marketing"',
      time: '3h',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    { 
      type: 'system', 
      title: 'Maintenance programmée', 
      description: 'Maintenance base de données prévue demain 2h-4h',
      time: '5h',
      icon: Settings,
      color: 'text-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <Badge variant="outline" className="text-xs mt-2">
                  {activity.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
