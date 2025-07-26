import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDocumentsOF = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Données mockées
  const documentsOF = [
    {
      id: '1',
      type: 'programme',
      title: 'Programme de formation - Mathématiques',
      isTemplate: true,
      isActive: true,
      fileUrl: '/docs/programme-math.pdf',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'reglement',
      title: 'Règlement intérieur',
      isTemplate: true,
      isActive: true,
      fileUrl: '/docs/reglement.pdf',
      createdAt: '2024-01-10T09:15:00Z',
    },
    {
      id: '3',
      type: 'cgv',
      title: 'Conditions Générales de Vente',
      isTemplate: true,
      isActive: true,
      fileUrl: '/docs/cgv.pdf',
      createdAt: '2024-01-05T14:20:00Z',
    },
    {
      id: '4',
      type: 'convention',
      title: 'Convention de formation - Alice Martin',
      isTemplate: false,
      isActive: true,
      fileUrl: '/docs/convention-alice.pdf',
      createdAt: '2024-01-20T11:45:00Z',
    }
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      'programme': 'Programme',
      'reglement': 'Règlement',
      'cgv': 'CGV',
      'convention': 'Convention',
      'convocation': 'Convocation',
      'attestation': 'Attestation',
      'certificat': 'Certificat'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'programme': 'bg-blue-500',
      'reglement': 'bg-gray-500', 
      'cgv': 'bg-purple-500',
      'convention': 'bg-green-500',
      'convocation': 'bg-orange-500',
      'attestation': 'bg-teal-500',
      'certificat': 'bg-yellow-500'
    };
    return (
      <Badge variant="default" className={colors[type as keyof typeof colors] || 'bg-gray-500'}>
        {getTypeLabel(type)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents OF</h1>
          <p className="text-gray-600">Gérez les templates et documents de votre organisme de formation</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau document</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau template ou document pour votre OF
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type de document</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programme">Programme de formation</SelectItem>
                    <SelectItem value="reglement">Règlement intérieur</SelectItem>
                    <SelectItem value="cgv">Conditions Générales de Vente</SelectItem>
                    <SelectItem value="convention">Convention de formation</SelectItem>
                    <SelectItem value="convocation">Convocation</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                    <SelectItem value="certificat">Certificat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Titre du document</Label>
                <Input id="title" placeholder="Ex: Programme de formation - Mathématiques" />
              </div>
              <div>
                <Label htmlFor="content">Contenu (optionnel)</Label>
                <Textarea 
                  id="content" 
                  placeholder="Contenu du template avec variables {nom_apprenant}, {formation}, etc."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="file">Fichier PDF (optionnel)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Glissez-déposez un fichier PDF ou cliquez pour sélectionner</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  Créer le document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{documentsOF.length}</p>
                <p className="text-sm text-gray-600">Total documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {documentsOF.filter(d => d.isTemplate).length}
                </p>
                <p className="text-sm text-gray-600">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {documentsOF.filter(d => !d.isTemplate).length}
                </p>
                <p className="text-sm text-gray-600">Documents générés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {documentsOF.filter(d => d.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des documents */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des documents</CardTitle>
          <CardDescription>Gérez vos templates et documents générés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsOF.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{getTypeBadge(document.type)}</TableCell>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>
                    {document.isTemplate ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Template</Badge>
                    ) : (
                      <Badge variant="outline">Document</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {document.isActive ? (
                      <Badge variant="default" className="bg-green-500">Actif</Badge>
                    ) : (
                      <Badge variant="outline">Inactif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(document.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDocumentsOF;