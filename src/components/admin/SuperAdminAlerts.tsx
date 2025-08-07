
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Server, CreditCard, Eye, Settings } from 'lucide-react';

export const SuperAdminAlerts = () => {
  const alerts = [
    { 
      type: 'critical', 
      title: 'Pic de charge serveur détecté', 
      message: 'Utilisation CPU > 85% depuis 15 minutes',
      time: '5 min',
      icon: Server,
      action: 'Voir métriques'
    },
    { 
      type: 'warning', 
      title: 'Tentatives de connexion suspectes', 
      message: '12 tentatives de force brute sur comptes admin',
      time: '1h',
      icon: Shield,
      action: 'Analyser'
    },
    { 
      type: 'info', 
      title: 'Nouveau contrat OF en attente', 
      message: 'Formation Plus demande validation pour 500 licences',
      time: '2h',
      icon: CreditCard,
      action: 'Examiner'
    },
    { 
      type: 'warning', 
      title: 'Quota de stockage atteint', 
      message: '3 organismes ont dépassé leur limite de stockage',
      time: '4h',
      icon: AlertTriangle,
      action: 'Gérer'
    }
  ];

  const getAlertColor = (type: string) => {
    const colors = {
      critical: 'border-red-500 bg-red-50',
      warning: 'border-orange-500 bg-orange-50',
      info: 'border-blue-500 bg-blue-50',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getBadgeVariant = (type: string) => {
    const variants = {
      critical: 'destructive' as const,
      warning: 'default' as const,
      info: 'outline' as const,
    };
    return variants[type as keyof typeof variants] || 'outline';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Alertes système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <alert.icon className="h-5 w-5 mt-0.5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Gérer toutes les alertes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
