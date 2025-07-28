
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    card: string;
    accent: string;
    muted: string;
    border: string;
  };
  darkMode: boolean;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    contrast: 'normal' | 'high';
    reducedMotion: boolean;
  };
}

export interface OrganismeTheme extends Theme {
  organismeId: string;
  logo?: string;
  customCss?: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  toggleDarkMode: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setContrast: (contrast: 'normal' | 'high') => void;
  setReducedMotion: (reduced: boolean) => void;
  applyTheme: (theme: Theme) => void;
  applyOrganismeTheme: (organismeTheme: OrganismeTheme) => void;
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Défaut',
  colors: {
    primary: '330 81% 60%',
    secondary: '210 40% 96.1%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    card: '0 0% 100%',
    accent: '210 40% 96.1%',
    muted: '210 40% 96.1%',
    border: '214.3 31.8% 91.4%',
  },
  darkMode: false,
  accessibility: {
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large';
    return saved || 'medium';
  });

  const [contrast, setContrastState] = useState<'normal' | 'high'>(() => {
    const saved = localStorage.getItem('contrast') as 'normal' | 'high';
    return saved || 'normal';
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    const saved = localStorage.getItem('reducedMotion');
    return saved === 'true';
  });

  const applyThemeToDocument = (theme: Theme, darkMode: boolean) => {
    const root = document.documentElement;
    
    // Apply theme colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply dark mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply accessibility settings
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${fontSize}`);

    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${contrast}`);

    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
  };

  const setContrast = (contrastLevel: 'normal' | 'high') => {
    setContrastState(contrastLevel);
    localStorage.setItem('contrast', contrastLevel);
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    localStorage.setItem('reducedMotion', reduced.toString());
  };

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  };

  const applyOrganismeTheme = (organismeTheme: OrganismeTheme) => {
    setCurrentTheme(organismeTheme);
    localStorage.setItem('theme', JSON.stringify(organismeTheme));
    localStorage.setItem('organismeTheme', JSON.stringify(organismeTheme));
  };

  useEffect(() => {
    applyThemeToDocument(currentTheme, isDarkMode);
  }, [currentTheme, isDarkMode, fontSize, contrast, reducedMotion]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isDarkMode,
        fontSize,
        contrast,
        reducedMotion,
        toggleDarkMode,
        setFontSize,
        setContrast,
        setReducedMotion,
        applyTheme,
        applyOrganismeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
