import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Save, Upload, Play, Plus, FileText, Video, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ModuleCreation() {
  const { toast } = useToast();
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Introduction à React",
      type: "H5P",
      status: "brouillon",
      lastModified: "2024-07-20"
    },
    {
      id: 2,
      title: "Formation SCORM Sécurité",
      type: "SCORM",
      status: "publié",
      lastModified: "2024-07-19"
    }
  ]);

  const [currentModule, setCurrentModule] = useState({
    title: '',
    description: '',
    type: 'H5P',
    content: ''
  });

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon sauvegardé",
      description: "Votre module a été sauvegardé en tant que brouillon.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Module publié",
      description: "Votre module est maintenant disponible pour les apprenants.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      brouillon: "secondary",
      publié: "default",
      "en révision": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SCORM': return <FileText className="h-4 w-4" />;
      case 'H5P': return <Brain className="h-4 w-4" />;
      case 'Vidéo': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Création de modules e-learning</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos contenus pédagogiques interactifs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau module
        </Button>
      </div>

      <Tabs defaultValue="creation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creation">Création</TabsTrigger>
          <TabsTrigger value="mes-modules">Mes modules</TabsTrigger>
        </TabsList>

        <TabsContent value="creation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau module e-learning</CardTitle>
              <CardDescription>
                Créez un nouveau contenu pédagogique interactif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre du module</label>
                  <Input
                    placeholder="Ex: Introduction à JavaScript"
                    value={currentModule.title}
                    onChange={(e) => setCurrentModule({...currentModule, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de contenu</label>
                  <Select value={currentModule.type} onValueChange={(value) => setCurrentModule({...currentModule, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCORM">SCORM</SelectItem>
                      <SelectItem value="H5P">H5P Interactif</SelectItem>
                      <SelectItem value="Vidéo">Vidéo enrichie</SelectItem>
                      <SelectItem value="Quiz">Quiz interactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Décrivez le contenu et les objectifs pédagogiques..."
                  value={currentModule.description}
                  onChange={(e) => setCurrentModule({...currentModule, description: e.target.value})}
                />
              </div>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Zone de création de contenu</h3>
                <p className="text-muted-foreground mb-4">
                  Glissez-déposez vos fichiers ou utilisez les outils de création intégrés
                </p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer fichier
                  </Button>
                  <Button variant="outline" size="sm">
                    <Brain className="mr-2 h-4 w-4" />
                    Éditeur H5P
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder brouillon
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Prévisualiser
                  </Button>
                  <Button onClick={handlePublish}>
                    <Play className="mr-2 h-4 w-4" />
                    Publier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes-modules" className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(module.type)}
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.type} • Modifié le {module.lastModified}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(module.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}