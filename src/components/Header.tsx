
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
            <BookOpen className="h-8 w-8 text-pink-600" />
            <span className="text-2xl font-bold text-gray-900">InfinitiaX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors">Accueil</Link>
            <Link to="/cours" className="text-gray-700 hover:text-pink-600 transition-colors">Cours</Link>
            <Link to="/apropos" className="text-gray-700 hover:text-pink-600 transition-colors">À propos</Link>
            <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</Link>
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-32 lg:w-48 xl:w-56 pl-10 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
            <Link to="/connexion">
              <Button variant="outline" size="sm" className="text-xs lg:text-sm px-3 lg:px-4">
                <User className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Connexion</span>
              </Button>
            </Link>
            <Link to="/inscription">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs lg:text-sm px-3 lg:px-4">
                <span className="hidden sm:inline">S'inscrire</span>
                <span className="sm:hidden">+</span>
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
              <div className="pt-4 border-t space-y-2">
                <div className="px-3 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un cours..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <Link to="/connexion">
                  <Button variant="outline" size="sm" className="w-full mb-2">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
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
