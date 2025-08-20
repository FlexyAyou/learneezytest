
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'en' | 'es' | 'pt' | 'de' | 'it' | 'nl' | 'zh' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n, t } = useTranslation();

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const language = (i18n.language || 'fr') as Language;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
