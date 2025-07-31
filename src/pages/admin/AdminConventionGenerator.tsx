import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Edit, Send, Mail, FileSignature, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const AdminConventionGenerator = () => {
  const [selectedConvention, setSelectedConvention] = useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newConvention, setNewConvention] = useState({
    studentName: '',
    studentEmail: '',
    courseName: '',
    duration: '',
    startDate: '',
    price: ''
  });
  const { toast } = useToast();

  // Données mockées des conventions générées
  const generatedConventions = [
    {
      id: '1',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      inscriptionId: 'ins-001',
      generatedAt: '2024-01-20T10:45:00Z',
      signed: true,
      signedAt: '2024-01-20T11:30:00Z',
      fileUrl: '/conventions/alice-martin-math-ce2.pdf',
      duration: '20 heures',
      startDate: '2024-02-01',
      price: '299'
    },
    {
      id: '2',
      studentName: 'Bob Dupont',
      studentEmail: 'bob.dupont@email.com',
      courseName: 'Français CM1',
      inscriptionId: 'ins-002',
      generatedAt: '2024-01-21T14:20:00Z',
      signed: false,
      signedAt: null,
      fileUrl: '/conventions/bob-dupont-francais-cm1.pdf',
      duration: '25 heures',
      startDate: '2024-02-05',
      price: '349'
    },
    {
      id: '3',
      studentName: 'Claire Rousseau',
      studentEmail: 'claire.rousseau@email.com',
      courseName: 'Anglais 6ème',
      inscriptionId: 'ins-003',
      generatedAt: '2024-01-22T09:15:00Z',
      signed: true,
      signedAt: '2024-01-22T16:45:00Z',
      fileUrl: '/conventions/claire-rousseau-anglais-6eme.pdf',
      duration: '30 heures',
      startDate: '2024-02-10',
      price: '399'
    }
  ];

  const handleGenerateConvention = () => {
    if (!newConvention.studentName || !newConvention.studentEmail || !newConvention.courseName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    console.log('Génération convention:', newConvention);
    toast({
      title: "Convention générée",
      description: `Convention générée avec succès pour ${newConvention.studentName}`,
    });
    
    setShowGenerateDialog(false);
    setNewConvention({
      studentName: '',
      studentEmail: '',
      courseName: '',
      duration: '',
      startDate: '',
      price: ''
    });
  };

  const handlePreviewConvention = (convention: any) => {
    setSelectedConvention(convention);
    setShowPreviewDialog(true);
  };

  const handleEditConvention = (convention: any) => {
    setSelectedConvention(convention);
    setNewConvention({
      studentName: convention.studentName,
      studentEmail: convention.studentEmail,
      courseName: convention.courseName,
      duration: convention.duration,
      startDate: convention.startDate,
      price: convention.price
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    console.log('Sauvegarde modification:', selectedConvention?.id, newConvention);
    toast({
      title: "Convention modifiée",
      description: "Les modifications ont été sauvegardées avec succès.",
    });
    setShowEditDialog(false);
  };

  const handleDownloadConvention = (convention: any) => {
    console.log('Téléchargement convention:', convention);
    toast({
      title: "Téléchargement en cours",
      description: "Le fichier PDF est en cours de téléchargement.",
    });
  };

  const handleSendConvention = (convention: any) => {
    console.log('Envoi convention:', convention);
    toast({
      title: "Convention envoyée",
      description: `Convention envoyée par email à ${convention.studentEmail}`,
    });
  };

  const handleResendConvention = (convention: any) => {
    console.log('Renvoi convention:', convention);
    toast({
      title: "Convention renvoyée",
      description: "La convention a été renvoyée avec succès.",
    });
  };

  const handleEditTemplate = () => {
    setShowTemplateDialog(true);
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template sauvegardé",
      description: "Le template de convention a été mis à jour avec succès.",
    });
    setShowTemplateDialog(false);
  };

  const filteredConventions = generatedConventions.filter(conv => {
    const matchesSearch = conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'signed' && conv.signed) ||
                         (filterStatus === 'pending' && !conv.signed);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: generatedConventions.length,
    signed: generatedConventions.filter(c => c.signed).length,
    pending: generatedConventions.filter(c => !c.signed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Génération de Conventions</h1>
          <p className="text-gray-600">Gestion automatique des conventions de formation avec signature électronique</p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Générer une convention
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Conventions générées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileSignature className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.signed}</p>
                <p className="text-sm text-gray-600">Signées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template de convention */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Template de Convention</CardTitle>
              <CardDescription>
                Modèle utilisé pour générer automatiquement les conventions
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleEditTemplate}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier le template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <h3>CONVENTION DE FORMATION PROFESSIONNELLE</h3>
              <p><strong>Entre :</strong></p>
              <p>L'organisme de formation : <span className="bg-yellow-200">{'{{nom_organisme}}'}</span><br/>
              Adresse : <span className="bg-yellow-200">{'{{adresse_organisme}}'}</span><br/>
              N° de déclaration d'activité : <span className="bg-yellow-200">{'{{numero_declaration}}'}</span></p>
              
              <p><strong>Et :</strong></p>
              <p>Le stagiaire : <span className="bg-yellow-200">{'{{nom_stagiaire}}'}</span><br/>
              Adresse : <span className="bg-yellow-200">{'{{adresse_stagiaire}}'}</span><br/>
              Email : <span className="bg-yellow-200">{'{{email_stagiaire}}'}</span></p>
              
              <p><strong>Article 1 - Objet</strong></p>
              <p>La présente convention a pour objet la formation : <span className="bg-yellow-200">{'{{nom_formation}}'}</span></p>
              
              <p><strong>Article 2 - Durée et modalités</strong></p>
              <p>Durée : <span className="bg-yellow-200">{'{{duree_formation}}'}</span> heures<br/>
              Date de début : <span className="bg-yellow-200">{'{{date_debut}}'}</span><br/>
              Modalité : <span className="bg-yellow-200">{'{{modalite}}'}</span></p>
              
              <p><strong>Article 3 - Prix</strong></p>
              <p>Le prix de la formation s'élève à <span className="bg-yellow-200">{'{{prix_formation}}'}</span> € TTC.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Conventions générées</CardTitle>
          <CardDescription>Suivi de toutes les conventions de formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="signed">Signées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            {filteredConventions.map((convention) => (
              <div key={convention.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{convention.studentName}</h4>
                    <p className="text-sm text-gray-600">{convention.courseName}</p>
                    <p className="text-xs text-gray-500">
                      Générée le {new Date(convention.generatedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {convention.signed ? (
                      <Badge variant="default" className="bg-green-500">
                        Signée le {new Date(convention.signedAt!).toLocaleDateString('fr-FR')}
                      </Badge>
                    ) : (
                      <Badge variant="outline">En attente de signature</Badge>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreviewConvention(convention)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditConvention(convention)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadConvention(convention)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendConvention(convention)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    
                    {!convention.signed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleResendConvention(convention)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour générer une convention */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une nouvelle convention</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour générer automatiquement une convention.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentName">Nom de l'apprenant *</Label>
              <Input
                id="studentName"
                value={newConvention.studentName}
                onChange={(e) => setNewConvention({...newConvention, studentName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="studentEmail">Email de l'apprenant *</Label>
              <Input
                id="studentEmail"
                type="email"
                value={newConvention.studentEmail}
                onChange={(e) => setNewConvention({...newConvention, studentEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="courseName">Formation *</Label>
              <Select value={newConvention.courseName} onValueChange={(value) => setNewConvention({...newConvention, courseName: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathématiques CE2">Mathématiques CE2</SelectItem>
                  <SelectItem value="Français CM1">Français CM1</SelectItem>
                  <SelectItem value="Anglais 6ème">Anglais 6ème</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  value={newConvention.duration}
                  onChange={(e) => setNewConvention({...newConvention, duration: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  value={newConvention.price}
                  onChange={(e) => setNewConvention({...newConvention, price: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={newConvention.startDate}
                onChange={(e) => setNewConvention({...newConvention, startDate: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleGenerateConvention}>
                Générer la convention
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour prévisualiser */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de la convention</DialogTitle>
            <DialogDescription>
              {selectedConvention?.studentName} - {selectedConvention?.courseName}
            </DialogDescription>
          </DialogHeader>
          {selectedConvention && (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-center">CONVENTION DE FORMATION PROFESSIONNELLE</h3>
                  
                  <p><strong>Entre :</strong></p>
                  <p>L'organisme de formation : Mon Organisme de Formation<br/>
                  Adresse : 123 Rue de l'Éducation, 75001 Paris<br/>
                  N° de déclaration d'activité : 11 75 12345 75</p>
                  
                  <p><strong>Et :</strong></p>
                  <p>Le stagiaire : {selectedConvention.studentName}<br/>
                  Email : {selectedConvention.studentEmail}</p>
                  
                  <p><strong>Article 1 - Objet</strong></p>
                  <p>La présente convention a pour objet la formation : {selectedConvention.courseName}</p>
                  
                  <p><strong>Article 2 - Durée et modalités</strong></p>
                  <p>Durée : {selectedConvention.duration}<br/>
                  Date de début : {selectedConvention.startDate}<br/>
                  Modalité : Formation en ligne</p>
                  
                  <p><strong>Article 3 - Prix</strong></p>
                  <p>Le prix de la formation s'élève à {selectedConvention.price} € TTC.</p>
                  
                  {selectedConvention.signed && (
                    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800">
                        ✅ Convention signée électroniquement le {new Date(selectedConvention.signedAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadConvention(selectedConvention)}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le PDF
                </Button>
                <Button onClick={() => handleSendConvention(selectedConvention)}>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer par email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la convention</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editStudentName">Nom de l'apprenant</Label>
              <Input
                id="editStudentName"
                value={newConvention.studentName}
                onChange={(e) => setNewConvention({...newConvention, studentName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editStudentEmail">Email de l'apprenant</Label>
              <Input
                id="editStudentEmail"
                type="email"
                value={newConvention.studentEmail}
                onChange={(e) => setNewConvention({...newConvention, studentEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editCourseName">Formation</Label>
              <Input
                id="editCourseName"
                value={newConvention.courseName}
                onChange={(e) => setNewConvention({...newConvention, courseName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDuration">Durée</Label>
                <Input
                  id="editDuration"
                  value={newConvention.duration}
                  onChange={(e) => setNewConvention({...newConvention, duration: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editPrice">Prix (€)</Label>
                <Input
                  id="editPrice"
                  value={newConvention.price}
                  onChange={(e) => setNewConvention({...newConvention, price: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editStartDate">Date de début</Label>
              <Input
                id="editStartDate"
                type="date"
                value={newConvention.startDate}
                onChange={(e) => setNewConvention({...newConvention, startDate: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer le template */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Modifier le template de convention</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Contenu du template..."
              rows={20}
              defaultValue={`CONVENTION DE FORMATION PROFESSIONNELLE

Entre :
L'organisme de formation : {{nom_organisme}}
Adresse : {{adresse_organisme}}
N° de déclaration d'activité : {{numero_declaration}}

Et :
Le stagiaire : {{nom_stagiaire}}
Adresse : {{adresse_stagiaire}}
Email : {{email_stagiaire}}

Article 1 - Objet
La présente convention a pour objet la formation : {{nom_formation}}

Article 2 - Durée et modalités
Durée : {{duree_formation}} heures
Date de début : {{date_debut}}
Modalité : {{modalite}}

Article 3 - Prix
Le prix de la formation s'élève à {{prix_formation}} € TTC.`}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveTemplate}>
                Sauvegarder le template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConventionGenerator;
