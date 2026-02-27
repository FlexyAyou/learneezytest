import React, { useState, useRef, useEffect } from 'react';
import { getTemplateForType } from '@/utils/personalizeDocumentContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Image,
  Link,
  Undo,
  Redo,
  Save,
  Eye,
  Code,
  FileSignature,
  Palette,
  RotateCcw
} from 'lucide-react';
import { DynamicFieldsPanel } from './DynamicFieldsPanel';
import { DocumentType, DocumentPhase, DOCUMENT_TYPE_LABELS, PHASES_CONFIG, DYNAMIC_FIELDS } from './types';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplateEditorProps {
  template?: {
    id?: string;
    type: DocumentType;
    phase: DocumentPhase;
    title: string;
    htmlContent: string;
    requiresSignature: boolean;
  };
  onSave: (template: any) => void;
  onCancel: () => void;
}

export const DocumentTemplateEditor: React.FC<DocumentTemplateEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(template?.title || '');
  const [type, setType] = useState<DocumentType>(template?.type || 'convention');
  const [phase, setPhase] = useState<DocumentPhase>(template?.phase || 'inscription');
  const [htmlContent, setHtmlContent] = useState(template?.htmlContent || getTemplateForType(template?.type || 'convention') || '<p>Modèle à personnaliser...</p>');
  const [requiresSignature, setRequiresSignature] = useState(template?.requiresSignature ?? true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'code'>('edit');

  const editorRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<Range | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editorRef.current && viewMode === 'edit') {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [viewMode]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        lastSelectionRef.current = range.cloneRange();
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertField = (field: string) => {
    if (viewMode === 'edit' && editorRef.current) {
      editorRef.current.focus();

      let range: Range;
      const selection = window.getSelection();

      // Restore saved selection or fall back to end of editor
      if (lastSelectionRef.current && editorRef.current.contains(lastSelectionRef.current.commonAncestorContainer)) {
        range = lastSelectionRef.current;
      } else if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        range = selection.getRangeAt(0);
      } else {
        range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
      }

      const span = document.createElement('span');
      span.className = 'dynamic-field';
      span.contentEditable = 'false';
      span.textContent = field;
      span.style.cssText = 'background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875rem;';
      range.deleteContents();
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      lastSelectionRef.current = range.cloneRange();
      handleInput();
    } else if (viewMode === 'code') {
      setHtmlContent(prev => prev + field);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 12px; background: #f5f5f5; text-align: left;">Colonne 1</th>
            <th style="border: 1px solid #ddd; padding: 12px; background: #f5f5f5; text-align: left;">Colonne 2</th>
            <th style="border: 1px solid #ddd; padding: 12px; background: #f5f5f5; text-align: left;">Colonne 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">Contenu</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Contenu</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Contenu</td>
          </tr>
        </tbody>
      </table>
    `;
    execCommand('insertHTML', tableHtml);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du document est requis",
        variant: "destructive"
      });
      return;
    }

    onSave({
      id: template?.id || undefined,
      type,
      phase,
      title,
      description: title,
      htmlContent,
      requiresSignature,
      isActive: true,
      updatedAt: new Date().toISOString()
    });

    toast({
      title: "Modèle sauvegardé",
      description: "Le modèle de document a été enregistré avec succès"
    });
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous réinitialiser ce modèle avec le contenu par défaut ? Vos modifications actuelles seront perdues.")) {
      const defaultValue = getTemplateForType(type);
      if (defaultValue) {
        setHtmlContent(defaultValue);
        if (editorRef.current && viewMode === 'edit') {
          editorRef.current.innerHTML = defaultValue;
        }
        toast({ title: "Modèle réinitialisé" });
      }
    }
  };

  // Preview with sample data
  const getPreviewContent = () => {
    let preview = htmlContent;
    const sampleData: Record<string, string> = {
      '{{apprenant.prenom}}': 'Marie',
      '{{apprenant.nom}}': 'Dupont',
      '{{apprenant.nom_complet}}': 'Marie Dupont',
      '{{apprenant.email}}': 'marie.dupont@email.com',
      '{{apprenant.telephone}}': '06 12 34 56 78',
      '{{apprenant.date_naissance}}': '15/03/1990',
      '{{apprenant.adresse}}': '12 rue de la Formation',
      '{{apprenant.ville}}': 'Paris',
      '{{apprenant.code_postal}}': '75001',
      '{{apprenant.entreprise}}': 'TechCorp',
      '{{apprenant.poste}}': 'Développeur',
      '{{formation.nom}}': 'React Avancé',
      '{{formation.description}}': 'Formation approfondie sur React et son écosystème',
      '{{formation.duree}}': '35 heures',
      '{{formation.lieu}}': 'Paris - Centre de formation',
      '{{formation.formateur}}': 'Jean Martin',
      '{{formation.prix}}': '2 500 €',
      '{{formation.certification}}': 'RNCP 12345',
      '{{dates.inscription}}': '01/01/2024',
      '{{dates.debut}}': '15/01/2024',
      '{{dates.fin}}': '20/01/2024',
      '{{dates.aujourdhui}}': new Date().toLocaleDateString('fr-FR'),
      '{{dates.signature}}': new Date().toLocaleDateString('fr-FR'),
      '{{of.nom}}': 'FormaPro',
      '{{of.siret}}': '123 456 789 00010',
      '{{of.nda}}': '11 75 12345 67',
      '{{of.adresse}}': '1 avenue de la Formation',
      '{{of.ville}}': 'Paris',
      '{{of.code_postal}}': '75008',
      '{{of.telephone}}': '01 23 45 67 89',
      '{{of.email}}': 'contact@formapro.fr',
      '{{of.responsable}}': 'Pierre Durant',
      '{{evaluation.note_positionnement}}': '12/20',
      '{{evaluation.note_finale}}': '16/20',
      '{{evaluation.progression}}': '+33%',
      '{{evaluation.niveau_acquis}}': 'Intermédiaire',
      '{{evaluation.commentaire}}': 'Très bonne progression'
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        `<span style="background-color: #dcfce7; color: #166534; padding: 2px 4px; border-radius: 2px;">${value}</span>`
      );
    });

    return preview;
  };

  return (
    <div className="flex gap-6" style={{ minHeight: '600px' }}>
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-primary" />
                Éditeur de modèle
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{PHASES_CONFIG[phase].label}</Badge>
                <Badge>{DOCUMENT_TYPE_LABELS[type]}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Document Settings */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Titre du modèle</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Convention de formation standard"
                />
              </div>
              <div>
                <Label>Type de document</Label>
                <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phase</Label>
                <Select value={phase} onValueChange={(v) => setPhase(v as DocumentPhase)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PHASES_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Signature Toggle */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Switch
                checked={requiresSignature}
                onCheckedChange={setRequiresSignature}
              />
              <div>
                <Label className="font-medium">Signature électronique requise</Label>
                <p className="text-sm text-muted-foreground">
                  L'apprenant devra signer électroniquement ce document
                </p>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center gap-1 p-2 border rounded-lg bg-muted/30">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview' | 'code')}>
                <TabsList className="h-8">
                  <TabsTrigger value="edit" className="text-xs px-3 h-7">Édition</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs px-3 h-7">Aperçu</TabsTrigger>
                  <TabsTrigger value="code" className="text-xs px-3 h-7">Code HTML</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="w-px h-6 bg-border mx-2" />

              {viewMode === 'edit' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('bold')} className="h-8 w-8 p-0">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('italic')} className="h-8 w-8 p-0">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('underline')} className="h-8 w-8 p-0">
                    <Underline className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-1" />

                  <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', 'h1')} className="h-8 w-8 p-0">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', 'h2')} className="h-8 w-8 p-0">
                    <Heading2 className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-1" />

                  <Button variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')} className="h-8 w-8 p-0">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('insertOrderedList')} className="h-8 w-8 p-0">
                    <ListOrdered className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-1" />

                  <Button variant="ghost" size="sm" onClick={() => execCommand('justifyLeft')} className="h-8 w-8 p-0">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('justifyCenter')} className="h-8 w-8 p-0">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand('justifyRight')} className="h-8 w-8 p-0">
                    <AlignRight className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-1" />

                  <Button variant="ghost" size="sm" onClick={insertTable} className="h-8 w-8 p-0">
                    <Table className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Editor Content */}
            <div className="border rounded-lg" style={{ minHeight: '400px' }}>
              {viewMode === 'edit' && (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleInput}
                  onMouseUp={saveSelection}
                  onKeyUp={saveSelection}
                  className="p-6 focus:outline-none prose prose-sm max-w-none bg-white"
                  style={{ minHeight: '400px' }}
                />
              )}

              {viewMode === 'preview' && (
                <div className="p-6 bg-white" style={{ minHeight: '400px' }}>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                  {requiresSignature && (
                    <div className="mt-8 p-4 border-t-2 border-dashed">
                      <p className="text-sm text-muted-foreground mb-4">Zone de signature électronique</p>
                      <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        Emplacement de la signature
                      </div>
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'code' && (
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
                  style={{ minHeight: '400px' }}
                  spellCheck={false}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" className="text-muted-foreground" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser par défaut
              </Button>
              <div className="flex-1" />
              <Button variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le modèle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Fields Panel */}
      <div className="w-80">
        <DynamicFieldsPanel onInsertField={insertField} />
      </div>
    </div>
  );
};

export default DocumentTemplateEditor;

