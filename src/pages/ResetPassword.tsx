import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Lock, CheckCircle, Star, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const securityFeatures = [
    "Cryptage de bout en bout",
    "Protection contre les attaques",
    "Vérification en temps réel",
    "Conformité RGPD"
  ];

  const validatePasswordStrength = (pass: string) => {
    if (pass.length < 6) {
      setPasswordStrength('weak');
    } else if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      validatePasswordStrength(value);
    } else {
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation du mot de passe
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Intégrer avec le back-end
      // const response = await apiClient.resetPassword({ password, token: tokenFromUrl });
      
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers la page de connexion après succès
      navigate('/connexion', { 
        state: { message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' }
      });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Faible';
      case 'medium':
        return 'Moyen';
      case 'strong':
        return 'Fort';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-pink-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Lock className="w-16 h-16 text-pink-100 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Nouveau mot de passe
          </h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Choisissez un mot de passe fort et sécurisé pour protéger votre compte. 
            Nous vous recommandons d'utiliser au moins 8 caractères avec des majuscules, 
            minuscules et chiffres.
          </p>
          
          <div className="space-y-4 mb-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-pink-200" />
                <span className="text-pink-100">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-pink-100">Sécurité</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">5.0</span>
              </div>
            </div>
            <p className="text-sm text-pink-200">
              "Protection maximale de mes données personnelles !"
            </p>
            <p className="text-xs text-pink-300 mt-2">- Sophie, Apprenante</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center">
              <img src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" alt="Learneezy" className="h-20 w-auto" />
            </Link>
            <p className="text-gray-600 mt-2">Créez votre nouveau mot de passe</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-gray-900">Réinitialisation du mot de passe</CardTitle>
              <CardDescription>
                Choisissez un nouveau mot de passe sécurisé pour votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre nouveau mot de passe"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {passwordStrength && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Force du mot de passe</span>
                        <span className={`font-medium ${
                          passwordStrength === 'weak' ? 'text-red-600' :
                          passwordStrength === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-300`}
                          style={{ 
                            width: passwordStrength === 'weak' ? '33%' : 
                                   passwordStrength === 'medium' ? '66%' : '100%' 
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
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
                      placeholder="Confirmez votre nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {confirmPassword && password && confirmPassword === password && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Les mots de passe correspondent
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium"
                  disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Réinitialisation en cours...
                    </div>
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <Link 
                  to="/connexion" 
                  className="inline-flex items-center text-sm text-pink-600 hover:text-pink-800 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour à la connexion
                </Link>
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-gray-500">
                  Besoin d'aide ? <Link to="/contact" className="text-pink-600 hover:text-pink-800 font-medium">Contactez-nous</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
