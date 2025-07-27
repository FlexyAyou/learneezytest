
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Camera, QrCode } from 'lucide-react';

export const OFLogs = () => {
  const logs = [
    { id: '1', type: 'connexion', utilisateur: 'Marie Dupont', ip: '192.168.1.10', timestamp: '2024-01-15 09:30:15', status: 'success' },
    { id: '2', type: 'camera', utilisateur: 'Jean Martin', ip: '192.168.1.11', timestamp: '2024-01-15 09:25:42', status: 'captured' },
    { id: '3', type: 'qr_verification', utilisateur: 'Sophie Bernard', ip: '192.168.1.12', timestamp: '2024-01-15 09:20:18', status: 'verified' },
    { id: '4', type: 'connexion', utilisateur: 'Pierre Durand', ip: '192.168.1.13', timestamp: '2024-01-15 09:15:33', status: 'failed' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { variant: 'default' as const, label: 'Succès' },
      failed: { variant: 'destructive' as const, label: 'Échec' },
      captured: { variant: 'default' as const, label: 'Capturé' },
      verified: { variant: 'default' as const, label: 'Vérifié' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logs & Sécurité</h1>
          <p className="text-gray-600">Suivi des connexions et vérifications de sécurité</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Logs de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Adresse IP</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {log.type === 'connexion' && <Shield className="h-4 w-4" />}
                      {log.type === 'camera' && <Camera className="h-4 w-4" />}
                      {log.type === 'qr_verification' && <QrCode className="h-4 w-4" />}
                      <span className="capitalize">{log.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.utilisateur}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
