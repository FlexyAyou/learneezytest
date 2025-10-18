# ✅ Checklist de Développement - API Gestion des Cours

## 📋 Phase 1 : Infrastructure de base

### Base de données

- [ ] Créer la migration pour la table `courses`
- [ ] Créer la migration pour la table `modules`
- [ ] Créer la migration pour la table `lessons`
- [ ] Créer la migration pour la table `quizzes`
- [ ] Créer la migration pour la table `quiz_questions`
- [ ] Créer la migration pour la table `course_resources`
- [ ] Créer la migration pour la table `enrollments`
- [ ] Créer la migration pour la table `course_stats`
- [ ] Créer la migration pour la table `audit_logs` (optionnel)
- [ ] Créer les index nécessaires
- [ ] Créer le trigger `update_updated_at_column`
- [ ] Tester les migrations en local

### Modèles

- [ ] Créer `app/models/database_models.py` (modèles SQLAlchemy)
  - [ ] Modèle `Course`
  - [ ] Modèle `Module`
  - [ ] Modèle `Lesson`
  - [ ] Modèle `Quiz`
  - [ ] Modèle `QuizQuestion`
  - [ ] Modèle `CourseResource`
  - [ ] Modèle `Enrollment`
  - [ ] Modèle `CourseStats`

- [ ] Créer `app/models/courses.py` (modèles Pydantic)
  - [ ] Enums (`CourseStatus`, `OwnerType`)
  - [ ] `QuizQuestion`, `QuizCreate`, `QuizResponse`
  - [ ] `LessonCreate`, `LessonUpdate`, `LessonResponse`
  - [ ] `ModuleCreate`, `ModuleUpdate`, `ModuleResponse`
  - [ ] `ResourceCreate`, `ResourceResponse`
  - [ ] `CourseCreate`, `CourseUpdate`, `CourseResponse`, `CourseListItem`
  - [ ] `EnrollRequest`, `EnrollResponse`, `ProgressUpdate`
  - [ ] `CourseStatsResponse`
  - [ ] `UploadRequest`, `UploadResponse`
  - [ ] `CourseListFilters`

---

## 📋 Phase 2 : Services métier

### Permission Service

- [ ] Créer `app/services/permission_service.py`
- [ ] Implémenter `can_view_course()`
- [ ] Implémenter `can_edit_course()`
- [ ] Implémenter `can_delete_course()`
- [ ] Implémenter `can_view_stats()`
- [ ] Implémenter `can_create_course()`
- [ ] Implémenter `can_enroll()`
- [ ] Implémenter `_is_course_owner()`
- [ ] Implémenter `_has_catalogue_access()`
- [ ] Implémenter `determine_owner_type_and_id()`
- [ ] Tests unitaires du `PermissionService`

### Course Service

- [ ] Créer `app/services/course_service.py`
- [ ] Implémenter `create_course()`
  - [ ] Création du cours
  - [ ] Création des ressources
  - [ ] Création des modules
  - [ ] Création des leçons
  - [ ] Création des stats initiales
- [ ] Implémenter `publish_course()`
  - [ ] Validations (modules, leçons)
  - [ ] Mise à jour du statut
- [ ] Implémenter `enroll_user()`
  - [ ] Vérifications (publié, accès catalogue)
  - [ ] Création enrollment
  - [ ] Mise à jour des stats
- [ ] Implémenter `update_progress()`
  - [ ] Mise à jour progression
  - [ ] Calcul progression globale
  - [ ] Marquage comme complété
- [ ] Tests unitaires du `CourseService`

### Catalogue Service

- [ ] Créer `app/services/catalogue_service.py`
- [ ] Implémenter `get_accessible_course_ids()`
- [ ] Implémenter `filter_accessible_courses()`
- [ ] Tests unitaires du `CatalogueService`

### Upload Service

- [ ] Créer `app/services/upload_service.py`
- [ ] Implémenter `generate_presigned_upload_url()`
- [ ] Implémenter `_sanitize_filename()`
- [ ] Implémenter `validate_file_size()`
- [ ] Configuration S3/Bucket
- [ ] Tests du service d'upload

### Stats Service (optionnel)

- [ ] Créer `app/services/stats_service.py`
- [ ] Implémenter `update_course_stats()`
- [ ] Implémenter `calculate_average_score()`
- [ ] Implémenter `calculate_completion_rate()`

---

## 📋 Phase 3 : Endpoints API

### Router Courses - CRUD de base

- [ ] Créer `app/routers/courses.py`
- [ ] `GET /api/courses/` - Liste des cours
  - [ ] Pagination
  - [ ] Filtres (status, owner_type, category, search, level)
  - [ ] Permissions selon rôle
  - [ ] Tests
- [ ] `GET /api/courses/{course_id}` - Détails d'un cours
  - [ ] Lazy loading (paramètre `include`)
  - [ ] Permissions
  - [ ] Tests
- [ ] `POST /api/courses/` - Créer un cours
  - [ ] Validation des données
  - [ ] Détermination propriétaire
  - [ ] Tests
- [ ] `PUT /api/courses/{course_id}` - Mettre à jour
  - [ ] Validation permissions
  - [ ] Tests
- [ ] `DELETE /api/courses/{course_id}` - Supprimer (soft)
  - [ ] Soft delete uniquement
  - [ ] Tests
- [ ] `PATCH /api/courses/{course_id}/status` - Changer statut
  - [ ] Validation pour publication
  - [ ] Tests

### Router Courses - Modules

- [ ] `POST /api/courses/{course_id}/modules` - Créer module
  - [ ] Création avec leçons
  - [ ] Gestion order_index
  - [ ] Tests
- [ ] `PUT /api/courses/{course_id}/modules/{module_id}` - Modifier
  - [ ] Tests
- [ ] `DELETE /api/courses/{course_id}/modules/{module_id}` - Supprimer
  - [ ] Tests
- [ ] `PUT /api/courses/{course_id}/modules/reorder` - Réorganiser
  - [ ] Mise à jour order_index
  - [ ] Tests

### Router Courses - Leçons

- [ ] `POST /api/courses/{course_id}/modules/{module_id}/lessons` - Créer
  - [ ] Tests
- [ ] `PUT /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}` - Modifier
  - [ ] Tests
- [ ] `DELETE /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}` - Supprimer
  - [ ] Tests

### Router Courses - Quizzes

- [ ] `POST /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quizzes` - Créer
  - [ ] Validation questions (min 2)
  - [ ] Validation options (min 2, max 6)
  - [ ] Validation correct_answer
  - [ ] Tests
- [ ] `PUT /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quizzes/{quiz_id}` - Modifier
  - [ ] Tests
- [ ] `DELETE /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quizzes/{quiz_id}` - Supprimer
  - [ ] Tests

### Router Courses - Upload

- [ ] `POST /api/courses/{course_id}/upload` - Obtenir URL upload
  - [ ] Génération pre-signed URL
  - [ ] Validation type fichier
  - [ ] Validation taille
  - [ ] Tests

### Router Courses - Inscriptions

- [ ] `POST /api/courses/enroll` - S'inscrire
  - [ ] Validation cours publié
  - [ ] Validation accès catalogue
  - [ ] Vérification pas déjà inscrit
  - [ ] Tests
- [ ] `GET /api/courses/{course_id}/progress` - Récupérer progression
  - [ ] Tests
- [ ] `POST /api/courses/{course_id}/progress` - Mettre à jour progression
  - [ ] Calcul progression globale
  - [ ] Marquage complété si 100%
  - [ ] Tests

### Router Courses - Statistiques

- [ ] `GET /api/courses/{course_id}/stats` - Stats d'un cours
  - [ ] Vérification permissions (propriétaire)
  - [ ] Tests
- [ ] `GET /api/courses/my-courses` - Mes cours (formateur)
  - [ ] Tests
- [ ] `GET /api/courses/enrolled` - Cours inscrits (étudiant)
  - [ ] Tests

---

## 📋 Phase 4 : Sécurité & Optimisations

### Sécurité

- [ ] Implémenter Rate Limiting
  - [ ] `/api/courses/` (création) : 10/heure
  - [ ] `/api/courses/{course_id}/upload` : 5/heure
- [ ] Implémenter Audit Logging
  - [ ] Table `audit_logs`
  - [ ] Fonction `log_audit()`
  - [ ] Logger toutes les actions importantes
- [ ] Validation stricte des entrées
  - [ ] Sanitisation noms de fichiers
  - [ ] Validation types MIME
  - [ ] Validation tailles fichiers
- [ ] Protection CSRF
- [ ] Configuration CORS correcte

### Optimisations

- [ ] Cache Service
  - [ ] Créer `app/services/cache_service.py`
  - [ ] Configuration Redis
  - [ ] Méthodes `get_course()`, `set_course()`, `invalidate_course()`
  - [ ] Cache des listes avec TTL
- [ ] Pagination par curseurs
  - [ ] Implémenter dans `GET /api/courses/`
- [ ] Lazy Loading
  - [ ] Paramètre `include` dans endpoints détails
- [ ] Indexation recherche
  - [ ] Index full-text PostgreSQL
  - [ ] Fonction de recherche optimisée
- [ ] Background Jobs (optionnel)
  - [ ] Configuration Celery
  - [ ] Task `update_course_stats()`

---

## 📋 Phase 5 : Validations & Utils

### Validations

- [ ] Créer `app/utils/validators.py`
- [ ] `CourseValidator.validate_for_publication()`
  - [ ] Vérifier au moins 1 module
  - [ ] Vérifier chaque module a au moins 1 leçon
  - [ ] Warning si pas d'image (optionnel)
- [ ] `CourseValidator.validate_module_order()`
- [ ] Tests unitaires des validateurs

### Helpers

- [ ] Créer `app/utils/helpers.py`
- [ ] Fonctions utilitaires diverses
- [ ] Tests

---

## 📋 Phase 6 : Tests

### Tests unitaires

