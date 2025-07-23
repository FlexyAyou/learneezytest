
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Trash2, Plus, History } from 'lucide-react';
import { PERMISSION_MODULES, Permission, PermissionAction } from '@/types/permissions';

interface PermissionMatrixProps {
  selectedPermissions: string[];
  onPermissionChange: (permissionId: string, actionId: string, checked: boolean) => void;
  onShowHistory: () => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  selectedPermissions,
  onPermissionChange,
  onShowHistory
}) => {
  const [selectedModule, setSelectedModule] = useState(PERMISSION_MODULES[0].id);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'read': return <Eye className="h-3 w-3" />;
      case 'write': return <Plus className="h-3 w-3" />;
      case 'modify': return <Edit className="h-3 w-3" />;
      case 'delete': return <Trash2 className="h-3 w-3" />;
      default: return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'write': return 'bg-green-100 text-green-800';
      case 'modify': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isPermissionSelected = (permissionId: string, actionId: string) => {
    return selectedPermissions.includes(`${permissionId}_${actionId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Matrice de permissions</CardTitle>
            <p className="text-sm text-gray-600">
              Configurez les droits d'accès par module fonctionnel
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onShowHistory}>
            <History className="h-4 w-4 mr-2" />
            Historique
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedModule} onValueChange={setSelectedModule}>
          <TabsList className="grid w-full grid-cols-4">
            {PERMISSION_MODULES.map((module) => (
              <TabsTrigger key={module.id} value={module.id}>
                {module.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {PERMISSION_MODULES.map((module) => (
            <TabsContent key={module.id} value={module.id} className="mt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{module.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                </div>

                <div className="space-y-4">
                  {module.permissions.map((permission) => (
                    <div key={permission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{permission.name}</h5>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {permission.actions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50"
                          >
                            <Checkbox
                              id={`${permission.id}_${action.id}`}
                              checked={isPermissionSelected(permission.id, action.id)}
                              onCheckedChange={(checked) =>
                                onPermissionChange(permission.id, action.id, checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={getActionColor(action.type)}>
                                  {getActionIcon(action.type)}
                                  <span className="ml-1">{action.name}</span>
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
