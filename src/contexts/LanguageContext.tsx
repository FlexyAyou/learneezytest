import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es' | 'pt' | 'de' | 'it' | 'nl' | 'zh' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    welcome: 'Bienvenue ! Connectez-vous à votre compte',
    login: 'Se connecter',
    email: 'Adresse email',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: "Vous n'avez pas de compte ?",
    createAccount: 'Créer un compte',
    continueWith: 'Ou continuer avec',
    enterInfo: 'Entrez vos informations pour accéder à votre espace d\'apprentissage'
  },
  en: {
    welcome: 'Welcome! Sign in to your account',
    login: 'Sign in',
    email: 'Email address',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    continueWith: 'Or continue with',
    enterInfo: 'Enter your information to access your learning space'
  },
  es: {
    welcome: '¡Bienvenido! Inicia sesión en tu cuenta',
    login: 'Iniciar sesión',
    email: 'Dirección de correo',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear cuenta',
    continueWith: 'O continuar con',
    enterInfo: 'Ingresa tu información para acceder a tu espacio de aprendizaje'
  },
  pt: {
    welcome: 'Bem-vindo! Faça login na sua conta',
    login: 'Entrar',
    email: 'Endereço de e-mail',
    password: 'Senha',
    rememberMe: 'Lembrar-me',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem uma conta?',
    createAccount: 'Criar conta',
    continueWith: 'Ou continuar com',
    enterInfo: 'Digite suas informações para acessar seu espaço de aprendizagem'
  },
  de: {
    welcome: 'Willkommen! Melden Sie sich in Ihrem Konto an',
    login: 'Anmelden',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    noAccount: 'Haben Sie kein Konto?',
    createAccount: 'Konto erstellen',
    continueWith: 'Oder fortfahren mit',
    enterInfo: 'Geben Sie Ihre Informationen ein, um auf Ihren Lernbereich zuzugreifen'
  },
  it: {
    welcome: 'Benvenuto! Accedi al tuo account',
    login: 'Accedi',
    email: 'Indirizzo email',
    password: 'Password',
    rememberMe: 'Ricordami',
    forgotPassword: 'Password dimenticata?',
    noAccount: 'Non hai un account?',
    createAccount: 'Crea account',
    continueWith: 'O continua con',
    enterInfo: 'Inserisci le tue informazioni per accedere al tuo spazio di apprendimento'
  },
  nl: {
    welcome: 'Welkom! Log in op uw account',
    login: 'Inloggen',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    rememberMe: 'Onthouden',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccount: 'Heeft u geen account?',
    createAccount: 'Account aanmaken',
    continueWith: 'Of doorgaan met',
    enterInfo: 'Voer uw gegevens in om toegang te krijgen tot uw leerruimte'
  },
  zh: {
    welcome: '欢迎！登录您的账户',
    login: '登录',
    email: '电子邮件地址',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    noAccount: '没有账户？',
    createAccount: '创建账户',
    continueWith: '或继续使用',
    enterInfo: '输入您的信息以访问您的学习空间'
  },
  ta: {
    welcome: 'வணக்கம்! உங்கள் கணக்கில் உள்நுழையுங்கள்',
    login: 'உள்நுழையுங்கள்',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    rememberMe: 'என்னை நினைவில் வைத்துக் கொள்ளுங்கள்',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    noAccount: 'கணக்கு இல்லையா?',
    createAccount: 'கணக்கை உருவாக்கு',
    continueWith: 'அல்லது தொடரவும்',
    enterInfo: 'உங்கள் கற்றல் இடத்தை அணுக உங்கள் தகவல்களை உள்ளிடுங்கள்'
  },
  hi: {
    welcome: 'स्वागत है! अपने खाते में साइन इन करें',
    login: 'साइन इन करें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'खाता नहीं है?',
    createAccount: 'खाता बनाएं',
    continueWith: 'या जारी रखें',
    enterInfo: 'अपनी सीखने की जगह तक पहुंचने के लिए अपनी जानकारी दर्ज करें'
  }
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

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

export { LanguageProvider };
