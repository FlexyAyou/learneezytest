
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Users, Star, Clock, Wand2, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AICourseCreatorModal } from './AICourseCreatorModal';
import { CreateCourseModal } from './CreateCourseModal';

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAICourseModal, setShowAICourseModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);

  // Mock data for courses
  const courses = [
    {
      id: '1',
      title: 'Développement Web avec React',
      instructor: 'Jean Dupont',
      category: 'Développement',
      price: 89,
      students: 245,
      rating: 4.8,
      status: 'publié',
      duration: '15h',
      createdAt: '2023-10-15',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: '2',
      title: 'Design UX/UI avec Figma',
      instructor: 'Marie Martin',
      category: 'Design',
      price: 99,
      students: 189,
      rating: 4.6,
      status: 'publié',
      duration: '12h',
      createdAt: '2023-11-02',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: '3',
      title: 'Marketing Digital Avancé',
      instructor: 'Pierre Durand',
      category: 'Marketing',
      price: 129,
      students: 156,
      rating: 4.7,
      status: 'en_attente',
      duration: '20h',
      createdAt: '2023-11-10',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: '4',
      title: 'Python pour Débutants',
      instructor: 'Sophie Laurent',
      category: 'Programmation',
      price: 79,
      students: 312,
      rating: 4.9,
      status: 'publié',
      duration: '18h',
      createdAt: '2023-09-28',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ];

  const handleStatusChange = (courseId, newStatus) => {
    toast({
      title: "Statut modifié",
      description: `Le cours a été ${newStatus === 'publié' ? 'publié' : 'mis en attente'}.`,
    });
  };

  const handleDeleteCourse = (courseId) => {
    toast({
      title: "Cours supprimé",
      description: "Le cours a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/superadmin/courses/${courseId}/edit`);
  };

  const handleAICourseCreated = (course) => {
    toast({
      title: "Cours créé avec l'IA",
      description: "Le cours a été généré et ajouté avec succès.",
    });
  };

  const handleCourseCreated = (course) => {
    toast({
      title: "Cours créé",
      description: "Le cours a été créé et ajouté avec succès.",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'publié':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'brouillon':
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des cours</h1>
          <p className="text-gray-600">Gérer et modérer les cours de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowCreateCourseModal(true)}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Book className="h-4 w-4 mr-2" />
            Créer un cours
          </Button>
          <Button onClick={() => setShowAICourseModal(true)}>
            <Wand2 className="h-4 w-4 mr-2" />
            Créer un cours avec l'IA
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(c => c.status === 'publié').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((courses.filter(c => c.status === 'publié').length / courses.length) * 100)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + course.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tous cours confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus moyens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(courses.reduce((sum, course) => sum + (course.price * course.students), 0) / courses.length)}€
            </div>
            <p className="text-xs text-muted-foreground">Par cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Liste des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre, instructeur ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cours</TableHead>
                <TableHead>Instructeur</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-12 h-8 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{course.price}€</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {course.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(course.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Voir les détails"
                            onClick={() => setSelectedCourse(course)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du cours</DialogTitle>
                          </DialogHeader>
                          {selectedCourse && (
                            <div className="space-y-4">
                              <img 
                                src={selectedCourse.thumbnail} 
                                alt={selectedCourse.title}
                                className="w-full h-48 rounded object-cover"
                              />
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Titre:</strong> {selectedCourse.title}</div>
                                <div><strong>Instructeur:</strong> {selectedCourse.instructor}</div>
                                <div><strong>Catégorie:</strong> {selectedCourse.category}</div>
                                <div><strong>Prix:</strong> {selectedCourse.price}€</div>
                                <div><strong>Étudiants:</strong> {selectedCourse.students}</div>
                                <div><strong>Note:</strong> {selectedCourse.rating}/5</div>
                                <div><strong>Durée:</strong> {selectedCourse.duration}</div>
                                <div><strong>Statut:</strong> {selectedCourse.status}</div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Modifier"
                        onClick={() => handleEditCourse(course.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Supprimer"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Course Creator Modal */}
      <AICourseCreatorModal
        isOpen={showAICourseModal}
        onClose={() => setShowAICourseModal(false)}
        onCourseCreated={handleAICourseCreated}
      />

      {/* Manual Course Creator Modal */}
      <CreateCourseModal
        isOpen={showCreateCourseModal}
        onClose={() => setShowCreateCourseModal(false)}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
};

export default AdminCourses;