- [ ] Tests `PermissionService`
  - [ ] Test `can_view_course()`
  - [ ] Test `can_edit_course()`
  - [ ] Test `_is_course_owner()`
  - [ ] Test `determine_owner_type_and_id()`

- [ ] Tests `CourseService`
  - [ ] Test `create_course()` (différents rôles)
  - [ ] Test `publish_course()` (avec/sans modules)
  - [ ] Test `enroll_user()` (différents cas)
  - [ ] Test `update_progress()`

- [ ] Tests `CatalogueService`
  - [ ] Test `get_accessible_course_ids()` (différents rôles)

- [ ] Tests Validateurs
  - [ ] Test validation publication
  - [ ] Test validation quizzes

### Tests d'intégration

- [ ] Setup fixtures de test
  - [ ] Utilisateurs de test (chaque rôle)
  - [ ] Cours de test
  - [ ] Enrollments de test

- [ ] Tests API Courses
  - [ ] Test `GET /api/courses/` (pagination, filtres)
  - [ ] Test `POST /api/courses/` (différents rôles)
  - [ ] Test `PUT /api/courses/{id}` (permissions)
  - [ ] Test `DELETE /api/courses/{id}` (soft delete)
  - [ ] Test `PATCH /api/courses/{id}/status`

- [ ] Tests API Modules
  - [ ] Test création module
  - [ ] Test réorganisation modules

- [ ] Tests API Enrollments
  - [ ] Test inscription cours
  - [ ] Test mise à jour progression

- [ ] Tests API Stats
  - [ ] Test récupération stats (permissions)

### Tests de charge (optionnel)

- [ ] Tests de performance avec locust/k6
- [ ] Benchmark des endpoints critiques

---

## 📋 Phase 7 : Documentation

### Documentation API

- [ ] Descriptions détaillées dans docstrings
- [ ] Exemples de requêtes/réponses
- [ ] Codes d'erreur documentés
- [ ] Vérifier Swagger UI (/docs)
- [ ] Créer guide d'intégration frontend

### Documentation interne

- [ ] README du projet
- [ ] Guide de déploiement
- [ ] Variables d'environnement
- [ ] Guide de contribution

---

## 📋 Phase 8 : Déploiement

### Configuration

- [ ] Variables d'environnement production
  - [ ] `DATABASE_URL`
  - [ ] `REDIS_URL`
  - [ ] `S3_BUCKET`
  - [ ] `S3_REGION`
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `FRONTEND_URL` (CORS)

- [ ] Configuration logging production
- [ ] Configuration monitoring (Sentry, etc.)

### Déploiement

- [ ] Créer Dockerfile
- [ ] Créer docker-compose.yml
- [ ] Pipeline CI/CD
  - [ ] Tests automatiques
  - [ ] Linting
  - [ ] Build
  - [ ] Déploiement
- [ ] Déploiement staging
- [ ] Tests en staging
- [ ] Déploiement production

---

## 📋 Checklist globale de validation

### Fonctionnalités

- [ ] ✅ Tous les endpoints CRUD fonctionnent
- [ ] ✅ Système de permissions opérationnel
- [ ] ✅ Gestion des catalogues fonctionnelle
- [ ] ✅ Upload de fichiers opérationnel
- [ ] ✅ Inscriptions et progression fonctionnent
- [ ] ✅ Statistiques correctes

### Qualité

- [ ] ✅ Coverage des tests > 80%
- [ ] ✅ Pas d'erreurs de linting
- [ ] ✅ Documentation complète
- [ ] ✅ Performance acceptable (< 500ms par endpoint)

### Sécurité

- [ ] ✅ Rate limiting actif
- [ ] ✅ Validation des entrées stricte
- [ ] ✅ Permissions vérifiées partout
- [ ] ✅ Soft delete uniquement
- [ ] ✅ Audit logging en place

### Production Ready

- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Monitoring en place
- [ ] ✅ Logs structurés
- [ ] ✅ Backup database configuré
- [ ] ✅ Plan de rollback défini

---

## 📊 Progression

### Résumé

- **Phase 1 - Infrastructure** : ☐ 0/12 (0%)
- **Phase 2 - Services** : ☐ 0/25 (0%)
- **Phase 3 - Endpoints** : ☐ 0/35 (0%)
- **Phase 4 - Sécurité** : ☐ 0/15 (0%)
- **Phase 5 - Validations** : ☐ 0/6 (0%)
- **Phase 6 - Tests** : ☐ 0/25 (0%)
- **Phase 7 - Documentation** : ☐ 0/8 (0%)
- **Phase 8 - Déploiement** : ☐ 0/15 (0%)

**Total** : ☐ 0/141 (0%)

---

**Note** : Cette checklist peut être mise à jour au fur et à mesure du développement. Cocher les cases au fur et à mesure de l'avancement.

**Priorité** : 
1. Phase 1 (Infrastructure)
2. Phase 2 (Services - au moins PermissionService et CourseService)
3. Phase 3 (Endpoints - commencer par CRUD de base)
4. Phases 4-8 en parallèle selon les besoins

**Durée estimée** : 3-4 semaines pour un développeur expérimenté
