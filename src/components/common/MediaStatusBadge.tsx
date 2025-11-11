import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { fastAPIClient } from '@/services/fastapi-client';
import { Loader2 } from 'lucide-react';

type Status = 'uploaded' | 'processing' | 'ready' | 'failed' | 'skipped' | 'unknown';

interface Props {
  assetKey?: string | null;
  className?: string;
  /** Rafraîchir automatiquement toutes les X secondes tant que status=processing */
  poll?: number; // en secondes, ex: 10
  /** Active le polling adaptatif (5s pendant 2 min, puis 15s) */
  adaptive?: boolean;
}

export const MediaStatusBadge: React.FC<Props> = ({ assetKey, className, poll, adaptive = true }) => {
  const [status, setStatus] = useState<Status>('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const processingSinceRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!assetKey) return;
      setLoading(true);
      try {
        const data: any = await fastAPIClient.getAssetByKey(assetKey);
        // Le backend expose typiquement { status: 'uploaded'|'processing'|'ready'|'failed'|'skipped', ... }
        const s = (data?.status as Status) || 'unknown';
        if (mounted) {
          setStatus(s);
          setError(undefined);
        }
      } catch (e) {
        if (mounted) {
          setStatus('unknown');
          setError('Erreur statut');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [assetKey]);

  // Poll tant que processing (adaptatif)
  useEffect(() => {
    if (!assetKey) return;
    if (status !== 'processing') { processingSinceRef.current = null; return; }
    let active = true;
    if (!processingSinceRef.current) processingSinceRef.current = Date.now();

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const tick = async () => {
      if (!active) return;
      try {
        const data: any = await fastAPIClient.getAssetByKey(assetKey);
        const s = (data?.status as Status) || 'unknown';
        setStatus(s);
        setError(undefined);
      } catch (e) {
        setError('Erreur statut');
      }
      if (!active) return;
      // Calculer prochain délai
      const elapsed = processingSinceRef.current ? (Date.now() - processingSinceRef.current) / 1000 : 0;
      const initial = poll ?? 5; // si poll fourni, on s'en sert comme base initiale
      const nextSec = adaptive ? (elapsed < 120 ? initial : 15) : (poll ?? 10);
      timeout = setTimeout(tick, nextSec * 1000);
    };
    timeout = setTimeout(tick, (poll ?? 5) * 1000);
    return () => { active = false; if (timeout) clearTimeout(timeout); };
  }, [assetKey, poll, adaptive, status]);

  if (!assetKey) return null;

  const map: Record<Status, { label: string; className: string }> = {
    uploaded: { label: 'Téléversé', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    processing: { label: 'Transcodage…', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    ready: { label: 'Prêt', className: 'bg-green-100 text-green-800 border-green-200' },
    failed: { label: 'Échec', className: 'bg-red-100 text-red-800 border-red-200' },
    skipped: { label: 'Non-vidéo', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    unknown: { label: 'Inconnu', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  };

  const conf = map[status];
  const text = loading ? 'Vérification…' : conf.label;

  return (
    <Badge title={error || undefined} variant="outline" className={`${conf.className} ${className || ''}`}>
      {(status === 'processing' || loading) && (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      )}
      {text}
    </Badge>
  );
};

export default MediaStatusBadge;
