
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { History, Eye, Download, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  date: string;
  course: string;
  student: string;
  duration: number;
  rating: number;
  status: 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  feedback?: string;
}

export const TrainerHistoryActions = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      date: '2024-01-10',
      course: 'React Avancé',
      student: 'Marie Dupont',
      duration: 2,
      rating: 5,
      status: 'completed',
      notes: 'Excellent cours sur les hooks',
      feedback: 'Très bon formateur, explications claires'
    },
    {
      id: '2',
      date: '2024-01-08',
      course: 'JavaScript ES6',
      student: 'Jean Martin',
      duration: 1.5,
      rating: 4,
      status: 'completed',
      notes: 'Bonne progression sur les concepts',
      feedback: 'Cours intéressant mais un peu rapide'
    },
    {
      id: '3',
      date: '2024-01-05',
      course: 'TypeScript',
      student: 'Sophie Bernard',
      duration: 3,
      rating: 0,
      status: 'no-show',
      notes: 'Étudiant absent sans prévenir'
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, label: 'Terminé' },
      cancelled: { variant: 'destructive' as const, label: 'Annulé' },
      'no-show': { variant: 'outline' as const, label: 'Absent' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetail = (session: Session) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const handleDownloadHistory = () => {
    const historyData = sessions.map(s => 
      `${s.date}\t${s.course}\t${s.student}\t${s.duration}h\t${s.rating}/5\t${s.status}`
    ).join('\n');
    
    const header = 'Date\tCours\tÉtudiant\tDurée\tNote\tStatut\n';
    const csvContent = header + historyData;
    
    const element = document.createElement('a');
    element.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    element.download = 'historique-sessions.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Historique téléchargé",
      description: "Votre historique de sessions a été téléchargé avec succès.",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const averageRating = sessions.filter(s => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / sessions.filter(s => s.rating > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historique des Sessions</h2>
          <p className="text-gray-600">Consultez vos sessions passées et leurs évaluations</p>
        </div>
        <Button onClick={handleDownloadHistory}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger historique
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalHours}h</p>
                <p className="text-muted-foreground text-sm">Total enseigné</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{completedSessions}</p>
                <p className="text-muted-foreground text-sm">Sessions terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{averageRating ? averageRating.toFixed(1) : 'N/A'}</p>
                <p className="text-muted-foreground text-sm">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Sessions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell className="font-medium">{session.course}</TableCell>
                  <TableCell>{session.student}</TableCell>
                  <TableCell>{session.duration}h</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {session.rating > 0 ? renderStars(session.rating) : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetail(session)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la session</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{selectedSession.date}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Cours</label>
                  <p className="text-gray-900">{selectedSession.course}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Étudiant</label>
                  <p className="text-gray-900">{selectedSession.student}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Durée</label>
                  <p className="text-gray-900">{selectedSession.duration}h</p>
                </div>
              </div>
              
              {selectedSession.rating > 0 && (
                <div>
                  <label className="font-medium text-gray-700">Évaluation</label>
                  <div className="flex items-center mt-1">
                    {renderStars(selectedSession.rating)}
                    <span className="ml-2 text-sm text-gray-600">({selectedSession.rating}/5)</span>
                  </div>
                </div>
              )}
              
              {selectedSession.notes && (
                <div>
                  <label className="font-medium text-gray-700">Vos notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedSession.notes}</p>
                </div>
              )}
              
              {selectedSession.feedback && (
                <div>
                  <label className="font-medium text-gray-700">Feedback étudiant</label>
                  <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedSession.feedback}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
