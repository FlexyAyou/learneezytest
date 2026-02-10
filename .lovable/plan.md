

# Specifications Backend -- Gestion des Documents de Formation

## Document de specifications pour le developpeur backend FastAPI

Ce document decrit l'ensemble des endpoints, modeles de donnees, et logiques metier necessaires pour rendre operationnelle la gestion des documents sur les 3 dashboards : **OF (Organisme de Formation)**, **Apprenant**, et **SuperAdmin**.

---

## 1. Repartition des documents par phase

### Phase 1 — Inscription (Entrée en formation)
| Document | Type ENUM | Signature requise |
|----------|-----------|-------------------|
| Analyse du besoin | `analyse_besoin` | Non |
| Test de positionnement | `test_positionnement` | Non |
| Convention de formation | `convention` | Oui |

### Phase 2 — Formation (En formation)
| Document | Type ENUM | Signature requise |
|----------|-----------|-------------------|
| Convocation | `convocation` | Non |
| Programme de formation | `programme` | Non |
| Conditions Générales de Vente | `cgv` | Oui |
| Règlement intérieur | `reglement_interieur` | Oui |
| Attestation sur l'honneur (CPF) | `attestation_honneur` | Oui |

### Phase 3 — Post-formation (Fin de formation)
| Document | Type ENUM | Signature requise |
|----------|-----------|-------------------|
| Test de sortie | `test_sortie` | Non |
| Questionnaire de satisfaction à chaud | `satisfaction_chaud` | Non |
| Certificat de réalisation | `certificat` | Non |
| Attestation de réalisation (émargements) | `emargement` | Oui |

### Phase 4 — Suivi (+3 mois)
| Document | Type ENUM | Signature requise |
|----------|-----------|-------------------|
| Questionnaire à froid | `satisfaction_froid` | Non |

---

## 2. Modeles de donnees (SQLAlchemy / Pydantic)

### 2.1 Table `document_templates`

Stocke les modeles HTML reutilisables crees par un OF ou par Learneezy (SuperAdmin).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK | Identifiant unique |
| `organization_id` | FK -> organizations.id | NULL = Learneezy global | OF proprietaire du template |
| `type` | VARCHAR(50) | NOT NULL, ENUM | Type de document (voir liste ci-dessous) |
| `phase` | VARCHAR(30) | NOT NULL, ENUM | Phase de formation associee |
| `title` | VARCHAR(255) | NOT NULL | Titre du modele |
| `description` | TEXT | | Description |
| `html_content` | TEXT | NOT NULL | Contenu HTML avec placeholders `{{...}}` |
| `requires_signature` | BOOLEAN | DEFAULT false | Signature electronique requise |
| `is_active` | BOOLEAN | DEFAULT true | Actif/Inactif |
| `is_global` | BOOLEAN | DEFAULT false | True = template Learneezy disponible pour tous les OF |
| `created_at` | TIMESTAMP | DEFAULT now() | |
| `updated_at` | TIMESTAMP | AUTO | |

**Valeurs ENUM pour `type`** :
```text
analyse_besoin, test_positionnement, convention, programme,
reglement_interieur, cgv, convocation, emargement,
attestation_honneur, test_sortie,
satisfaction_chaud, certificat, satisfaction_froid
```

**Valeurs ENUM pour `phase`** :
```text
inscription, formation, post-formation, suivi
```

---

### 2.2 Table `documents`

