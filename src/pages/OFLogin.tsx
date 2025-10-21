import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useSubdomain } from '@/hooks/useSubdomain';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const OFLogin = () => {
  const { ofSlug } = useSubdomain();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [ofExists, setOfExists] = useState<boolean | null>(null);
  const [ofName, setOfName] = useState<string>('');
  
  const { handleLogin, isSubmitting } = useAuthForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Vérifier si l'OF existe
  useEffect(() => {
    const checkOFExists = async () => {
      if (!ofSlug) {
        setOfExists(false);
        return;
      }

      try {
        // TODO: Remplacer par un vrai appel API pour vérifier l'existence de l'OF
        // const response = await fastAPIClient.getOrganizationBySlug(ofSlug);
        
        // Simulation temporaire
        const mockOFs = ['eureka', 'test', 'demo'];
        const exists = mockOFs.includes(ofSlug.toLowerCase());
        
        setOfExists(exists);
        if (exists) {
          setOfName(ofSlug.charAt(0).toUpperCase() + ofSlug.slice(1));
        } else {
          // Rediriger vers 404 si l'OF n'existe pas
          navigate('/404', { 
            state: { 
              isOFError: true,
              ofSlug: ofSlug 
            },
            replace: true 
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'OF:', error);
        setOfExists(false);
        navigate('/404', { 
          state: { 
            isOFError: true,
            ofSlug: ofSlug 
          },
          replace: true 
        });
      }
    };

    checkOFExists();
  }, [ofSlug, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await handleLogin(data.email, data.password);
      // La redirection sera gérée par handleLogin selon le rôle
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la connexion');
    }
  };

  if (ofExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Logo et titre de l'OF */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {ofName}
            </h1>
            <p className="text-muted-foreground">
              Connexion à votre espace de formation
            </p>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                {...register('email')}
                disabled={isSubmitting}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isSubmitting}
                  className={errors.password ? 'border-destructive' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <a
                href="/mot-de-passe-oublie"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Info supplémentaire */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Vous n'avez pas encore de compte ?
            </p>
            <p className="mt-1">
              Contactez l'administrateur de votre organisme de formation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© 2024 LearnEezy. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default OFLogin;
