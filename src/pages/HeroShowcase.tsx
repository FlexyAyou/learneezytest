
import React from 'react';
import { Play, ChevronRight, Star, Users, Award, TrendingUp, Zap, Target, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const HeroShowcase = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choisissez votre Hero Section
          </h1>
          <p className="text-xl text-muted-foreground">
            5 designs différents pour votre page d'accueil
          </p>
        </div>

        {/* Hero Option 1 - Gradient moderne */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 text-white min-h-[600px] flex items-center">
            <div className="max-w-6xl mx-auto px-8 py-16">
              <div className="text-center">
                <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  Transformez votre
                  <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    avenir professionnel
                  </span>
                </h2>
                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                  Accédez à plus de 1000 formations en ligne créées par des experts
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                    <Play className="h-5 w-5 mr-2" />
                    Voir la démo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 1 - Gradient moderne</h3>
          </div>
        </section>

        {/* Hero Option 2 - Minimaliste élégant */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-white min-h-[600px] flex items-center">
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Apprenez sans limites
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Des cours de qualité supérieure pour développer vos compétences et accélérer votre carrière.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">+50,000 étudiants nous font confiance</span>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-4">
                  Explorer les cours
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-24 w-24 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-700">Illustration ou image ici</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <h3 className="font-semibold text-center">Option 2 - Minimaliste élégant</h3>
          </div>
        </section>

        {/* Hero Option 3 - Style tech futuriste */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-900 text-white min-h-[600px] flex items-center relative overflow-hidden">
            {/* Grid background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 h-full">
                {Array.from({length: 144}).map((_, i) => (
                  <div key={i} className="border border-purple-500/20"></div>
                ))}
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-2 mb-8 text-sm">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Plateforme d'apprentissage nouvelle génération
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight font-mono">
                  &lt;Learn/&gt;
                  <span className="block text-purple-400">everything;</span>
                </h2>
                <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-300">
                  Code, design, business - maîtrisez les compétences du futur avec nos formations interactives
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                    Démarrer {'>'}_
                  </Button>
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-lg px-8 py-4">
                    Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 3 - Style tech futuriste</h3>
          </div>
        </section>

        {/* Hero Option 4 - Créatif avec formes */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white min-h-[600px] flex items-center relative">
            {/* Floating shapes */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-yellow-400/30 rounded-full blur-sm animate-float"></div>
            <div className="absolute top-32 right-32 w-24 h-24 bg-blue-400/30 rotate-45 blur-sm animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 bg-green-400/30 rounded-full blur-sm animate-float" style={{animationDelay: '2s'}}></div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 relative z-10">
              <div className="text-center">
                <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                  Créez
                  <span className="block">Apprenez</span>
                  <span className="block text-yellow-300">Réussissez</span>
                </h2>
                <p className="text-xl mb-12 max-w-3xl mx-auto">
                  Libérez votre potentiel créatif avec nos formations artistiques et techniques
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm opacity-80">Cours créatifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm opacity-80">Créateurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-sm opacity-80">Satisfaction</div>
                  </div>
                </div>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
                  Commencer à créer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 4 - Créatif avec formes</h3>
          </div>
        </section>

        {/* Hero Option 5 - Corporate professionnel */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-white min-h-[600px] flex items-center">
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-lg px-3 py-1 text-sm mb-6">
                  <Award className="h-4 w-4" />
                  Certifié par les leaders de l'industrie
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Excellez dans votre carrière professionnelle
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Formations certifiantes reconnues par les entreprises du Fortune 500. 
                  Développez les compétences recherchées par les recruteurs.
                </p>
                <div className="flex items-center gap-8 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">92%</div>
                    <div className="text-sm text-gray-500">Taux d'employabilité</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">+35%</div>
                    <div className="text-sm text-gray-500">Augmentation salariale</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">150+</div>
                    <div className="text-sm text-gray-500">Entreprises partenaires</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                    Voir les formations
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4">
                    <Clock className="h-5 w-5 mr-2" />
                    Programme sur mesure
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-80">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center">
                    <Target className="h-12 w-12 text-purple-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center">
                    <Award className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <h3 className="font-semibold text-center">Option 5 - Corporate professionnel</h3>
          </div>
        </section>

        <div className="text-center py-16">
          <Link to="/">
            <Button variant="outline" size="lg">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroShowcase;
