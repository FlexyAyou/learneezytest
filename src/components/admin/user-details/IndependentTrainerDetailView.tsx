
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, FileText, Calendar, Clock, CreditCard, User, CheckCircle, XCircle, Award, AlertCircle } from 'lucide-react';
import { mockTrainerFiscalInfo, mockTrainerSpecialtyRequests } from '@/data/mockTrainerApplicationsData';
import { useToast } from '@/hooks/use-toast';
import { useUserDetail } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface IndependentTrainerDetailViewProps {
  user: any;
}

export const IndependentTrainerDetailView = ({ user }: IndependentTrainerDetailViewProps) => {
  const { toast } = useToast();
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);
  const [specialtyRequests, setSpecialtyRequests] = useState(
    mockTrainerSpecialtyRequests.filter(req => req.trainerId === user.userId)
  );
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

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

  const handleApproveSpecialty = (specialtyId: string) => {
    setSpecialtyRequests(prev => prev.map(spec =>
      spec.id === specialtyId
        ? { ...spec, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin-1' }
        : spec
    ));
    
    toast({
      title: "Spécialité approuvée",
      description: "La demande de spécialité a été approuvée avec succès.",
    });
  };

  const handleRejectSpecialty = () => {
    if (!selectedSpecialty || !rejectionReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison de rejet.",
        variant: "destructive"
      });
      return;
    }

    setSpecialtyRequests(prev => prev.map(spec =>
      spec.id === selectedSpecialty
        ? { 
            ...spec, 
            status: 'rejected' as const, 
            rejectionReason: rejectionReason,
            reviewedAt: new Date().toISOString(), 
            reviewedBy: 'admin-1' 
          }
        : spec
    ));
    
    toast({
      title: "Spécialité rejetée",
      description: "La demande a été rejetée. Le formateur recevra la raison du rejet.",
    });

    setRejectionModalOpen(false);
    setSelectedSpecialty(null);
    setRejectionReason('');
  };

  const openRejectionModal = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setRejectionModalOpen(true);
  };

  const getSpecialtyStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
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

      {/* Demandes de spécialités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Demandes de spécialités
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specialtyRequests.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune demande de spécialité</p>
          ) : (
            <div className="space-y-4">
              {specialtyRequests.map((specialty) => (
                <div key={specialty.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{specialty.name}</h4>
                        {getSpecialtyStatusBadge(specialty.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Niveau:</span>
                          <span className="ml-2 font-medium">{specialty.level}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Soumis le:</span>
                          <span className="ml-2 font-medium">
                            {new Date(specialty.submittedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <p className="text-sm text-gray-600 font-medium mb-1">Motivation:</p>
                        <p className="text-sm">{specialty.motivation}</p>
                      </div>
                      
                      {specialty.status === 'rejected' && specialty.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800 mb-1">Raison du rejet:</p>
                            <p className="text-sm text-red-700">{specialty.rejectionReason}</p>
                          </div>
                        </div>
                      )}

                      {specialty.status === 'approved' && specialty.reviewedAt && (
                        <div className="text-xs text-gray-500">
                          Approuvé le {new Date(specialty.reviewedAt).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>

                  {specialty.status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRejectionModal(specialty.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveSpecialty(specialty.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de rejet */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande de spécialité</DialogTitle>
            <DialogDescription>
              Veuillez fournir une raison détaillée du rejet. Le formateur recevra cette explication.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Raison du rejet</label>
              <Textarea
                placeholder="Ex: Manque d'expérience pratique dans ce domaine. Nous recommandons d'acquérir au moins 2 ans d'expérience professionnelle..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectionModalOpen(false);
                setSelectedSpecialty(null);
                setRejectionReason('');
              }}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectSpecialty}
              disabled={!rejectionReason.trim()}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
