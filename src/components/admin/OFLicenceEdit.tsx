
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface Licence {
  id: string;
  type: string;
  nombre: number;
  utilises: number;
  expires: string;
  status: string;
}

interface OFLicenceEditProps {
  licence: Licence | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (licence: Licence) => void;
}

export const OFLicenceEdit = ({ licence, isOpen, onClose, onSave }: OFLicenceEditProps) => {
  const [formData, setFormData] = useState<Licence>({
    id: '',
    type: '',
    nombre: 0,
    utilises: 0,
    expires: '',
    status: 'active'
  });

  React.useEffect(() => {
    if (licence) {
      setFormData(licence);
    }
  }, [licence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Licence modifiée",
      description: "Les informations de la licence ont été mises à jour avec succès.",
    });
    onClose();
  };

  const handleChange = (field: keyof Licence, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la licence</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type de licence</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              placeholder="Ex: Zoom Pro"
              required
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre total</Label>
            <Input
              id="nombre"
              type="number"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', parseInt(e.target.value))}
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="utilises">Nombre utilisées</Label>
            <Input
              id="utilises"
              type="number"
              value={formData.utilises}
              onChange={(e) => handleChange('utilises', parseInt(e.target.value))}
              min="0"
              max={formData.nombre}
              required
            />
          </div>

          <div>
            <Label htmlFor="expires">Date d'expiration</Label>
            <Input
              id="expires"
              type="date"
              value={formData.expires}
              onChange={(e) => handleChange('expires', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
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
