import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

const Login = () => {
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

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await handleLogin(data.email, data.password);
      toast({
        title: "Connexion réussie",
        description: "Redirection vers votre tableau de bord",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-600 via-orange-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">Bon retour parmi nous !</h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Connectez-vous à votre compte et continuez votre parcours d'apprentissage. Accédez à vos cours favoris et
            suivez vos progrès.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Accès instantané à vos cours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Suivi de vos progrès en temps réel</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Certificats et badges de réussite</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">Communauté d'apprenants actifs</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-pink-100">Satisfaction client</span>
              <div className="flex items-center space-x-1">
                <span className="ml-2 font-semibold text-2xl">98%</span>
              </div>
            </div>
            <p className="text-sm text-pink-200">"Une plateforme exceptionnelle qui a transformé ma carrière !"</p>
            <p className="text-xs text-pink-300 mt-2">- Marie, Data Scientist</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img
                src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png"
                alt="Learneezy"
                className="h-24 w-auto"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue ! Connectez-vous à votre compte</h1>
            <p className="text-gray-600">Entrez vos informations pour accéder à votre espace d'apprentissage</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link to="/inscription" className="text-pink-600 hover:text-pink-700 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
