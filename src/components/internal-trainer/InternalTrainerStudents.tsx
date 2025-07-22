import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Star,
  MessageCircle,
  TrendingUp,
  Award,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledSessions: string[];
  progress: {
    modulesCompleted: number;
    totalModules: number;
    quizScore: number;
    assignmentsSubmitted: number;
    totalAssignments: number;
  };
  grades: {
    assignments: { name: string; grade: number; maxGrade: number; }[];
    quizzes: { name: string; score: number; }[];
    participation: number;
  };
  comments: string;
}

const InternalTrainerStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Martin',
      email: 'alice.martin@email.com',
      enrolledSessions: ['Formation Mathématiques - Niveau 1'],
      progress: {
        modulesCompleted: 7,
        totalModules: 10,
        quizScore: 85,
        assignmentsSubmitted: 3,
        totalAssignments: 4
      },
      grades: {
        assignments: [
          { name: 'Exercices Algèbre', grade: 16, maxGrade: 20 },
          { name: 'Problèmes Géométrie', grade: 14, maxGrade: 20 },
          { name: 'Analyse fonctions', grade: 18, maxGrade: 20 }
        ],
        quizzes: [
          { name: 'Quiz Chapitre 1', score: 90 },
          { name: 'Quiz Chapitre 2', score: 80 }
        ],
        participation: 85
      },
      comments: 'Excellente progression, très motivée'
    },
    {
      id: '2',
      name: 'Bob Dupont',
      email: 'bob.dupont@email.com',
      enrolledSessions: ['Formation Mathématiques - Niveau 1', 'Atelier Comptabilité'],
      progress: {
        modulesCompleted: 5,
        totalModules: 10,
        quizScore: 72,
        assignmentsSubmitted: 2,
        totalAssignments: 4
      },
      grades: {
        assignments: [
          { name: 'Exercices Algèbre', grade: 12, maxGrade: 20 },
          { name: 'Problèmes Géométrie', grade: 15, maxGrade: 20 }
        ],
        quizzes: [
          { name: 'Quiz Chapitre 1', score: 75 },
          { name: 'Quiz Chapitre 2', score: 70 }
        ],
        participation: 70
      },
      comments: 'A besoin d\'encouragements, difficulté en algèbre'
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGrade, setNewGrade] = useState({ assignment: '', grade: '', maxGrade: '' });
  const [newComment, setNewComment] = useState('');

  const handleAddGrade = (studentId: string) => {
    if (!newGrade.assignment || !newGrade.grade || !newGrade.maxGrade) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            assignments: [...student.grades.assignments, {
              name: newGrade.assignment,
              grade: parseInt(newGrade.grade),
              maxGrade: parseInt(newGrade.maxGrade)
            }]
          }
        };
      }
      return student;
    }));

    setNewGrade({ assignment: '', grade: '', maxGrade: '' });
    toast({
      title: "Note ajoutée",
      description: "La note a été ajoutée avec succès"
    });
  };

  const handleUpdateComment = (studentId: string) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, comments: newComment };
      }
      return student;
    }));

    setNewComment('');
    toast({
      title: "Commentaire mis à jour",
      description: "Le commentaire a été sauvegardé"
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAverageGrade = (assignments: { grade: number; maxGrade: number; }[]) => {
    if (assignments.length === 0) return 0;
    const total = assignments.reduce((acc, a) => acc + (a.grade / a.maxGrade) * 20, 0);
    return Math.round(total / assignments.length * 100) / 100;
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suivi et évaluation</h1>
          <p className="text-muted-foreground">Suivez la progression de vos apprenants</p>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Apprenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(students.reduce((acc, s) => acc + (s.progress.modulesCompleted / s.progress.totalModules) * 100, 0) / students.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Progression moy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(students.reduce((acc, s) => acc + getAverageGrade(s.grades.assignments), 0) / students.length * 100) / 100}
                </p>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {students.reduce((acc, s) => acc + s.grades.assignments.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Devoirs notés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Rechercher un apprenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des apprenants */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">Modules</span>
                      </div>
                      <Progress 
                        value={(student.progress.modulesCompleted / student.progress.totalModules) * 100} 
                        className="mb-1" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {student.progress.modulesCompleted}/{student.progress.totalModules} terminés
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Quiz</span>
                      </div>
                      <Progress value={student.progress.quizScore} className="mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Score moyen: {student.progress.quizScore}%
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ClipboardList className="h-4 w-4" />
                        <span className="text-sm font-medium">Devoirs</span>
                      </div>
                      <Progress 
                        value={(student.progress.assignmentsSubmitted / student.progress.totalAssignments) * 100} 
                        className="mb-1" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {student.progress.assignmentsSubmitted}/{student.progress.totalAssignments} rendus
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant="outline">
                    Moy: {getAverageGrade(student.grades.assignments)}/20
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Évaluation - {student.name}</DialogTitle>
                      </DialogHeader>
                      
                      {selectedStudent && (
                        <Tabs defaultValue="progress" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="progress">Progression</TabsTrigger>
                            <TabsTrigger value="grades">Notes</TabsTrigger>
                            <TabsTrigger value="evaluate">Évaluer</TabsTrigger>
                            <TabsTrigger value="comments">Commentaires</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="progress" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Modules
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold mb-2">
                                    {Math.round((selectedStudent.progress.modulesCompleted / selectedStudent.progress.totalModules) * 100)}%
                                  </div>
                                  <Progress value={(selectedStudent.progress.modulesCompleted / selectedStudent.progress.totalModules) * 100} />
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {selectedStudent.progress.modulesCompleted}/{selectedStudent.progress.totalModules} terminés
                                  </p>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center">
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Quiz
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold mb-2">
                                    {selectedStudent.progress.quizScore}%
                                  </div>
                                  <Progress value={selectedStudent.progress.quizScore} />
                                  <div className="space-y-1 mt-2">
                                    {selectedStudent.grades.quizzes.map((quiz, index) => (
                                      <div key={index} className="flex justify-between text-xs">
                                        <span>{quiz.name}</span>
                                        <span>{quiz.score}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Participation
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold mb-2">
                                    {selectedStudent.grades.participation}%
                                  </div>
                                  <Progress value={selectedStudent.grades.participation} />
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Évaluation globale
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="grades" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-3">Devoirs notés</h4>
                              <div className="space-y-2">
                                {selectedStudent.grades.assignments.map((assignment, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="font-medium">{assignment.name}</span>
                                    <Badge variant={assignment.grade >= assignment.maxGrade * 0.8 ? 'default' : assignment.grade >= assignment.maxGrade * 0.6 ? 'secondary' : 'destructive'}>
                                      {assignment.grade}/{assignment.maxGrade}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="evaluate" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-3">Ajouter une note</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <Input
                                  placeholder="Nom du devoir"
                                  value={newGrade.assignment}
                                  onChange={(e) => setNewGrade({ ...newGrade, assignment: e.target.value })}
                                />
                                <Input
                                  type="number"
                                  placeholder="Note obtenue"
                                  value={newGrade.grade}
                                  onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                                />
                                <Input
                                  type="number"
                                  placeholder="Note max"
                                  value={newGrade.maxGrade}
                                  onChange={(e) => setNewGrade({ ...newGrade, maxGrade: e.target.value })}
                                />
                              </div>
                              <Button 
                                onClick={() => handleAddGrade(selectedStudent.id)}
                                className="mt-3"
                              >
                                Ajouter la note
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="comments" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-3">Commentaire personnalisé</h4>
                              <Textarea
                                placeholder="Laissez un commentaire sur la progression de l'apprenant..."
                                value={newComment || selectedStudent.comments}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={4}
                              />
                              <Button 
                                onClick={() => handleUpdateComment(selectedStudent.id)}
                                className="mt-3"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Sauvegarder commentaire
                              </Button>
                            </div>
                            
                            {selectedStudent.comments && (
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-2">Commentaire actuel:</p>
                                <p className="text-sm">{selectedStudent.comments}</p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InternalTrainerStudents;