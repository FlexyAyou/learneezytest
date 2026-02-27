import { useState, useEffect } from 'react';
import { fastAPIClient } from '@/services/fastapi-client';
import { SubdomainVerification } from '@/types/fastapi';

/**
 * Hook pour détecter et vérifier le sous-domaine OF
 */
export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [verification, setVerification] = useState<SubdomainVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectSubdomain = async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
    }
    try {
      const hostname = window.location.hostname;

      // Détection locale (développement)
      const urlParams = new URLSearchParams(window.location.search);
      const mockSubdomain = urlParams.get('org');

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (mockSubdomain) {
          setSubdomain(mockSubdomain);
          const result = await fastAPIClient.verifySubdomain(`${mockSubdomain}.learneezy.com`);
          setVerification(result);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        return;
      }

      // Extraire le sous-domaine (ex: ekr de ekr.learneezy.com)
      const parts = hostname.split('.');

      // Si c'est juste learneezy.com (domaine principal), pas de sous-domaine
      if (parts.length <= 2) {
        setIsLoading(false);
        return;
      }

      // Le sous-domaine est la première partie
      const detectedSubdomain = parts[0];

      // Ignorer les sous-domaines systèmes
      if (['www', 'api', 'admin'].includes(detectedSubdomain)) {
        setIsLoading(false);
        return;
      }

      setSubdomain(detectedSubdomain);

      // Vérifier auprès du backend si ce sous-domaine existe
      const result = await fastAPIClient.verifySubdomain(hostname);

      setVerification(result);
      if (!result.exists) {
        setError('Organisation introuvable');
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du sous-domaine:', err);
      setError('Erreur de vérification du sous-domaine');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectSubdomain();

    // Rafraîchissement périodique toutes les 5 minutes en arrière-plan
    // On passe isBackground=true pour ne pas déclencher le LoadingSpinner
    const interval = setInterval(() => detectSubdomain(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    return detectSubdomain(true); // Rafraîchissement manuel sans bloquer l'UI
  };

  return {
    subdomain,
    verification,
    isLoading,
    error,
    refresh,
    isOFSubdomain: !!verification?.exists,
  };
};
