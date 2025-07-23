
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Settings, Users, BookOpen, Home } from 'lucide-react';
import { Role, RoleContext } from '@/types/permissions';

interface RoleManagementProps {
  selectedRoles: Role[];
  onRoleAdd: (role: Role) => void;
  onRoleRemove: (roleId: string) => void;
  onRoleUpdate: (roleId: string, updates: Partial<Role>) => void;
}

const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: ['*'],
    isActive: true
  },
  {
    id: 'internal_trainer',
    name: 'Formateur Interne',
    description: 'Accès aux outils de formation et gestion des étudiants',
    permissions: ['courses_view', 'courses_manage', 'evaluations_view', 'evaluations_manage'],
    isActive: true
  },
  {
    id: 'external_trainer',
    name: 'Formateur Externe',
    description: 'Accès limité aux cours assignés',
    permissions: ['courses_view', 'evaluations_view'],
    isActive: true
  },
  {
    id: 'student',
    name: 'Étudiant',
    description: 'Accès aux cours et évaluations',
    permissions: ['courses_view', 'evaluations_view', 'forums_participate'],
    isActive: true
  },
  {
    id: 'manager',
    name: 'Gestionnaire',
    description: 'Gestion des groupes et supervision',
    permissions: ['courses_view', 'reports_view', 'reports_export'],
    isActive: true
  },
  {
    id: 'parent',
    name: 'Parent',
    description: 'Suivi des progrès des enfants',
    permissions: ['reports_view'],
    isActive: true
  }
];

const CONTEXT_TYPES = [
  { value: 'global', label: 'Global (toute la plateforme)' },
  { value: 'group', label: 'Groupe spécifique' },
  { value: 'course', label: 'Cours spécifique' },
  { value: 'space', label: 'Espace de formation' }
];

export const RoleManagement: React.FC<RoleManagementProps> = ({
  selectedRoles,
  onRoleAdd,
  onRoleRemove,
  onRoleUpdate
}) => {
  const [showAddRole, setShowAddRole] = useState(false);

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin': return <Settings className="h-4 w-4" />;
      case 'internal_trainer':
      case 'external_trainer': return <Users className="h-4 w-4" />;
      case 'student': return <BookOpen className="h-4 w-4" />;
      case 'manager': return <Home className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'internal_trainer': return 'bg-blue-100 text-blue-800';
      case 'external_trainer': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'manager': return 'bg-orange-100 text-orange-800';
      case 'parent': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRole = (roleData: Role) => {
    const roleWithContext = {
      ...roleData,
      context: {
        type: 'global' as const,
        restrictions: []
      }
    };
    onRoleAdd(roleWithContext);
    setShowAddRole(false);
  };

  const isRoleSelected = (roleId: string) => {
    return selectedRoles.some(role => role.id === roleId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des rôles</CardTitle>
            <p className="text-sm text-gray-600">
              Attribuez plusieurs rôles avec contextes spécifiques
            </p>
          </div>
          <Button onClick={() => setShowAddRole(!showAddRole)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un rôle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rôles disponibles */}
        {showAddRole && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-4">Rôles disponibles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREDEFINED_ROLES.filter(role => !isRoleSelected(role.id)).map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(role.id)}>
                      {getRoleIcon(role.id)}
                      <span className="ml-1">{role.name}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">{role.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddRole(role)}
                  >
                    Ajouter
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rôles sélectionnés */}
        <div className="space-y-4">
          <h4 className="font-medium">Rôles attribués ({selectedRoles.length})</h4>
          
          {selectedRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun rôle attribué</p>
              <p className="text-sm">Cliquez sur "Ajouter un rôle" pour commencer</p>
            </div>
          ) : (
            selectedRoles.map((role, index) => (
              <div key={`${role.id}-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(role.id)}>
                      {getRoleIcon(role.id)}
                      <span className="ml-1">{role.name}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">{role.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={role.isActive}
                      onCheckedChange={(checked) =>
                        onRoleUpdate(role.id, { isActive: checked })
                      }
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRoleRemove(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Configuration du contexte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`context-${role.id}`}>Contexte d'application</Label>
                    <Select
                      value={role.context?.type || 'global'}
                      onValueChange={(value) =>
                        onRoleUpdate(role.id, {
                          context: { ...role.context, type: value as any }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTEXT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {role.context?.type !== 'global' && (
                    <div>
                      <Label htmlFor={`context-value-${role.id}`}>
                        Valeur du contexte
                      </Label>
                      <Input
                        id={`context-value-${role.id}`}
                        placeholder={`ID du ${role.context?.type}`}
                        value={role.context?.value || ''}
                        onChange={(e) =>
                          onRoleUpdate(role.id, {
                            context: { ...role.context, value: e.target.value }
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Indicateur de statut */}
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Statut:</span>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                  {role.context?.type !== 'global' && (
                    <Badge variant="outline">
                      {role.context?.type}: {role.context?.value || 'Non défini'}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gestion des conflits */}
        {selectedRoles.length > 1 && (
          <div className="border-t pt-4">
            <h5 className="font-medium mb-2">Gestion des conflits de permissions</h5>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Principe appliqué:</strong> Privilège le plus élevé
              </p>
              <p className="text-xs text-blue-600 mt-1">
                En cas de conflit entre les permissions des différents rôles, 
                le système appliquera automatiquement le niveau de permission le plus élevé.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
