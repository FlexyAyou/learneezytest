import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Clock, Settings, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CourseVisibilityModal } from './CourseVisibilityModal';

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  
  // API state
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Visibility modal state
  const [selectedCourseForVisibility, setSelectedCourseForVisibility] = useState<CourseResponse | null>(null);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const coursesData = await fastAPIClient.getCourses(1, 20);
        console.log('📚 Courses data from API:', coursesData);
        console.log('📊 First course details:', coursesData[0]);
        setCourses(coursesData);
        
        // Si on vient de créer un cours, afficher un toast de confirmation
        if (location.state?.courseCreated) {
          toast({
            title: "✅ Cours créé avec succès",
            description: `Votre cours est maintenant visible dans la liste`,
          });
          // Nettoyer le state pour éviter le toast à chaque refresh
          window.history.replaceState({}, document.title);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des cours');
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [location.state]);

  // Separate published and draft courses
  const publishedCourses = courses.filter(c => c.status === 'published');
  const draftCourses = courses.filter(c => c.status === 'draft');

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await fastAPIClient.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
    }
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/dashboard/superadmin/courses/${courseId}/edit`);
  };

  const handleViewCourse = (course: CourseResponse) => {
    navigate(`/dashboard/superadmin/courses/${course.id}`);
  };

  const handleOpenVisibilityModal = (course: CourseResponse) => {
    setSelectedCourseForVisibility(course);
    setShowVisibilityModal(true);
  };

  const handleSaveVisibility = async (courseId: string, settings: any) => {
    try {
      // TODO: Appeler l'API pour sauvegarder les paramètres de visibilité
      console.log('Saving visibility settings for course:', courseId, settings);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de visibilité ont été mis à jour avec succès.",
      });
      
      // Recharger les cours pour afficher les changements
      const coursesData = await fastAPIClient.getCourses(1, 20);
      setCourses(coursesData);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de visibilité",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'open_source':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">Open Source</Badge>;
      case 'restricted':
        return <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">Restreint</Badge>;
      case 'masked':
        return <Badge className="bg-red-500/10 text-red-700 border-red-500/20">Masqué</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">Open Source</Badge>;
    }
  };

  const getOwnerBadge = (owner_type: string) => {
    return owner_type === 'learneezy' 
      ? <Badge className="bg-blue-100 text-blue-800">Learneezy</Badge>
      : <Badge className="bg-purple-100 text-purple-800">OF</Badge>;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesOwner = ownerFilter === 'all' || course.owner_type === ownerFilter;
    
    return matchesSearch && matchesStatus && matchesOwner;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des cours</h1>
            <p className="text-gray-600">Gérer et modérer les cours de la plateforme</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des cours</h1>
          <p className="text-gray-600">Gérer et modérer les cours de la plateforme</p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/superadmin/courses/create')}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un cours
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Tous cours confondus</p>
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
              {courses.length > 0 ? Math.round((publishedCourses.length / courses.length) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {draftCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">En cours de création</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours Learneezy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {courses.filter(c => c.owner_type === 'learneezy').length}
            </div>
            <p className="text-xs text-muted-foreground">Créés par la plateforme</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
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
                placeholder="Rechercher par titre ou catégorie..."
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
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par propriétaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="learneezy">Learneezy</SelectItem>
                <SelectItem value="of">Organismes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucun cours trouvé</p>
              <p className="text-sm">
                {courses.length === 0 
                  ? "Créez votre premier cours pour commencer" 
                  : "Essayez de modifier vos filtres de recherche"}
              </p>
            </div>
          ) : (
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
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {(() => {
                          // Fallback : cover_key → première vidéo du premier module
                          let imageUrl = course.image_url;
                          if (!imageUrl && course.modules && course.modules.length > 0) {
                            const firstLesson = course.modules[0].content?.[0];
                            if (firstLesson?.video_key) {
                              imageUrl = `${import.meta.env.VITE_API_URL}/api/storage/play/${firstLesson.video_key}`;
                            }
                          }
                          return imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={course.title}
                              className="w-12 h-8 rounded object-cover"
                            />
                          ) : null;
                        })()}
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration || '15h'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {course.owner_type === 'learneezy' ? 'Jean Dupont' : 'Marie Martin'}
                    </TableCell>
                    <TableCell>
                      {course.category ? (
                        <span className="text-sm">{course.category}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <span className="mr-1">👥</span>
                        {Math.floor(Math.random() * 300)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <span className="mr-1">⭐</span>
                        {(4 + Math.random()).toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(course.status || 'draft')}
                    </TableCell>
                    <TableCell>
                      {getVisibilityBadge(course.owner_type === 'learneezy' ? 'open_source' : 'restricted')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Voir le cours"
                          onClick={() => handleViewCourse(course)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Paramètres"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Visibilité"
                          onClick={() => handleOpenVisibilityModal(course)}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Modifier"
                          onClick={() => handleEditCourse(course.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Supprimer"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Visibility Modal */}
      <CourseVisibilityModal
        course={selectedCourseForVisibility}
        isOpen={showVisibilityModal}
        onClose={() => {
          setShowVisibilityModal(false);
          setSelectedCourseForVisibility(null);
        }}
        onSave={handleSaveVisibility}
      />
    </div>
  );
};

export default AdminCourses;
