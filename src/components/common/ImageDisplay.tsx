import React, { useState, useEffect } from 'react';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { Loader2, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';

interface ImageDisplayProps {
  imageKey?: string;
  imageUrl?: string;
  title?: string;
  height?: string;
  downloadable?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageKey,
  imageUrl,
  title = 'Image',
  height = '600px',
  downloadable = true,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer l'URL présignée si imageKey est fourni
  const { url: presignedImageUrl, loading: urlLoading, error: urlError } = usePresignedUrl(
    imageKey ? `media/${imageKey}` : null
  );

  useEffect(() => {
    if (presignedImageUrl) {
      setDisplayUrl(presignedImageUrl);
      setIsLoading(false);
    } else if (imageUrl) {
      setDisplayUrl(imageUrl);
      setIsLoading(false);
    }

    if (urlError) {
      setError('Impossible de charger l\'image');
      setIsLoading(false);
    }
  }, [presignedImageUrl, imageUrl, urlError]);

  const handleDownload = async () => {
    try {
      if (!displayUrl) return;
      
      // Si c'est une URL présignée ou directe, on peut la télécharger
      const link = document.createElement('a');
      link.href = displayUrl;
      link.download = `${title}.jpg`;
      link.click();

      toast({
        title: "✅ Téléchargement démarré",
        description: title,
      });
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleRotate = () => setRotation((rotation + 90) % 360);

  if (isLoading || urlLoading) {
    return (
      <div
        className="bg-gray-900 flex items-center justify-center"
        style={{ height }}
      >
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (error || !displayUrl) {
    return (
      <div
        className="bg-gray-900 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-white text-lg font-semibold mb-2">❌ Erreur</p>
          <p className="text-gray-300">{error || 'Image non disponible'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 flex flex-col">
      {/* Barre d'outils */}
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
        <div className="text-white font-medium text-sm">{title}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-white text-sm min-w-[50px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="border-l border-gray-700 mx-2 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          {downloadable && (
            <>
              <div className="border-l border-gray-700 mx-2 h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-gray-700 h-8 w-8 p-0"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Zone d'affichage de l'image */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center bg-gray-900"
        style={{ height: 'calc(100vh - 400px)', minHeight: '400px' }}
      >
        <div className="flex items-center justify-center p-4">
          <img
            src={displayUrl}
            alt={title}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Erreur lors du chargement de l\'image');
              setIsLoading(false);
            }}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
            className="object-contain"
          />
        </div>
      </div>

      {/* Info footer */}
      <div className="bg-gray-800 p-2 text-xs text-gray-400 border-t border-gray-700">
        Utilisez les boutons ci-dessus pour zoomer, faire pivoter et télécharger
      </div>
    </div>
  );
};

export default ImageDisplay;
