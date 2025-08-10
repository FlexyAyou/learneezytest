
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Users, Star, Clock, Wand2, Book, Check, X, AlertTriangle, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AICourseCreatorModal } from './AICourseCreatorModal';
import { CreateCourseModal } from './CreateCourseModal';
import { CourseRejectionModal } from './CourseRejectionModal';

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAICourseModal, setShowAICourseModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [courseToReject, setCourseToReject] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Mock data for published courses
  const publishedCourses = [
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
    }
  ];

  // Mock data for pending courses
  const pendingCourses = [
    {
      id: '3',
      title: 'Informatique 1ère - Bases de la Programmation',
      instructor: 'Alex Dupont',
      category: 'TechnoEdu',
      price: 0,
      students: 0,
      rating: 0,
      status: 'en_attente',
      duration: '20h',
      createdAt: '2024-03-15',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: '4',
      title: 'Arts Plastiques CE1',
      instructor: 'Clara Roussel',
      category: 'Atelier Créatif',
      price: 0,
      students: 0,
      rating: 0,
      status: 'en_attente',
      duration: '10h',
      createdAt: '2024-03-20',
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ];

  // Mock data for rejection history
  const rejectionHistory = [
    {
      id: '1',
      courseTitle: 'Python Avancé',
      instructor: 'Michel Durand',
      rejectionDate: '2024-03-10',
      reason: 'Le contenu manque de profondeur dans les sections sur les décorateurs et les metaclasses.',
      moderator: 'Admin Principal'
    },
    {
      id: '2',
      courseTitle: 'Design Thinking',
      instructor: 'Sophie Martin',
      rejectionDate: '2024-03-08',
      reason: 'Qualité audio insuffisante dans plusieurs vidéos. Veuillez réenregistrer les modules 3 et 5.',
      moderator: 'Admin Principal'
    }
  ];

  const allCourses = [...publishedCourses, ...pendingCourses];

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

  const handleApproveCourse = (courseId) => {
    toast({
      title: "Cours approuvé",
      description: "Le cours a été approuvé et publié avec succès.",
    });
  };

  const handleRejectCourse = (course) => {
    setCourseToReject(course);
    setShowRejectionModal(true);
  };

  const handleRejectionConfirm = (reason) => {
    toast({
      title: "Cours rejeté",
      description: `Le cours "${courseToReject?.title}" a été rejeté avec commentaires.`,
      variant: "destructive"
    });
    setCourseToReject(null);
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

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingCourses = pendingCourses.filter(course =>
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
            onClick={() => setShowHistoryModal(true)}
            variant="outline"
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
          >
            <History className="h-4 w-4 mr-2" />
            Historique des rejets
          </Button>
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
            <div className="text-2xl font-bold">{allCourses.length}</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {publishedCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((publishedCourses.length / allCourses.length) * 100)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">Nécessitent validation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedCourses.reduce((sum, course) => sum + course.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tous cours confondus</p>
          </CardContent>
        </Card>
      </div>

      {/* Cours nécessitant une validation */}
      {pendingCourses.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Cours nécessitant une validation ({pendingCourses.length})
            </CardTitle>
            <p className="text-sm text-orange-700">Ces cours nécessitent votre approbation avant publication</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPendingCourses.map((course) => (
                <div key={course.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          par {course.instructor} • {course.category}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                          <span className="mx-2">•</span>
                          Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Examiner
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveCourse(course.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectCourse(course)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.rating > 0 ? (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {course.rating}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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
                                <div><strong>Étudiants:</strong> {selectedCourse.students}</div>
                                <div><strong>Note:</strong> {selectedCourse.rating > 0 ? `${selectedCourse.rating}/5` : 'Aucune'}</div>
                                <div><strong>Durée:</strong> {selectedCourse.duration}</div>
                                <div><strong>Statut:</strong> {selectedCourse.status}</div>
                                <div><strong>Créé le:</strong> {new Date(selectedCourse.createdAt).toLocaleDateString('fr-FR')}</div>
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

      {/* Course Rejection Modal */}
      {courseToReject && (
        <CourseRejectionModal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false);
            setCourseToReject(null);
          }}
          onConfirm={handleRejectionConfirm}
          courseTitle={courseToReject.title}
        />
      )}

      {/* Rejection History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Historique des rejets et modifications
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {rejectionHistory.map((rejection) => (
              <Card key={rejection.id} className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-red-900">{rejection.courseTitle}</h4>
                      <p className="text-sm text-red-700">par {rejection.instructor}</p>
                    </div>
                    <div className="text-right text-sm text-red-600">
                      <p>Rejeté le {new Date(rejection.rejectionDate).toLocaleDateString('fr-FR')}</p>
                      <p>par {rejection.moderator}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-red-200 rounded p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Raison du rejet:</strong> {rejection.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {rejectionHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun historique de rejet disponible</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
