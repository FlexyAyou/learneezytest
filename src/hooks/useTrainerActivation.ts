import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrainerFiscalInfo {
  id?: string;
  user_id: string;
  nda_number: string | null;
  status: string | null;
  siret: string | null;
  tva_number: string | null;
  is_complete: boolean;
}

export const useTrainerActivation = (userId: string | undefined) => {
  const [fiscalInfo, setFiscalInfo] = useState<TrainerFiscalInfo | null>(null);
  const [userStatus, setUserStatus] = useState<string>('pending');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Check first login
    const firstLoginKey = `trainer_first_login_${userId}`;
    const hasLoggedBefore = localStorage.getItem(firstLoginKey);
    
    if (!hasLoggedBefore) {
      setIsFirstLogin(true);
      localStorage.setItem(firstLoginKey, 'true');
    }

    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // TODO: Replace with actual Supabase calls when tables are created
      // For now, using mock data
      setUserStatus('pending');
      setFiscalInfo(null);

      // Example implementation for when tables exist:
      // const { data: profileData } = await supabase
      //   .from('profiles')
      //   .select('status')
      //   .eq('id', userId)
      //   .single();
      // setUserStatus(profileData?.status || 'pending');

      // const { data: fiscalData } = await supabase
      //   .from('trainer_fiscal_info')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .maybeSingle();
      // setFiscalInfo(fiscalData);
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFiscalInfo = async (data: Partial<TrainerFiscalInfo>) => {
    if (!userId) return;

    try {
      const isComplete = !!(
        data.nda_number &&
        data.status &&
        data.siret
      );

      // TODO: Replace with actual Supabase call when table is created
      console.log('Saving fiscal info:', { ...data, is_complete: isComplete });
      
      toast({
        title: 'Informations enregistrées',
        description: isComplete 
          ? 'Votre profil fiscal est maintenant complet.' 
          : 'Informations sauvegardées. Veuillez compléter tous les champs requis.',
      });

      // Example implementation for when table exists:
      // const fiscalData = {
      //   user_id: userId,
      //   nda_number: data.nda_number || null,
      //   status: data.status || null,
      //   siret: data.siret || null,
      //   tva_number: data.tva_number || null,
      //   is_complete: isComplete,
      // };
      // await supabase.from('trainer_fiscal_info').upsert(fiscalData, { onConflict: 'user_id' });

      await fetchData();
    } catch (error) {
      console.error('Error updating fiscal info:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les informations.',
        variant: 'destructive',
      });
    }
  };

  const shouldShowAlert = 
    userStatus !== 'active' || 
    !fiscalInfo?.is_complete || 
    isFirstLogin;

  return {
    isActive: userStatus === 'active',
    fiscalInfo,
    isFirstLogin,
    shouldShowAlert,
    isLoading,
    updateFiscalInfo,
    refreshData: fetchData,
  };
};
