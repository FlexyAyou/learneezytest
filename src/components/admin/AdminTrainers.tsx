
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Mail, UserCheck, Users, Phone, MapPin, Calendar, Clock, Euro, EyeOff, Send, UserCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainerApplicationModal } from './TrainerApplicationModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { mockTrainerFiscalInfo } from '@/data/mockTrainerApplicationsData';
import { TrainerApplication } from '@/types/trainer-application';
import { useSuperadminUsers, useValidateTrainer } from '@/hooks/useApi';

const AdminTrainers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  
  // Récupérer les utilisateurs depuis l'API
  const { data: allUsers, isLoading } = useSuperadminUsers();
  
  // Hook pour valider/rejeter un formateur
  const validateTrainerMutation = useValidateTrainer();

  // Mapper les formateurs de l'API
  const applications = useMemo(() => {
    const apiTrainers = (allUsers || [])
      .filter(user => user.role === 'independent_trainer')
      .map(user => ({
        id: user.id.toString(),
        userId: user.id.toString(),
        firstName: user.first_name || 'Prénom',
        lastName: user.last_name || 'Nom',
        email: user.email,
        phone: user.phone || '+33 X XX XX XX XX',
        avatar: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        location: user.address || 'Adresse non renseignée',
        specialties: ['En attente de spécialités'],
        languages: ['Français'],
        experienceYears: 0,
        hourlyRate: 0,
        bio: user.bio || 'Biographie non renseignée',
        status: user.is_active ? 'approved' : 'pending',
        submittedAt: user.created_at || new Date().toISOString(),
        isVisible: true,
        isActive: user.is_active || false
      })) as TrainerApplication[];
    
    return apiTrainers;
  }, [allUsers]);
  
  const [localApplications, setLocalApplications] = useState<TrainerApplication[]>(applications);

  const handleStatusChange = (trainerId: string, newStatus: string) => {
    toast({
      title: "Statut modifié",
      description: `Le formateur a été ${newStatus === 'approved' ? 'activé' : 'désactivé'}.`,
    });
  };

  const handleToggleVisibility = (trainerId: string) => {
    setLocalApplications(prev => prev.map(app => 
      app.id === trainerId 
        ? { ...app, isVisible: !app.isVisible }
        : app
    ));
    
    const trainer = localApplications.find(app => app.id === trainerId);
    toast({
      title: "Visibilité modifiée",
      description: `Le profil de ${trainer?.firstName} ${trainer?.lastName} est maintenant ${
        !trainer?.isVisible ? 'visible' : 'masqué'
      }.`,
    });
  };

  const handleInviteTrainer = () => {
    if (!inviteEmail || !inviteFirstName || !inviteLastName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    // Logique d'envoi d'invitation
    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${inviteFirstName} ${inviteLastName} (${inviteEmail}).`,
    });

    // Réinitialiser le formulaire
    setInviteEmail('');
    setInviteFirstName('');
    setInviteLastName('');
    setIsInviteModalOpen(false);
  };

  const handleViewApplication = (application: TrainerApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApproveApplication = (id: string, notes?: string) => {
    // 1. Trouver l'application
    const application = localApplications.find(app => app.id === id);
    if (!application) return;

    // 2. Vérifier les infos fiscales
    const fiscalInfo = mockTrainerFiscalInfo[application.userId];
    
    if (!fiscalInfo || !fiscalInfo.isComplete) {
      toast({
        title: "Impossible d'approuver",
        description: "Le formateur doit d'abord compléter ses informations fiscales (N° NDA, Statut juridique, SIRET).",
        variant: "destructive"
      });
      return;
    }

    // 3. Appel API pour valider le formateur
    validateTrainerMutation.mutate({
      userId: parseInt(application.userId),
      request: { status: 'validated' }
    }, {
      onSuccess: () => {
        // Mise à jour locale optimiste (sera synchronisée par invalidateQueries)
        setLocalApplications(prev => prev.map(app => 
          app.id === id 
            ? { 
                ...app, 
                status: 'approved' as const,
                isActive: true,
                adminNotes: notes,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'current-admin'
              }
            : app
        ));
        setIsModalOpen(false);
      }
    });
  };

  const handleRejectApplication = (id: string, notes: string) => {
    const application = localApplications.find(app => app.id === id);
    if (!application) return;

    // Appel API pour rejeter le formateur
    validateTrainerMutation.mutate({
      userId: parseInt(application.userId),
      request: { 
        status: 'rejected',
        motif: notes 
      }
    }, {
      onSuccess: () => {
        setLocalApplications(prev => prev.map(app => 
          app.id === id 
            ? { 
                ...app, 
                status: 'rejected' as const, 
                adminNotes: notes,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'current-admin'
              }
            : app
        ));
        setIsModalOpen(false);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredApplications = localApplications.filter(application => {
    const matchesSearch = 
      `${application.firstName} ${application.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: localApplications.length,
    pending: localApplications.filter(app => app.status === 'pending').length,
    approved: localApplications.filter(app => app.status === 'approved').length,
    rejected: localApplications.filter(app => app.status === 'rejected').length
  };
  
  // Synchroniser localApplications avec les nouvelles données de l'API
  React.useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures de formateurs</h1>
          <p className="text-gray-600">Gérer les candidatures et valider les formateurs</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Inviter un formateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Toutes les candidatures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">À valider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Formateurs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Non validées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Liste des candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Spécialités</TableHead>
                <TableHead>Expérience</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow 
                  key={application.id} 
                  className={`cursor-pointer hover:bg-gray-50 ${
                    !application.isVisible 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-300' 
                      : ''
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={application.avatar} 
                        alt={`${application.firstName} ${application.lastName}`}
                        className={`w-10 h-10 rounded-full object-cover ${
                          !application.isVisible ? 'opacity-60 grayscale' : ''
                        }`}
                      />
                      <div>
                        <div className={`font-medium ${!application.isVisible ? 'text-red-700' : ''}`}>
                          {application.firstName} {application.lastName}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {application.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {application.email}
                      </div>
                      {application.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {application.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {application.specialties.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {application.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      {application.experienceYears} ans
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Euro className="h-3 w-3 mr-1 text-gray-400" />
                      {application.hourlyRate}€/h
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Voir la candidature complète"
                        onClick={() => handleViewApplication(application)}
                      >
                        <UserCircle className="h-4 w-4" />
                      </Button>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleToggleVisibility(application.id)}
                              className={application.isVisible ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}
                            >
                              {application.isVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-red-600 text-white border-red-700">
                            <p>Masquer ou rendre visible le formateur dans le catalogue</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune candidature trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      <TrainerApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
        isValidating={validateTrainerMutation.isPending}
      />

      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inviter un formateur</DialogTitle>
            <DialogDescription>
              Envoyez une invitation par email à un nouveau formateur pour rejoindre la plateforme.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-firstname">Prénom</Label>
              <Input
                id="invite-firstname"
                placeholder="Jean"
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-lastname">Nom</Label>
              <Input
                id="invite-lastname"
                placeholder="Dupont"
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="formateur@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleInviteTrainer}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTrainers;
