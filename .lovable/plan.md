

# Specification Backend - Gestion des Documents (FastAPI)

Ce document decrit l'architecture complete du systeme de gestion documentaire implementee cote frontend, que le backend doit supporter.

---

## 1. Architecture generale

Le systeme gere les documents de formation en 4 phases, conformement aux exigences Qualiopi :

```text
Phase Inscription       -> analyse_besoin, test_positionnement, convention
Phase Formation         -> convocation, programme, cgv, reglement_interieur, attestation_honneur
Phase Post-formation    -> test_sortie, satisfaction_chaud, certificat, emargement
Phase +3 mois           -> satisfaction_froid
```

---

## 2. Tables requises

### 2.1 `document_templates`

Stocke les modeles HTML editables par les admins OF et SuperAdmin.

| Champ | Type | Description |
|---|---|---|
| id | UUID (PK) | Identifiant unique |
| of_id | UUID (FK -> organizations) | Organisation proprietaire |
| type | ENUM | Un parmi : `analyse_besoin`, `test_positionnement`, `convention`, `programme`, `reglement_interieur`, `cgv`, `convocation`, `emargement`, `test_sortie`, `satisfaction_chaud`, `attestation`, `certificat`, `satisfaction_froid`, `attestation_honneur` |
| phase | ENUM | `inscription`, `formation`, `post-formation`, `suivi` |
| title | VARCHAR | Titre du modele |
| description | TEXT | Description courte |
| html_content | TEXT | Code source HTML avec placeholders `{{...}}` |
| requires_signature | BOOLEAN | Si le document necessite une signature electronique |
| is_active | BOOLEAN | Actif ou desactive |
| created_at | TIMESTAMP | Date de creation |
| updated_at | TIMESTAMP | Derniere modification |

