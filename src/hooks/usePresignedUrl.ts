import { useEffect, useState, useRef, useCallback } from 'react';
import { fastAPIClient } from '@/services/fastapi-client';
import { retryWithBackoff } from '@/lib/retry';

interface UsePresignedUrlOptions {
  enabled?: boolean;
  refreshBeforeExpiry?: number; // secondes avant expiration pour rafraîchir (défaut: 60)
  retryOnFail?: boolean; // active le backoff exponentiel sur échec
  maxRetries?: number; // nombre max de tentatives
}

interface UsePresignedUrlReturn {
  url: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook pour gérer les URLs présignées avec rafraîchissement automatique
 * @param storageKey - Clé du fichier dans le storage (MinIO/S3)
 * @param directUrl - URL directe (optionnelle, prioritaire sur storageKey)
 * @param options - Options de configuration
 */
export const usePresignedUrl = (
  storageKey?: string | null,
  directUrl?: string | null,
  options: UsePresignedUrlOptions = {}
): UsePresignedUrlReturn => {
  const { enabled = true, refreshBeforeExpiry = 60, retryOnFail = true, maxRetries = 3 } = options;

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const retryCountRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Fonction pour récupérer/rafraîchir l'URL
  const fetchUrl = useCallback(async () => {
    if (!enabled) return;

    // Si URL directe fournie, l'utiliser sans appel API
    if (directUrl) {
      const httpsUrl = directUrl.replace(/^http:\/\//i, 'https://');
      setUrl(httpsUrl);
      setError(null);
      return;
    }

    // Sinon, utiliser la clé storage
    if (!storageKey) {
      setError('Aucune URL ou clé de stockage disponible');
      return;
    }

    setLoading(true);
    setError(null);

    // Annuler tentative précédente
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      console.log(`📡 Récupération de l'URL présignée pour: ${storageKey}`);
      
      const response = await retryWithBackoff(() => fastAPIClient.getPlayUrl(storageKey), {
        maxRetries,
        shouldRetry: (err) => {
          const status = err?.response?.status;
          const retryable = status === 503 || status === 502 || status === 504 || err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
          return retryOnFail && retryable;
        },
        signal,
      });

      if (!isMountedRef.current) return;

      console.log(`✅ URL présignée récupérée avec succès:`, response);

      // Force HTTPS
      const httpsUrl = response.url.replace(/^http:\/\//i, 'https://');
      setUrl(httpsUrl);

      // Programmer le rafraîchissement automatique
      if (response.expires_in) {
        // Calculer le délai en millisecondes (rafraîchir avant expiration)
        const refreshDelay = Math.max(
          (response.expires_in - refreshBeforeExpiry) * 1000,
          0
        );

        // Nettoyer l'ancien timeout
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        // Programmer le prochain rafraîchissement
        refreshTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.log(`🔄 Rafraîchissement automatique de l'URL pour: ${storageKey}`);
            fetchUrl();
          }
        }, refreshDelay);
      }
      // reset retries after success
      retryCountRef.current = 0;
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      // Messages d'erreur détaillés pour diagnostic
      let errorMessage = 'Impossible de charger le fichier';
      
      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        errorMessage = '❌ Connexion au serveur impossible. Vérifiez que le backend est accessible.';
        console.error('🔴 ERREUR DE CONNEXION BACKEND:', {
          storageKey,
          error: err.message,
          code: err.code,
          baseURL: err?.config?.baseURL
        });
      } else if (err?.response?.status === 404) {
        errorMessage = '❌ Fichier introuvable dans le storage';
        console.error('🔴 FICHIER INTROUVABLE:', { storageKey, status: 404 });
      } else if (err?.response?.status === 403) {
        errorMessage = '❌ Accès refusé au fichier';
        console.error('🔴 ACCÈS REFUSÉ:', { storageKey, status: 403 });
      } else if (err?.response?.status >= 500) {
        errorMessage = '❌ Erreur serveur lors de la génération de l\'URL';
        console.error('🔴 ERREUR SERVEUR:', { storageKey, status: err.response.status });
      } else {
        console.error('🔴 ERREUR lors de la récupération de l\'URL présignée:', {
          storageKey,
          error: err,
          message: err?.message,
          response: err?.response
        });
      }
      
      setError(errorMessage);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [storageKey, directUrl, enabled, refreshBeforeExpiry]);

  // Charger l'URL au montage et quand les dépendances changent
  useEffect(() => {
    isMountedRef.current = true;
    fetchUrl();

    return () => {
      isMountedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchUrl]);

  return {
    url,
    loading,
    error,
    refresh: fetchUrl,
  };
};
