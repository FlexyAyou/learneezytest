
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Save, X, Upload } from 'lucide-react';

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

interface InternalTrainerContentEditProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: Content) => void;
}

export const InternalTrainerContentEdit = ({ content, isOpen, onClose, onSave }: InternalTrainerContentEditProps) => {
  const [formData, setFormData] = useState<Content>({
    id: '',
    title: '',
    type: 'document',
    course: '',
    status: 'draft',
    createdAt: '',
    updatedAt: '',
    size: ''
  });

  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContent = {
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSave(updatedContent);
    toast({
      title: "Contenu mis à jour",
      description: `Le contenu "${formData.title}" a été mis à jour avec succès.`,
    });
    onClose();
  };

  const handleChange = (field: keyof Content, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    // Simulation d'upload de fichier
    toast({
      title: "Fichier uploadé",
      description: "Le fichier a été uploadé avec succès.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le contenu</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre du contenu</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nom du contenu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type de contenu</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course">Cours associé</Label>
              <Select value={formData.course} onValueChange={(value) => handleChange('course', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="React Avancé">React Avancé</SelectItem>
                  <SelectItem value="JavaScript ES6">JavaScript ES6</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Node.js">Node.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value as 'draft' | 'published' | 'archived')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du contenu..."
              rows={4}
            />
          </div>

          <div>
            <Label>Fichier</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Glissez-déposez un fichier ou cliquez pour parcourir</p>
              <Button type="button" variant="outline" onClick={handleFileUpload}>
                Choisir un fichier
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
