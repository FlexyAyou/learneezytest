
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  FileText, 
  Video, 
  Download,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';
import { CourseExtended, courseCategories, courseLevels } from '@/data/mockCoursesData';
import { useToast } from '@/hooks/use-toast';

interface CourseViewModalProps {
  course: CourseExtended | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: CourseExtended) => void;
}

export const CourseViewModal = ({ course, isOpen, onClose, onSave }: CourseViewModalProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState<CourseExtended | null>(null);

  React.useEffect(() => {
    if (course) {
      setEditedCourse({ ...course });
    }
  }, [course]);

  if (!course || !editedCourse) return null;

  const handleSave = () => {
    onSave(editedCourse);
    setEditMode(false);
    toast({
      title: "Cours mis à jour",
      description: `Le cours "${editedCourse.title}" a été mis à jour avec succès.`,
    });
  };

  const handleFieldChange = (field: keyof CourseExtended, value: any) => {
    setEditedCourse(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Mock lessons data
  const lessons = [
    { id: 1, title: "Introduction", duration: "15:30", type: "video", completed: false },
    { id: 2, title: "Concepts de base", duration: "22:45", type: "video", completed: false },
    { id: 3, title: "Exercices pratiques", duration: "18:20", type: "document", completed: false },
    { id: 4, title: "Quiz d'évaluation", duration: "10:00", type: "quiz", completed: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">{course.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(course.status)}>
                  {course.status === 'published' ? 'Publié' : 
                   course.status === 'draft' ? 'Brouillon' : 
                   course.status === 'pending' ? 'En attente' : 'Archivé'}
                </Badge>
                <span className="text-sm text-gray-500">par {course.instructor}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course video/thumbnail */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <Button size="lg" className="bg-white bg-opacity-20 hover:bg-opacity-30">
                          <Play className="h-6 w-6 mr-2" />
                          Aperçu du cours
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <Textarea
                        value={editedCourse.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={4}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-700">{course.description}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Course lessons */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Contenu du cours ({lessons.length} leçons)</CardTitle>
                      {editMode && (
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une leçon
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                                {lesson.type === 'video' && <Video className="h-4 w-4" />}
                                {lesson.type === 'document' && <FileText className="h-4 w-4" />}
                                {lesson.type === 'quiz' && <BookOpen className="h-4 w-4" />}
                              </div>
                            </div>
                          </div>
                          {editMode && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Prix</Label>
                      {editMode ? (
                        <Input
                          value={editedCourse.price}
                          onChange={(e) => handleFieldChange('price', e.target.value)}
                        />
                      ) : (
                        <p className="font-semibold text-lg">{course.price}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Durée</Label>
                      {editMode ? (
                        <Input
                          value={editedCourse.duration}
                          onChange={(e) => handleFieldChange('duration', e.target.value)}
                        />
                      ) : (
                        <p>{course.duration}</p>
                      )}
                    </div>

                    <div>
                      <Label>Niveau</Label>
                      {editMode ? (
                        <Select value={editedCourse.level} onValueChange={(value) => handleFieldChange('level', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {courseLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p>{course.level}</p>
                      )}
                    </div>

                    <div>
                      <Label>Catégorie</Label>
                      {editMode ? (
                        <Select value={editedCourse.category} onValueChange={(value) => handleFieldChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {courseCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p>{course.category}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Étudiants</span>
                      </div>
                      <span className="font-semibold">{course.totalStudents}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Note moyenne</span>
                      </div>
                      <span className="font-semibold">{course.averageRating}/5</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Taux de completion</span>
                      <span className="font-semibold">{course.completionRate}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Revenus</span>
                      <span className="font-semibold text-green-600">€{course.totalRevenue.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Détails du cours</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Titre du cours</Label>
                  {editMode ? (
                    <Input
                      value={editedCourse.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                    />
                  ) : (
                    <p className="font-medium">{course.title}</p>
                  )}
                </div>

                <div>
                  <Label>Instructeur</Label>
                  <p className="font-medium">{course.instructor}</p>
                </div>

                <div>
                  <Label>Organisation</Label>
                  <p>{course.organisationName}</p>
                </div>

                <div>
                  <Label>Type d'instructeur</Label>
                  <Badge variant="outline">
                    {course.instructorType === 'internal' ? 'Interne' : 'Externe'}
                  </Badge>
                </div>

                <div>
                  <Label>Date de création</Label>
                  <p>{course.createdDate}</p>
                </div>

                <div>
                  <Label>Dernière mise à jour</Label>
                  <p>{course.lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Étudiants inscrits ({course.totalStudents})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Liste des étudiants à implémenter...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics détaillés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Graphiques et analyses détaillées à implémenter...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
