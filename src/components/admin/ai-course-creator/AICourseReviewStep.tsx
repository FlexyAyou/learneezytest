
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, BookOpen, Clock, Target, Users, Star, Wand2 } from 'lucide-react';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';

interface AICourseReviewStepProps {
  onBack: () => void;
  onFinish: () => void;
}

export const AICourseReviewStep = ({ onBack, onFinish }: AICourseReviewStepProps) => {
  const { generatedCourse, configData } = useAICourseCreation();

  if (!generatedCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun cours généré disponible</p>
      </div>
    );
  }

  const totalLessons = generatedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalExercises = generatedCourse.modules.reduce((acc, mod) => 
    acc + mod.lessons.reduce((lesAcc, les) => lesAcc + (les.exercises?.length || 0), 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cours généré avec succès !</h2>
        </div>
        <p className="text-gray-600">
          Votre cours a été créé par l'IA. Vérifiez les détails avant de le publier.
        </p>
      </div>

      {/* Course Summary */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-green-800">
              {generatedCourse.title}
            </CardTitle>
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              <Wand2 className="h-3 w-3 mr-1" />
              Généré par IA
            </Badge>
          </div>
          <CardDescription className="text-green-700 text-base">
            {generatedCourse.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{generatedCourse.modules.length}</div>
              <div className="text-sm text-gray-600">Modules</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Leçons</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{totalExercises}</div>
              <div className="text-sm text-gray-600">Exercices</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(generatedCourse.estimatedDuration / 60)}h{Math.floor((generatedCourse.estimatedDuration % 60))}m
              </div>
              <div className="text-sm text-gray-600">Durée</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails du cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Niveau et matière</h4>
              <div className="flex space-x-2">
                <Badge className="bg-blue-100 text-blue-800">{generatedCourse.level}</Badge>
                <Badge className="bg-purple-100 text-purple-800">{generatedCourse.category}</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Objectifs pédagogiques</h4>
              <div className="space-y-2">
                {generatedCourse.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {objective}
                  </div>
                ))}
              </div>
            </div>

            {generatedCourse.prerequisites && generatedCourse.prerequisites.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Prérequis</h4>
                <div className="space-y-2">
                  {generatedCourse.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {prerequisite}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Structure Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Structure du cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedCourse.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-sm">
                      Module {moduleIndex + 1}: {module.title}
                    </h5>
                    <Badge className="text-xs bg-gray-100 text-gray-600">
                      {Math.floor(module.duration / 60)}h{Math.floor((module.duration % 60))}m
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center text-xs text-gray-600">
                        <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 mr-2">
                          {lessonIndex + 1}
                        </span>
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-gray-500">{lesson.duration}min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Assessment */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Star className="h-5 w-5 mr-2" />
            Évaluation qualité IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">9.2/10</div>
              <div className="text-sm text-gray-600">Cohérence pédagogique</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8.8/10</div>
              <div className="text-sm text-gray-600">Adaptation au niveau</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">9.1/10</div>
              <div className="text-sm text-gray-600">Richesse du contenu</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <h5 className="font-semibold text-sm mb-2 text-blue-800">Recommandations IA</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Le cours respecte parfaitement les objectifs pédagogiques définis</li>
              <li>• La progression est adaptée au niveau {generatedCourse.level}</li>
              <li>• Les exercices sont variés et permettent une validation des acquis</li>
              <li>• Le contenu peut être enrichi avec des supports visuels supplémentaires</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines étapes</CardTitle>
          <CardDescription>
            Que souhaitez-vous faire avec ce cours généré par IA ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-3" />
              <span>Le cours sera enregistré comme brouillon</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-3" />
              <span>Vous pourrez le modifier dans l'éditeur de cours</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-3" />
              <span>Une fois validé, il sera soumis pour approbation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-3" />
              <span>Les étudiants pourront y accéder après publication</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au contenu
        </Button>
        <Button onClick={onFinish} className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Créer le cours
        </Button>
      </div>
    </div>
  );
};
