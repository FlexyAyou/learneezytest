
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Clock, Users, BookOpen, Lock, Unlock, ShoppingCart, CreditCard, Eye, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CoursePurchaseModal } from './CoursePurchaseModal';
import { fastAPIClient } from '@/services/fastapi-client';
import { useEffect } from 'react';

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

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        const data = await fastAPIClient.getGlobalCatalogue(1, 100);
        const formattedCourses = data.map(c => ({
          ...c,
          category: c.category || 'Général',
          instructor: 'Learneezy',
          type: c.is_open_source ? 'open_source' : 'premium',
          price: c.price || 0,
          tokenPrice: c.token_price || 0,
          students: Math.floor(Math.random() * 1000) + 100,
          rating: 4.5 + Math.random() * 0.5,
          duration: c.duration || '10h',
          thumbnail: c.image_url || 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
          modules: 0,
          exercises: 0,
          certificates: true,
          tags: []
        }));
        setCourses(formattedCourses);
      } catch (err) {
        console.error('Error loading catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, [isOpen]);

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

  const filteredCourses = courses.filter(course => {
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

  const handleAddToCatalog = async (course: any) => {
    if (course.type === 'open_source') {
      try {
        await fastAPIClient.addCourseToOFCatalogue(course.id);
        toast({
          title: "Cours ajouté",
          description: `"${course.title}" a été ajouté à votre offre de formation. Vous pouvez maintenant l'assigner à vos apprenants.`,
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter ce cours à votre catalogue.",
          variant: "destructive"
        });
      }
    } else {
      handlePurchaseCourse(course);
    }
  };

  const categories = ['Développement', 'Intelligence Artificielle', 'Cybersécurité', 'Design', 'Marketing', 'Business'];

  const renderCourseCard = (course: any) => (
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
          {course.tags.slice(0, 3).map((tag: string) => (
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
              {course.type === 'open_source' ? 'Ajouter au catalogue' : 'Acheter'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

          <div className="flex flex-col h-full overflow-hidden">
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shrink-0">
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

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                <p className="text-sm text-gray-500">Chargement du catalogue...</p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-4 shrink-0">
                  <TabsTrigger value="all">Tous ({courses.length})</TabsTrigger>
                  <TabsTrigger value="open_source">
                    Gratuits ({courses.filter(c => c.type === 'open_source').length})
                  </TabsTrigger>
                  <TabsTrigger value="subscription">
                    Abonnement ({courses.filter(c => c.type === 'subscription').length})
                  </TabsTrigger>
                  <TabsTrigger value="premium">
                    Premium ({courses.filter(c => c.type === 'premium').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredCourses.map((course) => renderCourseCard(course))}
                  </div>
                </TabsContent>

                <TabsContent value="open_source" className="mt-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredCourses.filter(c => c.type === 'open_source').map((course) => renderCourseCard(course))}
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="mt-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredCourses.filter(c => c.type === 'subscription').map((course) => renderCourseCard(course))}
                  </div>
                </TabsContent>

                <TabsContent value="premium" className="mt-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredCourses.filter(c => c.type === 'premium').map((course) => renderCourseCard(course))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
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
