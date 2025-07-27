
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Edit, Plus, Video } from 'lucide-react';

export const OFFormations = () => {
  const formations = [
    { id: '1', titre: 'Formation React Avancé', formateur: 'Sophie Bernard', debut: '2024-02-15', fin: '2024-03-15', participants: 12, status: 'active' },
    { id: '2', titre: 'Gestion de Projet Agile', formateur: 'Jean Martin', debut: '2024-02-20', fin: '2024-03-20', participants: 8, status: 'planning' },
    { id: '3', titre: 'Marketing Digital', formateur: 'Marie Dupont', debut: '2024-03-01', fin: '2024-04-01', participants: 15, status: 'completed' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      planning: { variant: 'outline' as const, label: 'Planifié' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des formations</h1>
          <p className="text-gray-600">Création et suivi des formations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle formation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Liste des formations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Formateur</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formations.map((formation) => (
                <TableRow key={formation.id}>
                  <TableCell className="font-medium">{formation.titre}</TableCell>
                  <TableCell>{formation.formateur}</TableCell>
                  <TableCell>{formation.debut} - {formation.fin}</TableCell>
                  <TableCell>{formation.participants}</TableCell>
                  <TableCell>{getStatusBadge(formation.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
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