Stocke les documents personnalises, generes et envoyes a un apprenant specifique.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK | Identifiant unique |
| `template_id` | FK -> document_templates.id | NULL si upload | Modele source |
| `uploaded_document_id` | FK -> uploaded_documents.id | NULL si template | Document uploadé source |
| `organization_id` | FK -> organizations.id | NOT NULL | OF emetteur (ou Learneezy id) |
| `learner_id` | FK -> users.id | NOT NULL | Apprenant destinataire |
| `formation_id` | FK -> courses.id | NULL | Formation associee |
| `type` | VARCHAR(50) | NOT NULL | Type de document |
| `phase` | VARCHAR(30) | NOT NULL | Phase |
| `title` | VARCHAR(255) | NOT NULL | Titre personnalise |
| `html_content` | TEXT | | Contenu HTML personnalise (placeholders remplaces) — NULL si document uploadé |
| `file_url` | VARCHAR(500) | | URL du fichier uploade (PDF, etc.) sur le stockage blob |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | Statut du document |
| `requires_signature` | BOOLEAN | DEFAULT false | |
| `sent_at` | TIMESTAMP | | Date d'envoi |
| `read_at` | TIMESTAMP | | Date de premiere lecture |
| `signed_at` | TIMESTAMP | | Date de signature |
| `signature_url` | VARCHAR(500) | | URL de l'image de signature de l'apprenant (stockage blob) |
| `unique_code` | VARCHAR(50) | UNIQUE | Code unique pour tracabilite |
| `created_at` | TIMESTAMP | DEFAULT now() | |
| `updated_at` | TIMESTAMP | AUTO | |

**Valeurs ENUM pour `status`** :
```text
draft, sent, delivered, read, signed, completed, expired
```

---

### 2.3 Table `of_signatures`

Stocke la signature officielle d'un OF (actuellement en localStorage cote frontend).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK | |
| `organization_id` | FK -> organizations.id | UNIQUE | Un seul enregistrement par OF |
| `signature_url` | VARCHAR(500) | NOT NULL | URL de l'image de signature (stockage blob) |
| `uploaded_by` | FK -> users.id | | Utilisateur qui a uploade |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

---

### 2.4 Table `uploaded_documents`

Stocke les fichiers (PDF, DOCX) uploades manuellement et associes a une phase.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK | |
| `organization_id` | FK -> organizations.id | NOT NULL | OF proprietaire |
| `title` | VARCHAR(255) | NOT NULL | Titre donne par l'admin |
| `phase` | VARCHAR(30) | NOT NULL | Phase associee |
| `file_url` | VARCHAR(500) | NOT NULL | URL du fichier sur le stockage blob |
| `file_name` | VARCHAR(255) | NOT NULL | Nom original du fichier |
| `file_size` | INTEGER | | Taille en octets |
| `mime_type` | VARCHAR(100) | | Type MIME |
| `uploaded_by` | FK -> users.id | | |
| `created_at` | TIMESTAMP | DEFAULT now() | |

---

## 3. Schemas Pydantic (Request / Response)

### 3.1 Templates

```python
# Request
class DocumentTemplateCreate(BaseModel):
    type: str                    # ENUM document type
    phase: str                   # ENUM phase
    title: str
    description: str | None = None
    html_content: str
    requires_signature: bool = False
    is_global: bool = False      # SuperAdmin only

class DocumentTemplateUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    html_content: str | None = None   # Permet l'édition du code source HTML
    requires_signature: bool | None = None
    is_active: bool | None = None

# Response
class DocumentTemplateResponse(BaseModel):
    id: str
    organization_id: str | None
    type: str
    phase: str
    title: str
    description: str | None
    html_content: str
    requires_signature: bool
    is_active: bool
    is_global: bool
    created_at: datetime
    updated_at: datetime
```

### 3.2 Documents (envois personnalises)

```python
# Request - Envoi groupé (templates avec personnalisation)
class DocumentSendRequest(BaseModel):
    learner_id: str
    formation_id: str | None = None
    template_ids: list[str]          # IDs des templates a envoyer
    custom_fields: dict | None = None # {"dates.debut": "15/01/2024", "formation.prix": "2500 €", ...}

# Request - Envoi de documents uploadés (sans personnalisation)
class UploadedDocumentSendRequest(BaseModel):
    learner_ids: list[str]           # IDs des apprenants destinataires
    uploaded_document_id: str        # ID du document uploadé

# Request - Signature apprenant
class DocumentSignRequest(BaseModel):
    signature_image_base64: str      # Image base64 (sera uploadee en blob, pas stockee en DB)
    accept_terms: bool = True
    accept_signature_consent: bool = True

# Response
class DocumentResponse(BaseModel):
    id: str
    template_id: str | None
    uploaded_document_id: str | None
    organization_id: str
    organization_name: str
    learner_id: str
    learner_name: str
    formation_id: str | None
    formation_name: str | None
    type: str
    phase: str
    title: str
    html_content: str | None
    file_url: str | None
    status: str
    requires_signature: bool
    sent_at: datetime | None
    read_at: datetime | None
    signed_at: datetime | None
    signature_url: str | None
    unique_code: str
    created_at: datetime

class DocumentListResponse(BaseModel):
    id: str
    type: str
    phase: str
    title: str
    status: str
    requires_signature: bool
    organization_name: str
    sent_at: datetime | None
    signed_at: datetime | None
    unique_code: str
```

