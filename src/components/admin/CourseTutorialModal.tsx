import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { courseTutorialSteps, TutorialStep } from "@/data/courseTutorialSteps";

interface CourseTutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseTutorialModal({ open, onOpenChange }: CourseTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = courseTutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === courseTutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && !isLastStep) {
      handleNext();
    } else if (e.key === "ArrowLeft" && !isFirstStep) {
      handlePrevious();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl w-[95vw] max-h-[85vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Tutoriel : Créer un cours
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {courseTutorialSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / courseTutorialSteps.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / courseTutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-6">
          {/* Image */}
          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={step.image} 
              alt={step.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="bg-accent/50 rounded-lg p-4 space-y-2">
              <p className="font-medium text-sm text-accent-foreground">💡 Points clés :</p>
              <ul className="space-y-1 text-sm text-accent-foreground">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          {/* Dots indicators */}
          <div className="flex items-center gap-2">
            {courseTutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Aller à l'étape ${index + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            {isLastStep ? (
              <Button onClick={handleClose} className="gap-2">
                Terminer
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
