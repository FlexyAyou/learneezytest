
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.courses': 'Nos Formations',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    
    // Hero
    'hero.title': 'Développez vos compétences avec Learneezy',
    'hero.subtitle': 'La plateforme d\'apprentissage en ligne qui vous accompagne vers la réussite',
    'hero.cta': 'Découvrir nos formations',
    
    // Courses
    'courses.title': 'Catalogue de Formations & Réservation de Cours',
    'courses.subtitle': 'Découvrez nos cours personnalisés du primaire au lycée. Réservez directement vos créneaux avec nos formateurs qualifiés.',
    'courses.catalog': 'Catalogue de formations disponibles',
    'courses.booking': 'Réserver un créneau avec un formateur',
    'courses.search': 'Rechercher une formation...',
    'courses.searchTrainer': 'Rechercher un formateur...',
    'courses.level': 'Niveau d\'étude',
    'courses.theme': 'Thème',
    'courses.duration': 'Durée',
    'courses.specialty': 'Spécialité',
    'courses.language': 'Langue',
    'courses.found': 'formation(s) trouvée(s)',
    'courses.trainersFound': 'formateur(s) disponible(s)',
    'courses.viewAll': 'Voir toutes les formations',
    'courses.viewAllTrainers': 'Voir tous les formateurs',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Crédits',
    'courses.reserve': 'Réserver',
    'courses.viewDetails': 'Voir détails',
    
    // Common
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Our Courses',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Hero
    'hero.title': 'Develop your skills with Learneezy',
    'hero.subtitle': 'The online learning platform that guides you to success',
    'hero.cta': 'Discover our courses',
    
    // Courses
    'courses.title': 'Course Catalog & Booking',
    'courses.subtitle': 'Discover our personalized courses from primary to high school. Book directly with our qualified instructors.',
    'courses.catalog': 'Available course catalog',
    'courses.booking': 'Book a slot with an instructor',
    'courses.search': 'Search for a course...',
    'courses.searchTrainer': 'Search for an instructor...',
    'courses.level': 'Study Level',
    'courses.theme': 'Theme',
    'courses.duration': 'Duration',
    'courses.specialty': 'Specialty',
    'courses.language': 'Language',
    'courses.found': 'course(s) found',
    'courses.trainersFound': 'instructor(s) available',
    'courses.viewAll': 'View all courses',
    'courses.viewAllTrainers': 'View all instructors',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Credits',
    'courses.reserve': 'Book',
    'courses.viewDetails': 'View details',
    
    // Common
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.courses': 'Nuestros Cursos',
    'nav.pricing': 'Precios',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registro',
    
    // Hero
    'hero.title': 'Desarrolla tus habilidades con Learneezy',
    'hero.subtitle': 'La plataforma de aprendizaje en línea que te guía al éxito',
    'hero.cta': 'Descubrir nuestros cursos',
    
    // Courses
    'courses.title': 'Catálogo de Cursos y Reservas',
    'courses.subtitle': 'Descubre nuestros cursos personalizados desde primaria hasta bachillerato. Reserva directamente con nuestros instructores calificados.',
    'courses.catalog': 'Catálogo de cursos disponibles',
    'courses.booking': 'Reservar una sesión con un instructor',
    'courses.search': 'Buscar un curso...',
    'courses.searchTrainer': 'Buscar un instructor...',
    'courses.level': 'Nivel de Estudio',
    'courses.theme': 'Tema',
    'courses.duration': 'Duración',
    'courses.specialty': 'Especialidad',
    'courses.language': 'Idioma',
    'courses.found': 'curso(s) encontrado(s)',
    'courses.trainersFound': 'instructor(es) disponible(s)',
    'courses.viewAll': 'Ver todos los cursos',
    'courses.viewAllTrainers': 'Ver todos los instructores',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Créditos',
    'courses.reserve': 'Reservar',
    'courses.viewDetails': 'Ver detalles',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.courses': 'Nossos Cursos',
    'nav.pricing': 'Preços',
    'nav.contact': 'Contato',
    'nav.login': 'Login',
    'nav.register': 'Registro',
    
    // Hero
    'hero.title': 'Desenvolva suas habilidades com Learneezy',
    'hero.subtitle': 'A plataforma de aprendizado online que te guia ao sucesso',
    'hero.cta': 'Descobrir nossos cursos',
    
    // Courses
    'courses.title': 'Catálogo de Cursos & Reservas',
    'courses.subtitle': 'Descubra nossos cursos personalizados do ensino fundamental ao médio. Reserve diretamente com nossos instrutores qualificados.',
    'courses.catalog': 'Catálogo de cursos disponíveis',
    'courses.booking': 'Reservar uma sessão com um instrutor',
    'courses.search': 'Procurar um curso...',
    'courses.searchTrainer': 'Procurar um instrutor...',
    'courses.level': 'Nível de Estudo',
    'courses.theme': 'Tema',
    'courses.duration': 'Duração',
    'courses.specialty': 'Especialidade',
    'courses.language': 'Idioma',
    'courses.found': 'curso(s) encontrado(s)',
    'courses.trainersFound': 'instrutor(es) disponível(eis)',
    'courses.viewAll': 'Ver todos os cursos',
    'courses.viewAllTrainers': 'Ver todos os instrutores',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Créditos',
    'courses.reserve': 'Reservar',
    'courses.viewDetails': 'Ver detalhes',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.courses': 'Unsere Kurse',
    'nav.pricing': 'Preise',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    
    // Hero
    'hero.title': 'Entwickeln Sie Ihre Fähigkeiten mit Learneezy',
    'hero.subtitle': 'Die Online-Lernplattform, die Sie zum Erfolg führt',
    'hero.cta': 'Unsere Kurse entdecken',
    
    // Courses
    'courses.title': 'Kurskatalog & Buchungen',
    'courses.subtitle': 'Entdecken Sie unsere personalisierten Kurse von der Grundschule bis zum Gymnasium. Buchen Sie direkt bei unseren qualifizierten Lehrern.',
    'courses.catalog': 'Verfügbarer Kurskatalog',
    'courses.booking': 'Einen Termin mit einem Lehrer buchen',
    'courses.search': 'Nach einem Kurs suchen...',
    'courses.searchTrainer': 'Nach einem Lehrer suchen...',
    'courses.level': 'Studienniveau',
    'courses.theme': 'Thema',
    'courses.duration': 'Dauer',
    'courses.specialty': 'Fachgebiet',
    'courses.language': 'Sprache',
    'courses.found': 'Kurs(e) gefunden',
    'courses.trainersFound': 'Lehrer verfügbar',
    'courses.viewAll': 'Alle Kurse anzeigen',
    'courses.viewAllTrainers': 'Alle Lehrer anzeigen',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Kredite',
    'courses.reserve': 'Buchen',
    'courses.viewDetails': 'Details anzeigen',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'I Nostri Corsi',
    'nav.pricing': 'Prezzi',
    'nav.contact': 'Contatto',
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    
    // Hero
    'hero.title': 'Sviluppa le tue competenze con Learneezy',
    'hero.subtitle': 'La piattaforma di apprendimento online che ti guida al successo',
    'hero.cta': 'Scopri i nostri corsi',
    
    // Courses
    'courses.title': 'Catalogo Corsi & Prenotazioni',
    'courses.subtitle': 'Scopri i nostri corsi personalizzati dalle elementari alle superiori. Prenota direttamente con i nostri istruttori qualificati.',
    'courses.catalog': 'Catalogo corsi disponibili',
    'courses.booking': 'Prenota una sessione con un istruttore',
    'courses.search': 'Cerca un corso...',
    'courses.searchTrainer': 'Cerca un istruttore...',
    'courses.level': 'Livello di Studio',
    'courses.theme': 'Tema',
    'courses.duration': 'Durata',
    'courses.specialty': 'Specialità',
    'courses.language': 'Lingua',
    'courses.found': 'corso/i trovato/i',
    'courses.trainersFound': 'istruttore/i disponibile/i',
    'courses.viewAll': 'Vedi tutti i corsi',
    'courses.viewAllTrainers': 'Vedi tutti gli istruttori',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Crediti',
    'courses.reserve': 'Prenota',
    'courses.viewDetails': 'Vedi dettagli',
  },
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Onze Cursussen',
    'nav.pricing': 'Prijzen',
    'nav.contact': 'Contact',
    'nav.login': 'Inloggen',
    'nav.register': 'Registreren',
    
    // Hero
    'hero.title': 'Ontwikkel je vaardigheden met Learneezy',
    'hero.subtitle': 'Het online leerplatform dat je naar succes leidt',
    'hero.cta': 'Ontdek onze cursussen',
    
    // Courses
    'courses.title': 'Cursuscatalogus & Boekingen',
    'courses.subtitle': 'Ontdek onze gepersonaliseerde cursussen van basisschool tot middelbare school. Boek direct bij onze gekwalificeerde instructeurs.',
    'courses.catalog': 'Beschikbare cursuscatalogus',
    'courses.booking': 'Boek een sessie met een instructeur',
    'courses.search': 'Zoek een cursus...',
    'courses.searchTrainer': 'Zoek een instructeur...',
    'courses.level': 'Studieniveau',
    'courses.theme': 'Thema',
    'courses.duration': 'Duur',
    'courses.specialty': 'Specialiteit',
    'courses.language': 'Taal',
    'courses.found': 'cursus(sen) gevonden',
    'courses.trainersFound': 'instructeur(s) beschikbaar',
    'courses.viewAll': 'Alle cursussen bekijken',
    'courses.viewAllTrainers': 'Alle instructeurs bekijken',
    'courses.tokens': 'Tokens',
    'courses.credits': 'Credieten',
    'courses.reserve': 'Boeken',
    'courses.viewDetails': 'Details bekijken',
  }
};

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ];

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('learneezy-language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['fr'][key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('learneezy-language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