---

## 4. Endpoints API

### 4.1 Dashboard OF — Templates (`/api/organizations/{of_id}/document-templates`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/organizations/{of_id}/document-templates` | of_admin | Liste les templates de l'OF (+ templates globaux Learneezy) |
| `GET` | `/api/organizations/{of_id}/document-templates/{id}` | of_admin | Detail d'un template (inclut `html_content` pour édition) |
| `POST` | `/api/organizations/{of_id}/document-templates` | of_admin | Creer un template |
| `PATCH` | `/api/organizations/{of_id}/document-templates/{id}` | of_admin | Modifier un template (titre, description, **code source HTML**, signature, statut) |
| `DELETE` | `/api/organizations/{of_id}/document-templates/{id}` | of_admin | Supprimer un template |

**Query params GET liste** :
- `phase` (optional) : filtrer par phase
- `type` (optional) : filtrer par type de document
- `include_global` (optional, default true) : inclure les templates Learneezy

**Fonctionnalité d'édition du code source** :
L'OF peut modifier le contenu HTML (`html_content`) de ses propres templates via `PATCH`. Les templates globaux Learneezy (`is_global = true`) ne peuvent pas être modifiés par un OF, mais celui-ci peut créer une copie locale via `POST` pour la personnaliser.

---

### 4.2 Dashboard OF — Documents envoyes (`/api/organizations/{of_id}/documents`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/organizations/{of_id}/documents` | of_admin | Liste des documents envoyes par cet OF |
| `POST` | `/api/organizations/{of_id}/documents/send` | of_admin | Envoyer un lot de documents templates a un apprenant (avec personnalisation) |
| `POST` | `/api/organizations/{of_id}/documents/send-uploaded` | of_admin | Envoyer un document uploadé à des apprenants (sans personnalisation) |
| `GET` | `/api/organizations/{of_id}/documents/{id}` | of_admin | Detail d'un document envoye (avec HTML personnalise ou file_url) |

**Query params GET liste** :
- `phase` (optional)
- `status` (optional)
- `learner_id` (optional)
- `formation_id` (optional)

**Body POST `/send`** : `DocumentSendRequest`

**Logique backend du `POST /send`** :
1. Pour chaque `template_id`, recuperer le template HTML
2. Recuperer les donnees de l'apprenant (user), de la formation, de l'OF
3. Remplacer tous les placeholders `{{...}}` par les valeurs reelles + `custom_fields`
4. Injecter la signature OF depuis `of_signatures` dans `{{of.signature}}`
5. Generer un `unique_code` (ex: `CGV-{timestamp}-{random}`)
6. Creer un enregistrement `documents` avec status `sent` et `sent_at = now()`
7. (Optionnel) Envoyer un email de notification a l'apprenant
8. Retourner la liste des documents crees

**Body POST `/send-uploaded`** : `UploadedDocumentSendRequest`

**Logique backend du `POST /send-uploaded`** :
1. Recuperer le document uploadé (`uploaded_documents`)
2. Pour chaque `learner_id`, creer un enregistrement `documents` avec :
   - `uploaded_document_id` renseigné
   - `file_url` copié depuis le document uploadé
   - `html_content = NULL`
   - `status = 'sent'`, `sent_at = now()`
   - `phase` héritée du document uploadé
3. Generer un `unique_code` par document
4. (Optionnel) Notification email
5. Retourner la liste des documents crees

**NOTE** : Tous les documents envoyés (templates et uploadés) sont consultables dans la section **Gestion des émargements** et non dans la page de gestion des documents.

---

### 4.3 Dashboard OF — Emargements (`/api/organizations/{of_id}/emargements`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/organizations/{of_id}/emargements` | of_admin | Liste des apprenants avec stats de signature |
| `GET` | `/api/organizations/{of_id}/emargements/{learner_id}` | of_admin | Documents d'un apprenant specifique groupes par phase |

