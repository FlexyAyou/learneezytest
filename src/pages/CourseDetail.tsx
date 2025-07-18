
import React from 'react';
import { Play, Clock, Users, Award, Star, BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CourseDetail = () => {
  const modules = [
    { title: "Introduction à React", duration: "2h 30min", completed: true },
    { title: "Composants et Props", duration: "3h 15min", completed: true },
    { title: "State et Hooks", duration: "4h 20min", completed: false },
    { title: "Gestion des événements", duration: "2h 45min", completed: false },
    { title: "Projet final", duration: "5h 00min", completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Maîtrisez React de A à Z
              </h1>
              <p className="text-xl text-pink-100 mb-6">
                Apprenez à créer des applications web modernes avec React, 
                du niveau débutant jusqu'aux concepts avancés.
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>18 heures</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>2,350 étudiants</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  <span>Certificat inclus</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-200">
                  <Play className="h-5 w-5 mr-2" />
                  Commencer maintenant
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-pink-600 hover:bg-pink-200">
                  Aperçu gratuit
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
                alt="Cours React"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-pink-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description du cours</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ce cours complet vous permettra de maîtriser React, la bibliothèque JavaScript 
                la plus populaire pour créer des interfaces utilisateur interactives. 
                Vous apprendrez les concepts fondamentaux ainsi que les techniques avancées 
                utilisées par les développeurs professionnels.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ce que vous allez apprendre :</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Les bases de React et JSX</li>
                <li>• Gestion du state et des props</li>
                <li>• Hooks React (useState, useEffect, useContext...)</li>
                <li>• Routing avec React Router</li>
                <li>• Gestion d'état avec Redux</li>
                <li>• Tests unitaires avec Jest</li>
                <li>• Déploiement d'applications React</li>
              </ul>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du cours</h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {module.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.duration}</p>
                      </div>
                    </div>
                    <Play className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">89€</div>
                <div className="text-sm text-gray-500 line-through">129€</div>
                <div className="text-sm text-green-600 font-medium">Économisez 40€</div>
              </div>
              
              <Button className="w-full bg-pink-600 hover:bg-pink-700 mb-4">
                S'inscrire maintenant
              </Button>
              
              <div className="text-center text-sm text-gray-600 mb-6">
                Garantie satisfait ou remboursé 30 jours
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ce cours inclut :</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                    <span>18 heures de contenu vidéo</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Ressources téléchargeables</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Certificat de completion</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Accès à vie</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Instructeur</h3>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Instructeur"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Jean Dupont</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>4.8 (2,350 avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
