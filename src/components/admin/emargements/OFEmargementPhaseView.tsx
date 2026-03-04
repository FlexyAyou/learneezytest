import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  UserPlus, School, Award, Clock, Search, CheckCircle2, 
  XCircle, Eye, FileSignature, FileText, Mail, Shield,
  AlertCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmargementLearnerResponse, EmargementDocumentResponse, DocumentStatusEnum, DocumentTemplatePhase } from '@/types/document-types';

// ============= HELPERS =============

const phaseConfig: Record<string, { label: string; icon: React.ElementType; description: string; color: string }> = {
  'phase-inscription': {
    label: 'Phase Inscription',
    icon: UserPlus,
    description: 'Analyse du besoin, test de positionnement, convention',
    color: 'text-blue-600'
  },
  'phase-formation': {
    label: 'Phase Formation',
    icon: School,
    description: 'Convocation, programme, CGV, règlement intérieur, émargement',
    color: 'text-primary'
  },
  'phase-post-formation': {
    label: 'Phase Post-formation',
    icon: Award,
    description: 'Test de sortie, satisfaction à chaud, certificat',
    color: 'text-emerald-600'
  },
  'phase-suivi': {
    label: 'Phase +3 mois',
    icon: Clock,
    description: 'Questionnaire à froid, attestation',
    color: 'text-violet-600'
  },
};

/** Map tab id → backend phase values */
const tabToPhases: Record<string, DocumentTemplatePhase[]> = {
  'phase-inscription': ['inscription'],
  'phase-formation': ['formation'],
  'phase-post-formation': ['post-formation'],
  'phase-suivi': ['suivi'],
};

const getStatusConfig = (status: DocumentStatusEnum) => {
  const configs: Record<string, { icon: React.ElementType; label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    signed: { icon: CheckCircle2, label: 'Signé', variant: 'default' },
    completed: { icon: CheckCircle2, label: 'Complété', variant: 'default' },
    sent: { icon: Mail, label: 'Envoyé', variant: 'secondary' },
    delivered: { icon: Mail, label: 'Délivré', variant: 'secondary' },
    read: { icon: Eye, label: 'Lu', variant: 'secondary' },
    draft: { icon: FileText, label: 'Brouillon', variant: 'outline' },
    expired: { icon: XCircle, label: 'Expiré', variant: 'destructive' },
  };
  return configs[status] || { icon: Clock, label: 'En attente', variant: 'outline' as const };
};

// ============= COMPONENT =============

interface OFEmargementPhaseViewProps {
  activeTab: string;
  learners: EmargementLearnerResponse[];
  isLoading: boolean;
}

