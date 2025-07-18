
import React, { useState } from 'react';
import { Clock, Users, Star, Filter, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Courses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Développement Web Complet - HTML, CSS, JavaScript et React",
      instructor: "Marie Dubois",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      duration: "40h",
      students: 1250,
      rating: 4.8,
      price: "99€",
      originalPrice: "149€",
      level: "Débutant",
      category: "Développement",
      description: "Apprenez le développement web moderne de A à Z avec HTML5, CSS3, JavaScript ES6+ et React. Formation complète avec projets pratiques."
    },
    {
      id: 2,
      title: "Intelligence Artificielle & Machine Learning avec Python",
      instructor: "Paul Martin",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
      duration: "60h",
      students: 890,
      rating: 4.9,
      price: "149€",
      originalPrice: "199€",
      level: "Intermédiaire",
      category: "IA",
      description: "Maîtrisez les concepts de l'IA et du ML avec Python, TensorFlow et Scikit-learn. Projets concrets et cas d'usage réels."
    },
    {
      id: 3,
      title: "Design UX/UI Modern - Figma et Principes de Design",
      instructor: "Sophie Laurent",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      duration: "25h",
      students: 650,
      rating: 4.7,
      price: "79€",
      originalPrice: "99€",
      level: "Tous niveaux",
      category: "Design",
      description: "Créez des interfaces utilisateur modernes et intuitives avec Figma. Apprenez les principes du design UX/UI."
    },
    {
      id: 4,
      title: "Marketing Digital & Réseaux Sociaux - Stratégies 2024",
      instructor: "Lucas Petit",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      duration: "30h",
      students: 1100,
      rating: 4.6,
      price: "89€",
      originalPrice: "129€",
      level: "Débutant",
      category: "Marketing",
      description: "Développez votre présence en ligne avec les dernières stratégies de marketing digital et réseaux sociaux."
    },
    {
      id: 5,
      title: "Cybersécurité & Ethical Hacking - Protection des Systèmes",
      instructor: "Thomas Roux",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
      duration: "45h",
      students: 780,
      rating: 4.8,
      price: "129€",
      originalPrice: "179€",
      level: "Avancé",
      category: "Sécurité",
      description: "Apprenez à sécuriser les systèmes informatiques et à détecter les vulnérabilités avec les techniques d'ethical hacking."
    },
    {
      id: 6,
      title: "Photographie Professionnelle - Technique et Post-Production",
      instructor: "Emma Moreau",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop",
      duration: "20h",
      students: 420,
      rating: 4.9,
      price: "69€",
      originalPrice: "89€",
      level: "Tous niveaux",
      category: "Créatif",
      description: "Maîtrisez les techniques de photographie professionnelle et la post-production avec Lightroom et Photoshop."
    },
    {
      id: 7,
      title: "Data Science & Analyse de Données avec Python",
      instructor: "Alex Durand",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      duration: "50h",
      students: 950,
      rating: 4.7,
      price: "119€",
      originalPrice: "159€",
      level: "Intermédiaire",
      category: "Data",
      description: "Explorez le monde de la data science avec Python, Pandas, NumPy et les techniques d'analyse de données."
    },
    {
      id: 8,
      title: "Développement Mobile - React Native & Flutter",
      instructor: "Julie Bernard",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      duration: "35h",
      students: 720,
      rating: 4.6,
      price: "109€",
      originalPrice: "139€",
      level: "Intermédiaire",
      category: "Mobile",
      description: "Créez des applications mobiles cross-platform avec React Native et Flutter. Déployez sur iOS et Android."
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Développement', label: 'Développement' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'IA', label: 'Intelligence Artificielle' },
    { value: 'Data', label: 'Data Science' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Sécurité', label: 'Cybersécurité' },
    { value: 'Créatif', label: 'Créatif' }
  ];

  const levels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'Débutant', label: 'Débutant' },
    { value: 'Intermédiaire', label: 'Intermédiaire' },
    { value: 'Avancé', label: 'Avancé' },
    { value: 'Tous niveaux', label: 'Tous niveaux' }
  ];

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Tous nos Cours
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez notre catalogue complet de formations professionnelles. Plus de 1000 cours créés par des experts.
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
            <div className="flex gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Catégorie" />
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
                <SelectTrigger className="w-48">
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
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
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
                      <Button className="bg-pink-600 hover:bg-blue-700">
                        S'inscrire
                      </Button>
                      
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
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
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
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            S'inscrire
                          </Button>
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
