import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationContextData, SubdomainVerification } from '@/types/fastapi';
import { useSubdomain } from '@/hooks/useSubdomain';

interface OrganizationProviderProps {
  children: React.ReactNode;
}

const OrganizationContext = createContext<OrganizationContextData | null>(null);

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { verification, isLoading, error, isOFSubdomain } = useSubdomain();
  const [currentOrganization, setCurrentOrganization] = useState<SubdomainVerification | null>(null);

  useEffect(() => {
    if (verification && verification.exists) {
      setCurrentOrganization(verification);
    }
  }, [verification]);

  const value: OrganizationContextData = {
    organization: currentOrganization,
    isOFContext: isOFSubdomain,
    isLoading,
    error,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte de l'organisation
 */
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
};
