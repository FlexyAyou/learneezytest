
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit, Plus } from 'lucide-react';

export const OFApprenants = () => {
  const apprenants = [
    { id: '1', nom: 'Dupont', prenom: 'Marie', email: 'marie.dupont@email.com', status: 'active', formation: 'React Avancé', progression: 78 },
    { id: '2', nom: 'Martin', prenom: 'Jean', email: 'jean.martin@email.com', status: 'completed', formation: 'JavaScript', progression: 100 },
    { id: '3', nom: 'Bernard', prenom: 'Sophie', email: 'sophie.bernard@email.com', status: 'pending', formation: 'Angular', progression: 45 },
    { id: '4', nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com', status: 'active', formation: 'Vue.js', progression: 62 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des apprenants</h1>
          <p className="text-gray-600">Suivi et gestion des apprenants</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un apprenant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des apprenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apprenants.map((apprenant) => (
                <TableRow key={apprenant.id}>
                  <TableCell className="font-medium">{apprenant.prenom} {apprenant.nom}</TableCell>
                  <TableCell>{apprenant.email}</TableCell>
                  <TableCell>{apprenant.formation}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${apprenant.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{apprenant.progression}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(apprenant.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
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
    </div>
  );
};
