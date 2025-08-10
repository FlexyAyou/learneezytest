
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Send,
  VideoIcon,
  Eye,
  Bell,
  UserPlus
} from 'lucide-react';
import { OFVideoConferenceModal } from './OFVideoConferenceModal';
import { OFVideoConferenceAssignment } from './OFVideoConferenceAssignment';
import VideoConference from '@/components/common/VideoConference';
import { useToast } from '@/hooks/use-toast';

interface VideoSession {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingId: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  instructor: string;
  participants: string[];
  maxParticipants: number;
  type: 'course' | 'meeting' | 'support' | 'evaluation';
  formation?: string;
}

const OFVideoConferences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const { toast } = useToast();

  const videoSessions: VideoSession[] = [
    {
      id: '1',
      title: 'Cours de Mathématiques - Algèbre',
      description: 'Introduction aux équations du premier degré',
      date: '2024-01-20',
      startTime: '14:00',
      endTime: '15:30',
      meetingId: 'MTG-MATH-001',
      status: 'scheduled',
      instructor: 'Marie Dubois',
      participants: ['user1', 'user2', 'user3'],
      maxParticipants: 25,
      type: 'course',
      formation: 'Mathématiques CE2'
    },
    {
      id: '2',
      title: 'Session de Questions/Réponses',
      description: 'Révision du chapitre sur la mécanique',
      date: '2024-01-21',
      startTime: '16:00',
      endTime: '17:00',
      meetingId: 'MTG-PHYS-002',
      status: 'live',
      instructor: 'Pierre Martin',
      participants: ['user4', 'user5'],
      maxParticipants: 20,
      type: 'support'
    },
    {
      id: '3',
      title: 'Évaluation Finale',
      description: 'Présentation des projets finaux',
      date: '2024-01-22',
      startTime: '10:00',
      endTime: '12:00',
      meetingId: 'MTG-EVAL-003',
      status: 'completed',
      instructor: 'Sophie Laurent',
      participants: ['user1', 'user3', 'user6'],
      maxParticipants: 15,
      type: 'evaluation',
      formation: 'Développement Web'
    }
  ];

  const getStatusBadge = (status: VideoSession['status']) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-100 text-red-800 animate-pulse">🔴 En direct</Badge>;
      case 'scheduled':
        return <Badge variant="outline">📅 Programmée</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✅ Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">❌ Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getTypeBadge = (type: VideoSession['type']) => {
    switch (type) {
      case 'course':
        return <Badge variant="default">📚 Cours</Badge>;
      case 'meeting':
        return <Badge variant="secondary">🤝 Réunion</Badge>;
      case 'support':
        return <Badge className="bg-blue-100 text-blue-800">❓ Support</Badge>;
      case 'evaluation':
        return <Badge className="bg-purple-100 text-purple-800">📊 Évaluation</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  const handleJoinSession = (session: VideoSession) => {
    setSelectedSession(session);
    setShowVideoCall(true);
  };

  const handleEditSession = (session: VideoSession) => {
    setSelectedSession(session);
    setShowEditModal(true);
  };

  const handleAssignSession = (session: VideoSession) => {
    setSelectedSession(session);
    setShowAssignModal(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    // Logique de suppression
    toast({
      title: "Session supprimée",
      description: "La visioconférence a été supprimée avec succès",
    });
  };

  const handleSendReminder = (sessionId: string) => {
    // Logique d'envoi de rappel
    toast({
      title: "Rappel envoyé",
      description: "Les participants ont été notifiés",
    });
  };

  const filteredSessions = videoSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesType = filterType === 'all' || session.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (showVideoCall && selectedSession) {
    return (
      <VideoConference
        meetingId={selectedSession.meetingId}
        isHost={true}
        onLeave={() => {
          setShowVideoCall(false);
          setSelectedSession(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Visioconférences</h1>
          <p className="text-gray-600">Créez, gérez et animez vos sessions de visioconférence</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle visioconférence
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une session..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="scheduled">Programmées</SelectItem>
                <SelectItem value="live">En direct</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="course">Cours</SelectItem>
                <SelectItem value="meeting">Réunion</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="evaluation">Évaluation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions de visioconférence ({filteredSessions.length})</CardTitle>
          <CardDescription>
            Gérez vos sessions de visioconférence et leurs participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Formateur</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-gray-500">{session.description}</div>
                      <div className="text-xs text-gray-400">ID: {session.meetingId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{session.instructor}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{session.participants.length}/{session.maxParticipants}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>{getTypeBadge(session.type)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {session.status === 'live' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleJoinSession(session)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <VideoIcon className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssignSession(session)}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendReminder(session.id)}
                        disabled={session.status === 'completed'}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSession(session)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSessions.length === 0 && (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune session trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? "Aucune session ne correspond aux critères de recherche."
                  : "Commencez par créer votre première visioconférence."}
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une visioconférence
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <OFVideoConferenceModal
        open={showCreateModal || showEditModal}
        onOpenChange={(open) => {
          setShowCreateModal(false);
          setShowEditModal(false);
          if (!open) setSelectedSession(null);
        }}
        session={selectedSession}
        mode={showEditModal ? 'edit' : 'create'}
      />

      <OFVideoConferenceAssignment
        open={showAssignModal}
        onOpenChange={(open) => {
          setShowAssignModal(false);
          if (!open) setSelectedSession(null);
        }}
        session={selectedSession}
      />
    </div>
  );
};

export default OFVideoConferences;
