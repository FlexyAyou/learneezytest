
import React, { useState } from 'react';
import { Clock, Users, Star, Filter, Search, Grid, List, Calendar, MapPin, User, Award, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  
  // États pour la section formateurs
  const [trainerSearchTerm, setTrainerSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

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
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b1ef?w=150&h=150&fit=crop&crop=face",
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

      {/* Contenu principal - Deux sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Thème" />
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

                    <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Durée" />
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

                {/* Résultats formations */}
                <div className="mb-4 text-sm text-gray-600">
                  {filteredCourses.length} formation{filteredCourses.length > 1 ? 's' : ''} trouvée{filteredCourses.length > 1 ? 's' : ''}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredCourses.slice(0, 6).map((course) => (
                    <div key={course.id} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                        <Badge className={getBadgeColor(course.level)} variant="secondary">
                          {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.students}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                          {course.rating}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-pink-600">{course.price}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Voir détails</Button>
                          <Link to={`/cours/${course.id}/reservation`}>
                            <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                              S'inscrire
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredCourses.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="w-full">
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
                  <User className="h-6 w-6 mr-2" />
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

                {/* Résultats formateurs */}
                <div className="mb-4 text-sm text-gray-600">
                  {filteredTrainers.length} formateur{filteredTrainers.length > 1 ? 's' : ''} disponible{filteredTrainers.length > 1 ? 's' : ''}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredTrainers.map((trainer) => (
                    <div key={trainer.id} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3 mb-3">
                        <img
                          src={trainer.photo}
                          alt={trainer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                            <div className="flex items-center text-sm">
                              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                              {trainer.rating}
                            </div>
                          </div>
                          <p className="text-sm text-blue-600 font-medium">{trainer.specialty}</p>
                          <p className="text-xs text-gray-500">{trainer.experience} d'expérience</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trainer.description}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Créneaux disponibles :</p>
                        <div className="flex flex-wrap gap-1">
                          {trainer.availableSlots.slice(0, 2).map((slot, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {slot.day} {slot.time}
                            </Badge>
                          ))}
                          {trainer.availableSlots.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{trainer.availableSlots.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-blue-600">{trainer.hourlyRate}</span>
                          <div className="flex items-center">
                            <Languages className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {trainer.languages.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                        <Link to={`/booking-calendar?trainer=${trainer.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Calendar className="h-3 w-3 mr-1" />
                            Réserver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
