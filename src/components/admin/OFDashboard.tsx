
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BookOpen, TrendingUp } from 'lucide-react';

export const OFDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• 5 nouveaux documents générés</p>
            <p>• 2 apprenants inscrits</p>
            <p>• 1 formation terminée</p>
            <p>• 3 attestations envoyées</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Prochaines échéances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Formation React - 15 février</p>
            <p>• Évaluation JavaScript - 18 février</p>
            <p>• Renouvellement licence Zoom - 20 février</p>
            <p>• Attestations à envoyer - 22 février</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Statistiques du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• 456 heures de formation</p>
            <p>• 87% de taux de satisfaction</p>
            <p>• 12 nouvelles certifications</p>
            <p>• 92% de taux d'assiduité</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Alertes et notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-orange-600">• Licence Adobe Sign expire dans 30 jours</p>
            <p className="text-green-600">• Intégration Zoom fonctionnelle</p>
            <p className="text-blue-600">• 3 nouvelles demandes d'inscription</p>
            <p className="text-red-600">• Erreur sync Microsoft Teams</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
