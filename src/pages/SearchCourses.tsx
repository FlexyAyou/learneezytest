
import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Users, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

const SearchCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Développement Web', 'Data Science', 'Design', 'Marketing', 
    'Business', 'Langues', 'Photographie', 'Musique'
  ];

  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];
  const durations = ['< 2 heures', '2-5 heures', '5-10 heures', '> 10 heures'];
  const ratings = [4.5, 4.0, 3.5, 3.0];

  const courses = [
    {
      id: 1,
      title: "Maîtrise complète de React.js",
      instructor: "Marie Dubois",
      category: "Développement Web",
      level: "Intermédiaire",
      rating: 4.8,
      students: 1250,
      duration: "12 heures",
      price: 89,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
      description: "Apprenez React.js de A à Z avec des projets pratiques"
    },
    {
      id: 2,
      title: "SVP pour débutants",
      instructor: "Pierre Martin",
      category: "Design",
      level: "Débutant",
      rating: 4.6,
      students: 890,
      duration: "8 heures",
      price: 69,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop",
      description: "Maîtrisez les principes du SVP"
    },
    {
      id: 3,
      title: "Python pour la Data Science",
      instructor: "Sophie Leroy",
      category: "Data Science",
      level: "Intermédiaire",
      rating: 4.9,
      students: 2100,
      duration: "15 heures",
      price: 129,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop",
      description: "Analysez des données avec Python et ses librairies"
    },
    {
      id: 4,
      title: "Marketing Digital Avancé",
      instructor: "Jean Dupont",
      category: "Marketing",
      level: "Avancé",
      rating: 4.4,
      students: 756,
      duration: "10 heures",
      price: 99,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      description: "Stratégies avancées de marketing numérique"
    },
    {
      id: 5,
      title: "Photographie Professionnelle",
      instructor: "Claire Moreau",
      category: "Photographie",
      level: "Débutant",
      rating: 4.7,
      students: 543,
      duration: "6 heures",
      price: 79,
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop",
      description: "Maîtrisez l'art de la photographie"
    },
    {
      id: 6,
      title: "Développement Mobile avec Flutter",
      instructor: "Thomas Petit",
      category: "Développement Web",
      level: "Intermédiaire",
      rating: 4.5,
      students: 432,
      duration: "14 heures",
      price: 119,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
      description: "Créez des apps mobiles avec Flutter"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de recherche */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Rechercher des cours</h1>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un cours, instructeur, ou sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            {/* Filtres rapides */}
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <Card className="mt-4">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Durée</h3>
                    <div className="space-y-2">
                      {durations.map(duration => (
                        <div key={duration} className="flex items-center space-x-2">
                          <Checkbox id={duration} />
                          <label htmlFor={duration} className="text-sm">{duration}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Note minimum</h3>
                    <div className="space-y-2">
                      {ratings.map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox id={`rating-${rating}`} />
                          <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {rating} et plus
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Prix</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="free" />
                        <label htmlFor="free" className="text-sm">Gratuit</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="paid" />
                        <label htmlFor="paid" className="text-sm">Payant</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Langue</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="french" defaultChecked />
                        <label htmlFor="french" className="text-sm">Français</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english" />
                        <label htmlFor="english" className="text-sm">Anglais</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Barre de résultats et tri */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} cours trouvés
            {searchTerm && ` pour "${searchTerm}"`}
          </p>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grille de cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-pink-100 text-pink-700">
                  {course.level}
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      par {course.instructor}
                    </CardDescription>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-pink-600">
                    €{course.price}
                  </div>
                  <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                    <Link to={`/cours/${course.id}`}>
                      Voir le cours
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou explorez nos catégories populaires.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCourses;
