
import React, { useState } from 'react';
import { BookOpen, Eye, Check, X, AlertTriangle, Clock, Star, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const AdminCourses = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const pendingCourses = [
    { 
      id: 1, 
      title: "Python pour Data Science", 
      instructor: "Jean Dupont", 
      status: "En révision", 
      submittedDate: "2024-03-10",
      category: "Programmation",
      duration: "40h",
      price: "€199",
      studentsCount: 0,
      rating: 0,
      description: "Cours complet sur Python appliqué à la data science"
    },
    { 
      id: 2, 
      title: "Design Thinking Avancé", 
      instructor: "Marie Claire", 
      status: "En attente", 
      submittedDate: "2024-03-12",
      category: "Design",
      duration: "25h",
      price: "€149",
      studentsCount: 0,
      rating: 0,
      description: "Méthodologie complète du design thinking"
    }
  ];

  const publishedCourses = [
    { 
      id: 4, 
      title: "JavaScript ES2024", 
      instructor: "Paul Dubois", 
      status: "Publié", 
      publishedDate: "2024-02-15",
      category: "Programmation",
      duration: "35h",
      price: "€159",
      studentsCount: 245,
      rating: 4.8,
      description: "Maîtrisez les dernières fonctionnalités JavaScript"
    }
  ];

  const handleCourseAction = (courseId: number, action: string) => {
    setSelectedCourse(courseId);
    toast({
      title: `Action cours`,
      description: `${action} pour le cours ${courseId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En révision': return 'bg-orange-100 text-orange-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Corrections demandées': return 'bg-red-100 text-red-800';
      case 'Publié': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Modération des cours</h2>
        <p className="text-gray-600">Examinez et approuvez les nouveaux cours</p>
      </div>

      {/* Statistiques de modération */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">Nouveaux cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En révision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-muted-foreground">En cours d'examen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approuvés ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">34</div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux d'approbation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Moyenne sur 3 mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cours en attente de modération */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Cours en attente de modération
              </CardTitle>
              <CardDescription>Examinez et approuvez les nouveaux cours soumis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">par {course.instructor}</p>
                        <p className="text-sm text-gray-700 mb-2">{course.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>📚 {course.category}</span>
                          <span>⏱️ {course.duration}</span>
                          <span>💰 {course.price}</span>
                          <span>📅 Soumis le {course.submittedDate}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCourseAction(course.id, 'Prévisualiser')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Prévisualiser
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleCourseAction(course.id, 'Approuver')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleCourseAction(course.id, 'Rejeter')}
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

          {/* Cours récemment publiés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-600" />
                Cours récemment publiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">par {course.instructor}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                          <span>👥 {course.studentsCount} étudiants</span>
                          <span>⭐ {course.rating}/5</span>
                          <span>📅 Publié le {course.publishedDate}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleCourseAction(course.id, 'Voir détails')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCourseAction(course.id, 'Rapport')}>
                        <Download className="h-4 w-4 mr-2" />
                        Rapport
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel d'évaluation */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Critères d'évaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Contenu pédagogique</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Objectifs clairs</li>
                  <li>• Structure logique</li>
                  <li>• Qualité du matériel</li>
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Aspects techniques</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Qualité vidéo/audio</li>
                  <li>• Ressources téléchargeables</li>
                  <li>• Quiz et exercices</li>
                </ul>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Conformité</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Respect des règles</li>
                  <li>• Contenu approprié</li>
                  <li>• Droits d'auteur</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>Commentaires de modération</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Ajoutez vos commentaires pour l'instructeur..."
                  className="mb-4"
                />
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Envoyer et approuver
                  </Button>
                  <Button size="sm" variant="outline">
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
