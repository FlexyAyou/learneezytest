

## Integrer Learneezy comme Organisme de Formation dans la gestion des documents

### Contexte du probleme

Actuellement, le systeme de documents traite Learneezy uniquement comme la "plateforme" qui supervise les OF, mais **pas comme un OF a part entiere** qui peut envoyer des documents a ses propres apprenants. Concretement :

- La page SuperAdmin Documents (`/dashboard/superadmin/documents`) liste uniquement des OF externes (FormaPro, SkillUp, DigiForm) dans le filtre et les mock data
- L'onglet "Gestion par phases" utilise un `mockOF` pointe sur "FormaPro" au lieu de Learneezy
- La personnalisation des documents (`personalizeDocumentContent.ts`) est codee en dur avec "InfinitiAX Formation" au lieu d'utiliser dynamiquement les infos de l'OF emetteur
- Aucun document dans les mock data globaux n'est emis par Learneezy

### Ce qui va changer

---

#### 1. Ajouter Learneezy dans la liste des organismes (SuperAdminDocumentsPage.tsx)

Ajouter une entree "Learneezy" dans `mockOrganismes` avec un identifiant special (ex: `'learneezy'`), et creer un objet `learneezyOF` de type `OF` avec les informations de Learneezy (nom, SIRET, NDA, adresse, etc.).

```text
mockOrganismes :
  - { id: 'learneezy', name: 'Learneezy', ... }  <-- NOUVEAU
  - { id: 'of-1', name: 'FormaPro', ... }
  - { id: 'of-2', name: 'SkillUp Academy', ... }
  - { id: 'of-3', name: 'DigiForm', ... }
```

#### 2. Differencier visuellement Learneezy des autres OF

Dans le filtre par organisme et dans les tableaux de suivi/audit, Learneezy aura un badge distinctif (bleu, avec icone Sparkles) pour le differencier des OF externes. Cela reprend la convention de couleurs existante (bleu = Learneezy, jaune/violet = OF).

#### 3. Adapter l'onglet "Gestion par phases" au contexte

Actuellement l'onglet "Gestion par phases" utilise toujours `mockOF` (FormaPro). La modification fera en sorte que :
- Si le filtre est sur "Learneezy", les infos OF injectees dans le `PhaseDocumentSender` seront celles de Learneezy
- Si le filtre est sur un OF specifique, ce seront les infos de cet OF
- Si le filtre est sur "Tous", Learneezy sera utilise par defaut (le superadmin envoie en tant que Learneezy)

#### 4. Ajouter des documents Learneezy dans les mock data globaux

Ajouter des exemples de documents emis par Learneezy dans `mockGlobalDocuments` pour que les onglets "Suivi global" et "Audit & Conformite" refletent cette realite.

#### 5. Mettre a jour l'audit de conformite

L'onglet Audit inclura Learneezy dans la liste des organismes audites, avec ses propres statistiques de documents envoyes/signes.

---

### Details techniques

#### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/pages/admin/SuperAdminDocumentsPage.tsx` | Ajout de Learneezy dans `mockOrganismes`, creation de `learneezyOF` (type `OF`), ajout de documents Learneezy dans `mockGlobalDocuments`, passage dynamique de l'OF dans `PhaseManagementTab`, badge Learneezy dans les tableaux |

#### Donnees Learneezy (mock)

- **Nom** : Learneezy
- **SIRET** : A definir (valeur placeholder pour le mock)
- **NDA** : A definir (valeur placeholder pour le mock)
- **Adresse** : Paris
- **Email** : contact@learneezy.com
- **Responsable** : Administrateur Learneezy

#### Modifications dans PhaseManagementTab

Le composant `PhaseManagementTab` recevra une nouvelle prop `ofInfo` au lieu d'utiliser un `mockOF` en dur. Le composant parent determinera quel OF utiliser en fonction du filtre selectionne :

```text
selectedOF === 'learneezy' --> learneezyOF
selectedOF === 'of-1'      --> infos de FormaPro
selectedOF === 'all'        --> learneezyOF (contexte par defaut du superadmin)
```

#### Aucune modification sur les composants partages

Les composants `PhaseDocumentSender`, `DocumentTemplateEditor`, `OFDocumentsAdvanced`, et `personalizeDocumentContent.ts` ne sont pas modifies. Ils fonctionnent deja de maniere generique avec un objet `OF` en parametre.

