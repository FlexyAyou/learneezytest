import { useMemo } from 'react';
import { useFastAPIAuth } from './useFastAPIAuth';

export type StudentType = 'learneezy' | 'of';

interface StudentContext {
  /** True si l'apprenant appartient à un OF */
  isOFStudent: boolean;
  /** ID de l'OF si apprenant OF */
  ofId: number | null;
  /** Nom de l'organisation si apprenant OF */
  ofName: string | null;
  /** Type d'apprenant */
  studentType: StudentType;
  /** Vérifie si l'apprenant a accès à une fonctionnalité */
  hasAccess: (feature: StudentFeature) => boolean;
}

export type StudentFeature = 
  | 'catalogue'
  | 'boutique'
  | 'subscription'
  | 'learneezy-support'
  | 'all-courses'
  | 'of-messaging';

/**
 * Hook pour détecter le type d'apprenant et gérer les restrictions
 * - Apprenant Learneezy : accès complet (catalogue, boutique, abonnements)
 * - Apprenant OF : accès restreint (cours assignés, messaging OF uniquement)
 */
export const useStudentContext = (): StudentContext => {
  const { user } = useFastAPIAuth();

  const context = useMemo<StudentContext>(() => {
    // Vérifier si l'utilisateur appartient à un OF (autre que Learneezy)
    const ofId = user?.of_id || null;
    const isOFStudent = ofId !== null && ofId !== undefined;
    const ofName = (user as any)?.organization_name || null;
    const studentType: StudentType = isOFStudent ? 'of' : 'learneezy';

    const hasAccess = (feature: StudentFeature): boolean => {
      // Fonctionnalités réservées aux apprenants Learneezy
      const learneezyOnlyFeatures: StudentFeature[] = [
        'catalogue',
        'boutique',
        'subscription',
        'learneezy-support',
        'all-courses'
      ];

      // Fonctionnalités réservées aux apprenants OF
      const ofOnlyFeatures: StudentFeature[] = [
        'of-messaging'
      ];

      if (learneezyOnlyFeatures.includes(feature)) {
        return !isOFStudent;
      }

      if (ofOnlyFeatures.includes(feature)) {
        return isOFStudent;
      }

      // Par défaut, accès autorisé
      return true;
    };

    return {
      isOFStudent,
      ofId,
      ofName,
      studentType,
      hasAccess,
    };
  }, [user]);

  return context;
};
