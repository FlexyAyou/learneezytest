
import React, { useState } from 'react';
import { Search, Award, Users as UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import TrainerCard from '@/components/TrainerCard';
import TrainerBookingModal from '@/components/TrainerBookingModal';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
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
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
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

  // Filtre en entonnoir - Niveau d'études principal
  const educationLevels = [
    { value: 'all', label: 'Tous les niveaux d\'études' },
    { value: 'scolaire', label: 'Formation Scolaire (Primaire - Lycée)' },
    { value: 'superieur', label: 'Enseignement Supérieur' },
    { value: 'professionnel', label: 'Formation Professionnelle' },
    { value: 'continue', label: 'Formation Continue / Reconversion' }
  ];

  const categories = [
    { value: 'all', label: 'Tous les domaines' },
    // Scolaire
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Langues Étrangères' },
    { value: 'Sciences', label: 'Sciences et Recherche' },
    { value: 'Histoire-Géographie', label: 'Sciences Humaines' },
    { value: 'Arts', label: 'Arts et Créativité' },
    // Professionnel
    { value: 'Informatique', label: 'Informatique et Digital' },
    { value: 'IA', label: 'Intelligence Artificielle' },
    { value: 'Data', label: 'Data Science et Analyse' },
    { value: 'Marketing', label: 'Marketing et Communication' },
    { value: 'Management', label: 'Management et Leadership' },
    { value: 'Finance', label: 'Finance et Comptabilité' },
    { value: 'Santé', label: 'Santé et Bien-être' },
    { value: 'Design', label: 'Design et UX/UI' }
  ];

  const difficulties = [
    { value: 'all', label: 'Toutes les difficultés' },
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' },
    { value: 'expert', label: 'Expert' }
  ];

  const durations = [
    { value: 'all', label: 'Toutes les durées' },
    { value: 'court', label: 'Formation courte (< 10h)' },
    { value: 'moyen', label: 'Formation moyenne (10-50h)' },
    { value: 'long', label: 'Formation longue (50h+)' },
    { value: 'diplome', label: 'Parcours diplômant' }
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
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesEducationLevel = selectedEducationLevel === 'all' || 
      (selectedEducationLevel === 'scolaire' && course.cycle === 'élémentaire' || course.cycle === 'secondaire') ||
      (selectedEducationLevel === 'superieur' && course.category === 'Informatique') ||
      (selectedEducationLevel === 'professionnel' && ['IA', 'Data', 'Marketing'].includes(course.category));
    
    return matchesSearch && matchesCategory && matchesEducationLevel;
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
            Catalogue de Formations & Réservation de Cours
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez nos cours personnalisés du primaire au lycée. Réservez directement vos créneaux avec nos formateurs qualifiés.
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
                  
                  {/* Filtre en entonnoir */}
                  <div className="space-y-4">
                    {/* 1er niveau : Type d'études */}
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. Quel type de formation recherchez-vous ?
                      </label>
                      <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
                        <SelectTrigger className="bg-white border-2 border-pink-300">
                          <SelectValue placeholder="Choisissez votre niveau d'études" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 2ème niveau : Domaine */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          2. Domaine d'expertise
                        </label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Domaine" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          3. Niveau de difficulté
                        </label>
                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Difficulté" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map(difficulty => (
                              <SelectItem key={difficulty.value} value={difficulty.value}>
                                {difficulty.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          4. Durée souhaitée
                        </label>
                        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                          <SelectTrigger>
                            <SelectValue placeholder="Durée" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map(duration => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                     </div>

                     {/* Bouton de réinitialisation des filtres */}
                     <div className="flex justify-end mt-4">
                       <Button 
                         type="button" 
                         variant="outline" 
                         onClick={() => {
                           setSearchTerm('');
                           setSelectedEducationLevel('all');
                           setSelectedCategory('all');
                           setSelectedDifficulty('all');
                           setSelectedDuration('all');
                         }}
                         className="text-sm"
                       >
                         Réinitialiser les filtres
                       </Button>
                     </div>
                   </div>
                 </div>

                 {/* Résultats formations - Grille de cartes */}
                <div className="mb-4 text-sm text-gray-600">
                  {filteredCourses.length} formation{filteredCourses.length > 1 ? 's' : ''} trouvée{filteredCourses.length > 1 ? 's' : ''}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 12)).map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {filteredCourses.length > 12 && !showAllCourses && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAllCourses(true)}
                    >
                      Voir toutes les formations ({filteredCourses.length})
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
