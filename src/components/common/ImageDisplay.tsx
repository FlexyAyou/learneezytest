import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ImageDisplayProps {
  imageKey?: string | null;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}

/**
 * Composant pour afficher une image avec gestion des URLs présignées
 */
export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageKey, 
  imageUrl, 
  alt = 'Image',
  className = ''
}) => {
  const { url, loading, error } = usePresignedUrl(imageKey, imageUrl);

  console.log('🖼️ ImageDisplay:', { imageKey, imageUrl, url, loading, error });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Chargement de l'image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">Erreur de chargement de l'image</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          {error.includes('Connexion au serveur') && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-left">
              <p className="text-xs font-semibold mb-2">🔍 Diagnostic :</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Le backend FastAPI n'est pas accessible</li>
                <li>• Vérifiez que le serveur est démarré</li>
                <li>• URL: {import.meta.env.VITE_API_URL}</li>
                <li>• Image Key: {imageKey}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden bg-muted ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-auto object-contain max-h-[600px]"
        onError={(e) => {
          console.error('❌ Erreur lors du chargement de l\'image:', url);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};
