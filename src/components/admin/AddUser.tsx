
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Mail, User, Shield, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

export const AddUser = ({ isOpen, onClose, onAdd }: AddUserProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    role: '',
    organisation: '',
    organisationType: '',
    status: 'active',
    specialites: '',
    description: ''
  });

  const roles = [
    { value: 'Formateur', label: 'Formateur', icon: BookOpen },
    { value: 'Formateur indépendant', label: 'Formateur indépendant', icon: User },
    { value: 'Gestionnaire', label: 'Gestionnaire', icon: Users },
    { value: 'Animateur', label: 'Animateur', icon: Users },
    { value: 'Administrateur', label: 'Administrateur', icon: Shield }
  ];

  const organisationTypes = [
    { value: 'OF', label: 'Organisme de Formation' },
    { value: 'Direct', label: 'Learneezy Direct' },
    { value: 'Admin', label: 'Administration' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom || !formData.email || !formData.role) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const nouvelUtilisateur = {
      ...formData,
      id: Date.now().toString(),
      name: `${formData.prenom} ${formData.nom}`,
      lastLogin: new Date().toISOString().split('T')[0]
    };

    onAdd(nouvelUtilisateur);
    
    toast({
      title: "Utilisateur ajouté",
      description: `${formData.prenom} ${formData.nom} a été ajouté avec succès`,
    });

    // Reset form
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      phone: '',
      role: '',
      organisation: '',
      organisationType: '',
      status: 'active',
      specialites: '',
      description: ''
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleIcon = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    if (!role) return User;
    return role.icon;
  };

  const isFormateur = formData.role === 'Formateur' || formData.role === 'Formateur indépendant';
  const isAnimateur = formData.role === 'Animateur';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Ajouter un utilisateur
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rôle et permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Rôle et organisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-2" />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organisationType">Type d'organisation</Label>
                  <Select value={formData.organisationType} onValueChange={(value) => handleChange('organisationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {organisationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="organisation">Organisation</Label>
                  <Input
                    id="organisation"
                    value={formData.organisation}
                    onChange={(e) => handleChange('organisation', e.target.value)}
                    placeholder="Nom de l'organisation"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuration spécifique au rôle */}
          {(isFormateur || isAnimateur) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Spécialités et compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="specialites">Spécialités</Label>
                  <Input
                    id="specialites"
                    value={formData.specialites}
                    onChange={(e) => handleChange('specialites', e.target.value)}
                    placeholder="Ex: React, JavaScript, UX/UI Design"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Décrivez l'expérience et les compétences..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'utilisateur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
