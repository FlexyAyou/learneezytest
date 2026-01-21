import React, { useState } from 'react';
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
  AlertTriangle, Filter, SortAsc
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
}

// Mock data
const mockLearners: Learner[] = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', phone: '06 12 34 56 78', formationId: '1', formationName: 'React Avancé', company: 'TechCorp' },
  { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', phone: '06 98 76 54 32', formationId: '1', formationName: 'React Avancé', company: 'StartupXYZ' },
  { id: '3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.com', phone: '06 55 44 33 22', formationId: '2', formationName: 'Vue.js Débutant', company: 'DigitalAgency' },
];

const getMockDocuments = (learnerId: string): SentDocument[] => [
  { 
    id: '1', 
    title: 'Conditions Générales de Vente', 
    type: 'cgv', 
    phase: 'inscription', 
    sentAt: '2024-01-15', 
    status: 'signed', 
    signedAt: '2024-01-16T10:30:00', 
    cgvAccepted: true, 
    cgvAcceptedAt: '2024-01-16T10:30:00', 
    signatureConsentAccepted: true, 
    signatureConsentAcceptedAt: '2024-01-16T10:30:00',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    documentUrl: '/documents/cgv-signed.pdf'
  },
  { id: '2', title: 'Programme de formation', type: 'programme', phase: 'inscription', sentAt: '2024-01-15', status: 'sent' },
  { 
    id: '3', 
    title: 'Convention de formation', 
    type: 'convention', 
    phase: 'formation', 
    sentAt: '2024-01-20', 
    status: 'signed', 
    signedAt: '2024-01-21T14:00:00', 
    cgvAccepted: true, 
    cgvAcceptedAt: '2024-01-21T14:00:00', 
    signatureConsentAccepted: true, 
    signatureConsentAcceptedAt: '2024-01-21T14:00:00',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    documentUrl: '/documents/convention-signed.pdf'
  },
  { id: '4', title: 'Convocation session', type: 'convocation', phase: 'formation', sentAt: '2024-01-22', status: 'read' },
  { id: '5', title: 'Attestation de formation', type: 'attestation', phase: 'post-formation', sentAt: '2024-02-05', status: 'pending' },
];

const OFEmargementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewDocument, setPreviewDocument] = useState<SentDocument | null>(null);

  const filteredLearners = mockLearners.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.formationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLearnerStats = (learnerId: string) => {
    const docs = getMockDocuments(learnerId);
    const signed = docs.filter(d => d.status === 'signed').length;
    const pending = docs.filter(d => d.status === 'pending' || d.status === 'sent').length;
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
    // In real implementation, this would download the actual signed document
    console.log('Downloading document:', doc.title);
    // Create a mock download
    const link = document.createElement('a');
    link.href = doc.documentUrl || '#';
    link.download = `${doc.title.replace(/\s+/g, '_')}_signe.pdf`;
    link.click();
  };

  const handlePrint = (doc: SentDocument) => {
    window.print();
  };

  const totalStats = mockLearners.reduce((acc, l) => {
    const stats = getLearnerStats(l.id);
    return {
      total: acc.total + stats.total,
      signed: acc.signed + stats.signed,
      pending: acc.pending + stats.pending
    };
  }, { total: 0, signed: 0, pending: 0 });

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
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground">{mockLearners.length}</div>
              <div className="text-sm text-muted-foreground">Apprenants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground">{totalStats.total}</div>
              <div className="text-sm text-muted-foreground">Documents envoyés</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{totalStats.signed}</div>
              <div className="text-sm text-green-700">Documents signés</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{totalStats.pending}</div>
              <div className="text-sm text-amber-700">En attente de signature</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Rechercher un apprenant par nom, email ou formation..." 
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead className="text-center">Documents signés</TableHead>
                  <TableHead className="text-center">En attente</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLearners.map((learner) => {
                  const stats = getLearnerStats(learner.id);
                  const isComplete = stats.pending === 0;
                  return (
                    <TableRow 
                      key={learner.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedLearner(learner)}
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
                      <TableCell>{learner.company}</TableCell>
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
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Learner detail view
  const documents = getMockDocuments(selectedLearner.id);
  const groupedDocs = documents.reduce((acc, doc) => {
    if (!acc[doc.phase]) acc[doc.phase] = [];
    acc[doc.phase].push(doc);
    return acc;
  }, {} as Record<string, SentDocument[]>);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedLearner(null)}>
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
        {Object.entries(groupedDocs).map(([phase, docs]) => (
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
                    <TableHead>CGV acceptées</TableHead>
                    <TableHead>Consentement électronique</TableHead>
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
                        <TableCell>
                          {doc.cgvAccepted ? (
                            <Badge variant="outline" className="border-green-400 text-green-600 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Oui
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.signatureConsentAccepted ? (
                            <Badge variant="outline" className="border-green-400 text-green-600 gap-1">
                              <Shield className="h-3 w-3" />
                              Oui
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {doc.status === 'signed' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setPreviewDocument(doc)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Télécharger
                              </Button>
                            </div>
                          )}
                          {doc.status !== 'signed' && (
                            <span className="text-sm text-muted-foreground">
                              En attente de signature
                            </span>
                          )}
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

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              {previewDocument?.title} - Document signé
            </DialogTitle>
          </DialogHeader>
          
          {previewDocument && (
            <div className="space-y-6">
              {/* Document metadata */}
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

              {/* Consent details */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Preuves de consentement (pour audit)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">CGV acceptées</span>
                    </div>
                    <span className="text-sm text-green-700">
                      {previewDocument.cgvAcceptedAt && new Date(previewDocument.cgvAcceptedAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Consentement signature électronique</span>
                    </div>
                    <span className="text-sm text-green-700">
                      {previewDocument.signatureConsentAcceptedAt && new Date(previewDocument.signatureConsentAcceptedAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Signature preview */}
              {previewDocument.signatureData && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileSignature className="h-4 w-4" />
                      Signature électronique de l'apprenant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-white">
                      <img 
                        src={previewDocument.signatureData} 
                        alt="Signature de l'apprenant" 
                        className="max-h-24 mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => handlePrint(previewDocument)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button onClick={() => handleDownload(previewDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le PDF signé
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OFEmargementPage;
