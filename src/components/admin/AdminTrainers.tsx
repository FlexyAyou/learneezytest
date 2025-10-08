
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Mail, UserCheck, Users, Phone, MapPin, Calendar, Clock, Euro, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainerApplicationModal } from './TrainerApplicationModal';
import { CustomEmailModal } from './CustomEmailModal';
import { mockTrainerApplications, mockTrainerFiscalInfo } from '@/data/mockTrainerApplicationsData';
import { TrainerApplication } from '@/types/trainer-application';

const AdminTrainers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedTrainerForEmail, setSelectedTrainerForEmail] = useState<TrainerApplication | null>(null);
  const [applications, setApplications] = useState(mockTrainerApplications.map(app => ({
    ...app,
    isVisible: true
  })));

  const handleStatusChange = (trainerId: string, newStatus: string) => {
    toast({
      title: "Statut modifié",
      description: `Le formateur a été ${newStatus === 'approved' ? 'activé' : 'désactivé'}.`,
    });
  };

  const handleToggleVisibility = (trainerId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === trainerId 
        ? { ...app, isVisible: !app.isVisible }
        : app
    ));
    
    const trainer = applications.find(app => app.id === trainerId);
    toast({
      title: "Visibilité modifiée",
      description: `Le profil de ${trainer?.firstName} ${trainer?.lastName} est maintenant ${
        !trainer?.isVisible ? 'visible' : 'masqué'
      }.`,
    });
  };

  const handleSendEmail = (trainer: TrainerApplication) => {
    setSelectedTrainerForEmail(trainer);
    setIsEmailModalOpen(true);
  };

  const handleViewApplication = (application: TrainerApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApproveApplication = (id: string, notes?: string) => {
    // 1. Trouver l'application
    const application = applications.find(app => app.id === id);
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

    // 3. Approuver et activer
    setApplications(prev => prev.map(app => 
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

    toast({
      title: "Formateur approuvé et activé",
      description: `${application.firstName} ${application.lastName} peut maintenant accéder à la plateforme.`,
    });
  };

  const handleRejectApplication = (id: string, notes: string) => {
    setApplications(prev => prev.map(app => 
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

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      `${application.firstName} ${application.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures de formateurs</h1>
          <p className="text-gray-600">Gérer les candidatures et valider les formateurs</p>
        </div>
        <Button>
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
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title={application.isVisible ? "Masquer le profil" : "Afficher le profil"}
                        onClick={() => handleToggleVisibility(application.id)}
                        className={application.isVisible ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}
                      >
                        {application.isVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Envoyer un email personnalisé"
                        onClick={() => handleSendEmail(application)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
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
      />

      <CustomEmailModal
        trainer={selectedTrainerForEmail}
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedTrainerForEmail(null);
        }}
      />
    </div>
  );
};

export default AdminTrainers;
