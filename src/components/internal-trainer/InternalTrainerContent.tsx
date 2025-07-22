import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  FileText, 
  Video, 
  HelpCircle, 
  ClipboardList, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Content {
  id: string;
  title: string;
  type: 'module' | 'quiz' | 'assignment';
  description: string;
  createdAt: string;
  status: 'draft' | 'published';
  views?: number;
}

const InternalTrainerContent = () => {
  const { toast } = useToast();
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      title: 'Introduction aux Mathématiques',
      type: 'module',
      description: 'Module d\'introduction aux concepts de base',
      createdAt: '2024-01-15',
      status: 'published',
      views: 45
    },
    {
      id: '2',
      title: 'Quiz - Algèbre de base',
      type: 'quiz',
      description: '10 questions sur l\'algèbre',
      createdAt: '2024-01-10',
      status: 'published',
      views: 32
    }
  ]);

  // Simuler les droits d'accès - à remplacer par une vraie logique d'auth
  const hasContentCreationRights = true;

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'module' as 'module' | 'quiz' | 'assignment',
    description: '',
    videoFile: null as File | null,
    documentFile: null as File | null
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateContent = () => {
    if (!newContent.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const content: Content = {
      id: Date.now().toString(),
      title: newContent.title,
      type: newContent.type,
      description: newContent.description,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft'
    };

    setContents([content, ...contents]);
    setNewContent({
      title: '',
      type: 'module',
      description: '',
      videoFile: null,
      documentFile: null
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Contenu créé",
      description: `${content.type === 'module' ? 'Module' : content.type === 'quiz' ? 'Quiz' : 'Devoir'} créé avec succès`
    });
  };

  const handleDeleteContent = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
    toast({
      title: "Contenu supprimé",
      description: "Le contenu a été supprimé avec succès"
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'module': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <ClipboardList className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'module': return 'Module';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Devoir';
      default: return type;
    }
  };

  if (!hasContentCreationRights) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas accès à la création de contenu. Veuillez contacter l'administration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contenus pédagogiques</h1>
          <p className="text-muted-foreground">Gérez vos modules, quiz et devoirs</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contenu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau contenu</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="media">Médias</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type de contenu</label>
                  <Select value={newContent.type} onValueChange={(value: 'module' | 'quiz' | 'assignment') => 
                    setNewContent({ ...newContent, type: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="module">Module de cours</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Devoir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    placeholder="Titre du contenu"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newContent.description}
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                    placeholder="Description détaillée"
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Vidéo (optionnel)</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Glissez une vidéo ici ou cliquez pour parcourir</p>
                    <input type="file" accept="video/*" className="hidden" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Documents (optionnel)</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Glissez des documents ici ou cliquez pour parcourir</p>
                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" multiple className="hidden" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Paramètres de publication</h4>
                  <p className="text-sm text-muted-foreground">Le contenu sera créé en mode brouillon par défaut</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateContent}>
                Créer le contenu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contents.filter(c => c.type === 'module').length}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contents.filter(c => c.type === 'quiz').length}</p>
                <p className="text-sm text-muted-foreground">Quiz</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contents.filter(c => c.type === 'assignment').length}</p>
                <p className="text-sm text-muted-foreground">Devoirs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contents.reduce((acc, c) => acc + (c.views || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Vues totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contenus */}
      <Card>
        <CardHeader>
          <CardTitle>Mes contenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contents.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getContentIcon(content.type)}
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-muted-foreground">{content.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">
                        {getContentTypeLabel(content.type)}
                      </Badge>
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                        {content.status === 'published' ? 'Publié' : 'Brouillon'}
                      </Badge>
                      {content.views && (
                        <span className="text-xs text-muted-foreground">
                          {content.views} vues
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteContent(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalTrainerContent;