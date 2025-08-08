
import { useState, useCallback } from 'react';
import { CourseAIData, mockAIResponse, aiGenerationSteps, estimatedCosts } from '@/data/mockAIData';

export interface AICourseCreationStep {
  id: 'config' | 'outline' | 'content' | 'review';
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CourseConfigData {
  title: string;
  level: string;
  category: string;
  estimatedDuration: string;
  description: string;
  objectives: string[];
}

export interface AICourseCreationState {
  currentStep: 'config' | 'outline' | 'content' | 'review';
  steps: AICourseCreationStep[];
  configData: CourseConfigData | null;
  generatedCourse: CourseAIData | null;
  isGenerating: boolean;
  generationProgress: number;
  currentGenerationStep: string;
  error: string | null;
  costs: typeof estimatedCosts;
}

const initialSteps: AICourseCreationStep[] = [
  { id: 'config', title: 'Configuration', description: 'Paramètres du cours', isCompleted: false, isActive: true },
  { id: 'outline', title: 'Structure', description: 'Plan et modules', isCompleted: false, isActive: false },
  { id: 'content', title: 'Contenu', description: 'Leçons détaillées', isCompleted: false, isActive: false },
  { id: 'review', title: 'Révision', description: 'Validation finale', isCompleted: false, isActive: false }
];

export const useAICourseCreation = () => {
  const [state, setState] = useState<AICourseCreationState>({
    currentStep: 'config',
    steps: initialSteps,
    configData: null,
    generatedCourse: null,
    isGenerating: false,
    generationProgress: 0,
    currentGenerationStep: '',
    error: null,
    costs: estimatedCosts
  });

  const updateStep = useCallback((stepId: 'config' | 'outline' | 'content' | 'review') => {
    setState(prev => ({
      ...prev,
      currentStep: stepId,
      steps: prev.steps.map(step => ({
        ...step,
        isActive: step.id === stepId,
        isCompleted: step.id !== stepId && prev.steps.findIndex(s => s.id === stepId) > prev.steps.findIndex(s => s.id === step.id)
      }))
    }));
  }, []);

  const saveConfigData = useCallback((config: CourseConfigData) => {
    setState(prev => ({
      ...prev,
      configData: config,
      steps: prev.steps.map(step => 
        step.id === 'config' ? { ...step, isCompleted: true } : step
      )
    }));
  }, []);

  const simulateAIGeneration = useCallback(async (type: 'outline' | 'content') => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      generationProgress: 0,
      error: null
    }));

    // Simulation des étapes de génération
    for (let i = 0; i < aiGenerationSteps.length; i++) {
      const step = aiGenerationSteps[i];
      setState(prev => ({
        ...prev,
        currentGenerationStep: step.description,
        generationProgress: ((i + 1) / aiGenerationSteps.length) * 100
      }));
      
      // Délai simulé pour chaque étape
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    }

    // Simulation de génération réussie
    setState(prev => ({
      ...prev,
      isGenerating: false,
      generationProgress: 100,
      generatedCourse: mockAIResponse.mathCP,
      steps: prev.steps.map(step => 
        step.id === type ? { ...step, isCompleted: true } : step
      )
    }));
  }, []);

  const generateOutline = useCallback(async () => {
    await simulateAIGeneration('outline');
  }, [simulateAIGeneration]);

  const generateContent = useCallback(async () => {
    await simulateAIGeneration('content');
  }, [simulateAIGeneration]);

  const regenerateModule = useCallback(async (moduleId: string) => {
    setState(prev => ({ ...prev, isGenerating: true, currentGenerationStep: 'Régénération du module...' }));
    
    // Simulation de régénération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setState(prev => ({
      ...prev,
      isGenerating: false,
      currentGenerationStep: 'Module mis à jour avec succès'
    }));
  }, []);

  const saveFinalCourse = useCallback(() => {
    // Simulation de sauvegarde
    console.log('Cours sauvegardé:', state.generatedCourse);
    return Promise.resolve({
      id: `ai-course-${Date.now()}`,
      ...state.generatedCourse!
    });
  }, [state.generatedCourse]);

  const resetCreation = useCallback(() => {
    setState({
      currentStep: 'config',
      steps: initialSteps,
      configData: null,
      generatedCourse: null,
      isGenerating: false,
      generationProgress: 0,
      currentGenerationStep: '',
      error: null,
      costs: estimatedCosts
    });
  }, []);

  return {
    ...state,
    updateStep,
    saveConfigData,
    generateOutline,
    generateContent,
    regenerateModule,
    saveFinalCourse,
    resetCreation
  };
};
