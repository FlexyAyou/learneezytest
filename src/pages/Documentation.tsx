
import React, { useState } from 'react';
import { ChevronRight, BookOpen, Users, Settings, Shield, Zap, Globe, MessageCircle, Award, TrendingUp, CreditCard, FileText, Video, Brain, Download, TestTube, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigationItems = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: Globe },
    { id: 'features', title: 'Fonctionnalités', icon: Zap },
    { id: 'users', title: 'Types d\'utilisateurs', icon: Users },
    { id: 'architecture', title: 'Architecture', icon: Settings },
    { id: 'security', title: 'Sécurité', icon: Shield },
    { id: 'faq', title: 'FAQ', icon: MessageCircle },
  ];

  const userTypes = [
    {
      title: "Étudiant/Apprenant",
      description: "Accès aux formations, suivi de progression, certificats",
      features: ["Catalogue de formations", "Suivi de progression", "Émargement électronique", "Évaluations", "Certificats automatiques", "Documents personnels", "Messagerie"],
      color: "bg-blue-500"
    },
    {
      title: "Formateur Interne",
      description: "Création de contenu, animation de sessions",
      features: ["Création de cours", "Gestion des apprenants", "Outils pédagogiques", "Suivi des performances", "Bibliothèque de ressources"],
      color: "bg-green-500"
    },
    {
      title: "Formateur Externe",
      description: "Prestation de services, gestion des réservations",
      features: ["Gestion des disponibilités", "Réservations clients", "Facturation", "Historique des interventions", "Évaluations clients"],
      color: "bg-purple-500"
    },
    {
      title: "Manager/Gestionnaire",
      description: "Supervision des équipes, rapports de progression",
      features: ["Tableau de bord équipe", "Assignation de formations", "Rapports détaillés", "Planification", "Suivi des inscriptions"],
      color: "bg-orange-500"
    },
    {
      title: "Administrateur",
      description: "Gestion globale de la plateforme",
      features: ["Gestion des utilisateurs", "Configuration système", "Rapports analytiques", "Sécurité", "Maintenance"],
      color: "bg-red-500"
    },
    {
      title: "Organisme de Formation",
      description: "Gestion complète des formations et apprenants",
      features: ["Gestion administrative", "Documents officiels", "Émargement numérique", "Facturation", "Reporting complet"],
      color: "bg-indigo-500"
    }
  ];

  const features = [
    {
      category: "Gestion des formations",
      items: [
        { name: "Catalogue de formations", description: "Parcourir et rechercher dans toutes les formations disponibles" },
        { name: "Création de cours", description: "Éditeur riche pour créer du contenu pédagogique" },
        { name: "Modules et chapitres", description: "Organisation structurée du contenu d'apprentissage" },
        { name: "Ressources multimédias", description: "Intégration de vidéos, documents, images" },
      ]
    },
    {
      category: "Suivi et évaluations",
      items: [
        { name: "Suivi de progression", description: "Tableau de bord personnalisé de l'avancement" },
        { name: "Émargement électronique", description: "Signature numérique pour les formations présentielles" },
        { name: "Évaluations automatisées", description: "QCM et tests avec correction automatique" },
        { name: "Certificats automatiques", description: "Génération automatique à la fin des formations" },
      ]
    },
    {
      category: "Communication",
      items: [
        { name: "Messagerie intégrée", description: "Chat individuel et de groupe" },
        { name: "Visioconférence", description: "Sessions de formation en ligne" },
        { name: "Notifications automatiques", description: "Rappels et alertes personnalisés" },
        { name: "Emails automatiques", description: "Communication automatisée avec les apprenants" },
      ]
    },
    {
      category: "Administration",
      items: [
        { name: "Gestion des utilisateurs", description: "Création, modification, attribution de rôles" },
        { name: "Système d'abonnements", description: "Plans flexibles avec crédits" },
        { name: "Rapports analytiques", description: "Métriques détaillées et tableau de bord" },
        { name: "Documents administratifs", description: "Génération automatique de conventions, attestations" },
      ]
    }
  ];

  const subscriptionPlans = [
    {
      name: "Pack Starter",
      credits: 100,
      duration: "3 mois",
      price: "49€",
      description: "Idéal pour découvrir la plateforme"
    },
    {
      name: "Pack Growth",
      credits: 300,
      duration: "6 mois", 
      price: "129€",
      description: "Le plus populaire pour les PME",
      popular: true
    },
    {
      name: "Pack Premium",
      credits: 500,
      duration: "12 mois",
      price: "199€",
      description: "Pour les besoins avancés"
    },
    {
      name: "Pack Enterprise",
      credits: 1000,
      duration: "12 mois",
      price: "349€",
      description: "Solution complète pour les grandes organisations"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Documentation LearnEezy</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Guide complet de la plateforme LMS moderne pour transformer l'apprentissage en ligne
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Navigation latérale */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium text-left hover:bg-gray-50 ${
                              activeSection === item.id
                                ? 'bg-pink-50 text-pink-600 border-r-2 border-pink-600'
                                : 'text-gray-700'
                            }`}
                          >
                            <IconComponent className="h-4 w-4 mr-3" />
                            {item.title}
                          </button>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              {activeSection === 'overview' && (
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="h-6 w-6 mr-2 text-pink-600" />
                        Vue d'ensemble de LearnEezy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="text-lg text-gray-600 mb-6">
                        LearnEezy est une plateforme LMS (Learning Management System) moderne et complète conçue pour 
                        révolutionner l'expérience d'apprentissage en ligne.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-900">Objectifs principaux</h3>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                              Démocratiser l'accès à la formation
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                              Optimiser l'expérience d'apprentissage
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                              Faciliter la gestion administrative
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                              Favoriser l'engagement des apprenants
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-900">Cas d'usage</h3>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start">
                              <Award className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              Formation professionnelle
                            </li>
                            <li className="flex items-start">
                              <BookOpen className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Enseignement académique
                            </li>
                            <li className="flex items-start">
                              <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                              Formation d'entreprise
                            </li>
                            <li className="flex items-start">
                              <Brain className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                              Apprentissage individuel
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-100">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">Technologie moderne</h3>
                        <p className="text-gray-600 mb-4">
                          Construit avec les dernières technologies web pour garantir performance, sécurité et évolutivité.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">React 18</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Tailwind CSS</Badge>
                          <Badge variant="secondary">Supabase</Badge>
                          <Badge variant="secondary">PostgreSQL</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plans d'abonnement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="h-6 w-6 mr-2 text-pink-600" />
                        Plans d'abonnement
                      </CardTitle>
                      <CardDescription>
                        Des formules flexibles adaptées à tous les besoins
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {subscriptionPlans.map((plan, index) => (
                          <div 
                            key={index}
                            className={`relative p-4 border rounded-lg ${
                              plan.popular 
                                ? 'border-pink-500 bg-pink-50' 
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            {plan.popular && (
                              <Badge className="absolute -top-2 left-4 bg-pink-600">
                                Populaire
                              </Badge>
                            )}
                            <h4 className="font-semibold text-lg mb-2">{plan.name}</h4>
                            <div className="text-2xl font-bold text-pink-600 mb-1">{plan.price}</div>
                            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Crédits:</span>
                                <span className="font-medium">{plan.credits}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Durée:</span>
                                <span className="font-medium">{plan.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'features' && (
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-6 w-6 mr-2 text-pink-600" />
                        Fonctionnalités principales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {features.map((category, index) => (
                          <div key={index}>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                              {category.category}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="p-4 border border-gray-200 rounded-lg bg-white">
                                  <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Outils intégrés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Video className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Visioconférence</h4>
                            <p className="text-sm text-gray-600">Sessions en direct</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                          <Brain className="h-8 w-8 text-purple-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Chat IA</h4>
                            <p className="text-sm text-gray-600">Assistant intelligent</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <TestTube className="h-8 w-8 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Tests de positionnement</h4>
                            <p className="text-sm text-gray-600">Évaluation des prérequis</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                          <Download className="h-8 w-8 text-orange-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Documents</h4>
                            <p className="text-sm text-gray-600">Bibliothèque de ressources</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                          <FileText className="h-8 w-8 text-indigo-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Émargement numérique</h4>
                            <p className="text-sm text-gray-600">Signature électronique</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                          <Calendar className="h-8 w-8 text-pink-600 mr-3" />
                          <div>
                            <h4 className="font-medium">Planification</h4>
                            <p className="text-sm text-gray-600">Gestion des créneaux</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'users' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-6 w-6 mr-2 text-pink-600" />
                        Types d'utilisateurs
                      </CardTitle>
                      <CardDescription>
                        LearnEezy s'adapte à différents profils d'utilisateurs avec des fonctionnalités spécialisées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-6">
                        {userTypes.map((user, index) => (
                          <Card key={index} className="border-l-4" style={{ borderLeftColor: user.color.replace('bg-', '').includes('blue') ? '#3b82f6' : user.color.replace('bg-', '').includes('green') ? '#10b981' : user.color.replace('bg-', '').includes('purple') ? '#8b5cf6' : user.color.replace('bg-', '').includes('orange') ? '#f59e0b' : user.color.replace('bg-', '').includes('red') ? '#ef4444' : '#6366f1' }}>
                            <CardHeader>
                              <CardTitle className="text-lg">{user.title}</CardTitle>
                              <CardDescription>{user.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {user.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start text-sm">
                                    <ChevronRight className="h-4 w-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Parcours utilisateur</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="student" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="student">Étudiant</TabsTrigger>
                          <TabsTrigger value="trainer">Formateur</TabsTrigger>
                          <TabsTrigger value="admin">Administrateur</TabsTrigger>
                        </TabsList>
                        <TabsContent value="student" className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium mb-2">1. Découverte</h4>
                              <p className="text-sm text-gray-600">Parcourir le catalogue, s'inscrire aux formations</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h4 className="font-medium mb-2">2. Apprentissage</h4>
                              <p className="text-sm text-gray-600">Suivre les cours, participer aux évaluations</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-medium mb-2">3. Suivi</h4>
                              <p className="text-sm text-gray-600">Consulter sa progression, émarger aux sessions</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <h4 className="font-medium mb-2">4. Certification</h4>
                              <p className="text-sm text-gray-600">Obtenir ses certificats, télécharger ses documents</p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="trainer" className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium mb-2">1. Création</h4>
                              <p className="text-sm text-gray-600">Développer du contenu pédagogique interactif</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h4 className="font-medium mb-2">2. Animation</h4>
                              <p className="text-sm text-gray-600">Animer des sessions, gérer les apprenants</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-medium mb-2">3. Évaluation</h4>
                              <p className="text-sm text-gray-600">Créer des tests, analyser les performances</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <h4 className="font-medium mb-2">4. Suivi</h4>
                              <p className="text-sm text-gray-600">Accompagner les apprenants, générer des rapports</p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="admin" className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium mb-2">1. Configuration</h4>
                              <p className="text-sm text-gray-600">Paramétrer la plateforme, gérer les utilisateurs</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h4 className="font-medium mb-2">2. Supervision</h4>
                              <p className="text-sm text-gray-600">Monitorer l'activité, analyser les métriques</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-medium mb-2">3. Support</h4>
                              <p className="text-sm text-gray-600">Assistance aux utilisateurs, maintenance</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <h4 className="font-medium mb-2">4. Évolution</h4>
                              <p className="text-sm text-gray-600">Optimiser la plateforme, implémenter de nouvelles fonctionnalités</p>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'architecture' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-6 w-6 mr-2 text-pink-600" />
                        Architecture technique
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Stack technologique</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3 text-blue-600">Frontend</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">React 18</Badge>
                                Framework principal avec hooks
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">TypeScript</Badge>
                                Typage statique pour la robustesse
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">Vite</Badge>
                                Build tool moderne et rapide
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">Tailwind CSS</Badge>
                                Framework CSS utilitaire
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">shadcn/ui</Badge>
                                Composants UI modernes
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-3 text-green-600">Backend</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">Supabase</Badge>
                                Backend-as-a-Service complet
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">PostgreSQL</Badge>
                                Base de données relationnelle
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">Auth</Badge>
                                Authentification intégrée
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">RLS</Badge>
                                Row Level Security
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">Real-time</Badge>
                                Mises à jour en temps réel
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Base de données</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                <span className="font-medium">profiles</span>
                                <span className="text-blue-600">Profils utilisateurs</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="font-medium">organisations_formation</span>
                                <span className="text-green-600">Organismes de formation</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                <span className="font-medium">inscriptions</span>
                                <span className="text-orange-600">Inscriptions aux formations</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                <span className="font-medium">emargements</span>
                                <span className="text-purple-600">Feuilles de présence</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-pink-50 rounded">
                                <span className="font-medium">evaluations</span>
                                <span className="text-pink-600">Évaluations et tests</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Sécurité</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center p-2 bg-red-50 rounded">
                              <Shield className="h-4 w-4 text-red-600 mr-2" />
                              <span>Row Level Security (RLS)</span>
                            </div>
                            <div className="flex items-center p-2 bg-orange-50 rounded">
                              <Shield className="h-4 w-4 text-orange-600 mr-2" />
                              <span>Authentification JWT</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded">
                              <Shield className="h-4 w-4 text-green-600 mr-2" />
                              <span>HTTPS obligatoire</span>
                            </div>
                            <div className="flex items-center p-2 bg-blue-50 rounded">
                              <Shield className="h-4 w-4 text-blue-600 mr-2" />
                              <span>Permissions granulaires</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold mb-3">Déploiement</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                              1
                            </div>
                            <h4 className="font-medium">Développement</h4>
                            <p className="text-gray-600">Environnement local avec Vite</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                              2
                            </div>
                            <h4 className="font-medium">Build</h4>
                            <p className="text-gray-600">Optimisation et minification</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                              3
                            </div>
                            <h4 className="font-medium">Production</h4>
                            <p className="text-gray-600">Déploiement via Lovable</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-6 w-6 mr-2 text-pink-600" />
                        Sécurité et confidentialité
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Authentification</h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>Authentification multi-facteurs</strong>
                                <p className="text-sm text-gray-600">Sécurité renforcée pour tous les comptes</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>Sessions sécurisées</strong>
                                <p className="text-sm text-gray-600">Tokens JWT avec expiration automatique</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>Chiffrement des mots de passe</strong>
                                <p className="text-sm text-gray-600">Algorithmes de hachage sécurisés</p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Protection des données</h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>RGPD compliant</strong>
                                <p className="text-sm text-gray-600">Conformité aux réglementations européennes</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>Chiffrement en transit</strong>
                                <p className="text-sm text-gray-600">HTTPS/TLS pour toutes les communications</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <div>
                                <strong>Sauvegardes automatiques</strong>
                                <p className="text-sm text-gray-600">Protection contre la perte de données</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Signalement de vulnérabilités</h4>
                        <p className="text-sm text-red-700">
                          Si vous découvrez une vulnérabilité de sécurité, veuillez nous contacter immédiatement à 
                          <a href="mailto:security@learnezy.com" className="font-medium underline ml-1">security@learnezy.com</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'faq' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="h-6 w-6 mr-2 text-pink-600" />
                        Questions fréquentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Questions générales</h3>
                          <div className="space-y-4">
                            <div className="border-l-4 border-pink-500 pl-4">
                              <h4 className="font-medium mb-1">Qu'est-ce que LearnEezy ?</h4>
                              <p className="text-sm text-gray-600">
                                LearnEezy est une plateforme LMS complète permettant de créer, gérer et suivre des formations en ligne avec des outils modernes et intuitifs.
                              </p>
                            </div>
                            <div className="border-l-4 border-pink-500 pl-4">
                              <h4 className="font-medium mb-1">Qui peut utiliser LearnEezy ?</h4>
                              <p className="text-sm text-gray-600">
                                La plateforme s'adresse aux étudiants, formateurs, organismes de formation, entreprises et toute structure souhaitant digitaliser ses formations.
                              </p>
                            </div>
                            <div className="border-l-4 border-pink-500 pl-4">
                              <h4 className="font-medium mb-1">La plateforme est-elle accessible sur mobile ?</h4>
                              <p className="text-sm text-gray-600">
                                Oui, LearnEezy est entièrement responsive et s'adapte à tous les appareils : smartphones, tablettes et ordinateurs.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
                          <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium mb-1">Comment créer un cours ?</h4>
                              <p className="text-sm text-gray-600">
                                Accédez à votre tableau de bord formateur, cliquez sur "Créer un cours" et utilisez notre éditeur intuitif pour structurer votre contenu.
                              </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium mb-1">Comment fonctionne l'émargement électronique ?</h4>
                              <p className="text-sm text-gray-600">
                                L'émargement se fait via signature numérique sur tablette ou smartphone, avec horodatage et géolocalisation pour une traçabilité complète.
                              </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium mb-1">Les certificats sont-ils reconnus ?</h4>
                              <p className="text-sm text-gray-600">
                                Les certificats générés sont personnalisables et incluent toutes les informations réglementaires nécessaires selon votre domaine d'activité.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Support technique</h3>
                          <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium mb-1">Comment obtenir de l'aide ?</h4>
                              <p className="text-sm text-gray-600">
                                Contactez notre support via le chat en ligne, par email à support@learnezy.com ou consultez notre base de connaissances.
                              </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium mb-1">Les données sont-elles sauvegardées ?</h4>
                              <p className="text-sm text-gray-600">
                                Oui, toutes les données sont automatiquement sauvegardées et sécurisées avec des copies de sauvegarde régulières.
                              </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium mb-1">Puis-je exporter mes données ?</h4>
                              <p className="text-sm text-gray-600">
                                Absolument ! Vous pouvez exporter vos données à tout moment dans différents formats (PDF, Excel, CSV).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Besoin d'aide ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium mb-1">Chat en direct</h4>
                          <p className="text-sm text-gray-600 mb-3">Assistance immédiate</p>
                          <Button size="sm" variant="outline">
                            Démarrer le chat
                          </Button>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium mb-1">Base de connaissances</h4>
                          <p className="text-sm text-gray-600 mb-3">Guides détaillés</p>
                          <Button size="sm" variant="outline">
                            Parcourir
                          </Button>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium mb-1">Tutoriels vidéo</h4>
                          <p className="text-sm text-gray-600 mb-3">Apprentissage visuel</p>
                          <Button size="sm" variant="outline">
                            Regarder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
