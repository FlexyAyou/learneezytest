import { useState, useCallback } from 'react';

const DRAFT_VERSION = 1;
const DRAFT_EXPIRY_DAYS = 7;

interface DraftData {
  version: number;
  timestamp: number;
  courseData: any;
  modules: any[];
  currentStep: 'info' | 'modules' | 'review';
  expandedModule?: string | null;
}

interface UseLocalStorageDraftOptions {
  key: string;
  expiryDays?: number;
}

export const useLocalStorageDraft = ({ key, expiryDays = DRAFT_EXPIRY_DAYS }: UseLocalStorageDraftOptions) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveDraft = useCallback((data: Omit<DraftData, 'version' | 'timestamp'>) => {
    try {
      // Exclure les objets File qui sont trop lourds pour localStorage
      const sanitizedData = {
        ...data,
        courseData: {
          ...data.courseData,
          image: null, // On garde juste imagePreview
          programFile: null, // On garde juste programFileName
          pedagogicalResources: data.courseData.pedagogicalResources?.map((r: any) => ({
            id: r.id,
            name: r.name,
            key: r.key,
            size: r.size,
            url: r.url,
            // file exclu
          })),
        },
        modules: data.modules.map(module => ({
          ...module,
          lessons: module.lessons.map((lesson: any) => ({
            ...lesson,
            file: undefined, // Exclure le File object
            // Garder filePreview, fileName, uploadedVideoKey, mediaUrl
          })),
        })),
      };

      const draft: DraftData = {
        version: DRAFT_VERSION,
        timestamp: Date.now(),
        ...sanitizedData,
      };

      localStorage.setItem(key, JSON.stringify(draft));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
    }
  }, [key]);

  const loadDraft = useCallback((): DraftData | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const draft: DraftData = JSON.parse(stored);

      // Vérifier la version
      if (draft.version !== DRAFT_VERSION) {
        console.warn('Version de brouillon incompatible');
        clearDraft();
        return null;
      }

      // Vérifier l'expiration
      const expiryTime = expiryDays * 24 * 60 * 60 * 1000;
      if (Date.now() - draft.timestamp > expiryTime) {
        console.log('Brouillon expiré');
        clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error);
      return null;
    }
  }, [key, expiryDays]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setLastSaved(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du brouillon:', error);
    }
  }, [key]);

  const hasDraft = useCallback((): boolean => {
    return loadDraft() !== null;
  }, [loadDraft]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    lastSaved,
  };
};
