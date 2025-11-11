# Intégration Front – Upload & Lecture Média (MinIO/HLS)

Ce mini guide décrit comment intégrer l’upload et la lecture vidéo avec l’API Storage.

## Panorama des endpoints

- Upload
  - POST `/api/storage/prepare-upload` → prépare l’upload (single-part ou multipart)
  - POST `/api/storage/complete-upload` → finalise l’upload
  - POST `/api/storage/abort-upload` → annule un multipart (optionnel)
- Lecture
  - GET `/api/storage/play?key=...` → JSON `{ url, stream_type: hls|mp4, expires_in }`
  - GET `/api/storage/play/redirect?key=...` → 302 direct vers l’URL de lecture (pratique pour `<video src>`)
  - GET `/api/storage/play/multi?keys=...&keys=...` → batch
- Métadonnées
  - GET `/api/storage/assets` → liste paginée + filtres (status)
  - GET `/api/storage/assets/by-key?key=...` → un asset précis

Statuts clés: `uploaded` (source dispo), `processing` (transcodage HLS en cours), `ready` (HLS prêt), `failed`, `skipped` (non‑vidéo).

## Flux d’upload (recommandé)

1. Formulaire → récupérer `file`, `file.name`, `file.size`, `file.type`.
2. POST `/api/storage/prepare-upload` avec `{ filename, size, content_type, kind: 'video' | 'image' | 'resource' }`.
3. Si `strategy=single` → faire un `PUT` vers `url` (inclure `headers` renvoyés).
   Si `strategy=multipart` → charger chaque part via URLs présignées (partNumber/ETag), en parallèle modérée.
4. POST `/api/storage/complete-upload`.
5. Persister `key` renvoyée dans l’entité (ex: `lesson.video_key = key`).
6. Afficher état en UI (uploaded/processing/ready…).

Notes:
- Pour `image`/`resource`, le statut sera `skipped` (pas de HLS). Vous pouvez soit exploiter directement l’URL de PUT (immédiatement), soit utiliser `/play` pour homogénéiser la récupération (recommandé).
- Pour multipart, exposez une barre de progression (bytes envoyés / total). Prévoir `abort-upload` en cas d’annulation.

## Lecture vidéo (HLS ou MP4)

- Appeler `GET /api/storage/play?key=...`.
- Si `stream_type=hls` → utiliser un player HLS (ex: hls.js, Video.js HLS). L’URL renvoyée est un master `.m3u8` servi par notre proxy qui réécrit le manifest et présigne les segments.
- Si `stream_type=mp4` → `<video controls src={url}>`.
- Alternative: `GET /api/storage/play/redirect?key=...` retourne un 302 vers l’URL de lecture, pratique pour un `<video src>` simple.

TTL / rafraîchissement:
- `expires_in` (ex: ~900s) indique la durée de validité des URLs présignées.
- Si une lecture peut dépasser 10–12 minutes, mettez en place un rafraîchissement: avant l’expiration (ex: 2 min restantes), rappeler `/play` et recharger la source (HLS: détruire/reattacher le player; MP4: remplacer `src`).

## Erreurs & fallback

- 403: la clé n’appartient pas au tenant ou droits insuffisants. Vérifier compte/organisation.
- 404: asset introuvable ou supprimé. Si status `processing`, proposer de réessayer plus tard.
- 503: stockage indisponible. Afficher un bouton “Réessayer” avec backoff.
- `/play/multi`: chaque item peut avoir `error`; ignorer ou afficher un placeholder.

## Sécurité & multi‑tenant

- Ne pas reconstruire de clés côté front. Utiliser la `key` renvoyée par le backend (préfixée par le sous‑domaine tenant).
- Toujours passer par `/prepare-upload` et `/play` pour générer des URLs présignées; ne pas utiliser des chemins MinIO en dur.
- Pas de cache persistant des URLs présignées (elles expirent).

## Exemples (pseudo‑code)

Upload single‑part:
```js
async function uploadVideo(file) {
  const prep = await api.post('/api/storage/prepare-upload', {
    filename: file.name,
    size: file.size,
    content_type: file.type,
    kind: 'video',
  });
  if (prep.strategy === 'single') {
    await fetch(prep.url, { method: 'PUT', headers: prep.headers, body: file });
    await api.post('/api/storage/complete-upload', {
      key: prep.key,
      size: file.size,
      content_type: file.type,
    });
    return prep.key;
  }
  // multipart: uploader chaque part, collecter les ETag, puis complete-upload
}
```

Lecture avec rafraîchissement TTL:
```js
let current = null;
async function playVideo(key, videoEl) {
  const data = await api.get(`/api/storage/play?key=${encodeURIComponent(key)}`);
  if (data.stream_type === 'hls') {
    const hls = new Hls();
    hls.loadSource(data.url);
    hls.attachMedia(videoEl);
    current = { key, type: 'hls', hls, expiresAt: Date.now() + data.expires_in * 1000 };
  } else {
    videoEl.src = data.url;
    current = { key, type: 'mp4', expiresAt: Date.now() + data.expires_in * 1000 };
  }
}
function maybeRefresh(videoEl) {
  if (!current) return;
  const remaining = current.expiresAt - Date.now();
  if (remaining < 120000) { // < 2 min
    if (current.type === 'hls' && current.hls) {
      current.hls.destroy();
    }
    playVideo(current.key, videoEl);
  }
}
```

Batch (préparer plusieurs clés):
```js
const data = await api.get('/api/storage/play/multi', { params: { keys: [k1, k2, k3] } });
// data.items = [{ key, url, stream_type, error? }, ...]
```

## UI/UX – conseils

- Montrer la progression d’upload, permettre l’annulation (surtout pour multipart).
- Indiquer l’état: `uploaded` → `processing` → `ready`. Quand `ready`, le backend posera `video_ready=true` dans la leçon lors du premier play HLS.
- Eviter de précharger trop d’URLs présignées simultanément (max 2–4 vidéos visibles/prévisibles).
- En cas d’erreur de transcodage (`failed`): proposer un nouveau téléversement.

## Checklist intégrateur

- [ ] Upload via `/prepare-upload` → PUT → `/complete-upload`
- [ ] Sauvegarder `key` côté leçon (ex: `lesson.video_key`)
- [ ] Lecture via `/play` (ou `/play/redirect` si pas besoin du JSON)
- [ ] Rafraîchir l’URL avant expiration (`expires_in`)
- [ ] Gérer HLS (player) et fallback MP4
- [ ] Gérer erreurs 403/404/503 proprement
- [ ] Respecter le préfixe tenant des `key` (ne pas le modifier)
