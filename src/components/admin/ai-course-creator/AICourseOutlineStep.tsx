
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Target, RefreshCw, Edit2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';

interface AICourseOutlineStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const AICourseOutlineStep = ({ onNext, onBack }: AICourseOutlineStepProps) => {
  const { configData, generatedCourse, generateOutline, isGenerating, regenerateModule } = useAICourseCreation();
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  useEffect(() => {
    if (!generatedCourse && !isGenerating) {
      generateOutline();
    }
  }, [generatedCourse, isGenerating, generateOutline]);

  if (isGenerating || !generatedCourse) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-pink-600 mx-auto animate-pulse mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Génération de la structure...
        </h3>
        <p className="text-gray-600">
          L'IA analyse votre demande et créé l'architecture pédagogique optimale
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Structure du cours générée</h2>
        <p className="text-gray-600">
          Vérifiez et ajustez la structure proposée par l'IA avant de générer le contenu détaillé
        </p>
      </div>

      {/* Course Overview */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-green-800">{generatedCourse.title}</CardTitle>
            <Badge className="bg-green-600 text-white">
              Structure validée par IA
            </Badge>
          </div>
          <CardDescription className="text-green-700">
            {generatedCourse.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{generatedCourse.modules.length}</div>
              <div className="text-sm text-gray-600">Modules</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {generatedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Leçons</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{Math.floor(generatedCourse.estimatedDuration / 60)}h</div>
              <div className="text-sm text-gray-600">Durée totale</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{generatedCourse.objectives.length}</div>
              <div className="text-sm text-gray-600">Objectifs</div>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Objectifs pédagogiques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {generatedCourse.objectives.map((objective, index) => (
                <div key={index} className="flex items-center text-sm text-green-700 bg-white p-2 rounded">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {objective}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Structure */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Structure des modules</h3>
          <Button variant="outline" size="sm" onClick={() => generateOutline()} disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Régénérer structure
          </Button>
        </div>

        {generatedCourse.modules.map((module, moduleIndex) => (
          <Card key={module.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Module {moduleIndex + 1}
                    </Badge>
                  </div>
                  <div>
                    {editingModule === module.id ? (
                      <Input
                        defaultValue={module.title}
                        className="font-semibold text-lg"
                        onBlur={() => setEditingModule(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingModule(null)}
                        autoFocus
                      />
                    ) : (
                      <CardTitle 
                        className="text-lg cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingModule(module.id)}
                      >
                        {module.title}
                      </CardTitle>
                    )}
                    <CardDescription className="mt-1">{module.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-100 text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {Math.floor(module.duration / 60)}h
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => regenerateModule(module.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingModule(module.id)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Leçons ({module.lessons.length})
                </h5>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {lessonIndex + 1}
                      </Badge>
                      {editingLesson === lesson.id ? (
                        <Input
                          defaultValue={lesson.title}
                          className="text-sm"
                          onBlur={() => setEditingLesson(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingLesson(null)}
                          autoFocus
                        />
                      ) : (
                        <div>
                          <span 
                            className="font-medium text-sm cursor-pointer hover:text-blue-600"
                            onClick={() => setEditingLesson(lesson.id)}
                          >
                            {lesson.title}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {lesson.duration}min
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setEditingLesson(lesson.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une leçon
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un module
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la configuration
        </Button>
        <Button onClick={onNext} className="bg-pink-600 hover:bg-pink-700">
          Générer le contenu détaillé
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
