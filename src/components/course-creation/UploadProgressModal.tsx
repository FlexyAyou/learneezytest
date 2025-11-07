import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";

interface UploadProgressModalProps {
  isOpen: boolean;
  currentFile: string;
  uploadedFiles: string[];
  totalFiles: number;
  progress: number;
}

const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90 w-48 h-48">
        {/* Cercle de fond */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-muted/20"
        />
        {/* Cercle de progression */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" />
            <stop offset="100%" className="[stop-color:hsl(var(--primary-glow))]" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Pourcentage au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export const UploadProgressModal = ({
  isOpen,
  currentFile,
  uploadedFiles,
  totalFiles,
  progress
}: UploadProgressModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md animate-fade-in">
        <div className="space-y-6 py-4">
          {/* Cercle de progression */}
          <div className="flex justify-center">
            <CircularProgress progress={progress} />
          </div>

          {/* Titre */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Upload en cours...</h3>
            <p className="text-sm text-muted-foreground">
              {uploadedFiles.length}/{totalFiles} vidéos uploadées
            </p>
          </div>

          {/* Fichier en cours */}
          {currentFile && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentFile}</p>
                <p className="text-xs text-muted-foreground">Upload en cours...</p>
              </div>
            </div>
          )}

          {/* Liste des fichiers uploadés */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Vidéos uploadées :
              </h4>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm truncate">{file}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
