
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MessageSquare, Plus } from 'lucide-react';
import { OFNouvelEnvoi } from './OFNouvelEnvoi';
import { OFEnvoiDetail } from './OFEnvoiDetail';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useCommunications } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';

interface Envoi {
  id: string;
  type: string;
  destinataire: string;
  sujet: string;
  status: string;
  date: string;
}

export const OFEnvois = () => {
  const { organization } = useOrganization();
  const ofId = organization?.organizationId;
  const [showNouvelEnvoi, setShowNouvelEnvoi] = useState(false);
  const [selectedEnvoi, setSelectedEnvoi] = useState<Envoi | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const { data: communicationsData, isLoading } = useCommunications(ofId);

  const envois: Envoi[] = (communicationsData?.items || communicationsData || []).map((item: any) => ({
    id: item.id.toString(),
    type: item.type,
    destinataire: item.destinataire || item.recipient_email,
    sujet: item.sujet || item.subject,
    status: item.status,
    date: item.date || item.created_at
  }));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: 'default' as const, label: 'Livré' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      read: { variant: 'secondary' as const, label: 'Lu' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleView = (envoi: Envoi) => {
    setSelectedEnvoi(envoi);
    setShowDetail(true);
  };

  const handleReply = (envoi: Envoi) => {
    console.log('Reply to:', envoi.destinataire);
    // Logique de réponse à implémenter
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Envois & Relances</h1>
          <p className="text-gray-600">Gestion des envois automatiques et relances</p>
        </div>
        <Button onClick={() => setShowNouvelEnvoi(true)}>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Chargement de l'historique...</p>
                  </TableCell>
                </TableRow>
              ) : envois.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Aucun envoi trouvé
                  </TableCell>
                </TableRow>
              ) : (
                envois.map((envoi) => (
                  <TableRow key={envoi.id}>
                    <TableCell className="capitalize">{envoi.type}</TableCell>
                    <TableCell>{envoi.destinataire}</TableCell>
                    <TableCell className="font-medium">{envoi.sujet}</TableCell>
                    <TableCell>{getStatusBadge(envoi.status)}</TableCell>
                    <TableCell>{new Date(envoi.date).toLocaleString('fr-FR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(envoi)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReply(envoi)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OFNouvelEnvoi
        isOpen={showNouvelEnvoi}
        onClose={() => setShowNouvelEnvoi(false)}
      />

      <OFEnvoiDetail
        envoi={selectedEnvoi}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onReply={handleReply}
      />
    </div>
  );
};
