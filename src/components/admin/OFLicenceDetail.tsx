
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, Users, Calendar, AlertCircle } from 'lucide-react';

interface Licence {
  id: string;
  type: string;
  nombre: number;
  utilises: number;
  expires: string;
  status: string;
}

interface OFLicenceDetailProps {
  licence: Licence | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (licence: Licence) => void;
}

export const OFLicenceDetail = ({ licence, isOpen, onClose, onEdit }: OFLicenceDetailProps) => {
  if (!licence) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif', color: 'text-green-600' },
      expired: { variant: 'destructive' as const, label: 'Expiré', color: 'text-red-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownload = () => {
    // Simulation du téléchargement
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,Licence: ${licence.type}\nNombre: ${licence.nombre}\nUtilisées: ${licence.utilises}\nExpire: ${licence.expires}`;
    element.download = `licence-${licence.type.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Détails de la licence - {licence.type}
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
                  <label className="font-medium text-gray-700">Type de licence</label>
                  <p className="text-gray-900">{licence.type}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(licence.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Nombre total</label>
                  <p className="text-2xl font-bold text-blue-600">{licence.nombre}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Utilisées</label>
                  <p className="text-2xl font-bold text-orange-600">{licence.utilises}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Disponibles</label>
                  <p className="text-2xl font-bold text-green-600">{licence.nombre - licence.utilises}</p>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'expiration
                </label>
                <p className="text-gray-900">{licence.expires}</p>
              </div>
            </CardContent>
          </Card>

          {/* Alertes */}
          {licence.status === 'expired' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Cette licence a expiré</p>
                </div>
                <p className="text-red-600 mt-1">Renouvelez votre licence pour continuer à utiliser ce service.</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onEdit(licence)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
