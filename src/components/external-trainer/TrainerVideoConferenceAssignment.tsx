
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, User, Users, Mail, GraduationCap } from 'lucide-react';
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
  students: string[];
  maxStudents: number;
  type: 'course' | 'support' | 'evaluation';
  subject?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  subject?: string;
  progress: number;
}

interface TrainerVideoConferenceAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: VideoSession | null;
}

export const TrainerVideoConferenceAssignment: React.FC<TrainerVideoConferenceAssignmentProps> = ({
  open,
  onOpenChange,
  session
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const students: Student[] = [
    { id: '1', name: 'Pierre Martin', email: 'pierre.martin@email.com', level: 'Débutant', subject: 'Développement Web', progress: 65 },
    { id: '2', name: 'Sophie Laurent', email: 'sophie.laurent@email.com', level: 'Intermédiaire', subject: 'Développement Web', progress: 78 },
    { id: '3', name: 'Thomas Dubois', email: 'thomas.dubois@email.com', level: 'Avancé', subject: 'JavaScript', progress: 92 },
    { id: '4', name: 'Marie Rousseau', email: 'marie.rousseau@email.com', level: 'Débutant', subject: 'React', progress: 43 },
    { id: '5', name: 'Lucas Bernard', email: 'lucas.bernard@email.com', level: 'Intermédiaire', subject: 'Développement Web', progress: 56 },
    { id: '6', name: 'Emma Petit', email: 'emma.petit@email.com', level: 'Débutant', subject: 'HTML/CSS', progress: 34 },
    { id: '7', name: 'Hugo Moreau', email: 'hugo.moreau@email.com', level: 'Avancé', subject: 'Node.js', progress: 89 },
    { id: '8', name: 'Léa Girard', email: 'lea.girard@email.com', level: 'Intermédiaire', subject: 'React', progress: 67 }
  ];

  React.useEffect(() => {
    if (session && open) {
      setSelectedStudents(session.students || []);
    }
  }, [session, open]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const filteredStudentIds = filteredStudents.map(student => student.id);
    if (selectedStudents.length === filteredStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudentIds);
    }
  };

  const handleSave = () => {
    if (selectedStudents.length > (session?.maxStudents || 10)) {
      toast({
        title: "Erreur",
        description: `Le nombre d'élèves sélectionnés (${selectedStudents.length}) dépasse la limite (${session?.maxStudents})`,
        variant: "destructive",
      });
      return;
    }

    console.log('Assigning students to session:', session?.id, selectedStudents);
    
    toast({
      title: "Élèves invités",
      description: `${selectedStudents.length} élève(s) ont été invités à la session`,
    });

    onOpenChange(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si la session a une matière définie, privilégier les élèves de cette matière
    if (session?.subject) {
      return matchesSearch && student.subject?.toLowerCase().includes(session.subject.toLowerCase());
    }
    
    return matchesSearch;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Débutant':
        return <Badge className="bg-green-100 text-green-800">🌱 Débutant</Badge>;
      case 'Intermédiaire':
        return <Badge className="bg-blue-100 text-blue-800">📈 Intermédiaire</Badge>;
      case 'Avancé':
        return <Badge className="bg-purple-100 text-purple-800">🎯 Avancé</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inviter des élèves</DialogTitle>
          <DialogDescription>
            Sélectionnez les élèves qui participeront à la session "{session.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations de la session */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">{session.title}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📅 {new Date(session.date).toLocaleDateString('fr-FR')}</span>
              <span>⏰ {session.startTime} - {session.endTime}</span>
              <span>👥 Max: {session.maxStudents}</span>
              {session.subject && <span>📚 {session.subject}</span>}
            </div>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un élève..."
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
              {selectedStudents.length === filteredStudents.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </Button>
            <div className="text-sm text-gray-600">
              {selectedStudents.length} / {session.maxStudents} élèves sélectionnés
            </div>
          </div>

          {/* Liste des élèves */}
          <ScrollArea className="h-64 border rounded-md">
            <div className="p-4 space-y-2">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg border">
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentToggle(student.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{student.name}</span>
                      {getLevelBadge(student.level)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {student.email}
                      {student.subject && (
                        <>
                          <span>•</span>
                          <GraduationCap className="w-3 h-3" />
                          <span>{student.subject}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{student.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun élève trouvé</p>
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
              Inviter {selectedStudents.length} élève(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
