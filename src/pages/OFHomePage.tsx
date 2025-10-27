import React from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, LogIn, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const OFHomePage = () => {
  const { organization, isLoading, error } = useOrganization();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !organization || !organization.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Organisation introuvable</CardTitle>
            </div>
            <CardDescription>
              Le sous-domaine que vous essayez d'accéder n'existe pas ou a été désactivé.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {organization.logoUrl && (
                <img
                  src={organization.logoUrl}
                  alt={organization.organizationName}
                  className="h-16 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {organization.organizationName || 'Organisme de Formation'}
                </h1>
                <p className="text-sm text-gray-600">Plateforme de formation en ligne</p>
              </div>
            </div>
            <Link to="/connexion">
              <Button className="bg-pink-600 hover:bg-pink-700">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur notre plateforme de formation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos formations professionnelles et développez vos compétences avec nos experts certifiés.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Formations certifiées</CardTitle>
              <CardDescription>
                Accédez à un catalogue complet de formations professionnelles reconnues
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Formateurs experts</CardTitle>
              <CardDescription>
                Apprenez auprès de professionnels expérimentés et passionnés
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Certification</CardTitle>
              <CardDescription>
                Obtenez des certificats reconnus à l'issue de vos formations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à commencer votre formation ?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Connectez-vous à votre compte pour accéder à vos formations et suivre votre progression
          </p>
          <Link to="/connexion">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-6">
              <LogIn className="h-5 w-5 mr-2" />
              Accéder à mon espace
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© {new Date().getFullYear()} {organization.organizationName}. Tous droits réservés.</p>
            <p className="text-sm mt-2">Propulsé par Learneezy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OFHomePage;
