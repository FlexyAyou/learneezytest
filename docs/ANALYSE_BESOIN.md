# Système d'Analyse de Besoin - Documentation

## 📋 Vue d'ensemble

Le système d'**Analyse de Besoin** permet aux organismes de formation (OF) de créer, personnaliser et envoyer des documents d'analyse de besoin à leurs apprenants avec des champs dynamiques.

## ✨ Fonctionnalités

### 1. **Édition HTML**
- Éditeur de code HTML intégré avec coloration syntaxique
- Template par défaut pré-rempli
- Support complet des balises HTML et CSS inline

### 2. **Champs Dynamiques**
Les variables suivantes sont automatiquement remplacées lors de l'envoi :

#### Informations de l'Organisme de Formation
- `{{of.nom}}` - Nom de l'OF
- `{{of.nda}}` - Numéro de déclaration d'activité
- `{{of.siret}}` - Numéro SIRET
- `{{of.adresse}}` - Adresse
- `{{of.codePostal}}` - Code postal
- `{{of.ville}}` - Ville
- `{{of.telephone}}` - Téléphone
- `{{of.email}}` - Email
- `{{of.responsable}}` - Nom du responsable

#### Informations de l'Apprenant
- `{{apprenant.prenom}}` - Prénom
- `{{apprenant.nom}}` - Nom
- `{{apprenant.entreprise}}` - Entreprise
- `{{apprenant.poste}}` - Poste

#### Informations de Formation
- `{{formation.nom}}` - Nom de la formation
- `{{date.jour}}` - Date du jour (format français)

### 3. **Prévisualisation**
- Aperçu en temps réel du document
- Affichage avec les champs dynamiques remplacés
- Rendu HTML fidèle au résultat final

### 4. **Envoi Multi-Apprenants**
- Sélection individuelle ou en masse des apprenants
- Message personnalisé optionnel
- Upload automatique vers le système de stockage
- Attribution automatique à la phase "Inscription"

## 🎯 Workflow d'utilisation

### Étape 1 : Édition
1. Cliquer sur le bouton **"Analyse de Besoin"** dans le dashboard OF
2. Modifier le template HTML dans l'éditeur
3. Utiliser les variables dynamiques (ex: `{{apprenant.nom}}`)
4. Cliquer sur **"Prévisualiser"**

### Étape 2 : Prévisualisation
1. Vérifier le rendu du document
2. Les champs dynamiques sont remplacés par des exemples
3. Retourner à l'édition si nécessaire ou passer à l'envoi

### Étape 3 : Envoi
1. Sélectionner les apprenants destinataires
2. (Optionnel) Ajouter un message personnalisé
3. Cliquer sur **"Envoyer"**
4. Le document est uploadé et assigné automatiquement

## 🔧 Architecture Technique

### Frontend
```
AnalyseBesoinSender.tsx
├── État : activeStep ('edit' | 'preview' | 'send')
├── Hooks :
│   ├── useOFUsers() - Liste des apprenants
│   ├── usePrepareUpload() - Préparation upload
│   ├── useCompleteUpload() - Finalisation upload
│   └── useAssignMedia() - Assignment aux apprenants
└── Fonctions :
    ├── replaceDynamicFields() - Remplacement variables
    └── handleSendDocument() - Logique d'envoi
```

### Backend
- **Endpoint d'upload** : `/api/storage/prepare-upload`
- **Endpoint d'assignment** : `/api/storage/assign`
- **Phase** : `inscription` (automatique)
- **Type de fichier** : `text/html`

## 📝 Template par défaut

Le template par défaut inclut :
- En-tête avec informations OF
- Informations apprenant
- Section "Contexte professionnel"
- Section "Objectifs de la formation"
- Section "Compétences actuelles" (avec cases à cocher)
- Section "Attentes spécifiques"
- Zone de signature

## 🚀 Prochaines étapes

### À implémenter
1. **Signature électronique** - Permettre aux apprenants de signer le document
2. **Historique des versions** - Garder trace des modifications
3. **Templates multiples** - Créer plusieurs modèles d'analyse
4. **Export PDF** - Générer un PDF à partir du HTML
5. **Rappels automatiques** - Notifier les apprenants n'ayant pas complété le document

### Améliorations possibles
- Éditeur WYSIWYG (What You See Is What You Get)
- Bibliothèque de blocs réutilisables
- Validation des champs obligatoires
- Statistiques de complétion
- Intégration avec les autres phases de formation

## 🐛 Notes de débogage

### Erreurs communes
1. **Variables non remplacées** : Vérifier l'orthographe exacte (sensible à la casse)
2. **Upload échoue** : Vérifier les permissions OF et la taille du fichier
3. **Apprenants non listés** : Vérifier le rôle utilisateur (doit être 'student', 'apprenant', 'stagiaire' ou 'eleve')

### Logs utiles
- Console navigateur : Erreurs d'upload et d'assignment
- Network tab : Requêtes API et réponses
- Backend logs : Erreurs de stockage MinIO

## 📚 Références

- Template HTML : `defaultTemplates.ts` (ligne 378-422)
- Composant principal : `AnalyseBesoinSender.tsx`
- Intégration : `OFDocumentsAdvanced.tsx`
- Types : `types.ts`
