import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, FileText, Trash2, Eye, BookOpen, ArrowLeft, FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TODO: Replace with real data from API
const mockFormations = [
  { id: '1', name: 'React Avancé', description: 'Formation approfondie React', duration: '35 heures', startDate: '2024-02-01', endDate: '2024-02-05', location: 'Paris', trainer: 'Jean Martin', price: 2500 },
  { id: '2', name: 'Vue.js Débutant', description: 'Initiation à Vue.js', duration: '21 heures', startDate: '2024-02-10', endDate: '2024-02-12', location: 'Lyon', trainer: 'Sophie Durand', price: 1800 },
  { id: '3', name: 'Node.js Backend', description: 'Développement backend avec Node.js', duration: '28 heures', startDate: '2024-03-01', endDate: '2024-03-04', location: 'Paris', trainer: 'Marc Leblanc', price: 2200 },
];

interface UploadedProgramme {
  id: string;
  formationId: string;
  formationName: string;
  file: File;
  uploadedAt: string;
}

const OFProgrammeLibraryPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFormationId, setSelectedFormationId] = useState<string>('');
  const [uploadedProgrammes, setUploadedProgrammes] = useState<UploadedProgramme[]>([]);
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

    const formation = mockFormations.find(f => f.id === selectedFormationId);
    if (!formation) return;

    // Check if a programme already exists for this formation
    const existing = uploadedProgrammes.find(p => p.formationId === selectedFormationId);
    if (existing) {
      setUploadedProgrammes(prev => prev.filter(p => p.id !== existing.id));
    }

    const newProgramme: UploadedProgramme = {
      id: `prog-${Date.now()}`,
      formationId: selectedFormationId,
      formationName: formation.name,
      file: file,
      uploadedAt: new Date().toISOString()
    };

    setUploadedProgrammes(prev => [...prev, newProgramme]);
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

  const handleDelete = (programme: UploadedProgramme) => {
    setUploadedProgrammes(prev => prev.filter(p => p.id !== programme.id));
    toast({
      title: "Programme supprimé",
      description: `Programme de ${programme.formationName} supprimé`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/organisme-formation/documents">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Bibliothèque des Programmes
          </h1>
          <p className="text-muted-foreground mt-1">
            Uploadez les programmes PDF de vos formations pour les envoyer aux apprenants
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter un programme
          </CardTitle>
          <CardDescription>
            Sélectionnez une formation puis uploadez le fichier PDF du programme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
            <select
              value={selectedFormationId}
              onChange={(e) => setSelectedFormationId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Sélectionner une formation...</option>
              {mockFormations.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                  {uploadedProgrammes.find(p => p.formationId === f.id) ? ' ✓' : ''}
                </option>
              ))}
            </select>
            <Button
              variant="default"
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
        </CardContent>
      </Card>

      {/* Programmes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Programmes uploadés
            <Badge variant="secondary" className="ml-2">{uploadedProgrammes.length}</Badge>
          </CardTitle>
          <CardDescription>
            Liste des programmes de formation disponibles pour l'envoi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedProgrammes.length > 0 ? (
            <div className="space-y-3">
              {uploadedProgrammes.map(programme => (
                <div 
                  key={programme.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-lg">{programme.formationName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {programme.file.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Uploadé le {new Date(programme.uploadedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden sm:flex">
                    {(programme.file.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreview(programme)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(programme)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Aucun programme uploadé</p>
              <p className="text-sm mt-1">
                Sélectionnez une formation ci-dessus et uploadez le PDF du programme
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OFProgrammeLibraryPage;
