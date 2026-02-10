import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuthForm } from "@/hooks/useAuthForm";
import { UserRole } from "@/types/fastapi";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Star,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "Le prénom est requis." }),
    lastName: z.string().min(1, { message: "Le nom est requis." }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre mot de passe." }),
    userType: z.string().min(1, { message: "Veuillez sélectionner un type de profil." }),
    ageStatus: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMinorError, setShowMinorError] = useState(false);
  const [showCGVDialog, setShowCGVDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleRegister, isLoading } = useAuthForm();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      ageStatus: "",
      acceptTerms: false,
    },
  });

  // Mapping des rôles frontend -> backend
  const roleMapping: Record<string, UserRole> = {
    student: 'student',
    tutor: 'tutor',
    independant_trainer: 'independent_trainer',
  };

  const userType = watch("userType");
  const ageStatus = watch("ageStatus");

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      // Calculer is_major depuis ageStatus
      const isMajor = data.userType === 'student' ? data.ageStatus === 'adult' : undefined;
      
      // Construire le payload pour FastAPI
      const userData = {
        email: data.email,
        password: data.password,
        role: roleMapping[data.userType],
        first_name: data.firstName,
        last_name: data.lastName,
        is_major: isMajor,
        accept_terms: data.acceptTerms,
        of_id: null, // Utilisateur Learneezy global
        accessible_catalogues: [],
      };

      await handleRegister(userData);
      navigate("/connexion");
    } catch (error) {
      // L'erreur est déjà gérée par handleRegister
      console.error("Erreur d'inscription:", error);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setValue("userType", value);
    setShowMinorError(false);
  };

  const handleAgeStatusChange = (value: string) => {
    setValue("ageStatus", value);
    setShowMinorError(value === "minor");
  };

  const benefits = [
    "Accès illimité à tous les cours",
    "Support communautaire actif",
    "Certificats de completion",
    "Suivi de progression avancé",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-pink-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">Commencez votre parcours d'apprentissage</h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Créez votre compte et accédez à des milliers de cours de qualité professionnelle. Développez vos compétences
            avec les meilleurs instructeurs.
          </p>

          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-pink-200" />
                <span className="text-pink-100">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-pink-100">Note moyenne</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">4.9</span>
              </div>
            </div>
            <p className="text-sm text-pink-200">
              "Les meilleurs cours en ligne que j'ai jamais suivis. Très recommandé !"
            </p>
            <p className="text-xs text-pink-300 mt-2">- Sarah, Développeuse Web</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png"
                alt="Learneezy"
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-gray-600 mt-2">Créez votre compte et commencez à apprendre</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-gray-900">Créer un compte</CardTitle>
              <CardDescription>Rejoignez notre communauté d'apprentissage dès aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Choix du type de profil */}
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                    Type de profil
                  </Label>
                  <Select value={userType} onValueChange={handleUserTypeChange}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                      <SelectValue placeholder="Choisissez votre profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>Profil Apprenant</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tutor">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Profil Tuteur</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="independant_trainer">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Profil formateur</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>}

                  {/* Alerte informative pour les apprenants OF */}
                  {userType === "student" && (
                    <Alert className="border-amber-200 bg-amber-50 mt-3">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        <strong>Ce compte est pour les apprenants indépendants Learneezy.</strong>
                        <br />
                        Si vous êtes rattaché à un organisme de formation, c'est votre OF qui créera votre compte. Contactez votre organisme.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Champ spécifique pour les étudiants : statut d'âge */}
                {userType === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="ageStatus" className="text-sm font-medium text-gray-700">
                      Êtes-vous majeur ?
                    </Label>
                    <Select value={ageStatus} onValueChange={handleAgeStatusChange}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="Sélectionnez votre statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adult">Oui, je suis majeur</SelectItem>
                        <SelectItem value="minor">Non, je suis mineur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Message d'erreur pour les mineurs */}
                {showMinorError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Vous êtes mineur.</strong> C'est votre parent ou représentant légal qui doit créer un
                      compte à votre place.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Informations personnelles - affichées pour les profils valides */}
                {(userType === "independant_trainer" ||
                  userType === "tutor" ||
                  (userType === "student" && ageStatus === "adult")) && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          Prénom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Prénom"
                            className="pl-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            {...registerField("firstName")}
                          />
                        </div>
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Nom"
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...registerField("lastName")}
                        />
                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Adresse email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...registerField("email")}
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...registerField("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...registerField("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Conditions d'utilisation et bouton de soumission */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={watch("acceptTerms")}
                        onCheckedChange={(checked) => setValue("acceptTerms", !!checked)}
                      />
                      <div className="text-sm text-gray-600">
                        <Label htmlFor="terms" className="inline">J'accepte les </Label>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowCGVDialog(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowCGVDialog(true);
                            }
                          }}
                          className="text-pink-600 hover:underline font-medium cursor-pointer"
                        >
                          conditions d'utilisation
                        </span>
                        <span> et la </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPrivacyDialog(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowPrivacyDialog(true);
                            }
                          }}
                          className="text-pink-600 hover:underline font-medium cursor-pointer"
                        >
                          politique de confidentialité
                        </span>
                      </div>
                    </div>
                    {errors.acceptTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Création en cours..." : "Créer mon compte"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/connexion" className="text-pink-600 hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Base légale du traitement</h3>
                <p className="text-gray-700 mb-2">Le traitement de vos données repose sur :</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>L'exécution du contrat :</strong> pour la gestion de votre formation</li>
                  <li><strong>Une obligation légale :</strong> pour le respect des obligations de déclaration</li>
                  <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Vos droits</h3>
                <p className="text-gray-700 mb-2">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Pour exercer vos droits, contactez-nous à : dpo@learneezy.com
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

export default Register;
