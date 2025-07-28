
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, MessageSquare, Mail, Calendar, Clock, User } from 'lucide-react';

interface Envoi {
  id: string;
  type: string;
  destinataire: string;
  sujet: string;
  status: string;
  date: string;
}

interface OFEnvoiDetailProps {
  envoi: Envoi | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (envoi: Envoi) => void;
}

export const OFEnvoiDetail = ({ envoi, isOpen, onClose, onReply }: OFEnvoiDetailProps) => {
  if (!envoi) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: 'default' as const, label: 'Livré', color: 'text-green-600' },
      pending: { variant: 'outline' as const, label: 'En attente', color: 'text-yellow-600' },
      read: { variant: 'secondary' as const, label: 'Lu', color: 'text-blue-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownload = () => {
    // Simulation du téléchargement du contenu de l'email
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,De: noreply@learneezy.com\nÀ: ${envoi.destinataire}\nSujet: ${envoi.sujet}\nDate: ${envoi.date}\nType: ${envoi.type}\n\nContenu de l'email...`;
    element.download = `envoi-${envoi.id}.eml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Détails de l'envoi - {envoi.sujet}
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
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Destinataire
                  </label>
                  <p className="text-gray-900">{envoi.destinataire}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Type d'envoi</label>
                  <p className="text-gray-900 capitalize">{envoi.type}</p>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Sujet</label>
                <p className="text-gray-900 font-medium">{envoi.sujet}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(envoi.status)}</div>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date d'envoi
                  </label>
                  <p className="text-gray-900">{envoi.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu de l'email */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenu de l'email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <p><strong>De:</strong> noreply@learneezy.com</p>
                  <p><strong>À:</strong> {envoi.destinataire}</p>
                  <p><strong>Sujet:</strong> {envoi.sujet}</p>
                  <hr className="my-3" />
                  <div className="prose prose-sm max-w-none">
                    {envoi.type === 'convocation' && (
                      <div>
                        <p>Bonjour,</p>
                        <p>Nous vous confirmons votre inscription à la formation <strong>{envoi.sujet.replace('Convocation formation ', '')}</strong>.</p>
                        <p>Détails de la formation :</p>
                        <ul>
                          <li>Date : À définir</li>
                          <li>Horaire : 9h00 - 17h00</li>
                          <li>Lieu : En ligne</li>
                        </ul>
                        <p>Cordialement,<br />L'équipe Learneezy</p>
                      </div>
                    )}
                    {envoi.type === 'relance' && (
                      <div>
                        <p>Bonjour,</p>
                        <p>Nous vous rappelons qu'il est nécessaire de compléter votre émargement pour la formation suivie.</p>
                        <p>Merci de vous connecter à votre espace personnel pour finaliser cette étape.</p>
                        <p>Cordialement,<br />L'équipe Learneezy</p>
                      </div>
                    )}
                    {envoi.type === 'attestation' && (
                      <div>
                        <p>Bonjour,</p>
                        <p>Félicitations ! Vous avez terminé avec succès votre formation.</p>
                        <p>Vous trouverez ci-joint votre attestation de formation.</p>
                        <p>Cordialement,<br />L'équipe Learneezy</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {envoi.status === 'delivered' ? '✓' : '⏱'}
                  </div>
                  <p className="text-sm text-gray-600">Livré</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {envoi.status === 'read' ? '✓' : '—'}
                  </div>
                  <p className="text-sm text-gray-600">Lu</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <p className="text-sm text-gray-600">Clics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onReply(envoi)} className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Répondre
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
