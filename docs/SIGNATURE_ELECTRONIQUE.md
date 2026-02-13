# Système de Signature Électronique - Documentation Complète

## 📋 Vue d'ensemble

Le système de **signature électronique** permet aux apprenants de signer numériquement les documents envoyés par leur organisme de formation (OF). Les signatures sont enregistrées avec traçabilité complète (IP, date, métadonnées) et sont visibles par l'OF dans la section "Gestion des Émargements".

## ✨ Fonctionnalités

### 1. **Pour l'Apprenant**
- ✅ Visualisation de tous les documents assignés
- ✅ Distinction entre documents signés et en attente
- ✅ Signature électronique avec canvas tactile/souris
- ✅ Prévisualisation des documents HTML
- ✅ Historique des signatures avec dates

### 2. **Pour l'Organisme de Formation**
- ✅ Envoi de documents aux apprenants (via Analyse de Besoin)
- ✅ Visualisation des documents signés par apprenant
- ✅ Affichage de la signature électronique
- ✅ Traçabilité complète (IP, date, métadonnées)
- ✅ Export/impression des documents signés
- ✅ Preuves pour audits (CGV, consentement)

## 🏗️ Architecture

### Backend (Python/FastAPI)

#### **1. Modèle de données** (`app/media/models.py`)
```python
class UserMediaAssignment(Base):
    # ... champs existants ...
    
    # Signature électronique
    is_signed = Column(Boolean, default=False)
    signed_at = Column(DateTime, nullable=True)
    signature_data = Column(Text, nullable=True)  # Base64 de la signature
    signature_ip = Column(String, nullable=True)  # IP de signature
    signature_metadata = Column(JSONB, nullable=True)  # Métadonnées
```

#### **2. Migration Alembic** (`alembic/versions/aa11bb22cc33_*.py`)
- Ajout des 5 nouveaux champs à la table `user_media_assignments`
- Migration réversible avec `upgrade()` et `downgrade()`
- Vérification de l'existence des colonnes avant ajout

#### **3. Endpoint API** (`app/media/routes.py`)

**POST `/api/storage/assignments/{assignment_id}/sign`**
- **Authentification** : Token JWT requis
- **Autorisation** : Seul l'apprenant assigné peut signer
- **Payload** :
  ```json
  {
    "signature_data": "data:image/png;base64,iVBORw0KG..."
  }
  ```
- **Réponse** :
  ```json
  {
    "success": true,
    "assignment_id": 123,
    "signed_at": "2026-02-13T11:20:00",
    "message": "Document signed successfully"
  }
  ```
- **Traçabilité** :
  - IP du client enregistrée
  - User-Agent enregistré
  - Date ISO enregistrée

#### **4. Schéma de réponse** (`app/media/schemas.py`)
```python
class UserMediaAssignmentResponse(BaseModel):
    # ... champs existants ...
    is_signed: bool = False
    signed_at: Optional[datetime] = None
    signature_data: Optional[str] = None
    signature_ip: Optional[str] = None
    signature_metadata: Optional[dict] = None
```

### Frontend (React/TypeScript)

#### **1. Composant Signature Canvas** (`SignatureCanvas.tsx`)
- Canvas HTML5 pour dessiner la signature
- Support tactile (mobile) et souris (desktop)
- Boutons : Effacer, Annuler, Valider
- Export en base64 PNG
- Validation (empêche signature vide)

**Fonctionnalités** :
```typescript
- startDrawing() : Commence le dessin
- draw() : Dessine pendant le mouvement
- stopDrawing() : Arrête le dessin
- clearCanvas() : Efface la signature
- saveSignature() : Convertit en base64 et appelle onSave()
```

#### **2. Page Apprenant** (`StudentDocumentsPage.tsx`)
- Liste des documents en attente de signature
- Liste des documents déjà signés
- Boutons "Voir" et "Signer"
- Dialog de signature avec SignatureCanvas
- Dialog de prévisualisation avec iframe HTML
- Affichage de la signature pour les docs signés

**Structure** :
```
┌─────────────────────────────────────┐
│ Documents en attente (Orange)       │
│ ├─ Document 1 [Voir] [Signer]       │
│ └─ Document 2 [Voir] [Signer]       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Documents signés (Vert)             │
│ ├─ Document 3 [Voir]                │
│ └─ Document 4 [Voir]                │
└─────────────────────────────────────┘
```

#### **3. API Client** (`fastapi-client.ts`)
```typescript
async signDocument(assignmentId: number, signatureData: string): Promise<any> {
  return this.post(`/api/storage/assignments/${assignmentId}/sign`, {
    signature_data: signatureData
  });
}
```

#### **4. Hook React** (`useApi.ts`)
```typescript
export const useSignDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { assignment_id: number; signature_data: string }) =>
      fastAPIClient.signDocument(data.assignment_id, data.signature_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      toast({ title: "Document signé", ... });
    }
  });
};
```

## 🔄 Workflow Complet

### Étape 1 : L'OF envoie un document
1. OF va dans **Documents** → **Analyse de Besoin**
2. Édite le template HTML avec variables dynamiques
3. Prévisualise le rendu
4. Sélectionne les apprenants destinataires
5. Clique sur **Envoyer**

**Backend** :
- Upload du HTML vers MinIO
- Création de `UserMediaAssignment` pour chaque apprenant
- `is_signed = False` par défaut

### Étape 2 : L'apprenant reçoit le document
1. Apprenant se connecte
2. Va dans **Mes Documents**
3. Voit le document dans "Documents en attente"
4. Clique sur **Voir** pour prévisualiser
5. Clique sur **Signer**

### Étape 3 : Signature électronique
1. Dialog s'ouvre avec SignatureCanvas
2. Apprenant dessine sa signature
3. Clique sur **Valider la signature**

