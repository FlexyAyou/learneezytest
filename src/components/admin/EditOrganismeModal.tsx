import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Globe, Mail, MapPin, Phone, User, FileText } from 'lucide-react';
import { OrganizationResponse, OrganizationCreate } from '@/types/fastapi';
import { useUpdateOrganization } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface EditOrganismeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organisme: OrganizationResponse;
}

export const EditOrganismeModal = ({ open, onOpenChange, organisme }: EditOrganismeModalProps) => {
  const updateOrganismeMutation = useUpdateOrganization();
  const [formData, setFormData] = useState<Partial<OrganizationCreate>>({
    name: '',
    description: '',
    website: '',
    legal_representative: '',
    address: '',
    phone: '',
    email: '',
    contact_email: '',
    siret: '',
    numero_declaration: '',
    agrement: '',
  });

  useEffect(() => {
    if (organisme) {
      setFormData({
        name: organisme.name || '',
        description: organisme.description || '',
        website: organisme.website || '',
        legal_representative: organisme.legal_representative || '',
        address: organisme.address || '',
        phone: organisme.phone || '',
        email: organisme.email || '',
        contact_email: organisme.contact_email || '',
        siret: organisme.siret || '',
        numero_declaration: organisme.numero_declaration || '',
        agrement: organisme.agrement || '',
      });
    }
  }, [organisme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateOrganismeMutation.mutateAsync({
      orgId: organisme.id,
      data: formData,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Modifier l'organisme
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <Building className="h-4 w-4 inline mr-2" />
                  Nom de l'organisme *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_representative">
                  <User className="h-4 w-4 inline mr-2" />
                  Représentant légal *
                </Label>
                <Input
                  id="legal_representative"
                  value={formData.legal_representative}
                  onChange={(e) => setFormData({ ...formData, legal_representative: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                <FileText className="h-4 w-4 inline mr-2" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="h-4 w-4 inline mr-2" />
                Site web
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">
                <MapPin className="h-4 w-4 inline mr-2" />
                Adresse *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email de contact *
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Informations légales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations légales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET *</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_declaration">N° Déclaration d'activité *</Label>
                <Input
                  id="numero_declaration"
                  value={formData.numero_declaration}
                  onChange={(e) => setFormData({ ...formData, numero_declaration: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agrement">Agrément</Label>
              <Input
                id="agrement"
                value={formData.agrement}
                onChange={(e) => setFormData({ ...formData, agrement: e.target.value })}
                placeholder="Ex: Qualiopi"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateOrganismeMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={updateOrganismeMutation.isPending}>
              {updateOrganismeMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
