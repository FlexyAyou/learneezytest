
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, FileText, Calendar, User, BarChart } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: string;
  course: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  size: string;
}

interface InternalTrainerContentDetailProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (content: Content) => void;
}

export const InternalTrainerContentDetail = ({ content, isOpen, onClose, onEdit }: InternalTrainerContentDetailProps) => {
  if (!content) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: 'default' as const, label: 'Publié', color: 'text-green-600' },
      draft: { variant: 'outline' as const, label: 'Brouillon', color: 'text-yellow-600' },
      archived: { variant: 'secondary' as const, label: 'Archivé', color: 'text-gray-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,Contenu: ${content.title}\nType: ${content.type}\nCours: ${content.course}\nStatut: ${content.status}\nTaille: ${content.size}`;
    element.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails du contenu - {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Titre</label>
                  <p className="text-gray-900 font-medium">{content.title}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{content.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Cours associé</label>
                  <p className="text-gray-900">{content.course}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(content.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Créé le
                  </label>
                  <p className="text-gray-900">{content.createdAt}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </label>
                  <p className="text-gray-900">{content.updatedAt}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Taille</label>
                  <p className="text-gray-900">{content.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques d'utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">42</div>
                  <p className="text-sm text-gray-600">Vues</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <p className="text-sm text-gray-600">Téléchargements</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aperçu du contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                {content.type === 'video' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-gray-600">Aperçu vidéo non disponible</p>
                    <p className="text-sm text-gray-500 mt-2">Cliquez sur "Télécharger" pour accéder au fichier</p>
                  </div>
                )}
                {content.type === 'document' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600">Document PDF</p>
                    <p className="text-sm text-gray-500 mt-2">Contenu du document disponible après téléchargement</p>
                  </div>
                )}
                {content.type === 'quiz' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">❓</div>
                    <p className="text-gray-600">Quiz interactif</p>
                    <p className="text-sm text-gray-500 mt-2">15 questions - Durée estimée: 20 minutes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onEdit(content)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
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
