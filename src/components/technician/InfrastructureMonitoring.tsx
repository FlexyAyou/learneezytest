import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  HardDrive, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Shield,
  Database
} from "lucide-react";

const serverStatus = [
  {
    name: "Serveur Web Principal",
    status: "active",
    cpu: 45,
    memory: 68,
    disk: 32,
    uptime: "15j 8h 23m"
  },
  {
    name: "Serveur Base de Données",
    status: "active", 
    cpu: 23,
    memory: 89,
    disk: 76,
    uptime: "15j 8h 23m"
  },
  {
    name: "Serveur de Fichiers",
    status: "warning",
    cpu: 78,
    memory: 92,
    disk: 45,
    uptime: "10j 2h 15m"
  }
];

const alerts = [
  {
    id: "ALERT-001",
    type: "warning",
    message: "Utilisation mémoire élevée sur Serveur de Fichiers (92%)",
    timestamp: "2024-01-22 14:30"
  },
  {
    id: "ALERT-002", 
    type: "info",
    message: "Sauvegarde automatique terminée avec succès",
    timestamp: "2024-01-22 03:00"
  },
  {
    id: "ALERT-003",
    type: "error",
    message: "Tentative d'accès non autorisé détectée",
    timestamp: "2024-01-22 10:15"
  }
];

const backups = [
  {
    id: "BACKUP-001",
    date: "2024-01-22",
    time: "03:00",
    size: "2.4 GB",
    status: "success",
    type: "Automatique"
  },
  {
    id: "BACKUP-002",
    date: "2024-01-21", 
    time: "03:00",
    size: "2.3 GB",
    status: "success",
    type: "Automatique"
  },
  {
    id: "BACKUP-003",
    date: "2024-01-20",
    time: "15:30",
    size: "2.4 GB", 
    status: "success",
    type: "Manuel"
  }
];

const getProgressColor = (value: number) => {
  if (value >= 90) return "bg-destructive";
  if (value >= 70) return "bg-yellow-500";
  return "bg-primary";
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "error": return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "info": return <CheckCircle className="w-4 h-4 text-primary" />;
    default: return <CheckCircle className="w-4 h-4" />;
  }
};

export function InfrastructureMonitoring() {
  const handleManualBackup = () => {
    console.log("Lancement sauvegarde manuelle");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supervision Infrastructure</h2>
        <Button onClick={handleManualBackup}>
          <Download className="w-4 h-4 mr-2" />
          Sauvegarde manuelle
        </Button>
      </div>

      {/* Statut des serveurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serverStatus.map((server, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  {server.name}
                </CardTitle>
                <Badge variant={server.status === "active" ? "secondary" : "destructive"}>
                  {server.status === "active" ? "Actif" : "Attention"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      CPU
                    </span>
                    <span>{server.cpu}%</span>
                  </div>
                  <Progress value={server.cpu} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Mémoire
                    </span>
                    <span>{server.memory}%</span>
                  </div>
                  <Progress value={server.memory} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      Disque
                    </span>
                    <span>{server.disk}%</span>
                  </div>
                  <Progress value={server.disk} className="h-2" />
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Uptime: {server.uptime}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Alertes Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === "error" ? "border-destructive" :
                alert.type === "warning" ? "border-yellow-500" : ""
              }>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertDescription>{alert.message}</AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm">Traiter</Button>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sauvegardes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Sauvegardes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{backup.date} à {backup.time}</span>
                      <Badge variant="outline">{backup.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Taille: {backup.size}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Télécharger</Button>
                  <Button variant="ghost" size="sm">Restaurer</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions critiques récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Actions Critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 text-sm">
              <span>Mise à jour système de sécurité</span>
              <span className="text-muted-foreground">2024-01-22 08:30</span>
            </div>
            <div className="flex items-center justify-between p-2 text-sm">
              <span>Restauration base de données utilisateurs</span>
              <span className="text-muted-foreground">2024-01-21 16:45</span>
            </div>
            <div className="flex items-center justify-between p-2 text-sm">
              <span>Redémarrage serveur principal</span>
              <span className="text-muted-foreground">2024-01-20 02:15</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}