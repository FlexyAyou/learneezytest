import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DeactivateOrganismeModal } from '@/components/admin/DeactivateOrganismeModal';

const OrganismeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Mock data pour l'organisme - en réalité viendrait de l'API
  const organisme = {
    id: '1',
    name: 'Centre de Formation Digital',
    description: 'Centre de formation spécialisé dans le digital et les nouvelles technologies',
    address: '123 Rue de la Formation, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@cfdigital.fr',
    website: 'https://www.cfdigital.fr',
    siret: '12345678901234',
    numeroDeclaration: '11-75-12345-75',
    qualiopiCertified: true,
    legalRepresentative: 'Jean Dupont',
    createdAt: '2023-01-15',
    isActive: true,
    // Informations d'abonnement
    subscription: {
      type: 'Premium',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      daysRemaining: 45,
      status: 'active',
      tokensRemaining: 150,
      tokensTotal: 1000,
      autoRenewal: true,
      monthlyPrice: 299
    },
    // Apprenants de l'organisme
    apprenants: [
      {
        id: '1',
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@email.com',
        phone: '06 12 34 56 78',
        enrolledAt: '2024-02-15',
        coursesCount: 3,
        subscription: {
          type: 'Individuel',
          status: 'active',
          endDate: '2024-12-31',
          daysRemaining: 67
        },
        progress: 75
      },
      {
        id: '2',
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@email.com',
        phone: '06 98 76 54 32',
        enrolledAt: '2024-03-10',
        coursesCount: 2,
        subscription: null,
        progress: 45
      },
      {
        id: '3',
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@email.com',
        phone: '06 11 22 33 44',
        enrolledAt: '2024-01-20',
        coursesCount: 5,
        subscription: {
          type: 'Premium',
          status: 'expires_soon',
          endDate: '2024-11-30',
          daysRemaining: 12
        },
        progress: 90
      }
    ]
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
      title: organisme.isActive ? "Organisme désactivé" : "Organisme activé",
      description: `L'organisme a été ${organisme.isActive ? 'désactivé' : 'activé'} avec succès.`,
    });

    // Ici on mettrait à jour l'état local ou on rechargerait les données
    // organisme.isActive = !organisme.isActive;
  };

  const tokensAlert = getTokensAlert(organisme.subscription.tokensRemaining, organisme.subscription.tokensTotal);
  const daysAlert = getDaysAlert(organisme.subscription.daysRemaining);
  const tokensPercentage = (organisme.subscription.tokensRemaining / organisme.subscription.tokensTotal) * 100;

  return (
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
          variant={organisme.isActive ? "destructive" : "default"}
          onClick={() => setShowDeactivateModal(true)}
        >
          {organisme.isActive ? (
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
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Informations générales
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
                  <div><span className="font-medium">SIRET:</span> {organisme.siret}</div>
                  <div><span className="font-medium">N° Déclaration:</span> {organisme.numeroDeclaration}</div>
                  <div><span className="font-medium">Représentant légal:</span> {organisme.legalRepresentative}</div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Qualiopi:</span>
                    {organisme.qualiopiCertified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    ) : (
                      <Badge variant="outline">Non certifié</Badge>
                    )}
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
              {organisme.isActive ? (
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
                <div className="text-2xl font-bold text-blue-600">{organisme.apprenants.length}</div>
                <div className="text-sm text-gray-500">Apprenants inscrits</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Membre depuis</div>
                <div className="font-medium">{new Date(organisme.createdAt).toLocaleDateString()}</div>
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
            Abonnement - {organisme.subscription.type}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Statut</div>
              {getSubscriptionStatusBadge(organisme.subscription.status, organisme.subscription.daysRemaining)}
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Période</div>
              <div className="font-medium">
                {new Date(organisme.subscription.startDate).toLocaleDateString()} - {new Date(organisme.subscription.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {organisme.subscription.daysRemaining} jours restants
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Tokens</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{organisme.subscription.tokensRemaining} restants</span>
                  <span>{organisme.subscription.tokensTotal} total</span>
                </div>
                <Progress value={tokensPercentage} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Prix mensuel</div>
              <div className="text-xl font-bold">{organisme.subscription.monthlyPrice}€</div>
              <div className="text-sm text-gray-500">
                Renouvellement: {organisme.subscription.autoRenewal ? 'Automatique' : 'Manuel'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des apprenants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Apprenants ({organisme.apprenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {organisme.apprenants.map((apprenant) => (
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
        </CardContent>
      </Card>

      {/* Modal de désactivation */}
      <DeactivateOrganismeModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        organisme={{
          id: organisme.id,
          name: organisme.name,
          isActive: organisme.isActive
        }}
        onConfirm={handleDeactivateOrganisme}
      />
    </div>
  );
};

export default OrganismeDetail;
