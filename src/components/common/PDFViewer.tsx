import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { fastAPIClient } from '@/services/fastapi-client';

interface PDFViewerProps {
  pdfUrl?: string;
  pdfKey?: string;
  title: string;
  height?: string;
  showDownload?: boolean;
  downloadKey?: string; // Clé alternative pour le téléchargement (ex: program_pdf_key)
  onDownload?: () => Promise<void>; // Fonction personnalisée pour le téléchargement
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  pdfKey,
  title,
  height = '600px',
  showDownload = true,
  downloadKey,
  onDownload
}) => {
  const { toast } = useToast();

  // Utiliser le hook pour gérer l'URL avec rafraîchissement automatique
  const { url: playUrl, loading, error } = usePresignedUrl(pdfKey, pdfUrl);

  const handleDownload = async () => {
    // Si une fonction de téléchargement personnalisée est fournie (ex: pour le programme), l'utiliser
    if (onDownload) {
      try {
        await onDownload();
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
      return;
    }

    // Sinon, utiliser le flux standard (downloadKey ou pdfKey)
    const keyToDownload = downloadKey || pdfKey;
    if (!keyToDownload) {
      toast({
        title: "Erreur",
        description: "Clé de téléchargement introuvable",
        variant: "destructive",
      });
      return;
    }

    try {
      const { download_url } = await fastAPIClient.getDownloadUrl(keyToDownload);
      const link = document.createElement('a');
      link.href = download_url;
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
        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justif
y-center"
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
        className="w-full bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-c
enter border-2 border-red-200"
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
        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justif
y-center border-2 border-gray-300"
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
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Plein ├®cran
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            T├®l├®charger
          </Button>
        </div>
      )}
      <div
        className="w-full rounded-lg overflow-hidden shadow-lg border-2 border-gray-300"
        style={{ height }}
      >
        <embed
          src={playUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
