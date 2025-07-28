
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'completed';
  parentContact: string;
  notes: string;
}

interface TutorStudentEditProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const TutorStudentEdit = ({ student, isOpen, onClose, onSave }: TutorStudentEditProps) => {
  const [formData, setFormData] = useState<Student>({
    id: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    progress: 0,
    lastActivity: '',
    status: 'active',
    parentContact: '',
    notes: ''
  });

  React.useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Étudiant mis à jour",
      description: `Les informations de ${formData.name} ont été mises à jour avec succès.`,
    });
    onClose();
  };

  const handleChange = (field: keyof Student, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier l'étudiant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value as 'active' | 'inactive' | 'completed')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parentContact">Contact parent</Label>
            <Input
              id="parentContact"
              type="email"
              value={formData.parentContact}
              onChange={(e) => handleChange('parentContact', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Cours</Label>
              <Select value={formData.course} onValueChange={(value) => handleChange('course', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="React Avancé">React Avancé</SelectItem>
                  <SelectItem value="JavaScript ES6">JavaScript ES6</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Node.js">Node.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes de suivi</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Ajoutez vos notes de suivi..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
