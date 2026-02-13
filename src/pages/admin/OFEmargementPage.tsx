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
  AlertTriangle, Filter, SortAsc, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useOFUsers, useAssignments } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewDocument, setPreviewDocument] = useState<SentDocument | null>(null);

  // Fetch real data
  const { data: rawUsers, isLoading: usersLoading } = useOFUsers(ofId, { role: 'apprenant' });
  const { data: rawAssignments, isLoading: assignmentsLoading } = useAssignments({ of_id: ofId });

  // Map API data to component interfaces
  const learners: Learner[] = useMemo(() => {
    if (!rawUsers) return [];
    return rawUsers.map((u: any) => ({
      id: u.id.toString(),
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      email: u.email,
      phone: u.phone || '-',
      company: 'Learneezy Apprenant',
      formationId: '-',
      formationName: 'Formation'
    }));
  }, [rawUsers]);

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
        status: a.status === 'signed' ? 'signed' : 'pending',
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
    return { total: docs.length, signed, pending };
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      signed: { icon: CheckCircle2, label: 'Signé', variant: 'default' },
      pending: { icon: Clock, label: 'En attente', variant: 'outline' },
      sent: { icon: Mail, label: 'Envoyé', variant: 'secondary' },
      read: { icon: Eye, label: 'Lu', variant: 'secondary' },
    };
    return configs[status] || configs.pending;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      'inscription': 'Phase Inscription',
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
                    <TableHead className="text-center">Documents signés</TableHead>
                    <TableHead className="text-center">En attente</TableHead>
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
                          <TableCell className="text-center">
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {stats.signed}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {stats.pending > 0 ? (
                              <Badge variant="outline" className="border-amber-400 text-amber-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {stats.pending}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-400 text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Complet
                              </Badge>
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
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Envoyé le</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Signé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map((doc) => {
                      const statusConfig = getStatusConfig(doc.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">{doc.type}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(doc.sentAt).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {doc.signedAt ? (
                              <span className="text-green-600 font-medium">
                                {new Date(doc.signedAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {doc.documentUrl ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPreviewDocument(doc)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Voir
                                  </Button>
                                  {doc.status === 'signed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDownload(doc)}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      Télécharger
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">Document indisponible</span>
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
                <Card>
                  <CardContent className="p-0">
                    <iframe
                      src={previewDocument.documentUrl}
                      className="w-full h-[600px] border-none"
                      title="Prévisualisation du document"
                    />
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
