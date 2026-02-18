
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrganismeFormData } from '@/types/organisme';
import { FileText, Award, Hash, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrganismeFormStep3Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep3: React.FC<OrganismeFormStep3Props> = ({
  formData,
  updateFormData
}) => {
  const { toast } = useToast();
  const [isCustomAgrementDialogOpen, setIsCustomAgrementDialogOpen] = useState(false);
  const [customAgrementValue, setCustomAgrementValue] = useState('');
  const [customAgrements, setCustomAgrements] = useState<string[]>([]);

  const handleAddCustomAgrement = () => {
    if (!customAgrementValue.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom d'agrément",
        variant: "destructive"
      });
      return;
    }

    const newAgrement = customAgrementValue.trim();

    // Vérifier si l'agrément existe déjà
    if (customAgrements.includes(newAgrement) || ['Qualiopi', 'OPCO', 'Datadock', 'ISQ'].includes(newAgrement)) {
      toast({
        title: "Erreur",
        description: "Cet agrément existe déjà",
        variant: "destructive"
      });
      return;
    }

    setCustomAgrements([...customAgrements, newAgrement]);
    const currentAgrements = formData.agrement || [];
    updateFormData({ agrement: [...currentAgrements, newAgrement] });

    toast({
      title: "Agrément ajouté",
      description: `L'agrément "${newAgrement}" a été ajouté avec succès`
    });

    setCustomAgrementValue('');
    setIsCustomAgrementDialogOpen(false);
  };

  const allAgrements = ['Qualiopi', 'OPCO', 'Datadock', 'ISQ', ...customAgrements];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siret" className="flex items-center">
            <Hash className="w-4 h-4 mr-2" />
            Numéro SIRET * <span className="text-xs font-normal text-gray-500 ml-1">(14 chiffres)</span>
          </Label>
          <Input
            id="siret"
            value={formData.siret}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').substring(0, 14);
              updateFormData({ siret: val });
            }}
            placeholder="12345678901234"
            maxLength={14}
            required
            className={formData.siret && formData.siret.length !== 14 ? "border-orange-500 focus-visible:ring-orange-500" : ""}
          />
          {formData.siret && formData.siret.length !== 14 && (
            <p className="text-[10px] text-orange-600">Le SIRET doit comporter exactement 14 chiffres</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroDeclaration" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Numéro de déclaration d'activité * <span className="text-xs font-normal text-gray-500 ml-1">(11 chiffres)</span>
          </Label>
          <Input
            id="numeroDeclaration"
            value={formData.numeroDeclaration}
            onChange={(e) => {
              // On accepte la saisie mais on nettoie pour le calcul de longueur
              updateFormData({ numeroDeclaration: e.target.value });
            }}
            placeholder="12345678901"
            maxLength={15} // Un peu plus pour les tirets éventuels
            required
            className={formData.numeroDeclaration && formData.numeroDeclaration.replace(/[-\s]/g, '').length !== 11 ? "border-orange-500 focus-visible:ring-orange-500" : ""}
          />
          {formData.numeroDeclaration && formData.numeroDeclaration.replace(/[-\s]/g, '').length !== 11 && (
            <p className="text-[10px] text-orange-600">Le NDA doit comporter exactement 11 chiffres</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          <span className="flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Agrément / Certification qualité
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCustomAgrementDialogOpen(true)}
            className="h-8"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter un agrément
          </Button>
        </Label>
        <div className="space-y-3 border rounded-lg p-4">
          {allAgrements.map((agrement) => (
            <div key={agrement} className="flex items-center space-x-2">
              <Checkbox
                id={agrement}
                checked={formData.agrement?.includes(agrement) || false}
                onCheckedChange={(checked) => {
                  const currentAgrements = formData.agrement || [];
                  if (checked) {
                    updateFormData({ agrement: [...currentAgrements, agrement] });
                  } else {
                    updateFormData({
                      agrement: currentAgrements.filter(a => a !== agrement)
                    });
                  }
                }}
              />
              <Label
                htmlFor={agrement}
                className="text-sm font-normal cursor-pointer"
              >
                {agrement}
              </Label>
              {customAgrements.includes(agrement) && (
                <span className="text-xs text-muted-foreground">(personnalisé)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isCustomAgrementDialogOpen} onOpenChange={setIsCustomAgrementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un agrément personnalisé</DialogTitle>
            <DialogDescription>
              Entrez le nom de l'agrément ou certification que vous souhaitez ajouter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-agrement">Nom de l'agrément</Label>
              <Input
                id="custom-agrement"
                placeholder="Ex: ISO 9001, RNCP, etc."
                value={customAgrementValue}
                onChange={(e) => setCustomAgrementValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAgrement();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCustomAgrementValue('');
                setIsCustomAgrementDialogOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleAddCustomAgrement}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Documents requis</h4>
        <p className="text-sm text-green-700 mb-2">
          Après la création, vous devrez fournir les documents suivants :
        </p>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Extrait K-bis de moins de 3 mois</li>
          <li>• Déclaration d'activité de formation</li>
          <li>• Attestation d'assurance responsabilité civile</li>
          <li>• Certificat de qualification (si applicable)</li>
        </ul>
      </div>
    </div>
  );
};
