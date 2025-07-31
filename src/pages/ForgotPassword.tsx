
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle, Star, Lock, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation de l'email
    if (!email || !email.includes('@')) {
      setError('Veuillez saisir une adresse email valide');
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const securityFeatures = [
    "Lien de réinitialisation sécurisé",
    "Expiration automatique après 1h",
    "Protection contre les attaques",
    "Vérification par email"
  ];

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Marketing */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-pink-700 to-pink-600 items-center justify-center p-8">
          <div className="max-w-md text-white">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-center">
              Email envoyé avec succès !
            </h2>
            <p className="text-pink-100 mb-8 text-lg leading-relaxed text-center">
              Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
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
                "Système de sécurité le plus fiable que j'ai utilisé !"
              </p>
              <p className="text-xs text-pink-300 mt-2">- Marie, Utilisatrice</p>
            </div>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center">
                <img src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" alt="Learneezy" className="h-20 w-auto" />
              </Link>
            </div>

            <Card className="border-0 shadow-none">
              <CardHeader className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Email envoyé !</CardTitle>
                <CardDescription>
                  Nous avons envoyé un lien de réinitialisation à votre adresse email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                    Le lien est valide pendant 1 heure.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas reçu l'email ?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEmailSent(false)}
                    className="w-full"
                  >
                    Renvoyer l'email
                  </Button>
                </div>

                <div className="text-center">
                  <Link 
                    to="/connexion" 
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour à la connexion
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-pink-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Lock className="w-16 h-16 text-pink-100 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Récupération sécurisée
          </h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Pas de panique ! Nous vous aidons à récupérer l'accès à votre compte en toute sécurité. 
            Saisissez votre email et suivez les instructions.
          </p>
          
          <div className="space-y-4 mb-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-pink-200" />
                <span className="text-pink-100">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-pink-100">Fiabilité</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">4.9</span>
              </div>
            </div>
            <p className="text-sm text-pink-200">
              "Récupération de mot de passe rapide et sécurisée !"
            </p>
            <p className="text-xs text-pink-300 mt-2">- Thomas, Étudiant</p>
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
            <p className="text-gray-600 mt-2">Récupérez l'accès à votre compte</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-gray-900">Mot de passe oublié</CardTitle>
              <CardDescription>
                Saisissez votre adresse email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <div className="text-sm text-gray-600">
                  Vous vous souvenez de votre mot de passe ?
                </div>
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

export default ForgotPassword;
