import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  courseTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'current' | 'completed' | 'missed';
  signed: boolean;
  location?: string;
}

const StudentEmargements = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const { toast } = useToast();

  // Données d'exemple
  const sessions: Session[] = [
    {
      id: '1',
      courseTitle: 'Mathématiques CE2 - Module 1',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '12:00',
      status: 'completed',
      signed: true,
      location: 'Salle A101'
    },
    {
      id: '2',
      courseTitle: 'Mathématiques CE2 - Module 2',
      date: '2024-01-22',
      startTime: '09:00',
      endTime: '12:00',
      status: 'current',
      signed: false,
      location: 'Salle A101'
    },
    {
      id: '3',
      courseTitle: 'Mathématiques CE2 - Module 3',
      date: '2024-01-29',
      startTime: '09:00',
      endTime: '12:00',
      status: 'upcoming',
      signed: false,
      location: 'Salle A101'
    }
  ];

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'current':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'upcoming':
        return <Badge variant="outline">À venir</Badge>;
      case 'missed':
        return <Badge variant="destructive">Manquée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature);
    toast({
      title: "Signature enregistrée",
      description: "Votre émargement a été sauvegardé.",
    });
  };

  const handleSignEmargement = (sessionId: string) => {
    // Simulation de signature d'émargement
    console.log('Émargement signé pour la session:', sessionId);
    console.log('Signature:', signatureData);
    
    toast({
      title: "Émargement validé",
      description: "Votre présence a été enregistrée avec succès.",
    });
    
    setSelectedSession(null);
    setSignatureData(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Émargements</h1>
        <Badge variant="outline" className="text-sm">
          {sessions.filter(s => s.signed).length} / {sessions.length} sessions signées
        </Badge>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{session.courseTitle}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(session.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {session.startTime} - {session.endTime}
                    </span>
                    {session.location && (
                      <span className="text-sm text-gray-500">
                        📍 {session.location}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(session.status)}
                  {session.signed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {session.status === 'current' && !session.signed ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Session en cours - Émargement requis
                    </span>
                  </div>
                  
                  {selectedSession === session.id ? (
                    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium">Signature d'émargement</h4>
                      <p className="text-sm text-gray-600">
                        En signant ci-dessous, je certifie ma présence à cette session de formation.
                      </p>
                      
                      <ElectronicSignature 
                        onSignatureComplete={handleSignatureComplete}
                      />
                      
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedSession(null)}
                        >
                          Annuler
                        </Button>
                        <Button 
                          onClick={() => handleSignEmargement(session.id)}
                          disabled={!signatureData}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Valider l'émargement
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setSelectedSession(session.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Signer l'émargement
                    </Button>
                  )}
                </div>
              ) : session.signed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Émargement signé le {new Date(session.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {session.status === 'upcoming' 
                    ? 'L\'émargement sera disponible le jour de la session'
                    : 'Session non disponible pour signature'
                  }
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune session disponible</h3>
            <p className="text-gray-600">
              Les sessions d'émargement apparaîtront ici une fois que vous serez inscrit à des formations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentEmargements;