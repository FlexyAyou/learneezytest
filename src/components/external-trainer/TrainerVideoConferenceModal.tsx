
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, BookOpen } from 'lucide-react';
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

interface TrainerVideoConferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: VideoSession | null;
  mode: 'create' | 'edit';
}

export const TrainerVideoConferenceModal: React.FC<TrainerVideoConferenceModalProps> = ({
  open,
  onOpenChange,
  session,
  mode
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    maxStudents: 10,
    type: 'course',
    subject: ''
  });

  useEffect(() => {
    if (session && mode === 'edit') {
      setFormData({
        title: session.title,
        description: session.description,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        maxStudents: session.maxStudents,
        type: session.type,
        subject: session.subject || ''
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        maxStudents: 10,
        type: 'course',
        subject: ''
      });
    }
  }, [session, mode, open]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const action = mode === 'create' ? 'créée' : 'modifiée';
    toast({  
      title: `Session ${action}`,
      description: `La visioconférence "${formData.title}" a été ${action} avec succès`,
    });

    onOpenChange(false);
  };

  const generateMeetingId = () => {
    const prefix = formData.type.toUpperCase().substring(0, 3);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Créer une nouvelle visioconférence' : 'Modifier la visioconférence'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Configurez votre session de visioconférence et invitez vos élèves'
              : 'Modifiez les paramètres de votre session'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Informations générales */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Informations générales
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la session *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Cours de React - Les Hooks"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type de session *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">📚 Cours</SelectItem>
                    <SelectItem value="support">❓ Support</SelectItem>
                    <SelectItem value="evaluation">📊 Évaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez le contenu de votre session..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Matière</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Ex: Développement Web, Mathématiques..."
              />
            </div>
          </div>

          {/* Planification */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planification
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Heure de fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Nombre maximum d'élèves</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                max="50"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 10)}
              />
              <p className="text-sm text-gray-500">
                Recommandé : 10 élèves maximum pour une interaction optimale
              </p>
            </div>
          </div>

          {/* Aperçu ID de réunion */}
          {mode === 'create' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>ID de réunion généré :</strong> {generateMeetingId()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cet identifiant sera communiqué automatiquement à vos élèves
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'create' ? 'Créer la session' : 'Mettre à jour'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