**Backend** :
- Reçoit la signature en base64
- Vérifie que l'apprenant est autorisé
- Vérifie que le document n'est pas déjà signé
- Enregistre :
  - `is_signed = True`
  - `signed_at = datetime.utcnow()`
  - `signature_data = base64_string`
  - `signature_ip = client_ip`
  - `signature_metadata = { user_agent, signed_at_iso }`

### Étape 4 : L'OF consulte les signatures
1. OF va dans **Gestion des Émargements**
2. Sélectionne un apprenant
3. Voit tous ses documents avec statuts
4. Clique sur **Voir** pour un document signé
5. Voit :
   - Le contenu HTML du document
   - La signature électronique
   - Les métadonnées (date, IP)
   - Les preuves de consentement

## 📊 Données de Traçabilité

Pour chaque signature, le système enregistre :

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `is_signed` | Boolean | Document signé ou non | `true` |
| `signed_at` | DateTime | Date/heure de signature | `2026-02-13 11:20:00` |
| `signature_data` | Text | Image base64 de la signature | `data:image/png;base64,...` |
| `signature_ip` | String | Adresse IP du signataire | `192.168.1.100` |
| `signature_metadata` | JSONB | Métadonnées additionnelles | `{"user_agent": "Mozilla/5.0...", "signed_at_iso": "2026-02-13T11:20:00"}` |

## 🔒 Sécurité

### Authentification
- ✅ Token JWT requis pour toutes les opérations
- ✅ Vérification de l'identité de l'apprenant

### Autorisation
- ✅ Seul l'apprenant assigné peut signer son document
- ✅ Impossible de signer un document déjà signé
- ✅ L'OF ne peut que consulter, pas modifier les signatures

### Traçabilité
- ✅ IP enregistrée pour chaque signature
- ✅ User-Agent enregistré
- ✅ Horodatage précis (UTC)
- ✅ Données immuables une fois signées

### Conformité RGPD
- ✅ Consentement explicite de l'apprenant
- ✅ Données personnelles minimales
- ✅ Traçabilité pour audits
- ✅ Possibilité d'export des données

## 🎯 Cas d'usage

### 1. Analyse de Besoin
```
OF → Envoie analyse_besoin.html
Apprenant → Signe le document
OF → Voit la signature dans Émargements
```

### 2. Convention de Formation
```
OF → Envoie convention.html
Apprenant → Signe la convention
OF → Télécharge le PDF signé pour dossier
```

### 3. Attestation de Présence
```
OF → Envoie attestation_presence.html
Apprenant → Signe l'attestation
OF → Conserve pour audit Qualiopi
```

## 🚀 Prochaines Étapes

### Améliorations Suggérées

1. **Export PDF**
   - Générer un PDF à partir du HTML + signature
   - Ajouter un cachet "Document signé électroniquement"
   - Inclure les métadonnées de traçabilité

2. **Notifications**
   - Email à l'apprenant quand un document est assigné
   - Email à l'OF quand un document est signé
   - Rappels automatiques pour documents non signés

3. **Signature OF**
   - Permettre à l'OF de signer aussi certains documents
   - Double signature (OF + Apprenant)
   - Ordre de signature configurable

4. **Horodatage Qualifié**
   - Intégration avec un tiers de confiance
   - Certificat d'horodatage
   - Valeur légale renforcée

5. **Templates Avancés**
   - Éditeur WYSIWYG pour les templates
   - Bibliothèque de blocs réutilisables
   - Aperçu multi-apprenants

6. **Analytics**
   - Taux de signature par document
   - Temps moyen de signature
   - Documents les plus signés
   - Rappels intelligents

## 🐛 Débogage

### Problèmes Courants

**1. Signature non enregistrée**
- Vérifier que l'assignment_id est correct
- Vérifier que l'apprenant est authentifié
- Vérifier les logs backend pour les erreurs

**2. Canvas ne fonctionne pas**
- Vérifier que le navigateur supporte Canvas HTML5
- Vérifier les événements tactiles sur mobile
- Tester avec souris ET tactile

**3. Documents non visibles**
- Vérifier que `useMyDocuments()` retourne des données
- Vérifier le token JWT
- Vérifier les filtres de phase

### Logs Utiles

**Backend** :
```bash
# Logs de signature
grep "sign_document" /var/log/fastapi.log

# Erreurs d'autorisation
grep "not authorized" /var/log/fastapi.log
```

**Frontend** :
```javascript
// Console navigateur
console.log('Documents:', documents);
console.log('Signature data:', signatureData);
```

## 📚 Références

- **Backend** :
  - `app/media/models.py` - Modèles de données
  - `app/media/routes.py` - Endpoints API
  - `app/media/schemas.py` - Schémas Pydantic
  - `alembic/versions/aa11bb22cc33_*.py` - Migration

- **Frontend** :
  - `src/components/signature/SignatureCanvas.tsx` - Composant signature
  - `src/pages/student/StudentDocumentsPage.tsx` - Page apprenant
  - `src/pages/admin/OFEmargementPage.tsx` - Page OF
  - `src/services/fastapi-client.ts` - Client API
  - `src/hooks/useApi.ts` - Hooks React Query

## 📝 Notes Importantes

1. **Migration Base de Données** : Exécuter la migration Alembic avant de déployer
   ```bash
   alembic upgrade head
   ```

2. **Format Signature** : Toujours en base64 PNG pour compatibilité maximale

3. **Taille Limite** : La signature base64 peut être volumineuse (~50KB), vérifier les limites de la BDD

4. **Timezone** : Toutes les dates sont en UTC, conversion en local côté frontend

5. **Performance** : Indexer `is_signed` et `signed_at` si volume important

---

**Système opérationnel et prêt pour la production ! 🎉**
