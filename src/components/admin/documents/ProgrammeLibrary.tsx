import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, FileText, Trash2, Eye, BookOpen
} from 'lucide-react';
import { Formation } from './types';
import { useToast } from '@/hooks/use-toast';

export interface UploadedProgramme {
  id: string;
  formationId: string;
  formationName: string;
  file: File;
  uploadedAt: string;
}

interface ProgrammeLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  formations: Formation[];
  uploadedProgrammes: UploadedProgramme[];
  onUpload: (programme: UploadedProgramme) => void;
  onDelete: (programmeId: string) => void;
}

export const ProgrammeLibrary: React.FC<ProgrammeLibraryProps> = ({
  isOpen,
  onClose,
  formations,
  uploadedProgrammes,
  onUpload,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFormationId, setSelectedFormationId] = React.useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedFormationId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une formation",
        variant: "destructive"
      });
      return;
    }

    const formation = formations.find(f => f.id === selectedFormationId);
    if (!formation) return;

    // Check if a programme already exists for this formation
    const existing = uploadedProgrammes.find(p => p.formationId === selectedFormationId);
    if (existing) {
      onDelete(existing.id);
    }

    const newProgramme: UploadedProgramme = {
      id: `prog-${Date.now()}`,
      formationId: selectedFormationId,
      formationName: formation.name,
      file: file,
      uploadedAt: new Date().toISOString()
    };

    onUpload(newProgramme);
    toast({
      title: "Programme uploadé",
      description: `Programme "${file.name}" ajouté pour ${formation.name}`
    });

    // Reset
    setSelectedFormationId('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreview = (programme: UploadedProgramme) => {
    const url = URL.createObjectURL(programme.file);
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Bibliothèque des Programmes
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Uploadez les programmes PDF de vos formations pour les envoyer aux apprenants
        </p>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
            <select
              value={selectedFormationId}
              onChange={(e) => setSelectedFormationId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Sélectionner une formation...</option>
              {formations.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                  {uploadedProgrammes.find(p => p.formationId === f.id) ? ' ✓' : ''}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              disabled={!selectedFormationId}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Uploader un PDF
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Uploaded Programmes List */}
          <ScrollArea className="flex-1">
            {uploadedProgrammes.length > 0 ? (
              <div className="space-y-2 pr-4">
                {uploadedProgrammes.map(programme => (
                  <div 
                    key={programme.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{programme.formationName}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {programme.file.name}
                      </div>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex">
                      {(programme.file.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handlePreview(programme)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          onDelete(programme.id);
                          toast({
                            title: "Programme supprimé",
                            description: `Programme de ${programme.formationName} supprimé`
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Aucun programme uploadé</p>
                <p className="text-sm">Sélectionnez une formation et uploadez le PDF du programme</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {uploadedProgrammes.length} programme{uploadedProgrammes.length !== 1 ? 's' : ''} uploadé{uploadedProgrammes.length !== 1 ? 's' : ''}
          </div>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgrammeLibrary;
