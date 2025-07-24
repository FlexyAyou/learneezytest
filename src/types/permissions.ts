
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: PermissionAction[];
}

export interface PermissionAction {
  id: string;
  name: string;
  type: 'read' | 'write' | 'modify' | 'delete';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  context?: RoleContext;
}

export interface RoleContext {
  type: 'global' | 'group' | 'course' | 'space';
  value?: string;
  restrictions?: string[];
}

export interface UserRole {
  roleId: string;
  isActive: boolean;
  context?: RoleContext;
  assignedAt: string;
  assignedBy: string;
}

export interface UserPermissions {
  userId: string;
  roles: UserRole[];
  customPermissions: string[];
  permissionHistory: PermissionHistoryEntry[];
}

export interface PermissionHistoryEntry {
  id: string;
  userId: string;
  action: 'granted' | 'revoked' | 'modified';
  permission: string;
  role?: string;
  timestamp: string;
  modifiedBy: string;
  reason?: string;
}

export interface PermissionModule {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Modules fonctionnels prédéfinis
export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'courses',
    name: 'Cours',
    description: 'Gestion des cours et contenus pédagogiques',
    permissions: [
      {
        id: 'courses_view',
        name: 'Visualiser les cours',
        description: 'Voir la liste des cours disponibles',
        module: 'courses',
        actions: [
          { id: 'read_courses', name: 'Lire', type: 'read', description: 'Consulter les cours' }
        ]
      },
      {
        id: 'courses_manage',
        name: 'Gérer les cours',
        description: 'Créer, modifier et supprimer des cours',
        module: 'courses',
        actions: [
          { id: 'create_courses', name: 'Créer', type: 'write', description: 'Créer de nouveaux cours' },
          { id: 'edit_courses', name: 'Modifier', type: 'modify', description: 'Modifier les cours existants' },
          { id: 'delete_courses', name: 'Supprimer', type: 'delete', description: 'Supprimer des cours' }
        ]
      }
    ]
  },
  {
    id: 'evaluations',
    name: 'Évaluations',
    description: 'Gestion des tests et évaluations',
    permissions: [
      {
        id: 'evaluations_view',
        name: 'Visualiser les évaluations',
        description: 'Voir les résultats et statistiques',
        module: 'evaluations',
        actions: [
          { id: 'read_evaluations', name: 'Lire', type: 'read', description: 'Consulter les évaluations' }
        ]
      },
      {
        id: 'evaluations_manage',
        name: 'Gérer les évaluations',
        description: 'Créer et gérer les tests',
        module: 'evaluations',
        actions: [
          { id: 'create_evaluations', name: 'Créer', type: 'write', description: 'Créer des évaluations' },
          { id: 'edit_evaluations', name: 'Modifier', type: 'modify', description: 'Modifier les évaluations' },
          { id: 'delete_evaluations', name: 'Supprimer', type: 'delete', description: 'Supprimer des évaluations' }
        ]
      }
    ]
  },
  {
    id: 'forums',
    name: 'Forums',
    description: 'Gestion des espaces de discussion',
    permissions: [
      {
        id: 'forums_participate',
        name: 'Participer aux forums',
        description: 'Poster et répondre dans les forums',
        module: 'forums',
        actions: [
          { id: 'read_forums', name: 'Lire', type: 'read', description: 'Consulter les forums' },
          { id: 'write_forums', name: 'Écrire', type: 'write', description: 'Poster dans les forums' }
        ]
      },
      {
        id: 'forums_moderate',
        name: 'Modérer les forums',
        description: 'Gérer et modérer les contenus',
        module: 'forums',
        actions: [
          { id: 'moderate_forums', name: 'Modérer', type: 'modify', description: 'Modérer les contenus' },
          { id: 'delete_posts', name: 'Supprimer', type: 'delete', description: 'Supprimer des messages' }
        ]
      }
    ]
  },
  {
    id: 'reports',
    name: 'Rapports',
    description: 'Accès aux rapports et statistiques',
    permissions: [
      {
        id: 'reports_view',
        name: 'Visualiser les rapports',
        description: 'Consulter les rapports standards',
        module: 'reports',
        actions: [
          { id: 'read_reports', name: 'Lire', type: 'read', description: 'Consulter les rapports' }
        ]
      },
      {
        id: 'reports_export',
        name: 'Exporter les rapports',
        description: 'Télécharger et exporter les données',
        module: 'reports',
        actions: [
          { id: 'export_reports', name: 'Exporter', type: 'write', description: 'Exporter les rapports' }
        ]
      }
    ]
  }
];
