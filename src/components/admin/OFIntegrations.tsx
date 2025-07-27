
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Zap, Eye, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';

export const OFIntegrations = () => {
  const integrations = [
    { id: '1', nom: 'Zoom API', type: 'Visioconférence', status: 'connected', lastSync: '2024-01-15 09:00:00' },
    { id: '2', nom: 'DocuSign', type: 'Signature électronique', status: 'connected', lastSync: '2024-01-15 08:45:00' },
    { id: '3', nom: 'Microsoft Teams', type: 'Communication', status: 'error', lastSync: '2024-01-14 16:30:00' },
    { id: '4', nom: 'Adobe Sign', type: 'Signature', status: 'disconnected', lastSync: '2024-01-10 12:00:00' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { variant: 'default' as const, label: 'Connecté' },
      error: { variant: 'destructive' as const, label: 'Erreur' },
      disconnected: { variant: 'outline' as const, label: 'Déconnecté' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Intégrations tierces</h1>
          <p className="text-gray-600">Gestion des intégrations avec les services externes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle intégration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Services intégrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">{integration.nom}</TableCell>
                  <TableCell>{integration.type}</TableCell>
                  <TableCell>{getStatusBadge(integration.status)}</TableCell>
                  <TableCell>{integration.lastSync}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {integration.status === 'connected' ? (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4" />
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
  );
};
