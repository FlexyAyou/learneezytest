
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, Euro, 
  Languages, Award, FileText, Download, CheckCircle, 
  XCircle, Eye, MessageSquare 
} from 'lucide-react';
import { TrainerApplication, TrainerDocument } from '@/types/trainer-application';
import { mockTrainerDocuments } from '@/data/mockTrainerApplicationsData';
import { useToast } from '@/hooks/use-toast';

interface TrainerApplicationModalProps {
  application: TrainerApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes: string) => void;
}

export const TrainerApplicationModal = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject
}: TrainerApplicationModalProps) => {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);

  if (!application) return null;

  const documents = mockTrainerDocuments.filter(
    doc => doc.trainerApplicationId === application.id
  );

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

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'diploma': return 'Diplôme';
      case 'certification': return 'Certification';
      case 'cv': return 'CV';
      case 'identity': 'Pièce d\'identité';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'diploma': return Award;
      case 'certification': return Award;
      case 'cv': return FileText;
      default: return FileText;
    }
  };

  const handleAction = () => {
    if (selectedAction === 'approve') {
      onApprove(application.id, adminNotes);
      toast({
        title: "Candidature approuvée",
        description: `La candidature de ${application.firstName} ${application.lastName} a été approuvée.`,
      });
    } else if (selectedAction === 'reject') {
      if (!adminNotes.trim()) {
        toast({
          title: "Notes requises",
          description: "Veuillez préciser les raisons du rejet.",
          variant: "destructive"
        });
        return;
      }
      onReject(application.id, adminNotes);
      toast({
        title: "Candidature rejetée",
        description: `La candidature de ${application.firstName} ${application.lastName} a été rejetée.`,
        variant: "destructive"
      });
    }
    setSelectedAction(null);
    setAdminNotes('');
    onClose();
  };

  const handleDocumentDownload = (document: TrainerDocument) => {
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de ${document.documentName}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidature de formateur - {application.firstName} {application.lastName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Header avec photo et infos principales */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={application.avatar} 
                alt={`${application.firstName} ${application.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {application.firstName} {application.lastName}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </div>
                  {application.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {application.phone}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  {getStatusBadge(application.status)}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Soumis le {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {application.experienceYears} ans d'expérience
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      {application.hourlyRate}€/h
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Informations personnelles</h4>
                <div className="space-y-2 text-sm">
                  {application.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{application.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {application.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Spécialités</h4>
                <div className="flex flex-wrap gap-2">
                  {application.specialties.map((specialty, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Biographie */}
            {application.bio && (
              <div>
                <h4 className="font-semibold mb-3">Présentation</h4>
                <p className="text-sm text-gray-700 leading-relaxed p-3 bg-gray-50 rounded-lg">
                  {application.bio}
                </p>
              </div>
            )}

            <Separator />

            {/* Documents */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents soumis ({documents.length})
              </h4>
              
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aucun document soumis</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => {
                    const IconComponent = getDocumentIcon(document.documentType);
                    return (
                      <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{document.documentName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {getDocumentTypeLabel(document.documentType)}
                              </Badge>
                              {document.isVerified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDocumentDownload(document)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes administratives existantes */}
            {application.adminNotes && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notes administratives
                </h4>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">{application.adminNotes}</p>
                  {application.reviewedAt && application.reviewedBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      Révisé le {new Date(application.reviewedAt).toLocaleDateString()} par {application.reviewedBy}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions administratives */}
            {application.status === 'pending' && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Actions administratives</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes administratives {selectedAction === 'reject' && <span className="text-red-500">*</span>}
                    </label>
                    <Textarea
                      placeholder={
                        selectedAction === 'reject' 
                          ? "Précisez les raisons du rejet (obligatoire)" 
                          : "Ajoutez des notes pour cette candidature (optionnel)"
                      }
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setSelectedAction('approve')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={selectedAction !== null}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver la candidature
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedAction('reject')}
                      variant="destructive"
                      disabled={selectedAction !== null}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter la candidature
                    </Button>

                    {selectedAction && (
                      <>
                        <Button
                          onClick={handleAction}
                          variant={selectedAction === 'approve' ? 'default' : 'destructive'}
                        >
                          Confirmer {selectedAction === 'approve' ? 'l\'approbation' : 'le rejet'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedAction(null);
                            setAdminNotes('');
                          }}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
