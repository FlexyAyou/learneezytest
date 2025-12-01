# Checklist de Débogage - Visualisation PDF

## 1. Vérifier les données du cours dans la console

### Étape 1 : Ouvrir la page d'une leçon
- Accédez à `https://plateforme-test-infinitias.com/dashboard/apprenant/courses/{courseId}/lessons/{lessonId}`
- Ouvrez la console (F12) → onglet "Console"

### Étape 2 : Chercher le log `[LessonViewer] Current Item`
Vous devriez voir quelque chose comme :

```javascript
[LessonViewer] Current Item: {
  title: "DJANGO",
  type: "lesson",
  contentType: "text",  // ← Si "pdf" ici, passez à l'étape 3
  pdf_key: undefined,
  pdf_url: undefined,
  image_key: undefined,
  image_url: undefined,
  video_key: undefined,
  video_url: undefined,
  allProps: ["description", "duration", "id", "title", "type", ...]
}
```

**Si `contentType: "pdf"`** → Allez à **Étape 3**
**Si `contentType: "text"` ou autre** → Allez à **Étape 4 (Problème Backend)**

---

## 2. Chercher le log `[PDFViewer] Données reçues`

Si le contenu est PDF, un log supplémentaire doit s'afficher :

```javascript
[PDFViewer] Données reçues: {
  pdfKey: "courses/69284a048e6744ee5b47f3de/lesson-pdf.pdf",
  pdfUrl: null,
  playUrl: "https://minio.example.com/bucket/courses/...?X-Amz-Algorithm=...",
  loading: false,
  error: null
}
```

### Résultats possibles :

| playUrl | loading | error | Diagnostic |
|---------|---------|-------|-----------|
| URL HTTPS valide | false | null | ✅ **Correct** - PDF devrait s'afficher |
| `null` | true | null | ⏳ En cours de chargement |
| `null` | false | "message" | ❌ **Erreur** - Voir le message d'erreur |
| `null` | false | null | ❌ **Pas d'URL** - Voir ci-dessous |

---

## 3. Si `playUrl` est null et `error` est null

Vérifiez les logs du hook `usePresignedUrl`. Tapez dans la console :

```javascript
// Cherchez les logs [usePresignedUrl]
// Vous devriez voir des appels API à /api/storage/play
```

### Problèmes possibles :

**A) La clé PDF n'existe pas dans MinIO**
- Solution : Upload le PDF dans MinIO d'abord

**B) L'URL présignée ne se génère pas**
- Vérifiez que le serveur FastAPI est accessible
- Vérifiez les credentials MinIO dans le backend

**C) Problème CORS**
- Vérifiez que MinIO/S3 accepte les requêtes du navigateur

---

## 4. Problème Backend - `contentType` n'est pas "pdf"

Vérifiez les propriétés du cours retourné par `getCourse()` :

### Via la console, tapez :

```javascript
// Cherchez dans le cache React Query
window.console.log(
  JSON.stringify(
    // Trouvez les données du cours
    // Cherchez "modules" → "content" → "pdf_key"
  )
)
```

### Ou inspectez l'onglet "Network"

1. Ouvrez "Network"
2. Rechargez la page
3. Cherchez la requête `/api/courses/{courseId}`
4. Cliquez dessus → onglet "Response"
5. Cherchez `"pdf_key"` dans la réponse

### Si `pdf_key` n'existe pas dans la réponse :

**❌ Problème Backend**
- Le backend ne retourne pas `pdf_key` pour les leçons PDF
- Vérifiez que la leçon a bien un PDF associé
- Vérifiez que le modèle Django/FastAPI inclut le champ `pdf_key`

### Si `pdf_key` existe mais n'est pas accessible au frontend :

**⚠️ Problème de structure**
- Le frontend cherche `currentItem.pdf_key`
- Mais les données du cours sont imbriquées : `course.modules[].content[].pdf_key`
- Vérifiez que `currentItem` pointe vraiment sur l'élément de contenu correct

---

## 5. Tableau de Diagnostic Complet

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| Aucun PDF n'affiche | Backend ne retourne pas pdf_key | Créer une leçon PDF dans le backend |
| "Aucun PDF disponible" | pdfKey et pdfUrl sont null | Vérifier structure de données |
| "Erreur" + message | Impossible de générer l'URL présignée | Vérifier MinIO/S3 et credentials |
| Iframe affiche du texte blanc | URL générée mais PDF n'existe pas en MinIO | Upload le PDF d'abord |
| Page plante | Erreur React | Vérifier console pour les erreurs JS |

---

## 6. Test manuel avec un PDF public

Pour tester sans dépendre du backend, créez une leçon temporaire :

```javascript
// Dans la console, injectez une URL PDF publique
// Cette URL est juste pour tester, elle sera affichée en tant que test

// PDF de test public (fonctionne partout) :
https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf
```

Pour tester, modifiez temporairement PDFViewer.tsx :

```tsx
// Remplacez dans PDFViewer.tsx
const FALLBACK_PDF = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf";

const iframeUrl = playUrl || FALLBACK_PDF;
```

Si cela fonctionne → **Problème = MinIO/backend ne génère pas les URLs**
Si cela ne fonctionne pas → **Problème = iframe/navigateur incompatibilité**

---

## 7. Logs à activer pour le debugging complet

Ajoutez ces logs temporaires pour plus de visibilité :

### Dans usePresignedUrl.ts (line ~65)
```typescript
console.log('[usePresignedUrl] Fetching URL for:', { storageKey, directUrl, response });
```

### Dans PDFViewer.tsx (already added)
```typescript
console.log('[PDFViewer] Données reçues:', { pdfKey, pdfUrl, playUrl, loading, error });
```

### Dans LessonViewer.tsx (already added)
```typescript
console.log('[LessonViewer] Current Item:', { ... });
```

---

## 8. Checklist Finale

- [ ] Console ouverte (F12)
- [ ] Naviguez vers une leçon
- [ ] Cherchez `[LessonViewer] Current Item` dans console
- [ ] Vérifiez `contentType` et `pdf_key`
- [ ] Si PDF, cherchez `[PDFViewer] Données reçues`
- [ ] Vérifiez que `playUrl` est une HTTPS URL valide
- [ ] Vérifiez que l'iframe se charge sans erreur

---

## Questions pour diagnostic rapide

1. **Avez-vous une leçon PDF dans le cours ?**
   - ✅ Oui → Passez à Q2
   - ❌ Non → Créez une leçon PDF d'abord

2. **Le backend retourne-t-il `pdf_key` dans la réponse du cours ?**
   - ✅ Oui → Passez à Q3
   - ❌ Non → Problème backend, vérifiez les modèles Django

3. **L'URL du PDF est-elle générée correctement ?**
   - ✅ Oui (`playUrl` = URL HTTPS) → Passez à Q4
   - ❌ Non → Problème MinIO/S3 ou credentials

4. **L'iframe charge-t-il le PDF ?**
   - ✅ Oui → ✅ **Succès!**
   - ❌ Non → Problème navigateur ou CORS

