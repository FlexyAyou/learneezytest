import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Play, 
  UserPlus,
  Calendar,
  Search,
  Filter,
  GraduationCap,
  Trophy,
  Heart,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extendedCoursesData } from '@/data/mockCoursesData';
import { mockTrainerProfiles } from '@/data/mockTrainerBookingData';

export const TutorCatalog = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Mock students data
  const students = [
    { id: '1', name: 'Emma Martin', age: 16 },
    { id: '2', name: 'Lucas Dubois', age: 14 }
  ];

  const filteredCourses = extendedCoursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const filteredTrainers = mockTrainerProfiles.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleEnrollStudent = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const handleBookTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  const confirmEnrollment = () => {
    const student = students.find(s => s.id === selectedStudent);
    if (student && selectedCourse) {
      toast({
        title: "Inscription confirmée",
        description: `${student.name} a été inscrit(e) au cours "${selectedCourse.title}"`,
      });
      setShowEnrollModal(false);
      setSelectedStudent('');
      setSelectedCourse(null);
    }
  };

  const confirmBooking = () => {
    const student = students.find(s => s.id === selectedStudent);
    if (student && selectedTrainer) {
      toast({
        title: "Réservation confirmée",
        description: `Session avec ${selectedTrainer.name} réservée pour ${student.name}`,
      });
      setShowBookingModal(false);
      setSelectedStudent('');
      setSelectedTrainer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catalogue de Formation</h1>
        <p className="text-gray-600">Découvrez nos formations et réservez des sessions pour vos élèves</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
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
                <SelectItem value="">Toutes les catégories</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Sciences">Sciences</SelectItem>
                <SelectItem value="Langues">Langues</SelectItem>
                <SelectItem value="Informatique">Informatique</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les niveaux</SelectItem>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Courses and Trainers */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Formations</TabsTrigger>
          <TabsTrigger value="trainers">Formateurs</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="mt-2">{course.instructor}</CardDescription>
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {course.totalStudents} élèves
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{course.averageRating}</span>
                        <span className="text-sm text-gray-600 ml-1">({course.feedbackCount})</span>
                      </div>
                      <div className="text-lg font-bold text-primary">{course.price}</div>
                    </div>

                    <Button 
                      onClick={() => handleEnrollStudent(course)}
                      className="w-full"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Inscrire un élève
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trainers Tab */}
        <TabsContent value="trainers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={trainer.photo} alt={trainer.name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                        <span className="text-sm text-gray-600 ml-1">({trainer.totalReviews} avis)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Spécialités:</p>
                      <div className="flex flex-wrap gap-1">
                        {trainer.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="mr-1 h-4 w-4" />
                        {trainer.experience} ans d'exp.
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {trainer.hourlyRate}€/h
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trainer.languages.map((language, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleBookTrainer(trainer)}
                      className="w-full"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Réserver une session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Enrollment Modal */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscrire un élève</DialogTitle>
            <DialogDescription>
              Sélectionnez l'élève à inscrire au cours "{selectedCourse?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.age} ans)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowEnrollModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={confirmEnrollment} 
                disabled={!selectedStudent}
                className="flex-1"
              >
                Confirmer l'inscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver une session</DialogTitle>
            <DialogDescription>
              Réserver une session avec {selectedTrainer?.name} pour un de vos élèves
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.age} ans)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={confirmBooking} 
                disabled={!selectedStudent}
                className="flex-1"
              >
                Confirmer la réservation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};