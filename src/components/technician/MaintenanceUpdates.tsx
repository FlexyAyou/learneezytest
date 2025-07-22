import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const maintenanceOperations = [
  {
    id: "MAINT-001",
    name: "Mise à jour du module de quiz",
    description: "Correction des bugs et ajout de nouvelles fonctionnalités",
    date: "2024-01-25",
    time: "02:00",
    duration: "2h",
    status: "planifiee",
    type: "mise-a-jour"
  },
  {
    id: "MAINT-002",
    name: "Nettoyage base de données",
    description: "Suppression des données obsolètes et optimisation des performances",
    date: "2024-01-20",
    time: "01:00",
    duration: "3h",
    status: "terminee",
    type: "maintenance"
  },
  {
    id: "MAINT-003",
    name: "Optimisation serveur",
    description: "Mise à jour de la configuration serveur pour améliorer les performances",
    date: "2024-01-30",
    time: "03:00",
    duration: "1h30",
    status: "planifiee",
    type: "optimisation"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "planifiee": return "default";
    case "en-cours": return "destructive";
    case "terminee": return "secondary";
    default: return "default";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "mise-a-jour": return "default";
    case "maintenance": return "secondary";
    case "optimisation": return "outline";
    default: return "default";
  }
};

export function MaintenanceUpdates() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    type: "maintenance"
  });

  const handleAddMaintenance = () => {
    // Logique pour ajouter une nouvelle maintenance
    console.log("Nouvelle maintenance:", newMaintenance);
    setShowAddDialog(false);
    setNewMaintenance({ name: "", description: "", date: "", time: "", duration: "", type: "maintenance" });
  };

  const upcomingMaintenance = maintenanceOperations.filter(op => op.status === "planifiee");
  const pastMaintenance = maintenanceOperations.filter(op => op.status === "terminee");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance & Mises à jour</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Planifier une maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Planifier une opération de maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nom de l'opération</label>
                <Input 
                  value={newMaintenance.name}
                  onChange={(e) => setNewMaintenance({...newMaintenance, name: e.target.value})}
                  placeholder="Ex: Mise à jour du système de messagerie"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea 
                  value={newMaintenance.description}
                  onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                  placeholder="Description détaillée de l'opération"
                  className="min-h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input 
                    type="date"
                    value={newMaintenance.date}
                    onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Heure</label>
                  <Input 
                    type="time"
                    value={newMaintenance.time}
                    onChange={(e) => setNewMaintenance({...newMaintenance, time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Durée estimée</label>
                <Input 
                  value={newMaintenance.duration}
                  onChange={(e) => setNewMaintenance({...newMaintenance, duration: e.target.value})}
                  placeholder="Ex: 2h30"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddMaintenance}>Planifier</Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Annuler</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Maintenances à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Maintenances programmées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMaintenance.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune maintenance programmée</p>
          ) : (
            <div className="space-y-4">
              {upcomingMaintenance.map((maintenance) => (
                <div key={maintenance.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{maintenance.name}</h4>
                      <Badge variant={getTypeColor(maintenance.type)}>
                        {maintenance.type === "mise-a-jour" ? "Mise à jour" : 
                         maintenance.type === "maintenance" ? "Maintenance" : "Optimisation"}
                      </Badge>
                      <Badge variant={getStatusColor(maintenance.status)}>
                        <Clock className="w-3 h-3 mr-1" />
                        Programmée
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{maintenance.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📅 {maintenance.date}</span>
                      <span>🕐 {maintenance.time}</span>
                      <span>⏱️ {maintenance.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="outline" size="sm">Notifier</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des maintenances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Historique des maintenances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium">{maintenance.name}</h4>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Terminée
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{maintenance.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📅 {maintenance.date}</span>
                    <span>🕐 {maintenance.time}</span>
                    <span>⏱️ {maintenance.duration}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}