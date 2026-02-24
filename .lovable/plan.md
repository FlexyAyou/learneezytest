

# Preparateur de Document avec Zones de Signature (style Yousign)

## Objectif

Transformer le bouton "Envoyer un document" de la page `/dashboard/organisme-formation/documents` en un flux complet de preparation de document inspire de Yousign :

1. **Upload du PDF** -- L'admin OF uploade un document
2. **Preparation visuelle** -- Le PDF s'affiche au centre avec un panneau lateral de champs draggables (Signature, Date, Nom, Paraphes, etc.)
3. **Placement des zones** -- L'admin glisse-depose les champs sur le PDF pour definir ou l'apprenant devra signer/parapher
4. **Configuration finale** -- Selection de la phase et des apprenants destinataires
5. **Cote apprenant** -- Le document s'affiche avec les zones definies, et l'apprenant pose sa signature exactement a l'emplacement prevu

## Architecture de la solution

```text
+------------------------------------------------------------------+
|  DocumentPreparer (fullscreen dialog)                            |
|                                                                  |
|  [Sidebar gauche]   [Viewer central]      [Panneau droit]        |
|  - Fichier uploade  - PDF rendu via       - Champs draggables:   |
|  - Ajouter fichier    canvas (pdf.js)       * Signature          |
|                     - Overlay avec les      * Date de signature   |
|                       zones placees         * Nom du signataire   |
|                       (drag & resize)       * Paraphes            |
|                                             * Mention             |
|                                             * Case a cocher       |
|                                           - Signataires           |
+------------------------------------------------------------------+
|  [Annuler]                              [Suivant ->]             |
+------------------------------------------------------------------+

                            |
                            v  (Etape 2 : Configuration)

+------------------------------------------------------------------+
|  Selection de phase + Selection des apprenants + Envoi           |
+------------------------------------------------------------------+
```

## Fichiers a creer

### 1. `src/components/admin/documents/DocumentPreparer.tsx`
Composant principal (dialog fullscreen) orchestrant le flux en 2 etapes :
- **Etape 1 "Preparation"** : Upload + viewer PDF + placement des zones
- **Etape 2 "Envoi"** : Selection phase, apprenants, confirmation

### 2. `src/components/admin/documents/PDFFieldOverlay.tsx`
Le viewer central : rendu du PDF page par page via un `<canvas>` (librairie `pdfjs-dist`) avec une couche d'overlay HTML par-dessus pour les zones de champs. Chaque zone est draggable et redimensionnable via `@dnd-kit`.

### 3. `src/components/admin/documents/FieldsPalette.tsx`
Le panneau droit avec les champs disponibles a glisser :
- **Signature** (zone rectangle ou l'apprenant signera)
- **Date de signature** (rempli automatiquement)
- **Nom du signataire** (rempli automatiquement)
- **Paraphes** (petite zone de signature par page)
- **Saisie de texte** (champ libre)
- **Mention** (texte pre-rempli)
- **Case a cocher**

Chaque champ est un draggable (`@dnd-kit/core`).

### 4. `src/components/admin/documents/SignatureZone.tsx`
Composant representant une zone placee sur le PDF. Draggable + redimensionnable. Affiche un cadre colore avec le type de champ et un bouton de suppression.

### 5. `src/components/student/documents/DocumentSignerViewer.tsx`
Cote apprenant : affiche le PDF uploade avec les zones de signature positionnees. L'apprenant clique sur la zone "Signature" pour ouvrir le pad de signature existant (`ElectronicSignature`), et la signature est apposee visuellement a l'emplacement exact defini par l'OF.

### 6. `src/types/document-fields.ts`
Types partages pour les zones de champs :

```typescript
interface SignatureField {
  id: string;
  type: 'signature' | 'date' | 'name' | 'initials' | 'text' | 'mention' | 'checkbox';
  page: number;       // numero de page du PDF
  x: number;          // position X en % de la largeur
  y: number;          // position Y en % de la hauteur
  width: number;      // largeur en % 
  height: number;     // hauteur en %
  required: boolean;
  label?: string;
  value?: string;      // pre-rempli pour mention/texte
}

interface PreparedDocument {
  fileKey: string;       // cle MinIO du PDF uploade
  fileName: string;
  fields: SignatureField[];
  signatories: string[]; // IDs des apprenants
  phase: DocumentPhase;
}
```

## Fichiers a modifier

### 1. `src/components/admin/documents/OFDocumentsAdvanced.tsx`
- Remplacer le dialog simple `showUploadSender` par l'ouverture du nouveau `DocumentPreparer`
- Le bouton "Envoyer un document" ouvre desormais le flux complet

### 2. `src/components/student/documents/DocumentSignatureModal.tsx`
- Ajouter la gestion des documents uploades avec zones pre-definies
- Quand un document a des `SignatureField[]`, afficher le PDF avec les zones cliquables au lieu du flux generique actuel

## Dependance a installer

- **`pdfjs-dist`** : Necessaire pour rendre les pages PDF en canvas cote client (le `<embed>` actuel ne permet pas de superposer des elements HTML). C'est la librairie standard utilisee par tous les outils type Yousign/DocuSign.

## Detail technique

### Rendu PDF avec overlay
Le PDF sera rendu page par page dans un `<canvas>` via `pdfjs-dist`. Par-dessus chaque page, un `<div>` positionne en `position: relative` contiendra les zones de champs en `position: absolute` avec des coordonnees en pourcentage (pour etre responsive).

### Drag & Drop
- Le panneau droit utilise `@dnd-kit/core` (deja installe) pour rendre les champs draggables
- La zone PDF est un droppable qui calcule la position relative du drop
- Les zones placees sont repositionnables par drag interne
- Le redimensionnement se fait par les poignees aux coins (implementation CSS `resize` ou handles custom)

### Stockage des zones
Les positions des champs sont stockees en JSON dans les metadonnees du document envoye. Structure :
```json
{
  "fileKey": "resources/xxx.pdf",
  "fields": [
    { "type": "signature", "page": 1, "x": 65, "y": 80, "width": 25, "height": 8 }
  ]
}
```
Ce JSON est transmis au backend lors de l'envoi (`POST /api/organizations/{of_id}/documents/send`) et stocke avec l'assignment du document.

### Cote apprenant
Quand l'apprenant ouvre un document avec des `fields`, le `DocumentSignerViewer` :
1. Charge le PDF via presigned URL
2. Rend les pages en canvas
3. Superpose les zones interactives
4. Au clic sur "Signature", ouvre le pad `ElectronicSignature` existant
5. La signature base64 est apposee visuellement dans la zone
6. A la validation, envoie la signature + les valeurs des champs au backend

## Flux utilisateur complet

### OF Admin
1. Clique "Envoyer un document"
2. Uploade un PDF (drag & drop ou file picker)
3. Le PDF s'affiche au centre, panneau de champs a droite
4. Glisse "Signature" sur le bas du document
5. Glisse "Date de signature" a cote
6. Clique "Suivant"
7. Selectionne la phase (ex: Post-formation)
8. Selectionne le(s) apprenant(s)
9. Clique "Envoyer" -- le document est uploade vers MinIO et assigne

### Apprenant
1. Recoit le document dans son dashboard
2. Clique "Signer"
3. Voit le PDF avec la zone de signature en surbrillance
4. Clique sur la zone -> pad de signature s'ouvre
5. Signe et valide
6. La signature est apposee visuellement, le document est marque "Signe"