export const OFEmargementPhaseView: React.FC<OFEmargementPhaseViewProps> = ({ activeTab, learners, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDocument, setPreviewDocument] = useState<{ doc: EmargementDocumentResponse; learnerName: string } | null>(null);

  const config = phaseConfig[activeTab];
  const PhaseIcon = config?.icon || FileText;
  const phases = tabToPhases[activeTab] || [];

  // Filter documents by phase for each learner
  const learnersWithPhaseDocs = useMemo(() => {
    return learners
      .map(learner => {
        // The emargement endpoint groups docs by type, not phase. 
        // We filter based on known type-to-phase mapping.
        const phaseDocs = learner.documents.filter(doc => {
          // Use document_type to infer phase if the API doesn't provide it directly
          const typePhaseMap: Record<string, DocumentTemplatePhase> = {
            analyse_besoin: 'inscription',
            test_positionnement: 'inscription',
            convention: 'inscription',
            programme: 'formation',
            reglement_interieur: 'formation',
            cgv: 'formation',
            convocation: 'formation',
            emargement: 'formation',
            test_niveau: 'formation',
            satisfaction_chaud: 'post-formation',
            attestation: 'post-formation',
            certificat: 'post-formation',
            test_sortie: 'post-formation',
            satisfaction_froid: 'suivi',
            questionnaire_financeur: 'suivi',
            attestation_honneur: 'suivi',
          };
          const docPhase = typePhaseMap[doc.document_type] || 'inscription';
          return phases.includes(docPhase);
        });

        return { ...learner, phaseDocs };
      })
      .filter(l => l.phaseDocs.length > 0);
  }, [learners, phases]);

  // Search filter
  const filteredLearners = useMemo(() => {
    if (!searchTerm) return learnersWithPhaseDocs;
    const term = searchTerm.toLowerCase();
    return learnersWithPhaseDocs.filter(l =>
      l.learner_name.toLowerCase().includes(term) ||
      l.learner_email.toLowerCase().includes(term)
    );
  }, [learnersWithPhaseDocs, searchTerm]);

  // Phase-level stats
  const phaseStats = useMemo(() => {
    const allDocs = learnersWithPhaseDocs.flatMap(l => l.phaseDocs);
    const signed = allDocs.filter(d => d.status === 'signed' || d.status === 'completed').length;
    const pending = allDocs.length - signed;
    return { total: allDocs.length, signed, pending, learners: learnersWithPhaseDocs.length };
  }, [learnersWithPhaseDocs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <PhaseIcon className={cn("h-6 w-6", config?.color || 'text-primary')} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config?.label}</h2>
            <p className="text-muted-foreground">{config?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {phaseStats.pending > 0 && (
            <Badge variant="destructive" className="gap-1.5 py-1.5 px-3">
              <AlertCircle className="h-4 w-4" />
              {phaseStats.pending} en attente
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-background">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {phaseStats.signed}/{phaseStats.total} signés
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Rechercher un apprenant..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 max-w-md" 
        />
      </div>

      {/* Empty state */}
      {filteredLearners.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document pour cette phase</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Aucun résultat pour cette recherche' 
                : 'Aucun document de cette phase n\'a été envoyé aux apprenants'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Learners with their phase documents */}
      <div className="space-y-4">
        {filteredLearners.map((learner) => {
          const signedCount = learner.phaseDocs.filter(d => d.status === 'signed' || d.status === 'completed').length;
          const pendingCount = learner.phaseDocs.length - signedCount;
          const initials = learner.learner_name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <Card key={learner.learner_id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{initials}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{learner.learner_name}</CardTitle>
                      <CardDescription>{learner.learner_email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pendingCount > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {pendingCount} à signer
                      </Badge>
                    )}
                    <Badge variant="outline">{signedCount}/{learner.phaseDocs.length} signés</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {learner.phaseDocs.map((doc) => {
                  const statusCfg = getStatusConfig(doc.status);
                  const StatusIcon = statusCfg.icon;
                  const isSigned = doc.status === 'signed' || doc.status === 'completed';
                  const needsSignature = !isSigned && doc.status !== 'draft';

                  return (
                    <Card key={doc.id} className={cn(
                      "p-4 transition-all duration-200 hover:shadow-md border-l-4",
                      isSigned 
                        ? "border-l-green-400" 
                        : needsSignature 
                          ? "border-l-amber-400 bg-amber-50/30" 
                          : "border-l-border"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2.5 rounded-xl",
                          isSigned ? "bg-green-100" : needsSignature ? "bg-amber-100" : "bg-muted"
                        )}>
                          <FileText className={cn(
                            "h-5 w-5",
                            isSigned ? "text-green-600" : needsSignature ? "text-amber-600" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground truncate">{doc.document_title}</p>
                            <Badge variant="outline" className="text-xs capitalize">{doc.document_type.replace(/_/g, ' ')}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {doc.signed_at 
                              ? `Signé le ${new Date(doc.signed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                              : 'En attente de signature'}
                          </p>
                        </div>
                        <Badge variant={statusCfg.variant} className="gap-1 shrink-0">
                          <StatusIcon className="h-3 w-3" />
                          {statusCfg.label}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setPreviewDocument({ doc, learnerName: learner.learner_name })}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              {previewDocument?.doc.document_title}
              {previewDocument?.doc.status === 'signed' && ' — Signé'}
            </DialogTitle>
          </DialogHeader>
          
          {previewDocument && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="space-y-4 p-1">
                {/* Metadata */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Apprenant</div>
                        <div className="font-medium">{previewDocument.learnerName}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Type</div>
                        <div className="font-medium capitalize">{previewDocument.doc.document_type.replace(/_/g, ' ')}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Statut</div>
                        <Badge variant={getStatusConfig(previewDocument.doc.status).variant} className="mt-1 gap-1">
                          {React.createElement(getStatusConfig(previewDocument.doc.status).icon, { className: 'h-3 w-3' })}
                          {getStatusConfig(previewDocument.doc.status).label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Signed info */}
                {(previewDocument.doc.status === 'signed' || previewDocument.doc.status === 'completed') && (
                  <>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Informations de signature
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {previewDocument.doc.signed_at && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">Signé le</span>
                            </div>
                            <span className="text-sm text-green-700">
                              {new Date(previewDocument.doc.signed_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                        )}
                        {previewDocument.doc.signature_metadata && (
                          <>
                            {(previewDocument.doc.signature_metadata as any).ip && (
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">Adresse IP</span>
                                <span className="text-sm font-mono">{(previewDocument.doc.signature_metadata as any).ip}</span>
                              </div>
                            )}
                            {(previewDocument.doc.signature_metadata as any).user_agent && (
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">Navigateur</span>
                                <span className="text-sm truncate max-w-[300px]">{(previewDocument.doc.signature_metadata as any).user_agent}</span>
                              </div>
                            )}
                            {(previewDocument.doc.signature_metadata as any).honor_declaration && (
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

                    {previewDocument.doc.signature_data && (
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileSignature className="h-4 w-4" />
                            Signature électronique
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg p-4 bg-background">
                            <img 
                              src={previewDocument.doc.signature_data} 
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
