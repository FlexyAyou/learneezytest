import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, Search, ChevronRight, FileSignature, CheckCircle2, 
  XCircle, Clock, FileText, ArrowLeft, Shield, Mail,
  Phone, Building2, Calendar, Download, Eye, Printer,
  AlertTriangle, Filter, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useEmargements } from '@/hooks/useDocuments';
import { EmargementLearnerResponse, EmargementDocumentResponse, DocumentStatusEnum } from '@/types/document-types';

// ============= HELPERS =============

const getStatusConfig = (status: DocumentStatusEnum) => {
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

// ============= SUB-COMPONENTS =============

interface LearnerListProps {
  learners: EmargementLearnerResponse[];
  isLoading: boolean;
  totalStats: { totalLearners: number; totalDocuments: number; totalSigned: number; totalPending: number };
  onSelectLearner: (learner: EmargementLearnerResponse) => void;
}

const LearnerList: React.FC<LearnerListProps> = ({ learners, isLoading, totalStats, onSelectLearner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLearners = useMemo(() => {
    let result = learners;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.learner_name.toLowerCase().includes(term) ||
        l.learner_email.toLowerCase().includes(term)
      );
    }

    if (filterStatus === 'complete') {
      result = result.filter(l => l.signed_documents === l.total_documents && l.total_documents > 0);
    } else if (filterStatus === 'pending') {
      result = result.filter(l => l.signed_documents < l.total_documents);
    }

    return result;
  }, [learners, searchTerm, filterStatus]);

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
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{totalStats.totalLearners}</div>
            <div className="text-sm text-muted-foreground">Apprenants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{totalStats.totalDocuments}</div>
            <div className="text-sm text-muted-foreground">Documents envoyés</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{totalStats.totalSigned}</div>
            <div className="text-sm text-green-700">Documents signés</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{totalStats.totalPending}</div>
            <div className="text-sm text-amber-700">En attente de signature</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
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
          <SelectTrigger className="w-48">
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Chargement des émargements...</span>
            </div>
          ) : filteredLearners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun apprenant trouvé</p>
              <p className="text-sm mt-1">
                {searchTerm ? 'Essayez de modifier votre recherche' : 'Envoyez des documents à vos apprenants pour les voir ici'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead className="text-center">Documents signés</TableHead>
                  <TableHead className="text-center">En attente</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLearners.map((learner) => {
                  const pending = learner.total_documents - learner.signed_documents;
                  const isComplete = pending === 0 && learner.total_documents > 0;
                  const initials = learner.learner_name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow 
                      key={learner.learner_id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectLearner(learner)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{initials}</span>
                          </div>
                          <div>
                            <div className="font-medium">{learner.learner_name}</div>
                            <div className="text-sm text-muted-foreground">{learner.learner_email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {learner.signed_documents}/{learner.total_documents}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {pending > 0 ? (
                          <Badge variant="outline" className="border-amber-400 text-amber-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {pending}
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
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============= LEARNER DETAIL VIEW =============

interface LearnerDetailProps {
  learner: EmargementLearnerResponse;
  onBack: () => void;
}

const LearnerDetail: React.FC<LearnerDetailProps> = ({ learner, onBack }) => {
  const [previewDocument, setPreviewDocument] = useState<EmargementDocumentResponse | null>(null);

  const groupedDocs = useMemo(() => {
    // Group documents by type as a proxy for phase (backend doesn't provide phase per doc in emargements)
    const groups: Record<string, EmargementDocumentResponse[]> = {};
    learner.documents.forEach(doc => {
      const phase = doc.document_type || 'autre';
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(doc);
    });
    return groups;
  }, [learner.documents]);

  const initials = learner.learner_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Documents de {learner.learner_name}
            </h1>
            <p className="text-muted-foreground">{learner.learner_email}</p>
          </div>
        </div>
      </div>

      {/* Learner Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{initials}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {learner.learner_email}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Documents signés</div>
                <div className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {learner.signed_documents}/{learner.total_documents}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">En attente</div>
                <div className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  {learner.total_documents - learner.signed_documents}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents grouped */}
      {learner.documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucun document envoyé à cet apprenant</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedDocs).map(([type, docs]) => (
            <Card key={type}>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <Badge variant="secondary">{docs.length} document(s)</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
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
                            <div className="font-medium">{doc.document_title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{doc.document_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {doc.signed_at ? (
                              <span className="text-green-600 font-medium">
                                {new Date(doc.signed_at).toLocaleDateString('fr-FR', {
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
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setPreviewDocument(doc)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              {previewDocument?.document_title}
              {previewDocument?.status === 'signed' && ' — Signé'}
            </DialogTitle>
          </DialogHeader>
          
          {previewDocument && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="space-y-4 p-1">
                {/* Document metadata */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Apprenant</div>
                        <div className="font-medium">{learner.learner_name}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Type</div>
                        <div className="font-medium capitalize">{previewDocument.document_type}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Statut</div>
                        <Badge variant={getStatusConfig(previewDocument.status).variant} className="mt-1 gap-1">
                          {React.createElement(getStatusConfig(previewDocument.status).icon, { className: 'h-3 w-3' })}
                          {getStatusConfig(previewDocument.status).label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Signed info */}
                {previewDocument.status === 'signed' && (
                  <>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Informations de signature
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {previewDocument.signed_at && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">Signé le</span>
                            </div>
                            <span className="text-sm text-green-700">
                              {new Date(previewDocument.signed_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                        )}
                        {previewDocument.signature_metadata && (
                          <>
                            {previewDocument.signature_metadata.ip && (
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">Adresse IP</span>
                                <span className="text-sm font-mono">{previewDocument.signature_metadata.ip}</span>
                              </div>
                            )}
                            {previewDocument.signature_metadata.user_agent && (
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">Navigateur</span>
                                <span className="text-sm truncate max-w-[300px]">{previewDocument.signature_metadata.user_agent}</span>
                              </div>
                            )}
                            {previewDocument.signature_metadata.honor_declaration && (
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium">Déclaration sur l'honneur</span>
                                </div>
                                <Badge variant="default" className="bg-green-600">Acceptée</Badge>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Signature preview */}
                    {previewDocument.signature_data && (
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileSignature className="h-4 w-4" />
                            Signature électronique
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg p-4 bg-white">
                            <img 
                              src={previewDocument.signature_data} 
                              alt="Signature de l'apprenant" 
                              className="max-h-24 mx-auto"
                            />
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

// ============= MAIN PAGE =============

const OFEmargementPage: React.FC = () => {
  const { user } = useFastAPIAuth();
  const ofId = user?.of_id;
  const { data: emargementsData, isLoading } = useEmargements(ofId);
  const [selectedLearner, setSelectedLearner] = useState<EmargementLearnerResponse | null>(null);

  const learners = emargementsData?.learners ?? [];

  const totalStats = useMemo(() => ({
    totalLearners: emargementsData?.total_learners ?? learners.length,
    totalDocuments: emargementsData?.total_documents ?? learners.reduce((s, l) => s + l.total_documents, 0),
    totalSigned: emargementsData?.total_signed ?? learners.reduce((s, l) => s + l.signed_documents, 0),
    totalPending: (emargementsData?.total_documents ?? 0) - (emargementsData?.total_signed ?? 0),
  }), [emargementsData, learners]);

  if (selectedLearner) {
    return <LearnerDetail learner={selectedLearner} onBack={() => setSelectedLearner(null)} />;
  }

  return (
    <LearnerList
      learners={learners}
      isLoading={isLoading}
      totalStats={totalStats}
      onSelectLearner={setSelectedLearner}
    />
  );
};

export default OFEmargementPage;
