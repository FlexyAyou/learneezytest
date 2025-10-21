
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'https://api.plateforme-test-infinitiax.com',
  NODE_ENV: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
} as const;

// Validation des variables d'environnement requises
const requiredEnvVars = ['VITE_API_URL'] as const;

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0 && env.IS_PRODUCTION) {
    console.warn('Variables d\'environnement manquantes:', missing);
  }
};

// Valider au chargement du module
validateEnv();
