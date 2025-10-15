
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, Activity, Users, Database, Lock } from 'lucide-react';
import { useUserDetail } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AdminDetailViewProps {
  user: any;
}

export const AdminDetailView = ({ user }: AdminDetailViewProps) => {
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

  // Mock data spécifique aux administrateurs
  const adminData = {
    permissions: [
      { module: 'Gestion utilisateurs', level: 'Complet', status: 'active' },
      { module: 'Gestion formations', level: 'Lecture/Écriture', status: 'active' },
      { module: 'Paramètres système', level: 'Complet', status: 'active' },
      { module: 'Sécurité', level: 'Lecture seule', status: 'active' },
      { module: 'Base de données', level: 'Lecture seule', status: 'inactive' }
    ],
    recentActions: [
      { action: 'Modification utilisateur', target: 'marie.dubois@email.com', timestamp: '2024-01-20 14:30', status: 'success' },
      { action: 'Création cours', target: 'Formation React Avancée', timestamp: '2024-01-20 11:15', status: 'success' },
      { action: 'Suppression utilisateur', target: 'ancien.user@email.com', timestamp: '2024-01-19 16:45', status: 'success' },
      { action: 'Modification permissions', target: 'gestionnaire.formation', timestamp: '2024-01-19 09:20', status: 'warning' }
    ],
    securityLogs: [
      { event: 'Connexion', ip: '192.168.1.100', timestamp: '2024-01-20 08:00', status: 'success' },
      { event: 'Tentative connexion échouée', ip: '192.168.1.105', timestamp: '2024-01-19 23:45', status: 'failed' },
      { event: 'Changement mot de passe', ip: '192.168.1.100', timestamp: '2024-01-18 14:30', status: 'success' }
    ],
    systemStats: [
      { metric: 'Utilisateurs actifs', value: 1247, change: '+5.2%', period: 'Ce mois' },
      { metric: 'Formations créées', value: 45, change: '+12.3%', period: 'Ce mois' },
      { metric: 'Taux de réussite', value: 87.5, change: '+2.1%', period: 'Ce mois' },
      { metric: 'Revenus générés', value: 45780, change: '+8.7%', period: 'Ce mois' }
    ],
    stats: {
      totalActions: 156,
      successRate: 98.7,
      lastLogin: '2024-01-20 08:00',
      accountAge: 2.5
    }
  };

  const getPermissionBadge = (status: string) => {
    const configs = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' }
    };
    return configs[status as keyof typeof configs] || configs.inactive;
  };

  const getActionStatusBadge = (status: string) => {
    const configs = {
      success: { variant: 'default' as const, label: 'Succès', color: 'text-green-600' },
      warning: { variant: 'outline' as const, label: 'Attention', color: 'text-yellow-600' },
      failed: { variant: 'destructive' as const, label: 'Échec', color: 'text-red-600' }
    };
    return configs[status as keyof typeof configs] || configs.success;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de l'administrateur */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {adminData.stats.totalActions}
            </div>
            <div className="text-sm text-gray-600">Actions totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {adminData.stats.successRate}%
            </div>
            <div className="text-sm text-gray-600">Taux de réussite</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {adminData.stats.accountAge}ans
            </div>
            <div className="text-sm text-gray-600">Ancienneté</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-orange-600 mb-1">
              {adminData.stats.lastLogin}
            </div>
            <div className="text-sm text-gray-600">Dernière connexion</div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions et accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminData.permissions.map((permission, index) => {
              const config = getPermissionBadge(permission.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{permission.module}</p>
                    <p className="text-sm text-gray-600">Niveau: {permission.level}</p>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminData.recentActions.map((action, index) => {
              const config = getActionStatusBadge(action.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-sm text-gray-600">Cible: {action.target}</p>
                    <p className="text-xs text-gray-500">{action.timestamp}</p>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de la plateforme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Statistiques de la plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {adminData.systemStats.map((stat, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{stat.metric}</h4>
                  <Badge variant="outline" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">
                  {typeof stat.value === 'number' && stat.value > 1000 
                    ? stat.value.toLocaleString() 
                    : stat.value}
                  {stat.metric.includes('Taux') || stat.metric.includes('pourcentage') ? '%' : ''}
                  {stat.metric.includes('Revenus') ? '€' : ''}
                </p>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Logs de sécurité récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminData.securityLogs.map((log, index) => {
              const config = getActionStatusBadge(log.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{log.event}</p>
                    <p className="text-sm text-gray-600">IP: {log.ip}</p>
                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
