import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadPdfJs, PDFDocumentProxyLike } from '@/lib/pdfjs';
import { SignatureField } from '@/types/document-fields';
import { SignatureZone } from './SignatureZone';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFFieldOverlayProps {
  pdfFile: File;
  fields: SignatureField[];
  onFieldUpdate: (id: string, updates: Partial<SignatureField>) => void;
  onFieldDelete: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  onTotalPagesChange: (total: number) => void;
}

export const PDFFieldOverlay: React.FC<PDFFieldOverlayProps> = ({
  pdfFile,
  fields,
  onFieldUpdate,
  onFieldDelete,
  currentPage,
  onPageChange,
  totalPages,
  onTotalPagesChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxyLike | null>(null);
  const [scale, setScale] = useState(1.2);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      setIsLoading(true);
      try {
        const pdfjsLib = await loadPdfJs();
        const arrayBuffer = await pdfFile.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDoc(doc);
        onTotalPagesChange(doc.numPages);
      } catch (err) {
        console.error('Error loading PDF:', err);
      }
    };
    loadPDF();
  }, [pdfFile]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      setIsLoading(true);
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setCanvasSize({ width: viewport.width, height: viewport.height });

      await page.render({ canvasContext: ctx, viewport }).promise;
      setIsLoading(false);
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const pageFields = fields.filter(f => f.page === currentPage);

  return (
    <div className="flex-1 flex flex-col items-center bg-muted/50 overflow-auto">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 w-full bg-background border-b px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF + Overlay */}
      <div className="p-8 flex justify-center">
        <div
          ref={containerRef}
          className="relative shadow-lg bg-white"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          <canvas ref={canvasRef} className="block" />

          {/* Field overlays */}
          {canvasSize.width > 0 && pageFields.map(field => (
            <SignatureZone
              key={field.id}
              field={field}
              containerWidth={canvasSize.width}
              containerHeight={canvasSize.height}
              onUpdate={onFieldUpdate}
              onDelete={onFieldDelete}
            />
          ))}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
