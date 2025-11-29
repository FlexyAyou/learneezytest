import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';

interface PDFViewerProps {
  pdfUrl?: string;
  pdfKey?: string;
  title: string;
  height?: string;
  showDownload?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfUrl, 
  pdfKey, 
  title, 
  height = '600px',
  showDownload = true 
}) => {
  const { toast } = useToast();
  
  // Utiliser le hook pour gérer l'URL avec rafraîchissement automatique
  const { url: playUrl, loading, error } = usePresignedUrl(pdfKey, pdfUrl);

  const handleDownload = async () => {
    if (!playUrl) return;

    try {
      const link = document.createElement('a');
      link.href = playUrl;
      link.download = title || 'document.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "✅ Téléchargement démarré",
        description: title || "Document PDF",
      });
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de télécharger le PDF",
        variant: "destructive",
      });
    }
  };

  const handleFullscreen = () => {
    if (playUrl) {
      window.open(playUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div 
        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-600 mt-2">Chargement du PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-red-200"
        style={{ height }}
      >
        <div className="text-center">
          <FileText className="h-12 w-12 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!playUrl) {
    return (
      <div 
        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300"
        style={{ height }}
      >
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucun PDF disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showDownload && (
        <div className="flex gap-2 justify-end pr-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Plein écran
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      )}
      <div 
        className="w-full rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 bg-white"
        style={{ height }}
      >
        {/* Try to use embed first, fallback to iframe */}
        <embed
          src={`${playUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          type="application/pdf"
          width="100%"
          height="100%"
          className="w-full h-full"
          onError={() => {
            // Si embed échoue, utiliser iframe
            return null;
          }}
        />
        {/* Fallback iframe for better compatibility */}
        <style>{`
          embed[type="application/pdf"] {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PDFViewer;
