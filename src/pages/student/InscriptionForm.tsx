import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { FileText, CheckCircle, Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const inscriptionSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'Adresse complète requise'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(5, 'Code postal requis'),
  courseId: z.string().min(1, 'Veuillez sélectionner une formation'),
  motivations: z.string().optional(),
  hasHandicap: z.boolean().default(false),
  handicapDetails: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
  acceptReglement: z.boolean().refine(val => val === true, 'Vous devez accepter le règlement'),
  acceptData: z.boolean().refine(val => val === true, 'Vous devez accepter le traitement des données'),
});

type InscriptionForm = z.infer<typeof inscriptionSchema>;

const InscriptionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCGVDialog, setShowCGVDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<InscriptionForm>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      hasHandicap: false,
      acceptTerms: false,
      acceptReglement: false,
      acceptData: false,
    }
  });

  const availableCourses = [
    { id: 'math-ce2', name: 'Mathématiques CE2', price: 299 },
    { id: 'francais-cm1', name: 'Français CM1', price: 329 },
    { id: 'anglais-6eme', name: 'Anglais 6ème', price: 279 },
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature);
    toast({
      title: "Signature enregistrée",
      description: "Votre signature électronique a été sauvegardée.",
    });
  };

  const onSubmit = async (data: InscriptionForm) => {
    if (currentStep < 4) {
      // Si on n'est pas à la dernière étape, aller à l'étape suivante
      handleNextStep();
      return;
    }
    
    if (!signatureData) {
      toast({
        title: "Signature requise",
        description: "Veuillez signer électroniquement avant de finaliser.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulation de soumission finale
    console.log('Données d\'inscription:', data);
    console.log('Signature:', signatureData);
    
    setIsSubmitted(true);
    toast({
      title: "Inscription envoyée !",
      description: "Votre demande d'inscription a été transmise pour validation.",
    });
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Inscription soumise avec succès !</h2>
          <p className="text-gray-600 mb-6">
            Votre demande d'inscription a été transmise à notre équipe pédagogique. 
            Vous recevrez un email de confirmation dans les plus brefs délais.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Prochaines étapes :</h3>
              <ul className="text-sm space-y-1 text-left">
                <li>✓ Vérification de votre dossier (24-48h)</li>
                <li>✓ Envoi de la convention de formation par email</li>
                <li>✓ Réception des documents (programme, règlement, CGV)</li>
                <li>✓ Accès à votre espace de formation</li>
              </ul>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Vérifier mes emails
              </Button>
              <Button>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/learneezy-white-logo.png" 
              alt="Learneezy Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-center">Formulaire d'inscription</CardTitle>
          <CardDescription className="text-center">
            Inscription avec signature électronique intégrée
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStepIndicator()}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Étape 1: Informations personnelles */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informations personnelles</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      {...form.register('firstName')}
                      placeholder="Votre prénom"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      placeholder="Votre nom"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="votre.email@exemple.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder="06 12 34 56 78"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="123 rue de la Paix"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      {...form.register('city')}
                      placeholder="Paris"
                    />
                    {form.formState.errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      {...form.register('postalCode')}
                      placeholder="75001"
                    />
                    {form.formState.errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Suivant
                  </Button>
                </div>
              </div>
            )}
            
            {/* Étape 2: Choix de formation */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choix de la formation</h3>
                
                <div>
                  <Label htmlFor="course">Formation souhaitée *</Label>
                  <Select onValueChange={(value) => form.setValue('courseId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{course.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {course.price}€
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.courseId && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.courseId.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="motivations">Motivations (optionnel)</Label>
                  <Textarea
                    id="motivations"
                    {...form.register('motivations')}
                    placeholder="Décrivez vos motivations pour suivre cette formation..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="hasHandicap"
                      checked={form.watch('hasHandicap')}
                      onCheckedChange={(checked) => 
                        form.setValue('hasHandicap', checked as boolean)
                      }
                    />
                    <div>
                      <Label htmlFor="hasHandicap" className="text-sm">
                        Je suis en situation de handicap
                      </Label>
                      <p className="text-xs text-gray-500">
                        Cochez cette case si vous souhaitez bénéficier d'aménagements
                      </p>
                    </div>
                  </div>
                  
                  {form.watch('hasHandicap') && (
                    <div>
                      <Label htmlFor="handicapDetails">Détails du handicap</Label>
                      <Textarea
                        id="handicapDetails"
                        {...form.register('handicapDetails')}
                        placeholder="Décrivez les aménagements dont vous auriez besoin..."
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Précédent
                  </Button>
                  <Button type="submit">
                    Suivant
                  </Button>
                </div>
              </div>
            )}
            
            {/* Étape 3: Documents et conditions */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents et conditions</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Documents à consulter</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Programme de formation</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Règlement intérieur</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conditions Générales de Vente</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={form.watch('acceptTerms')}
                        onCheckedChange={(checked) => 
                          form.setValue('acceptTerms', checked as boolean)
                        }
                      />
                      <Label htmlFor="acceptTerms" className="text-sm">
                        J'accepte les{' '}
                        <button
                          type="button"
                          onClick={() => setShowCGVDialog(true)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          conditions générales de vente
                        </button>{' '}
                        *
                      </Label>
                    </div>
                    {form.formState.errors.acceptTerms && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.acceptTerms.message}
                      </p>
                    )}
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptReglement"
                        checked={form.watch('acceptReglement')}
                        onCheckedChange={(checked) => 
                          form.setValue('acceptReglement', checked as boolean)
                        }
                      />
                      <Label htmlFor="acceptReglement" className="text-sm">
                        J'accepte le règlement intérieur *
                      </Label>
                    </div>
                    {form.formState.errors.acceptReglement && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.acceptReglement.message}
                      </p>
                    )}
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptData"
                        checked={form.watch('acceptData')}
                        onCheckedChange={(checked) => 
                          form.setValue('acceptData', checked as boolean)
                        }
                      />
                      <Label htmlFor="acceptData" className="text-sm">
                        J'accepte le traitement de mes données personnelles conformément à la{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyDialog(true)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          politique de confidentialité
                        </button>{' '}
                        *
                      </Label>
                    </div>
                    {form.formState.errors.acceptData && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.acceptData.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Précédent
                  </Button>
                  <Button type="submit">
                    Suivant
                  </Button>
                </div>
              </div>
            )}
            
            {/* Étape 4: Signature électronique */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Signature électronique</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Récapitulatif de votre inscription</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Nom:</strong> {form.watch('firstName')} {form.watch('lastName')}</p>
                    <p><strong>Email:</strong> {form.watch('email')}</p>
                    <p><strong>Formation:</strong> {availableCourses.find(c => c.id === form.watch('courseId'))?.name}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium">
                    Signature électronique *
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    En signant ci-dessous, je certifie l'exactitude des informations fournies 
                    et confirme mon inscription à la formation sélectionnée.
                  </p>
                  
                  <ElectronicSignature 
                    onSignatureComplete={handleSignatureComplete}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Précédent
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!signatureData}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Finaliser l'inscription
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Dialog CGV */}
      <Dialog open={showCGVDialog} onOpenChange={setShowCGVDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Conditions Générales de Vente</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">Article 1 - Objet</h3>
                <p className="text-gray-700">
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Learneezy, 
                  organisme de formation professionnelle, et toute personne physique ou morale souhaitant bénéficier des 
                  formations proposées.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 2 - Inscription</h3>
                <p className="text-gray-700 mb-2">
                  L'inscription à une formation est considérée comme définitive après :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Réception du formulaire d'inscription complété et signé</li>
                  <li>Validation du dossier par notre équipe pédagogique</li>
                  <li>Réception du règlement ou signature de la convention de formation</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 3 - Tarifs</h3>
                <p className="text-gray-700">
                  Les tarifs de nos formations sont indiqués en euros TTC. Ils sont valables pour la durée mentionnée 
                  sur le programme de formation. Learneezy se réserve le droit de modifier ses tarifs à tout moment, 
                  les formations étant facturées sur la base des tarifs en vigueur au moment de l'inscription.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 4 - Modalités de paiement</h3>
                <p className="text-gray-700 mb-2">Le règlement peut s'effectuer par :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Virement bancaire</li>
                  <li>Carte bancaire</li>
                  <li>Chèque à l'ordre de Learneezy</li>
                  <li>Prise en charge par un organisme (OPCO, Pôle Emploi, etc.)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 5 - Annulation et report</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Par le client :</strong> Toute annulation doit être notifiée par écrit. 
                  En cas d'annulation plus de 30 jours avant le début de la formation, le montant versé est remboursé 
                  à 100% (hors frais de dossier de 50€). Entre 30 et 15 jours, 50% du montant reste acquis. 
                  Moins de 15 jours avant le début, aucun remboursement ne sera effectué.
                </p>
                <p className="text-gray-700">
                  <strong>Par Learneezy :</strong> En cas d'annulation d'une session par Learneezy, 
                  le client sera informé dans les plus brefs délais et pourra choisir entre un report sur une session 
                  ultérieure ou le remboursement intégral des sommes versées.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 6 - Propriété intellectuelle</h3>
                <p className="text-gray-700">
                  Tous les supports pédagogiques remis lors des formations sont la propriété exclusive de Learneezy. 
                  Toute reproduction, distribution ou utilisation commerciale sans autorisation expresse est strictement interdite.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 7 - Responsabilité</h3>
                <p className="text-gray-700">
                  Learneezy s'engage à mettre en œuvre tous les moyens nécessaires pour assurer des formations de qualité. 
                  Toutefois, la responsabilité de Learneezy ne saurait être engagée en cas de force majeure ou d'événements 
                  indépendants de sa volonté empêchant la bonne exécution de la prestation.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 8 - Règlement des litiges</h3>
                <p className="text-gray-700">
                  En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le litige sera soumis 
                  aux tribunaux compétents selon la législation française en vigueur.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">Article 9 - Données personnelles</h3>
                <p className="text-gray-700">
                  Les données personnelles collectées sont nécessaires à la gestion administrative et pédagogique 
                  des formations. Elles font l'objet d'un traitement informatique conforme au RGPD. 
                  Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant 
                  notre service administratif.
                </p>
              </section>

              <div className="mt-6 pt-4 border-t">
                <p className="text-gray-600 text-xs italic">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowCGVDialog(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Politique de confidentialité */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Politique de Confidentialité</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Introduction</h3>
                <p className="text-gray-700">
                  Learneezy accorde une grande importance à la protection de vos données personnelles. 
                  Cette politique de confidentialité a pour objectif de vous informer sur la manière dont nous 
                  collectons, utilisons, partageons et protégeons vos informations personnelles dans le cadre 
                  de nos services de formation.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Responsable du traitement</h3>
                <p className="text-gray-700">
                  Le responsable du traitement des données est Learneezy, organisme de formation enregistré 
                  sous le numéro de déclaration d'activité [numéro] auprès du préfet de région [région].
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Données collectées</h3>
                <p className="text-gray-700 mb-2">Nous collectons les données suivantes :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Données d'identification :</strong> nom, prénom, date de naissance, adresse postale</li>
                  <li><strong>Données de contact :</strong> adresse email, numéro de téléphone</li>
                  <li><strong>Données relatives à la formation :</strong> formations suivies, résultats, attestations</li>
                  <li><strong>Données de connexion :</strong> logs de connexion, adresse IP, données de navigation</li>
                  <li><strong>Données financières :</strong> informations de paiement (via prestataire sécurisé)</li>
                  <li><strong>Données relatives au handicap :</strong> uniquement si vous choisissez de nous en informer 
                  pour bénéficier d'aménagements</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Finalités du traitement</h3>
                <p className="text-gray-700 mb-2">Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Gérer votre inscription et votre participation aux formations</li>
                  <li>Assurer le suivi pédagogique et administratif</li>
                  <li>Délivrer les attestations et certificats</li>
                  <li>Gérer la facturation et les paiements</li>
                  <li>Répondre à vos demandes et réclamations</li>
                  <li>Améliorer nos services et personnaliser votre expérience</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                  <li>Vous informer de nos actualités et nouvelles formations (avec votre consentement)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Base légale du traitement</h3>
                <p className="text-gray-700 mb-2">Le traitement de vos données repose sur :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>L'exécution du contrat :</strong> pour la gestion de votre formation</li>
                  <li><strong>Une obligation légale :</strong> pour le respect des obligations de déclaration d'activité 
                  et de conservation des documents</li>
                  <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing</li>
                  <li><strong>Notre intérêt légitime :</strong> pour l'amélioration de nos services</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Destinataires des données</h3>
                <p className="text-gray-700 mb-2">Vos données peuvent être transmises à :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Nos formateurs et personnel pédagogique</li>
                  <li>Nos prestataires techniques (hébergement, paiement, emailing)</li>
                  <li>Les organismes financeurs (OPCO, Pôle Emploi, etc.) le cas échéant</li>
                  <li>Les autorités compétentes en cas d'obligation légale</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Durée de conservation</h3>
                <p className="text-gray-700">
                  Vos données sont conservées pendant la durée nécessaire à l'accomplissement des finalités 
                  pour lesquelles elles ont été collectées, conformément aux obligations légales :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>Données administratives : 5 ans après la fin de la formation</li>
                  <li>Données financières : 10 ans conformément à la législation comptable</li>
                  <li>Données de connexion : 1 an</li>
                  <li>Données marketing : jusqu'à votre désinscription ou 3 ans sans activité</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">8. Vos droits</h3>
                <p className="text-gray-700 mb-2">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation :</strong> limiter le traitement dans certains cas</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement pour des raisons légitimes</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Pour exercer vos droits, contactez-nous à : dpo@learneezy.com ou par courrier à notre adresse.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">9. Sécurité des données</h3>
                <p className="text-gray-700">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
                  vos données contre tout accès, modification, divulgation ou destruction non autorisés. 
                  Cela inclut le chiffrement, les contrôles d'accès, et la formation de notre personnel.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">10. Cookies</h3>
                <p className="text-gray-700">
                  Notre plateforme utilise des cookies pour améliorer votre expérience. Vous pouvez gérer 
                  vos préférences de cookies via les paramètres de votre navigateur ou notre bandeau cookies.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">11. Modifications</h3>
                <p className="text-gray-700">
                  Cette politique de confidentialité peut être mise à jour. La version en vigueur est toujours 
                  disponible sur notre site avec sa date de dernière modification.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">12. Réclamation</h3>
                <p className="text-gray-700">
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
                  auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr
                </p>
              </section>

              <div className="mt-6 pt-4 border-t">
                <p className="text-gray-600 text-xs italic">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPrivacyDialog(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InscriptionForm;