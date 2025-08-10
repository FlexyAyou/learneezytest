
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface OFVideoConferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: VideoSession | null;
  mode: 'create' | 'edit';
}

export const OFVideoConferenceModal: React.FC<OFVideoConferenceModalProps> = ({
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
    instructor: '',
    maxParticipants: 20,
    type: 'course' as 'course' | 'meeting' | 'support' | 'evaluation',
    formation: ''
  });

  const instructors = [
    'Marie Dubois',
    'Pierre Martin',
    'Sophie Laurent',
    'Jean Dupont',
    'Anne Moreau'
  ];

  const formations = [
    'Mathématiques CE2',
    'Français CM1',
    'Sciences Physiques',
    'Histoire CM2',
    'Développement Web'
  ];

  useEffect(() => {
    if (session && mode === 'edit') {
      setFormData({
        title: session.title,
        description: session.description,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        instructor: session.instructor,
        maxParticipants: session.maxParticipants,
        type: session.type,
        formation: session.formation || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        instructor: '',
        maxParticipants: 20,
        type: 'course',
        formation: ''
      });
    }
  }, [session, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.instructor) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Générer un ID de meeting unique si création
    const meetingId = mode === 'create' 
      ? `MTG-${formData.type.toUpperCase()}-${Date.now().toString().slice(-3)}`
      : session?.meetingId || '';

    const sessionData = {
      ...formData,
      meetingId,
      status: 'scheduled' as const,
      participants: session?.participants || []
    };

    console.log('Saving session:', sessionData);

    toast({
      title: mode === 'create' ? "Session créée" : "Session modifiée",
      description: `La visioconférence "${formData.title}" a été ${mode === 'create' ? 'créée' : 'modifiée'} avec succès`,
    });

    onOpenChange(false);
  };

  const generateMeetingId = () => {
    const id = `MTG-${formData.type.toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    return id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Créer une visioconférence' : 'Modifier la visioconférence'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Configurez votre nouvelle session de visioconférence'
              : 'Modifiez les paramètres de la visioconférence'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Titre de la session *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Cours de Mathématiques - Algèbre"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la session..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Type de session *</Label>
              <Select value={formData.type} onValueChange={(value: 'course' | 'meeting' | 'support' | 'evaluation') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">📚 Cours</SelectItem>
                  <SelectItem value="meeting">🤝 Réunion</SelectItem>
                  <SelectItem value="support">❓ Support</SelectItem>
                  <SelectItem value="evaluation">📊 Évaluation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formation">Formation (si applicable)</Label>
              <Select value={formData.formation} onValueChange={(value) => setFormData(prev => ({ ...prev, formation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune formation spécifique</SelectItem>
                  {formations.map((formation) => (
                    <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructor">Formateur/Animateur *</Label>
              <Select value={formData.instructor} onValueChange={(value) => setFormData(prev => ({ ...prev, instructor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un formateur" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxParticipants">Nombre max de participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="100"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 20 }))}
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime">Heure de début *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">Heure de fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Créer la session' : 'Sauvegarder les modifications'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
