import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Download, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Inscription {
  id: string;
  courseTitle: string;
  courseDescription: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  submittedAt: string;
  reviewedAt?: string;
  startDate?: string;
  endDate?: string;
  price: number;
  documentsReceived: boolean;
  conventionSigned: boolean;
  paymentStatus: 'pending' | 'paid' | 'partial';
  documents: {
    program: boolean;
    regulations: boolean;
    cgv: boolean;
    convention: boolean;
  };
}

const StudentInscriptions = () => {
  const [selectedInscription, setSelectedInscription] = useState<string | null>(null);

  // Données d'exemple
  const inscriptions: Inscription[] = [
    {
      id: '1',
      courseTitle: 'Mathématiques CE2',
      courseDescription: 'Formation complète en mathématiques niveau CE2',
      status: 'active',
      submittedAt: '2024-01-10',
      reviewedAt: '2024-01-12',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      price: 299,
      documentsReceived: true,
      conventionSigned: true,
      paymentStatus: 'paid',
      documents: {
        program: true,
        regulations: true,
        cgv: true,
        convention: true
      }
    },
    {
      id: '2',
      courseTitle: 'Français CM1',
      courseDescription: 'Formation en français niveau CM1',
      status: 'pending',
      submittedAt: '2024-01-20',
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      price: 329,
      documentsReceived: false,
      conventionSigned: false,
      paymentStatus: 'pending',
      documents: {
        program: false,
        regulations: false,
        cgv: false,
        convention: false
      }
    },
    {
      id: '3',
      courseTitle: 'Anglais 6ème',
      courseDescription: 'Initiation à l\'anglais niveau 6ème',
      status: 'approved',
      submittedAt: '2024-01-18',
      reviewedAt: '2024-01-19',
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      price: 279,
      documentsReceived: true,
      conventionSigned: false,
      paymentStatus: 'pending',
      documents: {
        program: true,
        regulations: true,
        cgv: true,
        convention: false
      }
    }
  ];

  const getStatusBadge = (status: Inscription['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Inscription['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Payé</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Partiel</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-red-50 text-red-700">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: Inscription['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'approved':
      case 'active':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Inscriptions</h1>
        <Button>
          Nouvelle inscription
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {inscriptions.filter(i => i.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Formations actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {inscriptions.filter(i => i.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {inscriptions.filter(i => i.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Terminées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">
              {inscriptions.reduce((sum, i) => sum + i.price, 0)}€
            </p>
            <p className="text-sm text-gray-600">Total investissement</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des inscriptions */}
      <div className="grid gap-6">
        {inscriptions.map((inscription) => (
          <Card key={inscription.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(inscription.status)}
                    <CardTitle className="text-lg">{inscription.courseTitle}</CardTitle>
                    {getStatusBadge(inscription.status)}
                  </div>
                  <CardDescription>{inscription.courseDescription}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Soumise le {new Date(inscription.submittedAt).toLocaleDateString('fr-FR')}
                    </span>
                    {inscription.startDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Du {new Date(inscription.startDate).toLocaleDateString('fr-FR')} 
                        au {new Date(inscription.endDate!).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <span className="font-medium">{inscription.price}€</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getPaymentStatusBadge(inscription.paymentStatus)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Statut et actions selon l'état */}
                {inscription.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Inscription en cours de traitement</h4>
                    <p className="text-sm text-yellow-700">
                      Votre demande d'inscription est en cours d'examen par notre équipe pédagogique. 
                      Vous recevrez une réponse dans les 24-48h.
                    </p>
                  </div>
                )}

                {inscription.status === 'approved' && !inscription.conventionSigned && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Inscription approuvée !</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Votre inscription a été approuvée. Veuillez signer la convention de formation pour finaliser le processus.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Signer la convention
                    </Button>
                  </div>
                )}

                {inscription.status === 'active' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Formation en cours</h4>
                    <p className="text-sm text-blue-700">
                      Votre formation est actuellement active. Accédez à votre espace de cours pour suivre vos modules.
                    </p>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-3">Documents</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Programme de formation</span>
                      {inscription.documents.program ? (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Non disponible</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Règlement intérieur</span>
                      {inscription.documents.regulations ? (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Non disponible</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Conditions Générales</span>
                      {inscription.documents.cgv ? (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Non disponible</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Convention signée</span>
                      {inscription.documents.convention ? (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Non disponible</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {inscription.status === 'active' && (
                    <Button>
                      Accéder à la formation
                    </Button>
                  )}
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Voir les détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {inscriptions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune inscription</h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore d'inscription à nos formations.
            </p>
            <Button>
              Découvrir nos formations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentInscriptions;