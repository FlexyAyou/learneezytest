
import React, { useState, useMemo } from 'react';
import { BookOpen, Eye, Edit, Copy, Archive, Trash2, Search, Filter, Grid, List, Plus, Download, Upload, AlertTriangle, TrendingUp, Users, DollarSign, Star, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { extendedCoursesData, mockOrganisations, courseCategories, courseLevels, CourseExtended } from '@/data/mockCoursesData';

const AdminCourses = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [organisationFilter, setOrganisationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_date');

  // Calculate statistics
  const totalCourses = extendedCoursesData.length;
  const publishedCourses = extendedCoursesData.filter(c => c.status === 'published').length;
  const totalRevenue = extendedCoursesData.reduce((sum, course) => sum + course.totalRevenue, 0);
  const totalStudents = extendedCoursesData.reduce((sum, course) => sum + course.totalStudents, 0);
  const avgCompletionRate = extendedCoursesData
    .filter(c => c.status === 'published')
    .reduce((sum, course) => sum + course.completionRate, 0) / publishedCourses;

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = extendedCoursesData.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesOrganisation = organisationFilter === 'all' || course.organisationId === organisationFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesOrganisation;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'students':
          return b.totalStudents - a.totalStudents;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'created_date':
        default:
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, categoryFilter, organisationFilter, sortBy]);

  const handleCourseAction = (courseId: string, action: string) => {
    toast({
      title: `Action cours`,
      description: `${action} pour le cours ${courseId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  // Top performing courses
  const topCoursesByRevenue = extendedCoursesData
    .filter(c => c.status === 'published')
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const topCoursesByStudents = extendedCoursesData
    .filter(c => c.status === 'published')
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catalogue des cours</h2>
          <p className="text-gray-600">Gestion complète du catalogue de formation</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleCourseAction('', 'Exporter')}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={() => handleCourseAction('', 'Importer')}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => handleCourseAction('', 'Créer')} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">{publishedCourses} publiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Toutes formations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Moyenne générale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Section - Course Catalog */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Catalogue des cours ({filteredCourses.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un cours, formateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {courseCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={organisationFilter} onValueChange={setOrganisationFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes organisations</SelectItem>
                    {mockOrganisations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_date">Date création</SelectItem>
                    <SelectItem value="title">Titre</SelectItem>
                    <SelectItem value="revenue">Revenus</SelectItem>
                    <SelectItem value="students">Étudiants</SelectItem>
                    <SelectItem value="rating">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course List/Grid */}
              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cours</TableHead>
                        <TableHead>Formateur</TableHead>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Étudiants</TableHead>
                        <TableHead>Revenus</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                              <div>
                                <div className="font-semibold">{course.title}</div>
                                <div className="text-sm text-gray-500">{course.level} • {course.category}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{course.instructor}</div>
                              <Badge variant="outline" className="text-xs">
                                {course.instructorType === 'internal' ? 'Interne' : 'Externe'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{course.organisationName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusLabel(course.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.totalStudents}</TableCell>
                          <TableCell>€{course.totalRevenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              {course.averageRating.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleCourseAction(course.id, 'Voir')}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleCourseAction(course.id, 'Éditer')}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleCourseAction(course.id, 'Dupliquer')}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-2 right-2 ${getStatusColor(course.status)}`}>
                          {getStatusLabel(course.status)}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-2">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">par {course.instructor}</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span>{course.level}</span>
                          <span>{course.category}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.totalStudents}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            €{course.totalRevenue.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {course.averageRating.toFixed(1)}
                          </div>
                        </div>
                        <div className="flex justify-between mt-3">
                          <Button variant="outline" size="sm" onClick={() => handleCourseAction(course.id, 'Voir')}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCourseAction(course.id, 'Éditer')}>
                            <Edit className="h-4 w-4 mr-1" />
                            Éditer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel - Statistics & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => handleCourseAction('', 'Créer')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleCourseAction('', 'Template')}>
                <Copy className="h-4 w-4 mr-2" />
                Depuis template
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleCourseAction('', 'Rapport')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapport complet
              </Button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Cours en attente</p>
                <p className="text-xs text-yellow-700">2 cours nécessitent une validation</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800">Problèmes signalés</p>
                <p className="text-xs text-red-700">1 cours avec feedback négatif</p>
              </div>
            </CardContent>
          </Card>

          {/* Top Courses by Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCoursesByRevenue.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.instructor}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-600">€{course.totalRevenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Courses by Students */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top popularité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCoursesByStudents.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.instructor}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600">{course.totalStudents}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
