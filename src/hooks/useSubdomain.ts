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

  useEffect(() => {
    const detectSubdomain = async () => {
      try {
        const hostname = window.location.hostname;
        
        // Détection locale (développement)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
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
        
        if (result.exists) {
          setVerification(result);
        } else {
          setError('Organisation introuvable');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du sous-domaine:', err);
        setError('Erreur de vérification du sous-domaine');
      } finally {
        setIsLoading(false);
      }
    };

    detectSubdomain();
  }, []);

  return {
    subdomain,
    verification,
    isLoading,
    error,
    isOFSubdomain: !!verification?.exists,
  };
};
