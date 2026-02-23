
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, User, CreditCard, FileText, AlertCircle, Loader2, CheckCircle, BookOpen, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSuperadminRegister, useCreateOFUser, useCourses, useAdminEnrollCourse } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

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
  ofId?: string | number;
}

export const AddApprenantModal = ({ isOpen, onClose, onAdd, organizationName, ofId }: AddApprenantModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const superadminRegister = useSuperadminRegister();
  const createOFUser = useCreateOFUser(ofId?.toString());
  const adminEnroll = useAdminEnrollCourse();

  // Récupérer les cours publiés pour l'assignation optionnelle
  const { data: coursesResponse } = useCourses({ status: 'published' });
  const courses = coursesResponse?.items || [];

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    financementBadges: [] as string[],
    customFields: {} as Record<string, string>,
    documentsToSign: [] as string[],
    selectedCourses: [] as string[]
  });

  const [courseSearch, setCourseSearch] = useState('');

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

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      financementBadges: [],
      customFields: {},
      documentsToSign: [],
      selectedCourses: []
    });
    setCourseSearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim()) {
      toast({
        title: "Champs manquants",
        description: "Le prénom, le nom et l'email sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Validation des champs de financement si nécessaires
    const requiredFields = getRequiredFieldsForSelectedBadges();
    const missingFields = requiredFields.filter(field => !formData.customFields[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires de financement",
        variant: "destructive"
      });
      return;
    }

    // Appel API via useSuperadminRegister ou useCreateOFUser
    try {
      let newUser: any;

      if (ofId) {
        // Mode OF Admin
        newUser = await createOFUser.mutateAsync({
          email: formData.email.trim().toLowerCase(),
          role: 'apprenant', // Role standard OF
          first_name: formData.prenom.trim(),
          last_name: formData.nom.trim(),
          is_major: true,
          accept_terms: true,
          phone: formData.telephone || undefined,
          address: formData.adresse || undefined,
        });
      } else {
        // Mode Superadmin (Platform Direct)
        newUser = await superadminRegister.mutateAsync({
          email: formData.email.trim().toLowerCase(),
          role: 'student',
          first_name: formData.prenom.trim(),
          last_name: formData.nom.trim(),
          is_major: true,
          accept_terms: true,
          of_id: null,
        });
      }

      const createdUserId = newUser.id;

      // Assignation automatique des cours sélectionnés
      if (formData.selectedCourses.length > 0 && createdUserId) {
        toast({
          title: "Assignation des cours...",
          description: `Inscription de l'apprenant à ${formData.selectedCourses.length} cours.`,
        });

        const enrollmentPromises = formData.selectedCourses.map(courseId =>
          adminEnroll.mutateAsync({
            courseId,
            userId: createdUserId
          }).catch(err => {
            console.error(`Erreur d'assignation du cours ${courseId}:`, err);
            return null;
          })
        );

        await Promise.all(enrollmentPromises);
      }

      // Invalider les caches
      if (ofId) {
        queryClient.invalidateQueries({ queryKey: ['of-users', ofId.toString()] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      }

      // Callback parent
      onAdd({
        ...formData,
        id: createdUserId,
        role: ofId ? 'apprenant' : 'student',
        documentsToSign: getRequiredDocumentsForSelectedBadges()
      });

      toast({
        title: "✅ Apprenant créé avec succès",
        description: `${formData.prenom} ${formData.nom} a été ajouté ${ofId ? `à l'organisation ${organizationName || ''}` : 'à la plateforme Learneezy'}.`,
      });

      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'apprenant:', error);
      // L'erreur est gérée par les hooks (toast)
    }
  };

  const isSubmitting = superadminRegister.isPending || createOFUser.isPending || adminEnroll.isPending;

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.description?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {ofId ? `Inscrire un apprenant - ${organizationName || 'Organisation'}` : 'Ajouter un apprenant (Learneezy Direct)'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {ofId
              ? `L'apprenant sera rattaché à votre organisme de formation. Un email d'invitation lui sera envoyé.`
              : `L'apprenant sera affilié directement à la plateforme Learneezy (pas un organisme de formation). Un mot de passe temporaire sera généré automatiquement.`
            }
          </p>
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
                    placeholder="Ex: Jean"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Ex: Dupont"
                    required
                    disabled={isSubmitting}
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
                    placeholder="jean.dupont@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  placeholder="Adresse complète de l'apprenant"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Affiliation / Rôle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Détails du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Badge className={ofId ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}>
                  {ofId ? organizationName || 'Votre Organisation' : 'Learneezy Direct'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {ofId ? "L'utilisateur sera membre de votre organisation." : "Affiliation directe au domaine principal."}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Badge className="bg-green-100 text-green-700">
                  Apprenant
                </Badge>
                <span className="text-sm text-gray-600">
                  Le rôle "Apprenant" sera automatiquement attribué.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sélection des cours (Uniquement pour les OF) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Assignation des cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un cours..."
                  className="pl-9"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="border rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
                {filteredCourses.length === 0 ? (
                  <p className="text-center py-4 text-sm text-muted-foreground">Aucun cours trouvé</p>
                ) : (
                  filteredCourses.map(course => (
                    <div key={course.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={formData.selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            selectedCourses: checked
                              ? [...prev.selectedCourses, course.id]
                              : prev.selectedCourses.filter(id => id !== course.id)
                          }));
                        }}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`course-${course.id}`} className="flex-1 cursor-pointer text-sm font-medium">
                        {course.title}
                      </Label>
                    </div>
                  ))
                )}
              </div>

              {formData.selectedCourses.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-semibold uppercase text-gray-400 w-full mb-1">Sélection :</span>
                  {formData.selectedCourses.map(id => {
                    const course = courses.find(c => c.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                        {course?.title}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            selectedCourses: prev.selectedCourses.filter(cid => cid !== id)
                          }))}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
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
                    className={`cursor-pointer transition-colors ${formData.financementBadges.includes(badge.id) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    style={formData.financementBadges.includes(badge.id) ? { backgroundColor: badge.color } : {}}
                    onClick={() => !isSubmitting && handleBadgeToggle(badge.id)}
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
                  disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Créer l'apprenant
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
