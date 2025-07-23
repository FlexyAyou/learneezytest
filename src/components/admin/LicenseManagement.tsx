
import React, { useState } from 'react';
import { Users, Key, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface License {
  id: string;
  type: string;
  user: string;
  status: 'active' | 'expired' | 'suspended';
  expiryDate: string;
  features: string[];
}

export const LicenseManagement = () => {
  const [licenses] = useState<License[]>([
    {
      id: '1',
      type: 'Premium',
      user: 'marie.dubois@email.com',
      status: 'active',
      expiryDate: '2024-12-31',
      features: ['Cours illimités', 'Chat IA', 'Visioconférence']
    },
    {
      id: '2',
      type: 'Standard',
      user: 'jean.martin@email.com',
      status: 'expired',
      expiryDate: '2024-01-15',
      features: ['10 cours max', 'Chat IA']
    }
  ]);

  const getStatusBadge = (status: License['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expiré</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspendu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Gestion des licences
            </CardTitle>
            <CardDescription>
              Gérez les licences utilisateurs et leurs permissions
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle licence
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="Rechercher une licence..." className="flex-1" />
            <Button variant="outline">Filtrer</Button>
          </div>

          <div className="space-y-3">
            {licenses.map((license) => (
              <div key={license.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{license.type}</h3>
                      {getStatusBadge(license.status)}
                    </div>
                    <p className="text-sm text-gray-600">{license.user}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Expire le:</p>
                    <p className="font-medium">{license.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fonctionnalités:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {license.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
