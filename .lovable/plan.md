
# Rendre les champs dynamiques operationnels pour les documents de la phase inscription

## Probleme identifie

Quand l'OF envoie un document (convention, test de positionnement, etc.) via le `PhaseDocumentSender`, le code fait deux choses contradictoires :

1. **Cote frontend** : le `PhaseDocumentSender` personnalise correctement le HTML (remplace `{{of.nom}}`, `{{apprenant.prenom}}`, etc.) dans la variable `docs[].htmlContent`
2. **Cote envoi** : le `handleSendPhaseDocuments` dans `OFDocumentsAdvanced.tsx` **ignore completement** ce HTML personnalise et envoie seulement les `template_ids` au backend

```text
PhaseDocumentSender                    OFDocumentsAdvanced
+---------------------------+          +---------------------------+
| personalizeContent()      |          | handleSendPhaseDocuments() |
| -> docs[].htmlContent OK  |  ---->>  | -> envoie template_ids    |
|    (champs remplaces)     |          |    htmlContent IGNORE !   |
+---------------------------+          +---------------------------+
```

Le backend recoit donc des IDs de templates et doit faire sa propre personnalisation. Si le backend ne le fait pas (ou pas correctement), les champs dynamiques restent sous forme `{{of.nom}}`.

## Solution

Modifier `handleSendPhaseDocuments` pour envoyer le contenu HTML personnalise (`htmlContent`) en plus des `template_ids`, afin que le backend stocke directement le HTML final avec les donnees remplacees.

### Modification 1 : `OFDocumentsAdvanced.tsx`

Dans `handleSendPhaseDocuments`, inclure le HTML personnalise dans le payload envoye au backend :

- Construire un tableau `documents` contenant pour chaque doc : le `template_id`, le `type`, le `title`, et le `html_content` deja personnalise
- Envoyer ce tableau au backend pour que le HTML final soit stocke directement dans l'assignment

### Modification 2 : `fastapi-client.ts`

Mettre a jour l'appel `sendDocuments` pour accepter un payload qui inclut les contenus HTML personnalises dans le champ `documents`.

### Modification 3 : Verification cote apprenant

Dans `StudentInteractiveDocumentModal`, quand le document arrive avec `html_content` deja personnalise (les `{{...}}` sont deja remplaces), la re-personnalisation ne doit pas casser le contenu. Le code actuel est deja compatible car `personalizeDocumentContent` ne remplace que les `{{...}}` qu'il trouve -- s'ils sont deja remplaces, il ne fait rien. Aucune modification necessaire.

## Details techniques

### Payload modifie pour l'API

```text
POST /api/organizations/{of_id}/documents/send

{
  "learner_id": 42,
  "phase": "inscription",
  "template_ids": ["tpl-1", "tpl-2"],
  "documents": [
    {
      "template_id": "tpl-1",
      "type": "convention",
      "title": "Convention de formation",
      "html_content": "<div>...HTML personnalise...</div>"
    },
    {
      "template_id": "tpl-2",
      "type": "test_positionnement",
      "title": "Test de positionnement",
      "html_content": "<div>...HTML personnalise...</div>"
    }
  ],
  "custom_fields": { ... },
  "include_of_signature": true
}
```

Le backend devra prioriser `html_content` s'il est present dans chaque document, sinon faire la personnalisation cote serveur avec le `template_id` comme fallback.

### Impact cote backend

Le backend doit etre mis a jour pour :
- Accepter le champ optionnel `documents` dans le payload
- Stocker le `html_content` fourni directement dans l'assignment au lieu de re-generer depuis le template
- Si `html_content` n'est pas fourni, garder le comportement actuel (personnalisation cote serveur)

### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/components/admin/documents/OFDocumentsAdvanced.tsx` | Envoyer `docs` avec leur `htmlContent` au backend |
| `src/services/fastapi-client.ts` | Adapter le type du payload si necessaire |
