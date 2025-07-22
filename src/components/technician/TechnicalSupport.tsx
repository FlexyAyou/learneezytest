import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Clock, User, MessageSquare, Paperclip } from "lucide-react";
import { useState } from "react";

const incidents = [
  {
    id: "INC-001",
    title: "Problème de connexion aux quiz",
    description: "Les étudiants ne peuvent pas accéder aux quiz du module Math",
    priority: "high",
    status: "nouveau",
    user: "Marie Dubois",
    date: "2024-01-22",
    attachments: ["screenshot.png"]
  },
  {
    id: "INC-002", 
    title: "Vidéos qui ne se chargent pas",
    description: "Les vidéos du cours d'anglais restent en tampon",
    priority: "medium",
    status: "en-cours",
    user: "Pierre Martin",
    date: "2024-01-21",
    attachments: []
  },
  {
    id: "INC-003",
    title: "Erreur de sauvegarde des notes",
    description: "Les notes ne sont pas enregistrées après validation",
    priority: "high",
    status: "resolu",
    user: "Sophie Laurent",
    date: "2024-01-20",
    attachments: ["error-log.txt"]
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "nouveau": return "destructive";
    case "en-cours": return "default";
    case "resolu": return "secondary";
    default: return "default";
  }
};

export function TechnicalSupport() {
  const [filter, setFilter] = useState({ priority: "", status: "", user: "" });
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [response, setResponse] = useState("");

  const filteredIncidents = incidents.filter(incident => {
    return (!filter.priority || filter.priority === "all" || incident.priority === filter.priority) &&
           (!filter.status || filter.status === "all" || incident.status === filter.status) &&
           (!filter.user || incident.user.toLowerCase().includes(filter.user.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Technique</h2>
        <div className="flex gap-2">
          <Select value={filter.priority} onValueChange={(value) => setFilter({...filter, priority: value})}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="en-cours">En cours</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            placeholder="Rechercher par utilisateur"
            value={filter.user}
            onChange={(e) => setFilter({...filter, user: e.target.value})}
            className="w-60"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                  <Badge variant={getPriorityColor(incident.priority)}>
                    {incident.priority === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {incident.priority === "medium" && <Clock className="w-3 h-3 mr-1" />}
                    {incident.priority === "high" ? "Haute" : incident.priority === "medium" ? "Moyenne" : "Basse"}
                  </Badge>
                  <Badge variant={getStatusColor(incident.status)}>
                    {incident.status === "resolu" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {incident.status === "nouveau" ? "Nouveau" : incident.status === "en-cours" ? "En cours" : "Résolu"}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{incident.date}</span>
              </div>
              <CardTitle className="text-lg">{incident.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{incident.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {incident.user}
                  </div>
                  {incident.attachments.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Paperclip className="w-4 h-4" />
                      {incident.attachments.length} pièce(s) jointe(s)
                    </div>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Répondre
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Répondre à l'incident {incident.id}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>Par {incident.user}</span>
                          <span>•</span>
                          <span>{incident.date}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Votre réponse</label>
                        <Textarea 
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Tapez votre réponse..."
                          className="min-h-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button>Envoyer la réponse</Button>
                        <Button variant="outline">Marquer comme résolu</Button>
                        <Button variant="outline">Demander plus d'informations</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}