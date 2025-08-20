
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import zh from './locales/zh.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
  de: { translation: de },
  it: { translation: it },
  nl: { translation: nl },
  zh: { translation: zh },
  ta: { translation: ta },
  hi: { translation: hi }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: ['fr', 'en'],
    lng: 'fr',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    },

    // Optimisations avancées
    load: 'languageOnly',
    preload: ['fr', 'en'],
    cleanCode: true,
    
    // Support des pluriels
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Performance
    partialBundledLanguages: true,
    saveMissing: false
  });

export default i18n;
