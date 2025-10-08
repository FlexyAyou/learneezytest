
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Calendar, Clock, CreditCard, User, CheckCircle, XCircle } from 'lucide-react';
import { mockTrainerFiscalInfo } from '@/data/mockTrainerApplicationsData';

interface IndependentTrainerDetailViewProps {
  user: any;
}

export const IndependentTrainerDetailView = ({ user }: IndependentTrainerDetailViewProps) => {
  // Récupérer les vraies données fiscales
  const fiscalInfo = mockTrainerFiscalInfo[user.userId];

  // Mock data spécifique aux formateurs indépendants
  const independentTrainerData = {
    contracts: [
      { id: 1, client: 'Entreprise ABC', amount: 2400, status: 'active', startDate: '2024-01-15', endDate: '2024-03-15' },
      { id: 2, client: 'Formation XYZ', amount: 1800, status: 'completed', startDate: '2023-12-01', endDate: '2024-01-31' },
      { id: 3, client: 'Institut DEF', amount: 3200, status: 'pending', startDate: '2024-02-01', endDate: '2024-04-30' }
    ],
    payments: [
      { id: 1, amount: 1800, date: '2024-01-15', status: 'paid', client: 'Formation XYZ' },
      { id: 2, amount: 1200, date: '2024-01-30', status: 'pending', client: 'Entreprise ABC' },
      { id: 3, amount: 800, date: '2024-02-15', status: 'overdue', client: 'Entreprise ABC' }
    ],
    availabilities: [
      { date: '2024-01-25', morning: true, afternoon: false },
      { date: '2024-01-26', morning: false, afternoon: true },
      { date: '2024-01-27', morning: true, afternoon: true }
    ],
    stats: {
      totalEarnings: 5400,
      activeContracts: 1,
      pendingPayments: 2000,
      hourlyRate: 75
    }
  };

  const getContractStatusBadge = (status: string) => {
    const configs = {
      active: { variant: 'default' as const, label: 'Actif', color: 'bg-green-500' },
      completed: { variant: 'secondary' as const, label: 'Terminé', color: 'bg-gray-500' },
      pending: { variant: 'outline' as const, label: 'En attente', color: 'bg-yellow-500' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPaymentStatusBadge = (status: string) => {
    const configs = {
      paid: { variant: 'default' as const, label: 'Payé', color: 'text-green-600' },
      pending: { variant: 'outline' as const, label: 'En attente', color: 'text-yellow-600' },
      overdue: { variant: 'destructive' as const, label: 'En retard', color: 'text-red-600' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques du formateur indépendant */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {independentTrainerData.stats.totalEarnings}€
            </div>
            <div className="text-sm text-gray-600">Revenus totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {independentTrainerData.stats.activeContracts}
            </div>
            <div className="text-sm text-gray-600">Contrats actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {independentTrainerData.stats.pendingPayments}€
            </div>
            <div className="text-sm text-gray-600">Paiements en attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {independentTrainerData.stats.hourlyRate}€/h
            </div>
            <div className="text-sm text-gray-600">Tarif horaire</div>
          </CardContent>
        </Card>
      </div>

      {/* Informations fiscales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations fiscales
            {fiscalInfo && (
              <Badge className={fiscalInfo.isComplete ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {fiscalInfo.isComplete ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Profil complet
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Profil incomplet
                  </>
                )}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!fiscalInfo ? (
            <p className="text-sm text-gray-500 italic">Informations fiscales non renseignées</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">N° NDA</label>
                <p className="font-semibold">{fiscalInfo.ndaNumber || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Statut juridique</label>
                <p className="font-semibold">{fiscalInfo.legalStatus || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">N° SIRET</label>
                <p className="font-semibold">{fiscalInfo.siret || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">N° TVA intracommunautaire</label>
                <p className="font-semibold">{fiscalInfo.tvaNumber || 'Non renseigné'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contrats en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contrats et missions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {independentTrainerData.contracts.map((contract) => {
              const config = getContractStatusBadge(contract.status);
              return (
                <div key={contract.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{contract.client}</h4>
                      <p className="text-sm text-gray-600">
                        Du {contract.startDate} au {contract.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <p className="font-bold text-lg mt-1">{contract.amount}€</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {independentTrainerData.payments.map((payment) => {
              const config = getPaymentStatusBadge(payment.status);
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.client}</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{payment.amount}€</p>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disponibilités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Disponibilités prochaines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {independentTrainerData.availabilities.map((availability, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{availability.date}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={availability.morning ? "default" : "outline"}>
                    Matin {availability.morning ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={availability.afternoon ? "default" : "outline"}>
                    Après-midi {availability.afternoon ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
