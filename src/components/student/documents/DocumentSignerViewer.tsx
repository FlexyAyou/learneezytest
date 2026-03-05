import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle,
  Loader2,
  PenTool,
  Calendar,
  User,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { SignatureField, SignatureFieldType } from '@/types/document-fields';
import { FIELD_CONFIG } from '@/types/document-fields';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DocumentSignerViewerProps {
  /** URL or object URL of the PDF */
  pdfUrl: string;
  /** Fields to fill / display */
  fields: SignatureField[];
  /** Read-only mode (for OF preview of signed docs) */
  readOnly?: boolean;
  /** Called when all required fields are filled */
  onComplete?: (filledValues: Record<string, string>) => void;
  /** Signer display name */
  signerName?: string;
}

export const DocumentSignerViewer: React.FC<DocumentSignerViewerProps> = ({
  pdfUrl,
  fields,
  readOnly = false,
  onComplete,
  signerName = '',
}) => {
  const [filledValues, setFilledValues] = useState<Record<string, string>>({});
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fill name and date fields
  useEffect(() => {
    if (readOnly) return;
    const autoFilled: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.type === 'name' && signerName) autoFilled[f.id] = signerName;
      if (f.type === 'date') autoFilled[f.id] = new Date().toLocaleDateString('fr-FR');
    });
    setFilledValues((prev) => ({ ...autoFilled, ...prev }));
  }, [fields, signerName, readOnly]);

  const totalPages = Math.max(1, ...fields.map((f) => f.page));

  const allRequiredFilled = fields
    .filter((f) => f.required)
    .every((f) => !!filledValues[f.id]);

  const handleFieldClick = (field: SignatureField) => {
    if (readOnly) return;
    if (field.type === 'signature') {
      setActiveFieldId(field.id);
      setSignatureDialogOpen(true);
    }
    // name and date are auto-filled
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (activeFieldId) {
      setFilledValues((prev) => ({ ...prev, [activeFieldId]: signatureData }));
    }
    setSignatureDialogOpen(false);
    setActiveFieldId(null);
  };

  const handleSubmit = () => {
    if (allRequiredFilled && onComplete) {
      onComplete(filledValues);
    }
  };

  const getFieldIcon = (type: SignatureFieldType) => {
    switch (type) {
      case 'signature': return PenTool;
      case 'date': return Calendar;
      case 'name': return User;
    }
  };

  const pageFields = fields.filter((f) => f.page === currentPage);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage}/{totalPages}
            </span>
            <Button variant="outline" size="icon" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!readOnly && (
          <div className="flex items-center gap-2">
            <Badge variant={allRequiredFilled ? 'default' : 'secondary'} className="gap-1">
              {allRequiredFilled ? (
                <><CheckCircle className="h-3 w-3" /> Prêt</>
              ) : (
                <>{fields.filter((f) => f.required && !filledValues[f.id]).length} champ(s) restant(s)</>
              )}
            </Badge>
            <Button size="sm" disabled={!allRequiredFilled} onClick={handleSubmit}>
              Valider la signature
            </Button>
          </div>
        )}
      </div>

      {/* PDF + field overlay */}
      <ScrollArea className="flex-1">
        <div
          ref={containerRef}
          className="relative mx-auto bg-white shadow-lg"
          style={{
            width: `${595 * zoom}px`,
            height: `${842 * zoom}px`,
            transform: `scale(1)`,
          }}
        >
          {/* PDF embed */}
          <embed
            src={`${pdfUrl}#page=${currentPage}`}
            type="application/pdf"
            className="w-full h-full"
          />

          {/* Field overlays */}
          {pageFields.map((field) => {
            const isFilled = !!filledValues[field.id];
            const FieldIcon = getFieldIcon(field.type);
            const config = FIELD_CONFIG[field.type];

            return (
              <div
                key={field.id}
                className={`absolute border-2 rounded cursor-pointer transition-all ${
                  isFilled
                    ? 'border-green-400 bg-green-50/80'
                    : readOnly
                    ? 'border-muted bg-muted/30'
                    : 'border-dashed border-primary/60 bg-primary/5 hover:bg-primary/10 animate-pulse'
                }`}
                style={{
                  left: `${field.x}%`,
                  top: `${field.y}%`,
                  width: `${field.width}%`,
                  height: `${field.height}%`,
                }}
                onClick={() => handleFieldClick(field)}
                title={field.label || config.label}
              >
                <div className="flex items-center justify-center h-full p-1 overflow-hidden">
                  {isFilled ? (
                    field.type === 'signature' ? (
                      <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Signé
                      </span>
                    ) : (
                      <span className="text-xs text-foreground truncate">
                        {filledValues[field.id]}
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FieldIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Signature dialog */}
      <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apposer votre signature</DialogTitle>
          </DialogHeader>
          <ElectronicSignature
            onSignatureComplete={handleSignatureComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
