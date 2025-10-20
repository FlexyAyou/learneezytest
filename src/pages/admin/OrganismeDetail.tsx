import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Calendar, 
  CreditCard,
  AlertTriangle,
  Users,
  Clock,
  Coins,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/hooks/useApi';
import { DeactivateOrganismeModal } from '@/components/admin/DeactivateOrganismeModal';
import { EditOrganismeModal } from '@/components/admin/EditOrganismeModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const OrganismeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Récupération des données de l'organisme depuis l'API
  const { data: organisme, isLoading, error } = useOrganization(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !organisme) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger les informations de l'organisme.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mock data pour les apprenants - sera remplacé par l'API
  const apprenants = [];

  const renderAgrements = (agrement: string[] | undefined) => {
    if (!agrement || agrement.length === 0) {
      return <Badge variant="outline">Aucun agrément</Badge>;
    }

    // Afficher plusieurs badges pour chaque agrément
    const maxDisplayed = 3;
    const displayedAgrements = agrement.slice(0, maxDisplayed);
    const remainingCount = agrement.length - maxDisplayed;

    return (
      <div className="flex flex-wrap gap-2">
        {displayedAgrements.map((agrement, index) => (
          <Badge key={index} className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {agrement}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-help">
                +{remainingCount} autres
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-medium">Autres agréments :</div>
                {agrement.slice(maxDisplayed).map((agr, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    {agr}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  const getSubscriptionStatusBadge = (status, daysRemaining) => {
    if (status === 'active' && daysRemaining > 30) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    } else if (status === 'active' && daysRemaining <= 30) {
      return <Badge className="bg-orange-100 text-orange-800">Expire bientôt</Badge>;
    } else if (status === 'expires_soon') {
      return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
    } else {
      return <Badge variant="secondary">Inactif</Badge>;
    }
  };

  const getTokensAlert = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 15) {
      return { level: 'critical', message: `Seulement ${remaining} tokens restants (${percentage.toFixed(0)}%)` };
    } else if (percentage <= 30) {
      return { level: 'warning', message: `${remaining} tokens restants (${percentage.toFixed(0)}%)` };
    }
    return null;
  };

  const getDaysAlert = (daysRemaining) => {
    if (daysRemaining <= 5) {
      return { level: 'critical', message: `Abonnement expire dans ${daysRemaining} jours` };
    } else if (daysRemaining <= 15) {
      return { level: 'warning', message: `Abonnement expire dans ${daysRemaining} jours` };
    }
    return null;
  };

  const handleSendRenewalEmail = () => {
    toast({
      title: "Email envoyé",
      description: "Un email de renouvellement a été envoyé à l'organisme.",
    });
  };

  const handleSendTokensEmail = () => {
    toast({
      title: "Email envoyé", 
      description: "Un email pour l'achat de tokens a été envoyé à l'organisme.",
    });
  };

  const handleDeactivateOrganisme = (organismeId: string, reason: string) => {
    console.log('Deactivating organisme:', organismeId, 'Reason:', reason);
    
    toast({
      title: organisme.is_active ? "Organisme désactivé" : "Organisme activé",
      description: `L'organisme a été ${organisme.is_active ? 'désactivé' : 'activé'} avec succès.`,
    });
  };

  // Calcul des alertes et métriques d'abonnement
  const tokensRemaining = organisme.tokens_remaining || 0;
  const tokensTotal = organisme.tokens_total || 1;
  const tokensAlert = getTokensAlert(tokensRemaining, tokensTotal);
  
  // Calcul des jours restants (mock pour l'instant)
  const daysRemaining = 0;
  const daysAlert = getDaysAlert(daysRemaining);
  const tokensPercentage = (tokensRemaining / tokensTotal) * 100;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/superadmin/organisations')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organisme.name}</h1>
              <p className="text-gray-600">{organisme.description}</p>
            </div>
          </div>

          {/* Action de désactivation/activation */}
          <Button 
            variant={organisme.is_active ? "destructive" : "default"}
            onClick={() => setShowDeactivateModal(true)}
          >
            {organisme.is_active ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Désactiver l'organisme
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activer l'organisme
              </>
            )}
          </Button>
        </div>

        {/* Alertes critiques */}
        {(tokensAlert || daysAlert) && (
          <div className="space-y-3">
            {daysAlert && (
              <Alert variant={daysAlert.level === 'critical' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{daysAlert.message}</span>
                  <Button size="sm" onClick={handleSendRenewalEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Proposer renouvellement
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {tokensAlert && (
              <Alert variant={tokensAlert.level === 'critical' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{tokensAlert.message}</span>
                  <Button size="sm" onClick={handleSendTokensEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Proposer achat tokens
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations générales */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informations générales
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {organisme.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {organisme.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {organisme.email}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={organisme.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {organisme.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations légales</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">SIRET:</span> {organisme.siret || 'N/A'}</div>
                    <div><span className="font-medium">N° Déclaration:</span> {organisme.numero_declaration || 'N/A'}</div>
                    <div><span className="font-medium">Représentant légal:</span> {organisme.legal_representative || 'N/A'}</div>
                    <div>
                      <span className="font-medium mb-2 block">Agréments:</span>
                      {renderAgrements(organisme.agrement)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut et métriques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {organisme.is_active ? (
                  <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Actif
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    Inactif
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{apprenants.length}</div>
                  <div className="text-sm text-gray-500">Apprenants inscrits</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Membre depuis</div>
                  <div className="font-medium">{new Date(organisme.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Abonnement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Abonnement - {organisme.subscription_type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Statut</div>
                {getSubscriptionStatusBadge('active', daysRemaining)}
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Période</div>
                <div className="font-medium">
                  {new Date(organisme.created_at).toLocaleDateString()} - N/A
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {daysRemaining} jours restants
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Tokens</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{tokensRemaining} restants</span>
                    <span>{tokensTotal} total</span>
                  </div>
                  <Progress value={tokensPercentage} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-xl font-bold capitalize">{organisme.subscription_type}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des apprenants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Apprenants ({apprenants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apprenants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun apprenant inscrit pour le moment
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Abonnement</TableHead>
                    <TableHead>Progrès</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apprenants.map((apprenant: any) => (
                  <TableRow key={apprenant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{apprenant.firstName} {apprenant.lastName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{apprenant.email}</div>
                        <div className="text-sm text-gray-500">{apprenant.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(apprenant.enrolledAt).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{apprenant.coursesCount}</div>
                        <div className="text-xs text-gray-500">cours</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {apprenant.subscription ? (
                        <div className="space-y-1">
                          {getSubscriptionStatusBadge(apprenant.subscription.status, apprenant.subscription.daysRemaining)}
                          <div className="text-xs text-gray-500">
                            Expire: {new Date(apprenant.subscription.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline">Aucun</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{apprenant.progress}%</div>
                        <Progress value={apprenant.progress} className="h-1 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedApprenant(apprenant)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails de l'apprenant</DialogTitle>
                          </DialogHeader>
                          {selectedApprenant && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Informations personnelles</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Nom:</span> {selectedApprenant.firstName} {selectedApprenant.lastName}</div>
                                  <div><span className="font-medium">Email:</span> {selectedApprenant.email}</div>
                                  <div><span className="font-medium">Téléphone:</span> {selectedApprenant.phone}</div>
                                  <div><span className="font-medium">Inscrit le:</span> {new Date(selectedApprenant.enrolledAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Progression</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Cours suivis:</span>
                                    <span className="font-medium">{selectedApprenant.coursesCount}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Progression globale:</span>
                                      <span>{selectedApprenant.progress}%</span>
                                    </div>
                                    <Progress value={selectedApprenant.progress} />
                                  </div>
                                </div>
                              </div>
                              {selectedApprenant.subscription && (
                                <div>
                                  <h4 className="font-medium mb-2">Abonnement</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Type:</span> {selectedApprenant.subscription.type}</div>
                                    <div><span className="font-medium">Expire le:</span> {new Date(selectedApprenant.subscription.endDate).toLocaleDateString()}</div>
                                    <div><span className="font-medium">Jours restants:</span> {selectedApprenant.subscription.daysRemaining}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de désactivation */}
        <DeactivateOrganismeModal
          isOpen={showDeactivateModal}
          onClose={() => setShowDeactivateModal(false)}
          organisme={{
            id: String(organisme.id),
            name: organisme.name,
            isActive: organisme.is_active || false
          }}
          onConfirm={handleDeactivateOrganisme}
        />

        {/* Modal de modification */}
        <EditOrganismeModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          organisme={organisme}
        />
      </div>
    </TooltipProvider>
  );
};

export default OrganismeDetail;
