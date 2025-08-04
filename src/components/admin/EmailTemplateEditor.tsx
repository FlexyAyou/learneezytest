
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, Wand2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Partial<EmailTemplate>) => void;
}

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  template,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || '',
    subject: template?.subject || '',
    content: template?.content || '',
    variables: template?.variables || []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [aiOptimizing, setAiOptimizing] = useState(false);

  const availableVariables = [
    '{{firstName}}', '{{lastName}}', '{{courseName}}', '{{instructorName}}',
    '{{startDate}}', '{{endDate}}', '{{certificateUrl}}', '{{loginUrl}}',
    '{{organizationName}}', '{{progress}}'
  ];

  const handleOptimizeWithAI = async () => {
    setAiOptimizing(true);
    // Simulation d'optimisation IA
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        subject: prev.subject + ' - Optimisé par IA',
        content: prev.content + '\n\nCe message a été optimisé pour améliorer l\'engagement.'
      }));
      setAiOptimizing(false);
    }, 2000);
  };

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + ' ' + variable
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Modifier le template' : 'Nouveau template'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Nom du template</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Email de bienvenue"
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Bienvenue</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                  <SelectItem value="completion">Fin de formation</SelectItem>
                  <SelectItem value="certificate">Certificat</SelectItem>
                  <SelectItem value="invitation">Invitation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Objet</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Objet de l'email"
              />
            </div>

            <div>
              <Label>Contenu</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                placeholder="Contenu de l'email..."
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleOptimizeWithAI} disabled={aiOptimizing} variant="outline">
                <Wand2 className="w-4 h-4 mr-2" />
                {aiOptimizing ? 'Optimisation...' : 'Optimiser avec IA'}
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variables disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {availableVariables.map(variable => (
                    <Button
                      key={variable}
                      size="sm"
                      variant="outline"
                      onClick={() => insertVariable(variable)}
                      className="text-xs"
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Aperçu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded p-3 bg-gray-50">
                    <div className="mb-2">
                      <strong>Objet:</strong> {formData.subject}
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                      {formData.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
