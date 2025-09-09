import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Award, Users as UsersIcon, Coins, Star, Clock, Users, BookOpen, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import CourseCard from '@/components/CourseCard';
import TrainerCard from '@/components/TrainerCard';
import TrainerBookingModal from '@/components/TrainerBookingModal';

// Données mockées adaptées de /nos-formations
const courses = [
  {
    id: 1,
    title: "Mathématiques - Les Fractions",
    instructor: "Marie Dubois",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    duration: "1h",
    students: 45,
    rating: 4.8,
    price: "83 tokens",
    originalPrice: "117 tokens",
    level: "CM1",
    category: "Mathématiques",
    cycle: "élémentaire",
    availableSlots: 12,
    description: "Comprenez les fractions avec des exemples concrets et des exercices ludiques adaptés au niveau CM1.",
    completed: true
  },
  {
    id: 2,
    title: "Français - Analyse de Texte",
    instructor: "Paul Martin",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
    duration: "1h30",
    students: 38,
    rating: 4.9,
    price: "100 tokens",
    originalPrice: "133 tokens",
    level: "6ème",
    category: "Français",
    cycle: "secondaire",
    availableSlots: 8,
    description: "Apprenez à analyser un texte littéraire et à identifier les figures de style au niveau collège.",
    completed: false
  },
  {
    id: 3,
    title: "Sciences - Les États de la Matière",
    instructor: "Sophie Laurent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    duration: "1h",
    students: 52,
    rating: 4.7,
    price: "93 tokens",
    originalPrice: "127 tokens",
    level: "CE2",
    category: "Sciences",
    cycle: "élémentaire",
    availableSlots: 15,
    description: "Découvrez les différents états de la matière à travers des expériences simples et amusantes.",
    completed: true
  },
  {
    id: 4,
    title: "Histoire-Géographie - La Révolution Française",
    instructor: "Lucas Petit",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    duration: "1h15",
    students: 41,
    rating: 4.6,
    price: "107 tokens",
    originalPrice: "140 tokens",
    level: "4ème",
    category: "Histoire-Géographie",
    cycle: "secondaire",
    availableSlots: 6,
    description: "Plongez dans l'histoire de la Révolution française et comprenez ses enjeux politiques et sociaux.",
    completed: false
  },
  {
    id: 5,
    title: "Anglais - Les Temps du Passé",
    instructor: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    duration: "1h",
    students: 67,
    rating: 4.8,
    price: "87 tokens",
    originalPrice: "120 tokens",
    level: "5ème",
    category: "Anglais",
    cycle: "secondaire",
    availableSlots: 10,
    description: "Maîtrisez l'utilisation du preterit et du present perfect en anglais avec des exercices pratiques.",
    completed: false
  }
];

// Données des formateurs
const trainers = [
  {
    id: 1,
    name: "Marie Dubois",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialty: "Mathématiques",
    description: "Formatrice experte en mathématiques avec 10 ans d'expérience dans l'enseignement personnalisé.",
    experience: "10 ans",
    rating: 4.9,
    languages: ["Français", "Anglais"],
    supportType: "Tutorat",
    availableSlots: [
      { day: "Lundi", time: "14h-16h" },
      { day: "Mercredi", time: "10h-12h" },
      { day: "Vendredi", time: "16h-18h" }
    ],
    hourlyRate: "117 tokens/h"
  },
  {
    id: 2,
    name: "Paul Martin",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialty: "Français",
    description: "Spécialiste en littérature française et techniques de rédaction pour tous niveaux.",
    experience: "8 ans",
    rating: 4.8,
    languages: ["Français"],
    supportType: "Coaching",
    availableSlots: [
      { day: "Mardi", time: "9h-11h" },
      { day: "Jeudi", time: "14h-16h" },
      { day: "Samedi", time: "10h-12h" }
    ],
    hourlyRate: "107 tokens/h"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialty: "Sciences",
    description: "Docteure en biologie, passionnée par la transmission des sciences naturelles.",
    experience: "12 ans",
    rating: 4.9,
    languages: ["Français", "Anglais", "Espagnol"],
    supportType: "Soutien technique",
    availableSlots: [
      { day: "Lundi", time: "10h-12h" },
      { day: "Mercredi", time: "14h-16h" },
      { day: "Vendredi", time: "9h-11h" }
    ],
    hourlyRate: "133 tokens/h"
  }
];

const StudentCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('all');
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // États pour la section formateurs
  const [trainerSearchTerm, setTrainerSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showAllTrainers, setShowAllTrainers] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Données mockées pour l'utilisateur
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

  const educationLevels = [
    { value: 'all', label: 'Tous les niveaux d\'études' },
    { value: 'scolaire', label: 'Formation Scolaire (Primaire - Lycée)' },
    { value: 'superieur', label: 'Enseignement Supérieur' },
    { value: 'professionnel', label: 'Formation Professionnelle' },
    { value: 'continue', label: 'Formation Continue / Reconversion' }
  ];

  const categories = [
    { value: 'all', label: 'Tous les domaines' },
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Langues Étrangères' },
    { value: 'Sciences', label: 'Sciences et Recherche' },
    { value: 'Histoire-Géographie', label: 'Sciences Humaines' },
    { value: 'Arts', label: 'Arts et Créativité' }
  ];

  const specialties = [
    { value: 'all', label: 'Toutes les spécialités' },
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Histoire-Géographie', label: 'Histoire-Géographie' },
    { value: 'Sciences', label: 'Sciences' }
  ];

  const languages = [
    { value: 'all', label: 'Toutes les langues' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Espagnol', label: 'Espagnol' }
  ];

  const handleTrainerBooking = (trainer: any) => {
    setSelectedTrainer(trainer);
    setIsBookingModalOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesEducationLevel = selectedEducationLevel === 'all' || 
      (selectedEducationLevel === 'scolaire' && (course.cycle === 'élémentaire' || course.cycle === 'secondaire'));
    
    return matchesSearch && matchesCategory && matchesEducationLevel;
  });

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
                         trainer.specialty.toLowerCase().includes(trainerSearchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || trainer.specialty === selectedSpecialty;
    const matchesLanguage = selectedLanguage === 'all' || trainer.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  // Convertir le prix en tokens pour affichage
  const extractTokenPrice = (priceString: string) => {
    return parseInt(priceString.replace(' tokens', ''));
  };

  const handleCoursePurchase = (course: any) => {
    const tokenPrice = extractTokenPrice(course.price);
    if (tokenBalance >= tokenPrice) {
      setTokenBalance(prev => prev - tokenPrice);
      setPurchasedCourses(prev => [...prev, course.id]);
      toast.success(`Cours "${course.title}" acheté avec succès pour ${tokenPrice} tokens !`);
    } else {
      toast.error('Solde de tokens insuffisant');
    }
  };

  const handleTrainerBookingConfirm = (trainer: any, slot: any, notes: string = '') => {
    const hourlyRate = parseInt(trainer.hourlyRate.replace(' tokens/h', ''));
    const sessionCost = hourlyRate; // 1 heure par défaut
    
    if (tokenBalance >= sessionCost) {
      setTokenBalance(prev => prev - sessionCost);
      toast.success(`Séance réservée avec ${trainer.name} pour ${sessionCost} tokens !`);
      setIsBookingModalOpen(false);
      setSelectedTrainer(null);
    } else {
      toast.error('Solde de tokens insuffisant');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Catalogue de Formations & Réservation de Cours
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez nos cours personnalisés du primaire au lycée. Réservez directement vos créneaux avec nos formateurs qualifiés.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Coins className="h-8 w-8" />
                {tokenBalance}
              </div>
              <p className="text-blue-100 text-sm">Tokens disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal - Sections verticales */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Section 1 - Catalogue de Formations */}
            <Card className="p-6 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-pink-600 flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  Catalogue de formations disponibles
                </CardTitle>
                <CardDescription>
                  Explorez nos formations en ligne et choisissez celle qui vous convient
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Filtres pour les formations */}
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher une formation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Niveau d'études" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Domaine" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                 {/* Grille des formations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 6)).map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      onPurchase={() => handleCoursePurchase(course)}
                      isPurchased={purchasedCourses.includes(course.id)}
                      userTokenBalance={tokenBalance}
                    />
                  ))}
                </div>

                {filteredCourses.length > 6 && (
                  <div className="text-center mt-6">
                    <Button 
                      onClick={() => setShowAllCourses(!showAllCourses)}
                      variant="outline"
                    >
                      {showAllCourses ? 'Voir moins' : `Voir toutes les formations (${filteredCourses.length})`}
                    </Button>
                  </div>
                )}

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune formation trouvée
                    </h3>
                    <p className="text-gray-500">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2 - Réservation de Cours avec Formateurs */}
            <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-purple-600 flex items-center">
                  <UsersIcon className="h-6 w-6 mr-2" />
                  Réservation de cours individuels
                </CardTitle>
                <CardDescription>
                  Réservez des créneaux personnalisés avec nos formateurs qualifiés
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Filtres pour les formateurs */}
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un formateur..."
                      value={trainerSearchTerm}
                      onChange={(e) => setTrainerSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.value}>
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Grille des formateurs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(showAllTrainers ? filteredTrainers : filteredTrainers.slice(0, 6)).map((trainer) => (
                    <TrainerCard 
                      key={trainer.id} 
                      trainer={trainer} 
                      onBooking={handleTrainerBooking}
                    />
                  ))}
                </div>

                {filteredTrainers.length > 6 && (
                  <div className="text-center mt-6">
                    <Button 
                      onClick={() => setShowAllTrainers(!showAllTrainers)}
                      variant="outline"
                    >
                      {showAllTrainers ? 'Voir moins' : `Voir tous les formateurs (${filteredTrainers.length})`}
                    </Button>
                  </div>
                )}

                {filteredTrainers.length === 0 && (
                  <div className="text-center py-12">
                    <UsersIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun formateur trouvé
                    </h3>
                    <p className="text-gray-500">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal de réservation */}
      {selectedTrainer && (
        <TrainerBookingModal
          trainer={selectedTrainer}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedTrainer(null);
          }}
          onBookingConfirm={handleTrainerBookingConfirm}
          userTokenBalance={tokenBalance}
        />
      )}
    </div>
  );
};

export default StudentCatalog;