
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
    { name: 'Jan', value: 8420, organisations: 32, utilisateurs: 8420, cours: 856 },
    { name: 'Fév', value: 9200, organisations: 35, utilisateurs: 9200, cours: 924 },
    { name: 'Mar', value: 10100, organisations: 38, utilisateurs: 10100, cours: 1045 },
    { name: 'Avr', value: 11200, organisations: 42, utilisateurs: 11200, cours: 1156 },
    { name: 'Mai', value: 11800, organisations: 44, utilisateurs: 11800, cours: 1203 },
    { name: 'Jun', value: 12847, organisations: 47, utilisateurs: 12847, cours: 1256 },
  ];

  const revenueData = [
    { name: 'Jan', value: 142000, revenus: 142000, licences: 98000, formations: 44000 },
    { name: 'Fév', value: 158000, revenus: 158000, licences: 112000, formations: 46000 },
    { name: 'Mar', value: 176000, revenus: 176000, licences: 125000, formations: 51000 },
    { name: 'Avr', value: 194000, revenus: 194000, licences: 138000, formations: 56000 },
    { name: 'Mai', value: 212000, revenus: 212000, licences: 152000, formations: 60000 },
    { name: 'Jun', value: 230000, revenus: 230000, licences: 165000, formations: 65000 },
  ];

  const systemHealthData = [
    { name: 'Lun', value: 99.9, uptime: 99.9, performance: 95, erreurs: 2 },
    { name: 'Mar', value: 99.8, uptime: 99.8, performance: 97, erreurs: 1 },
    { name: 'Mer', value: 100, uptime: 100, performance: 96, erreurs: 0 },
    { name: 'Jeu', value: 99.7, uptime: 99.7, performance: 94, erreurs: 3 },
    { name: 'Ven', value: 99.9, uptime: 99.9, performance: 98, erreurs: 1 },
    { name: 'Sam', value: 100, uptime: 100, performance: 99, erreurs: 0 },
    { name: 'Dim', value: 99.8, uptime: 99.8, performance: 97, erreurs: 1 },
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
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">MegaFormation</span>
                <span className="text-sm text-green-600">€50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">TechFormation Pro</span>
                <span className="text-sm text-green-600">€32,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">EduExpert</span>
                <span className="text-sm text-green-600">€28,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Formation Plus</span>
                <span className="text-sm text-green-600">€25,200</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Incidents récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Surcharge serveur</span>
                <span className="text-xs text-orange-600">Résolu</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tentatives intrusion</span>
                <span className="text-xs text-red-600">En cours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Erreur base données</span>
                <span className="text-xs text-green-600">Corrigé</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Maintenance réseau</span>
                <span className="text-xs text-blue-600">Planifiée</span>
              </div>
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
                  <span>5/8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenus (€300k)</span>
                  <span>€230k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '76.7%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Satisfaction (95%)</span>
                  <span>94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98.9%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
