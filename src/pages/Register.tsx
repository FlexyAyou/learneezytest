
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Star, AlertCircle, GraduationCap, UserCheck } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMinorError, setShowMinorError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    ageStatus: '',
    role: '', // 'student' ou 'tutor'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    console.log('Inscription:', formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Réinitialiser l'erreur mineur si l'utilisateur change ses choix
    if (field === 'userType' || field === 'ageStatus') {
      setShowMinorError(false);
    }

    // Afficher l'erreur si mineur
    if (field === 'ageStatus' && value === 'minor') {
      setShowMinorError(true);
    }
  };

  const benefits = [
    "Accès illimité à tous les cours",
    "Support communautaire actif",
    "Certificats de completion",
    "Suivi de progression avancé"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-pink-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            Commencez votre parcours d'apprentissage
          </h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            Créez votre compte et accédez à des milliers de cours de qualité professionnelle. 
            Développez vos compétences avec les meilleurs instructeurs.
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
              <img src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" alt="Learneezy" className="h-20 w-auto" />
            </Link>
            <p className="text-gray-600 mt-2">Créez votre compte et commencez à apprendre</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold text-gray-900">Créer un compte</CardTitle>
              <CardDescription>
                Rejoignez notre communauté d'apprentissage dès aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Choix du type de profil */}
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                    Type de profil
                  </Label>
                  <Select value={formData.userType} onValueChange={(value) => handleChange('userType', value)}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                      <SelectValue placeholder="Choisissez votre profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>Profil Élève</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="instructor">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Profil Professeur</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Champ spécifique pour les étudiants : statut d'âge */}
                {formData.userType === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="ageStatus" className="text-sm font-medium text-gray-700">
                      Êtes-vous majeur ?
                    </Label>
                    <Select value={formData.ageStatus} onValueChange={(value) => handleChange('ageStatus', value)}>
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
                      <strong>Vous êtes mineur.</strong> C'est votre parent ou représentant légal qui doit créer un compte à votre place.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Choix du rôle pour les adultes */}
                {formData.userType === 'student' && formData.ageStatus === 'adult' && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Vous êtes :
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Élève</SelectItem>
                        <SelectItem value="tutor">Tuteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Informations personnelles - affichées pour les profils valides */}
                {(formData.userType === 'instructor' || 
                  (formData.userType === 'student' && formData.ageStatus === 'adult' && formData.role)) && (
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
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            className="pl-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Nom"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
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
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="pl-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </div>
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
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
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
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
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
                        J'accepte les{' '}
                        <Link to="/conditions" className="text-pink-600 hover:underline font-medium">
                          conditions d'utilisation
                        </Link>
                        {' '}et la{' '}
                        <Link to="/confidentialite" className="text-pink-600 hover:underline font-medium">
                          politique de confidentialité
                        </Link>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium"
                    >
                      Créer mon compte
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/connexion" className="text-pink-600 hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>

              {/* Social Registration - seulement si pas d'erreur mineur */}
              {!showMinorError && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="ml-2">Google</span>
                    </Button>
                    <Button variant="outline" className="h-12">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="ml-2">Facebook</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
