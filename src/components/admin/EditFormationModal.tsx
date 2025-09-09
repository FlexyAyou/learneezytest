import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  description: string;
  formateur: string;
  niveau: string;
  duree: string;
  dateDebut: string;
  dateFin: string;
  participants: number;
  capaciteMax: number;
  inscrits: number;
  termines: number;
  status: string;
  progression: number;
  vues: number;
  stats: string;
}

interface EditFormationModalProps {
  formation: Formation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formation: Formation) => void;
}

export const EditFormationModal = ({ formation, isOpen, onClose, onSave }: EditFormationModalProps) => {
  const [formData, setFormData] = useState<Formation | null>(null);

  React.useEffect(() => {
    if (formation) {
      setFormData({ ...formation });
    }
  }, [formation]);

  if (!formation || !formData) return null;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      toast.success('Formation mise à jour avec succès !');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Modifier la formation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="titre">Titre de la formation</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    placeholder="Titre de la formation"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description détaillée de la formation"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="formateur">Formateur</Label>
                  <Input
                    id="formateur"
                    value={formData.formateur}
                    onChange={(e) => handleInputChange('formateur', e.target.value)}
                    placeholder="Nom du formateur"
                  />
                </div>

                <div>
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select 
                    value={formData.niveau} 
                    onValueChange={(value) => handleInputChange('niveau', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Débutant">Débutant</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Avancé">Avancé</SelectItem>
                      <SelectItem value="Professionnel">Professionnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duree">Durée</Label>
                  <Input
                    id="duree"
                    value={formData.duree}
                    onChange={(e) => handleInputChange('duree', e.target.value)}
                    placeholder="ex: 120h"
                  />
                </div>

                <div>
                  <Label htmlFor="capaciteMax">Capacité maximale</Label>
                  <Input
                    id="capaciteMax"
                    type="number"
                    value={formData.capaciteMax}
                    onChange={(e) => handleInputChange('capaciteMax', parseInt(e.target.value))}
                    placeholder="Nombre max de participants"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates et planification */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Dates et planification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    value={formData.dateDebut}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    placeholder="Date de début"
                  />
                </div>

                <div>
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    value={formData.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    placeholder="Date de fin"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut et progression */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Statut et progression</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut de la formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planifiée</SelectItem>
                      <SelectItem value="active">En cours</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="progression">Progression (%)</Label>
                  <Input
                    id="progression"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progression}
                    onChange={(e) => handleInputChange('progression', parseInt(e.target.value))}
                    placeholder="Progression en %"
                  />
                </div>

                <div>
                  <Label htmlFor="participants">Participants actuels</Label>
                  <Input
                    id="participants"
                    type="number"
                    value={formData.participants}
                    onChange={(e) => handleInputChange('participants', parseInt(e.target.value))}
                    placeholder="Nombre de participants"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="inscrits">Inscrits</Label>
                  <Input
                    id="inscrits"
                    type="number"
                    value={formData.inscrits}
                    onChange={(e) => handleInputChange('inscrits', parseInt(e.target.value))}
                    placeholder="Nombre d'inscrits"
                  />
                </div>

                <div>
                  <Label htmlFor="termines">Terminés</Label>
                  <Input
                    id="termines"
                    type="number"
                    value={formData.termines}
                    onChange={(e) => handleInputChange('termines', parseInt(e.target.value))}
                    placeholder="Nombre ayant terminé"
                  />
                </div>

                <div>
                  <Label htmlFor="vues">Vues</Label>
                  <Input
                    id="vues"
                    type="number"
                    value={formData.vues}
                    onChange={(e) => handleInputChange('vues', parseInt(e.target.value))}
                    placeholder="Nombre de vues"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};