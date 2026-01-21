import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, Search, ChevronRight, FileSignature, CheckCircle2, 
  XCircle, Clock, FileText, ArrowLeft, Shield, Mail,
  Phone, Building2, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Learner } from './types';

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
}

interface EmargementManagerProps {
  isOpen: boolean;
  onClose: () => void;
  learners: Learner[];
  sentDocuments: SentDocument[];
}

export const EmargementManager: React.FC<EmargementManagerProps> = ({
  isOpen,
  onClose,
  learners,
  sentDocuments = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);

  const filteredLearners = learners.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLearnerDocuments = (learnerId: string) => {
    // Mock documents for demo - in real app, filter from sentDocuments
    return [
      { id: '1', title: 'Conditions Générales de Vente', type: 'cgv', phase: 'inscription', sentAt: '2024-01-15', status: 'signed' as const, signedAt: '2024-01-16', cgvAccepted: true, cgvAcceptedAt: '2024-01-16T10:30:00', signatureConsentAccepted: true, signatureConsentAcceptedAt: '2024-01-16T10:30:00' },
      { id: '2', title: 'Programme de formation', type: 'programme', phase: 'inscription', sentAt: '2024-01-15', status: 'sent' as const },
      { id: '3', title: 'Convention de formation', type: 'convention', phase: 'formation', sentAt: '2024-01-20', status: 'signed' as const, signedAt: '2024-01-21', cgvAccepted: true, cgvAcceptedAt: '2024-01-21T14:00:00', signatureConsentAccepted: true, signatureConsentAcceptedAt: '2024-01-21T14:00:00' },
      { id: '4', title: 'Convocation session', type: 'convocation', phase: 'formation', sentAt: '2024-01-22', status: 'read' as const },
      { id: '5', title: 'Attestation de formation', type: 'attestation', phase: 'post-formation', sentAt: '2024-02-05', status: 'pending' as const },
    ];
  };

  const getLearnerStats = (learnerId: string) => {
    const docs = getLearnerDocuments(learnerId);
    const signed = docs.filter(d => d.status === 'signed').length;
    const pending = docs.filter(d => d.status === 'pending' || d.status === 'sent').length;
    return { total: docs.length, signed, pending };
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; color: string }> = {
      signed: { icon: CheckCircle2, label: 'Signé', color: 'text-green-600 bg-green-50' },
      pending: { icon: Clock, label: 'En attente', color: 'text-amber-600 bg-amber-50' },
      sent: { icon: Mail, label: 'Envoyé', color: 'text-blue-600 bg-blue-50' },
      read: { icon: FileText, label: 'Lu', color: 'text-purple-600 bg-purple-50' },
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

  const renderLearnerList = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Rechercher un apprenant..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{learners.length}</div>
            <div className="text-xs text-muted-foreground">Apprenants</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {learners.reduce((acc, l) => acc + getLearnerStats(l.id).signed, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Signés</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {learners.reduce((acc, l) => acc + getLearnerStats(l.id).pending, 0)}
            </div>
            <div className="text-xs text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
      </div>

      {/* Learner List */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredLearners.map((learner) => {
            const stats = getLearnerStats(learner.id);
            return (
              <Card 
                key={learner.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedLearner(learner)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {learner.firstName[0]}{learner.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {learner.firstName} {learner.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{learner.email}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {learner.formationName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {stats.signed}
                          </Badge>
                          {stats.pending > 0 && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {stats.pending}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stats.total} documents
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredLearners.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun apprenant trouvé
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderLearnerDetails = () => {
    if (!selectedLearner) return null;

    const documents = getLearnerDocuments(selectedLearner.id);
    const groupedDocs = documents.reduce((acc, doc) => {
      if (!acc[doc.phase]) acc[doc.phase] = [];
      acc[doc.phase].push(doc);
      return acc;
    }, {} as Record<string, SentDocument[]>);

    return (
      <div className="space-y-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedLearner(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>

        {/* Learner Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {selectedLearner.firstName[0]}{selectedLearner.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedLearner.firstName} {selectedLearner.lastName}
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedLearner.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedLearner.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {selectedLearner.company}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedLearner.formationName}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents by Phase */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {Object.entries(groupedDocs).map(([phase, docs]) => (
              <Card key={phase}>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {getPhaseLabel(phase)}
                    <Badge variant="secondary" className="ml-auto">{docs.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {docs.map((doc) => {
                      const statusConfig = getStatusConfig(doc.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <div key={doc.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">{doc.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Envoyé le {new Date(doc.sentAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            <Badge className={cn("gap-1", statusConfig.color)}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Signature details */}
                          {doc.status === 'signed' && (
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                              <div className="text-xs font-medium text-foreground flex items-center gap-2">
                                <FileSignature className="h-3.5 w-3.5" />
                                Détails de la signature
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Signé le :</span>
                                  <span className="font-medium">
                                    {doc.signedAt && new Date(doc.signedAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {doc.cgvAccepted && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      CGV acceptées :
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {doc.cgvAcceptedAt && new Date(doc.cgvAcceptedAt).toLocaleString('fr-FR')}
                                    </span>
                                  </div>
                                )}
                                {doc.signatureConsentAccepted && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <Shield className="h-3 w-3 text-green-600" />
                                      Consentement signature électronique :
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {doc.signatureConsentAcceptedAt && new Date(doc.signatureConsentAcceptedAt).toLocaleString('fr-FR')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Pending signature info */}
                          {(doc.status === 'pending' || doc.status === 'sent') && (
                            <div className="bg-amber-50 rounded-lg p-3">
                              <div className="text-xs text-amber-700 flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                En attente de signature de l'apprenant
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Émargements
          </DialogTitle>
        </DialogHeader>
        
        {selectedLearner ? renderLearnerDetails() : renderLearnerList()}
      </DialogContent>
    </Dialog>
  );
};

export default EmargementManager;
