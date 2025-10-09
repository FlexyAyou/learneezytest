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
import { useToast } from "@/hooks/use-toast";
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
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
    confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre mot de passe." }),
    userType: z.string().min(1, { message: "Veuillez sélectionner un type de profil." }),
    ageStatus: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMinorError, setShowMinorError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    },
  });

  const userType = watch("userType");
  const ageStatus = watch("ageStatus");

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      // Logique d'inscription ici
      console.log("Inscription:", data);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      navigate("/connexion");
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de la création du compte.",
        variant: "destructive",
      });
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
                {(userType === "instructor" ||
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
                      <input
                        id="terms"
                        type="checkbox"
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        J'accepte les{" "}
                        <Link to="/conditions" className="text-pink-600 hover:underline font-medium">
                          conditions d'utilisation
                        </Link>{" "}
                        et la{" "}
                        <Link to="/confidentialite" className="text-pink-600 hover:underline font-medium">
                          politique de confidentialité
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium">
                      Créer mon compte
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
    </div>
  );
};

export default Register;
