import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({ 
  data, 
  onSave, 
  delay = 2000,
  enabled = true 
}: UseAutoSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const initialDataRef = useRef<string>();

  useEffect(() => {
    // Initialize with current data
    if (!initialDataRef.current) {
      initialDataRef.current = JSON.stringify(data);
      return;
    }

    // Check if data has changed
    const currentDataStr = JSON.stringify(data);
    const hasChanged = currentDataStr !== initialDataRef.current;
    setHasChanges(hasChanged);

    if (!enabled || !hasChanged) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create new timeout to save after delay
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(data);
        setLastSaved(new Date());
        setHasChanges(false);
        initialDataRef.current = currentDataStr;
      } catch (error) {
        console.error('Auto-save error:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible d'enregistrer les modifications",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled, toast]);

  const forceSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date());
      setHasChanges(false);
      initialDataRef.current = JSON.stringify(data);
      toast({
        title: "✓ Sauvegardé",
        description: "Modifications enregistrées",
        duration: 2000
      });
    } catch (error) {
      console.error('Force save error:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    isSaving, 
    lastSaved, 
    hasChanges,
    forceSave
  };
}
