
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardChart } from '@/components/common/DashboardChart';
import { SuperAdminStats } from './SuperAdminStats';
import { SuperAdminAlerts } from './SuperAdminAlerts';
import { SuperAdminActivity } from './SuperAdminActivity';
import { SuperAdminQuickActions } from './SuperAdminQuickActions';

export const SuperAdminDashboard = () => {
  // Données pour les graphiques du super admin - avec property 'value' requise
  const platformGrowthData = [
    { name: 'Jan', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
    { name: 'Fév', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
    { name: 'Mar', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
    { name: 'Avr', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
    { name: 'Mai', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
    { name: 'Jun', value: 0, organisations: 0, utilisateurs: 0, cours: 0 },
  ];

  const revenueData = [
    { name: 'Jan', value: 0, revenus: 0, licences: 0, formations: 0 },
    { name: 'Fév', value: 0, revenus: 0, licences: 0, formations: 0 },
    { name: 'Mar', value: 0, revenus: 0, licences: 0, formations: 0 },
    { name: 'Avr', value: 0, revenus: 0, licences: 0, formations: 0 },
    { name: 'Mai', value: 0, revenus: 0, licences: 0, formations: 0 },
    { name: 'Jun', value: 0, revenus: 0, licences: 0, formations: 0 },
  ];

  const systemHealthData = [
    { name: 'Lun', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Mar', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Mer', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Jeu', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Ven', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Sam', value: 0, uptime: 0, performance: 0, erreurs: 0 },
    { name: 'Dim', value: 0, uptime: 0, performance: 0, erreurs: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <SuperAdminQuickActions />
      </div>

      {/* Statistiques principales */}
      <SuperAdminStats />

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Croissance de la plateforme"
          data={platformGrowthData}
          type="line"
          dataKey="utilisateurs"
          color="#3b82f6"
        />
        <DashboardChart
          title="Évolution des revenus (€)"
          data={revenueData}
          type="bar"
          dataKey="revenus"
          color="#10b981"
        />
      </div>

      {/* Santé du système */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardChart
          title="Santé du système (derniers 7 jours)"
          data={systemHealthData}
          type="line"
          dataKey="uptime"
          color="#8b5cf6"
        />
      </div>

      {/* Alertes et activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuperAdminAlerts />
        <SuperAdminActivity />
      </div>

      {/* Métriques avancées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top organismes (revenus)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center py-4">Aucune donnée disponible</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Incidents récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center py-4">Aucun incident récent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Objectifs mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nouveaux organismes</span>
                  <span>0/0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenus (€0)</span>
                  <span>€0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Satisfaction (0%)</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
