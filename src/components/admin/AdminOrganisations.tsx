
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, Eye, Building, MapPin, Phone, Mail, FileText, CheckCircle, Power, PowerOff, Calendar, Users, ExternalLink, Clock, Coins, AlertTriangle, Send, Filter, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CommercialReminderModal } from './CommercialReminderModal';

const AdminOrganisations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenFilter, setTokenFilter] = useState<string>('all');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showCommercialModal, setShowCommercialModal] = useState(false);
  const [selectedOrgForReminder, setSelectedOrgForReminder] = useState(null);

  // Mock data for organisations avec les nouvelles données d'abonnement et détails utilisateurs
  const organisations = [
    {
      id: '1',
      name: 'Centre de Formation Digital',
      address: '123 Rue de la Formation, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'contact@cfdigital.fr',
      siret: '12345678901234',
      numeroDeclaration: '11-75-12345-75',
      agrements: ['Qualiopi', 'OPCO', 'Datadock', 'RNCP'],
      usersCount: 145,
      userBreakdown: {
        apprenants: 120,
        gestionnaires: 15,
        comptesPro: 10
      },
      createdAt: '2023-01-15',
      isActive: true,
      logoUrl: '',
      description: 'Centre de formation spécialisé dans le digital et les nouvelles technologies',
      website: 'https://www.cfdigital.fr',
      legalRepresentative: 'Jean Dupont',
      subscription: {
        daysRemaining: 45,
        tokensRemaining: 150,
        tokensTotal: 1000
      },
      documents: [
        { name: 'Extrait K-bis', type: 'kbis', status: 'validé', uploadDate: '2023-01-10' },
        { name: 'Déclaration d\'activité', type: 'declaration', status: 'validé', uploadDate: '2023-01-12' },
        { name: 'Certificat Qualiopi', type: 'qualiopi', status: 'validé', uploadDate: '2023-01-14' },
        { name: 'Assurance responsabilité civile', type: 'assurance', status: 'en_attente', uploadDate: '2023-01-15' }
      ]
    },
    {
      id: '2',
      name: 'Institut TechnoPlus',
      address: '456 Avenue des Sciences, 69002 Lyon',
      phone: '04 78 90 12 34',
      email: 'info@technoplus.fr',
      siret: '98765432109876',
      numeroDeclaration: '84-69-98765-69',
      agrements: ['OPCO', 'Pôle Emploi'],
      usersCount: 89,
      userBreakdown: {
        apprenants: 75,
        gestionnaires: 8,
        comptesPro: 6
      },
      createdAt: '2023-03-22',
      isActive: true,
      logoUrl: '',
      description: 'Institut de formation technique et technologique',
      website: 'https://www.technoplus.fr',
      legalRepresentative: 'Marie Martin',
      subscription: {
        daysRemaining: 12,
        tokensRemaining: 50,
        tokensTotal: 500
      },
      documents: [
        { name: 'Extrait K-bis', type: 'kbis', status: 'validé', uploadDate: '2023-03-20' },
        { name: 'Déclaration d\'activité', type: 'declaration', status: 'validé', uploadDate: '2023-03-21' },
        { name: 'Attestation fiscale', type: 'fiscal', status: 'refusé', uploadDate: '2023-03-22' }
      ]
    },
    {
      id: '3',
      name: 'Formation Pro Marseille',
      address: '789 Boulevard Maritime, 13001 Marseille',
      phone: '04 91 23 45 67',
      email: 'contact@formpro-marseille.fr',
      siret: '11223344556677',
      numeroDeclaration: '93-13-11223-13',
      agrements: ['Datadock'],
      usersCount: 67,
      userBreakdown: {
        apprenants: 55,
        gestionnaires: 7,
        comptesPro: 5
      },
      createdAt: '2023-06-10',
      isActive: false,
      logoUrl: '',
      description: 'Formation professionnelle continue en région PACA',
      website: 'https://www.formpro-marseille.fr',
      legalRepresentative: 'Pierre Durand',
      subscription: {
        daysRemaining: 156,
        tokensRemaining: 800,
        tokensTotal: 2000
      },
      documents: [
        { name: 'Extrait K-bis', type: 'kbis', status: 'validé', uploadDate: '2023-06-08' },
        { name: 'Déclaration d\'activité', type: 'declaration', status: 'validé', uploadDate: '2023-06-09' },
        { name: 'Certificat Qualiopi', type: 'qualiopi', status: 'validé', uploadDate: '2023-06-10' }
      ]
    }
  ];

  const handleToggleStatus = (orgId, currentStatus) => {
    toast({
      title: currentStatus ? "Organisme désactivé" : "Organisme activé",
      description: `L'organisme a été ${currentStatus ? 'désactivé' : 'activé'} avec succès.`,
    });
  };

  const handleViewOrganisme = (orgId) => {
    navigate(`/dashboard/superadmin/organisations/${orgId}`);
  };

  const handleSendCommercialReminder = (org) => {
    setSelectedOrgForReminder(org);
    setShowCommercialModal(true);
  };

  const getSubscriptionStatusBadge = (daysRemaining) => {
    if (daysRemaining > 30) {
      return { variant: 'default', className: 'bg-green-100 text-green-800', text: `${daysRemaining}j` };
    } else if (daysRemaining > 7) {
      return { variant: 'secondary', className: 'bg-orange-100 text-orange-800', text: `${daysRemaining}j` };
    } else {
      return { variant: 'destructive', className: 'bg-red-100 text-red-800', text: `${daysRemaining}j` };
    }
  };

  const getTokensStatusBadge = (tokensRemaining, tokensTotal) => {
    const percentage = (tokensRemaining / tokensTotal) * 100;
    if (percentage > 30) {
      return { variant: 'default', className: 'bg-green-100 text-green-800', text: `${tokensRemaining}` };
    } else if (percentage > 15) {
      return { variant: 'secondary', className: 'bg-orange-100 text-orange-800', text: `${tokensRemaining}` };
    } else {
      return { variant: 'destructive', className: 'bg-red-100 text-red-800', text: `${tokensRemaining}` };
    }
  };

  const renderAgrements = (agrements) => {
    if (!agrements || agrements.length === 0) {
      return <Badge variant="outline">Aucun</Badge>;
    }

    const maxDisplayed = 3;
    const displayedAgrements = agrements.slice(0, maxDisplayed);
    const remainingCount = agrements.length - maxDisplayed;

    return (
      <div className="flex flex-wrap gap-1">
        {displayedAgrements.map((agrement, index) => (
          <Badge key={index} variant="default" className="bg-blue-100 text-blue-800 text-xs">
            {agrement}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="text-xs cursor-help">
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-medium">Autres agréments :</div>
                {agrements.slice(maxDisplayed).map((agrement, index) => (
                  <div key={index}>• {agrement}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  const filteredOrganisations = organisations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.siret.includes(searchTerm);
    
    const matchesTokenFilter = tokenFilter === 'all' || 
      (tokenFilter === 'low' && org.subscription.tokensRemaining < 100) ||
      (tokenFilter === 'medium' && org.subscription.tokensRemaining >= 100 && org.subscription.tokensRemaining < 300) ||
      (tokenFilter === 'high' && org.subscription.tokensRemaining >= 300);
    
    return matchesSearch && matchesTokenFilter;
  });

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organismes de Formation</h1>
            <p className="text-gray-600">Gérer les organismes de formation partenaires</p>
          </div>
          <Button onClick={() => navigate('/dashboard/superadmin/organisations/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un organisme
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total organismes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organisations.length}</div>
              <p className="text-xs text-muted-foreground">+2 ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avec agrément</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {organisations.filter(o => o.agrements && o.agrements.length > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((organisations.filter(o => o.agrements && o.agrements.length > 0).length / organisations.length) * 100)}% du total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {organisations.reduce((sum, org) => sum + org.usersCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Tous organismes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Moyenne par organisme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(organisations.reduce((sum, org) => sum + org.usersCount, 0) / organisations.length)}
              </div>
              <p className="text-xs text-muted-foreground">Utilisateurs</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Liste des organismes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email ou SIRET..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={tokenFilter} onValueChange={setTokenFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par tokens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les organismes</SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Tokens faibles (&lt; 100)
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        Tokens moyens (100-299)
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Tokens élevés (≥ 300)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisme</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>SIRET</TableHead>
                  <TableHead className="text-center">Abonnement</TableHead>
                  <TableHead>Agrément</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganisations.map((org) => {
                  const daysStatus = getSubscriptionStatusBadge(org.subscription.daysRemaining);
                  const tokensStatus = getTokensStatusBadge(org.subscription.tokensRemaining, org.subscription.tokensTotal);
                  
                  return (
                    <TableRow key={org.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewOrganisme(org.id)}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {org.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {org.phone}
                          </div>
                          <div className="text-sm flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {org.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{org.siret}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <Badge className={daysStatus.className}>
                              {daysStatus.text}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-gray-400" />
                            <Badge className={tokensStatus.className}>
                              {tokensStatus.text}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderAgrements(org.agrements)}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center gap-1 cursor-help">
                                <div className="font-medium">{org.usersCount}</div>
                                <Info className="h-3 w-3 text-gray-400" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 text-sm">
                                <div className="font-medium">Répartition des utilisateurs :</div>
                                <div>• Apprenants actifs : {org.userBreakdown.apprenants}</div>
                                <div>• Gestionnaires : {org.userBreakdown.gestionnaires}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-gray-500">utilisateurs</div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Voir les détails"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrganisme(org.id);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Aperçu rapide"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrg(org);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Aperçu de l'organisme</DialogTitle>
                              </DialogHeader>
                              {selectedOrg && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                                      <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Nom:</span> {selectedOrg.name}</div>
                                        <div><span className="font-medium">Description:</span> {selectedOrg.description}</div>
                                        <div><span className="font-medium">Site web:</span> {selectedOrg.website}</div>
                                        <div><span className="font-medium">Représentant légal:</span> {selectedOrg.legalRepresentative}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{selectedOrg.address}</div>
                                        <div className="flex items-center"><Phone className="h-3 w-3 mr-1" />{selectedOrg.phone}</div>
                                        <div className="flex items-center"><Mail className="h-3 w-3 mr-1" />{selectedOrg.email}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-center">
                                    <Button onClick={() => handleViewOrganisme(selectedOrg.id)}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Voir tous les détails
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Relance commerciale"
                            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendCommercialReminder(org);
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Documents"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrg(org);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Documents de {selectedOrg?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedOrg && (
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600">
                                    Documents soumis par l'organisme pour son inscription à Learneezy
                                  </p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Document</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Date d'upload</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrg.documents?.map((doc, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{doc.name}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline">{doc.type}</Badge>
                                          </TableCell>
                                          <TableCell>
                                            <Badge 
                                              variant={
                                                doc.status === 'validé' ? 'default' : 
                                                doc.status === 'en_attente' ? 'secondary' : 
                                                'destructive'
                                              }
                                            >
                                              {doc.status === 'validé' ? 'Validé' : 
                                               doc.status === 'en_attente' ? 'En attente' : 
                                               'Refusé'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de relance commerciale */}
        {selectedOrgForReminder && (
          <CommercialReminderModal
            isOpen={showCommercialModal}
            onClose={() => {
              setShowCommercialModal(false);
              setSelectedOrgForReminder(null);
            }}
            organisme={selectedOrgForReminder}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdminOrganisations;
