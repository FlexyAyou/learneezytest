import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Image, 
  File,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResourceManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');

  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Guide d'utilisation React.pdf",
      type: "PDF",
      size: "2.5 MB",
      uploadDate: "2024-07-20",
      status: "publié",
      category: "Documentation"
    },
    {
      id: 2,
      name: "Vidéo Introduction TypeScript.mp4",
      type: "Vidéo",
      size: "125 MB",
      uploadDate: "2024-07-19",
      status: "brouillon",
      category: "Vidéo"
    },
    {
      id: 3,
      name: "Quiz JavaScript Avancé.h5p",
      type: "H5P",
      size: "1.2 MB",
      uploadDate: "2024-07-18",
      status: "validé",
      category: "Quiz"
    },
    {
      id: 4,
      name: "Formation Sécurité.scorm",
      type: "SCORM",
      size: "45 MB",
      uploadDate: "2024-07-17",
      status: "publié",
      category: "Formation"
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'vidéo': return <Video className="h-5 w-5 text-blue-500" />;
      case 'h5p': return <File className="h-5 w-5 text-green-500" />;
      case 'scorm': return <FolderOpen className="h-5 w-5 text-purple-500" />;
      case 'image': return <Image className="h-5 w-5 text-orange-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      brouillon: "secondary",
      publié: "default",
      validé: "outline",
      "en attente": "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const handleUpload = () => {
    toast({
      title: "Import réussi",
      description: "Votre ressource a été importée avec succès.",
    });
  };

  const handleExport = (resourceName: string) => {
    toast({
      title: "Export en cours",
      description: `Export de "${resourceName}" initié.`,
    });
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || resource.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'tous' || resource.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des ressources</h2>
          <p className="text-muted-foreground">
            Importez, organisez et exportez vos ressources pédagogiques
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Importer ressource
        </Button>
      </div>

      <Tabs defaultValue="mes-ressources" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mes-ressources">Mes ressources</TabsTrigger>
          <TabsTrigger value="import-export">Import / Export</TabsTrigger>
        </TabsList>

        <TabsContent value="mes-ressources" className="space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une ressource..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="vidéo">Vidéo</SelectItem>
                      <SelectItem value="h5p">H5P</SelectItem>
                      <SelectItem value="scorm">SCORM</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous statuts</SelectItem>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="publié">Publié</SelectItem>
                      <SelectItem value="validé">Validé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des ressources */}
          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(resource.type)}
                      <div>
                        <h3 className="font-medium">{resource.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.size}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {resource.uploadDate}
                          </span>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(resource.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(resource.name)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exporter
                      </Button>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Zone d'import */}
            <Card>
              <CardHeader>
                <CardTitle>Importer des ressources</CardTitle>
                <CardDescription>
                  Ajoutez de nouveaux contenus pédagogiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Glissez vos fichiers ici</h3>
                  <p className="text-muted-foreground mb-4">
                    Formats supportés: PDF, MP4, SCORM, H5P, images
                  </p>
                  <Button onClick={handleUpload}>
                    Parcourir les fichiers
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Catégorie automatique</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="video">Vidéos</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="formation">Formations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Options d'export */}
            <Card>
              <CardHeader>
                <CardTitle>Exporter des ressources</CardTitle>
                <CardDescription>
                  Partagez vos contenus vers d'autres systèmes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format d'export</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scorm">Package SCORM</SelectItem>
                      <SelectItem value="h5p">Archive H5P</SelectItem>
                      <SelectItem value="zip">Archive ZIP</SelectItem>
                      <SelectItem value="json">Métadonnées JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ressources à exporter</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les ressources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="selected">Ressources sélectionnées</SelectItem>
                      <SelectItem value="category">Par catégorie</SelectItem>
                      <SelectItem value="all">Toutes les ressources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Générer l'export
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}