
import React from 'react';
import { Play, ChevronRight, Star, Users, Award, TrendingUp, Zap, Target, ArrowRight, BookOpen, Clock, Code, Brain, Shield, Database, Microscope, Calculator, Globe, PenTool, Laptop } from 'lucide-react';
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
            10 designs différents pour votre page d'accueil
          </p>
        </div>

        {/* Hero Option 1 - Gradient moderne avec illustration académique */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 text-white min-h-[600px]">
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  Transformez votre
                  <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    avenir professionnel
                  </span>
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Accédez à plus de 1000 formations en ligne créées par des experts
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
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
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center" 
                    alt="Cours de programmation"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Cours Interactifs</h3>
                    <p className="text-sm opacity-80">Apprentissage pratique avec des projets réels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 1 - Gradient moderne</h3>
          </div>
        </section>

        {/* Hero Option 2 - Minimaliste élégant avec illustration */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-white min-h-[600px]">
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
              {/* Academic Illustration */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&crop=center" 
                  alt="Environnement d'apprentissage collaboratif"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">Apprentissage Collaboratif</h3>
                  <p className="text-sm opacity-90">Échangez avec vos pairs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <h3 className="font-semibold text-center">Option 2 - Minimaliste élégant</h3>
          </div>
        </section>

        {/* Hero Option 3 - Style tech futuriste avec illustration */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-900 text-white min-h-[600px] relative overflow-hidden">
            {/* Grid background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 h-full">
                {Array.from({length: 144}).map((_, i) => (
                  <div key={i} className="border border-purple-500/20"></div>
                ))}
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-2 mb-8 text-sm">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Plateforme d'apprentissage nouvelle génération
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-mono">
                  &lt;Learn/&gt;
                  <span className="block text-purple-400">everything;</span>
                </h2>
                <p className="text-xl mb-8 text-gray-300">
                  Code, design, business - maîtrisez les compétences du futur avec nos formations interactives
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                    Démarrer &gt;_
                  </Button>
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-lg px-8 py-4">
                    Documentation
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop&crop=center" 
                    alt="Technologie et programmation"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center gap-4">
                    <Code className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="text-lg font-semibold">Développement Web</h3>
                      <p className="text-sm text-gray-400">Technologies modernes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 3 - Style tech futuriste</h3>
          </div>
        </section>

        {/* Hero Option 4 - Créatif avec formes et illustration */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white min-h-[600px] relative">
            {/* Floating shapes */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-yellow-400/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute top-32 right-32 w-24 h-24 bg-blue-400/30 rotate-45 blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 bg-green-400/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  Créez
                  <span className="block">Apprenez</span>
                  <span className="block text-yellow-300">Réussissez</span>
                </h2>
                <p className="text-xl mb-8">
                  Libérez votre potentiel créatif avec nos formations artistiques et techniques
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs opacity-80">Cours créatifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-xs opacity-80">Créateurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs opacity-80">Satisfaction</div>
                  </div>
                </div>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
                  Commencer à créer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=300&fit=crop&crop=center" 
                    alt="Programmation créative"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <PenTool className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-xs">Design</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <Code className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-xs">Code</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <Brain className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-xs">IA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 4 - Créatif avec formes</h3>
          </div>
        </section>

        {/* Hero Option 5 - Corporate professionnel avec illustration */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-white min-h-[600px]">
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
              {/* Academic Illustration */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=center" 
                  alt="Environnement de travail professionnel"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-sm">Croissance</div>
                      <div className="text-xs text-gray-500">Carrière</div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Réseau</div>
                      <div className="text-xs text-gray-500">Professionnel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <h3 className="font-semibold text-center">Option 5 - Corporate professionnel</h3>
          </div>
        </section>

        {/* Hero Option 6 - Innovation & IA */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white min-h-[600px] relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%239333ea\" fill-opacity=\"0.1\"><circle cx=\"30\" cy=\"30\" r=\"2\"/></g></g></svg>')] opacity-30"></div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full px-4 py-2 mb-8 text-sm border border-pink-500/30">
                  <Brain className="h-4 w-4 text-pink-400" />
                  Intelligence Artificielle & Innovation
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Maîtrisez l'
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">IA</span>
                  <span className="block">de demain</span>
                </h2>
                <p className="text-xl mb-8 text-gray-200">
                  Formations avancées en intelligence artificielle, machine learning et technologies émergentes
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-4">
                    Explorer l'IA
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10 text-lg px-8 py-4">
                    <Brain className="h-5 w-5 mr-2" />
                    Demo Interactive
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop&crop=center" 
                    alt="Intelligence artificielle"
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Brain className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Machine Learning Avancé</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Database className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Data Science & Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 6 - Innovation & IA</h3>
          </div>
        </section>

        {/* Hero Option 7 - Cybersécurité */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white min-h-[600px] relative">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 gap-px h-full">
                {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/20" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-500/20 rounded-full px-4 py-2 mb-8 text-sm border border-red-500/30">
                  <Shield className="h-4 w-4 text-red-400" />
                  Sécurité & Protection des Données
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Sécurisez le
                  <span className="block text-red-400">cyber-espace</span>
                </h2>
                <p className="text-xl mb-8 text-gray-200">
                  Formations expertes en cybersécurité, protection des données et sécurité informatique
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">99.9%</div>
                    <div className="text-sm text-gray-400">Sécurité garantie</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">24/7</div>
                    <div className="text-sm text-gray-400">Surveillance</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                    Sécuriser maintenant
                    <Shield className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-red-400 text-red-300 hover:bg-red-400/10 text-lg px-8 py-4">
                    Audit gratuit
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop&crop=center" 
                    alt="Cybersécurité"
                    className="w-full h-48 object-cover rounded-lg mb-4 filter contrast-125"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-500/20 rounded-lg p-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-400" />
                      <span className="text-sm">Protection</span>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm">Détection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 7 - Cybersécurité</h3>
          </div>
        </section>

        {/* Hero Option 8 - Sciences & Recherche */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-teal-600 via-blue-600 to-indigo-700 text-white min-h-[600px] relative">
            <div className="absolute inset-0">
              {Array.from({length: 20}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-teal-400/20 rounded-full px-4 py-2 mb-8 text-sm border border-teal-400/30">
                  <Microscope className="h-4 w-4 text-teal-300" />
                  Sciences & Recherche Académique
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Explorez les
                  <span className="block text-teal-300">sciences</span>
                </h2>
                <p className="text-xl mb-8 text-gray-100">
                  Formations académiques en sciences, mathématiques, physique et recherche universitaire
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-300">200+</div>
                    <div className="text-xs opacity-80">Laboratoires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-300">50+</div>
                    <div className="text-xs opacity-80">Disciplines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-300">PhD</div>
                    <div className="text-xs opacity-80">Niveau</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-8 py-4">
                    Découvrir la science
                    <Microscope className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-teal-300 text-teal-200 hover:bg-teal-400/10 text-lg px-8 py-4">
                    Programmes doctoraux
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-teal-400/30">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=300&fit=crop&crop=center" 
                    alt="Recherche scientifique"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-teal-300" />
                        <span className="text-sm">Mathématiques</span>
                      </div>
                      <span className="text-xs bg-teal-500/30 px-2 py-1 rounded">Avancé</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Microscope className="h-5 w-5 text-blue-300" />
                        <span className="text-sm">Physique Quantique</span>
                      </div>
                      <span className="text-xs bg-blue-500/30 px-2 py-1 rounded">Expert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 8 - Sciences & Recherche</h3>
          </div>
        </section>

        {/* Hero Option 9 - Global & Langues */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white min-h-[600px] relative">
            <div className="absolute inset-0 opacity-10">
              <div className="flex flex-wrap gap-4 p-8">
                {['🇫🇷', '🇬🇧', '🇪🇸', '🇩🇪', '🇮🇹', '🇯🇵', '🇨🇳', '🇰🇷', '🇷🇺', '🇦🇷', '🇧🇷', '🇮🇳'].map((flag, i) => (
                  <span key={i} className="text-4xl animate-bounce" style={{animationDelay: `${i * 0.3}s`}}>{flag}</span>
                ))}
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-400/20 rounded-full px-4 py-2 mb-8 text-sm border border-emerald-400/30">
                  <Globe className="h-4 w-4 text-emerald-300" />
                  Apprentissage Global & Langues
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Connectez-vous au
                  <span className="block text-emerald-300">monde entier</span>
                </h2>
                <p className="text-xl mb-8 text-gray-100">
                  Formations internationales, apprentissage des langues et compétences interculturelles
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
                    <div className="text-2xl font-bold text-emerald-300">25+</div>
                    <div className="text-sm text-gray-300">Langues disponibles</div>
                  </div>
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
                    <div className="text-2xl font-bold text-emerald-300">150+</div>
                    <div className="text-sm text-gray-300">Pays représentés</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-lg px-8 py-4">
                    Commencer l'aventure
                    <Globe className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-emerald-300 text-emerald-200 hover:bg-emerald-400/10 text-lg px-8 py-4">
                    Test de niveau
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop&crop=center" 
                    alt="Apprentissage international"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {['🇫🇷 FR', '🇬🇧 EN', '🇪🇸 ES', '🇩🇪 DE'].map((lang, i) => (
                      <div key={i} className="bg-white/10 rounded-lg p-2 text-center text-xs">
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 9 - Global & Langues</h3>
          </div>
        </section>

        {/* Hero Option 10 - Entrepreneuriat & Business */}
        <section className="mb-24 border rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white min-h-[600px] relative">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-6 gap-8 p-8 rotate-12 scale-150">
                {Array.from({length: 24}).map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-yellow-400/30 rounded-lg transform rotate-45"></div>
                ))}
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-400/20 rounded-full px-4 py-2 mb-8 text-sm border border-amber-400/30">
                  <TrendingUp className="h-4 w-4 text-amber-300" />
                  Entrepreneuriat & Business
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Lancez votre
                  <span className="block text-amber-300">startup</span>
                </h2>
                <p className="text-xl mb-8 text-gray-100">
                  Formations entrepreneuriales, business development et création d'entreprise
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Plan d'affaires et stratégie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">Levée de fonds et investissement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm">Marketing digital et croissance</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-lg px-8 py-4">
                    Créer mon business
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-amber-300 text-amber-200 hover:bg-amber-400/10 text-lg px-8 py-4">
                    Mentorat gratuit
                  </Button>
                </div>
              </div>
              {/* Academic Illustration */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-amber-400/30">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop&crop=center" 
                    alt="Entrepreneuriat et business"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-500/20 rounded-lg p-3 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-300" />
                      <div className="text-xs font-medium">Croissance</div>
                    </div>
                    <div className="bg-orange-500/20 rounded-lg p-3 text-center">
                      <Target className="h-6 w-6 mx-auto mb-2 text-orange-300" />
                      <div className="text-xs font-medium">Stratégie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-center">Option 10 - Entrepreneuriat & Business</h3>
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
