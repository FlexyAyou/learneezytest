import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Play,
  CheckCircle,
  Upload,
  Video,
  Link2,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  type: 'presential' | 'remote';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  enrolledStudents: string[];
}

const InternalTrainerSessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Formation Mathématiques - Niveau 1',
      date: '2024-01-25',
      time: '14:00',
      duration: 120,
      location: 'Salle A1',
      type: 'presential',
      status: 'upcoming',
      participants: 8,
      maxParticipants: 15,
      enrolledStudents: ['Alice Martin', 'Bob Dupont', 'Claire Durand', 'David Lambert', 'Emma Rousseau', 'Franck Petit', 'Gabrielle Moreau', 'Henri Bernard']
    },
    {
      id: '2',
      title: 'Atelier Comptabilité en ligne',
      date: '2024-01-22',
      time: '10:00',
      duration: 90,
      meetingLink: 'https://meet.example.com/abc123',
      type: 'remote',
      status: 'completed',
      participants: 12,
      maxParticipants: 20,
      enrolledStudents: []
    },
    {
      id: '3',
      title: 'Cours Anglais Intermédiaire',
      date: '2024-01-20',
      time: '16:00',
      duration: 60,
      location: 'Salle B2',
      type: 'presential',
      status: 'completed',
      participants: 6,
      maxParticipants: 10,
      enrolledStudents: []
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const handleLaunchSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'ongoing' as const } : s
    ));
    toast({
      title: "Session lancée",
      description: "La session a été lancée avec succès"
    });
  };

  const handleCompleteSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'completed' as const } : s
    ));
    toast({
      title: "Session terminée",
      description: "La session a été marquée comme terminée"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'ongoing':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus !== 'all' && session.status !== filterStatus) return false;
    if (filterType !== 'all' && session.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Animation de sessions</h1>
          <p className="text-muted-foreground">Gérez vos sessions de formation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'upcoming').length}</p>
                <p className="text-sm text-muted-foreground">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'ongoing').length}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{sessions.reduce((acc, s) => acc + s.participants, 0)}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtres:</span>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="ongoing">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="presential">Présentiel</SelectItem>
                <SelectItem value="remote">À distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sessions */}
      <div className="grid gap-4">
        {filteredSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(session.status)}
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    {getStatusBadge(session.status)}
                    <Badge variant="outline">
                      {session.type === 'presential' ? 'Présentiel' : 'À distance'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{session.time} ({session.duration}min)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {session.type === 'presential' ? (
                        <>
                          <MapPin className="h-4 w-4" />
                          <span>{session.location}</span>
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4" />
                          <span>Session en ligne</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{session.participants}/{session.maxParticipants} inscrits</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {session.status === 'upcoming' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleLaunchSession(session.id)}
                      className="whitespace-nowrap"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Lancer
                    </Button>
                  )}
                  
                  {session.status === 'ongoing' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteSession(session.id)}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                        className="whitespace-nowrap"
                      >
                        Voir détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{session.title}</DialogTitle>
                      </DialogHeader>
                      
                      {selectedSession && (
                        <Tabs defaultValue="info" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="info">Informations</TabsTrigger>
                            <TabsTrigger value="participants">Participants</TabsTrigger>
                            <TabsTrigger value="content">Contenu</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="info" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Date</label>
                                <p>{new Date(selectedSession.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Heure</label>
                                <p>{selectedSession.time} ({selectedSession.duration} min)</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Type</label>
                                <p>{selectedSession.type === 'presential' ? 'Présentiel' : 'À distance'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Lieu/Lien</label>
                                <p>{selectedSession.location || selectedSession.meetingLink}</p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="participants" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Liste des inscrits ({selectedSession.participants})</h4>
                              <div className="space-y-2">
                                {selectedSession.enrolledStudents.map((student, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <span>{student}</span>
                                    <Badge variant="outline">Inscrit</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="content" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Contenu associé</h4>
                              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">Téléverser du contenu pour cette session</p>
                                <Button variant="outline" size="sm">
                                  Parcourir les fichiers
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InternalTrainerSessions;