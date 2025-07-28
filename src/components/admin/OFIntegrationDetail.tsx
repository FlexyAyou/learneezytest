
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, Zap, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Integration {
  id: string;
  nom: string;
  type: string;
  status: string;
  lastSync: string;
}

interface OFIntegrationDetailProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (integration: Integration) => void;
}

export const OFIntegrationDetail = ({ integration, isOpen, onClose, onEdit }: OFIntegrationDetailProps) => {
  if (!integration) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { variant: 'default' as const, label: 'Connecté', color: 'text-green-600', icon: CheckCircle },
      error: { variant: 'destructive' as const, label: 'Erreur', color: 'text-red-600', icon: XCircle },
      disconnected: { variant: 'outline' as const, label: 'Déconnecté', color: 'text-gray-600', icon: AlertCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600', icon: AlertCircle };
    return (
      <div className="flex items-center gap-2">
        <config.icon className="h-4 w-4" />
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
    );
  };

  const handleDownload = () => {
    // Simulation du téléchargement des logs
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,Intégration: ${integration.nom}\nType: ${integration.type}\nStatut: ${integration.status}\nDernière sync: ${integration.lastSync}`;
    element.download = `integration-${integration.nom.replace(/\s+/g, '-').toLowerCase()}-logs.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTestConnection = () => {
    // Simulation du test de connexion
    console.log('Test de connexion pour:', integration.nom);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Détails de l'intégration - {integration.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Nom du service</label>
                  <p className="text-gray-900">{integration.nom}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{integration.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(integration.status)}</div>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dernière synchronisation
                  </label>
                  <p className="text-gray-900">{integration.lastSync}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de connexion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">URL de l'API</label>
                  <p className="text-gray-900 text-sm font-mono">https://api.{integration.nom.toLowerCase()}.com/v1</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Version de l'API</label>
                  <p className="text-gray-900">v1.2.3</p>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Clé API</label>
                <p className="text-gray-900 text-sm font-mono">••••••••••••••••••••••••••••••••</p>
              </div>
            </CardContent>
          </Card>

          {/* Alertes selon le statut */}
          {integration.status === 'error' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Erreur de connexion</p>
                </div>
                <p className="text-red-600 mt-1">La connexion avec ce service a échoué. Vérifiez les paramètres de connexion.</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onEdit(integration)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button onClick={handleTestConnection} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Tester
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Logs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
