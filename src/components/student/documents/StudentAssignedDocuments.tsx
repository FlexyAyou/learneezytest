import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, FileSignature, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { DocumentSignerViewer } from './DocumentSignerViewer';
import { IdentityVerificationModal, type IdentityVerificationResult } from './IdentityVerificationModal';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import { useQueryClient } from '@tanstack/react-query';
import type { SignatureField } from '@/types/document-fields';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AssignedDocument {
  id: number;
  title: string;
  fileKey: string;
  fileName: string;
  signatureFields: SignatureField[];
  status: 'pending' | 'signed' | 'completed';
  signedAt?: string;
  signedFieldValues?: Record<string, string>;
}

interface StudentAssignedDocumentsProps {
  documents: AssignedDocument[];
  learnerId?: number;
}

export const StudentAssignedDocuments: React.FC<StudentAssignedDocumentsProps> = ({
  documents,
  learnerId,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<AssignedDocument | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDocument = async (doc: AssignedDocument) => {
    setSelectedDoc(doc);
    setIsLoading(true);
    try {
      const { url } = await fastAPIClient.getPlayUrl(doc.fileKey);
      setPdfUrl(url);
      if (doc.signatureFields?.length > 0 && doc.status !== 'signed') {
        setVerifyOpen(true);
      } else {
        setViewerOpen(true);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger le document.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerified = (_result: IdentityVerificationResult) => {
    setVerifyOpen(false);
    setViewerOpen(true);
  };

  const handleSignComplete = async (filledValues: Record<string, string>) => {
    if (!selectedDoc || !learnerId) return;
    try {
      await fastAPIClient.signDocumentFields(selectedDoc.id, filledValues, {
        ip_address: 'auto',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        honor_declaration: true,
      });
      queryClient.invalidateQueries({ queryKey: ['my-documents', learnerId] });
      toast({ title: '✅ Document signé', description: 'Votre signature a été enregistrée.' });
      setViewerOpen(false);
      setSelectedDoc(null);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de signer le document.', variant: 'destructive' });
    }
  };

  const handleDownloadSigned = async (doc: AssignedDocument) => {
    try {
      await fastAPIClient.downloadSignedPdf(doc.id);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de télécharger.', variant: 'destructive' });
    }
  };

  if (documents.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents PDF assignés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.status === 'signed' ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                    <CheckCircle className="h-3 w-3" /> Signé
                  </Badge>
                ) : doc.signatureFields?.length > 0 ? (
                  <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 gap-1">
                    <FileSignature className="h-3 w-3" /> À signer
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" /> Reçu
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDocument(doc)}
                  disabled={isLoading && selectedDoc?.id === doc.id}
                  className="gap-1.5"
                >
                  {isLoading && selectedDoc?.id === doc.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  Ouvrir
                </Button>
                {doc.status === 'signed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSigned(doc)}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF signé
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PDF Signer Viewer */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{selectedDoc?.title}</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(95vh-80px)]">
            {pdfUrl && selectedDoc && (
              <DocumentSignerViewer
                pdfUrl={pdfUrl}
                fields={selectedDoc.signatureFields || []}
                readOnly={selectedDoc.status === 'signed'}
                onComplete={handleSignComplete}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Identity verification */}
      <IdentityVerificationModal
        isOpen={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onVerified={handleVerified}
        documentName={selectedDoc?.title}
      />
    </>
  );
};
