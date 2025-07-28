import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Settings,
  TrendingUp,
  Database,
  Wifi,
  Shield,
  FileText,
  Wrench,
  Monitor,
  Activity
} from 'lucide-react';

import { InfrastructureMonitoring } from '@/components/technician/InfrastructureMonitoring';
import { TechnicalSupport } from '@/components/technician/TechnicalSupport';
import { MaintenanceUpdates } from '@/components/technician/MaintenanceUpdates';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const TechnicianDashboardHome = () => {
  const stats = [
    {
      title: "Uptime système",
      value: "99.8%",
      icon: Server,
      change: "+0.2% ce mois",
      changeType: "positive" as const,
      color: "text-green-600"
    },
    {
      title: "Tickets ouverts",
      value: "3",
      icon: AlertTriangle,
      change: "-2 aujourd'hui",
      changeType: "positive" as const,
      color: "text-orange-600"
    },
    {
      title: "Utilisateurs connectés",
      value: "847",
      icon: Users,
      change: "En temps réel",
      changeType: "neutral" as const,
      color: "text-blue-600"
    },
    {
      title: "Alertes critiques",
      value: "0",
      icon: Shield,
      change: "Système stable",
      changeType: "positive" as const,
      color: "text-purple-600"
    }
  ];

  const systemData = [
    { name: 'Lun', value: 99.9, tickets: 5 },
    { name: 'Mar', value: 99.8, tickets: 3 },
    { name: 'Mer', value: 99.9, tickets: 2 },
    { name: 'Jeu', value: 99.7, tickets: 8 },
    { name: 'Ven', value: 99.8, tickets: 4 },
    { name: 'Sam', value: 99.9, tickets: 1 }
  ];

  const performanceData = [
    { name: 'CPU', value: 65 },
    { name: 'Mémoire', value: 78 },
    { name: 'Disque', value: 45 },
    { name: 'Réseau', value: 32 }
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'Problème disque détecté', time: '1h' },
    { id: 2, type: 'info', message: 'Mise à jour planifiée', time: '3h' },
    { id: 3, type: 'success', message: 'Backup réussi', time: '6h' },
  ];

  const systemStatus = [
    { id: 1, name: 'Serveur principal', status: 'Opérationnel' },
    { id: 2, name: 'Base de données', status: 'Opérationnel' },
    { id: 3, name: 'Réseau', status: 'Dégradé' },
    { id: 4, name: 'Applications', status: 'Opérationnel' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Opérationnel': return 'bg-green-100 text-green-800';
      case 'Dégradé': return 'bg-yellow-100 text-yellow-800';
      case 'Hors service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Technique</h1>
          <p className="text-gray-600">Surveillance et maintenance de l'infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Tous systèmes opérationnels
          </Badge>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            Surveillance en temps réel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Uptime et tickets (7 derniers jours)"
          data={systemData}
          type="area"
          dataKey="value"
          color="#10B981"
          height={300}
        />
        
        <DashboardChart
          title="Utilisation des ressources"
          data={performanceData}
          type="bar"
          height={300}
          color="#F59E0B"
        />
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes Récentes</CardTitle>
          <CardDescription>Dernières notifications système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
                  {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500">Il y a {alert.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>État du Système</CardTitle>
          <CardDescription>Statut des composants clés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemStatus.map((component) => (
              <div key={component.id} className="flex items-center justify-between p-3 border rounded-lg">
                <p className="font-medium">{component.name}</p>
                <Badge className={getStatusColor(component.status)}>
                  {component.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TechnicianDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/technicien', icon: TrendingUp, isActive: true },
    { title: 'Monitoring', href: '/technicien/monitoring', icon: Monitor },
    { title: 'Support technique', href: '/technicien/support', icon: Wrench },
    { title: 'Maintenance', href: '/technicien/maintenance', icon: Settings },
    { title: 'Serveurs', href: '/technicien/serveurs', icon: Server },
    { title: 'Base de données', href: '/technicien/database', icon: Database },
    { title: 'Réseau', href: '/technicien/network', icon: Wifi },
    { title: 'Sécurité', href: '/technicien/security', icon: Shield },
    { title: 'Logs', href: '/technicien/logs', icon: FileText },
  ];

  const userInfo = {
    name: "Marc Dupont",
    email: "marc.dupont@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Technicien"
        subtitle="Infrastructure & Support"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<TechnicianDashboardHome />} />
          <Route path="/monitoring" element={<InfrastructureMonitoring />} />
          <Route path="/support" element={<TechnicalSupport />} />
          <Route path="/maintenance" element={<MaintenanceUpdates />} />
          <Route path="/serveurs" element={<InfrastructureMonitoring />} />
          <Route path="/database" element={<InfrastructureMonitoring />} />
          <Route path="/network" element={<InfrastructureMonitoring />} />
          <Route path="/security" element={<InfrastructureMonitoring />} />
          <Route path="/logs" element={<TechnicalSupport />} />
        </Routes>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
