import React, { useState } from 'react';
import { Search, Award, Users as UsersIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import TrainerCard from '@/components/TrainerCard';
import TrainerBookingModal from '@/components/TrainerBookingModal';
import { useLanguage } from '@/contexts/LanguageContext';

const Courses = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudyLevel, setSelectedStudyLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [priceType, setPriceType] = useState('tokens'); // tokens or credits
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // États pour la section formateurs
  const [trainerSearchTerm, setTrainerSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showAllTrainers, setShowAllTrainers] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Mathématiques - Les Fractions",
      instructor: "Marie Dubois",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h",
      students: 45,
      rating: 4.8,
      tokens: 150,
      credits: 12,
      originalTokens: 200,
      originalCredits: 16,
      level: "CM1",
      category: "Mathématiques",
      cycle: "élémentaire",
      studyLevel: "primaire",
      availableSlots: 12,
      description: "Comprenez les fractions avec des exemples concrets et des exercices ludiques adaptés au niveau CM1."
    },
    {
      id: 2,
      title: "Français - Analyse de Texte",
      instructor: "Paul Martin",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 38,
      rating: 4.9,
      tokens: 180,
      credits: 15,
      originalTokens: 240,
      originalCredits: 20,
      level: "6ème",
      category: "Français",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 140,
      credits: 11,
      originalTokens: 190,
      originalCredits: 15,
      level: "CE2",
      category: "Sciences",
      cycle: "élémentaire",
      studyLevel: "primaire",
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
      tokens: 120,
      credits: 9,
      originalTokens: 160,
      originalCredits: 12,
      level: "4ème",
      category: "Histoire-Géographie",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 160,
      credits: 13,
      originalTokens: 220,
      originalCredits: 18,
      level: "5ème",
      category: "Anglais",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 130,
      credits: 10,
      originalTokens: 180,
      originalCredits: 14,
      level: "3ème",
      category: "Physique-Chimie",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 110,
      credits: 8,
      originalTokens: 160,
      originalCredits: 12,
      level: "2nde",
      category: "Mathématiques",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 100,
      credits: 7,
      originalTokens: 150,
      originalCredits: 11,
      level: "1ère",
      category: "SVT",
      cycle: "secondaire",
      studyLevel: "college",
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
      tokens: 80,
      credits: 5,
      originalTokens: 120,
      originalCredits: 7,
      level: "CP",
      category: "Français",
      cycle: "élémentaire",
      studyLevel: "maternelle",
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
      tokens: 90,
      credits: 6,
      originalTokens: 140,
      originalCredits: 10,
      level: "Terminale",
      category: "Arts",
      cycle: "secondaire",
      studyLevel: "lycee",
      availableSlots: 3,
      description: "Perfectionnez vos techniques de dessin et explorez différents styles artistiques."
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
      hourlyRate: "35€/h"
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
      hourlyRate: "32€/h"
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
      hourlyRate: "40€/h"
    },
    {
      id: 4,
      name: "Lucas Petit",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialty: "Histoire-Géographie",
      description: "Historien passionné avec une approche interactive de l'enseignement.",
      experience: "6 ans",
      rating: 4.7,
      languages: ["Français", "Italien"],
      supportType: "Tutorat",
      availableSlots: [
        { day: "Mardi", time: "15h-17h" },
        { day: "Jeudi", time: "10h-12h" },
        { day: "Samedi", time: "14h-16h" }
      ],
      hourlyRate: "30€/h"
    },
    {
      id: 5,
      name: "Emma Wilson",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      specialty: "Anglais",
      description: "Native speaker britannique spécialisée dans l'anglais conversationnel et académique.",
      experience: "9 ans",
      rating: 4.9,
      languages: ["Anglais", "Français"],
      supportType: "Coaching",
      availableSlots: [
        { day: "Lundi", time: "16h-18h" },
        { day: "Mercredi", time: "9h-11h" },
        { day: "Vendredi", time: "14h-16h" }
      ],
      hourlyRate: "38€/h"
    }
  ];

  // Nouveaux niveaux d'étude pour le filtre en entonnoir
  const studyLevels = [
    { value: 'all', label: t('courses.level') },
    { value: 'maternelle', label: 'Maternelle' },
    { value: 'primaire', label: 'Primaire (CP-CM2)' },
    { value: 'college', label: 'Collège (6ème-3ème)' },
    { value: 'lycee', label: 'Lycée (2nde-Terminale)' },
    { value: 'superieur', label: 'Supérieur' }
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

  const specialties = [
    { value: 'all', label: 'Toutes les spécialités' },
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Histoire-Géographie', label: 'Histoire-Géographie' },
    { value: 'Sciences', label: 'Sciences' },
    { value: 'Physique-Chimie', label: 'Physique-Chimie' },
    { value: 'SVT', label: 'SVT' }
  ];

  const languages = [
    { value: 'all', label: 'Toutes les langues' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Espagnol', label: 'Espagnol' },
    { value: 'Italien', label: 'Italien' }
  ];

  const supportTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'Tutorat', label: 'Tutorat' },
    { value: 'Coaching', label: 'Coaching' },
    { value: 'Soutien technique', label: 'Soutien technique' }
  ];

  const handleTrainerBooking = (trainer: any) => {
    setSelectedTrainer(trainer);
    setIsBookingModalOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudyLevel = selectedStudyLevel === 'all' || course.studyLevel === selectedStudyLevel;
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesCycle = selectedCycle === 'all' || course.cycle === selectedCycle;
    
    return matchesSearch && matchesStudyLevel && matchesCategory && matchesLevel && matchesCycle;
  });

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
                         trainer.specialty.toLowerCase().includes(trainerSearchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || trainer.specialty === selectedSpecialty;
    const matchesLanguage = selectedLanguage === 'all' || trainer.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            {t('courses.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('courses.subtitle')}
          </p>
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
                  {t('courses.catalog')}
                </CardTitle>
                <CardDescription>
                  Explorez nos formations en ligne et choisissez celle qui vous convient
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Sélecteur de type de prix */}
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-sm font-medium">Afficher les prix en :</span>
                  <div className="flex gap-2">
                    <Button
                      variant={priceType === 'tokens' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriceType('tokens')}
                      className="flex items-center gap-2"
                    >
                      💰 {t('courses.tokens')}
                    </Button>
                    <Button
                      variant={priceType === 'credits' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriceType('credits')}
                      className="flex items-center gap-2"
                    >
                      🎯 {t('courses.credits')}
                    </Button>
                  </div>
                </div>

                {/* Filtres pour les formations - Filtre en entonnoir */}
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('courses.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filtre principal - Niveau d'étude */}
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-pink-600" />
                    <Badge variant="outline" className="text-pink-600 border-pink-300">
                      Filtre principal
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Select value={selectedStudyLevel} onValueChange={setSelectedStudyLevel}>
                      <SelectTrigger className="border-2 border-pink-200">
                        <SelectValue placeholder={t('courses.level')} />
                      </SelectTrigger>
                      <SelectContent>
                        {studyLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('courses.theme')} />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Niveau précis" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('courses.duration')} />
                      </SelectTrigger>
                      <SelectContent>
                        {cycles.map(cycle => (
                          <SelectItem key={cycle.value} value={cycle.value}>
                            {cycle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Résultats formations - Grille de cartes */}
                <div className="mb-4 text-sm text-gray-600">
                  {filteredCourses.length} {t('courses.found')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 12)).map((course) => (
                    <CourseCard key={course.id} course={course} priceType={priceType} />
                  ))}
                </div>

                {filteredCourses.length > 12 && !showAllCourses && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAllCourses(true)}
                    >
                      {t('courses.viewAll')} ({filteredCourses.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2 - Réservation avec un Formateur */}
            <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-blue-600 flex items-center">
                  <UsersIcon className="h-6 w-6 mr-2" />
                  Réserver un créneau avec un formateur
                </CardTitle>
                <CardDescription>
                  Choisissez votre formateur et réservez un créneau personnalisé
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty.value} value={specialty.value}>
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(language => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Résultats formateurs - Grille de cartes */}
                <div className="mb-4 text-sm text-gray-600">
                  {filteredTrainers.length} formateur{filteredTrainers.length > 1 ? 's' : ''} disponible{filteredTrainers.length > 1 ? 's' : ''}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(showAllTrainers ? filteredTrainers : filteredTrainers.slice(0, 9)).map((trainer) => (
                    <TrainerCard 
                      key={trainer.id} 
                      trainer={trainer} 
                      onBooking={handleTrainerBooking}
                    />
                  ))}
                </div>

                {filteredTrainers.length > 9 && !showAllTrainers && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAllTrainers(true)}
                    >
                      Voir tous les formateurs ({filteredTrainers.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal de réservation */}
      <TrainerBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedTrainer(null);
        }}
        trainer={selectedTrainer}
      />

      <Footer />
    </div>
  );
};

export default Courses;
