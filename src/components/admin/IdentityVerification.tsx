
import React, { useState } from 'react';
import { Shield, User, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface VerificationRequest {
  id: string;
  user: string;
  email: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export const IdentityVerification = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [requests] = useState<VerificationRequest[]>([
    {
      id: '1',
      user: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      documentType: 'Carte d\'identité',
      status: 'pending',
      submittedAt: '2024-01-20'
    },
    {
      id: '2',
      user: 'Jean Martin',
      email: 'jean.martin@email.com',
      documentType: 'Passeport',
      status: 'approved',
      submittedAt: '2024-01-18'
    }
  ]);

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejeté</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    console.log(`Approuver la vérification: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejeter la vérification: ${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Vérification d'identité
            </CardTitle>
            <CardDescription>
              Gérez les demandes de vérification d'identité
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Activation</span>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isEnabled && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              La vérification d'identité est actuellement désactivée.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-medium">{request.user}</h3>
                    <p className="text-sm text-gray-600">{request.email}</p>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Type de document:</p>
                  <p className="font-medium">{request.documentType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Soumis le:</p>
                  <p className="font-medium">{request.submittedAt}</p>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
