

# Restriction de l'inscription publique pour les apprenants OF

## Contexte

Actuellement, la page d'inscription publique (`/inscription`) permet a n'importe qui de creer un compte "Apprenant" sur Learneezy. Or, les apprenants rattaches a un OF ne doivent **jamais** pouvoir s'inscrire eux-memes : ils sont exclusivement crees par l'administrateur de l'OF depuis le dashboard OF.

## Ce qui doit changer

### 1. Page d'inscription publique (`/inscription`)
- Ajouter une note informative sous le choix "Profil Apprenant" expliquant que ce compte est pour les apprenants Learneezy independants uniquement.
- Ajouter un bandeau/alerte visible : *"Si votre organisme de formation utilise Learneezy, c'est votre OF qui vous creera un compte. Contactez votre organisme."*

### 2. Blocage sur les sous-domaines OF
- Sur un sous-domaine OF (ex: `mon-of.learneezy.com`), la route `/inscription` doit etre **bloquee/redirigee**. Le `SubdomainRouter` redirigera vers `/connexion-of` si un utilisateur tente d'acceder a `/inscription` depuis un sous-domaine OF.
- La page de login OF (`/connexion-of`) ne doit **pas** afficher de lien "Creer un compte".

### 3. Page login OF (`/connexion-of`)
- Verifier et supprimer tout lien vers `/inscription` present sur cette page.
- Ajouter un texte : *"Votre compte est cree par votre organisme de formation. Contactez-le si vous n'avez pas encore vos identifiants."*

### 4. Page d'inscription publique (`/inscription-formation` / PublicInscription)
- Cette page est un formulaire d'inscription a une formation (pas de creation de compte). Elle reste inchangee.

---

## Details techniques

### Fichiers a modifier

| Fichier | Modification |
|---|---|
| `src/components/common/SubdomainRouter.tsx` | Ajouter `/inscription` a la liste des routes bloquees en contexte OF (redirection vers `/connexion-of`) |
| `src/pages/Register.tsx` | Ajouter un message informatif sous le profil "Apprenant" expliquant que les apprenants OF sont crees par leur organisme |
| `src/pages/LoginOF.tsx` | Supprimer tout lien vers `/inscription` et ajouter un message indiquant que le compte est cree par l'OF |

### Logique dans SubdomainRouter
```text
Routes publiques autorisees sur sous-domaine OF :
  - /connexion-of
  - / (page d'accueil)

Routes bloquees (redirection vers /connexion-of) :
  - /inscription  (NOUVEAU)
  - /connexion (deja gere)
  - Toute autre route non-dashboard
```

### Message dans Register.tsx (profil Apprenant)
Ajout d'une alerte informative sous le selecteur de profil quand "Apprenant" est selectionne :
> "Ce compte est pour les apprenants independants Learneezy. Si vous etes rattache a un organisme de formation, c'est votre OF qui creera votre compte."

