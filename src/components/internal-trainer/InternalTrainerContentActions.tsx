
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Eye, Edit, Trash2, Download, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InternalTrainerContentDetail } from './InternalTrainerContentDetail';
import { InternalTrainerContentEdit } from './InternalTrainerContentEdit';

interface Content {
  id: string;
  title: string;
  type: string;
  course: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  size: string;
}

export const InternalTrainerContentActions = () => {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      title: 'Introduction à React',
      type: 'video',
      course: 'React Avancé',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      size: '250 MB'
    },
    {
      id: '2',
      title: 'Exercices pratiques',
      type: 'document',
      course: 'JavaScript ES6',
      status: 'draft',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
      size: '2.5 MB'
    },
    {
      id: '3',
      title: 'Quiz TypeScript',
      type: 'quiz',
      course: 'TypeScript',
      status: 'published',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22',
      size: '1.2 MB'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: 'default' as const, label: 'Publié' },
      draft: { variant: 'outline' as const, label: 'Brouillon' },
      archived: { variant: 'secondary' as const, label: 'Archivé' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: '🎥',
      document: '📄',
      quiz: '❓',
      audio: '🎵',
      image: '🖼️'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const filteredContents = contents.filter(content => 
    filterType === 'all' || content.type === filterType
  );

  const handleView = (content: Content) => {
    setSelectedContent(content);
    setShowDetail(true);
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setShowEdit(true);
  };

  const handleDelete = (content: Content) => {
    setContents(prev => prev.filter(c => c.id !== content.id));
    toast({
      title: "Contenu supprimé",
      description: `Le contenu "${content.title}" a été supprimé avec succès.`,
    });
  };

  const handleDownload = (content: Content) => {
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,Contenu: ${content.title}\nType: ${content.type}\nCours: ${content.course}`;
    element.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Téléchargement terminé",
      description: `Le contenu "${content.title}" a été téléchargé.`,
    });
  };

  const handleSave = (updatedContent: Content) => {
    setContents(prev => prev.map(c => 
      c.id === updatedContent.id ? updatedContent : c
    ));
  };

  const handleCreateNew = () => {
    const newContent: Content = {
      id: Date.now().toString(),
      title: 'Nouveau contenu',
      type: 'document',
      course: 'Non assigné',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      size: '0 MB'
    };
    setContents(prev => [...prev, newContent]);
    setSelectedContent(newContent);
    setShowEdit(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Contenus</h2>
          <p className="text-gray-600">Gérez vos contenus pédagogiques</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="video">Vidéos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contenu
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Bibliothèque de contenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{getTypeIcon(content.type)}</span>
                      {content.title}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{content.type}</TableCell>
                  <TableCell>{content.course}</TableCell>
                  <TableCell>{getStatusBadge(content.status)}</TableCell>
                  <TableCell>{content.size}</TableCell>
                  <TableCell>{content.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(content)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(content)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(content)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(content)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InternalTrainerContentDetail
        content={selectedContent}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEdit}
      />

      <InternalTrainerContentEdit
        content={selectedContent}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSave}
      />
    </div>
  );
};
