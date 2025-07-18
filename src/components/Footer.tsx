
import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-pink-400" />
              <span className="text-2xl font-bold">InfinitiaX</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Votre plateforme d'apprentissage en ligne pour développer vos compétences 
              et booster votre carrière avec des formations de qualité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              <li><a href="#accueil" className="text-gray-400 hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#cours" className="text-gray-400 hover:text-white transition-colors">Nos Cours</a></li>
              <li><a href="#apropos" className="text-gray-400 hover:text-white transition-colors">À Propos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instructeurs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carrières</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6">Catégories</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Développement Web</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Intelligence Artificielle</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Design UX/UI</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing Digital</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cybersécurité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Data Science</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">123 Rue de l'Innovation, 75001 Paris, France</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <a href="mailto:contact@infinitiaX.fr" className="text-gray-400 hover:text-white transition-colors">
                  contact@infinitiaX.fr
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-bold mb-3">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                />
                <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2024 UpSkill. Tous droits réservés.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Politique de Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Conditions d'Utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
