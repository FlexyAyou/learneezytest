import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadNotificationProps {
  uploads: UploadItem[];
  onRemove?: (id: string) => void;
}

export const UploadNotification: React.FC<UploadNotificationProps> = ({ uploads, onRemove }) => {
  // Ne rien afficher si pas d'uploads
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm space-y-2 animate-fade-in">
      {uploads.map((upload) => (
        <Card
          key={upload.id}
          className="p-4 shadow-lg border-2 bg-card/95 backdrop-blur-sm animate-scale-in"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {upload.status === 'uploading' && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              {upload.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {upload.status === 'error' && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {upload.fileName}
              </p>
              
              {upload.status === 'uploading' && (
                <>
                  <Progress value={upload.progress} className="mt-2 h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {upload.progress}% téléchargé...
                  </p>
                </>
              )}

              {upload.status === 'completed' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Upload terminé
                </p>
              )}

              {upload.status === 'error' && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {upload.error || 'Erreur d\'upload'}
                </p>
              )}
            </div>

            {/* Close button - only for completed or error */}
            {(upload.status === 'completed' || upload.status === 'error') && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 flex-shrink-0"
                onClick={() => onRemove(upload.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
