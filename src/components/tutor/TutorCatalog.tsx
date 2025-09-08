import React, { useState } from 'react';
import { Search, Award, Users as UsersIcon, Clock, Star, Calendar, Languages as LanguagesIcon, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export const TutorCatalog = () => {
  const { toast } = useToast();
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
  
  // États pour les modales
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mock students data
  const students = [
    { id: 1, name: "Alice Martin" },
    { id: 2, name: "Lucas Dubois" },
    { id: 3, name: "Emma Leroy" },
    { id: 4, name: "Noah Petit" }
  ];

  // Fonction pour convertir euros en tokens (1 token = 0,3€)
  const convertToTokens = (euroPrice: string) => {
    const euroValue = parseFloat(euroPrice.replace('€', ''));
    const tokens = Math.round(euroValue / 0.3);
    return `${tokens} tokens`;
  };

  // Mock tuteur subscription data - you can modify this based on actual subscription
  const tutorSubscription = {
    plan: "premium", // "basic", "standard", "premium"
    hasAccess: true
  };

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
      completed: false,
      type: "paid", // "free", "paid", "subscription"
      requiredPlan: null // null, "basic", "standard", "premium"
    },
    {
      id: 2,
      title: "Français - Analyse de Texte",
      instructor: "Paul Martin",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 38,
      rating: 4.9,
      price: "Gratuit",
      originalPrice: null,
      level: "6ème",
      category: "Français",
      cycle: "secondaire",
      availableSlots: 8,
      description: "Apprenez à analyser un texte littéraire et à identifier les figures de style au niveau collège.",
      completed: false,
      type: "free",
      requiredPlan: null
    },
    {
      id: 3,
      title: "Sciences - Les États de la Matière",
      instructor: "Sophie Laurent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "1h",
      students: 52,
      rating: 4.7,
      price: "Abonnement Standard",
      originalPrice: null,
      level: "CE2",
      category: "Sciences",
      cycle: "élémentaire",
      availableSlots: 15,
      description: "Découvrez les différents états de la matière à travers des expériences simples et amusantes.",
      completed: false,
      type: "subscription",
      requiredPlan: "standard"
    },
    {
      id: 4,
      title: "Histoire-Géographie - La Révolution Française",
      instructor: "Lucas Petit",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h15",
      students: 41,
      rating: 4.6,
      price: "Abonnement Premium",
      originalPrice: null,
      level: "4ème",
      category: "Histoire-Géographie",
      cycle: "secondaire",
      availableSlots: 6,
      description: "Plongez dans l'histoire de la Révolution française et comprenez ses enjeux politiques et sociaux.",
      completed: false,
      type: "subscription",
      requiredPlan: "premium"
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
      completed: false,
      type: "paid",
      requiredPlan: null
    },
    {
      id: 6,
      title: "Physique-Chimie - Les Réactions Chimiques",
      instructor: "Thomas Roux",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 29,
      rating: 4.9,
      price: "Gratuit",
      originalPrice: null,
      level: "3ème",
      category: "Physique-Chimie",
      cycle: "secondaire",
      availableSlots: 5,
      description: "Explorez les réactions chimiques fondamentales et leurs applications dans la vie quotidienne.",
      completed: false,
      type: "free",
      requiredPlan: null
    },
    {
      id: 7,
      title: "Mathématiques - Calcul Littéral",
      instructor: "Alex Durand", 
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      duration: "1h15",
      students: 33,
      rating: 4.7,
      price: "Abonnement Basic",
      originalPrice: null,
      level: "2nde",
      category: "Mathématiques",
      cycle: "secondaire",
      availableSlots: 7,
      description: "Développez vos compétences en calcul littéral et résolution d'équations au niveau seconde.",
      completed: false,
      type: "subscription",
      requiredPlan: "basic"
    },
    {
      id: 8,
      title: "SVT - La Génétique",
      instructor: "Julie Bernard",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      duration: "1h30",
      students: 24,
      rating: 4.6,
      price: "127 tokens",
      originalPrice: "160 tokens",
      level: "1ère",
      category: "SVT",
      cycle: "secondaire",
      availableSlots: 4,
      description: "Comprenez les bases de la génétique et de l'hérédité avec des exemples concrets et actuels.",
      completed: false,
      type: "paid",
      requiredPlan: null
    },
    {
      id: 9,
      title: "Lecture - Compréhension de Texte",
      instructor: "Camille Moreau",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "45min",
      students: 78,
      rating: 4.9,
      price: "Gratuit",
      originalPrice: null,
      level: "CP",
      category: "Français",
      cycle: "élémentaire",
      availableSlots: 20,
      description: "Améliorez la compréhension de lecture avec des textes adaptés au niveau CP.",
      completed: false,
      type: "free",
      requiredPlan: null
    },
    {
      id: 10,
      title: "Arts Plastiques - Techniques de Dessin",
      instructor: "Pierre Dubois",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
      duration: "2h",
      students: 15,
      rating: 4.8,
      price: "150 tokens",
      originalPrice: "183 tokens",
      level: "Terminale",
      category: "Arts",
      cycle: "secondaire",
      availableSlots: 3,
      description: "Perfectionnez vos techniques de dessin et explorez différents styles artistiques.",
      completed: false,
      type: "paid",
      requiredPlan: null
    }
  ];

  // Données des formateurs - mise à jour des tarifs en tokens
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
      hourlyRate: "117 tokens/h" // 35€ / 0.3 = 117 tokens
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
      hourlyRate: "107 tokens/h" // 32€ / 0.3 = 107 tokens
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
      hourlyRate: "133 tokens/h" // 40€ / 0.3 = 133 tokens
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
      hourlyRate: "100 tokens/h" // 30€ / 0.3 = 100 tokens
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
      hourlyRate: "127 tokens/h" // 38€ / 0.3 = 127 tokens
    }
  ];

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

  const handleEnrollStudent = (course: any) => {
    setSelectedCourse(course);
    setIsEnrollmentModalOpen(true);
  };

  const confirmEnrollment = () => {
    if (selectedStudent && selectedCourse) {
      toast({
        title: "Inscription confirmée",
        description: `L'étudiant a été inscrit au cours "${selectedCourse.title}".`,
      });
      setIsEnrollmentModalOpen(false);
      setSelectedStudent('');
      setSelectedCourse(null);
    }
  };

  const confirmBooking = () => {
    if (selectedStudent && selectedTrainer) {
      toast({
        title: "Réservation confirmée", 
        description: `Une session avec ${selectedTrainer.name} a été réservée pour l'étudiant.`,
      });
      setIsBookingModalOpen(false);
      setSelectedStudent('');
      setSelectedTrainer(null);
    }
  };

  // Check if tutor has access to a course
  const hasAccessToCourse = (course: any) => {
    if (course.type === 'free') return true;
    if (course.type === 'paid') return true; // Can always attempt to buy
    if (course.type === 'subscription') {
      if (!course.requiredPlan) return true;
      const planLevels = { basic: 1, standard: 2, premium: 3 };
      const currentLevel = planLevels[tutorSubscription.plan as keyof typeof planLevels] || 0;
      const requiredLevel = planLevels[course.requiredPlan as keyof typeof planLevels] || 0;
      return currentLevel >= requiredLevel;
    }
    return false;
  };

  // Get course type badge
  const getCourseTypeBadge = (course: any) => {
    switch (course.type) {
      case 'free':
        return <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500 text-white text-xs">Payant</Badge>;
      case 'subscription':
        return <Badge className="bg-purple-500 text-white text-xs">Abonnement</Badge>;
      default:
        return null;
    }
  };

  // Get action button for course
  const getCourseActionButton = (course: any) => {
    const hasAccess = hasAccessToCourse(course);
    
    if (course.type === 'free') {
      return (
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          onClick={() => handleEnrollStudent(course)}
        >
          Inscrire gratuitement
        </Button>
      );
    } else if (course.type === 'paid') {
      return (
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={() => handleEnrollStudent(course)}
        >
          Acheter & Inscrire
        </Button>
      );
    } else if (course.type === 'subscription') {
      if (hasAccess) {
        return (
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            onClick={() => handleEnrollStudent(course)}
          >
            Inscrire un élève
          </Button>
        );
      } else {
        return (
          <Button 
            size="sm" 
            variant="outline"
            disabled
            className="cursor-not-allowed opacity-50"
          >
            Abonnement requis
          </Button>
        );
      }
    }
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

  const handleDownloadProgram = (course: any) => {
    // Simuler le téléchargement du programme
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Programme de formation: ${course.title}\nFormateur: ${course.instructor}\nDurée: ${course.duration}\nDescription: ${course.description}`);
    element.download = `programme-${course.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue de formations & Réservation de Cours</h1>
          <p className="text-gray-600 mt-2">Découvrez nos cours personnalisés du primaire au lycée. Réservez directement vos créneaux avec nos formateurs qualifiés.</p>
        </div>
      </div>

      {/* Contenu principal - Sections verticales */}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grille des cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 6)).map((course) => (
                <Card key={course.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative ${!hasAccessToCourse(course) ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getCourseTypeBadge(course)}
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs px-2 py-1">
                        {course.price}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {course.title}
                      </h3>
                      {!hasAccessToCourse(course) && (
                        <Badge variant="outline" className="text-xs ml-2 text-orange-600 border-orange-600">
                          Accès limité
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-3">Par {course.instructor}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0"
                          onClick={() => handleDownloadProgram(course)}
                          title="Télécharger le programme de formation"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {getCourseActionButton(course)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length > 6 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="px-8"
                >
                  {showAllCourses ? 'Voir moins' : `Voir toutes les formations (${filteredCourses.length})`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2 - Réservation de Formateurs */}
        <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-purple-600 flex items-center">
              <UsersIcon className="h-6 w-6 mr-2" />
              Réservation de formateurs
            </CardTitle>
            <CardDescription>
              Trouvez le formateur idéal pour un accompagnement personnalisé
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de support" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grille des formateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllTrainers ? filteredTrainers : filteredTrainers.slice(0, 6)).map((trainer) => (
                <Card key={trainer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img 
                          src={trainer.photo} 
                          alt={trainer.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                          {trainer.name}
                        </h3>
                        <p className="text-primary font-medium mb-1">{trainer.specialty}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{trainer.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">• {trainer.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {trainer.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${trainer.supportType === 'Tutorat' ? 'bg-blue-100 text-blue-800' : 
                          trainer.supportType === 'Coaching' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                          {trainer.supportType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {trainer.hourlyRate}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <LanguagesIcon className="h-4 w-4 text-gray-500" />
                        {trainer.languages.map((lang: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Créneaux disponibles :</p>
                          <div className="flex flex-wrap gap-1">
                            {trainer.availableSlots.slice(0, 3).map((slot: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {slot.day} {slot.time}
                              </Badge>
                            ))}
                            {trainer.availableSlots.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{trainer.availableSlots.length - 3} autres
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleTrainerBooking(trainer)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      Réserver un créneau
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTrainers.length > 6 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllTrainers(!showAllTrainers)}
                  className="px-8"
                >
                  {showAllTrainers ? 'Voir moins' : `Voir tous les formateurs (${filteredTrainers.length})`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal d'inscription */}
      <Dialog open={isEnrollmentModalOpen} onOpenChange={setIsEnrollmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscrire un élève</DialogTitle>
            <DialogDescription>
              Sélectionnez l'élève à inscrire au cours "{selectedCourse?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              onClick={confirmEnrollment}
              disabled={!selectedStudent}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Confirmer l'inscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de réservation */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver une session</DialogTitle>
            <DialogDescription>
              Sélectionnez l'élève pour la session avec {selectedTrainer?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              onClick={confirmBooking}
              disabled={!selectedStudent}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};