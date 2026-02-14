import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users, Search, ChevronRight, FileSignature, CheckCircle2,
  XCircle, Clock, FileText, ArrowLeft, Shield, Mail,
  Phone, Building2, Calendar, Download, Eye, Printer,
  AlertTriangle, Filter, SortAsc, X, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useOFUsers, useAssignments, useOrganization } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { getTemplateForType, personalizeDocumentContent } from '@/utils/personalizeDocumentContent';

interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  formationId: string;
  formationName: string;
}

interface SentDocument {
  id: string;
  title: string;
  type: string;
  phase: string;
  sentAt: string;
  status: 'pending' | 'signed' | 'sent' | 'read';
  signedAt?: string;
  cgvAccepted?: boolean;
  cgvAcceptedAt?: string;
  signatureConsentAccepted?: boolean;
  signatureConsentAcceptedAt?: string;
  signatureData?: string;
  documentUrl?: string;
  htmlContent?: string;
}

const OFEmargementPage: React.FC = () => {
  const { user: currentUser } = useFastAPIAuth();
  const ofId = currentUser?.of_id;
  const { data: ofData } = useOrganization(ofId || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewDocument, setPreviewDocument] = useState<SentDocument | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Fetch real data
  const { data: rawUsers, isLoading: usersLoading } = useOFUsers(ofId, { role: 'apprenant' });
  const { data: rawAssignments, isLoading: assignmentsLoading } = useAssignments({ of_id: ofId });

  // Map API data to component interfaces
  const learners: Learner[] = useMemo(() => {
    if (!rawUsers) return [];
    return rawUsers.map((u: any) => {
      // Find the first assignment for this learner to get formation info if possible
      const learnerDocs = (rawAssignments || []).filter((a: any) => a.user_id === u.id);
      const formationName = learnerDocs.length > 0 ? (learnerDocs[0].course?.title || 'Formation') : 'Formation';

      return {
        id: u.id.toString(),
        firstName: u.first_name || '',
        lastName: u.last_name || '',
        email: u.email,
        phone: u.phone || '-',
        company: u.organization?.name || 'Apprenant',
        formationId: learnerDocs[0]?.course_id?.toString() || '-',
        formationName: formationName
      };
    });
  }, [rawUsers, rawAssignments]);

  const assignmentsMap = useMemo(() => {
    const map: Record<string, SentDocument[]> = {};
    if (!rawAssignments) return map;

    rawAssignments.forEach((a: any) => {
      const learnerId = a.user_id.toString();
      if (!map[learnerId]) map[learnerId] = [];

      map[learnerId].push({
        id: a.id.toString(),
        title: a.title || (a.media_asset?.filename) || 'Document sans titre',
        type: a.type || 'document',
        phase: a.phase || 'inscription',
        sentAt: a.created_at,
        status: a.is_signed ? 'signed' : 'pending',
        signedAt: a.signed_at,
        signatureData: a.signature_data,
        documentUrl: a.signed_url || a.media_asset?.url,
        htmlContent: undefined,
      });
    });
    return map;
  }, [rawAssignments]);

  const selectedLearner = useMemo(() =>
    learners.find(l => l.id === selectedLearnerId),
    [learners, selectedLearnerId]
  );

  const learnerAssignments = useMemo(() =>
    selectedLearnerId ? (assignmentsMap[selectedLearnerId] || []) : [],
    [assignmentsMap, selectedLearnerId]
  );

  const filteredLearners = learners.filter(l => {
    const matchesSearch = `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());

    const stats = { total: 0, signed: 0, pending: 0 };
    const docs = assignmentsMap[l.id] || [];
    stats.total = docs.length;
    stats.signed = docs.filter(d => d.status === 'signed').length;
    stats.pending = stats.total - stats.signed;

    if (filterStatus === 'complete') return matchesSearch && stats.total > 0 && stats.pending === 0;
    if (filterStatus === 'pending') return matchesSearch && stats.pending > 0;
    return matchesSearch;
  });

  const getLearnerStats = (learnerId: string) => {
    const docs = assignmentsMap[learnerId] || [];
    const signed = docs.filter(d => d.status === 'signed').length;
    const pending = docs.filter(d => d.status === 'pending').length;
    return { total: docs.length, signed, pending, docs };
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      signed: { icon: CheckCircle2, label: 'Signé', variant: 'default' },
      pending: { icon: Clock, label: 'À signer', variant: 'outline' },
      sent: { icon: Mail, label: 'Envoyé', variant: 'secondary' },
      read: { icon: Eye, label: 'Lu', variant: 'secondary' },
    };
    return configs[status] || configs.pending;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      'inscription': 'Phase Inscription',
      'phase-inscription': 'Phase Inscription',
      'formation': 'Phase Formation',
      'post-formation': 'Phase Post-formation',
      'suivi': 'Phase +3 mois'
    };
    return labels[phase] || phase;
  };

  const handleDownload = (doc: SentDocument) => {
    if (!doc.documentUrl) return;
    const link = document.createElement('a');
    link.href = doc.documentUrl;
    link.target = '_blank';
    link.download = `${doc.title.replace(/\s+/g, '_')}_signe.html`;
    link.click();
  };

  const handlePrintDocument = (doc: SentDocument) => {
    if (!doc.documentUrl) return;
    window.open(doc.documentUrl, '_blank')?.print();
  };

  const handleOpenPreview = async (doc: SentDocument) => {
    setPreviewDocument(doc);
    setPreviewContent(null);
    setPreviewError(null);
    setIsPreviewLoading(true);

    const generateDynamicContent = () => {
      // Try to match doc type to template
      // Try to infer type from title if type is generic 'document'
      let docType = doc.type;
      if (docType === 'document' || !getTemplateForType(docType)) {
        if (doc.title.toLowerCase().includes('analyse')) docType = 'analyse_besoin';
        else if (doc.title.toLowerCase().includes('cgv')) docType = 'cgv';
        else if (doc.title.toLowerCase().includes('règlement') || doc.title.toLowerCase().includes('reglement')) docType = 'reglement_interieur';
        else if (doc.title.toLowerCase().includes('convention')) docType = 'convention';
      }

      const template = getTemplateForType(docType);

      if (template && selectedLearner) {
        // Map OF Data
        const mappedOFData = ofData ? {
          na: ofData.name,
          siret: ofData.siret,
          nda: ofData.numero_declaration,
          address: ofData.address,
          postalCode: ofData.postal_code,
          city: ofData.city,
          phone: ofData.phone,
          email: ofData.contact_email || ofData.email,
          managerName: ofData.legal_representative
        } : undefined;

        // Map Learner Data
        const mappedLearnerData = {
          firstName: selectedLearner.firstName,
          lastName: selectedLearner.lastName,
          email: selectedLearner.email,
          phone: selectedLearner.phone,
          company: selectedLearner.company,
          // Address not in Learner interface currently, leaving incomplete if needed
        };

        const generatedHtml = personalizeDocumentContent(
          template,
          { id: selectedLearner.formationId, name: selectedLearner.formationName },
          mappedOFData,
          mappedLearnerData
        );

        setPreviewContent(generatedHtml);
        setPreviewError(null);
        return true;
      }
      return false;
    };

    if (doc.documentUrl) {
      try {
        // Try to fetch content to see if it exists and check for 404
        const response = await axios.get(doc.documentUrl, { responseType: 'text' });
        setPreviewContent(response.data);
      } catch (err: any) {
        console.error("Preview fetch error:", err);
        // If 404, try to generate dynamic content as fallback
        if (err.response?.status === 404) {
          const success = generateDynamicContent();
          if (!success) {
            setPreviewError("Le document n'est pas encore généré et aucun modèle correspondant n'a été trouvé.");
          }
        } else {
          setPreviewError("Impossible de charger le document.");
        }
      } finally {
        setIsPreviewLoading(false);
      }
    } else {
      // No URL, try to generate directly
      const success = generateDynamicContent();
      if (!success) {
        setPreviewError("Le document est en attente de génération et aucun modèle n'est disponible.");
      }
      setIsPreviewLoading(false);
    }
  };

  const totalStats = useMemo(() => {
    let total = 0, signed = 0, pending = 0;
    Object.values(assignmentsMap).forEach(docs => {
      total += docs.length;
      signed += docs.filter(d => d.status === 'signed').length;
      pending += docs.filter(d => d.status === 'pending').length;
    });
    return { total, signed, pending };
  }, [assignmentsMap]);

  // Learner list view
  if (!selectedLearner) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Users className="h-8 w-8" />
              Gestion des Émargements
            </h1>
            <p className="text-muted-foreground">
              Suivi des signatures et documents pour les audits
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard/organisme-formation/documents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux documents
            </Link>
          </Button>
        </div>

        {/* Alert for audits */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Preuve d'émargements</h3>
              <p className="text-sm text-amber-700 mt-1">
                Les documents signés par vos apprenants constituent une preuve légale pour les autorités compétentes.
                Assurez-vous que tous les documents requis sont signés avant la fin de chaque formation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              {usersLoading ? <Skeleton className="h-8 w-16 mx-auto mb-2" /> : <div className="text-3xl font-bold text-foreground">{learners.length}</div>}
              <div className="text-sm text-muted-foreground">Apprenants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {assignmentsLoading ? <Skeleton className="h-8 w-16 mx-auto mb-2" /> : <div className="text-3xl font-bold text-foreground">{totalStats.total}</div>}
              <div className="text-sm text-muted-foreground">Documents envoyés</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              {assignmentsLoading ? <Skeleton className="h-8 w-16 mx-auto mb-2" /> : <div className="text-3xl font-bold text-green-600">{totalStats.signed}</div>}
              <div className="text-sm text-green-700">Documents signés</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-center">
              {assignmentsLoading ? <Skeleton className="h-8 w-16 mx-auto mb-2" /> : <div className="text-3xl font-bold text-amber-600">{totalStats.pending}</div>}
              <div className="text-sm text-amber-700">En attente de signature</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un apprenant par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les apprenants</SelectItem>
              <SelectItem value="complete">Tous docs signés</SelectItem>
              <SelectItem value="pending">Docs en attente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Learners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des apprenants</CardTitle>
            <CardDescription>Cliquez sur un apprenant pour voir ses documents</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading || assignmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Documents envoyés</TableHead>
                    <TableHead className="text-center">Statut global</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLearners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Aucun apprenant trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLearners.map((learner) => {
                      const stats = getLearnerStats(learner.id);
                      return (
                        <TableRow
                          key={learner.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedLearnerId(learner.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {learner.firstName[0]}{learner.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{learner.firstName} {learner.lastName}</div>
                                <div className="text-sm text-muted-foreground">{learner.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{learner.formationName}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                              {stats.docs.map((doc: any) => (
                                <Badge
                                  key={doc.id}
                                  variant={doc.status === 'signed' ? 'default' : 'outline'}
                                  className={cn(
                                    "text-xs py-1 px-2.5 font-medium",
                                    doc.status === 'signed'
                                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                      : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                                  )}
                                  title={`${doc.title} - ${doc.status === 'signed' ? 'Signé le ' + new Date(doc.signedAt).toLocaleDateString('fr-FR') : 'En attente de signature'}`}
                                >
                                  {doc.status === 'signed' ? '✓' : '⏳'} {doc.title}
                                </Badge>
                              ))}
                              {stats.total === 0 && <span className="text-xs text-muted-foreground italic">Aucun document</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {stats.total > 0 && stats.pending === 0 ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Complet ({stats.signed}/{stats.total})
                              </Badge>
                            ) : stats.total > 0 ? (
                              <Badge variant="outline" className="border-amber-400 text-amber-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {stats.pending} à signer
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Learner detail view
  const groupedDocs = learnerAssignments.reduce((acc, doc) => {
    if (!acc[doc.phase]) acc[doc.phase] = [];
    acc[doc.phase].push(doc);
    return acc;
  }, {} as Record<string, SentDocument[]>);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedLearnerId(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Documents de {selectedLearner.firstName} {selectedLearner.lastName}
            </h1>
            <p className="text-muted-foreground">{selectedLearner.formationName}</p>
          </div>
        </div>
      </div>

      {/* Learner Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {selectedLearner.firstName[0]}{selectedLearner.lastName[0]}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {selectedLearner.email}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Téléphone</div>
                <div className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {selectedLearner.phone}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Entreprise</div>
                <div className="font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {selectedLearner.company}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Formation</div>
                <div className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {selectedLearner.formationName}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Phase */}
      <div className="space-y-4">
        {Object.entries(groupedDocs).length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Aucun document assigné à cet apprenant.
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedDocs).map(([phase, docs]) => (
            <Card key={phase}>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {getPhaseLabel(phase)}
                  </span>
                  <Badge variant="secondary">{docs.length} document(s)</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Document</TableHead>
                      <TableHead className="font-semibold">Envoyé le</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold">Signé le</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map((doc) => {
                      const statusConfig = getStatusConfig(doc.status);
                      const StatusIcon = statusConfig.icon;
                      const isSigned = doc.status === 'signed';
                      return (
                        <TableRow
                          key={doc.id}
                          className={cn(
                            "transition-colors hover:bg-muted/30",
                            isSigned && "bg-green-50/30"
                          )}
                        >
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                isSigned ? "bg-green-100" : "bg-amber-100"
                              )}>
                                <FileText className={cn(
                                  "h-5 w-5",
                                  isSigned ? "text-green-600" : "text-amber-600"
                                )} />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{doc.title}</div>
                                <div className="text-xs text-muted-foreground capitalize mt-0.5">
                                  {doc.type.replace(/_/g, ' ')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(doc.sentAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(doc.sentAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConfig.variant}
                              className={cn(
                                "gap-1.5 px-3 py-1",
                                isSigned
                                  ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                  : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                              )}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {doc.signedAt ? (
                              <div>
                                <div className="text-sm font-medium text-green-700">
                                  {new Date(doc.signedAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-xs text-green-600">
                                  {new Date(doc.signedAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {doc.documentUrl ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenPreview(doc)}
                                    className="gap-1.5"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Voir
                                  </Button>
                                  {isSigned && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDownload(doc)}
                                      className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
                                    >
                                      <Download className="h-4 w-4" />
                                      Télécharger
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">Document indisponible</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                {previewDocument?.title} {previewDocument?.status === 'signed' && '- Document signé'}
              </DialogTitle>
              <div className="flex items-center gap-2 mr-8">
                <Button size="sm" variant="outline" onClick={() => previewDocument && handlePrintDocument(previewDocument)}>
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimer
                </Button>
                {previewDocument?.status === 'signed' && (
                  <Button size="sm" variant="outline" onClick={() => previewDocument && handleDownload(previewDocument)}>
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {previewDocument && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="space-y-6 p-1">
                {/* Document Preview (In real app, might be iframe of PDF or signed HTML) */}
                <Card className="min-h-[400px] flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    {isPreviewLoading ? (
                      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Chargement du document...</p>
                      </div>
                    ) : previewError ? (
                      <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center gap-4">
                        <div className="p-4 bg-amber-50 rounded-full">
                          <AlertTriangle className="h-10 w-10 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">Indisponible</h3>
                          <p className="text-muted-foreground">{previewError}</p>
                        </div>
                        {previewDocument?.status === 'pending' && (
                          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 max-w-md">
                            C'est normal si le document n'a pas encore été rempli par l'apprenant.
                            Le lien sera valide une fois le document signé.
                          </p>
                        )}
                      </div>
                    ) : (
                      previewContent ? (
                        <iframe
                          srcDoc={previewContent}
                          className="w-full h-[600px] border-none"
                          title="Prévisualisation du document"
                        />
                      ) : (
                        <iframe
                          src={previewDocument.documentUrl}
                          className="w-full h-[600px] border-none"
                          title="Prévisualisation du document"
                        />
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Document metadata - only for signed docs */}
                {previewDocument.status === 'signed' && (
                  <>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Apprenant</div>
                            <div className="font-medium">{selectedLearner.firstName} {selectedLearner.lastName}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Document</div>
                            <div className="font-medium">{previewDocument.title}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Signé le</div>
                            <div className="font-medium text-green-600">
                              {previewDocument.signedAt && new Date(previewDocument.signedAt).toLocaleString('fr-FR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Statut légal</div>
                            <Badge variant="default" className="bg-green-600 mt-1">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Valide
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Signature preview from signatureData */}
                    {previewDocument.signatureData && (
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileSignature className="h-4 w-4" />
                            Signature électronique de l'apprenant
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg p-4 bg-white text-center">
                            <img
                              src={previewDocument.signatureData}
                              alt="Signature de l'apprenant"
                              className="max-h-24 mx-auto"
                            />
                            <p className="text-[10px] text-muted-foreground mt-2">
                              Signé électroniquement le {new Date(previewDocument.signedAt!).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OFEmargementPage;
