
import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, Filter, Download, Search, Lock, Unlock, UserX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const SecurityLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogLevel, setSelectedLogLevel] = useState('all');

  const securityLogs = [
    {
      id: 1,
      timestamp: '2024-03-15 14:32:15',
      level: 'Warning',
      event: 'Tentative de connexion échouée',
      user: 'admin@Learneezy.com',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Mot de passe incorrect - 3ème tentative'
    },
    {
      id: 2,
      timestamp: '2024-03-15 14:30:45',
      level: 'Critical',
      event: 'Tentative d\'accès non autorisé',
      user: 'unknown',
      ip: '45.76.123.45',
      userAgent: 'curl/7.68.0',
      details: 'Tentative d\'accès à /admin sans authentification'
    },
    {
      id: 3,
      timestamp: '2024-03-15 14:25:12',
      level: 'Info',
      event: 'Connexion réussie',
      user: 'marie.dubois@email.com',
      ip: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (MacOS)',
      details: 'Connexion normale utilisateur'
    },
    {
      id: 4,
      timestamp: '2024-03-15 14:20:33',
      level: 'Warning',
      event: 'Modification de profil suspect',
      user: 'pierre.martin@email.com',
      ip: '10.0.0.15',
      userAgent: 'Mozilla/5.0 (Linux)',
      details: 'Changement d\'email et mot de passe en même temps'
    },
    {
      id: 5,
      timestamp: '2024-03-15 14:15:22',
      level: 'Critical',
      event: 'Upload de fichier dangereux bloqué',
      user: 'sophie.chen@email.com',
      ip: '172.16.0.20',
      userAgent: 'Mozilla/5.0 (Windows)',
      details: 'Fichier .exe détecté et bloqué'
    }
  ];

  const securityMetrics = [
    { title: 'Tentatives de connexion échouées', count: 47, change: '+12%', color: 'text-red-600' },
    { title: 'Comptes bloqués', count: 8, change: '+2', color: 'text-orange-600' },
    { title: 'Connexions suspectes', count: 15, change: '-5%', color: 'text-yellow-600' },
    { title: 'Fichiers bloqués', count: 3, change: '+1', color: 'text-blue-600' }
  ];

  const handleExportLogs = () => {
    toast({
      title: "Export des logs",
      description: "Les logs de sécurité sont en cours d'export",
    });
  };

  const handleBlockIP = (ip: string) => {
    toast({
      title: "IP bloquée",
      description: `L'adresse IP ${ip} a été bloquée`,
    });
  };

  const handleInvestigate = (logId: number) => {
    toast({
      title: "Investigation",
      description: `Enquête ouverte pour l'événement ${logId}`,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Critical': return '🚨';
      case 'Warning': return '⚠️';
      case 'Info': return 'ℹ️';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Logs de sécurité</h1>
            <p className="text-gray-600">Surveillance et audit des activités de sécurité</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Shield className="h-4 w-4 mr-2" />
              Règles de sécurité
            </Button>
          </div>
        </div>

        {/* Métriques de sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {securityMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.count}</div>
                <p className="text-xs text-muted-foreground">{metric.change} dernières 24h</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Logs de sécurité */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Journal des événements de sécurité
                </CardTitle>
                <CardDescription>Activités suspectes et événements de sécurité</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtres et recherche */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher dans les logs..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedLogLevel}
                    onChange={(e) => setSelectedLogLevel(e.target.value)}
                  >
                    <option value="all">Tous les niveaux</option>
                    <option value="critical">Critique</option>
                    <option value="warning">Avertissement</option>
                    <option value="info">Information</option>
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Plus de filtres
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horodatage</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Événement</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelColor(log.level)}>
                            {getLevelIcon(log.level)} {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.event}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{log.details}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{log.user}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{log.userAgent}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleInvestigate(log.id)}
                              title="Investiguer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {log.level === 'Critical' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleBlockIP(log.ip)}
                                title="Bloquer IP"
                              >
                                <Lock className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Panel de contrôle de sécurité */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Actions de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Bloquer une IP
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Unlock className="h-4 w-4 mr-2" />
                  Débloquer un compte
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UserX className="h-4 w-4 mr-2" />
                  Suspendre utilisateur
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Créer une alerte
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Rapport sécurité
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>IPs bloquées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-mono text-sm">45.76.123.45</span>
                  <Button size="sm" variant="ghost">
                    <Unlock className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-mono text-sm">203.0.113.0</span>
                  <Button size="sm" variant="ghost">
                    <Unlock className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-mono text-sm">198.51.100.5</span>
                  <Button size="sm" variant="ghost">
                    <Unlock className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes en temps réel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">🚨 Attaque par force brute</p>
                  <p className="text-xs text-red-600">IP: 45.76.123.45 - 15 tentatives</p>
                  <p className="text-xs text-gray-500">Il y a 2 minutes</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">⚠️ Connexions multiples</p>
                  <p className="text-xs text-yellow-600">Utilisateur: marie@email.com</p>
                  <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">🛡️ Upload suspect bloqué</p>
                  <p className="text-xs text-orange-600">Fichier .exe détecté</p>
                  <p className="text-xs text-gray-500">Il y a 8 minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityLogs;
