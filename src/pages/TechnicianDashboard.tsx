import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechnicalSupport } from "@/components/technician/TechnicalSupport";
import { MaintenanceUpdates } from "@/components/technician/MaintenanceUpdates";
import { InfrastructureMonitoring } from "@/components/technician/InfrastructureMonitoring";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Settings, 
  Shield,
  Activity,
  Database
} from "lucide-react";

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const systemStats = [
    {
      title: "Système opérationnel",
      value: "99.8%",
      icon: CheckCircle,
      status: "good",
      change: "Temps d'activité"
    },
    {
      title: "Alertes actives",
      value: "3",
      icon: AlertTriangle,
      status: "warning",
      change: "À traiter"
    },
    {
      title: "Serveurs en ligne",
      value: "12/12",
      icon: Server,
      status: "good",
      change: "Infrastructure stable"
    },
    {
      title: "Tickets support",
      value: "7",
      icon: Settings,
      status: "info",
      change: "En cours"
    }
  ];

  const stats = {
    incidents: {
      nouveau: 3,
      enCours: 5,
      resolu: 12
    },
    maintenance: {
      programmee: 2,
      enCours: 0,
      terminee: 8
    },
    infrastructure: {
      serveursActifs: 3,
      alertes: 2,
      sauvegardes: 15
    }
  };

  const recentIncidents = [
    { id: "INC-001", title: "Problème de connexion aux quiz", priority: "high", status: "nouveau" },
    { id: "INC-002", title: "Vidéos qui ne se chargent pas", priority: "medium", status: "en-cours" },
    { id: "INC-003", title: "Erreur de sauvegarde des notes", priority: "high", status: "resolu" }
  ];

  const upcomingMaintenance = [
    { name: "Mise à jour du module de quiz", date: "2024-01-25", time: "02:00" },
    { name: "Optimisation serveur", date: "2024-01-30", time: "03:00" }
  ];

  if (activeTab !== 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
                <TabsTrigger value="support">Support technique</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              </TabsList>
            </div>

            <div className="py-6">
              <TabsContent value="support">
                <TechnicalSupport />
              </TabsContent>
              <TabsContent value="maintenance">
                <MaintenanceUpdates />
              </TabsContent>
              <TabsContent value="infrastructure">
                <InfrastructureMonitoring />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="support">Support technique</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="py-6 space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Technicien</h1>
                <p className="text-muted-foreground">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Support Technique</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-destructive">{stats.incidents.nouveau}</div>
                      <p className="text-xs text-muted-foreground">Nouveaux</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{stats.incidents.enCours}</div>
                      <p className="text-xs text-muted-foreground">En cours</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{stats.incidents.resolu}</div>
                      <p className="text-xs text-muted-foreground">Résolus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{stats.maintenance.programmee}</div>
                      <p className="text-xs text-muted-foreground">Programmées</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{stats.maintenance.enCours}</div>
                      <p className="text-xs text-muted-foreground">En cours</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{stats.maintenance.terminee}</div>
                      <p className="text-xs text-muted-foreground">Terminées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{stats.infrastructure.serveursActifs}</div>
                      <p className="text-xs text-muted-foreground">Serveurs</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">{stats.infrastructure.alertes}</div>
                      <p className="text-xs text-muted-foreground">Alertes</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{stats.infrastructure.sauvegardes}</div>
                      <p className="text-xs text-muted-foreground">Sauvegardes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Incidents récents et maintenances à venir */}
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
                            <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
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
                          <p className="text-xs text-muted-foreground">
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

          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicianDashboard;