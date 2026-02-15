import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationContextData, SubdomainVerification } from '@/types/fastapi';
import { useSubdomain } from '@/hooks/useSubdomain';

interface OrganizationProviderProps {
  children: React.ReactNode;
}

// Valeur par défaut pour éviter les erreurs de contexte null
const defaultContextValue: OrganizationContextData = {
  organization: null,
  isOFContext: false,
  isLoading: true,
  error: null,
};

const OrganizationContext = createContext<OrganizationContextData>(defaultContextValue);

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { verification, isLoading, error, isOFSubdomain } = useSubdomain();

  const value: OrganizationContextData = {
    organization: verification,
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
export const useOrganization = (): OrganizationContextData => {
  const context = useContext(OrganizationContext);
  // Le contexte aura toujours une valeur maintenant grâce à defaultContextValue
  return context;
};
