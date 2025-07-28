
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface Availability {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  recurringType: string;
  isBooked: boolean;
}

interface TrainerAvailabilityEditProps {
  availability: Availability | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (availability: Availability) => void;
}

export const TrainerAvailabilityEdit = ({ availability, isOpen, onClose, onSave }: TrainerAvailabilityEditProps) => {
  const [formData, setFormData] = useState<Availability>({
    id: 0,
    date: '',
    timeStart: '',
    timeEnd: '',
    recurringType: 'none',
    isBooked: false
  });

  React.useEffect(() => {
    if (availability) {
      setFormData(availability);
    }
  }, [availability]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Disponibilité modifiée",
      description: "Votre créneau a été mis à jour avec succès.",
    });
    onClose();
  };

  const handleChange = (field: keyof Availability, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le créneau</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeStart">Heure de début</Label>
              <Input
                id="timeStart"
                type="time"
                value={formData.timeStart}
                onChange={(e) => handleChange('timeStart', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="timeEnd">Heure de fin</Label>
              <Input
                id="timeEnd"
                type="time"
                value={formData.timeEnd}
                onChange={(e) => handleChange('timeEnd', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="recurringType">Récurrence</Label>
            <Select value={formData.recurringType} onValueChange={(value) => handleChange('recurringType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuelle</SelectItem>
              </SelectContent>
            </Select>
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
