import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useToast } from "@/hooks/use-toast";
import { fastAPIClient } from "@/services/fastapi-client";
import { useOrganization } from "@/contexts/OrganizationContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

/**
 * Page de connexion dédiée aux Organismes de Formation
 * Accessible via nomdelof.domaine.com/connexion-of
 */
const LoginOF = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showPassword, setShowPassword, isLoading, handleLogin } = useAuthForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const { organization, isOFContext } = useOrganization();

  const [loginError, setLoginError] = React.useState<string>("");
  const [verificationSuccess, setVerificationSuccess] = React.useState<boolean>(false);
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  // Vérification de l'email au montage si token présent
  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      setIsVerifying(true);
      fastAPIClient
        .verifyEmail(token)
        .then(() => {
          setVerificationSuccess(true);
          toast({
            title: "✅ Email vérifié avec succès !",
            description: "Félicitations, votre compte est actif. Veuillez vous connecter !",
            variant: "default",
          });
          setSearchParams({});
        })
        .catch((error) => {
          console.error("Erreur de vérification:", error);
          toast({
            title: "❌ Erreur de vérification",
            description: "Le lien de vérification est invalide ou a expiré.",
            variant: "destructive",
          });
          setSearchParams({});
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [searchParams, setSearchParams, toast]);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoginError("");
    try {
      await handleLogin(data.email, data.password);
    } catch (error) {
      setLoginError("Votre email ou mot de passe est incorrect!");
    }
  };

  // Récupérer les infos de l'OF
  const ofName = organization?.organizationName || "Organisme de Formation";
  const ofLogo = organization?.logoUrl;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - OF Branding (mêmes couleurs que /connexion) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-600 via-orange-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-12 w-12 text-pink-200" />
            <h2 className="text-4xl font-bold">{ofName}</h2>
          </div>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Bienvenue sur votre espace de formation. Connectez-vous pour accéder à vos parcours d'apprentissage et suivre votre progression.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Formations assignées par votre organisme</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Suivi pédagogique personnalisé</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Contact direct avec votre formateur</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Émargement et attestations en ligne</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-pink-200" />
              <span className="text-pink-100 font-medium">Espace Organisme de Formation</span>
            </div>
            <p className="text-sm text-pink-200">
              Cette plateforme est réservée aux apprenants et personnels de {ofName}.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo OF ou Learneezy */}
          <div className="flex justify-center mb-8">
            {ofLogo ? (
              <img
                src={ofLogo}
                alt={ofName}
                className="h-24 w-auto"
              />
            ) : (
              <div className="flex flex-col items-center">
                <Building2 className="h-16 w-16 text-pink-600 mb-2" />
                <span className="text-xl font-bold text-gray-800">{ofName}</span>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion à votre espace
            </h1>
            <p className="text-gray-600">
              {isOFContext 
                ? `Entrez vos identifiants pour accéder à ${ofName}`
                : "Entrez vos informations pour vous connecter"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isVerifying && (
              <div className="bg-pink-50 border border-pink-200 text-pink-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-pink-700 border-t-transparent rounded-full"></div>
                Vérification de votre email en cours...
              </div>
            )}
            
            {verificationSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Félicitations, votre compte est actif !</p>
                  <p className="text-xs mt-1">Veuillez vous connecter pour accéder à votre espace.</p>
                </div>
              </div>
            )}
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <Link to="/mot-de-passe-oublie" className="text-sm text-pink-600 hover:text-pink-700">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Propulsé par{" "}
              <a href="https://learneezy.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                Learneezy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOF;
