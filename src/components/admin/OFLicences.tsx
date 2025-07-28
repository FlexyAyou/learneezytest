
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, Edit, Plus } from 'lucide-react';
import { OFLicenceDetail } from './OFLicenceDetail';
import { OFLicenceEdit } from './OFLicenceEdit';

interface Licence {
  id: string;
  type: string;
  nombre: number;
  utilises: number;
  expires: string;
  status: string;
}

export const OFLicences = () => {
  const [selectedLicence, setSelectedLicence] = useState<Licence | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [licences, setLicences] = useState<Licence[]>([
    { id: '1', type: 'Zoom Pro', nombre: 50, utilises: 35, expires: '2024-06-30', status: 'active' },
    { id: '2', type: 'Microsoft Teams', nombre: 100, utilises: 78, expires: '2024-12-31', status: 'active' },
    { id: '3', type: 'Adobe Sign', nombre: 25, utilises: 25, expires: '2024-03-15', status: 'expired' },
    { id: '4', type: 'Moodle LMS', nombre: 200, utilises: 156, expires: '2024-09-30', status: 'active' },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      expired: { variant: 'destructive' as const, label: 'Expiré' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleView = (licence: Licence) => {
    setSelectedLicence(licence);
    setShowDetail(true);
  };

  const handleEdit = (licence: Licence) => {
    setSelectedLicence(licence);
    setShowEdit(true);
  };

  const handleSave = (updatedLicence: Licence) => {
    setLicences(prev => prev.map(l => l.id === updatedLicence.id ? updatedLicence : l));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des licences</h1>
          <p className="text-gray-600">Suivi des licences logicielles et services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle licence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Licences actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de licence</TableHead>
                <TableHead>Nombre total</TableHead>
                <TableHead>Utilisées</TableHead>
                <TableHead>Disponibles</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licences.map((licence) => (
                <TableRow key={licence.id}>
                  <TableCell className="font-medium">{licence.type}</TableCell>
                  <TableCell>{licence.nombre}</TableCell>
                  <TableCell>{licence.utilises}</TableCell>
                  <TableCell>{licence.nombre - licence.utilises}</TableCell>
                  <TableCell>{licence.expires}</TableCell>
                  <TableCell>{getStatusBadge(licence.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(licence)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(licence)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OFLicenceDetail
        licence={selectedLicence}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEdit}
      />

      <OFLicenceEdit
        licence={selectedLicence}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSave}
      />
    </div>
  );
};
