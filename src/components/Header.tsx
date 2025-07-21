
import React, { useState } from 'react';
import { Menu, X, BookOpen, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/1f9e89ea-d486-45d5-9888-312555180802.png" alt="Learneezy" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-gray-900">Learneezy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors">Accueil</Link>
            <Link to="/cours" className="text-gray-700 hover:text-pink-600 transition-colors">Cours</Link>
            <Link to="/apropos" className="text-gray-700 hover:text-pink-600 transition-colors">À propos</Link>
            <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</Link>
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <Link to="/connexion">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            </Link>
            <Link to="/inscription">
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Accueil</Link>
              <Link to="/cours" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Cours</Link>
              <Link to="/apropos" className="block px-3 py-2 text-gray-700 hover:text-pink-600">À propos</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Contact</Link>
              <div className="pt-4 border-t">
                <Link to="/connexion">
                  <Button variant="outline" size="sm" className="w-full mb-2">
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
