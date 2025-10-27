import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const coursesData = await fastAPIClient.getCourses(1, 20);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {course.image_url && (
                          <img 
                            src={course.image_url} 
                            alt={course.title}
                            className="w-12 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-600 truncate max-w-[200px]">
                            {course.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.category ? (
                        <Badge variant="outline">{course.category}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(course.status || 'draft')}
                    </TableCell>
                    <TableCell>
                      {getOwnerBadge(course.owner_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Voir le cours"
                          onClick={() => handleViewCourse(course)}
                        >
                          <Eye className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;
