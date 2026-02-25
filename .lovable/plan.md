

# Preuve d'identite avant signature electronique

## Probleme

Actuellement, un apprenant peut signer un document sans aucune verification d'identite supplementaire. Il n'y a aucune preuve formelle que c'est bien l'apprenant connecte qui a effectue la signature.

## Solution proposee : Verification d'identite en 3 couches

Avant chaque signature, l'apprenant devra passer par une etape de verification qui collecte des preuves irrefutables :

### 1. Re-saisie du mot de passe

L'apprenant doit confirmer son mot de passe avant de pouvoir signer. Cela prouve que la personne qui signe connait les identifiants du compte.

### 2. Acceptation d'une declaration sur l'honneur

Un texte juridique que l'apprenant doit cocher :
> "Je certifie etre [Prenom Nom] et j'atteste sur l'honneur que cette signature est la mienne."

### 3. Collecte automatique de metadonnees de preuve

Le systeme enregistre automatiquement :
- Adresse IP
- Date/heure precise (UTC)
- User-Agent du navigateur
- Empreinte unique de session (fingerprint leger)

Ces donnees sont envoyees au backend avec la signature et stockees dans `signature_metadata`.

## Flux utilisateur

```text
[Clic "Signer"] 
     |
     v
+-------------------------------+
|  Etape verification identite  |
|                               |
|  Mot de passe : [________]   |
|                               |
|  [x] Je certifie etre         |
|      Jean Dupont et j'atteste |
|      sur l'honneur que cette  |
|      signature est la mienne  |
|                               |
|  [Annuler]  [Continuer]      |
+-------------------------------+
     |
     v
[DocumentSignerViewer s'ouvre]
     |
     v
[Signature + envoi avec metadonnees]
```

## Details techniques

### Nouveau composant : `IdentityVerificationModal`
- **Fichier** : `src/components/student/documents/IdentityVerificationModal.tsx`
- Champs : mot de passe (Input type password), checkbox declaration sur l'honneur
- Appel `fastAPIClient.login()` ou un endpoint dedie pour verifier le mot de passe
- Collecte IP via `https://api.ipify.org?format=json` et `navigator.userAgent`
- Retourne un objet `IdentityProof` en cas de succes

### Modifications des composants de signature
- **`StudentPhaseInscription.tsx`**, **`StudentPhaseFormation.tsx`**, **`StudentPhasePostFormation.tsx`**, **`StudentPhaseSuivi.tsx`**, **`StudentAssignedDocuments.tsx`** : Avant d'ouvrir le viewer/modal de signature, ouvrir d'abord `IdentityVerificationModal`. La signature ne s'ouvre que si la verification reussit.

### Enrichissement des donnees envoyees au backend
- Le hook `useSignDocumentFields` et `useSignDocument` seront enrichis pour transmettre les metadonnees de preuve (`ip`, `user_agent`, `identity_verified_at`, `honor_declaration`) dans le payload envoye au backend.
- Ces donnees seront stockees dans le champ `signature_metadata` (JSONB) deja existant cote backend.

### Affichage cote OF (Emargements)
- Sur la page emargements, quand l'OF consulte un document signe, afficher un encart "Preuve d'identite" avec : IP, date de verification, declaration sur l'honneur confirmee, user-agent.

