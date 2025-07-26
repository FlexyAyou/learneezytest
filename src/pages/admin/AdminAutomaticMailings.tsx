import React, { useState } from 'react';
import { Mail, FileText, Clock, CheckCircle, XCircle, Eye, Download, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AdminAutomaticMailings = () => {
  const [selectedMailing, setSelectedMailing] = useState<any>(null);
  const { toast } = useToast();

  // Données mockées des envois automatiques
  const automaticMailings = [
    {
      id: '1',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'programme',
      status: 'sent',
      sentAt: '2024-01-20T10:30:00Z',
      content: 'Programme de formation Mathématiques CE2',
    },
    {
      id: '2',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'reglement',
      status: 'sent',
      sentAt: '2024-01-20T10:35:00Z',
      content: 'Règlement intérieur de l\'organisme de formation',
    },
    {
      id: '3',
      inscriptionId: 'ins-002',
      studentName: 'Bob Dupont',
      studentEmail: 'bob.dupont@email.com',
      courseName: 'Français CM1',
      type: 'convocation',
      status: 'pending',
      sentAt: null,
      content: 'Convocation avec lien visio et planning',
    },
    {
      id: '4',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'satisfaction',
      status: 'failed',
      sentAt: null,
      content: 'Formulaire de satisfaction',
      errorMessage: 'Adresse email invalide',
    },
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      'programme': 'Programme',
      'reglement': 'Règlement',
      'cgv': 'CGV',
      'convocation': 'Convocation',
      'satisfaction': 'Satisfaction',
      'relance': 'Relance'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'programme': 'bg-blue-500',
      'reglement': 'bg-gray-500',
      'cgv': 'bg-purple-500',
      'convocation': 'bg-orange-500',
      'satisfaction': 'bg-teal-500',
      'relance': 'bg-yellow-500'
    };
    return (
      <Badge variant="default" className={colors[type as keyof typeof colors] || 'bg-gray-500'}>
        {getTypeLabel(type)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Envoyé</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleRetryMailing = (mailingId: string) => {
    toast({
      title: "Renvoi en cours",
      description: "L'email est en cours de renvoi...",
    });
    // Simulation du renvoi
    console.log('Retry mailing:', mailingId);
  };

  const handlePreviewEmail = (mailing: any) => {
    setSelectedMailing(mailing);
  };

  const stats = {
    total: automaticMailings.length,
    sent: automaticMailings.filter(m => m.status === 'sent').length,
    pending: automaticMailings.filter(m => m.status === 'pending').length,
    failed: automaticMailings.filter(m => m.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Envois Automatiques</h1>
        <p className="text-gray-600">Suivi des emails automatiques (programme, règlement, convocations...)</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total envois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-gray-600">Envoyés</p>
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
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-gray-600">Échecs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulateur d'envoi automatique */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation des envois automatiques</CardTitle>
          <CardDescription>
            Les emails sont envoyés automatiquement lors de la validation d'une inscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Processus automatique :</h4>
            <div className="text-sm space-y-1">
              <p>1. ✅ Inscription validée → Envoi immédiat du programme de formation</p>
              <p>2. ✅ 2 minutes après → Envoi du règlement intérieur</p>
              <p>3. ✅ 5 minutes après → Envoi des CGV</p>
              <p>4. ⏳ 1 jour avant le début → Envoi de la convocation avec lien visio</p>
              <p>5. ⏳ Dernier jour de formation → Envoi du formulaire de satisfaction</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button onClick={() => toast({
              title: "Simulation lancée",
              description: "Les envois automatiques sont simulés...",
            })}>
              <Send className="w-4 h-4 mr-2" />
              Simuler les envois automatiques
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des envois */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des envois</CardTitle>
          <CardDescription>Suivi de tous les emails automatiques</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinataire</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automaticMailings.map((mailing) => (
                <TableRow key={mailing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{mailing.studentName}</p>
                      <p className="text-sm text-gray-600">{mailing.studentEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{mailing.courseName}</TableCell>
                  <TableCell>{getTypeBadge(mailing.type)}</TableCell>
                  <TableCell>{getStatusBadge(mailing.status)}</TableCell>
                  <TableCell>
                    {mailing.sentAt ? (
                      new Date(mailing.sentAt).toLocaleString('fr-FR')
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePreviewEmail(mailing)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Aperçu de l'email</DialogTitle>
                            <DialogDescription>
                              {getTypeLabel(mailing.type)} - {mailing.studentName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedMailing && (
                            <div className="space-y-4">
                              <div className="border rounded p-4 bg-gray-50">
                                <div className="mb-4 text-sm">
                                  <p><strong>À:</strong> {selectedMailing.studentEmail}</p>
                                  <p><strong>Objet:</strong> {getTypeLabel(selectedMailing.type)} - {selectedMailing.courseName}</p>
                                </div>
                                <div className="prose prose-sm">
                                  <p>Bonjour {selectedMailing.studentName},</p>
                                  <p>Suite à votre inscription à la formation "{selectedMailing.courseName}", vous trouverez en pièce jointe le document suivant : {selectedMailing.content}.</p>
                                  
                                  {selectedMailing.type === 'convocation' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3 my-4">
                                      <p><strong>Informations de connexion :</strong></p>
                                      <p>Lien visio : https://meet.example.com/formation-123</p>
                                      <p>Date : 25/01/2024 à 09:00</p>
                                      <p>Durée : 3 heures</p>
                                    </div>
                                  )}
                                  
                                  <p>Cordialement,<br/>L'équipe pédagogique</p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between">
                                <Button variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Télécharger le PDF
                                </Button>
                                {selectedMailing.status === 'failed' && (
                                  <Button onClick={() => handleRetryMailing(selectedMailing.id)}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Renvoyer
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {mailing.status === 'failed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleRetryMailing(mailing.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {mailing.errorMessage && (
                        <div className="text-xs text-red-600">
                          {mailing.errorMessage}
                        </div>
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

export default AdminAutomaticMailings;