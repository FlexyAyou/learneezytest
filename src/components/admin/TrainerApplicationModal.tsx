import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Euro,
  Languages,
  Award,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  CreditCard,
  Building2,
  Shield,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { TrainerApplication, TrainerDocument } from "@/types/trainer-application";
import {
  mockTrainerDocuments,
  mockTrainerFiscalInfo,
  mockTrainerSpecialtyRequests,
} from "@/data/mockTrainerApplicationsData";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

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
  onReject,
}: TrainerApplicationModalProps) => {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const [specialtyRequests, setSpecialtyRequests] = useState<any[]>([]);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [specialtyRejectionReason, setSpecialtyRejectionReason] = useState("");

  useEffect(() => {
    if (application) {
      const requests = mockTrainerSpecialtyRequests.filter((req) => req.trainerId === application.userId);
      setSpecialtyRequests(requests);
    }
  }, [application]);

  if (!application) return null;

  const documents = mockTrainerDocuments.filter((doc) => doc.trainerApplicationId === application.id);

  // Récupérer les infos fiscales
  const fiscalInfo = mockTrainerFiscalInfo[application.userId];

  // Mock data for additional trainer information
  const trainerDetails = {
    paymentMethod: {
      type: "IBAN",
      details: "FR76 1234 5678 9012 3456 7890 123",
      holderName: `${application.firstName} ${application.lastName}`,
      verified: true,
    },
    taxInfo: fiscalInfo || {
      siret: null,
      tvaNumber: null,
      status: null,
      ndaNumber: null,
    },
    performance: {
      totalEarnings: 15420,
      completedSessions: 142,
      averageRating: 4.8,
      totalStudents: 89,
    },
    compliance: {
      backgroundCheck: true,
      insuranceValid: true,
      certificationStatus: "Valid",
      lastVerification: "2024-01-15",
    },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "diploma":
        return "Diplôme";
      case "certification":
        return "Certification";
      case "cv":
        return "CV";
      case "identity":
        "Pièce d'identité";
      case "other":
        return "Autre";
      default:
        return type;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "diploma":
        return Award;
      case "certification":
        return Award;
      case "cv":
        return FileText;
      case "identity":
        return User;
      default:
        return FileText;
    }
  };

  const handleApproveSpecialty = (specialtyId: string) => {
    setSpecialtyRequests((prev) =>
      prev.map((spec) =>
        spec.id === specialtyId
          ? { ...spec, status: "approved" as const, reviewedAt: new Date().toISOString(), reviewedBy: "admin-1" }
          : spec,
      ),
    );

    toast({
      title: "Spécialité approuvée",
      description: "La demande de spécialité a été approuvée avec succès.",
    });
  };

  const handleRejectSpecialty = () => {
    if (!selectedSpecialty || !specialtyRejectionReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison de rejet.",
        variant: "destructive",
      });
      return;
    }

    setSpecialtyRequests((prev) =>
      prev.map((spec) =>
        spec.id === selectedSpecialty
          ? {
              ...spec,
              status: "rejected" as const,
              rejectionReason: specialtyRejectionReason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "admin-1",
            }
          : spec,
      ),
    );

    toast({
      title: "Spécialité rejetée",
      description: "La demande a été rejetée. Le formateur recevra la raison du rejet.",
    });

    setRejectionModalOpen(false);
    setSelectedSpecialty(null);
    setSpecialtyRejectionReason("");
  };

  const openRejectionModal = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setRejectionModalOpen(true);
  };

  const getSpecialtyStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleAction = () => {
    if (selectedAction === "approve") {
      onApprove(application.id, adminNotes);
      toast({
        title: "Candidature approuvée",
        description: `La candidature de ${application.firstName} ${application.lastName} a été approuvée.`,
      });
    } else if (selectedAction === "reject") {
      if (!adminNotes.trim()) {
        toast({
          title: "Notes requises",
          description: "Veuillez préciser les raisons du rejet.",
          variant: "destructive",
        });
        return;
      }
      onReject(application.id, adminNotes);
      toast({
        title: "Candidature rejetée",
        description: `La candidature de ${application.firstName} ${application.lastName} a été rejetée.`,
        variant: "destructive",
      });
    }
    setSelectedAction(null);
    setAdminNotes("");
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
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil complet du formateur - {application.firstName} {application.lastName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
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

            {/* Performance et statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h5 className="font-semibold text-blue-900">Revenus totaux</h5>
                </div>
                <p className="text-2xl font-bold text-blue-800">{trainerDetails.performance.totalEarnings}€</p>
                <p className="text-sm text-blue-600">{trainerDetails.performance.completedSessions} sessions</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-green-600" />
                  <h5 className="font-semibold text-green-900">Note moyenne</h5>
                </div>
                <p className="text-2xl font-bold text-green-800">{trainerDetails.performance.averageRating}/5</p>
                <p className="text-sm text-green-600">{trainerDetails.performance.totalStudents} étudiants</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h5 className="font-semibold text-purple-900">Sessions</h5>
                </div>
                <p className="text-2xl font-bold text-purple-800">{trainerDetails.performance.completedSessions}</p>
                <p className="text-sm text-purple-600">Terminées</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <h5 className="font-semibold text-orange-900">Conformité</h5>
                </div>
                <p className="text-sm font-bold text-orange-800">
                  {trainerDetails.compliance.backgroundCheck ? "✓ Vérifiée" : "✗ En attente"}
                </p>
                <p className="text-sm text-orange-600">
                  Dernier contrôle : {new Date(trainerDetails.compliance.lastVerification).toLocaleDateString()}
                </p>
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

            {/* Demandes de spécialités */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Demandes de spécialités
              </h4>

              {specialtyRequests.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aucune demande de spécialité</p>
              ) : (
                <div className="space-y-3">
                  {specialtyRequests.map((specialty) => (
                    <div key={specialty.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold">{specialty.name}</h5>
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
                                {new Date(specialty.submittedAt).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md mb-3">
                            <p className="text-sm text-gray-600 font-medium mb-1">Motivation:</p>
                            <p className="text-sm">{specialty.motivation}</p>
                          </div>

                          {specialty.status === "rejected" && specialty.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-800 mb-1">Raison du rejet:</p>
                                <p className="text-sm text-red-700">{specialty.rejectionReason}</p>
                              </div>
                            </div>
                          )}

                          {specialty.status === "approved" && specialty.reviewedAt && (
                            <div className="text-xs text-gray-500">
                              Approuvé le {new Date(specialty.reviewedAt).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </div>
                      </div>

                      {specialty.status === "pending" && (
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
            </div>

            {/* Informations fiscales */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations fiscales
              </h4>
              <div className="p-4 border rounded-lg bg-gray-50">
                {!fiscalInfo ? (
                  <p className="text-sm text-gray-500 italic">Informations non renseignées</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">N° NDA</label>
                      <p className="font-mono text-sm">{fiscalInfo.ndaNumber || "Non renseigné"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut juridique</label>
                      <p className="font-mono text-sm">{fiscalInfo.legalStatus || "Non renseigné"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">SIRET</label>
                      <p className="font-mono text-sm">{fiscalInfo.siret || "Non renseigné"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">N° TVA</label>
                      <p className="font-mono text-gray">{fiscalInfo.tvaNumber || "Non renseigné"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Biographie */}
            {application.bio && (
              <div>
                <h4 className="font-semibold mb-3">Présentation</h4>
                <p className="text-sm text-gray-700 leading-relaxed p-3 bg-gray-50 rounded-lg">{application.bio}</p>
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
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{document.documentName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
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
                          <Button size="sm" variant="outline" onClick={() => handleDocumentDownload(document)}>
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                          <Button size="sm" variant="outline">
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

            {/* État du profil fiscal */}
            {application.status === "pending" && (
              <div className="mb-4 p-4 border rounded-lg">
                <h5 className="font-semibold mb-3">État du profil fiscal</h5>
                {fiscalInfo?.isComplete ? (
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Profil fiscal complet
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Le formateur a complété toutes les informations fiscales requises. Vous pouvez approuver sa
                      candidature.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Profil fiscal incomplet
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">Le formateur doit compléter ses informations fiscales avant validation :</p>
                      <ul className="list-disc list-inside text-xs text-gray-500">
                        {!fiscalInfo?.ndaNumber && <li>N° NDA manquant</li>}
                        {!fiscalInfo?.legalStatus && <li>Statut juridique manquant</li>}
                        {!fiscalInfo?.siret && <li>N° SIRET manquant</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions administratives */}
            {application.status === "pending" && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Actions administratives</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes administratives {selectedAction === "reject" && <span className="text-red-500">*</span>}
                    </label>
                    <Textarea
                      placeholder={
                        selectedAction === "reject"
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
                      onClick={() => setSelectedAction("approve")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={selectedAction !== null}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver la candidature
                    </Button>

                    <Button
                      onClick={() => setSelectedAction("reject")}
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
                          variant={selectedAction === "approve" ? "default" : "destructive"}
                        >
                          Confirmer {selectedAction === "approve" ? "l'approbation" : "le rejet"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedAction(null);
                            setAdminNotes("");
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

        {/* Modal de rejet de spécialité */}
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
                  value={specialtyRejectionReason}
                  onChange={(e) => setSpecialtyRejectionReason(e.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectionModalOpen(false);
                  setSelectedSpecialty(null);
                  setSpecialtyRejectionReason("");
                }}
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleRejectSpecialty} disabled={!specialtyRejectionReason.trim()}>
                Confirmer le rejet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
