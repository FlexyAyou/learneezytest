
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, History, Shield } from 'lucide-react';
import { PermissionMatrix } from './PermissionMatrix';
import { RoleManagement } from './RoleManagement';
import { Role, UserPermissions, PermissionHistoryEntry } from '@/types/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AddUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // État du formulaire utilisateur
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    primaryRole: ''
  });

  // État des permissions et rôles
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Historique factice pour la démonstration
  const [permissionHistory] = useState<PermissionHistoryEntry[]>([
    {
      id: '1',
      userId: 'new-user',
      action: 'granted',
      permission: 'courses_view_read_courses',
      timestamp: new Date().toISOString(),
      modifiedBy: 'admin@learneezy.com',
      reason: 'Création du compte utilisateur'
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permissionId: string, actionId: string, checked: boolean) => {
    const fullPermissionId = `${permissionId}_${actionId}`;
    
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, fullPermissionId];
      } else {
        return prev.filter(p => p !== fullPermissionId);
      }
    });
  };

  const handleRoleAdd = (role: Role) => {
    setSelectedRoles(prev => [...prev, role]);
  };

  const handleRoleRemove = (roleId: string) => {
    setSelectedRoles(prev => prev.filter(role => role.id !== roleId));
  };

  const handleRoleUpdate = (roleId: string, updates: Partial<Role>) => {
    setSelectedRoles(prev =>
      prev.map(role =>
        role.id === roleId ? { ...role, ...updates } : role
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!userForm.firstName || !userForm.lastName || !userForm.email) {
      toast({
        title: "Erreur de validation",
        description: "Les champs nom, prénom et email sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (selectedRoles.length === 0) {
      toast({
        title: "Erreur de validation",
        description: "Au moins un rôle doit être attribué à l'utilisateur",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulation de la création de l'utilisateur
      const newUser = {
        id: `user_${Date.now()}`,
        ...userForm,
        role: userForm.primaryRole as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userPermissions: UserPermissions = {
        userId: newUser.id,
        roles: selectedRoles.map(role => ({
          roleId: role.id,
          isActive: role.isActive,
          context: role.context,
          assignedAt: new Date().toISOString(),
          assignedBy: 'admin@learneezy.com'
        })),
        customPermissions: selectedPermissions,
        permissionHistory: [
          ...permissionHistory,
          {
            id: `history_${Date.now()}`,
            userId: newUser.id,
            action: 'granted',
            permission: 'user_created',
            timestamp: new Date().toISOString(),
            modifiedBy: 'admin@learneezy.com',
            reason: 'Création du compte utilisateur'
          }
        ]
      };

      console.log('Nouvel utilisateur créé:', newUser);
      console.log('Permissions attribuées:', userPermissions);

      toast({
        title: "Utilisateur créé avec succès",
        description: `${newUser.firstName} ${newUser.lastName} a été ajouté avec ${selectedRoles.length} rôle(s) et ${selectedPermissions.length} permission(s) personnalisée(s).`
      });

      // Redirection vers la liste des utilisateurs
      navigate('/dashboard/admin/users');

    } catch (error) {
      toast({
        title: "Erreur lors de la création",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const getActionLabel = (action: string) => {
    const actionMap: Record<string, string> = {
      'granted': 'Accordée',
      'revoked': 'Révoquée',
      'modified': 'Modifiée'
    };
    return actionMap[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ajouter un utilisateur</h2>
          <p className="text-gray-600">Créez un nouveau compte avec permissions personnalisées</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="user-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-info">Informations utilisateur</TabsTrigger>
            <TabsTrigger value="roles">Rôles et contextes</TabsTrigger>
            <TabsTrigger value="permissions">Permissions détaillées</TabsTrigger>
          </TabsList>

          {/* Onglet 1: Informations utilisateur */}
          <TabsContent value="user-info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={userForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={userForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={userForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primaryRole">Rôle principal *</Label>
                  <Select value={userForm.primaryRole} onValueChange={(value) => handleInputChange('primaryRole', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant</SelectItem>
                      <SelectItem value="instructor">Formateur Interne</SelectItem>
                      <SelectItem value="external_trainer">Formateur Independant</SelectItem>
                      <SelectItem value="content_creator">Créateur de contenu</SelectItem>
                      <SelectItem value="manager">Gestionnaire</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="tutor">Tuteur</SelectItem>
                      <SelectItem value="technician">Technicien</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={userForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={userForm.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={userForm.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={userForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Description, spécialités, expérience..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 2: Rôles */}
          <TabsContent value="roles">
            <RoleManagement
              selectedRoles={selectedRoles}
              onRoleAdd={handleRoleAdd}
              onRoleRemove={handleRoleRemove}
              onRoleUpdate={handleRoleUpdate}
            />
          </TabsContent>

          {/* Onglet 3: Permissions */}
          <TabsContent value="permissions">
            <PermissionMatrix
              selectedPermissions={selectedPermissions}
              onPermissionChange={handlePermissionChange}
              onShowHistory={() => setShowHistory(true)}
            />
          </TabsContent>
        </Tabs>

        {/* Résumé et actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Résumé des attributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Rôles attribués ({selectedRoles.length})</h4>
                <div className="space-y-2">
                  {selectedRoles.length > 0 ? (
                    selectedRoles.map((role, index) => (
                      <div key={`${role.id}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{role.name}</span>
                        <div className="flex space-x-2">
                          <Badge variant={role.isActive ? "default" : "secondary"}>
                            {role.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                          {role.context?.type !== 'global' && (
                            <Badge variant="outline">
                              {role.context?.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun rôle sélectionné</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Permissions personnalisées ({selectedPermissions.length})</h4>
                <div className="space-y-1">
                  {selectedPermissions.length > 0 ? (
                    selectedPermissions.slice(0, 5).map((permission) => (
                      <div key={permission} className="text-sm text-gray-600">
                        • {permission.replace('_', ' → ')}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucune permission personnalisée</p>
                  )}
                  {selectedPermissions.length > 5 && (
                    <p className="text-sm text-gray-500">
                      ... et {selectedPermissions.length - 5} autres permissions
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/admin/users')}>
            Annuler
          </Button>
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
            <Save className="h-4 w-4 mr-2" />
            Créer l'utilisateur
          </Button>
        </div>
      </form>

      {/* Dialog historique des permissions */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Historique des permissions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {permissionHistory.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={entry.action === 'granted' ? 'default' : entry.action === 'revoked' ? 'destructive' : 'secondary'}>
                        {getActionLabel(entry.action)}
                      </Badge>
                      <span className="font-medium">{entry.permission}</span>
                    </div>
                    {entry.reason && (
                      <p className="text-sm text-gray-600 mt-1">{entry.reason}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(entry.timestamp).toLocaleString()}</p>
                    <p>Par: {entry.modifiedBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
