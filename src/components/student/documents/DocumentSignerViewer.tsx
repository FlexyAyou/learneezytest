import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { SignatureField, FIELD_CONFIG } from '@/types/document-fields';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { ChevronLeft, ChevronRight, CheckCircle, FileSignature, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configure worker - Use the bundled worker from the package
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface DocumentSignerViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fields: SignatureField[];
  documentName: string;
  onComplete: (fieldValues: Record<string, string>) => Promise<void>;
}

export const DocumentSignerViewer: React.FC<DocumentSignerViewerProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  fields,
  documentName,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [activeSignatureField, setActiveSignatureField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Load PDF
  useEffect(() => {
    if (!isOpen || !pdfUrl) return;
    const load = async () => {
      try {
        const doc = await pdfjsLib.getDocument(pdfUrl).promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      } catch (err) {
        console.error('Error loading PDF:', err);
      }
    };
    load();
  }, [pdfUrl, isOpen]);

  // Render page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    const render = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setCanvasSize({ width: viewport.width, height: viewport.height });
      await page.render({ canvasContext: ctx, viewport }).promise;
    };
    render();
  }, [pdfDoc, currentPage]);

  const pageFields = fields.filter(f => f.page === currentPage);

  const requiredFields = fields.filter(f => f.required);
  const allRequiredFilled = requiredFields.every(f => fieldValues[f.id]);

  const handleSignatureComplete = (signatureData: string) => {
    if (activeSignatureField) {
      setFieldValues(prev => ({ ...prev, [activeSignatureField]: signatureData }));
      setActiveSignatureField(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(fieldValues);
      setIsComplete(true);
      toast({ title: '✅ Document signé avec succès !' });
    } catch {
      toast({ title: 'Erreur', description: "Erreur lors de la signature", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPdfDoc(null);
    setCurrentPage(1);
    setFieldValues({});
    setActiveSignatureField(null);
    setIsComplete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-[85vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div className="flex items-center gap-3">
            <FileSignature className="h-5 w-5 text-pink-600" />
            <h2 className="font-semibold">{documentName}</h2>
          </div>
          <Badge variant={allRequiredFilled ? 'default' : 'secondary'}>
            {Object.keys(fieldValues).length} / {requiredFields.length} champs remplis
          </Badge>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Signature pad overlay */}
          {activeSignatureField && (
            <div className="absolute inset-0 z-50 bg-background/80 flex items-center justify-center p-8">
              <div className="bg-background border rounded-xl p-6 shadow-xl max-w-lg w-full space-y-4">
                <h3 className="font-semibold">Apposez votre signature</h3>
                <ElectronicSignature onSignatureComplete={handleSignatureComplete} />
                <Button variant="ghost" onClick={() => setActiveSignatureField(null)}>Annuler</Button>
              </div>
            </div>
          )}

          {isComplete ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Document signé !</h3>
                <p className="text-muted-foreground">Votre signature a été enregistrée.</p>
                <Button onClick={handleClose}>Fermer</Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/50">
              {/* Page nav */}
              <div className="sticky top-0 z-10 bg-background border-b w-full px-4 py-2 flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} / {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* PDF + interactive zones */}
              <div className="p-8">
                <div className="relative shadow-lg bg-white" style={{ width: canvasSize.width, height: canvasSize.height }}>
                  <canvas ref={canvasRef} className="block" />
                  {pageFields.map(field => {
                    const config = FIELD_CONFIG[field.type];
                    const isFilled = !!fieldValues[field.id];

                    return (
                      <div
                        key={field.id}
                        className={`absolute cursor-pointer transition-all ${isFilled ? 'opacity-90' : 'animate-pulse'}`}
                        style={{
                          left: `${field.x}%`,
                          top: `${field.y}%`,
                          width: `${field.width}%`,
                          height: `${field.height}%`,
                          border: `2px ${isFilled ? 'solid' : 'dashed'} ${config.color}`,
                          backgroundColor: isFilled ? config.color + '10' : config.color + '25',
                          borderRadius: '4px',
                        }}
                        onClick={() => {
                          if (field.type === 'signature') {
                            setActiveSignatureField(field.id);
                          } else if (field.type === 'date') {
                            setFieldValues(prev => ({ ...prev, [field.id]: new Date().toLocaleDateString('fr-FR') }));
                          } else if (field.type === 'name') {
                            setFieldValues(prev => ({ ...prev, [field.id]: 'Signataire' }));
                          }
                        }}
                      >
                        {isFilled ? (
                          field.type === 'signature' ? (
                            <img src={fieldValues[field.id]} alt="signature" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-medium" style={{ color: config.color }}>
                              {fieldValues[field.id]}
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: config.color }}>
                            {config.icon} Cliquez ici
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isComplete && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <Button variant="ghost" onClick={handleClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!allRequiredFilled || isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Valider la signature
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
