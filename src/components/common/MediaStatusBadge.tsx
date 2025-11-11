import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { fastAPIClient } from '@/services/fastapi-client';

type Status = 'uploaded' | 'processing' | 'ready' | 'failed' | 'skipped' | 'unknown';

interface Props {
  assetKey?: string | null;
  className?: string;
}

export const MediaStatusBadge: React.FC<Props> = ({ assetKey, className }) => {
  const [status, setStatus] = useState<Status>('unknown');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!assetKey) return;
      setLoading(true);
      try {
        const data: any = await fastAPIClient.getAssetByKey(assetKey);
        // Le backend expose typiquement { status: 'uploaded'|'processing'|'ready'|'failed'|'skipped', ... }
        const s = (data?.status as Status) || 'unknown';
        if (mounted) setStatus(s);
      } catch (e) {
        if (mounted) setStatus('unknown');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [assetKey]);

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
    <Badge variant="outline" className={`${conf.className} ${className || ''}`}>
      {text}
    </Badge>
  );
};

export default MediaStatusBadge;