La page émargements centralise **tous** les documents envoyés (templates personnalisés ET documents uploadés). Elle sert de registre légal pour les audits Qualiopi.

**Response GET liste** :
```python
class EmargementLearnerSummary(BaseModel):
    learner_id: str
    first_name: str
    last_name: str
    email: str
    formation_name: str
    total_documents: int
    signed_count: int
    pending_count: int
```

**Response GET detail** :
```python
class EmargementLearnerDetail(BaseModel):
    learner_id: str
    first_name: str
    last_name: str
    documents: list[DocumentResponse]  # groupable par phase cote front
```

---

### 4.4 Dashboard OF — Signature OF (`/api/organizations/{of_id}/signature`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/organizations/{of_id}/signature` | of_admin | Recuperer la signature officielle |
| `POST` | `/api/organizations/{of_id}/signature` | of_admin | Uploader/mettre a jour la signature (multipart/form-data) |
| `DELETE` | `/api/organizations/{of_id}/signature` | of_admin | Supprimer la signature |

**POST body** : `multipart/form-data` avec champ `file` (image PNG/JPEG)
Le backend upload l'image vers le stockage blob et stocke l'URL.

---

### 4.5 Dashboard OF — Upload documents (`/api/organizations/{of_id}/uploaded-documents`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/organizations/{of_id}/uploaded-documents` | of_admin | Liste des fichiers uploades |
| `POST` | `/api/organizations/{of_id}/uploaded-documents` | of_admin | Uploader un fichier (multipart) |
| `DELETE` | `/api/organizations/{of_id}/uploaded-documents/{id}` | of_admin | Supprimer un fichier uploade |
| `POST` | `/api/organizations/{of_id}/uploaded-documents/{id}/send` | of_admin | Envoyer un document uploadé à des apprenants |

**POST body upload** : `multipart/form-data` avec champs `file`, `title`, `phase`
**POST body send** : `{ "learner_ids": ["id1", "id2"] }`

---

### 4.6 Dashboard Apprenant (`/api/learner/documents`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/learner/documents` | student, apprenant | Liste de tous les documents recus par l'apprenant connecte |
| `GET` | `/api/learner/documents/{id}` | student, apprenant | Detail d'un document (HTML personnalise ou file_url inclus) |
| `POST` | `/api/learner/documents/{id}/read` | student, apprenant | Marquer comme lu (met a jour `read_at` et `status`) |
| `POST` | `/api/learner/documents/{id}/sign` | student, apprenant | Signer un document |

**Query params GET liste** :
- `phase` (optional) : filtrer par phase
- `formation_id` (optional) : filtrer par formation
- `status` (optional) : filtrer par statut

**Body POST `/sign`** : `DocumentSignRequest`

**Logique backend du `POST /sign`** :
1. Verifier que le document appartient bien a l'apprenant connecte
2. Verifier que `requires_signature = true` et `status != 'signed'`
3. Uploader l'image de signature en base64 vers le stockage blob
4. Mettre a jour le document : `status = 'signed'`, `signed_at = now()`, `signature_url = <blob_url>`
5. (Optionnel) Notifier l'OF que le document a ete signe

