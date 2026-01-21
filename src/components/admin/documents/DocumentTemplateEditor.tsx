import React, { useState, useRef, useEffect } from 'react';
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
  Palette
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
  const [htmlContent, setHtmlContent] = useState(template?.htmlContent || getDefaultTemplate(template?.type || 'convention'));
  const [requiresSignature, setRequiresSignature] = useState(template?.requiresSignature ?? true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'code'>('edit');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editorRef.current && viewMode === 'edit') {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [viewMode]);

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
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'dynamic-field';
        span.contentEditable = 'false';
        span.textContent = field;
        span.style.cssText = 'background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875rem;';
        range.deleteContents();
        range.insertNode(span);
        range.setStartAfter(span);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
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
      id: template?.id,
      type,
      phase,
      title,
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

// Default templates for each document type
function getDefaultTemplate(type: DocumentType): string {
  const templates: Record<DocumentType, string> = {
    convention: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; margin-bottom: 10px;">CONVENTION DE FORMATION PROFESSIONNELLE</h1>
          <p style="color: #6b7280;">N° {{of.nda}}</p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">ENTRE LES SOUSSIGNÉS</h2>
        
        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p><strong>{{of.nom}}</strong></p>
          <p>SIRET : {{of.siret}}</p>
          <p>Numéro de déclaration d'activité : {{of.nda}}</p>
          <p>Adresse : {{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
          <p>Représenté par : {{of.responsable}}</p>
          <p style="margin-top: 10px;"><em>Ci-après dénommé "l'Organisme de formation"</em></p>
        </div>

        <p style="text-align: center; font-weight: bold; margin: 20px 0;">ET</p>

        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p><strong>{{apprenant.nom_complet}}</strong></p>
          <p>Email : {{apprenant.email}}</p>
          <p>Téléphone : {{apprenant.telephone}}</p>
          <p>Adresse : {{apprenant.adresse}}, {{apprenant.code_postal}} {{apprenant.ville}}</p>
          <p style="margin-top: 10px;"><em>Ci-après dénommé "le Stagiaire"</em></p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 1 - OBJET DE LA CONVENTION</h2>
        <p>La présente convention a pour objet la formation suivante :</p>
        <div style="margin: 20px 0; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p><strong>Formation : {{formation.nom}}</strong></p>
          <p>{{formation.description}}</p>
          <p>Durée : {{formation.duree}}</p>
          <p>Lieu : {{formation.lieu}}</p>
          <p>Formateur : {{formation.formateur}}</p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 2 - PÉRIODE DE FORMATION</h2>
        <p>La formation se déroulera du <strong>{{dates.debut}}</strong> au <strong>{{dates.fin}}</strong>.</p>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 3 - COÛT DE LA FORMATION</h2>
        <p>Le coût total de la formation s'élève à <strong>{{formation.prix}}</strong> net de taxes.</p>

        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="width: 45%;">
            <p><strong>Pour l'Organisme de formation</strong></p>
            <p>Fait à {{of.ville}}, le {{dates.aujourdhui}}</p>
            <div style="height: 80px; border: 1px dashed #d1d5db; margin-top: 10px; border-radius: 4px;"></div>
          </div>
          <div style="width: 45%;">
            <p><strong>Pour le Stagiaire</strong></p>
            <p>Lu et approuvé, le {{dates.signature}}</p>
            <div style="height: 80px; border: 1px dashed #d1d5db; margin-top: 10px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>
    `,
    attestation: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 3px solid #1e40af;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">ATTESTATION DE FORMATION</h1>
          <p style="color: #6b7280;">Référence : ATT-{{dates.aujourdhui}}</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <p style="font-size: 18px;">L'organisme de formation <strong>{{of.nom}}</strong></p>
          <p style="color: #6b7280;">N° de déclaration d'activité : {{of.nda}}</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <p style="font-size: 16px;">Atteste que</p>
          <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 20px 0;">{{apprenant.nom_complet}}</p>
          <p>a suivi avec succès la formation</p>
          <p style="font-size: 20px; font-weight: bold; margin: 20px 0;">{{formation.nom}}</p>
        </div>

        <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p><strong>Durée :</strong> {{formation.duree}}</p>
          <p><strong>Période :</strong> du {{dates.debut}} au {{dates.fin}}</p>
          <p><strong>Lieu :</strong> {{formation.lieu}}</p>
          <p><strong>Formateur :</strong> {{formation.formateur}}</p>
        </div>

        <div style="margin-top: 50px; text-align: right;">
          <p>Fait à {{of.ville}}, le {{dates.aujourdhui}}</p>
          <p style="margin-top: 20px;"><strong>{{of.responsable}}</strong></p>
          <p>Responsable de l'organisme de formation</p>
          <div style="height: 80px; width: 200px; border: 1px dashed #d1d5db; margin-top: 10px; margin-left: auto; border-radius: 4px;"></div>
        </div>
      </div>
    `,
    certificat: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #0369a1; font-size: 32px; margin-bottom: 10px;">CERTIFICAT DE RÉALISATION</h1>
          <p style="color: #6b7280;">D'une action de formation professionnelle continue</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p>Je soussigné(e), <strong>{{of.responsable}}</strong>,</p>
          <p>Représentant(e) légal(e) de l'organisme de formation <strong>{{of.nom}}</strong></p>
          <p style="color: #6b7280;">N° de déclaration d'activité : {{of.nda}}</p>
        </div>

        <div style="text-align: center; margin: 40px 0; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px;">Certifie que</p>
          <p style="font-size: 28px; font-weight: bold; color: #0369a1; margin: 20px 0;">{{apprenant.nom_complet}}</p>
          <p>a bien suivi l'action de formation</p>
          <p style="font-size: 22px; font-weight: bold; margin: 20px 0;">{{formation.nom}}</p>
          <p style="color: #6b7280;">{{formation.description}}</p>
        </div>

        <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px;">
          <table style="width: 100%;">
            <tr><td style="padding: 8px 0;"><strong>Durée totale :</strong></td><td>{{formation.duree}}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Du :</strong></td><td>{{dates.debut}}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Au :</strong></td><td>{{dates.fin}}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Lieu :</strong></td><td>{{formation.lieu}}</td></tr>
          </table>
        </div>

        <div style="margin-top: 40px; text-align: right;">
          <p>Fait à {{of.ville}}, le {{dates.aujourdhui}}</p>
          <p style="margin-top: 20px;"><strong>Cachet et signature</strong></p>
          <div style="height: 80px; width: 200px; border: 1px dashed #0369a1; margin-top: 10px; margin-left: auto; border-radius: 4px; background: rgba(255,255,255,0.5);"></div>
        </div>
      </div>
    `,
    convocation: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
        <div style="margin-bottom: 40px;">
          <p><strong>{{of.nom}}</strong></p>
          <p>{{of.adresse}}</p>
          <p>{{of.code_postal}} {{of.ville}}</p>
          <p>Tél : {{of.telephone}}</p>
        </div>

        <div style="text-align: right; margin-bottom: 40px;">
          <p>{{of.ville}}, le {{dates.aujourdhui}}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <p><strong>À l'attention de :</strong></p>
          <p>{{apprenant.nom_complet}}</p>
          <p>{{apprenant.adresse}}</p>
          <p>{{apprenant.code_postal}} {{apprenant.ville}}</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <h1 style="color: #1e40af; font-size: 24px;">CONVOCATION À LA FORMATION</h1>
        </div>

        <p>Madame, Monsieur,</p>
        
        <p style="margin: 20px 0;">Nous avons le plaisir de vous confirmer votre inscription à la formation suivante :</p>

        <div style="margin: 30px 0; padding: 25px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">{{formation.nom}}</h2>
          <p><strong>📅 Date :</strong> Du {{dates.debut}} au {{dates.fin}}</p>
          <p><strong>⏱️ Durée :</strong> {{formation.duree}}</p>
          <p><strong>📍 Lieu :</strong> {{formation.lieu}}</p>
          <p><strong>👨‍🏫 Formateur :</strong> {{formation.formateur}}</p>
        </div>

        <p style="margin: 20px 0;">Nous vous remercions de bien vouloir vous présenter <strong>15 minutes avant le début de la session</strong> muni(e) de cette convocation.</p>

        <p style="margin: 20px 0;">Pour toute question, n'hésitez pas à nous contacter au {{of.telephone}} ou par email à {{of.email}}.</p>

        <p style="margin: 30px 0;">Dans l'attente de vous accueillir, veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.</p>

        <div style="margin-top: 40px;">
          <p><strong>{{of.responsable}}</strong></p>
          <p>Responsable de formation</p>
        </div>
      </div>
    `,
    emargement: `
      <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; font-size: 24px; margin-bottom: 10px;">FEUILLE D'ÉMARGEMENT</h1>
          <p style="color: #6b7280;">{{of.nom}} - N° {{of.nda}}</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <h2 style="margin-bottom: 15px;">{{formation.nom}}</h2>
          <p><strong>Période :</strong> Du {{dates.debut}} au {{dates.fin}}</p>
          <p><strong>Lieu :</strong> {{formation.lieu}}</p>
          <p><strong>Formateur :</strong> {{formation.formateur}}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #1e40af; color: white;">
              <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Nom du stagiaire</th>
              <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: center;">Matin</th>
              <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: center;">Après-midi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 12px;">{{apprenant.nom_complet}}</td>
              <td style="border: 1px solid #e5e7eb; padding: 12px; height: 50px;"></td>
              <td style="border: 1px solid #e5e7eb; padding: 12px; height: 50px;"></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <p><strong>Signature du formateur :</strong></p>
            <div style="height: 60px; width: 180px; border: 1px dashed #d1d5db; margin-top: 10px; border-radius: 4px;"></div>
          </div>
          <div>
            <p><strong>Date :</strong> ___ / ___ / ______</p>
          </div>
        </div>
      </div>
    `,
    programme: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; font-size: 28px;">PROGRAMME DE FORMATION</h1>
          <h2 style="color: #4b5563; font-size: 22px; margin-top: 10px;">{{formation.nom}}</h2>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
          <p><strong>Durée :</strong> {{formation.duree}}</p>
          <p><strong>Public :</strong> Tout public</p>
          <p><strong>Prérequis :</strong> Connaissances de base en développement web</p>
          <p><strong>Modalité :</strong> {{formation.lieu}}</p>
        </div>

        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">OBJECTIFS PÉDAGOGIQUES</h3>
        <ul style="list-style-type: disc; padding-left: 20px; margin: 20px 0;">
          <li>Objectif 1 à personnaliser</li>
          <li>Objectif 2 à personnaliser</li>
          <li>Objectif 3 à personnaliser</li>
        </ul>

        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">CONTENU DE LA FORMATION</h3>
        
        <div style="margin: 20px 0;">
          <h4 style="color: #374151;">Module 1 : Introduction</h4>
          <ul style="list-style-type: circle; padding-left: 20px;">
            <li>Point 1</li>
            <li>Point 2</li>
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <h4 style="color: #374151;">Module 2 : Développement</h4>
          <ul style="list-style-type: circle; padding-left: 20px;">
            <li>Point 1</li>
            <li>Point 2</li>
          </ul>
        </div>

        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">MOYENS PÉDAGOGIQUES</h3>
        <p>Formation en présentiel ou distanciel, supports de cours, exercices pratiques, évaluations.</p>

        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ÉVALUATION</h3>
        <p>Évaluation continue et test final de validation des acquis.</p>

        <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p><strong>{{of.nom}}</strong></p>
          <p>{{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
          <p>Tél : {{of.telephone}} | Email : {{of.email}}</p>
          <p>N° de déclaration d'activité : {{of.nda}}</p>
        </div>
      </div>
    `,
    analyse_besoin: '<p>Modèle d\'analyse du besoin à personnaliser...</p>',
    test_positionnement: '<p>Modèle de test de positionnement à personnaliser...</p>',
    reglement_interieur: '<p>Modèle de règlement intérieur à personnaliser...</p>',
    cgv: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;">
          <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">CONDITIONS GÉNÉRALES DE VENTE</h1>
          <p style="color: #6b7280; font-size: 14px;">Applicables aux prestations de formation professionnelle continue</p>
          <p style="color: #1e40af; font-weight: bold;">{{of.nom}}</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #1e40af;">
          <p><strong>Organisme de formation :</strong> {{of.nom}}</p>
          <p><strong>SIRET :</strong> {{of.siret}}</p>
          <p><strong>N° de déclaration d'activité :</strong> {{of.nda}}</p>
          <p><strong>Adresse :</strong> {{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
          <p><strong>Téléphone :</strong> {{of.telephone}} | <strong>Email :</strong> {{of.email}}</p>
        </div>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 1 - OBJET ET CHAMP D'APPLICATION</h2>
        <p>Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations de formation professionnelle continue dispensées par <strong>{{of.nom}}</strong> auprès des personnes physiques (particuliers) ou morales (entreprises, associations, administrations).</p>
        <p>L'inscription à une formation implique l'acceptation sans réserve des présentes CGV par le client.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 2 - INSCRIPTION ET CONDITIONS D'ACCÈS</h2>
        <p><strong>2.1 Processus d'inscription :</strong> L'inscription est réputée définitive après signature de la convention de formation et réception des pièces demandées.</p>
        <p><strong>2.2 Prérequis :</strong> Le cas échéant, les prérequis sont indiqués dans le programme de formation. L'organisme se réserve le droit de refuser une inscription si les prérequis ne sont pas satisfaits.</p>
        <p><strong>2.3 Délai d'accès :</strong> Les délais d'accès à nos formations varient de 48 heures à 4 semaines selon la formation et les disponibilités.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 3 - TARIFS ET MODALITÉS DE PAIEMENT</h2>
        <p><strong>3.1 Prix :</strong> Les prix sont indiqués en euros et sont nets de taxes (TVA non applicable, article 261.4.4°a du CGI). Les tarifs sont valables au moment de l'inscription et comprennent la formation, les supports pédagogiques et l'accès aux ressources en ligne le cas échéant.</p>
        <p><strong>3.2 Formation concernée :</strong></p>
        <div style="margin: 15px 0; padding: 15px; background: #fef3c7; border-radius: 8px;">
          <p><strong>{{formation.nom}}</strong></p>
          <p>Durée : {{formation.duree}} | Prix : {{formation.prix}}</p>
          <p>Dates : du {{dates.debut}} au {{dates.fin}}</p>
          <p>Lieu : {{formation.lieu}}</p>
        </div>
        <p><strong>3.3 Modalités de paiement :</strong> Le règlement peut s'effectuer par virement bancaire, chèque ou prélèvement. Le paiement est dû à réception de la facture, sauf accord particulier.</p>
        <p><strong>3.4 Financement OPCO/CPF :</strong> En cas de prise en charge par un organisme financeur, l'accord de financement doit parvenir avant le début de la formation. En cas de refus ou prise en charge partielle, le client reste redevable du solde.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 4 - CONDITIONS D'ANNULATION ET DE REPORT</h2>
        <p><strong>4.1 Annulation par le client :</strong></p>
        <ul style="margin-left: 20px;">
          <li>Plus de 15 jours ouvrés avant le début : remboursement intégral ou report sans frais</li>
          <li>Entre 10 et 15 jours ouvrés : 50% du montant restant dû</li>
          <li>Moins de 10 jours ouvrés : 100% du montant restant dû</li>
        </ul>
        <p><strong>4.2 Annulation par l'organisme :</strong> {{of.nom}} se réserve le droit d'annuler ou reporter une formation en cas de force majeure ou si le nombre minimal de participants n'est pas atteint. Dans ce cas, les sommes versées seront intégralement remboursées.</p>
        <p><strong>4.3 Droit de rétractation :</strong> Conformément à l'article L.6353-5 du Code du travail, le stagiaire dispose d'un délai de 10 jours à compter de la signature de la convention pour se rétracter par lettre recommandée avec accusé de réception.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 5 - DÉROULEMENT DE LA FORMATION</h2>
        <p><strong>5.1 Horaires :</strong> Les horaires de formation sont précisés dans la convocation adressée au stagiaire.</p>
        <p><strong>5.2 Assiduité :</strong> Le stagiaire s'engage à suivre l'intégralité de la formation et à signer les feuilles d'émargement. En cas d'absence non justifiée, l'organisme se réserve le droit d'interrompre la formation sans remboursement.</p>
        <p><strong>5.3 Règlement intérieur :</strong> Tout stagiaire s'engage à respecter le règlement intérieur de l'organisme de formation qui lui sera communiqué avant le début de la formation.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 6 - OBLIGATIONS DE L'ORGANISME DE FORMATION</h2>
        <p>{{of.nom}} s'engage à :</p>
        <ul style="margin-left: 20px;">
          <li>Dispenser une formation conforme au programme communiqué</li>
          <li>Mettre à disposition les moyens pédagogiques et techniques nécessaires</li>
          <li>Remettre une attestation de fin de formation</li>
          <li>Répondre aux exigences de qualité (Qualiopi le cas échéant)</li>
        </ul>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 7 - OBLIGATIONS DU STAGIAIRE</h2>
        <p>Le stagiaire s'engage à :</p>
        <ul style="margin-left: 20px;">
          <li>Être présent et ponctuel à toutes les sessions</li>
          <li>Participer activement aux activités proposées</li>
          <li>Réaliser les évaluations et travaux demandés</li>
          <li>Respecter le matériel mis à disposition</li>
          <li>Ne pas perturber le bon déroulement de la formation</li>
        </ul>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 8 - PROPRIÉTÉ INTELLECTUELLE</h2>
        <p>L'ensemble des supports de formation, documents et outils pédagogiques demeurent la propriété exclusive de {{of.nom}}. Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite sans autorisation écrite préalable.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 9 - PROTECTION DES DONNÉES PERSONNELLES</h2>
        <p>Conformément au RGPD et à la loi Informatique et Libertés, {{of.nom}} collecte et traite les données personnelles des stagiaires aux seules fins de gestion administrative et pédagogique des formations. Le stagiaire dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données en contactant : <strong>{{of.email}}</strong></p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 10 - RESPONSABILITÉ</h2>
        <p>La responsabilité de {{of.nom}} ne saurait être engagée en cas de force majeure ou d'événement indépendant de sa volonté. L'organisme ne peut être tenu responsable des dommages indirects résultant de la formation.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 11 - RÉCLAMATIONS</h2>
        <p>Toute réclamation doit être formulée par écrit dans un délai de 30 jours suivant la fin de la formation à l'adresse : {{of.email}}. Une réponse sera apportée dans les 15 jours ouvrés.</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">ARTICLE 12 - DROIT APPLICABLE ET LITIGES</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents du ressort du siège social de {{of.nom}} seront seuls compétents.</p>

        <div style="margin-top: 40px; padding: 25px; background: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">ACCEPTATION DES CONDITIONS GÉNÉRALES DE VENTE</h3>
          <p>Je soussigné(e), <strong>{{apprenant.nom_complet}}</strong>,</p>
          <p>demeurant au {{apprenant.adresse}}, {{apprenant.code_postal}} {{apprenant.ville}},</p>
          <p style="margin-top: 15px;">déclare avoir pris connaissance des présentes Conditions Générales de Vente et les accepte sans réserve.</p>
          
          <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div style="width: 48%;">
              <p><strong>Fait à :</strong> ________________________</p>
              <p style="margin-top: 10px;"><strong>Le :</strong> {{dates.aujourdhui}}</p>
            </div>
            <div style="width: 48%;">
              <p><strong>Signature du client</strong></p>
              <p style="font-size: 12px; color: #6b7280;">(Précédée de la mention "Lu et approuvé")</p>
              <div style="height: 80px; border: 1px dashed #d1d5db; margin-top: 10px; border-radius: 4px;"></div>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>{{of.nom}} - SIRET {{of.siret}} - N° de déclaration d'activité : {{of.nda}}</p>
          <p>{{of.adresse}}, {{of.code_postal}} {{of.ville}} - Tél : {{of.telephone}}</p>
        </div>
      </div>
    `,
    test_niveau: '<p>Modèle de test de niveau à personnaliser...</p>',
    satisfaction_chaud: '<p>Modèle de satisfaction à chaud à personnaliser...</p>',
    satisfaction_froid: '<p>Modèle de satisfaction à froid à personnaliser...</p>',
    questionnaire_financeur: '<p>Modèle de questionnaire financeur à personnaliser...</p>'
  };

  return templates[type] || '<p>Contenu du document...</p>';
}