**Endpoints :**
- `GET /api/organizations/{of_id}/document-templates` - Liste des templates (filtrable par `phase`)
- `GET /api/organizations/{of_id}/document-templates/{id}` - Detail d'un template
- `POST /api/organizations/{of_id}/document-templates` - Creer un template (body: type, phase, title, description, html_content, requires_signature)
- `PUT /api/organizations/{of_id}/document-templates/{id}` - Modifier (inclut l'edition du html_content source)
- `DELETE /api/organizations/{of_id}/document-templates/{id}` - Supprimer

### 2.2 `documents` (documents personnalises envoyes)

Trace chaque document envoye a un apprenant apres personnalisation.

| Champ | Type | Description |
|---|---|---|
| id | UUID (PK) | Identifiant unique |
| template_id | UUID (FK -> document_templates) | Template source (nullable si uploaded) |
| of_id | UUID (FK -> organizations) | Organisation emettrice |
| type | ENUM | Meme enum que templates |
| phase | ENUM | Phase de formation |
| title | VARCHAR | Titre du document |
| html_content | TEXT | HTML personnalise avec donnees reelles injectees |
| learner_id | UUID (FK -> users) | Apprenant destinataire |
| learner_name | VARCHAR | Nom complet de l'apprenant |
| learner_email | VARCHAR | Email de l'apprenant |
| formation_id | UUID (FK -> formations) | Formation associee |
| formation_name | VARCHAR | Nom de la formation |
| status | ENUM | `draft`, `sent`, `delivered`, `read`, `signed`, `completed`, `expired` |
| requires_signature | BOOLEAN | Necessite signature |
| sent_at | TIMESTAMP | Date d'envoi |
| read_at | TIMESTAMP | Date de lecture |
| signed_at | TIMESTAMP | Date de signature |
| signature_data | TEXT | Donnees base64 de la signature apprenant |
| unique_code | VARCHAR | Code unique de tracabilite (ex: `CONVENTION-1707123456789`) |
| created_at | TIMESTAMP | Date de creation |
| updated_at | TIMESTAMP | Derniere modification |

**Endpoints :**
- `POST /api/organizations/{of_id}/documents/send` - Envoi groupe de documents (voir flux ci-dessous)
- `GET /api/organizations/{of_id}/documents` - Liste des documents envoyes (filtrable par phase, learner_id, status)
- `GET /api/organizations/{of_id}/documents/{id}` - Detail d'un document
- `PATCH /api/organizations/{of_id}/documents/{id}/status` - Mettre a jour le statut
- `GET /api/learners/{learner_id}/documents` - Documents recus par un apprenant (utilise cote dashboard apprenant)
- `POST /api/learners/{learner_id}/documents/{id}/sign` - Soumettre la signature (body: signature_data base64)

### 2.3 `of_signatures`

Stocke la signature electronique officielle de l'OF.

| Champ | Type | Description |
|---|---|---|
| id | UUID (PK) | Identifiant |
| of_id | UUID (FK -> organizations) | Organisation |
| signature_data | TEXT | Image base64 de la signature |
| created_at | TIMESTAMP | Date de creation |
| updated_at | TIMESTAMP | Derniere modification |

**Endpoints :**
- `GET /api/organizations/{of_id}/signature` - Recuperer la signature OF
- `PUT /api/organizations/{of_id}/signature` - Creer/mettre a jour (body: signature_data)
- `DELETE /api/organizations/{of_id}/signature` - Supprimer

### 2.4 `uploaded_documents`

Documents externes (PDF, DOCX) uploades manuellement par l'admin.

| Champ | Type | Description |
|---|---|---|
| id | UUID (PK) | Identifiant |
| of_id | UUID (FK -> organizations) | Organisation |
| title | VARCHAR | Titre donne par l'admin |
| phase | ENUM | Phase associee |
| file_key | VARCHAR | Cle de stockage blob (S3/MinIO) |
| file_name | VARCHAR | Nom du fichier original |
| file_size | VARCHAR | Taille du fichier |
| mime_type | VARCHAR | Type MIME |
| uploaded_at | TIMESTAMP | Date d'upload |

**Endpoints :**
- `POST /api/organizations/{of_id}/uploaded-documents` - Upload (multipart/form-data: file + title + phase)
- `GET /api/organizations/{of_id}/uploaded-documents` - Liste (filtrable par phase)
- `DELETE /api/organizations/{of_id}/uploaded-documents/{id}` - Supprimer
- `POST /api/organizations/{of_id}/uploaded-documents/{id}/send` - Envoyer a des apprenants (body: learner_ids[])

---

## 3. Flux d'envoi groupe (PhaseDocumentSender)

L'assistant d'envoi cote frontend suit 4 etapes :

```text
Etape 1 : Selection d'un apprenant
Etape 2 : Selection des templates a envoyer (checkboxes, option d'attacher un PDF programme)
Etape 3 : Personnalisation des champs partages (dates debut/fin, duree, prix)
          -> Le champ "Lieu" est exclu de la personnalisation manuelle
Etape 4 : Previsualisation HTML avec tous les champs injectes + signature OF
          -> Envoi final
```

**Payload `POST /api/organizations/{of_id}/documents/send` :**

```text
{
  "learner_id": "uuid",
  "formation_id": "uuid",
  "phase": "inscription" | "formation" | "post-formation" | "suivi",
  "custom_fields": {
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-05",
    "duree": "35 heures",
    "prix": "2 500 EUR"
  },
  "template_ids": ["uuid1", "uuid2", ...],
  "uploaded_document_ids": ["uuid3"],  // optionnel, pour les PDFs attaches
  "include_of_signature": true
}
```

Le backend doit :
1. Recuperer chaque template par son ID
2. Injecter les champs dynamiques dans le html_content (voir section 4)
3. Generer un `unique_code` par document
4. Creer une entree dans `documents` par template avec status = `sent`
5. Enregistrer les uploaded_documents envoyes dans le meme systeme de tracking

---

## 4. Champs dynamiques (placeholders)

Les templates HTML utilisent des placeholders `{{categorie.champ}}`. Le backend doit les remplacer lors de l'envoi :

**Categorie `apprenant` :**
`{{apprenant.prenom}}`, `{{apprenant.nom}}`, `{{apprenant.nom_complet}}`, `{{apprenant.email}}`, `{{apprenant.telephone}}`, `{{apprenant.date_naissance}}`, `{{apprenant.adresse}}`, `{{apprenant.ville}}`, `{{apprenant.code_postal}}`, `{{apprenant.entreprise}}`, `{{apprenant.poste}}`

**Categorie `formation` :**
`{{formation.nom}}`, `{{formation.description}}`, `{{formation.duree}}`, `{{formation.lieu}}`, `{{formation.formateur}}`, `{{formation.prix}}`, `{{formation.certification}}`

**Categorie `dates` :**
`{{dates.inscription}}`, `{{dates.debut}}`, `{{dates.fin}}`, `{{dates.aujourdhui}}`, `{{dates.signature}}`

**Categorie `of` :**
`{{of.nom}}`, `{{of.siret}}`, `{{of.nda}}`, `{{of.adresse}}`, `{{of.ville}}`, `{{of.code_postal}}`, `{{of.telephone}}`, `{{of.email}}`, `{{of.responsable}}`, `{{of.signature}}`

**Categorie `evaluation` :**
`{{evaluation.note_positionnement}}`, `{{evaluation.note_finale}}`, `{{evaluation.progression}}`, `{{evaluation.niveau_acquis}}`, `{{evaluation.commentaire}}`

**Note sur `{{of.signature}}` :** Ce placeholder est remplace par une balise `<img>` contenant la signature base64 de l'OF (depuis `of_signatures`). Si aucune signature n'est configuree, un texte placeholder est insere.

---

## 5. Signature electronique apprenant

Cote apprenant, le flux de signature est :
1. L'apprenant visualise le document HTML personnalise (avec signature OF integree)
2. Il coche "J'ai lu le document" + "J'accepte les conditions"
3. Il signe sur un pad Canvas
4. Le frontend envoie `POST /api/learners/{learner_id}/documents/{id}/sign` avec `signature_data` (base64)
5. Le backend met a jour : `status = signed`, `signed_at = now()`, `signature_data = ...`

---

## 6. Emargements / Audit Qualiopi

La page "Preuve d'emargements" centralise TOUS les documents envoyes (templates + uploaded). C'est la source unique de verite.

**Endpoint requis :**
- `GET /api/organizations/{of_id}/emargements` - Liste de tous les documents envoyes, groupes par apprenant et par phase
  - Filtres : `learner_id`, `phase`, `status`, `date_range`
  - Inclut : horodatage signature, horodatage consentement CGV

**Reponse attendue :**
```text
{
  "learners": [
    {
      "learner_id": "uuid",
      "learner_name": "Marie Dupont",
      "documents": [
        {
          "id": "uuid",
          "type": "convention",
          "phase": "inscription",
          "title": "Convention de formation",
          "status": "signed",
          "sent_at": "...",
          "signed_at": "...",
          "html_content": "...",  // pour previsualisation directe
          "unique_code": "CONVENTION-123..."
        }
      ]
    }
  ]
}
```

---

## 7. Bibliotheque de programmes (PDF)

Les admins OF gerent des programmes de formation en PDF via une page dediee.

**Endpoints :**
- `POST /api/organizations/{of_id}/programmes` - Upload PDF (multipart: file + formation_id + title)
- `GET /api/organizations/{of_id}/programmes` - Liste des programmes uploades
- `DELETE /api/organizations/{of_id}/programmes/{id}` - Supprimer
- `GET /api/organizations/{of_id}/programmes/{id}/download` - URL presignee de telechargement

Ces programmes sont selectionables dans le PhaseDocumentSender comme alternative aux templates HTML.

---

## 8. Securite et RBAC

| Role | Permissions documents |
|---|---|
| SuperAdmin | Lecture/ecriture sur tous les OF, suivi global |
| Admin OF | CRUD templates de son OF, envoi, gestion signature, emargements |
| Apprenant | Lecture de ses documents recus, signature |
| Formateur | Lecture seule des documents de ses formations |

---

## 9. Points d'attention

1. **Donnees mockees a remplacer** : Le frontend utilise actuellement des donnees mockees dans `OFDocumentsAdvanced.tsx` (apprenants, formations, info OF). Ces donnees doivent venir des endpoints API.
2. **`personalizeDocumentContent.ts`** : Ce fichier cote apprenant utilise des valeurs en dur (ex: "InfinitiAX Formation"). Il doit etre remplace par les donnees reelles provenant du document `html_content` deja personnalise par le backend lors de l'envoi.
3. **Signature OF** : Actuellement stockee en localStorage (`of_official_signature`). Doit etre persistee via `PUT /api/organizations/{of_id}/signature` et recuperee via `GET`.
4. **Documents officiels necessitant la signature OF** : `convention`, `cgv`, `attestation`, `certificat`. Le frontend affiche un avertissement si la signature n'est pas configuree lors de l'envoi.

