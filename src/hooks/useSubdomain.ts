import { useState, useEffect } from 'react';

interface SubdomainInfo {
  isOFSubdomain: boolean;
  ofSlug: string | null;
  isMainDomain: boolean;
}

/**
 * Hook pour détecter et gérer les sous-domaines des OF
 */
export const useSubdomain = (): SubdomainInfo => {
  const [subdomainInfo, setSubdomainInfo] = useState<SubdomainInfo>({
    isOFSubdomain: false,
    ofSlug: null,
    isMainDomain: true,
  });

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Domaines de développement
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setSubdomainInfo({
        isOFSubdomain: false,
        ofSlug: null,
        isMainDomain: true,
      });
      return;
    }

    // Extraire le sous-domaine
    const parts = hostname.split('.');
    
    // Si c'est le domaine principal (testlearneezy.testdevinfinitiax.fr)
    // ou lovable.app/dev, pas de sous-domaine OF
    if (
      parts.length <= 2 || 
      hostname.endsWith('.lovable.app') || 
      hostname.endsWith('.lovable.dev')
    ) {
      setSubdomainInfo({
        isOFSubdomain: false,
        ofSlug: null,
        isMainDomain: true,
      });
      return;
    }

    // C'est un sous-domaine d'OF (ex: eureka.testlearneezy.testdevinfinitiax.fr)
    const ofSlug = parts[0];
    
    setSubdomainInfo({
      isOFSubdomain: true,
      ofSlug: ofSlug,
      isMainDomain: false,
    });
  }, []);

  return subdomainInfo;
};
