import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminInscriptions = () => {
  const [selectedInscription, setSelectedInscription] = useState<any>(null);

  // Données mockées
  const inscriptions = [
    {
      id: '1',
      userName: 'Alice Martin',
      userEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      status: 'pending',
      conventionSigned: false,
      documentsSent: false,
      createdAt: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      userName: 'Bob Dupont',
      userEmail: 'bob.dupont@email.com', 
      courseName: 'Français CM1',
      status: 'validated',
      conventionSigned: true,
      documentsSent: true,
      createdAt: '2024-01-18T14:15:00Z',
    },
    {
      id: '3',
      userName: 'Claire Rousseau',
      userEmail: 'claire.rousseau@email.com',
      courseName: 'Anglais 6ème',
      status: 'rejected',
      conventionSigned: false,
      documentsSent: false,
      createdAt: '2024-01-15T09:20:00Z',
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Validée</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const handleValidateInscription = (inscriptionId: string) => {
    console.log('Validation inscription:', inscriptionId);
    // Ici on intégrera l'API Supabase
  };

  const handleRejectInscription = (inscriptionId: string) => {
    console.log('Rejet inscription:', inscriptionId);
    // Ici on intégrera l'API Supabase
  };

  const stats = {
    total: inscriptions.length,
    pending: inscriptions.filter(i => i.status === 'pending').length,
    validated: inscriptions.filter(i => i.status === 'validated').length,
    rejected: inscriptions.filter(i => i.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Inscriptions</h1>
        <p className="text-gray-600">Validez et gérez les inscriptions des apprenants</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.validated}</p>
                <p className="text-sm text-gray-600">Validées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des inscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des inscriptions</CardTitle>
          <CardDescription>Gérez les demandes d'inscription en attente</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprenant</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Convention</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inscription.userName}</p>
                      <p className="text-sm text-gray-600">{inscription.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inscription.courseName}</TableCell>
                  <TableCell>
                    {new Date(inscription.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(inscription.status)}</TableCell>
                  <TableCell>
                    {inscription.conventionSigned ? (
                      <Badge variant="default" className="bg-green-500">Signée</Badge>
                    ) : (
                      <Badge variant="outline">Non signée</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedInscription(inscription)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails de l'inscription</DialogTitle>
                          </DialogHeader>
                          {selectedInscription && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Informations apprenant</h4>
                                <p>{selectedInscription.userName}</p>
                                <p className="text-sm text-gray-600">{selectedInscription.userEmail}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Formation</h4>
                                <p>{selectedInscription.courseName}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleValidateInscription(selectedInscription.id)}
                                  disabled={selectedInscription.status !== 'pending'}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Valider
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectInscription(selectedInscription.id)}
                                  disabled={selectedInscription.status !== 'pending'}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Rejeter
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {inscription.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleValidateInscription(inscription.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectInscription(inscription.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
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

export default AdminInscriptions;