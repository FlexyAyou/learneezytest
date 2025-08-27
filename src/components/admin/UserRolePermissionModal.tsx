
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleManagement } from './RoleManagement';
import { PermissionMatrix } from './PermissionMatrix';
import { Role } from '@/types/permissions';
import { ArrowLeft, Save, User, Shield } from 'lucide-react';

interface UserRolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roles: Role[], permissions: string[]) => void;
  userRole: 'Gestionnaire' | 'Administrateur';
  userName: string;
}

export const UserRolePermissionModal: React.FC<UserRolePermissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userRole,
  userName
}) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const handlePermissionChange = (permissionId: string, actionId: string, checked: boolean) => {
    const permissionKey = `${permissionId}_${actionId}`;
    
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionKey]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permissionKey));
    }
  };

  const handleSave = () => {
    onSave(selectedRoles, selectedPermissions);
    onClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Gestionnaire': return 'bg-orange-100 text-orange-800';
      case 'Administrateur': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuration des rôles et permissions
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{userName}</span>
                  <Badge className={getRoleColor(userRole)}>
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé de la configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Résumé de la configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Rôles attribués</label>
                  <p className="text-sm text-gray-900">
                    {selectedRoles.length === 0 ? 'Aucun rôle sélectionné' : `${selectedRoles.length} rôle(s)`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Permissions spécifiques</label>
                  <p className="text-sm text-gray-900">
                    {selectedPermissions.length === 0 ? 'Aucune permission spécifique' : `${selectedPermissions.length} permission(s)`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des rôles */}
          <RoleManagement
            selectedRoles={selectedRoles}
            onRoleAdd={handleRoleAdd}
            onRoleRemove={handleRoleRemove}
            onRoleUpdate={handleRoleUpdate}
          />

          {/* Matrice de permissions */}
          <PermissionMatrix
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
            onShowHistory={() => setShowHistory(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
