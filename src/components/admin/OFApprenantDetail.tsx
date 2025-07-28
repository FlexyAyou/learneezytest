
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Calendar, BookOpen, TrendingUp, Award } from 'lucide-react';

interface OFApprenantDetailProps {
  apprenant: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OFApprenantDetail = ({ apprenant, isOpen, onClose }: OFApprenantDetailProps) => {
  if (!apprenant) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Détails de l'apprenant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom complet</label>
                  <p className="text-lg font-semibold">{apprenant.prenom} {apprenant.nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{apprenant.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(apprenant.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date d'inscription</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <p>15/12/2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formation actuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Formation actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{apprenant.formation}</h3>
                  <p className="text-gray-600">Formation en développement web</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Progression</label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Progress value={apprenant.progression} className="flex-1" />
                    <span className="text-sm font-medium">{apprenant.progression}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Début :</span> 15/01/2024
                  </div>
                  <div>
                    <span className="font-medium">Fin prévue :</span> 20/03/2024
                  </div>
                  <div>
                    <span className="font-medium">Heures réalisées :</span> 28/35h
                  </div>
                  <div>
                    <span className="font-medium">Dernière connexion :</span> 14/01/2024
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Évaluations récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Évaluations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Évaluation finale</p>
                    <p className="text-sm text-gray-600">20/01/2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">16/20</p>
                    <Badge variant="default">80%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Quiz intermédiaire</p>
                    <p className="text-sm text-gray-600">18/01/2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">14/20</p>
                    <Badge variant="secondary">70%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Attestation de présence</p>
                    <p className="text-sm text-green-600">Obtenue le 20/01/2024</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">Validée</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Certificat de réalisation</p>
                    <p className="text-sm text-gray-600">En cours</p>
                  </div>
                  <Badge variant="outline">En attente</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
