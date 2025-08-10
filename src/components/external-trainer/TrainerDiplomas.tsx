
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Plus, X, Upload, FileText, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Diploma {
  id: number;
  name: string;
  institution: string;
  date: string;
  level: string;
  field: string;
  fileUrl?: string;
  fileName?: string;
  verified: boolean;
}

const TrainerDiplomas = () => {
  const { toast } = useToast();
  const [isAddingDiploma, setIsAddingDiploma] = useState(false);

  const [diplomas, setDiplomas] = useState<Diploma[]>([
    {
      id: 1,
      name: 'Master en Informatique',
      institution: 'Université Paris-Saclay',
      date: '2019-07-15',
      level: 'Master (Bac+5)',
      field: 'Informatique',
      fileUrl: '/diplomas/master-informatique.pdf',
      fileName: 'master-informatique.pdf',
      verified: true
    },
    {
      id: 2,
      name: 'Licence Professionnelle Développement Web',
      institution: 'IUT de Montreuil',
      date: '2017-06-20',
      level: 'Licence (Bac+3)',
      field: 'Développement Web',
      fileUrl: '/diplomas/licence-pro.pdf',
      fileName: 'licence-pro.pdf',
      verified: true
    },
    {
      id: 3,
      name: 'Certification Scrum Master',
      institution: 'Scrum Alliance',
      date: '2021-03-10',
      level: 'Certification',
      field: 'Gestion de projet',
      fileUrl: '/diplomas/scrum-master.pdf',
      fileName: 'scrum-master.pdf',
      verified: false
    }
  ]);

  const [newDiploma, setNewDiploma] = useState<Partial<Diploma>>({
    name: '',
    institution: '',
    date: '',
    level: '',
    field: '',
    fileName: '',
    verified: false
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Erreur",
          description: "Le fichier ne doit pas dépasser 10MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Seuls les fichiers PDF, JPG et PNG sont acceptés",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setNewDiploma({...newDiploma, fileName: file.name});
    }
  };

  const handleAddDiploma = () => {
    if (!newDiploma.name || !newDiploma.institution || !newDiploma.date || !newDiploma.level || !newDiploma.field) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    // Simuler l'upload du fichier
    const fileUrl = URL.createObjectURL(selectedFile);
    
    const newId = Math.max(...diplomas.map(d => d.id)) + 1;
    const diplomaToAdd: Diploma = {
      id: newId,
      name: newDiploma.name!,
      institution: newDiploma.institution!,
      date: newDiploma.date!,
      level: newDiploma.level!,
      field: newDiploma.field!,
      fileUrl,
      fileName: selectedFile.name,
      verified: false
    };

    setDiplomas([...diplomas, diplomaToAdd]);
    
    setNewDiploma({
      name: '',
      institution: '',
      date: '',
      level: '',
      field: '',
      fileName: '',
      verified: false
    });
    setSelectedFile(null);
    setIsAddingDiploma(false);
    
    toast({
      title: "Diplôme ajouté",
      description: "Le diplôme a été ajouté à votre profil et sera vérifié sous 48h",
    });
  };

  const removeDiploma = (id: number) => {
    setDiplomas(diplomas.filter(d => d.id !== id));
    toast({
      title: "Diplôme supprimé",
      description: "Le diplôme a été retiré de votre profil",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Doctorat (Bac+8)': return 'bg-purple-100 text-purple-800';
      case 'Master (Bac+5)': return 'bg-blue-100 text-blue-800';
      case 'Licence (Bac+3)': return 'bg-green-100 text-green-800';
      case 'BTS/DUT (Bac+2)': return 'bg-orange-100 text-orange-800';
      case 'Baccalauréat': return 'bg-gray-100 text-gray-800';
      case 'Certification': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Diplômes et Certifications
          </span>
          <Dialog open={isAddingDiploma} onOpenChange={setIsAddingDiploma}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un diplôme ou une certification</DialogTitle>
                <DialogDescription>
                  Ajoutez vos diplômes et certifications avec les documents justificatifs
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diploma-name">Nom du diplôme/certification *</Label>
                    <Input
                      id="diploma-name"
                      value={newDiploma.name || ''}
                      onChange={(e) => setNewDiploma({...newDiploma, name: e.target.value})}
                      placeholder="Ex: Master en Informatique"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diploma-institution">Institution *</Label>
                    <Input
                      id="diploma-institution"
                      value={newDiploma.institution || ''}
                      onChange={(e) => setNewDiploma({...newDiploma, institution: e.target.value})}
                      placeholder="Ex: Université Paris-Saclay"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diploma-level">Niveau *</Label>
                    <Select value={newDiploma.level || ''} onValueChange={(value) => setNewDiploma({...newDiploma, level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctorat (Bac+8)">Doctorat (Bac+8)</SelectItem>
                        <SelectItem value="Master (Bac+5)">Master (Bac+5)</SelectItem>
                        <SelectItem value="Licence (Bac+3)">Licence (Bac+3)</SelectItem>
                        <SelectItem value="BTS/DUT (Bac+2)">BTS/DUT (Bac+2)</SelectItem>
                        <SelectItem value="Baccalauréat">Baccalauréat</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diploma-field">Domaine *</Label>
                    <Input
                      id="diploma-field"
                      value={newDiploma.field || ''}
                      onChange={(e) => setNewDiploma({...newDiploma, field: e.target.value})}
                      placeholder="Ex: Informatique, Marketing..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="diploma-date">Date d'obtention *</Label>
                  <Input
                    id="diploma-date"
                    type="date"
                    value={newDiploma.date || ''}
                    onChange={(e) => setNewDiploma({...newDiploma, date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="diploma-file">Document justificatif *</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="diploma-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {selectedFile && (
                      <div className="flex items-center text-sm text-green-600">
                        <FileText className="h-4 w-4 mr-1" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats acceptés: PDF, JPG, PNG (max 10MB)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingDiploma(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddDiploma}>
                  Ajouter le diplôme
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diplomas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun diplôme ajouté pour le moment</p>
              <p className="text-sm">Ajoutez vos diplômes et certifications pour renforcer votre profil</p>
            </div>
          ) : (
            diplomas.map((diploma) => (
              <div key={diploma.id} className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{diploma.name}</h4>
                      <p className="text-sm text-blue-600 font-medium">{diploma.institution}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(diploma.level)} variant="secondary">
                        {diploma.level}
                      </Badge>
                      {diploma.verified ? (
                        <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">En cours de vérification</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{diploma.field}</span>
                    <span>•</span>
                    <span>{formatDate(diploma.date)}</span>
                  </div>
                  
                  {diploma.fileUrl && (
                    <div className="flex items-center gap-2 mt-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{diploma.fileName}</span>
                      <div className="flex gap-1 ml-2">
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => removeDiploma(diploma.id)}
                  className="text-destructive hover:text-destructive ml-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        {diplomas.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">Vérification des diplômes</h4>
                <p className="text-sm text-blue-700">
                  Les diplômes et certifications sont vérifiés par notre équipe sous 48h. 
                  Les documents vérifiés apparaissent avec un badge vert sur votre profil public.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerDiplomas;
