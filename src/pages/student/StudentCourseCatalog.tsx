import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import { useTokenBalance, useEnrollCourse } from '@/hooks/useApi';
import { CourseCatalogCard } from '@/components/student/catalog/CourseCatalogCard';
import { CoursePurchaseDialog } from '@/components/student/catalog/CoursePurchaseDialog';
import { TokenBalanceWidget } from '@/components/student/catalog/TokenBalanceWidget';

const StudentCourseCatalog = () => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  
  // API hooks
  const { data: balanceData, isLoading: isLoadingBalance } = useTokenBalance();
  const enrollMutation = useEnrollCourse();
  
  const userBalance = balanceData?.balance ?? 0;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fastAPIClient.getCourses({
        status: 'published',
        page: 1,
        per_page: 50
      });
      setCourses(response.items);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories and levels for filters
  const { categories, levels } = useMemo(() => {
    const catSet = new Set<string>();
    const levelSet = new Set<string>();
    
    courses.forEach(course => {
      if (course.category_names) {
        course.category_names.forEach(cat => catSet.add(cat));
      } else if (course.category) {
        catSet.add(course.category);
      }
      if (course.level) {
        levelSet.add(course.level);
      }
    });
    
    return {
      categories: Array.from(catSet).sort(),
      levels: Array.from(levelSet).sort()
    };
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(course =>
        course.category_names?.includes(categoryFilter) ||
        course.category === categoryFilter
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      result = result.filter(course => course.level === levelFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [courses, searchQuery, categoryFilter, levelFilter, sortBy]);

  const handlePurchaseClick = (course: CourseResponse) => {
    setSelectedCourse(course);
    setShowPurchaseDialog(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedCourse) return;
    
    try {
      await enrollMutation.mutateAsync(selectedCourse.id);
      setShowPurchaseDialog(false);
      setSelectedCourse(null);
      // Refresh courses to update enrollment status
      fetchCourses();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setLevelFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || levelFilter !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            Catalogue de Cours
          </h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et achetez des formations avec vos tokens
          </p>
        </div>
      </div>

      {/* Token Balance */}
      <TokenBalanceWidget balance={userBalance} isLoading={isLoadingBalance} />

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous niveaux</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
                <SelectItem value="title">Alphabétique</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Recherche: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {categoryFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter('all')} />
              </Badge>
            )}
            {levelFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {levelFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setLevelFilter('all')} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredCourses.length} cours disponible{filteredCourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border animate-pulse">
              <div className="aspect-video bg-muted rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-10 bg-muted rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={fetchCourses} className="mt-4">
            Réessayer
          </Button>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && (
        <>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun cours trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Aucun cours ne correspond à vos critères de recherche."
                  : "Aucun cours n'est disponible pour le moment."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCatalogCard
                  key={course.id}
                  course={course}
                  onPurchase={handlePurchaseClick}
                  userTokenBalance={userBalance}
                  isLoading={enrollMutation.isPending && selectedCourse?.id === course.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Purchase Dialog */}
      <CoursePurchaseDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        course={selectedCourse}
        userTokenBalance={userBalance}
        onConfirm={handleConfirmPurchase}
        isLoading={enrollMutation.isPending}
      />
    </div>
  );
};

export default StudentCourseCatalog;
