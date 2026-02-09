

## Nouvelle page "Documents" pour le Super Admin

### Objectif
Creer une page complete de gestion des documents sur `/dashboard/superadmin/documents` qui reprend toute la logique existante de `/dashboard/organisme-formation/documents` (phases, editeur de templates, envoi) et y ajoute des fonctionnalites specifiques au role de Super Admin.

---

### Ce qui sera repris de l'OF

- Navigation par phases (Inscription, Formation, Post-formation, +3 mois)
- Editeur de templates HTML avec champs dynamiques (`DocumentTemplateEditor`)
- Systeme d'envoi de documents par phase (`PhaseDocumentSender`)
- Tous les templates par defaut existants (CGV, Programme, Convention, Convocation, Attestation, Certificat, Emargement)
- Previsualisation des documents avec personnalisation

---

### Fonctionnalites supplementaires pour le Super Admin

1. **Vue multi-organismes** : filtre par organisme de formation pour voir/gerer les documents de chaque OF
2. **Statistiques globales** : nombre total de documents envoyes, signes, en attente, taux de signature - pour tous les OF de la plateforme
3. **Onglet "Audit & Conformite"** : vue consolidee de tous les documents avec statut, dates, preuves de signature - utile pour le suivi reglementaire
4. **Onglet "Templates globaux"** : possibilite de creer des templates "plateforme" que tous les OF peuvent utiliser (templates Learneezy)
5. **Historique des envois global** : vue de tous les envois de documents de tous les OF avec filtrage avance (par OF, par apprenant, par type, par statut)
6. **Export en masse** : bouton pour exporter un rapport CSV/Excel de tous les documents et leur statut

---

### Plan technique

#### 1. Nouveau composant `SuperAdminDocumentsPage.tsx`
- Fichier : `src/pages/admin/SuperAdminDocumentsPage.tsx`
- Structure en onglets principaux :
  - **Gestion par phases** : reutilise exactement la meme logique que `OFDocumentsAdvanced` (phases, templates, envoi)
  - **Templates globaux** : templates crees par le super admin, disponibles pour tous les OF
  - **Suivi global** : tableau de tous les documents envoyes par tous les OF avec filtres avances
  - **Audit & Conformite** : statistiques, taux de signature, alertes de conformite
- Filtre par organisme en haut de la page (dropdown avec liste des OF)
- Cartes de statistiques globales (documents envoyes, signes, en attente, taux de signature)

#### 2. Mise a jour du routing (`AdminDashboard.tsx`)
- Ajout d'une route `documents` pointant vers `SuperAdminDocumentsPage`
- Import du nouveau composant

#### 3. Mise a jour de la sidebar (`SuperAdminSidebar.tsx`)
- Ajout d'un item "Documents" dans la section "Gestion" avec l'icone `FileText`
- Placement apres "Inscriptions" pour une navigation logique

#### 4. Reutilisation des composants existants
- `DocumentTemplateEditor` : editeur de templates HTML (reutilise tel quel)
- `PhaseDocumentSender` : envoi de documents par phase (reutilise tel quel)
- `DEFAULT_TEMPLATES` : templates par defaut (reutilises tels quels)
- `types.ts` : types et configuration des phases (reutilises tels quels)

---

### Structure de l'interface

```text
+---------------------------------------------------+
| Documents - Super Administration                   |
| [Filtre par organisme: Tous les OF v]              |
+---------------------------------------------------+
| Stats: Envoyes | Signes | En attente | Taux sign. |
+---------------------------------------------------+
| [Gestion phases] [Templates] [Suivi] [Audit]       |
+---------------------------------------------------+
|                                                     |
|  Onglet "Gestion par phases" :                     |
|  - Meme interface que l'OF                         |
|  - 4 phases avec templates et envoi                |
|                                                     |
|  Onglet "Templates globaux" :                      |
|  - Templates crees par le Super Admin              |
|  - Marquage "Template Learneezy"                   |
|  - Bouton creer / modifier / supprimer             |
|                                                     |
|  Onglet "Suivi global" :                           |
|  - Tableau de tous les envois de tous les OF       |
|  - Filtres: OF, type, statut, date, apprenant      |
|                                                     |
|  Onglet "Audit & Conformite" :                     |
|  - Alertes de documents manquants                  |
|  - Taux de conformite par OF                       |
|  - Export rapport                                  |
+---------------------------------------------------+
```

---

### Fichiers modifies

| Fichier | Action |
|---------|--------|
| `src/pages/admin/SuperAdminDocumentsPage.tsx` | Creation |
| `src/pages/AdminDashboard.tsx` | Ajout route `/documents` |
| `src/components/admin/SuperAdminSidebar.tsx` | Ajout item "Documents" |

### Fichiers non modifies

Tous les composants existants (`OFDocumentsAdvanced`, `DocumentTemplateEditor`, `PhaseDocumentSender`, `defaultTemplates.ts`, `types.ts`) restent intacts - ils sont uniquement reutilises/importes.

