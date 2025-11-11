import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Search, Plus, Eye, Edit, Trash2, BookOpen, Clock, Settings, Globe } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse, CourseSummaryPage } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CourseVisibilityModal } from './CourseVisibilityModal';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCategories } from '@/hooks/useApi';

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [hasIntroVideo, setHasIntroVideo] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  // Récupérer les catégories depuis l'API
  const { data: categories = [] } = useCategories();

  // API state
  const [coursesPage, setCoursesPage] = useState<CourseSummaryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Visibility modal state
  const [selectedCourseForVisibility, setSelectedCourseForVisibility] = useState<CourseResponse | null>(null);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);

  // Delete confirmation state
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Debounce de la recherche (300ms) + minLength 2
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= 2) {
        setDebouncedSearch(searchTerm);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Load courses from API with server-side pagination and filtering
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
          owner_type: ownerFilter !== 'all' ? (ownerFilter as 'learneezy' | 'of') : undefined,
          category_names: categoryFilter !== 'all' ? [categoryFilter] : undefined,
          learning_cycle: cycleFilter !== 'all' ? cycleFilter : undefined,
          sort: sortOption,
          price_min: priceMin ? parseFloat(priceMin) : undefined,
          price_max: priceMax ? parseFloat(priceMax) : undefined,
          has_intro_video: hasIntroVideo,
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
  }, [currentPage, debouncedSearch, statusFilter, ownerFilter, categoryFilter, cycleFilter, sortOption, priceMin, priceMax, hasIntroVideo, location.state]);

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
        owner_type: ownerFilter !== 'all' ? (ownerFilter as 'learneezy' | 'of') : undefined,
        category_names: categoryFilter !== 'all' ? [categoryFilter] : undefined,
        learning_cycle: cycleFilter !== 'all' ? cycleFilter : undefined,
        sort: sortOption,
        price_min: priceMin ? parseFloat(priceMin) : undefined,
        price_max: priceMax ? parseFloat(priceMax) : undefined,
        has_intro_video: hasIntroVideo,
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

      // Recharger avec les filtres actuels
      const filters = {
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        status: statusFilter !== 'all' ? (statusFilter as 'draft' | 'published') : undefined,
        owner_type: ownerFilter !== 'all' ? (ownerFilter as 'learneezy' | 'of') : undefined,
        category_names: categoryFilter !== 'all' ? [categoryFilter] : undefined,
        learning_cycle: cycleFilter !== 'all' ? cycleFilter : undefined,
        sort: sortOption,
        price_min: priceMin ? parseFloat(priceMin) : undefined,
        price_max: priceMax ? parseFloat(priceMax) : undefined,
        has_intro_video: hasIntroVideo,
        facets: true,
      };
      const data = await fastAPIClient.getCourses(filters);
      setCoursesPage(data);
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

  const getOwnerBadge = (owner_type: string, owner_id?: number | null) => {
    return owner_type === 'learneezy'
      ? <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 font-medium">Learneezy</Badge>
      : <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 font-medium">
        {owner_id ? `OF #${owner_id}` : 'OF'}
      </Badge>;
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
  }, [searchTerm, statusFilter, ownerFilter, categoryFilter, cycleFilter, sortOption, priceMin, priceMax, hasIntroVideo]);

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
            <div className="text-2xl font-bold">{coursesPage?.total_items || 0}</div>
            <p className="text-xs text-muted-foreground">Tous cours confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours publiés (page)</CardTitle>
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
            <CardTitle className="text-sm font-medium">Brouillons (page)</CardTitle>
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
            <CardTitle className="text-sm font-medium">Page actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentPage} / {coursesPage?.total_pages || 0}
            </div>
            <p className="text-xs text-muted-foreground">{coursesPage?.items.length || 0} cours</p>
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
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par propriétaire" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="learneezy">Learneezy</SelectItem>
                  <SelectItem value="of">Organismes</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Prix min (€)"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-[150px]"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Prix max (€)"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-[150px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="intro-video"
                  checked={hasIntroVideo === true}
                  onCheckedChange={(checked) => setHasIntroVideo(checked ? true : undefined)}
                />
                <Label htmlFor="intro-video" className="text-sm cursor-pointer">
                  Avec vidéo d'intro
                </Label>
              </div>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
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
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Étudiants</TableHead>
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
                            // Fallback : cover_key → première vidéo du premier module
                            let imageUrl = course.image_url;
                            if (!imageUrl && course.modules && course.modules.length > 0) {
                              const firstLesson = course.modules[0].content?.[0];
                              if (firstLesson?.video_key) {
                                // Utiliser l'endpoint redirect conforme à la spec
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
                        {getOwnerBadge(course.owner_type || 'learneezy', course.owner_id)}
                      </TableCell>
                      <TableCell>
                        {getCategoryBadges(course)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-1">👥</span>
                          <span>-</span>
                        </div>
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

export default AdminCourses;
