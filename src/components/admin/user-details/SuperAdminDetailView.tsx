import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Building, Activity, FileText } from 'lucide-react';

interface SuperAdminDetailViewProps {
  user: any;
  totalUsers: number;
  totalOrganisations: number;
  activeCourses: number;
  pendingApprovals?: number;
}

export const SuperAdminDetailView = ({ 
  user, 
  totalUsers, 
  totalOrganisations, 
  activeCourses,
  pendingApprovals = 0
}: SuperAdminDetailViewProps) => {
  const adminStats = {
    totalUsers,
    totalOrganisations,
    activeCourses,
    pendingApprovals,
    systemHealth: 98.5,
    lastSystemCheck: new Date().toLocaleString('fr-FR')
  };

  const recentActions = [
    { id: 1, action: 'Validation OF "Formation Pro"', date: '2024-01-20 10:30', type: 'approval' },
    { id: 2, action: 'Ajout utilisateur "Marie Dupont"', date: '2024-01-20 09:15', type: 'user' },
    { id: 3, action: 'Mise à jour paramètres système', date: '2024-01-19 16:45', type: 'settings' },
    { id: 4, action: 'Validation cours "React Avancé"', date: '2024-01-19 14:20', type: 'approval' }
  ];

  const permissions = [
    'Gestion complète des utilisateurs',
    'Gestion des organismes de formation',
    'Validation des cours',
    'Configuration système',
    'Gestion de la sécurité',
    'Accès aux logs système',
    'Gestion des paiements',
    'Support technique niveau 3'
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques administrateur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {adminStats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Utilisateurs totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {adminStats.totalOrganisations}
            </div>
            <div className="text-sm text-gray-600">Organismes de formation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {adminStats.activeCourses}
            </div>
            <div className="text-sm text-gray-600">Cours actifs</div>
          </CardContent>
        </Card>
      </div>

      {/* Santé du système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Santé du système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Performance globale</span>
              <Badge className="bg-green-100 text-green-800">{adminStats.systemHealth}%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Validations en attente</span>
              <Badge variant="outline">{adminStats.pendingApprovals}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Dernière vérification</span>
              <span className="text-sm">{adminStats.lastSystemCheck}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions et accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Actions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{action.action}</p>
                  <p className="text-sm text-gray-600">{action.date}</p>
                </div>
                <Badge variant="outline">
                  {action.type === 'approval' && '✓ Validation'}
                  {action.type === 'user' && '👤 Utilisateur'}
                  {action.type === 'settings' && '⚙️ Paramètres'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
