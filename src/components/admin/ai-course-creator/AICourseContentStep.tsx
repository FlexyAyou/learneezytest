
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, FileText, Edit2, RefreshCw, CheckCircle2, Clock, Target } from 'lucide-react';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AICourseContentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const AICourseContentStep = ({ onNext, onBack }: AICourseContentStepProps) => {
  const { generatedCourse, generateContent, isGenerating, steps } = useAICourseCreation();
  
  // Vérifier si l'étape de contenu est complétée
  const contentStep = steps.find(step => step.id === 'content');
  const isContentCompleted = contentStep?.isCompleted || false;

  useEffect(() => {
    // Si on n'a pas encore de cours généré et qu'on n'est pas en train de générer
    if (!generatedCourse && !isGenerating) {
      generateContent();
    }
  }, [generateContent, generatedCourse, isGenerating]);

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-pink-600 mx-auto animate-pulse mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Génération du contenu détaillé...
        </h3>
        <p className="text-gray-600 mb-4">
          L'IA rédige les leçons, exercices et activités pédagogiques
        </p>
      </div>
    );
  }

  if (!generatedCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun contenu généré disponible</p>
        <Button onClick={generateContent} className="mt-4">
          Générer le contenu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenu détaillé généré</h2>
        <p className="text-gray-600">
          Examinez et personnalisez le contenu de chaque leçon selon vos besoins
        </p>
      </div>

      {/* Content Overview */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Contenu généré avec succès
            </CardTitle>
            <Badge className="bg-purple-600 text-white">
              IA Content Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {generatedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Leçons complètes</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {generatedCourse.modules.reduce((acc, mod) => 
                  acc + mod.lessons.reduce((lesAcc, les) => lesAcc + (les.exercises?.length || 0), 0), 0
                )}
              </div>
              <div className="text-sm text-gray-600">Exercices</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.floor(generatedCourse.estimatedDuration / 60)}h{Math.floor((generatedCourse.estimatedDuration % 60))}m
              </div>
              <div className="text-sm text-gray-600">Durée totale</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Contenu des modules</h3>
          <Button variant="outline" size="sm" onClick={generateContent}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Régénérer tout
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {generatedCourse.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-blue-100 text-blue-800">
                    Module {moduleIndex + 1}
                  </Badge>
                  <div className="text-left">
                    <div className="font-semibold">{module.title}</div>
                    <div className="text-sm text-gray-600 font-normal">{module.lessons.length} leçons</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Card key={lesson.id} className="ml-4">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <Badge variant="outline" className="mr-3">
                                {lessonIndex + 1}
                              </Badge>
                              {lesson.title}
                            </CardTitle>
                            <CardDescription className="mt-2 flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {lesson.duration} min
                              </span>
                              {lesson.exercises && (
                                <span className="flex items-center">
                                  <Target className="h-4 w-4 mr-1" />
                                  {lesson.exercises.length} exercices
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none text-sm p-4 rounded bg-gray-50">
                          <div className="whitespace-pre-line">
                            {lesson.content.length > 300 
                              ? lesson.content.substring(0, 300) + '...' 
                              : lesson.content
                            }
                          </div>
                        </div>

                        {lesson.exercises && lesson.exercises.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-semibold text-sm mb-3 flex items-center">
                              <Target className="h-4 w-4 mr-2" />
                              Exercices ({lesson.exercises.length})
                            </h5>
                            <div className="space-y-3">
                              {lesson.exercises.slice(0, 2).map((exercise, exerciseIndex) => (
                                <div key={exercise.id} className="p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <Badge className="text-xs bg-blue-600 text-white">
                                      Exercice {exerciseIndex + 1} - {exercise.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium mb-2">{exercise.question}</p>
                                  {exercise.options && (
                                    <div className="space-y-1">
                                      {exercise.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center text-sm">
                                          <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs mr-2">
                                            {String.fromCharCode(65 + optionIndex)}
                                          </span>
                                          <span className={option === exercise.correctAnswer ? 'font-semibold text-green-700' : ''}>
                                            {option}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la structure
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-pink-600 hover:bg-pink-700"
          disabled={!isContentCompleted && !generatedCourse}
        >
          Finaliser le cours
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
