import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Clock, ShoppingCart } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse, CourseSummaryPage } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { useCategories } from '@/hooks/useApi';
import { useOrganization } from '@/contexts/OrganizationContext';
import { LearneezyCourseCatalog } from './LearneezyCourseCatalog';

export const OFCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Récupérer les catégories depuis l'API
  const { data: categories = [] } = useCategories();

  // API state
  const [coursesPage, setCoursesPage] = useState<CourseSummaryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Delete confirmation state
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Debounce de la recherche (300ms)
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Load courses from API - filtré par OF
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          page: currentPage,
          per_page: ITEMS_PER_PAGE,
          search: debouncedSearch || undefined,
          status: statusFilter !== 'all' ? (statusFilter as 'draft' | 'published') : undefined,
          // Filtrer par propriétaire OF - on récupère tous les cours de cet OF
          owner_type: 'of' as const,
          owner_id: organization?.organizationId,
          category_names: categoryFilter !== 'all' ? [categoryFilter] : undefined,
          learning_cycle: cycleFilter !== 'all' ? cycleFilter : undefined,
          sort: sortOption,
          facets: true,
        };

        const data = await fastAPIClient.getCourses(filters);
        setCoursesPage(data);

        // Si on vient de créer un cours, afficher un toast de confirmation
        if (location.state?.courseCreated) {
          toast({
            title: "✅ Cours créé avec succès",
            description: `Votre cours est maintenant visible dans la liste`,
          });
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
  }, [currentPage, debouncedSearch, statusFilter, categoryFilter, cycleFilter, sortOption, organization?.organizationId, location.state]);

  // Separate published and draft courses from current page
  const publishedCourses = useMemo(() => {
    return coursesPage?.items.filter(c => c.status === 'published') || [];
  }, [coursesPage]);

  const draftCourses = useMemo(() => {
    return coursesPage?.items.filter(c => c.status === 'draft') || [];
  }, [coursesPage]);

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await fastAPIClient.deleteCourse(courseToDelete);

      // Recharger avec les filtres actuels
      const filters = {
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        status: statusFilter !== 'all' ? (statusFilter as 'draft' | 'published') : undefined,
        owner_type: 'of' as const,
        owner_id: organization?.organizationId,
        category_names: categoryFilter !== 'all' ? [categoryFilter] : undefined,
        learning_cycle: cycleFilter !== 'all' ? cycleFilter : undefined,
        sort: sortOption,
        facets: true,
      };
      const data = await fastAPIClient.getCourses(filters);
      setCoursesPage(data);

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
    } finally {
      setCourseToDelete(null);
    }
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/dashboard/organisme-formation/formations/${courseId}/edit`);
  };

  const handleViewCourse = (course: CourseResponse) => {
    navigate(`/dashboard/organisme-formation/formations/${course.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadges = (course: CourseResponse) => {
    if (course.category_names && course.category_names.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {course.category_names.slice(0, 2).map((category, index) => (
            <Badge
              key={index}
              className="bg-purple-500/10 text-purple-700 border-purple-500/20 text-xs"
              variant="outline"
            >
              {category}
            </Badge>
          ))}
          {course.category_names.length > 2 && (
            <Badge
              className="bg-gray-500/10 text-gray-700 border-gray-500/20 text-xs"
              variant="outline"
            >
              +{course.category_names.length - 2}
            </Badge>
          )}
        </div>
      );
    }
    if (course.category) {
      return (
        <Badge
          className="bg-purple-500/10 text-purple-700 border-purple-500/20 text-xs"
          variant="outline"
        >
          {course.category}
        </Badge>
      );
    }
    return <span className="text-sm text-muted-foreground">-</span>;
  };

  const getCycleBadge = (cycle: string | null | undefined) => {
    if (!cycle) return <Badge variant="outline">Non défini</Badge>;

    const cycleConfig: Record<string, { label: string; className: string }> = {
      primaire: { label: 'Primaire', className: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
      college: { label: 'Collège', className: 'bg-green-500/10 text-green-700 border-green-500/20' },
      lycee: { label: 'Lycée', className: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
      pro: { label: 'Professionnel', className: 'bg-orange-500/10 text-orange-700 border-orange-500/20' }
    };

    const config = cycleConfig[cycle] || { label: cycle, className: 'bg-gray-500/10 text-gray-700 border-gray-500/20' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Server-side filtering - display all items from API response
  const filteredCourses = useMemo(() => {
    return coursesPage?.items || [];
  }, [coursesPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, cycleFilter, sortOption]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des cours</h1>
          <p className="text-gray-600">Gérer les cours de votre organisme de formation</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowCatalogModal(true)}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Catalogue Learneezy
          </Button>
          <Button
            onClick={() => navigate('/dashboard/organisme-formation/formations/create')}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un cours
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
            <div className="text-2xl font-bold">{coursesPage?.total_items || 0}</div>
            <p className="text-xs text-muted-foreground">Créés par votre OF</p>
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
            <p className="text-xs text-muted-foreground">Sur cette page</p>
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
            <p className="text-xs text-muted-foreground">Sur cette page</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Organisme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-pink-600 truncate">
              {organization?.organizationName || 'Mon OF'}
            </div>
            <p className="text-xs text-muted-foreground">Vos cours</p>
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
          <div className="space-y-4 mb-6">
            {/* Ligne 1: recherche, statut */}
            <div className="flex items-center space-x-4">
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
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ligne 2: catégorie, cycle, tri */}
            <div className="flex items-center space-x-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                      {coursesPage?.facets?.by_category?.[cat.name] &&
                        ` (${coursesPage.facets.by_category[cat.name]})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Tous les cycles" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">Tous les cycles</SelectItem>
                  <SelectItem value="primaire">
                    Primaire
                    {coursesPage?.facets?.by_cycle?.primaire &&
                      ` (${coursesPage.facets.by_cycle.primaire})`}
                  </SelectItem>
                  <SelectItem value="college">
                    Collège
                    {coursesPage?.facets?.by_cycle?.college &&
                      ` (${coursesPage.facets.by_cycle.college})`}
                  </SelectItem>
                  <SelectItem value="lycee">
                    Lycée
                    {coursesPage?.facets?.by_cycle?.lycee &&
                      ` (${coursesPage.facets.by_cycle.lycee})`}
                  </SelectItem>
                  <SelectItem value="formation_pro">
                    Professionnel
                    {coursesPage?.facets?.by_cycle?.formation_pro &&
                      ` (${coursesPage.facets.by_cycle.formation_pro})`}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={(value) => setSortOption(value as 'newest' | 'price_asc' | 'price_desc')}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tableau des cours */}
          {error && (
            <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucun cours trouvé</p>
              <p className="text-sm">
                {(coursesPage?.total_items || 0) === 0
                  ? "Créez votre premier cours pour commencer"
                  : "Essayez de modifier vos filtres de recherche"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cours</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {(() => {
                            let imageUrl = course.image_url;
                            if (!imageUrl && course.modules && course.modules.length > 0) {
                              const firstLesson = course.modules[0].content?.[0];
                              if (firstLesson?.video_key) {
                                imageUrl = `${import.meta.env.VITE_API_URL}/api/storage/play/redirect?key=${encodeURIComponent(firstLesson.video_key)}`;
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
                      <TableCell>
                        {getCategoryBadges(course)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(course.status || 'draft')}
                      </TableCell>
                      <TableCell>
                        {getCycleBadge(course.learning_cycle)}
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
                            onClick={() => setCourseToDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredCourses.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, coursesPage?.total_items || 0)} sur{' '}
                    {coursesPage?.total_items || 0} cours
                  </div>

                  {(coursesPage?.total_pages || 0) > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={!coursesPage?.has_previous ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {/* First page */}
                        {currentPage > 2 && (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(1)}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {/* Pages around current */}
                        {Array.from({ length: coursesPage?.total_pages || 0 }, (_, i) => i + 1)
                          .filter(page => {
                            return page === currentPage ||
                              page === currentPage - 1 ||
                              page === currentPage + 1;
                          })
                          .map(page => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                        }

                        {/* Last page */}
                        {(coursesPage?.total_pages || 0) > 0 && currentPage < (coursesPage?.total_pages || 0) - 1 && (
                          <>
                            {currentPage < (coursesPage?.total_pages || 0) - 2 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(coursesPage?.total_pages || 1)}
                                className="cursor-pointer"
                              >
                                {coursesPage?.total_pages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(p => Math.min(coursesPage?.total_pages || 1, p + 1))}
                            className={!coursesPage?.has_next ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Catalogue Learneezy Modal */}
      <LearneezyCourseCatalog
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce cours ? Cette action est irréversible et supprimera tous les modules, leçons et ressources associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OFCourses;
