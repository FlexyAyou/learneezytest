
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Upload, ArrowRight } from 'lucide-react';
import { OrganismeFormData } from '@/types/organisme';

interface OrganismeFormStep1Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
  onNext: () => void;
}

export const OrganismeFormStep1: React.FC<OrganismeFormStep1Props> = ({
  formData,
  updateFormData,
  onNext
}) => {
  const handleInputChange = (field: keyof OrganismeFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateFormData({ [field]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateFormData({ logo: file });
  };

  const isStepValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.legalRepresentative.trim() !== ''
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom de l'organisme */}
          <div className="md:col-span-2">
            <Label htmlFor="name">Nom de l'organisme *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Centre de Formation Digital"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Décrivez brièvement l'organisme de formation..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <Label htmlFor="logo">Logo de l'organisme</Label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {formData.logo && (
                <div className="text-sm text-green-600 flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  {formData.logo.name}
                </div>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="md:col-span-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange('address')}
              placeholder="123 Rue de la Formation, 75001 Paris"
              className="mt-1"
            />
          </div>

          {/* Téléphone */}
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              placeholder="01 23 45 67 89"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="contact@organisme.fr"
              className="mt-1"
            />
          </div>

          {/* Site web */}
          <div>
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange('website')}
              placeholder="https://www.organisme.fr"
              className="mt-1"
            />
          </div>

          {/* Représentant légal */}
          <div>
            <Label htmlFor="legalRepresentative">Représentant légal *</Label>
            <Input
              id="legalRepresentative"
              value={formData.legalRepresentative}
              onChange={handleInputChange('legalRepresentative')}
              placeholder="Jean Dupont"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onNext}
            disabled={!isStepValid()}
            className="flex items-center"
          >
            Étape suivante
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
