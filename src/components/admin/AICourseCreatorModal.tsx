
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, Brain, Zap, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAICourseCreation } from '@/hooks/useAICourseCreation';
import { AICourseConfigStep } from './ai-course-creator/AICourseConfigStep';
import { AICourseOutlineStep } from './ai-course-creator/AICourseOutlineStep';
import { AICourseContentStep } from './ai-course-creator/AICourseContentStep';
import { AICourseReviewStep } from './ai-course-creator/AICourseReviewStep';

interface AICourseCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: any) => void;
}

export const AICourseCreatorModal = ({ isOpen, onClose, onCourseCreated }: AICourseCreatorModalProps) => {
  const {
    currentStep,
    steps,
    isGenerating,
    generationProgress,
    currentGenerationStep,
    updateStep,
    resetCreation,
    saveFinalCourse
  } = useAICourseCreation();

  const handleClose = () => {
    resetCreation();
    onClose();
  };

  const handleFinish = async () => {
    const createdCourse = await saveFinalCourse();
    onCourseCreated(createdCourse);
    handleClose();
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 'config':
        return <AICourseConfigStep onNext={() => updateStep('outline')} />;
      case 'outline':
        return <AICourseOutlineStep 
          onNext={() => updateStep('content')} 
          onBack={() => updateStep('config')} 
        />;
      case 'content':
        return <AICourseContentStep 
          onNext={() => updateStep('review')} 
          onBack={() => updateStep('outline')} 
        />;
      case 'review':
        return <AICourseReviewStep 
          onBack={() => updateStep('content')}
          onFinish={handleFinish}
        />;
      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Wand2 className="h-6 w-6 text-pink-600" />
                  <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Assistant IA - Création de cours
                </DialogTitle>
              </div>
              <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200">
                <Brain className="h-3 w-3 mr-1" />
                Prototype
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Étape {currentStepIndex + 1} sur {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% complété
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-3" />
            
            <div className="grid grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                    step.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : step.isActive 
                        ? 'bg-pink-600 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.isCompleted ? '✓' : index + 1}
                  </div>
                  <div className={`text-xs font-medium ${
                    step.isActive ? 'text-pink-600' : step.isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl border">
              <div className="relative mb-4">
                <Brain className="h-16 w-16 text-pink-600 mx-auto animate-pulse" />
                <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                L'IA génère votre cours...
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {currentGenerationStep}
              </p>
              <div className="w-64 mx-auto">
                <Progress value={generationProgress} className="h-3 mb-2" />
                <p className="text-xs text-gray-500">
                  {Math.round(generationProgress)}% - Veuillez patienter
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {getStepComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
