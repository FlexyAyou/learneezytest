
import React, { useState } from 'react';
import { Clock, Users, Star, Filter, Search, Grid, List, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Mathématiques - Les Fractions",
      instructor: "Marie Dubois",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h",
      students: 45,
      rating: 4.8,
      price: "25€",
      originalPrice: "35€",
      level: "CM1",
      category: "Mathématiques",
      cycle: "élémentaire",
      availableSlots: 12,
      description: "Comprenez les fractions avec des exemples concrets et des exercices ludiques adaptés au niveau CM1."
    },
    {
      id: 2,
      title: "Français - Analyse de Texte",
      instructor: "Paul Martin",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 38,
      rating: 4.9,
      price: "30€",
      originalPrice: "40€",
      level: "6ème",
      category: "Français",
      cycle: "secondaire",
      availableSlots: 8,
      description: "Apprenez à analyser un texte littéraire et à identifier les figures de style au niveau collège."
    },
    {
      id: 3,
      title: "Sciences - Les États de la Matière",
      instructor: "Sophie Laurent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "1h",
      students: 52,
      rating: 4.7,
      price: "28€",
      originalPrice: "38€",
      level: "CE2",
      category: "Sciences",
      cycle: "élémentaire",
      availableSlots: 15,
      description: "Découvrez les différents états de la matière à travers des expériences simples et amusantes."
    },
    {
      id: 4,
      title: "Histoire-Géographie - La Révolution Française",
      instructor: "Lucas Petit",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h15",
      students: 41,
      rating: 4.6,
      price: "32€",
      originalPrice: "42€",
      level: "4ème",
      category: "Histoire-Géographie",
      cycle: "secondaire",
      availableSlots: 6,
      description: "Plongez dans l'histoire de la Révolution française et comprenez ses enjeux politiques et sociaux."
    },
    {
      id: 5,
      title: "Anglais - Les Temps du Passé",
      instructor: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
      duration: "1h",
      students: 67,
      rating: 4.8,
      price: "26€",
      originalPrice: "36€",
      level: "5ème",
      category: "Anglais",
      cycle: "secondaire",
      availableSlots: 10,
      description: "Maîtrisez l'utilisation du preterit et du present perfect en anglais avec des exercices pratiques."
    },
    {
      id: 6,
      title: "Physique-Chimie - Les Réactions Chimiques",
      instructor: "Thomas Roux",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 29,
      rating: 4.9,
      price: "35€",
      originalPrice: "45€",
      level: "3ème",
      category: "Physique-Chimie",
      cycle: "secondaire",
      availableSlots: 5,
      description: "Explorez les réactions chimiques fondamentales et leurs applications dans la vie quotidienne."
    },
    {
      id: 7,
      title: "Mathématiques - Calcul Littéral",
      instructor: "Alex Durand", 
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h15",
      students: 33,
      rating: 4.7,
      price: "30€",
      originalPrice: "40€",
      level: "2nde",
      category: "Mathématiques",
      cycle: "secondaire",
      availableSlots: 7,
      description: "Développez vos compétences en calcul littéral et résolution d'équations au niveau seconde."
    },
    {
      id: 8,
      title: "SVT - La Génétique",
      instructor: "Julie Bernard",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 24,
      rating: 4.6,
      price: "38€",
      originalPrice: "48€",
      level: "1ère",
      category: "SVT",
      cycle: "secondaire",
      availableSlots: 4,
      description: "Comprenez les bases de la génétique et de l'hérédité avec des exemples concrets et actuels."
    },
    {
      id: 9,
      title: "Lecture - Compréhension de Texte",
      instructor: "Camille Moreau",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "45min",
      students: 78,
      rating: 4.9,
      price: "20€",
      originalPrice: "28€",
      level: "CP",
      category: "Français",
      cycle: "élémentaire",
      availableSlots: 20,
      description: "Améliorez la compréhension de lecture avec des textes adaptés au niveau CP."
    },
    {
      id: 10,
      title: "Arts Plastiques - Techniques de Dessin",
      instructor: "Pierre Dubois",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
      duration: "2h",
      students: 15,
      rating: 4.8,
      price: "45€",
      originalPrice: "55€",
      level: "Terminale",
      category: "Arts",
      cycle: "secondaire",
      availableSlots: 3,
      description: "Perfectionnez vos techniques de dessin et explorez différents styles artistiques."
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les matières' },
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Histoire-Géographie', label: 'Histoire-Géographie' },
    { value: 'Sciences', label: 'Sciences' },
    { value: 'Physique-Chimie', label: 'Physique-Chimie' },
    { value: 'SVT', label: 'SVT' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Sport', label: 'Sport' }
  ];

  const levels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'CP', label: 'CP' },
    { value: 'CE1', label: 'CE1' },
    { value: 'CE2', label: 'CE2' },
    { value: 'CM1', label: 'CM1' },
    { value: 'CM2', label: 'CM2' },
    { value: '6ème', label: '6ème' },
    { value: '5ème', label: '5ème' },
    { value: '4ème', label: '4ème' },
    { value: '3ème', label: '3ème' },
    { value: '2nde', label: '2nde' },
    { value: '1ère', label: '1ère' },
    { value: 'Terminale', label: 'Terminale' }
  ];

  const cycles = [
    { value: 'all', label: 'Tous les cycles' },
    { value: 'élémentaire', label: 'Élémentaire' },
    { value: 'secondaire', label: 'Secondaire' }
  ];

  const getBadgeColor = (level: string) => {
    if (['CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(level)) {
      return 'bg-green-100 text-green-800';
    } else if (['6ème', '5ème', '4ème', '3ème'].includes(level)) {
      return 'bg-blue-100 text-blue-800';
    } else if (['2nde', '1ère', 'Terminale'].includes(level)) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getCycleColor = (cycle: string) => {
    switch (cycle) {
      case 'élémentaire': return 'bg-green-50 text-green-700 border-green-200';
      case 'secondaire': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesCycle = selectedCycle === 'all' || course.cycle === selectedCycle;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesCycle;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Catalogue de Formations & Réservation de Cours
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez nos cours personnalisés du primaire au lycée. Réservez directement vos créneaux avec nos formateurs qualifiés.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center flex-wrap">
              <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map(cycle => (
                    <SelectItem key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Matière" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-600">
            {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Courses Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getBadgeColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className={getCycleColor(course.cycle)}>
                        {course.cycle}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="outline" className="bg-white/90 text-gray-800">
                        {course.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-3">Par {course.instructor}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {course.availableSlots} créneaux
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-blue-600">
                          {course.price}
                        </div>
                        <div className="text-sm text-gray-400 line-through">
                          {course.originalPrice}
                        </div>
                      </div>
                      <Link to={`/cours/${course.id}/reservation`}>
                        <Button className="bg-pink-600 hover:bg-blue-700">
                          <Calendar className="h-4 w-4 mr-1" />
                          Réserver
                        </Button>
                      </Link>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getBadgeColor(course.level)}>
                            {course.level}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className={getCycleColor(course.cycle)}>
                            {course.cycle}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-white/90 text-gray-800">
                            {course.category}
                          </Badge>
                        </div>
                      </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mb-3">Par {course.instructor}</p>
                          <p className="text-gray-500 mb-4">
                            {course.description}
                          </p>

                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.students} étudiants
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {course.availableSlots} créneaux
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                              {course.rating}
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {course.price}
                          </div>
                          <div className="text-sm text-gray-400 line-through mb-4">
                            {course.originalPrice}
                          </div>
                          <Link to={`/cours/${course.id}/reservation`}>
                            <Button className="bg-pink-600 hover:bg-blue-700">
                              <Calendar className="h-4 w-4 mr-1" />
                              Réserver
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
