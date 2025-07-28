
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Settings, 
  Shield,
  Activity,
  Database,
  Monitor,
  Wrench,
  HelpCircle
} from 'lucide-react';

import { TechnicalSupport } from '@/components/technician/TechnicalSupport';
import { MaintenanceUpdates } from '@/components/technician/MaintenanceUpdates';
import { InfrastructureMonitoring } from '@/components/technician/InfrastructureMonitoring';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const TechnicianDashboardHome = () => {
  const systemStats = [
    {
      title: "Système opérationnel",
      value: "99.8%",
      icon: CheckCircle,
      change: "+0.2% ce mois",
      changeType: "positive" as const,
      description: "Temps d'activité",
      color: "text-green-600"
    },
    {
      title: "Alertes actives",
      value: "3",
      icon: AlertTriangle,
      change: "-2 depuis hier",
      changeType: "positive" as const,
      description: "À traiter",
      color: "text-orange-600"
    },
    {
      title: "Serveurs en ligne",
      value: "12/12",
      icon: Server,
      change: "Stable",
      changeType: "neutral" as const,
      description: "Infrastructure",
      color: "text-blue-600"
    },
    {
      title: "Tickets support",
      value: "7",
      icon: HelpCircle,
      change: "+2 aujourd'hui",
      changeType: "negative" as const,
      description: "En cours",
      color: "text-purple-600"
    }
  ];

  const performanceData = [
    { name: 'Lun', uptime: 99.9, tickets: 2 },
    { name: 'Mar', uptime: 99.7, tickets: 5 },
    { name: 'Mer', uptime: 99.8, tickets: 3 },
    { name: 'Jeu', uptime: 99.9, tickets: 1 },
    { name: 'Ven', uptime: 99.6, tickets: 4 },
    { name: 'Sam', uptime: 99.9, tickets: 2 },
    { name: 'Dim', uptime: 99.8, tickets: 3 }
  ];

  const incidentsByType = [
    { name: 'Réseau', value: 35 },
    { name: 'Serveur', value: 25 },
    { name: 'Application', value: 20 },
    { name: 'Sécurité', value: 15 },
    { name: 'Autres', value: 5 }
  ];

  const recentIncidents = [
    { id: "INC-001", title: "Problème de connexion aux quiz", priority: "high", status: "nouveau" },
    { id: "INC-002", title: "Vidéos qui ne se chargent pas", priority: "medium", status: "en-cours" },
    { id: "INC-003", title: "Erreur de sauvegarde des notes", priority: "high", status: "resolu" }
  ];

  const upcomingMaintenance = [
    { name: "Mise à jour du module de quiz", date: "2024-01-25", time: "02:00" },
    { name: "Optimisation serveur", date: "2024-01-30", time: "03:00" }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Technicien</h1>
          <p className="text-gray-600">
            Supervision technique et maintenance de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Système opérationnel
          </Badge>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Performance Système (7 derniers jours)"
          data={performanceData}
          type="line"
          dataKey="uptime"
          color="#10B981"
          height={300}
        />
        
        <DashboardChart
          title="Répartition des Incidents"
          data={incidentsByType}
          type="pie"
          height={300}
        />
      </div>

      {/* Incidents et maintenances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Incidents Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">{incident.id}</span>
                      <Badge variant={incident.priority === "high" ? "destructive" : "default"} className="text-xs">
                        {incident.priority === "high" ? "Haute" : "Moyenne"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{incident.title}</p>
                  </div>
                  <Badge variant={incident.status === "resolu" ? "secondary" : incident.status === "nouveau" ? "destructive" : "outline"}>
                    {incident.status === "nouveau" ? "Nouveau" : incident.status === "en-cours" ? "En cours" : "Résolu"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Maintenances Programmées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{maintenance.name}</p>
                    <p className="text-xs text-gray-500">
                      {maintenance.date} à {maintenance.time}
                    </p>
                  </div>
                  <Badge variant="outline">Programmée</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TechnicianDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/technicien', icon: Activity, isActive: true },
    { title: 'Support technique', href: '/technicien/support', icon: HelpCircle },
    { title: 'Maintenance', href: '/technicien/maintenance', icon: Wrench },
    { title: 'Infrastructure', href: '/technicien/infrastructure', icon: Server },
    { title: 'Monitoring', href: '/technicien/monitoring', icon: Monitor },
    { title: 'Sécurité', href: '/technicien/securite', icon: Shield },
    { title: 'Base de données', href: '/technicien/database', icon: Database },
    { title: 'Paramètres', href: '/technicien/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Alex Dubois",
    email: "alex.dubois@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Technicien"
        subtitle="Supervision & Maintenance"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<TechnicianDashboardHome />} />
          <Route path="/support" element={<TechnicalSupport />} />
          <Route path="/maintenance" element={<MaintenanceUpdates />} />
          <Route path="/infrastructure" element={<InfrastructureMonitoring />} />
          <Route path="/monitoring" element={<InfrastructureMonitoring />} />
          <Route path="/securite" element={<TechnicalSupport />} />
          <Route path="/database" element={<InfrastructureMonitoring />} />
          <Route path="/parametres" element={<TechnicalSupport />} />
        </Routes>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