**Response GET liste** (adaptee a l'apprenant) :
```python
class LearnerDocumentListResponse(BaseModel):
    id: str
    type: str
    phase: str
    title: str
    status: str
    requires_signature: bool
    organization_name: str
    formation_name: str | None
    file_url: str | None        # URL si document uploadé
    sent_at: datetime | None
    signed_at: datetime | None

class LearnerDocumentsGrouped(BaseModel):
    phase_stats: dict[str, PhaseStats]
    documents: list[LearnerDocumentListResponse]

class PhaseStats(BaseModel):
    total: int
    signed: int
    pending: int
```

---

### 4.7 Dashboard SuperAdmin (`/api/admin/documents`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/admin/documents` | superadmin | Liste globale de tous les documents de la plateforme |
| `GET` | `/api/admin/documents/stats` | superadmin | Statistiques globales (envoyes, signes, en attente, taux) |
| `GET` | `/api/admin/documents/audit` | superadmin | Audit de conformite par OF |
| `GET` | `/api/admin/documents/learners` | superadmin | Liste des apprenants avec stats documents (vue suivi global) |
| `GET` | `/api/admin/documents/learners/{learner_id}` | superadmin | Documents d'un apprenant specifique |

**Query params GET `/api/admin/documents`** :
- `organization_id` (optional) : filtrer par OF
- `phase` (optional)
- `status` (optional)
- `learner_name` (optional) : recherche par nom

**Response `/stats`** :
```python
class GlobalDocumentStats(BaseModel):
    total_sent: int
    total_signed: int
    total_pending: int
    signature_rate: float  # pourcentage
```

**Response `/audit`** :
```python
class OFAuditEntry(BaseModel):
    organization_id: str
    organization_name: str
    city: str
    siret: str
    is_learneezy: bool
    total_documents: int
    signed_count: int
    pending_count: int
    signature_rate: float
    has_missing_documents: bool  # alerte si < seuil attendu
```

**Response `/learners`** :
```python
class LearnerDocumentSummary(BaseModel):
    learner_id: str
    learner_name: str
    organizations: list[str]  # noms des OF
    total_documents: int
    signed_count: int
    pending_count: int
```

---

### 4.8 SuperAdmin — Templates globaux (`/api/admin/document-templates`)

| Methode | Route | Roles | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/admin/document-templates` | superadmin | Liste des templates globaux Learneezy |
| `POST` | `/api/admin/document-templates` | superadmin | Creer un template global |
| `PATCH` | `/api/admin/document-templates/{id}` | superadmin | Modifier un template global (inclut **édition du code source HTML**) |
| `DELETE` | `/api/admin/document-templates/{id}` | superadmin | Supprimer un template global |

Ces templates ont `is_global = true` et `organization_id = NULL` (ou l'id de Learneezy).
Ils sont automatiquement disponibles pour tous les OF via le param `include_global` de la route OF.

**Fonctionnalité d'édition du code source** :
Le SuperAdmin peut modifier le `html_content` de n'importe quel template global. Cela permet d'ajuster les placeholders, la mise en page et le contenu des modèles standards Learneezy.

---

## 5. Mapping Frontend -> Backend

### 5.1 Dashboard OF (`OFDocumentsAdvanced.tsx`)

| Action frontend | Endpoint backend |
|-----------------|------------------|
| Charger les templates par phase | `GET /api/organizations/{of_id}/document-templates?phase={phase}` |
| Creer un modele | `POST /api/organizations/{of_id}/document-templates` |
| Modifier un modele (titre, description) | `PATCH /api/organizations/{of_id}/document-templates/{id}` |
| **Éditer le code source HTML** d'un template | `PATCH /api/organizations/{of_id}/document-templates/{id}` avec `html_content` |
| Envoyer des documents templates (PhaseDocumentSender) | `POST /api/organizations/{of_id}/documents/send` |
| Envoyer un document uploadé (sans personnalisation) | `POST /api/organizations/{of_id}/uploaded-documents/{id}/send` |
| Uploader la signature OF | `POST /api/organizations/{of_id}/signature` (multipart) |
| Charger la signature OF | `GET /api/organizations/{of_id}/signature` |
| Uploader un fichier PDF | `POST /api/organizations/{of_id}/uploaded-documents` (multipart) |
| Liste des apprenants + emargements | `GET /api/organizations/{of_id}/emargements` |
| Detail emargement d'un apprenant | `GET /api/organizations/{of_id}/emargements/{learner_id}` |
| Previsualiser un document HTML | `GET /api/organizations/{of_id}/documents/{id}` (champ `html_content`) |

### 5.2 Dashboard Apprenant (`StudentDocuments.tsx`)

| Action frontend | Endpoint backend |
|-----------------|------------------|
| Charger tous les documents recus | `GET /api/learner/documents` |
| Filtrer par phase | `GET /api/learner/documents?phase=inscription` |
| Filtrer par formation | `GET /api/learner/documents?formation_id={id}` |
| Voir un document HTML | `GET /api/learner/documents/{id}` |
| Voir un document uploadé (PDF) | `GET /api/learner/documents/{id}` → `file_url` |
| Marquer comme lu | `POST /api/learner/documents/{id}/read` |
| Signer un document | `POST /api/learner/documents/{id}/sign` |
| Stats par phase (sidebar) | Inclus dans la reponse `GET /api/learner/documents` via `phase_stats` |

### 5.3 Dashboard SuperAdmin (`SuperAdminDocumentsPage.tsx`)

| Action frontend | Endpoint backend |
|-----------------|------------------|
| Stats globales (cards en haut) | `GET /api/admin/documents/stats?organization_id={of_id}` |
| Onglet Gestion phases : charger templates | `GET /api/organizations/{of_id}/document-templates` (l'of_id depend du filtre) |
| Onglet Gestion phases : envoyer documents | `POST /api/organizations/{of_id}/documents/send` |
| Onglet Gestion phases : envoyer doc uploadé | `POST /api/organizations/{of_id}/uploaded-documents/{id}/send` |
| Onglet Templates globaux : lister | `GET /api/admin/document-templates` |
| Onglet Templates globaux : créer | `POST /api/admin/document-templates` |
| **Onglet Templates globaux : éditer code source HTML** | `PATCH /api/admin/document-templates/{id}` avec `html_content` |
| Onglet Templates globaux : supprimer | `DELETE /api/admin/document-templates/{id}` |
| Onglet Suivi global : liste apprenants | `GET /api/admin/documents/learners?organization_id={of_id}` |
| Onglet Suivi global : detail apprenant | `GET /api/admin/documents/learners/{learner_id}` |
| Onglet Audit | `GET /api/admin/documents/audit` |
| Export CSV | Frontend depuis les donnees deja chargees |
| Previsualiser un document | `GET /api/admin/documents/{id}` ou `GET /api/organizations/{of_id}/documents/{id}` |

---

## 6. Logique de personnalisation (backend)

Le backend doit implementer un moteur de remplacement de placeholders. Voici la liste exhaustive des placeholders utilises dans les templates HTML :

### Donnees OF (depuis `organizations` + `of_signatures`)
```text
{{of.nom}}         -> organization.name
{{of.siret}}       -> organization.siret
{{of.nda}}         -> organization.nda
{{of.adresse}}     -> organization.address
{{of.codePostal}}  -> organization.postal_code
{{of.ville}}       -> organization.city
{{of.telephone}}   -> organization.phone
{{of.email}}       -> organization.email
{{of.responsable}} -> organization.responsable
{{of.signature}}   -> <img src="{of_signatures.signature_url}" ... /> ou placeholder texte
```

### Donnees apprenant (depuis `users`)
```text
{{apprenant.prenom}}     -> user.first_name
{{apprenant.nom}}        -> user.last_name
{{apprenant.nom_complet}} -> "{first_name} {last_name}"
{{apprenant.email}}      -> user.email
{{apprenant.telephone}}  -> user.phone
{{apprenant.adresse}}    -> user.address
{{apprenant.ville}}      -> user.city
{{apprenant.codePostal}} -> user.postal_code
{{apprenant.entreprise}} -> user.company
{{apprenant.poste}}      -> user.position
```

### Donnees formation (depuis `courses`)
```text
{{formation.nom}}         -> course.title
{{formation.description}} -> course.description
{{formation.duree}}       -> custom_fields ou course.duration
{{formation.lieu}}        -> course.location
{{formation.formateur}}   -> course.trainer (ou user formateur associe)
{{formation.prix}}        -> custom_fields ou course.price
{{formation.certification}} -> course.certification
```

### Dates
```text
{{dates.debut}}      -> custom_fields.dateDebut ou course.start_date
{{dates.fin}}        -> custom_fields.dateFin ou course.end_date
{{dates.inscription}} -> enrollment.created_at
{{dates.aujourdhui}} -> date du jour
{{dates.signature}}  -> document.signed_at
{{date.jour}}        -> date du jour (format dd/MM/yyyy)
```

Les `custom_fields` fournis dans le `DocumentSendRequest` sont prioritaires sur les valeurs par defaut de la base.

**Note** : La personnalisation ne s'applique qu'aux documents issus de templates (`template_id` non null). Les documents uploadés sont envoyés tels quels.

---

## 7. Édition du code source des templates

### 7.1 Fonctionnalité

Les administrateurs OF et SuperAdmin peuvent **éditer directement le code source HTML** des templates via l'interface `DocumentTemplateEditor`. Cela permet de :
- Modifier la mise en page et le design des documents
- Ajouter/supprimer des placeholders `{{...}}`
- Personnaliser le contenu textuel
- Ajuster les styles CSS inline

### 7.2 Règles d'édition

| Rôle | Templates éditables | Restrictions |
|------|---------------------|-------------|
| OF Admin | Ses propres templates (`organization_id` = son OF) | Ne peut pas modifier les templates globaux Learneezy |
| OF Admin | Copie locale d'un template global | Peut créer une copie via POST puis la modifier |
| SuperAdmin | Tous les templates globaux (`is_global = true`) | Accès complet |
| SuperAdmin | Templates de n'importe quel OF | Accès complet (supervision) |

### 7.3 Endpoint

L'édition utilise le même endpoint `PATCH` que la modification standard :
```
PATCH /api/organizations/{of_id}/document-templates/{id}
PATCH /api/admin/document-templates/{id}
```
Avec le champ `html_content` dans le body pour mettre à jour le code source.

---

## 8. Stockage fichiers

**IMPORTANT** : Aucun fichier binaire (signature, PDF uploade) ne doit etre stocke en base de donnees. Utiliser un service de stockage blob (S3, MinIO, etc.) et stocker uniquement l'URL en base.

Fichiers concernes :
- Signatures OF : `POST /api/organizations/{of_id}/signature` -> stockage blob -> URL en `of_signatures.signature_url`
- Signatures apprenants : `POST /api/learner/documents/{id}/sign` -> stockage blob -> URL en `documents.signature_url`
- Documents uploades : `POST /api/organizations/{of_id}/uploaded-documents` -> stockage blob -> URL en `uploaded_documents.file_url`

---

## 9. Securite et controle d'acces

| Regle | Implementation |
|-------|---------------|
| Un OF ne peut acceder qu'a ses propres templates et documents | Filtrer par `organization_id` du user connecte |
| Un OF ne peut modifier que ses propres templates (pas les globaux) | Verifier `organization_id` et `is_global = false` |
| Un apprenant ne voit que les documents qui lui sont destines | Filtrer par `learner_id` = user connecte |
| Seul le SuperAdmin peut creer/modifier des templates globaux | Verifier `role == 'superadmin'` |
| Un apprenant ne peut signer qu'un document qui le concerne et requiert signature | Verifier `learner_id`, `requires_signature`, et `status != 'signed'` |
| Le SuperAdmin peut voir et gerer les documents de tous les OF | Pas de filtre `organization_id` obligatoire |
| Le SuperAdmin envoie en tant que Learneezy quand filtre = "all" ou "learneezy" | L'`organization_id` dans le `POST /send` determine l'emetteur |

---

## 10. Notifications (optionnel, P1)

| Evenement | Notification |
|-----------|-------------|
| Document envoye a un apprenant | Email + notification in-app a l'apprenant |
| Document signe par un apprenant | Notification in-app a l'OF admin |
| Document en attente > 7 jours | Rappel automatique a l'apprenant |

---

## 11. Priorites d'implementation

| Priorite | Endpoints | Raison |
|----------|-----------|--------|
| P0 | `POST /send`, `POST /send-uploaded`, `GET /learner/documents`, `POST /sign` | Flux principal : envoi (templates + uploads) et signature |
| P0 | `CRUD /document-templates` (avec édition HTML) | Gestion et personnalisation des modeles |
| P0 | `POST /signature` (OF) | Prerequis pour les documents officiels |
| P1 | `GET /emargements` | Suivi des signatures (centralise tous les envois) |
| P1 | `GET /admin/documents/*` | Supervision SuperAdmin |
| P1 | `CRUD /uploaded-documents` + envoi | Upload et envoi de fichiers manuels |
| P2 | `GET /admin/documents/audit` | Audit de conformite |
| P2 | Notifications email | Alertes et rappels |
