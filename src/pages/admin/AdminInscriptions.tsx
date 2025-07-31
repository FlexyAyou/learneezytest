import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Eye, FileText, Mail, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AdminInscriptions = () => {
  const [selectedInscription, setSelectedInscription] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

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
      phone: '06 12 34 56 78',
      address: '123 Rue de la Paix, 75001 Paris',
      birthDate: '1985-03-15',
      motivation: 'Je souhaite améliorer mes compétences en mathématiques pour aider mes enfants.',
      previousEducation: 'Baccalauréat scientifique',
      employmentStatus: 'Employé'
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
      phone: '06 98 76 54 32',
      address: '456 Avenue des Champs, 69001 Lyon',
      birthDate: '1990-07-22',
      motivation: 'Perfectionnement professionnel dans l\'enseignement du français.',
      previousEducation: 'Master en Lettres',
      employmentStatus: 'Enseignant'
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
      phone: '06 55 44 33 22',
      address: '789 Boulevard du Midi, 13001 Marseille',
      birthDate: '1988-11-10',
      motivation: 'Reconversion professionnelle vers l\'enseignement.',
      previousEducation: 'BTS Commerce',
      employmentStatus: 'En recherche d\'emploi',
      rejectionReason: 'Prérequis non satisfaits'
    }
  ];

  const handleValidateInscription = (inscriptionId: string) => {
    console.log('Validation inscription:', inscriptionId);
    toast({
      title: "Inscription validée",
      description: "L'inscription a été validée avec succès. L'apprenant va recevoir un email de confirmation.",
    });
    
    // Simuler la mise à jour du statut
    // Dans un vrai projet, cela ferait appel à l'API Supabase
  };

  const handleRejectInscription = (inscriptionId: string, reason: string) => {
    console.log('Rejet inscription:', inscriptionId, 'Raison:', reason);
    toast({
      title: "Inscription rejetée",
      description: "L'inscription a été rejetée. L'apprenant va recevoir un email d'information.",
    });
    
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const handleSendDocuments = (inscriptionId: string) => {
    console.log('Envoi documents:', inscriptionId);
    toast({
      title: "Documents envoyés",
      description: "Les documents ont été envoyés par email à l'apprenant.",
    });
  };

  const handleDownloadDetails = (inscription: any) => {
    console.log('Téléchargement détails:', inscription);
    toast({
      title: "Téléchargement en cours",
      description: "Le fichier PDF avec les détails de l'inscription est en cours de génération.",
    });
  };

  const handleSendReminder = (inscriptionId: string) => {
    console.log('Envoi rappel:', inscriptionId);
    toast({
      title: "Rappel envoyé",
      description: "Un rappel a été envoyé à l'apprenant pour compléter son inscription.",
    });
  };

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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedInscription(inscription);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
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
                            onClick={() => {
                              setSelectedInscription(inscription);
                              setShowRejectDialog(true);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendDocuments(inscription.id)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDetails(inscription)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog pour les détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'inscription</DialogTitle>
          </DialogHeader>
          {selectedInscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Informations personnelles</h4>
                  <p><strong>Nom:</strong> {selectedInscription.userName}</p>
                  <p><strong>Email:</strong> {selectedInscription.userEmail}</p>
                  <p><strong>Téléphone:</strong> {selectedInscription.phone}</p>
                  <p><strong>Adresse:</strong> {selectedInscription.address}</p>
                  <p><strong>Date de naissance:</strong> {selectedInscription.birthDate}</p>
                </div>
                <div>
                  <h4 className="font-medium">Formation</h4>
                  <p><strong>Formation:</strong> {selectedInscription.courseName}</p>
                  <p><strong>Statut:</strong> {selectedInscription.status}</p>
                  <p><strong>Convention:</strong> {selectedInscription.conventionSigned ? 'Signée' : 'Non signée'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Informations complémentaires</h4>
                <p><strong>Situation professionnelle:</strong> {selectedInscription.employmentStatus}</p>
                <p><strong>Formation précédente:</strong> {selectedInscription.previousEducation}</p>
                <p><strong>Motivation:</strong> {selectedInscription.motivation}</p>
                {selectedInscription.rejectionReason && (
                  <p><strong>Raison du rejet:</strong> {selectedInscription.rejectionReason}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                {selectedInscription.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => {
                        handleValidateInscription(selectedInscription.id);
                        setShowDetailsDialog(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Valider
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setShowDetailsDialog(false);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeter
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline"
                  onClick={() => handleSendReminder(selectedInscription.id)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un rappel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour le rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'inscription</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de cette inscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Raison du rejet</Label>
              <Textarea
                id="reason"
                placeholder="Expliquez pourquoi cette inscription est rejetée..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleRejectInscription(selectedInscription?.id, rejectReason)}
                disabled={!rejectReason.trim()}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInscriptions;
