
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, User, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinancementBadge {
  id: string;
  name: string;
  color: string;
  requiredFields: string[];
  requiredDocuments: string[];
  isCustom: boolean;
}

interface AddApprenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (apprenant: any) => void;
  organizationName?: string;
}

export const AddApprenantModal = ({ isOpen, onClose, onAdd, organizationName }: AddApprenantModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    formation: '',
    organismeId: 'learneezy',
    financementBadges: [] as string[],
    customFields: {} as Record<string, string>,
    documentsToSign: [] as string[]
  });

  const [showCustomBadgeForm, setShowCustomBadgeForm] = useState(false);
  const [customBadge, setCustomBadge] = useState({
    name: '',
    color: '#3B82F6',
    requiredFields: [''],
    requiredDocuments: ['']
  });

  const defaultBadges: FinancementBadge[] = [
    {
      id: 'opco',
      name: 'OPCO',
      color: '#10B981',
      requiredFields: ['numeroOpco', 'brancheActivite', 'entrepriseRattachement'],
      requiredDocuments: ['attestation_employeur', 'contrat_travail'],
      isCustom: false
    },
    {
      id: 'faf',
      name: 'FAF',
      color: '#8B5CF6',
      requiredFields: ['numeroFaf', 'categorieActivite', 'siretEntreprise'],
      requiredDocuments: ['attestation_faf', 'justificatif_activite'],
      isCustom: false
    },
    {
      id: 'financement_personnel',
      name: 'Financement Personnel',
      color: '#F59E0B',
      requiredFields: ['modalitePaiement', 'echeancier'],
      requiredDocuments: ['devis_signe', 'conditions_generales'],
      isCustom: false
    },
    {
      id: 'cpf',
      name: 'CPF',
      color: '#EF4444',
      requiredFields: ['numeroCpf', 'droitsDisponibles', 'resteACharge'],
      requiredDocuments: ['attestation_honneur', 'justificatif_cpf'],
      isCustom: false
    },
    {
      id: 'odpc',
      name: 'ODPC',
      color: '#06B6D4',
      requiredFields: ['numeroOdpc', 'specialiteMedicale', 'numeroRpps'],
      requiredDocuments: ['attestation_odpc', 'justificatif_rpps'],
      isCustom: false
    }
  ];

  const [badges, setBadges] = useState<FinancementBadge[]>(defaultBadges);

  const organismes = [
    { id: '1', name: 'Centre de Formation Digital' },
    { id: '2', name: 'Institut TechnoPlus' },
    { id: '3', name: 'Formation Pro Marseille' }
  ];

  const formations = [
    'Développement Web',
    'Marketing Digital',
    'Gestion de Projet',
    'Comptabilité',
    'Ressources Humaines'
  ];

  const handleBadgeToggle = (badgeId: string) => {
    const updatedBadges = formData.financementBadges.includes(badgeId)
      ? formData.financementBadges.filter(id => id !== badgeId)
      : [...formData.financementBadges, badgeId];
    
    setFormData(prev => ({
      ...prev,
      financementBadges: updatedBadges
    }));
  };

  const addCustomBadge = () => {
    if (!customBadge.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du badge est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const newBadge: FinancementBadge = {
      id: `custom_${Date.now()}`,
      name: customBadge.name,
      color: customBadge.color,
      requiredFields: customBadge.requiredFields.filter(field => field.trim()),
      requiredDocuments: customBadge.requiredDocuments.filter(doc => doc.trim()),
      isCustom: true
    };

    setBadges(prev => [...prev, newBadge]);
    setCustomBadge({
      name: '',
      color: '#3B82F6',
      requiredFields: [''],
      requiredDocuments: ['']
    });
    setShowCustomBadgeForm(false);

    toast({
      title: "Badge créé",
      description: "Le badge personnalisé a été ajouté avec succès"
    });
  };

  const getRequiredFieldsForSelectedBadges = () => {
    return badges
      .filter(badge => formData.financementBadges.includes(badge.id))
      .flatMap(badge => badge.requiredFields);
  };

  const getRequiredDocumentsForSelectedBadges = () => {
    return badges
      .filter(badge => formData.financementBadges.includes(badge.id))
      .flatMap(badge => badge.requiredDocuments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = getRequiredFieldsForSelectedBadges();
    const missingFields = requiredFields.filter(field => !formData.customFields[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newApprenant = {
      ...formData,
      id: Date.now().toString(),
      status: 'pending',
      progression: 0,
      createdAt: new Date().toISOString(),
      documentsToSign: getRequiredDocumentsForSelectedBadges()
    };

    onAdd(newApprenant);
    
    // Reset form
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      formation: '',
      organismeId: 'learneezy',
      financementBadges: [],
      customFields: {},
      documentsToSign: []
    });

    toast({
      title: "Apprenant ajouté",
      description: "L'apprenant a été créé avec succès"
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Ajouter un apprenant
          </DialogTitle>
          <DialogDescription>Renseignez les informations et les badges de financement de l'apprenant.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Formation et organisme */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="organisme">Organisme de formation</Label>
                <Input
                  id="organisme"
                  value={organizationName || 'Learneezy'}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="formation">Formation</Label>
                <Select value={formData.formation} onValueChange={(value) => setFormData(prev => ({ ...prev, formation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map((formation) => (
                      <SelectItem key={formation} value={formation}>
                        {formation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Badges de financement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Financement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={formData.financementBadges.includes(badge.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      formData.financementBadges.includes(badge.id) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    style={formData.financementBadges.includes(badge.id) ? { backgroundColor: badge.color } : {}}
                    onClick={() => handleBadgeToggle(badge.id)}
                  >
                    {badge.name}
                    {badge.isCustom && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
              </div>

              {!showCustomBadgeForm ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomBadgeForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un badge personnalisé
                </Button>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Nouveau badge</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomBadgeForm(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Nom du badge</Label>
                        <Input
                          value={customBadge.name}
                          onChange={(e) => setCustomBadge(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Pôle Emploi"
                        />
                      </div>
                      <div>
                        <Label>Couleur</Label>
                        <Input
                          type="color"
                          value={customBadge.color}
                          onChange={(e) => setCustomBadge(prev => ({ ...prev, color: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={addCustomBadge} size="sm">
                      Ajouter le badge
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Champs spécifiques au financement */}
          {getRequiredFieldsForSelectedBadges().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Informations complémentaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getRequiredFieldsForSelectedBadges().map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').toLowerCase()} *</Label>
                    <Input
                      id={field}
                      value={formData.customFields[field] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: { ...prev.customFields, [field]: e.target.value }
                      }))}
                      required
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Documents à signer */}
          {getRequiredDocumentsForSelectedBadges().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documents à faire signer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getRequiredDocumentsForSelectedBadges().map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox checked disabled />
                      <span className="text-sm">{doc.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Ces documents devront être signés par l'apprenant lors de son inscription.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'apprenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
