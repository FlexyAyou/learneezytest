
import React from 'react';
import { Shield, AlertTriangle, Eye, Lock, UserX, Activity, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const AdminSecurity = () => {
  const { toast } = useToast();

  const securityLogs = [
    { 
      id: 1, 
      event: "Tentative de connexion échouée", 
      user: "marie@email.com", 
      ip: "192.168.1.100", 
      time: "2024-01-15 14:30:25",
      severity: "Moyenne"
    },
    { 
      id: 2, 
      event: "Mot de passe modifié", 
      user: "pierre@email.com", 
      ip: "10.0.0.1", 
      time: "2024-01-15 13:15:42",
      severity: "Info"
    },
    { 
      id: 3, 
      event: "Accès admin non autorisé", 
      user: "inconnu@suspect.com", 
      ip: "203.0.113.1", 
      time: "2024-01-15 12:45:18",
      severity: "Haute"
    },
    { 
      id: 4, 
      event: "Connexion depuis nouvel appareil", 
      user: "sophie@email.com", 
      ip: "172.16.0.1", 
      time: "2024-01-15 11:20:30",
      severity: "Basse"
    }
  ];

  const handleBlockUser = (userId: number) => {
    toast({
      title: "Utilisateur bloqué",
      description: `L'utilisateur ${userId} a été bloqué temporairement`,
    });
  };

  const handleExportLogs = () => {
    toast({
      title: "Export des logs",
      description: "Les logs de sécurité ont été exportés avec succès",
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Nécessitent une attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions suspectes</CardTitle>
            <Eye className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Dernières 24h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs bloqués</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Actuellement actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau de sécurité</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Logs de sécurité</CardTitle>
            <CardDescription>Surveillance et monitoring des activités</CardDescription>
          </div>
          <Button onClick={handleExportLogs} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter logs
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Adresse IP</TableHead>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.severity === 'Haute' 
                        ? 'bg-red-100 text-red-800' 
                        : log.severity === 'Moyenne'
                        ? 'bg-yellow-100 text-yellow-800'
                        : log.severity === 'Basse'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBlockUser(log.id)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              Paramètres de sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-600">Sécurité renforcée pour les admins</p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Activé</Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Connexions IP autorisées</p>
                <p className="text-sm text-gray-600">Restreindre l'accès par adresse IP</p>
              </div>
              <Button size="sm" variant="outline">Configurer</Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Sessions automatiques</p>
                <p className="text-sm text-gray-600">Déconnexion après inactivité</p>
              </div>
              <Button size="sm" variant="outline">30 min</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Monitoring en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-800">Système opérationnel</p>
              <p className="text-sm text-green-600">Tous les services fonctionnent normalement</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-800">Surveillance active</p>
              <p className="text-sm text-yellow-600">Détection d'intrusion en cours</p>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                <Calendar className="h-4 w-4 mr-2" />
                Rapport quotidien
              </Button>
              <Button className="flex-1" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Scan sécurité
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurity;
