
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRolePermissionModal } from './UserRolePermissionModal';
import { Role } from '@/types/permissions';
import { User, Mail, Phone, Building, Settings, Shield } from 'lucide-react';
import { useSuperadminRegister } from '@/hooks/useApi';
import { UserRole } from '@/types/fastapi';
import { useToast } from '@/hooks/use-toast';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { DialogDescription } from '@/components/ui/dialog';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

export const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose, onAdd }) => {
  const { toast } = useToast();
  const { getUserRole } = useFastAPIAuth();
  const superadminRegister = useSuperadminRegister();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    organisation: '',
    organisationType: 'OF',
    address: ''
  });

  const [showRolePermissionModal, setShowRolePermissionModal] = useState(false);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleSelect = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Ouvrir le modal de configuration pour Gestionnaire ou Administrateur
    if (role === 'Gestionnaire' || role === 'Administrateur') {
      setShowRolePermissionModal(true);
    } else {
      // Réinitialiser les rôles et permissions pour les autres types d'utilisateurs
      setUserRoles([]);
      setUserPermissions([]);
    }
  };

  const handleRolePermissionSave = (roles: Role[], permissions: string[]) => {
    setUserRoles(roles);
    setUserPermissions(permissions);
  };

  // Mapper les rôles frontend vers les rôles backend
  const mapRoleToBackend = (frontendRole: string): UserRole => {
    const roleMap: Record<string, UserRole> = {
      'Formateur': 'formateur_interne',
      'Formateur indépendant': 'independent_trainer',
      'Gestionnaire': 'gestionnaire',
      'Animateur': 'facilitator',
      'Administrateur': 'administrator'
    };
    return roleMap[frontendRole] || 'student';
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Splitter le nom en prénom et nom
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
    
    // Préparer les données pour le backend (SANS mot de passe - généré côté serveur)
    const backendUserData = {
      email: formData.email,
      role: mapRoleToBackend(formData.role),
      first_name: firstName,
      last_name: lastName,
      accept_terms: true,
      of_id: null,
      accessible_catalogues: []
    };

    try {
      const result = await superadminRegister.mutateAsync(backendUserData);
      
      // Notifier le parent
      onAdd({
        ...formData,
        id: result.id,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        organisation: '',
        organisationType: 'OF',
        address: ''
      });
      setUserRoles([]);
      setUserPermissions([]);
      
      onClose();
    } catch (error: any) {
      const currentRole = getUserRole();
      
      if (error?.response?.status === 403) {
        toast({
          title: "Accès refusé",
          description: `Seuls les superadmins peuvent créer des utilisateurs. Votre rôle actuel: ${currentRole || 'inconnu'}`,
          variant: "destructive",
          duration: 8000,
        });
      }
      
      console.error('Erreur lors de la création:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-800';
      case 'Formateur': return 'bg-blue-100 text-blue-800';
      case 'Formateur indépendant': return 'bg-purple-100 text-purple-800';
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Animateur': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganisationColor = (organisationType: string) => {
    switch (organisationType) {
      case 'OF': return 'bg-blue-50 text-blue-700';
      case 'Direct': return 'bg-pink-50 text-pink-700';
      case 'Admin': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Ajouter un utilisateur
            </DialogTitle>
            <DialogDescription>
              Créer un nouveau compte utilisateur avec les informations ci-dessous. Un mot de passe sera généré automatiquement côté serveur et envoyé par email à l'utilisateur.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle *</Label>
                    <Select value={formData.role} onValueChange={handleRoleSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Formateur">Formateur</SelectItem>
                        <SelectItem value="Formateur indépendant">Formateur indépendant</SelectItem>
                        <SelectItem value="Gestionnaire">Gestionnaire</SelectItem>
                        <SelectItem value="Animateur">Animateur</SelectItem>
                        <SelectItem value="Administrateur">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organisation">Organisation *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="organisation"
                        value={formData.organisation}
                        onChange={(e) => handleInputChange('organisation', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="organisationType">Type d'organisation</Label>
                    <Select 
                      value={formData.organisationType} 
                      onValueChange={(value) => handleInputChange('organisationType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OF">Organisme de Formation</SelectItem>
                        <SelectItem value="Direct">Learneezy Direct</SelectItem>
                        <SelectItem value="Admin">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuration avancée pour Gestionnaire/Administrateur */}
            {(formData.role === 'Gestionnaire' || formData.role === 'Administrateur') && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuration avancée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rôles et permissions</p>
                        <p className="text-sm text-gray-600">
                          {userRoles.length > 0 
                            ? `${userRoles.length} rôle(s) configuré(s)` 
                            : 'Configuration requise'
                          }
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRolePermissionModal(true)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Configurer
                      </Button>
                    </div>

                    {userRoles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {userRoles.map((role, index) => (
                          <Badge key={`${role.id}-${index}`} variant="outline">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Aperçu de l'utilisateur */}
            {formData.name && formData.email && formData.role && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-base">Aperçu de l'utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formData.name}</span>
                      <Badge className={getRoleColor(formData.role)}>
                        {formData.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                    {formData.organisation && (
                      <Badge className={getOrganisationColor(formData.organisationType)}>
                        {formData.organisation}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={superadminRegister.isPending}>
                {superadminRegister.isPending ? 'Création en cours...' : "Ajouter l'utilisateur"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de configuration des rôles et permissions */}
      <UserRolePermissionModal
        isOpen={showRolePermissionModal}
        onClose={() => setShowRolePermissionModal(false)}
        onSave={handleRolePermissionSave}
        userRole={formData.role as 'Gestionnaire' | 'Administrateur'}
        userName={formData.name}
      />
    </>
  );
};
