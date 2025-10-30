
# Documentation LearnEezy - Plateforme LMS Complète

## Table des matières

1. [Résumé global de la plateforme](#résumé-global)
2. [Architecture technique](#architecture-technique)
3. [Guide développeur](#guide-développeur)
4. [Documentation fonctionnelle](#documentation-fonctionnelle)
5. [Structure des fichiers et dossiers](#structure-fichiers)
6. [Guide de maintenance et évolution](#maintenance-évolution)
7. [FAQ](#faq)

---

## Résumé global de la plateforme {#résumé-global}

### Objectifs

LearnEezy est une plateforme LMS (Learning Management System) moderne et complète conçue pour faciliter l'apprentissage en ligne. Elle vise à :

- **Démocratiser l'accès à la formation** : Offrir une plateforme intuitive accessible à tous
- **Optimiser l'expérience d'apprentissage** : Interface moderne et fonctionnalités avancées
- **Faciliter la gestion administrative** : Outils complets pour les organismes de formation
- **Favoriser l'engagement** : Gamification, suivi personnalisé, interactions sociales

### Types d'utilisateurs

1. **Étudiants/Apprenants** : Accès aux cours, suivi de progression, certificats
2. **Formateurs internes** : Création de contenu, animation de sessions
3. **Formateurs externes** : Prestation de services, gestion des réservations
4. **Managers/Tuteurs** : Supervision des équipes, rapports de progression
5. **Administrateurs** : Gestion globale de la plateforme
6. **Organismes de formation** : Gestion complète des formations et apprenants
7. **Parents** : Suivi de la progression de leurs enfants (pour formations enfants)

### Cas d'usage principaux

- **Formation professionnelle** : Upskilling, reskilling, formations métiers
- **Enseignement académique** : Cours universitaires, formations certifiantes
- **Formation d'entreprise** : Onboarding, formations internes, compliance
- **Apprentissage individuel** : Auto-formation, développement personnel

---

## Architecture technique {#architecture-technique}

### Vue d'ensemble

LearnEezy suit une architecture moderne avec séparation des responsabilités :

```
Frontend (React + TypeScript) ↔ APIs ↔ Backend (Supabase) ↔ Base de données (PostgreSQL)
```

### Frontend

**Technologies principales :**
- **React 18** : Framework principal avec hooks
- **TypeScript** : Typage statique pour la robustesse
- **Vite** : Build tool moderne et rapide
- **React Router** : Routing côté client
- **Tailwind CSS** : Framework CSS utilitaire
- **shadcn/ui** : Composants UI modernes
- **Tanstack Query** : Gestion d'état et cache des données

**Fonctionnalités frontend :**
- Interface responsive (mobile-first)
- Thème clair/sombre (actuellement limité au clair)
- Composants réutilisables
- Gestion d'état locale et globale
- Authentification côté client

### Backend

**Supabase** comme Backend-as-a-Service :
- **Base de données PostgreSQL** : Stockage des données
- **Authentification** : Gestion des utilisateurs et sessions
- **Row Level Security (RLS)** : Sécurité granulaire
- **Edge Functions** : Logique métier personnalisée
- **Storage** : Gestion des fichiers et médias
- **Real-time** : Mises à jour en temps réel

### Base de données

**Tables principales :**
- `profiles` : Profils utilisateurs étendus
- `organisations_formation` : Organismes de formation
- `inscriptions` : Inscriptions aux formations
- `emargements` : Feuilles de présence électroniques
- `evaluations` : Évaluations et tests
- `documents_of` : Documents administratifs
- `subscription_plans` : Plans d'abonnement
- `subscriptions` : Abonnements actifs
- `automatic_mailings` : Emails automatiques

**Sécurité :**
- Row Level Security (RLS) activée
- Politiques de sécurité par rôle utilisateur
- Authentification JWT via Supabase Auth

### APIs et intégrations

**APIs internes :**
- API REST via Supabase
- GraphQL via Supabase (optionnel)
- Webhooks pour événements

**Intégrations externes prévues :**
- Stripe : Paiements
- SendGrid/Mailgun : Emails transactionnels
- Zoom/Teams : Visioconférence
- Calendly : Réservations
- SIRH : Synchronisation RH

---

## Guide développeur {#guide-développeur}

### Prérequis

- **Node.js** : Version 18+ recommandée
- **npm** ou **yarn** : Gestionnaire de paquets
- **Git** : Contrôle de version
- **Compte Supabase** : Pour le backend

### Installation locale

```bash
# 1. Cloner le projet
git clone <URL_DU_REPO>
cd learnezy

# 2. Installer les dépendances
npm install

# 3. Configuration environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 4. Lancer en développement
npm run dev
```

### Variables d'environnement

```env
VITE_SUPABASE_URL=https://kgpesysiqpjuxccbowho.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Aperçu build
npm run lint         # Linting
npm run type-check   # Vérification TypeScript
```

### Structure de développement

**Conventions de code :**
- **TypeScript strict** : Typage obligatoire
- **ESLint + Prettier** : Formatage automatique
- **Hooks patterns** : useQuery, useState, useEffect
- **Composants fonctionnels** : Pas de classes React

**Git workflow :**
```bash
# Création feature
git checkout -b feature/nom-feature
git commit -m "feat: description"
git push origin feature/nom-feature
# Pull Request → Review → Merge
```

### Déploiement

**Via Lovable (recommandé) :**
1. Connexion GitHub automatique
2. Déploiement via interface Lovable
3. Domain personnalisé disponible

**Déploiement manuel :**
```bash
# Build
npm run build

# Déployment sur Vercel/Netlify
vercel --prod
# ou
netlify deploy --prod
```

---

## Documentation fonctionnelle {#documentation-fonctionnelle}

### Gestion des utilisateurs

**Profils et rôles :**
- Système de rôles hiérarchique
- Profils personnalisables par rôle
- Gestion des permissions granulaires

**Authentification :**
- Inscription/Connexion sécurisée
- Réinitialisation de mot de passe
- Sessions persistantes

### Gestion des formations

**Création de cours :**
- Éditeur de contenu riche
- Modules et chapitres
- Ressources multimédias
- Évaluations intégrées

**Inscription et suivi :**
- Inscription individuelle/groupe
- Suivi de progression temps réel
- Émargement électronique
- Certificats automatiques

### Système d'abonnements

**Plans flexibles :**
- Pack Starter (100 crédits - 3 mois)
- Pack Growth (300 crédits - 6 mois) - Populaire
- Pack Premium (500 crédits - 12 mois)
- Pack Enterprise (1000 crédits - 12 mois)

**Gestion administrative :**
- Tableau de bord métriques
- Notifications automatiques
- Gestion des paiements
- Rapports détaillés

### Communications

**Messagerie intégrée :**
- Chat individuel/groupe
- Notifications temps réel
- Historique des conversations

**Emails automatiques :**
- Notifications d'inscription
- Rappels de formation
- Certificats par email

### Outils pédagogiques

**Évaluations :**
- QCM/Questions ouvertes
- Évaluations automatisées
- Feedback personnalisé
- Statistiques de performance

**Ressources :**
- Bibliothèque de documents
- Téléchargements sécurisés
- Versioning des contenus

---

## Structure des fichiers et dossiers {#structure-fichiers}

```
learnezy/
├── public/                          # Assets statiques
│   ├── favicon.ico                  # Icône du site
│   └── lovable-uploads/            # Images uploadées
├── src/
│   ├── components/                  # Composants React
│   │   ├── admin/                   # Composants admin
│   │   │   ├── AdminSubscriptions.tsx
│   │   │   ├── subscriptions/       # Modules abonnements
│   │   │   └── ...
│   │   ├── common/                  # Composants partagés
│   │   ├── student/                 # Composants étudiant
│   │   ├── ui/                      # Composants UI de base
│   │   └── ...
│   ├── contexts/                    # Contextes React
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/                       # Hooks personnalisés
│   │   ├── useApi.ts               # Hook API principal
│   │   ├── useAuthForm.ts          # Gestion formulaires auth
│   │   └── use-toast.ts            # Notifications
│   ├── integrations/                # Intégrations externes
│   │   └── supabase/               # Configuration Supabase
│   ├── pages/                       # Pages principales
│   │   ├── Index.tsx               # Page d'accueil
│   │   ├── StudentDashboard.tsx    # Dashboard étudiant
│   │   └── ...
│   ├── types/                       # Définitions TypeScript
│   │   ├── index.ts                # Types principaux
│   │   ├── subscription.ts         # Types abonnements
│   │   └── permissions.ts          # Types permissions
│   ├── lib/                         # Utilitaires
│   └── main.tsx                     # Point d'entrée
├── supabase/                        # Configuration Supabase
│   └── migrations/                  # Migrations base de données
├── package.json                     # Dépendances npm
├── tailwind.config.ts              # Configuration Tailwind
├── vite.config.ts                  # Configuration Vite
└── tsconfig.json                   # Configuration TypeScript
```

### Fichiers clés

**Configuration :**
- `vite.config.ts` : Configuration du build
- `tailwind.config.ts` : Personnalisation CSS
- `tsconfig.json` : Configuration TypeScript

**Points d'entrée :**
- `src/main.tsx` : Initialisation React
- `src/App.tsx` : Composant racine
- `src/pages/Index.tsx` : Page d'accueil

**Types importants :**
- `src/types/index.ts` : Types de base (User, Course, etc.)
- `src/types/subscription.ts` : Types système d'abonnement
- `src/types/permissions.ts` : Système de permissions

---

## Guide de maintenance et évolution {#maintenance-évolution}

### Bonnes pratiques

**Code :**
- Respect des conventions TypeScript
- Tests unitaires (à implémenter)
- Code reviews obligatoires
- Documentation inline

**Base de données :**
- Migrations versionnées
- Backup réguliers
- Monitoring des performances
- Optimisation des requêtes

### Ajout de nouvelles fonctionnalités

1. **Analyse des besoins** : Spécifications détaillées
2. **Design system** : Respect de l'identité visuelle
3. **Architecture** : Évaluation impact existant
4. **Développement** : TDD recommandé
5. **Tests** : Unitaires, intégration, e2e
6. **Déploiement** : Staging puis production

### Monitoring et maintenance

**Métriques à surveiller :**
- Performance frontend (Core Web Vitals)
- Temps de réponse API
- Taux d'erreur
- Utilisation base de données

**Maintenance régulière :**
- Mise à jour dépendances
- Optimisation bundle
- Nettoyage données obsolètes
- Sauvegarde base de données

### Évolutions prévues

**Court terme :**
- Tests automatisés
- PWA (Progressive Web App)
- Notifications push
- Mode hors ligne

**Moyen terme :**
- Application mobile native
- IA pour recommandations
- Analytics avancées
- Intégrations tierces

**Long terme :**
- Blockchain pour certificats
- Réalité virtuelle
- Marketplace de contenus
- API publique

---

## FAQ {#faq}

### Questions générales

**Q: Qu'est-ce que LearnEezy ?**
R: LearnEezy est une plateforme LMS complète permettant de créer, gérer et suivre des formations en ligne.

**Q: Quels sont les prérequis techniques ?**
R: Un navigateur moderne (Chrome, Firefox, Safari, Edge) et une connexion internet.

**Q: La plateforme est-elle responsive ?**
R: Oui, elle s'adapte automatiquement aux mobiles, tablettes et ordinateurs.

### Questions développeurs

**Q: Pourquoi Supabase ?**
R: Backend-as-a-Service complet, PostgreSQL, authentification intégrée, scaling automatique.

**Q: Comment contribuer au projet ?**
R: Fork → Feature branch → Pull Request → Code review → Merge.

**Q: Où trouver la documentation API ?**
R: Interface Supabase + types TypeScript dans `src/types/`.

### Questions fonctionnelles

**Q: Comment gérer les rôles utilisateurs ?**
R: Via l'interface admin → Gestion des utilisateurs → Attribution des rôles.

**Q: Le système supporte-t-il plusieurs langues ?**
R: Partiellement, architecture prête pour internationalisation complète.

**Q: Comment configurer les notifications ?**
R: Dashboard admin → Notifications → Configuration des triggers automatiques.

### Questions techniques avancées

**Q: Comment optimiser les performances ?**
R: Lazy loading, code splitting, optimisation images, cache intelligent.

**Q: Sécurité des données ?**
R: HTTPS, RLS Supabase, authentification JWT, chiffrement en transit.

**Q: Backup et récupération ?**
R: Supabase backup automatique + exports manuels réguliers recommandés.

---

## Ressources additionnelles

- **Documentation Supabase** : https://supabase.io/docs
- **React Documentation** : https://react.dev
- **Tailwind CSS** : https://tailwindcss.com/docs
- **TypeScript** : https://www.typescriptlang.org/docs

---

**Version de la documentation** : 1.0  
**Dernière mise à jour** : Janvier 2025  
**Maintenu par** : Équipe LearnEezy
