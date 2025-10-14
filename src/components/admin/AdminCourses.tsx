import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Users, Star, Clock, Wand2, Book, Check, X, AlertTriangle, History, Globe, Lock, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AICourseCreatorModal } from './AICourseCreatorModal';
import { CreateCourseModal } from './CreateCourseModal';
import { CourseRejectionModal } from './CourseRejectionModal';
import { CourseViewModal } from './CourseViewModal';
import { CourseVisibilityModal } from './CourseVisibilityModal';
import { useCourses, useUpdateCourseStatus, useDeleteCourse } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useFastAPIAuth();
  
  const { data: allCoursesData, isLoading } = useCourses(1, 100);
  const updateStatusMutation = useUpdateCourseStatus();
  const deleteMutation = useDeleteCourse();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAICourseModal, setShowAICourseModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [courseToReject, setCourseToReject] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCourseViewModal, setShowCourseViewModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [courseForVisibility, setCourseForVisibility] = useState(null);

  // Filtrer les cours selon le rôle et l'organisation
  const visibleCourses = user?.role === 'superadmin' 
    ? allCoursesData || []
    : (allCoursesData || []).filter(c => c.owner_type === 'of' && c.owner_id === user?.of_id);

  const publishedCourses = visibleCourses.filter(c => c.status === 'published');
  const pendingCourses = visibleCourses.filter(c => c.status === 'draft');
  const allCourses = visibleCourses;

  const handleExamineCourse = (courseId) => {
    navigate(`/dashboard/superadmin/courses/${courseId}/review`);
  };

  const handleStatusChange = (courseId, newStatus) => {
    toast({
      title: "Statut modifié",
      description: `Le cours a été ${newStatus === 'publié' ? 'publié' : 'mis en attente'}.`,
    });
  };

  const handleDeleteCourse = (courseId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteMutation.mutate(courseId, {
        onSuccess: () => {
          toast({
            title: "Cours supprimé",
            description: "Le cours a été supprimé avec succès.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/superadmin/courses/${courseId}/edit`);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseViewModal(true);
  };

  const handleToggleOpenSource = (courseId) => {
    toast({
      title: "Statut Open Source modifié",
      description: "Le statut Open Source du cours a été mis à jour.",
    });
  };

  const handleManageVisibility = (course) => {
    setCourseForVisibility(course);
    setShowVisibilityModal(true);
  };

  const handleVisibilityUpdate = (courseId, settings) => {
    toast({
      title: "Visibilité mise à jour",
      description: "Les paramètres de visibilité du cours ont été mis à jour.",
    });
  };

  const handleApproveCourse = (courseId) => {
    updateStatusMutation.mutate({ 
      courseId, 
      status: 'published' 
    }, {
      onSuccess: () => {
        toast({
          title: "Cours approuvé",
          description: "Le cours a été approuvé et publié avec succès.",
        });
      }
    });
  };

  const handleRejectCourse = (course) => {
    setCourseToReject(course);
    setShowRejectionModal(true);
  };

  const handleRejectionConfirm = (reason) => {
    if (courseToReject) {
      updateStatusMutation.mutate({ 
        courseId: courseToReject.id, 
        status: 'draft' 
      }, {
        onSuccess: () => {
          toast({
            title: "Cours rejeté",
            description: `Le cours "${courseToReject?.title}" a été rejeté avec commentaires.`,
            variant: "destructive"
          });
          setCourseToReject(null);
        }
      });
    }
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
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisibilityBadge = (course) => {
    if (course.isVisible === false) {
      return <Badge variant="outline" className="bg-red-50 text-red-700">Masqué</Badge>;
    }
    
    if (course.isOpenSource) {
      return <Badge className="bg-blue-100 text-blue-800">Open Source</Badge>;
    }
    
    if (course.organisationAccess === 'restricted') {
      return <Badge variant="outline" className="bg-orange-100 text-orange-800">Restreint</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800">Public</Badge>;
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    let matchesVisibility = true;
    if (visibilityFilter !== 'all') {
      switch (visibilityFilter) {
        case 'visible':
          matchesVisibility = course.isVisible === true;
          break;
        case 'hidden':
          matchesVisibility = course.isVisible === false;
          break;
        case 'open_source':
          matchesVisibility = course.isOpenSource === true;
          break;
        case 'public':
          matchesVisibility = course.isVisible === true && !course.isOpenSource && course.organisationAccess === 'all';
          break;
        case 'restricted':
          matchesVisibility = course.organisationAccess === 'restricted';
          break;
        default:
          matchesVisibility = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const filteredPendingCourses = pendingCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.category || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            <CardTitle className="text-sm font-medium">Open Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allCourses.filter(c => c.isOpenSource === true).length}
            </div>
            <p className="text-xs text-muted-foreground">Accessibles aux OF</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedCourses.reduce((sum, course) => sum + (course.students || 0), 0)}
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
                        src={course.thumbnail || '/placeholder.svg'} 
                        alt={course.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          par {course.instructor || 'Inconnu'} • {course.category || 'Non catégorisé'}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration || 'N/A'}
                          <span className="mx-2">•</span>
                          Créé le {course.createdAt ? new Date(course.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExamineCourse(course.id)}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="publié">Publié</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par visibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes visibilités</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Masqué</SelectItem>
                <SelectItem value="open_source">Open Source</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="restricted">Restreint</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Visibilité</TableHead>
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
                          {course.minorsAllowed && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              -18 ans
                            </Badge>
                          )}
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
                    {getVisibilityBadge(course)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Voir le cours complet"
                        onClick={() => handleViewCourse(course)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Gérer la visibilité"
                        onClick={() => handleManageVisibility(course)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        title={course.isOpenSource ? "Retirer de l'Open Source" : "Mettre en Open Source"}
                        onClick={() => handleToggleOpenSource(course.id)}
                        className={course.isOpenSource ? "bg-blue-50 text-blue-700" : ""}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                      
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
            {/* TODO: Implement rejection history from backend */}
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun historique de rejet disponible pour le moment</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course View Modal */}
      <CourseViewModal
        course={selectedCourse}
        isOpen={showCourseViewModal}
        onClose={() => {
          setShowCourseViewModal(false);
          setSelectedCourse(null);
        }}
        onSave={(updatedCourse) => {
          // Handle course update logic
          toast({
            title: "Cours mis à jour",
            description: "Le cours a été mis à jour avec succès.",
          });
        }}
      />

      {/* Course Visibility Modal */}
      <CourseVisibilityModal
        course={courseForVisibility}
        isOpen={showVisibilityModal}
        onClose={() => {
          setShowVisibilityModal(false);
          setCourseForVisibility(null);
        }}
        onSave={handleVisibilityUpdate}
      />
    </div>
  );
};

export default AdminCourses;
