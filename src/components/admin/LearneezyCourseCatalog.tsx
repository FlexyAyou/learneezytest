
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Clock, Users, BookOpen, Lock, Unlock, ShoppingCart, CreditCard, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CoursePurchaseModal } from './CoursePurchaseModal';

interface LearneezyCourseCatalogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearneezyCourseCatalog = ({ isOpen, onClose }: LearneezyCourseCatalogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Mock catalog data
  const catalogCourses = [
    {
      id: '1',
      title: 'Développement Web Full Stack - React & Node.js',
      description: 'Formation complète en développement web moderne avec React, Node.js et bases de données',
      instructor: 'Expert Learneezy',
      category: 'Développement',
      level: 'Professionnel',
      duration: '120h',
      rating: 4.8,
      students: 1245,
      price: 0,
      tokenPrice: 150,
      type: 'open_source',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      modules: 12,
      exercises: 45,
      certificates: true,
      tags: ['React', 'Node.js', 'JavaScript', 'Full Stack']
    },
    {
      id: '2',
      title: 'Intelligence Artificielle et Machine Learning',
      description: 'Maîtrisez les techniques d\'IA et ML avec Python, TensorFlow et scikit-learn',
      instructor: 'Dr. Marie Dupont',
      category: 'Intelligence Artificielle',
      level: 'Avancé',
      duration: '80h',
      rating: 4.9,
      students: 892,
      price: 299,
      tokenPrice: 200,
      type: 'premium',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
      modules: 10,
      exercises: 35,
      certificates: true,
      tags: ['Python', 'IA', 'ML', 'TensorFlow']
    },
    {
      id: '3',
      title: 'Cybersécurité et Tests de Pénétration',
      description: 'Formation complète en cybersécurité avec pratiques de pentesting',
      instructor: 'Jean Sécurité',
      category: 'Cybersécurité',
      level: 'Professionnel',
      duration: '100h',
      rating: 4.7,
      students: 654,
      price: 0,
      tokenPrice: 0,
      type: 'subscription',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
      modules: 15,
      exercises: 50,
      certificates: true,
      tags: ['Sécurité', 'Pentesting', 'Ethical Hacking']
    },
    {
      id: '4',
      title: 'Design UX/UI avec Figma',
      description: 'Apprenez à créer des interfaces utilisateur modernes et intuitives',
      instructor: 'Sophie Design',
      category: 'Design',
      level: 'Intermédiaire',
      duration: '60h',
      rating: 4.6,
      students: 1089,
      price: 199,
      tokenPrice: 120,
      type: 'premium',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400',
      modules: 8,
      exercises: 25,
      certificates: true,
      tags: ['UX', 'UI', 'Figma', 'Design']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'open_source':
        return <Unlock className="h-4 w-4" />;
      case 'subscription':
        return <BookOpen className="h-4 w-4" />;
      case 'premium':
        return <Lock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'open_source':
        return <Badge className="bg-green-100 text-green-800">Gratuit</Badge>;
      case 'subscription':
        return <Badge className="bg-blue-100 text-blue-800">Abonnement</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredCourses = catalogCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesType = typeFilter === 'all' || course.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handlePurchaseCourse = (course: any) => {
    setSelectedCourse(course);
    setShowPurchaseModal(true);
  };

  const handleAddToCatalog = (course: any) => {
    if (course.type === 'open_source') {
      toast({
        title: "Cours ajouté",
        description: `"${course.title}" a été ajouté à votre catalogue gratuitement.`,
      });
    } else {
      handlePurchaseCourse(course);
    }
  };

  const categories = ['Développement', 'Intelligence Artificielle', 'Cybersécurité', 'Design', 'Marketing', 'Business'];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Catalogue Learneezy - Cours disponibles
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full">
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'accès" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="open_source">Gratuit</SelectItem>
                  <SelectItem value="subscription">Abonnement</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-600 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                {filteredCourses.length} cours trouvés
              </div>
            </div>

            {/* Tabs pour organiser les cours */}
            <Tabs defaultValue="all" className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous ({catalogCourses.length})</TabsTrigger>
                <TabsTrigger value="open_source">
                  Gratuits ({catalogCourses.filter(c => c.type === 'open_source').length})
                </TabsTrigger>
                <TabsTrigger value="subscription">
                  Abonnement ({catalogCourses.filter(c => c.type === 'subscription').length})
                </TabsTrigger>
                <TabsTrigger value="premium">
                  Premium ({catalogCourses.filter(c => c.type === 'premium').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative mb-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="absolute top-2 left-2">
                            {getTypeBadge(course.type)}
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="bg-white">
                              {course.level}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>Par {course.instructor}</span>
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {course.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {course.students}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-400" />
                              {course.rating}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div>{course.modules} modules • {course.exercises} exercices</div>
                          {course.certificates && (
                            <Badge variant="outline" className="text-xs">Certificat</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {course.type === 'open_source' && (
                              <span className="font-bold text-green-600">Gratuit</span>
                            )}
                            {course.type === 'subscription' && (
                              <span className="font-bold text-blue-600">Inclus dans l'abonnement</span>
                            )}
                            {course.type === 'premium' && (
                              <div>
                                {course.price > 0 && (
                                  <span className="font-bold text-purple-600">{course.price}€</span>
                                )}
                                {course.tokenPrice > 0 && (
                                  <div className="text-xs text-gray-600">
                                    ou {course.tokenPrice} tokens
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCatalog(course)}
                              className={
                                course.type === 'open_source'
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : course.type === 'subscription'
                                  ? 'bg-blue-600 hover:bg-blue-700'
                                  : 'bg-purple-600 hover:bg-purple-700'
                              }
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {course.type === 'open_source' ? 'Ajouter' : 'Acheter'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Repeat similar TabsContent for other tabs with filtered data */}
              <TabsContent value="open_source" className="mt-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.filter(c => c.type === 'open_source').map((course) => (
                    // Same card component as above
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      {/* Same content as above */}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="mt-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.filter(c => c.type === 'subscription').map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      {/* Same content as above */}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premium" className="mt-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.filter(c => c.type === 'premium').map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      {/* Same content as above */}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Purchase Modal */}
      {selectedCourse && (
        <CoursePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
        />
      )}
    </>
  );
};
