import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const StudentInscriptions = () => {
  // Données mockées en attendant l'intégration Supabase
  const inscriptions = [
    {
      id: '1',
      courseName: 'Mathématiques CE2',
      status: 'validated',
      conventionSigned: true,
      documentsSent: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2', 
      courseName: 'Français CM1',
      status: 'pending',
      conventionSigned: false,
      documentsSent: false,
      createdAt: '2024-01-20T14:15:00Z',
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Inscriptions</h1>
        <p className="text-gray-600">Gérez vos inscriptions et conventions de formation</p>
      </div>

      <div className="grid gap-6">
        {inscriptions.map((inscription) => (
          <Card key={inscription.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{inscription.courseName}</CardTitle>
                  <CardDescription>
                    Inscrit le {new Date(inscription.createdAt).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                {getStatusBadge(inscription.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Convention signée</p>
                    <p className="text-sm text-gray-600">
                      {inscription.conventionSigned ? 'Oui ✓' : 'En attente'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Documents envoyés</p>
                    <p className="text-sm text-gray-600">
                      {inscription.documentsSent ? 'Oui ✓' : 'En attente'}
                    </p>
                  </div>
                </div>
              </div>
              
              {inscription.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    Votre inscription est en cours de traitement. Vous recevrez les documents de formation par email une fois validée.
                  </p>
                  <Button size="sm" variant="outline">
                    Voir les détails
                  </Button>
                </div>
              )}
              
              {inscription.status === 'validated' && (
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Convention
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Programme
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Règlement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {inscriptions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune inscription</h3>
              <p className="text-gray-600 mb-4">Vous n'avez pas encore d'inscription en cours.</p>
              <Button>Découvrir les formations</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentInscriptions;