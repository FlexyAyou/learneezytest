---

## 1. Stockage des métadonnées de signature (PRIORITÉ P0)

### Problème
Le endpoint `POST /api/organizations/learners/{learner_id}/documents/{document_id}/sign` accepte actuellement `{ signature_data, honor_declaration }`. Le frontend collecte des métadonnées d'audit **critiques pour la conformité Qualiopi** (IP, User-Agent, timestamp, fingerprint session) mais le backend ne les persiste pas.

### Solution requise
Ajouter un champ JSONB `signature_metadata` à la table `documents` et l'accepter dans le `DocumentSignRequest`.

**Schema mis à jour :**
```python
class DocumentSignRequest(BaseModel):
    signature_data: str                           # Base64 de la signature
    honor_declaration: bool                       # Déclaration sur l'honneur
    signature_metadata: dict | None = None        # NOUVEAU — Métadonnées d'audit

# Contenu attendu de signature_metadata :
# {
#   "ip_address": "192.168.1.1",
#   "user_agent": "Mozilla/5.0...",
#   "timestamp": "2026-03-05T10:30:00.000Z",
#   "session_fingerprint": "abc123def456",
#   "honor_declaration": true
# }
```

**Migration SQL :**
```sql
ALTER TABLE documents
ADD COLUMN signature_metadata JSONB DEFAULT NULL;
```

---

## 2. Documents PDF Interactifs — Signature par Zones (PRIORITÉ P1)

Le frontend supporte les documents PDF avec des **zones de signature interactives** (coordonnées x/y sur les pages). Ce workflow nécessite 4 nouveaux endpoints.

### 2.1 `GET /api/users/me/documents`

Retourne les documents PDF assignés à l'utilisateur connecté.

**Response :**

```python
class UserMediaAssignment(BaseModel):
    id: int
    title: str
    file_key: str                                   # Clé MinIO du PDF
    file_name: str
    status: str                                     # 'pending' | 'signed' | 'completed'
    signed_at: str | None = None
    signature_fields: list[SignatureField] | None    # Zones interactives
    signed_field_values: dict | None                 # Valeurs remplies
    signature_metadata: dict | None                  # Métadonnées audit
    created_at: str
    updated_at: str

class SignatureField(BaseModel):
    id: str                                         # Identifiant unique du champ
    x: float                                        # Position X en % (0-100)
    y: float                                        # Position Y en % (0-100)
    width: float                                    # Largeur en % (0-100)
    height: float                                   # Hauteur en % (0-100)
    page: int                                       # Numéro de page (1-indexed)
    type: str                                       # 'signature' | 'name' | 'date'
    label: str | None = None                        # Label affiché
    required: bool = True
```

**Route :**

```
GET /api/users/me/documents
Authorization: Bearer <token>
→ 200: UserMediaAssignment[]
```

### 2.2 `POST /api/users/assignments/{assignment_id}/sign-fields`

Soumet les valeurs des zones interactives (signature base64, nom, date).

**Request :**

```python
class SignFieldsRequest(BaseModel):
    field_values: dict[str, str]                    # field_id → valeur (base64 pour signatures, texte pour nom/date)
    signature_metadata: dict | None = None          # Métadonnées audit (IP, UA, timestamp, fingerprint, honor)
```

**Route :**

```
POST /api/users/assignments/{assignment_id}/sign-fields
Authorization: Bearer <token>
Body: SignFieldsRequest
→ 200: { "status": "signed", "signed_at": "..." }
```

**Logique backend :**

1. Vérifier que l'assignment appartient à l'utilisateur connecté
2. Valider que tous les champs `required: true` ont une valeur
3. Stocker `signed_field_values` (JSONB) et `signature_metadata` (JSONB)
4. Mettre à jour `status = 'signed'`, `signed_at = now()`

### 2.3 `POST /api/users/assignments/{assignment_id}/sign`

Signature simple via pad (legacy, pour les PDF sans zones définies).

**Request :**

```python
class SignAssignmentRequest(BaseModel):
    signature_data: str                             # Base64 de la signature
    signature_metadata: dict | None = None
```

**Route :**

```
POST /api/users/assignments/{assignment_id}/sign
Authorization: Bearer <token>
Body: SignAssignmentRequest
→ 200: { "status": "signed", "signed_at": "..." }
```

### 2.4 `GET /api/users/assignments/{assignment_id}/download-signed`

Télécharge un PDF aplati avec les signatures intégrées.

**Route :**

```
GET /api/users/assignments/{assignment_id}/download-signed
Authorization: Bearer <token>
→ 200: application/pdf (blob)
```

**Logique backend :**

1. Récupérer le PDF original depuis MinIO via `file_key`
2. Injecter les signatures (images base64) aux coordonnées définies dans `signature_fields`
3. Aplatir le PDF (flatten) pour empêcher toute modification
4. Retourner le PDF en `application/pdf` avec `Content-Disposition: attachment`

**Bibliothèques Python recommandées :** `reportlab`, `PyPDF2` ou `pikepdf`

---

## 3. Table `user_media_assignments` (PRIORITÉ P1)

Si cette table n'existe pas encore, la créer :

```sql
CREATE TABLE user_media_assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    of_id INTEGER REFERENCES organisations_formation(id),
    title VARCHAR(255) NOT NULL,
    file_key VARCHAR(512) NOT NULL,                 -- Clé MinIO
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending | signed | completed
    signature_fields JSONB DEFAULT NULL,            -- Zones de signature [{id, x, y, width, height, page, type, label, required}]
    signed_field_values JSONB DEFAULT NULL,          -- {field_id: "valeur"} rempli lors de la signature
    signature_metadata JSONB DEFAULT NULL,           -- {ip_address, user_agent, timestamp, session_fingerprint, honor_declaration}
    signed_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_uma_user_id ON user_media_assignments(user_id);
CREATE INDEX idx_uma_of_id ON user_media_assignments(of_id);
CREATE INDEX idx_uma_status ON user_media_assignments(status);
```

---

## 4. Support `signature_fields` dans `uploaded_documents` (PRIORITÉ P1)

### Problème

Le `UploadedDocumentSendRequest` accepte `signature_fields` mais le backend ne semble pas les stocker ni les propager aux assignments créés.

### Solution

Quand `POST /api/organizations/{of_id}/uploaded-documents/{document_id}/send` est appelé avec `signature_fields`, le backend doit :

1. Créer une entrée `user_media_assignments` par learner_id
2. Copier les `signature_fields` dans chaque assignment
3. Définir `status = 'pending'`

**`UploadedDocumentSendRequest` mis à jour :**

```python
class UploadedDocumentSendRequest(BaseModel):
    learner_ids: list[int]
    signature_fields: list[SignatureField] | None = None   # Zones interactives à propager
```

---

## 5. Export Émargements (PRIORITÉ P2)

### 5.1 `GET /api/organizations/{of_id}/emargements/export-csv`

Export CSV de tous les émargements (pour audit Qualiopi).

**Route :**

```
GET /api/organizations/{of_id}/emargements/export-csv
Authorization: Bearer <token>
Query params: ?phase=inscription&learner_id=123 (optionnels)
→ 200: text/csv
  Content-Disposition: attachment; filename="emargements-{of_id}-{date}.csv"
```

**Colonnes CSV :**

```
Apprenant,Email,Document,Type,Phase,Statut,Date d'envoi,Date de signature,Code unique
```

### 5.2 `GET /api/organizations/{of_id}/documents/{document_id}/download-pdf`

Téléchargement du document signé en PDF (version aplatie avec signature intégrée).

**Route :**

```
GET /api/organizations/{of_id}/documents/{document_id}/download-pdf
Authorization: Bearer <token>
→ 200: application/pdf
```

**Logique :**

1. Récupérer le `html_content` du document (déjà personnalisé)
2. Convertir en PDF (avec `weasyprint` ou `wkhtmltopdf`)
3. Si signé, intégrer la signature base64 dans le HTML avant conversion
4. Retourner le PDF aplati

---

## 6. Endpoints secondaires manquants (PRIORITÉ P2)

### 6.1 Signature learner (route alternative)

Le frontend utilise actuellement **deux chemins** pour signer un document learner. Seul un est nécessaire :

✅ **Existant :** `POST /api/organizations/learners/{learner_id}/documents/{document_id}/sign`

❌ **Fantôme (à ignorer) :** `POST /api/organizations/{of_id}/learners/{user_id}/documents/{doc_id}/sign`

→ Le frontend a été nettoyé pour n'utiliser que la route existante. La route fantôme dans `fastapi-client.ts` (`signLearnerDocument`) reste pour compatibilité mais pointe vers un endpoint inexistant — elle peut être retirée si non utilisée.

### 6.2 Sauvegarde brouillon

`PATCH /api/organizations/{of_id}/learners/{user_id}/documents/{doc_id}` — permet de sauvegarder un brouillon de document (html_content modifié par l'apprenant).

**À implémenter si besoin :** Mettre à jour uniquement le `html_content` d'un document avec `status = 'draft'`.

### 6.3 Nettoyage documents de test

`DELETE /api/organizations/{of_id}/users/{user_id}/documents/cleanup` — utile uniquement en développement. **Peut être ignoré en production.**

---

## 7. Récapitulatif des priorités

| Priorité  | Endpoint / Feature                                              | Effort estimé |
| --------- | --------------------------------------------------------------- | ------------- |
| **P0**    | Ajouter `signature_metadata` JSONB au sign endpoint             | 1h            |
| **P1**    | Créer table `user_media_assignments`                            | 2h            |
| **P1**    | `GET /api/users/me/documents`                                   | 2h            |
| **P1**    | `POST /api/users/assignments/{id}/sign-fields`                  | 3h            |
| **P1**    | `GET /api/users/assignments/{id}/download-signed` (PDF flatten) | 4h            |
| **P1**    | Propager `signature_fields` dans send uploaded documents        | 2h            |
| **P2**    | `GET .../emargements/export-csv`                                | 2h            |
| **P2**    | `GET .../documents/{id}/download-pdf` (HTML→PDF)                | 3h            |
| **P2**    | `PATCH .../documents/{id}` (sauvegarde brouillon)               | 1h            |
| **Total** |                                                                 | **~20h**      |

---

## 8. Notes pour le développeur backend

1. **Sécurité :** Tous les endpoints assignments doivent vérifier que l'utilisateur connecté est bien le propriétaire de l'assignment (`user_id = current_user.id`).

2. **PDF Flatten :** Pour `download-signed`, utiliser `pikepdf` ou `reportlab` pour injecter les images de signature aux coordonnées exactes. Les coordonnées sont en **pourcentage** de la taille de page.

3. **Compatibilité :** Le `DocumentBulkSendRequest` a été aligné côté frontend avec les champs racine (`date_debut`, `date_fin`, `duree`, `prix`, `lieu`, `date_signature`) au lieu de tout mettre dans `custom_fields`. Le backend doit injecter ces valeurs dans les placeholders `{{dates.debut}}`, `{{formation.prix}}`, etc.

4. **`include_of_signature`** : Quand `true`, le backend doit récupérer la signature OF depuis `of_signatures` et l'injecter dans `{{of.signature}}` sous forme de `<img src="data:image/png;base64,..." />`.
