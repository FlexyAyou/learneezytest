import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Download, Printer } from 'lucide-react';

interface DocumentPreviewFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
}

export const DocumentPreviewFullscreen: React.FC<DocumentPreviewFullscreenProps> = ({
  isOpen,
  onClose,
  title,
  htmlContent
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #000;
              background: #fff;
            }
            h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
            h1 { font-size: 24px; text-align: center; }
            h2 { font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            h3 { font-size: 14px; }
            p { margin: 0.5em 0; line-height: 1.6; text-align: justify; }
            table { width: 100%; border-collapse: collapse; margin: 1em 0; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .signature-block { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; border-top: 1px solid #333; padding-top: 10px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-8 bg-background min-h-full">
            <div 
              className="max-w-3xl mx-auto content-html prose prose-sm dark:prose-invert"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                lineHeight: 1.6
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
