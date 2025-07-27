
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MessageSquare, Plus } from 'lucide-react';

export const OFEnvois = () => {
  const envois = [
    { id: '1', type: 'convocation', destinataire: 'marie.dupont@email.com', sujet: 'Convocation formation React', status: 'delivered', date: '2024-01-15 08:30:00' },
    { id: '2', type: 'relance', destinataire: 'jean.martin@email.com', sujet: 'Rappel émargement', status: 'pending', date: '2024-01-15 08:25:00' },
    { id: '3', type: 'attestation', destinataire: 'sophie.bernard@email.com', sujet: 'Attestation de formation', status: 'read', date: '2024-01-15 08:20:00' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: 'default' as const, label: 'Livré' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      read: { variant: 'secondary' as const, label: 'Lu' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Envois & Relances</h1>
          <p className="text-gray-600">Gestion des envois automatiques et relances</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel envoi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Historique des envois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {envois.map((envoi) => (
                <TableRow key={envoi.id}>
                  <TableCell className="capitalize">{envoi.type}</TableCell>
                  <TableCell>{envoi.destinataire}</TableCell>
                  <TableCell className="font-medium">{envoi.sujet}</TableCell>
                  <TableCell>{getStatusBadge(envoi.status)}</TableCell>
                  <TableCell>{envoi.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
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
