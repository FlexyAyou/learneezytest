
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, Clock, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentStatus {
  type: string;
  name: string;
  isSigned: boolean;
  isValidated: boolean;
  signedAt?: string;
  validatedAt?: string;
  documentUrl?: string;
  isRequired: boolean;
}

interface UserDocumentProgressProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDocumentProgress = ({ user, isOpen, onClose }: UserDocumentProgressProps) => {
  // Mock data pour les documents - normalement récupérés depuis la base
  const documents: DocumentStatus[] = [
    {
      type: 'programme',
      name: 'Programme de formation',
      isSigned: true,
      isValidated: true,
      signedAt: '2024-01-15',
      validatedAt: '2024-01-15',
      documentUrl: '/documents/programme.pdf',
      isRequired: true
    },
    {
      type: 'reglement',
      name: 'Règlement intérieur',
      isSigned: true,
      isValidated: false,
      signedAt: '2024-01-16',
      documentUrl: '/documents/reglement.pdf',
      isRequired: true
    },
    {
      type: 'cgv',
      name: 'Conditions générales de vente',
      isSigned: false,
      isValidated: false,
      isRequired: true
    },
    {
      type: 'convention',
      name: 'Convention de formation',
      isSigned: true,
      isValidated: true,
      signedAt: '2024-01-18',
      validatedAt: '2024-01-19',
      documentUrl: '/documents/convention.pdf',
      isRequired: true
    },
    {
      type: 'convocation',
      name: 'Convocation',
      isSigned: false,
      isValidated: false,
      isRequired: false
    },
    {
      type: 'attestation',
      name: 'Attestation de présence',
      isSigned: false,
      isValidated: false,
      isRequired: false
    }
  ];

  const requiredDocuments = documents.filter(doc => doc.isRequired);
  const completedDocuments = requiredDocuments.filter(doc => doc.isSigned && doc.isValidated);
  const progressPercentage = (completedDocuments.length / requiredDocuments.length) * 100;

  const getDocumentStatus = (doc: DocumentStatus) => {
    if (doc.isSigned && doc.isValidated) {
      return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Complet' };
    } else if (doc.isSigned && !doc.isValidated) {
      return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'En attente' };
    } else {
      return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Manquant' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Dossier de formation - {user?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progression du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {completedDocuments.length} / {requiredDocuments.length} documents requis complétés
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {documents.filter(d => d.isSigned && d.isValidated).length}
                    </div>
                    <div className="text-xs text-gray-600">Complétés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {documents.filter(d => d.isSigned && !d.isValidated).length}
                    </div>
                    <div className="text-xs text-gray-600">En attente</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {documents.filter(d => !d.isSigned).length}
                    </div>
                    <div className="text-xs text-gray-600">Manquants</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détail des documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => {
                  const status = getDocumentStatus(doc);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${!doc.isRequired ? 'bg-gray-50 border-gray-200' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${status.bg}`}>
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{doc.name}</h4>
                              {!doc.isRequired && (
                                <Badge variant="outline" className="text-xs">Optionnel</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {doc.signedAt && (
                                <div>Signé le : {new Date(doc.signedAt).toLocaleDateString()}</div>
                              )}
                              {doc.validatedAt && (
                                <div>Validé le : {new Date(doc.validatedAt).toLocaleDateString()}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={doc.isSigned && doc.isValidated ? 'default' : doc.isSigned ? 'secondary' : 'outline'}>
                            {status.label}
                          </Badge>
                          {doc.documentUrl && (
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" title="Voir le document">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" title="Télécharger">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
