
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, Eye, FileText, Play, CheckCircle } from 'lucide-react';

interface Formation {
  id: string;
  titre: string;
  description: string;
  formateur: string;
  niveau: string;
  duree: string;
  nbInscrits: number;
  capaciteMax: number;
  dateDebut: string;
  dateFin: string;
  status: string;
  progression: number;
  image?: string;
  programme?: string;
  etapes?: Array<{
    id: string;
    titre: string;
    description: string;
    duree: string;
    completed?: boolean;
  }>;
}

interface OFFormationDetailProps {
  formation: Formation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OFFormationDetail: React.FC<OFFormationDetailProps> = ({
  formation,
  isOpen,
  onClose,
}) => {
  if (!formation) return null;

  const etapesExample = [
    {
      id: '1',
      titre: 'Fondamentaux du Développement Web',
      description: 'Introduction aux technologies web : HTML5, CSS3, JavaScript ES6+. Comprendre l\'architecture client-serveur et les bonnes pratiques de développement.',
      duree: '24h',
      completed: true,
    },
    {
      id: '2',
      titre: 'Framework React - Composants et State Management',
      description: 'Maîtrise de React : JSX, composants, hooks, gestion d\'état avec Redux. Création d\'applications interactives et performantes.',
      duree: '32h',
      completed: false,
    },
    {
      id: '3',
      titre: 'Backend Node.js et APIs REST',
      description: 'Développement côté serveur avec Node.js, Express.js. Création d\'APIs REST, authentification JWT et intégration de bases de données.',
      duree: '28h',
      completed: false,
    },
    {
      id: '4',
      titre: 'Projet Final - Application Full Stack',
      description: 'Réalisation d\'un projet complet intégrant frontend React et backend Node.js. Déploiement sur cloud et optimisations.',
      duree: '36h',
      completed: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      completed: { variant: 'secondary' as const, label: 'Terminée', color: 'bg-green-100 text-green-800' },
      planned: { variant: 'outline' as const, label: 'Planifiée', color: 'bg-gray-100 text-gray-800' },
      cancelled: { variant: 'destructive' as const, label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>{formation.titre}</span>
            {getStatusBadge(formation.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image et informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-blue-600">💻</span>
                  </div>
                  <p className="text-sm text-gray-600">Formation Technologique</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-gray-700">{formation.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Formateur: {formation.formateur}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Durée: {formation.duree}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Du {formation.dateDebut} au {formation.dateFin}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{formation.progression}%</div>
                  <Progress value={formation.progression} className="mb-2" />
                  <p className="text-xs text-muted-foreground">Progression générale</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{formation.nbInscrits}/{formation.capaciteMax}</div>
                  <Progress value={(formation.nbInscrits / formation.capaciteMax) * 100} className="mb-2" />
                  <p className="text-xs text-muted-foreground">Places occupées</p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button className="w-full" variant="default">
                  Commencer
                </Button>
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
              </div>
            </div>
          </div>

          {/* Section Programme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PROGRAMME
              </CardTitle>
              <p className="text-sm text-gray-600">Formation : Technologique - Développement</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Développement Web</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">React</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Node.js</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">JavaScript</Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">Full Stack</Badge>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Afficher le curriculum complet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Modules de Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {etapesExample.map((etape, index) => (
                  <div key={etape.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {etape.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Play className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{etape.titre}</h4>
                          <span className="text-xs text-gray-500">{etape.duree}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{etape.description}</p>
                        <Button variant="outline" size="sm">
                          Accéder au module
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
