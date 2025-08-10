
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Mail, User, BookOpen, Shield, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OFAddUtilisateurProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (utilisateur: any) => void;
}

export const OFAddUtilisateur = ({ isOpen, onClose, onAdd }: OFAddUtilisateurProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    role: '',
    formation: '',
    status: 'active',
    specialites: '',
    description: ''
  });

  const roles = [
    { value: 'apprenant', label: 'Apprenant', icon: GraduationCap },
    { value: 'animateur', label: 'Animateur', icon: Users },
    { value: 'administrateur', label: 'Administrateur', icon: Shield },
    { value: 'referent', label: 'Référent', icon: User }
  ];

  const formations = [
    'React Avancé',
    'JavaScript',
    'Angular',
    'Vue.js',
    'Node.js',
    'Python',
    'Java',
    'PHP',
    'C#',
    'UX/UI Design'
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
      progression: formData.role === 'apprenant' ? 0 : null,
      derniere_connexion: new Date().toISOString().split('T')[0]
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
      formation: '',
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

  const isApprenantRole = formData.role === 'apprenant';
  const isAnimateurRole = formData.role === 'animateur';

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
                Rôle et permissions
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
          {(isApprenantRole || isAnimateurRole) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {isApprenantRole ? 'Formation' : 'Spécialités'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isApprenantRole && (
                  <div>
                    <Label htmlFor="formation">Formation assignée</Label>
                    <Select value={formData.formation} onValueChange={(value) => handleChange('formation', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une formation" />
                      </SelectTrigger>
                      <SelectContent>
                        {formations.map((formation) => (
                          <SelectItem key={formation} value={formation}>
                            {formation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {isAnimateurRole && (
                  <>
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
                        placeholder="Décrivez l'expérience et les compétences de l'animateur..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
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
