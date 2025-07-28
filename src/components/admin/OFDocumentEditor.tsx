
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, PenTool, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OFDocumentEditorProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OFDocumentEditor: React.FC<OFDocumentEditorProps> = ({ document, isOpen, onClose }) => {
  const [editedDocument, setEditedDocument] = useState(document);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Document sauvegardé",
      description: "Les modifications ont été enregistrées avec succès",
    });
    onClose();
  };

  const handleSignature = (signature: string) => {
    setSignatureData(signature);
    setHasSignature(true);
    toast({
      title: "Signature ajoutée",
      description: "La signature électronique a été ajoutée au document",
    });
  };

  const needsSignature = document?.type === 'convention' || document?.type === 'certificat' || document?.type === 'attestation';

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Modifier le document
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4 mr-2" />
              Édition
            </TabsTrigger>
            <TabsTrigger value="signature" disabled={!needsSignature}>
              <PenTool className="h-4 w-4 mr-2" />
              Signature
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informations du document</span>
                  <Badge variant="outline">{document.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={editedDocument?.title || ''}
                      onChange={(e) => setEditedDocument(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="formation">Formation</Label>
                    <Input
                      id="formation"
                      value={editedDocument?.formation || ''}
                      onChange={(e) => setEditedDocument(prev => ({ ...prev, formation: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="apprenant">Apprenant</Label>
                  <Input
                    id="apprenant"
                    value={editedDocument?.apprenant || ''}
                    onChange={(e) => setEditedDocument(prev => ({ ...prev, apprenant: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    rows={8}
                    value={editedDocument?.content || ''}
                    onChange={(e) => setEditedDocument(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Contenu du document..."
                  />
                </div>

                <div>
                  <Label htmlFor="uniqueCode">Code unique</Label>
                  <Input
                    id="uniqueCode"
                    value={editedDocument?.uniqueCode || ''}
                    onChange={(e) => setEditedDocument(prev => ({ ...prev, uniqueCode: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="h-5 w-5 mr-2" />
                  Signature électronique
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasSignature ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">✓ Signature électronique ajoutée</p>
                      <p className="text-sm text-green-600 mt-1">
                        Le document a été signé électroniquement
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setHasSignature(false)}
                    >
                      Modifier la signature
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Ajoutez une signature électronique à ce document
                    </p>
                    <ElectronicSignature 
                      onSignature={handleSignature}
                      documentId={document.id}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="border-b pb-2">
                    <h2 className="text-xl font-bold">{editedDocument?.title}</h2>
                    <p className="text-gray-600">Formation: {editedDocument?.formation}</p>
                    <p className="text-gray-600">Apprenant: {editedDocument?.apprenant}</p>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{editedDocument?.content}</div>
                  </div>

                  {hasSignature && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 font-medium">Document signé électroniquement</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Code unique: {editedDocument?.uniqueCode}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
