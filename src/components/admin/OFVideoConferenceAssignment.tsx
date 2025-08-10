
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, User, Users, Mail } from 'lucide-react';
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'apprenant' | 'animateur' | 'administrateur' | 'référent';
  formation?: string;
}

interface OFVideoConferenceAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: VideoSession | null;
}

export const OFVideoConferenceAssignment: React.FC<OFVideoConferenceAssignmentProps> = ({
  open,
  onOpenChange,
  session
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users: User[] = [
    { id: '1', name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'apprenant', formation: 'Mathématiques CE2' },
    { id: '2', name: 'Jean Martin', email: 'jean.martin@email.com', role: 'apprenant', formation: 'Mathématiques CE2' },
    { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'apprenant', formation: 'Français CM1' },
    { id: '4', name: 'Pierre Durand', email: 'pierre.durand@email.com', role: 'apprenant', formation: 'Sciences Physiques' },
    { id: '5', name: 'Lucie Moreau', email: 'lucie.moreau@email.com', role: 'animateur' },
    { id: '6', name: 'Thomas Petit', email: 'thomas.petit@email.com', role: 'référent' },
    { id: '7', name: 'Emma Laurent', email: 'emma.laurent@email.com', role: 'apprenant', formation: 'Développement Web' },
    { id: '8', name: 'Lucas Simon', email: 'lucas.simon@email.com', role: 'apprenant', formation: 'Mathématiques CE2' }
  ];

  React.useEffect(() => {
    if (session && open) {
      setSelectedUsers(session.participants || []);
    }
  }, [session, open]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    if (selectedUsers.length === filteredUserIds.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUserIds);
    }
  };

  const handleSave = () => {
    if (selectedUsers.length > (session?.maxParticipants || 20)) {
      toast({
        title: "Erreur",
        description: `Le nombre de participants sélectionnés (${selectedUsers.length}) dépasse la limite (${session?.maxParticipants})`,
        variant: "destructive",
      });
      return;
    }

    console.log('Assigning users to session:', session?.id, selectedUsers);
    
    toast({
      title: "Participants assignés",
      description: `${selectedUsers.length} participant(s) ont été assignés à la session`,
    });

    onOpenChange(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si la session est liée à une formation, privilégier les apprenants de cette formation
    if (session?.formation) {
      return matchesSearch && (user.formation === session.formation || user.role !== 'apprenant');
    }
    
    return matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'apprenant':
        return <Badge variant="default">👨‍🎓 Apprenant</Badge>;
      case 'animateur':
        return <Badge variant="secondary">👨‍🏫 Animateur</Badge>;
      case 'administrateur':
        return <Badge className="bg-purple-100 text-purple-800">👑 Admin</Badge>;
      case 'référent':
        return <Badge className="bg-blue-100 text-blue-800">📋 Référent</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assigner des participants</DialogTitle>
          <DialogDescription>
            Sélectionnez les utilisateurs qui participeront à la session "{session.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations de la session */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">{session.title}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📅 {new Date(session.date).toLocaleDateString('fr-FR')}</span>
              <span>⏰ {session.startTime} - {session.endTime}</span>
              <span>👥 Max: {session.maxParticipants}</span>
              {session.formation && <span>📚 {session.formation}</span>}
            </div>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions en lot */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedUsers.length === filteredUsers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </Button>
            <div className="text-sm text-gray-600">
              {selectedUsers.length} / {session.maxParticipants} participants sélectionnés
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <ScrollArea className="h-64 border rounded-md">
            <div className="p-4 space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {user.email}
                      {user.formation && (
                        <>
                          <span>•</span>
                          <span>📚 {user.formation}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Assigner {selectedUsers.length} participant(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
