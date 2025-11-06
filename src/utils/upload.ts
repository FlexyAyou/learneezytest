import { fastAPIClient } from '@/services/fastapi-client';

export type UploadKind = 'image' | 'video' | 'pdf';

export interface UploadResult {
  key: string;
  url?: string;
  strategy: 'single' | 'multipart';
}

export interface UploadOptions {
  onProgress?: (uploadedBytes: number, totalBytes: number) => void;
}

function sanitizeFilename(name: string): string {
  // Préserve l'extension
  const dotIdx = name.lastIndexOf('.')
  const base = dotIdx > 0 ? name.slice(0, dotIdx) : name
  const ext = dotIdx > 0 ? name.slice(dotIdx) : ''
  // Remplace les espaces par des tirets, supprime caractères spéciaux exotiques
  const safeBase = base
    .normalize('NFKD')
    .replace(/[^\w\-\s]+/g, '') // lettres/chiffres/underscore/tiret/espace
    .replace(/\s+/g, '-')         // espaces → tirets
    .replace(/-+/g, '-')           // compacter
    .replace(/^[-_]+|[-_]+$/g, '') // trim -/_
  const safeExt = ext.toLowerCase()
  const safe = `${safeBase || 'file'}${safeExt || ''}`
  // Evite des noms trop courts ou sans extension
  return safe.length > 2 ? safe : `file${safeExt || ''}`
}

/**
 * Upload direct vers MinIO/S3 via URLs présignées
 * - Prépare → PUT (single ou multipart) → Complete
 * - Retourne la clé de stockage (key) et éventuellement l'URL présignée utilisée
 */
export async function uploadDirect(file: File, kind: UploadKind, opts: UploadOptions = {}): Promise<UploadResult> {
  // Backend attend 'resource' pour les PDF
  const kindToSend: 'image' | 'video' | 'resource' = kind === 'pdf' ? 'resource' : kind;

  // Certains backends gèrent mal les espaces/caractères spéciaux pour multipart; on assainit le nom
  const safeName = sanitizeFilename(file.name)

  const prepared = await fastAPIClient.prepareUpload(
    safeName,
    file.type,
    file.size,
    kindToSend
  );

  if (prepared.strategy === 'single') {
    if (!prepared.url) throw new Error('No presigned URL for single-part upload');

    const headers = new Headers(prepared.headers || {});
    await fetch(prepared.url, {
      method: 'PUT',
      headers,
      body: file,
    });

    await fastAPIClient.completeUpload({
      strategy: 'single',
      key: prepared.key,
      content_type: file.type,
      size: file.size,
    });

    return { key: prepared.key, url: prepared.url, strategy: 'single' };
  }

  // Multipart upload
  if (!prepared.parts || !prepared.upload_id) {
    throw new Error('Multipart upload missing parts or upload_id');
  }

  const partsETags: Array<{ ETag: string; PartNumber: number }> = [];
  const partSize = prepared.part_size || 5 * 1024 * 1024;

  for (const part of prepared.parts) {
    const start = (part.partNumber - 1) * partSize;
    const end = Math.min(start + partSize, file.size);
    const blob = file.slice(start, end);

    const res = await fetch(part.url, { method: 'PUT', body: blob });
    const etag = res.headers.get('ETag')?.replace(/"/g, '') || '';
    partsETags.push({ ETag: etag, PartNumber: part.partNumber });

    if (opts.onProgress) {
      opts.onProgress(end, file.size);
    }
  }

  await fastAPIClient.completeUpload({
    strategy: 'multipart',
    key: prepared.key,
    upload_id: prepared.upload_id,
    parts: partsETags,
    content_type: file.type,
    size: file.size,
  });

  return { key: prepared.key, strategy: 'multipart' };
}
