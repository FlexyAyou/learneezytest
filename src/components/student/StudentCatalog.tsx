import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, Coins, Star, Clock, Users, BookOpen, Award, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  image: string;
  duration: string;
  students: number;
  rating: number;
  category: string;
  level: string;
  type: 'free' | 'paid' | 'subscription';
  price?: number; // en tokens pour les cours payants
  requiredPlan?: 'basic' | 'premium' | 'enterprise';
  tags: string[];
}

// Données mockées
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction à React",
    description: "Apprenez les bases de React et créez vos premières applications",
    instructor: "Marie Dubois",
    image: "/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png",
    duration: "4h 30min",
    students: 1250,
    rating: 4.8,
    category: "Développement",
    level: "Débutant",
    type: "free",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    title: "JavaScript Avancé",
    description: "Maîtrisez les concepts avancés de JavaScript",
    instructor: "Paul Martin",
    image: "/lovable-uploads/a2af7b26-415f-4b76-ad63-bb8cbc351c0c.png",
    duration: "8h 45min",
    students: 890,
    rating: 4.9,
    category: "Développement",
    level: "Avancé",
    type: "paid",
    price: 150,
    tags: ["JavaScript", "ES6+", "Async"]
  },
  {
    id: 3,
    title: "Design UX/UI Professionnel",
    description: "Créez des interfaces utilisateur exceptionnelles",
    instructor: "Sophie Legrand",
    image: "/lovable-uploads/a9b8c406-3405-4199-a624-50e2fac8b945.png",
    duration: "12h 20min",
    students: 650,
    rating: 4.7,
    category: "Design",
    level: "Intermédiaire",
    type: "subscription",
    requiredPlan: "premium",
    tags: ["UX", "UI", "Figma", "Design"]
  },
  {
    id: 4,
    title: "Python pour la Data Science",
    description: "Analysez vos données avec Python et pandas",
    instructor: "Thomas Bernard",
    image: "/lovable-uploads/35025812-1694-4fb2-aa20-1b03dae12929.png",
    duration: "15h 10min",
    students: 420,
    rating: 4.6,
    category: "Data Science",
    level: "Intermédiaire",
    type: "paid",
    price: 200,
    tags: ["Python", "Pandas", "Data Analysis"]
  }
];

const StudentCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Données mockées pour l'utilisateur
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);
  const studentPlan = 'premium'; // basic, premium, enterprise

  const categories = ['Tous', 'Développement', 'Design', 'Data Science', 'Marketing', 'Business'];
  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'Tous' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getCourseTypeColor = (type: Course['type']) => {
    switch (type) {
      case 'free': return 'bg-green-500 text-white';
      case 'paid': return 'bg-blue-500 text-white';
      case 'subscription': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCourseTypeLabel = (course: Course) => {
    switch (course.type) {
      case 'free': return 'Gratuit';
      case 'paid': return `${course.price} tokens`;
      case 'subscription': return `Plan ${course.requiredPlan}`;
      default: return '';
    }
  };

  const canAccessCourse = (course: Course) => {
    if (course.type === 'free') return true;
    if (course.type === 'paid') return purchasedCourses.includes(course.id) || tokenBalance >= (course.price || 0);
    if (course.type === 'subscription') {
      const plans = ['basic', 'premium', 'enterprise'];
      const userPlanIndex = plans.indexOf(studentPlan);
      const requiredPlanIndex = plans.indexOf(course.requiredPlan || 'basic');
      return userPlanIndex >= requiredPlanIndex;
    }
    return false;
  };

  const handleCoursePurchase = (course: Course) => {
    if (course.type === 'paid' && course.price) {
      setSelectedCourse(course);
      setIsPurchaseModalOpen(true);
    }
  };

  const confirmCoursePurchase = () => {
    if (selectedCourse && selectedCourse.price) {
      if (tokenBalance >= selectedCourse.price) {
        setTokenBalance(prev => prev - selectedCourse.price!);
        setPurchasedCourses(prev => [...prev, selectedCourse.id]);
        setIsPurchaseModalOpen(false);
        toast.success(`Cours "${selectedCourse.title}" acheté avec succès !`);
      } else {
        toast.error('Solde de tokens insuffisant');
      }
    }
  };

  const getActionButton = (course: Course) => {
    if (course.type === 'free') {
      return (
        <Button size="sm" className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Commencer
        </Button>
      );
    }

    if (course.type === 'paid') {
      if (purchasedCourses.includes(course.id)) {
        return (
          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Accéder au cours
          </Button>
        );
      } else {
        return (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleCoursePurchase(course)}
            disabled={tokenBalance < (course.price || 0)}
          >
            <Coins className="h-4 w-4 mr-2" />
            Acheter avec tokens
          </Button>
        );
      }
    }

    if (course.type === 'subscription') {
      if (canAccessCourse(course)) {
        return (
          <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Accéder au cours
          </Button>
        );
      } else {
        return (
          <Button size="sm" variant="outline" className="w-full" disabled>
            <Award className="h-4 w-4 mr-2" />
            Upgrade requis
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec solde de tokens */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Catalogue de Formation</h1>
            <p className="text-blue-100">Découvrez notre sélection de cours</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Coins className="h-8 w-8" />
              {tokenBalance}
            </div>
            <p className="text-blue-100 text-sm">Tokens disponibles</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grille des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 left-3">
                <Badge className={getCourseTypeColor(course.type)}>
                  {getCourseTypeLabel(course)}
                </Badge>
              </div>
              {!canAccessCourse(course) && course.type === 'subscription' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Plan {course.requiredPlan} requis</p>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {course.description}
              </p>
              
              <p className="text-sm font-medium mb-3">Par {course.instructor}</p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {getActionButton(course)}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun cours trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}

      {/* Modal de confirmation d'achat */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'achat</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'acheter ce cours avec vos tokens.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{selectedCourse.title}</h3>
                  <p className="text-sm text-muted-foreground">Par {selectedCourse.instructor}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Prix du cours:</span>
                  <span className="font-semibold">{selectedCourse.price} tokens</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Solde actuel:</span>
                  <span>{tokenBalance} tokens</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Solde après achat:</span>
                  <span>{tokenBalance - (selectedCourse.price || 0)} tokens</span>
                </div>
              </div>
              
              {tokenBalance < (selectedCourse.price || 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">
                    Solde insuffisant. Vous avez besoin de {(selectedCourse.price || 0) - tokenBalance} tokens supplémentaires.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPurchaseModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmCoursePurchase}
              disabled={!selectedCourse || tokenBalance < (selectedCourse.price || 0)}
            >
              <Coins className="h-4 w-4 mr-2" />
              Confirmer l'achat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentCatalog;