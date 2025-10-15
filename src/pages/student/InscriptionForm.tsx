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
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-green-600" />
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Inscription enregistrée !</h2>
          
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <p className="text-lg font-semibold text-blue-900 mb-2">
              📧 Un email de confirmation vous a été envoyé
            </p>
            <p className="text-sm text-blue-700">
              Veuillez consulter votre boîte de réception pour confirmer votre inscription. 
              Pensez à vérifier vos spams si vous ne le voyez pas.
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Votre demande d'inscription a été transmise à notre équipe pédagogique. 
            Après validation de votre email, vous recevrez les prochaines étapes.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-left">Prochaines étapes :</h3>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Confirmez votre email en cliquant sur le lien reçu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Vérification de votre dossier (24-48h)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Envoi de la convention de formation par email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Réception des documents (programme, règlement, CGV)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Accès à votre espace de formation</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="default" onClick={() => window.location.href = 'mailto:'}>
                <Mail className="w-4 h-4 mr-2" />
                Ouvrir ma messagerie
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
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
                        J'accepte les conditions générales de vente *
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
                        J'accepte le traitement de mes données personnelles *
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
    </div>
  );
};

export default InscriptionForm;