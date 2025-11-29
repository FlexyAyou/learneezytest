# Guide pour tester la visualisation de PDF

## Problème Identifié

Le système de visualisation de PDF/images fonctionne, mais les données du cours doivent contenir un `pdf_key` pour que le PDF s'affiche.

## Structure de données requise

Une leçon PDF doit avoir la structure suivante dans la base de données :

```typescript
{
  id: "lesson-id",
  title: "Ma leçon PDF",
  duration: "1h",
  description: "Description",
  pdf_key: "path/to/pdf-file.pdf",  // ← IMPORTANT: Clé dans MinIO/S3
  type: "lesson"
}
```

Ou au niveau du module (Content) :

```typescript
{
  id: "content-id",
  title: "Contenu PDF",
  duration: "30min",
  description: "Description",
  pdf_key: "courses/course-123/document.pdf",
  content_type: "pdf"
}
```

## Comment créer un PDF pour le test

### Option 1 : Via l'API FastAPI (Création de module avec PDF)

```bash
POST /api/courses/{course_id}/modules
Content-Type: application/json

{
  "title": "Module 1",
  "description": "Description",
  "duration": "2h",
  "content": [
    {
      "title": "Leçon PDF",
      "duration": "1h",
      "description": "Contenu PDF",
      "pdf_key": "courses/test/guide.pdf"  // Clé du PDF dans MinIO
    }
  ]
}
```

### Option 2 : Via l'interface d'admin

1. Créer ou éditer un cours
2. Ajouter un module
3. Ajouter une leçon
4. Uploader/attacher un PDF
5. Le système devrait créer un `pdf_key` automatiquement

## Debugging

### Vérifier les propriétés du cours

Ouvrez la console navigateur (F12) et cherchez le log :

```javascript
[LessonViewer] Current Item: {
  title: "...",
  contentType: "pdf",  // ← Doit être "pdf"
  pdf_key: "courses/...",  // ← Doit avoir une valeur
  pdf_url: null,
  ...
}
```

### Si contentType n'est pas "pdf"

Cela signifie que `currentItem.pdf_key` et `currentItem.pdf_url` sont tous les deux `null`.

Solution :
- Vérifier que le backend retourne bien `pdf_key` dans la réponse du cours
- Vérifier que le PDF est bien uploadé dans MinIO/S3

### Si contentType est "pdf" mais le PDF ne s'affiche pas

Vérifier le log du PDFViewer :

```javascript
[PDFViewer] Données reçues: {
  pdfKey: "courses/...",
  pdfUrl: null,
  playUrl: "https://...",  // ← Doit avoir une URL S3 valide
  loading: false,
  error: null
}
```

## Composants impliqués

- `PDFViewer.tsx` : Affiche le PDF via iframe avec toolbar native
- `ImageDisplay.tsx` : Affiche les images avec zoom/rotation
- `usePresignedUrl.ts` : Hook qui récupère l'URL présignée depuis MinIO/S3
- `LessonViewer.tsx` : Page principale qui intègre tous les viewers

## Prochaines étapes

1. ✅ Vérifier si `getContentType()` retourne "pdf"
2. ✅ Vérifier si `usePresignedUrl` récupère une URL
3. ✅ Vérifier si le PDF s'affiche via iframe

Si l'un de ces points échoue, consulter les logs console pour diagnostiquer.

## Note sur la détection du type

La détection du type de contenu se fait par cette priorité :

```typescript
1. Si type === 'quiz' → afficher StudentQuiz
2. Si video_key OU video_url → afficher VideoPlayer
3. Si pdf_key OU pdf_url → afficher PDFViewer ← Vous êtes ici
4. Si image_key OU image_url → afficher ImageDisplay
5. Sinon → afficher texte
```

La leçon "DJANGO" est du type texte parce qu'elle n'a ni pdf_key, ni video_key, ni image_key.

## URL du test

URL actuelle : `https://plateforme-test-infinitias.com/dashboard/apprenant/courses/69284a048e6744ee5b47f3de/lessons/DJANGO`

Recherchez une leçon qui a un PDF dans le même cours ou créez-en une.
