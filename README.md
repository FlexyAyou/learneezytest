
# LearnEezy - Plateforme LMS Moderne

![LearnEezy Logo](public/lovable-uploads/learneezy-white-logo.png)

> Une plateforme d'apprentissage en ligne complète et moderne, conçue pour révolutionner l'expérience d'apprentissage.

## 🚀 Aperçu rapide

LearnEezy est une solution LMS (Learning Management System) complète qui permet aux organismes de formation, entreprises et établissements d'enseignement de créer, gérer et diffuser des formations en ligne de manière efficace.

### ✨ Fonctionnalités principales

- 🎓 **Gestion complète des formations** : Création, organisation et suivi
- 👥 **Multi-rôles** : Étudiants, formateurs, administrateurs, managers
- 📊 **Tableaux de bord analytiques** : Métriques en temps réel
- 💳 **Système d'abonnements** : Plans flexibles avec crédits
- 📧 **Notifications automatiques** : Emails et rappels intelligents
- 🔒 **Sécurité avancée** : Authentication et permissions granulaires
- 📱 **Design responsive** : Optimisé pour tous les appareils

## 🏗️ Architecture technique

- **Frontend** : React 18 + TypeScript + Vite
- **UI/UX** : Tailwind CSS + shadcn/ui
- **Backend** : Supabase (BaaS)
- **Base de données** : PostgreSQL avec RLS
- **État** : Tanstack Query + React Context
- **Routing** : React Router v6

## 🚦 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/learnezy.git
cd learnezy

# Installer les dépendances
npm install

# Configuration environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# Lancer en développement
npm run dev
```

### Variables d'environnement

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
```

## 📚 Documentation

Pour une documentation complète, consultez [DOCUMENTATION.md](./DOCUMENTATION.md) qui inclut :

- Architecture détaillée
- Guide développeur
- Documentation fonctionnelle
- Structure des fichiers
- FAQ

## 🎯 Cas d'usage

### Pour les organismes de formation

- Gestion administrative complète
- Suivi des apprenants et émargement
- Génération automatique de certificats
- Facturation et abonnements

### Pour les entreprises

- Formation des équipes
- Onboarding nouveaux employés
- Compliance et certifications
- Reporting et analytics

### Pour l'enseignement

- Cours en ligne structurés
- Évaluations et notes
- Communication enseignant-élève
- Suivi parental (optionnel)

## 👥 Types d'utilisateurs

| Rôle | Description | Fonctionnalités principales |
|------|-------------|----------------------------|
| **Étudiant** | Apprenant principal | Cours, progression, certificats |
| **Formateur interne** | Créateur de contenu | Création cours, suivi apprenants |
| **Formateur externe** | Prestataire | Réservations, disponibilités |
| **Manager** | Superviseur équipe | Rapports, assignations |
| **Administrateur** | Gestionnaire plateforme | Configuration globale |
| **Organisme de formation** | Client institutionnel | Gestion complète OF |

## 📦 Packages principaux

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "typescript": "latest",
    "@tanstack/react-query": "^5.56.2",
    "@supabase/supabase-js": "latest",
    "tailwindcss": "latest",
    "react-router-dom": "^6.30.1"
  }
}
```

## 🛠️ Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Aperçu du build
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript
```

## 🚀 Déploiement

### Via Lovable (Recommandé)

1. Connecter votre compte GitHub
2. Pousser les modifications
3. Déployer via l'interface Lovable
4. Domaine personnalisé disponible

### Déploiement manuel

```bash
# Build de production
npm run build

# Déployer sur Vercel
npx vercel --prod

# Ou sur Netlify
npx netlify deploy --prod --dir=dist
```

## 🔒 Sécurité

- **Authentication** : Supabase Auth avec JWT
- **Permissions** : Row Level Security (RLS)
- **HTTPS** : Chiffrement en transit
- **Validation** : Validation côté client et serveur
- **Audit** : Logs des actions sensibles

## 📈 Métriques et monitoring

- Core Web Vitals optimisés
- Monitoring temps de réponse
- Métriques d'utilisation
- Rapports d'erreur automatiques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Guidelines de contribution

- Respecter les conventions TypeScript
- Tests unitaires requis
- Code review obligatoire
- Documentation à jour

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Documentation** : [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues** : [GitHub Issues](https://github.com/votre-username/learnezy/issues)
- **Email** : support@learnezy.com
- **Discord** : [Communauté LearnEezy](https://discord.gg/learnezy)

## 🗺️ Roadmap

### Q1 2025
- [ ] Tests automatisés (Jest + Cypress)
- [ ] PWA avec mode hors ligne
- [ ] Notifications push
- [ ] API publique v1

### Q2 2025
- [ ] Application mobile (React Native)
- [ ] IA pour recommandations de cours
- [ ] Analytics avancées
- [ ] Intégrations tierces (Slack, Teams)

### Q3 2025
- [ ] Marketplace de contenus
- [ ] Blockchain pour certificats
- [ ] Réalité virtuelle/augmentée
- [ ] Multi-tenant complet

## 📊 Statistiques

![GitHub stars](https://img.shields.io/github/stars/username/learnezy)
![GitHub forks](https://img.shields.io/github/forks/username/learnezy)
![GitHub issues](https://img.shields.io/github/issues/username/learnezy)
![Build status](https://img.shields.io/github/workflow/status/username/learnezy/CI)

---

**Développé avec ❤️ par l'équipe LearnEezy**

*Transformons ensemble l'apprentissage en ligne !*
