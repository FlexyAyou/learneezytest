import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AdminConventionGenerator = () => {
  const [selectedConvention, setSelectedConvention] = useState<any>(null);
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
    }
  ];

  const handleGenerateConvention = (inscriptionId: string) => {
    toast({
      title: "Convention en cours de génération",
      description: "Le document PDF est en cours de création...",
    });
    // Simulation de génération
    console.log('Generate convention for:', inscriptionId);
  };

  const handlePreviewConvention = (convention: any) => {
    setSelectedConvention(convention);
  };

  const stats = {
    total: generatedConventions.length,
    signed: generatedConventions.filter(c => c.signed).length,
    pending: generatedConventions.filter(c => !c.signed).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Génération de Conventions</h1>
        <p className="text-gray-600">Gestion automatique des conventions de formation avec signature électronique</p>
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
              <FileText className="w-8 h-8 text-green-500" />
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
            <Button variant="outline">
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

      {/* Générateur automatique */}
      <Card>
        <CardHeader>
          <CardTitle>Processus de génération automatique</CardTitle>
          <CardDescription>
            Les conventions sont générées automatiquement lors de la validation des inscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Étapes automatiques :</h4>
            <div className="text-sm space-y-1">
              <p>1. ✅ Inscription validée par l'OF</p>
              <p>2. ✅ Génération automatique de la convention PDF avec les données du stagiaire</p>
              <p>3. ✅ Envoi par email de la convention au stagiaire</p>
              <p>4. ⏳ Signature électronique par le stagiaire</p>
              <p>5. ✅ Archivage sécurisé de la convention signée</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button onClick={() => handleGenerateConvention('test')}>
              <Plus className="w-4 h-4 mr-2" />
              Simuler la génération automatique
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des conventions */}
      <Card>
        <CardHeader>
          <CardTitle>Conventions générées</CardTitle>
          <CardDescription>Suivi de toutes les conventions de formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedConventions.map((convention) => (
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePreviewConvention(convention)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Aperçu de la convention</DialogTitle>
                          <DialogDescription>
                            {convention.studentName} - {convention.courseName}
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
                                <p>Durée : 20 heures<br/>
                                Date de début : 25/01/2024<br/>
                                Modalité : Formation en ligne</p>
                                
                                <p><strong>Article 3 - Prix</strong></p>
                                <p>Le prix de la formation s'élève à 299 € TTC.</p>
                                
                                {selectedConvention.signed && (
                                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="text-green-800">
                                      ✅ Convention signée électroniquement le {new Date(selectedConvention.signedAt).toLocaleString('fr-FR')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button>
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger le PDF
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConventionGenerator;