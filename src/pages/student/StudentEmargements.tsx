import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, PenTool, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StudentEmargements = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Données mockées
  const emargements = [
    {
      id: '1',
      courseName: 'Mathématiques CE2',
      sessionDate: '2024-01-22',
      sessionStartTime: '09:00',
      sessionEndTime: '12:00',
      isPresent: true,
      signatureTimestamp: '2024-01-22T09:05:00Z',
    },
    {
      id: '2',
      courseName: 'Mathématiques CE2', 
      sessionDate: '2024-01-24',
      sessionStartTime: '09:00',
      sessionEndTime: '12:00',
      isPresent: false,
      signatureTimestamp: null,
    },
    {
      id: '3',
      courseName: 'Français CM1',
      sessionDate: '2024-01-25',
      sessionStartTime: '14:00',
      sessionEndTime: '17:00',
      isPresent: null, // Session en cours
      signatureTimestamp: null,
    }
  ];

  const getStatusBadge = (emargement: any) => {
    if (emargement.isPresent === true) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Présent</Badge>;
    } else if (emargement.isPresent === false) {
      return <Badge variant="destructive">Absent</Badge>;
    } else {
      const sessionDate = new Date(emargement.sessionDate + 'T' + emargement.sessionStartTime);
      const now = new Date();
      const isToday = sessionDate.toDateString() === now.toDateString();
      const isPast = sessionDate < now;
      
      if (isToday && !isPast) {
        return <Badge variant="default" className="bg-blue-500">En cours</Badge>;
      } else if (isPast) {
        return <Badge variant="secondary">À signer</Badge>;
      } else {
        return <Badge variant="outline">À venir</Badge>;
      }
    }
  };

  const canSignEmargement = (emargement: any) => {
    const sessionDate = new Date(emargement.sessionDate + 'T' + emargement.sessionStartTime);
    const now = new Date();
    const isToday = sessionDate.toDateString() === now.toDateString();
    return emargement.isPresent === null && isToday;
  };

  const handleSignEmargement = (emargement: any) => {
    // Ici on intégrera la signature électronique
    setSelectedSession(emargement);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Émargement Digital</h1>
        <p className="text-gray-600">Signez votre présence aux séances de formation</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {emargements.filter(e => e.isPresent === true).length}
                </p>
                <p className="text-sm text-gray-600">Séances présent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{emargements.length}</p>
                <p className="text-sm text-gray-600">Total séances</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((emargements.filter(e => e.isPresent === true).length / emargements.length) * 100) || 0}%
                </p>
                <p className="text-sm text-gray-600">Assiduité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des émargements */}
      <div className="space-y-4">
        {emargements.map((emargement) => (
          <Card key={emargement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{emargement.courseName}</CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(emargement.sessionDate).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {emargement.sessionStartTime} - {emargement.sessionEndTime}
                    </span>
                  </CardDescription>
                </div>
                {getStatusBadge(emargement)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  {emargement.signatureTimestamp && (
                    <p className="text-sm text-gray-600">
                      Signé le {new Date(emargement.signatureTimestamp).toLocaleString('fr-FR')}
                    </p>
                  )}
                  {!emargement.signatureTimestamp && emargement.isPresent === false && (
                    <p className="text-sm text-red-600">Absence non justifiée</p>
                  )}
                </div>
                
                {canSignEmargement(emargement) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedSession(emargement)}>
                        <PenTool className="w-4 h-4 mr-2" />
                        Signer ma présence
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Signature d'émargement</DialogTitle>
                        <DialogDescription>
                          Confirmez votre présence à la séance du {new Date(emargement.sessionDate).toLocaleDateString('fr-FR')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium">{emargement.courseName}</h4>
                          <p className="text-sm text-gray-600">
                            {emargement.sessionStartTime} - {emargement.sessionEndTime}
                          </p>
                        </div>
                        
                        {/* Zone de signature électronique */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Zone de signature électronique</p>
                          <p className="text-xs text-gray-500">
                            En signant, je certifie ma présence à cette séance
                          </p>
                        </div>
                        
                        <Button className="w-full" onClick={() => {
                          // Ici on traiterait la signature
                          console.log('Signature pour:', emargement);
                        }}>
                          Confirmer ma présence
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentEmargements;