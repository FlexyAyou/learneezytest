import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, MessageSquare, TrendingUp, Award, Clock } from 'lucide-react';

const ParentStudentTracking = () => {
  const students = [
    {
      id: 1,
      name: "Emma Martin",
      avatar: "/placeholder.svg",
      age: 15,
      class: "3ème",
      globalProgress: 78,
      modules: [
        { name: "Mathématiques", progress: 85, status: "En cours" },
        { name: "Français", progress: 92, status: "Terminé" },
        { name: "Histoire-Géo", progress: 67, status: "En cours" },
        { name: "Anglais", progress: 74, status: "En cours" }
      ],
      results: [
        { subject: "Mathématiques", type: "Quiz", score: "16/20", date: "2024-01-15" },
        { subject: "Français", type: "Devoir", score: "18/20", date: "2024-01-12" },
        { subject: "Histoire", type: "Évaluation", score: "14/20", date: "2024-01-10" }
      ],
      feedback: [
        { 
          teacher: "M. Dubois", 
          subject: "Mathématiques", 
          comment: "Excellente progression en algèbre. Continue ainsi !",
          date: "2024-01-16"
        },
        { 
          teacher: "Mme Lefèvre", 
          subject: "Français", 
          comment: "Très bonnes analyses littéraires. Travail sérieux.",
          date: "2024-01-14"
        }
      ]
    },
    {
      id: 2,
      name: "Lucas Martin",
      avatar: "/placeholder.svg",
      age: 12,
      class: "6ème",
      globalProgress: 65,
      modules: [
        { name: "Mathématiques", progress: 72, status: "En cours" },
        { name: "Français", progress: 58, status: "En cours" },
        { name: "Sciences", progress: 80, status: "En cours" },
        { name: "Anglais", progress: 45, status: "En retard" }
      ],
      results: [
        { subject: "Mathématiques", type: "Quiz", score: "12/20", date: "2024-01-15" },
        { subject: "Sciences", type: "TP", score: "17/20", date: "2024-01-13" },
        { subject: "Français", type: "Dictée", score: "10/20", date: "2024-01-11" }
      ],
      feedback: [
        { 
          teacher: "M. Bernard", 
          subject: "Sciences", 
          comment: "Très bon esprit d'analyse. Participation active en classe.",
          date: "2024-01-15"
        },
        { 
          teacher: "Mme Petit", 
          subject: "Anglais", 
          comment: "Quelques difficultés à l'oral. Je recommande plus de pratique.",
          date: "2024-01-12"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En retard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score.split('/')[0]);
    if (numScore >= 16) return "text-green-600";
    if (numScore >= 12) return "text-blue-600";
    if (numScore >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suivi des élèves</h1>
          <p className="text-muted-foreground">Progression et résultats de vos enfants</p>
        </div>
      </div>

      <div className="grid gap-6">
        {students.map((student) => (
          <Card key={student.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {student.name}
                    <Badge variant="secondary">{student.class}</Badge>
                  </CardTitle>
                  <CardDescription>{student.age} ans</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{student.globalProgress}%</span>
                  </div>
                  <Progress value={student.globalProgress} className="w-24" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progression par modules */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4" />
                  Progression pédagogique
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {student.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{module.name}</span>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(module.status)}
                          >
                            {module.status}
                          </Badge>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <span className="ml-3 text-sm font-medium">{module.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résultats récents */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4" />
                  Résultats récents
                </h3>
                <div className="space-y-2">
                  {student.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">{result.subject}</span>
                          <span className="text-muted-foreground ml-2">({result.type})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{result.date}</span>
                        <span className={`font-semibold ${getScoreColor(result.score)}`}>
                          {result.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retours pédagogiques */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4" />
                  Retours pédagogiques
                </h3>
                <div className="space-y-3">
                  {student.feedback.map((feedback, index) => (
                    <div key={index} className="p-4 border-l-4 border-primary bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{feedback.teacher}</span>
                          <Badge variant="outline">{feedback.subject}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {feedback.date}
                        </div>
                      </div>
                      <p className="text-sm">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacter les formateurs
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Voir le détail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParentStudentTracking;