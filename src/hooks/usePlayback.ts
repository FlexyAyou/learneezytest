import { useEffect, useRef, useState, useCallback } from 'react';
import { fastAPIClient } from '@/services/fastapi-client';

interface PlaybackState {
  url?: string;
  streamType?: 'hls' | 'mp4' | 'image' | 'pdf' | 'other';
  expiresIn?: number;
  loading: boolean;
  error?: string;
  refreshing: boolean;
}

interface UsePlaybackOptions {
  /** Rafraîchir automatiquement avant expiration (par défaut 120s avant) */
  autoRefresh?: boolean;
  /** Délai tampon en secondes avant expiration pour relancer /play */
  refreshThresholdSec?: number;
  /** Callback quand une nouvelle URL est chargée */
  onUrlChange?: (url: string) => void;
}

/**
 * Hook centralisé de lecture média basé sur /api/storage/play
 * - Gère HLS vs MP4 (exposition du type, player HLS externe à attacher)
 * - Rafraîchit l'URL avant expiration (TTL) pour éviter une coupure
 * - Fournit un trigger manuel de refresh
 * - Peut être utilisé aussi pour images/PDF (streamType dérivé si besoin)
 */
export function usePlayback(key: string | undefined, opts: UsePlaybackOptions = {}) {
  const { autoRefresh = true, refreshThresholdSec = 120, onUrlChange } = opts;
  const [state, setState] = useState<PlaybackState>({ loading: !!key, refreshing: false });
  const expiresAtRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);
  const lastKeyRef = useRef<string | undefined>(undefined);

  const deriveType = (rawUrl: string, streamType?: string): PlaybackState['streamType'] => {
    if (streamType === 'hls') return 'hls';
    if (streamType === 'mp4') return 'mp4';
    // Heuristiques fallback
    if (/\.m3u8(\?|$)/i.test(rawUrl)) return 'hls';
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(rawUrl)) return 'mp4';
    if (/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(rawUrl)) return 'image';
    if (/\.pdf(\?|$)/i.test(rawUrl)) return 'pdf';
    return 'other';
  };

  const load = useCallback(async () => {
    if (!key) return;
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    try {
      // Utilise getPlayUrl qui renvoie { url, expires_in } - à étendre si stream_type disponible
      const raw = await fastAPIClient.getPlayUrl(key);
      const streamType = deriveType(raw.url, (raw as any).stream_type);
      expiresAtRef.current = Date.now() + (raw.expires_in || 0) * 1000;
      setState({
        url: raw.url,
        expiresIn: raw.expires_in,
        streamType,
        loading: false,
        refreshing: false,
      });
      if (onUrlChange && raw.url) onUrlChange(raw.url);
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message || 'Erreur lecture', loading: false, refreshing: false }));
    }
  }, [key, onUrlChange]);

  const refresh = useCallback(async () => {
    if (!key) return;
    setState(prev => ({ ...prev, refreshing: true }));
    try {
      const raw = await fastAPIClient.getPlayUrl(key);
      const streamType = deriveType(raw.url, (raw as any).stream_type);
      expiresAtRef.current = Date.now() + (raw.expires_in || 0) * 1000;
      setState({
        url: raw.url,
        expiresIn: raw.expires_in,
        streamType,
        loading: false,
        refreshing: false,
        error: undefined,
      });
      if (onUrlChange && raw.url) onUrlChange(raw.url);
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message || 'Erreur refresh', refreshing: false }));
    }
  }, [key, onUrlChange]);

  // Initial load & key change
  useEffect(() => {
    if (key && key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      load();
    }
  }, [key, load]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    if (!key) return;
    // Nettoyer ancien intervalle
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (!expiresAtRef.current) return;
      const remaining = expiresAtRef.current - Date.now();
      if (remaining < refreshThresholdSec * 1000) {
        refresh();
      }
    }, 30000); // toutes les 30s
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [autoRefresh, refreshThresholdSec, key, refresh]);

  return {
    ...state,
    refresh,
    isHls: state.streamType === 'hls',
    isMp4: state.streamType === 'mp4',
  };
}

/**
 * Helper pour attacher HLS.js dynamiquement si nécessaire.
 * Usage:
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { url, isHls } = usePlayback(key);
 * useAttachHls(isHls ? url : undefined, videoRef);
 */
export function useAttachHls(hlsUrl: string | undefined, videoRef: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    let hls: any;
    let active = true;
    (async () => {
      if (!hlsUrl || !videoRef.current) return;
      if (!/\.m3u8(\?|$)/i.test(hlsUrl)) return; // sécurité
      try {
        const mod = await import('hls.js');
        if (!active) return;
        if (mod.isSupported()) {
          hls = new mod.default();
          hls.loadSource(hlsUrl);
          hls.attachMedia(videoRef.current!);
        } else {
          // Fallback: certains navigateurs supportent nativement HLS (Safari)
          videoRef.current.src = hlsUrl;
        }
      } catch (e) {
        console.warn('HLS attach failed', e);
      }
    })();
    return () => {
      active = false;
      if (hls) {
        try { hls.destroy(); } catch { }
      }
    };
  }, [hlsUrl, videoRef]);
}
