import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemArchitecture() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Architecture Système LearnEezy</h1>
          <p className="text-lg text-muted-foreground">
            Diagrammes de classes et de flux des entités principales du système de formation
          </p>
        </div>

        <Tabs defaultValue="entities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entities">Entités Principales</TabsTrigger>
            <TabsTrigger value="workflow">Flux Métier</TabsTrigger>
            <TabsTrigger value="permissions">Gestion des Droits</TabsTrigger>
          </TabsList>

          <TabsContent value="entities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagramme de Classes - Entités Principales</CardTitle>
                <CardDescription>
                  Relations entre les principales entités du système LearnEezy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <lov-mermaid>
                    {`classDiagram
    class OrganisationFormation {
        +UUID id
        +string name
        +string description
        +string address
        +string phone
        +string email
        +string siret
        +string numero_declaration
        +boolean qualiopi_certified
        +string logo_url
        +jsonb settings
        +timestamp created_at
        +timestamp updated_at
    }
    
    class Profile {
        +UUID id
        +string first_name
        +string last_name
        +user_role role
        +user_status status
        +boolean is_adult
        +UUID organisation_id
        +timestamp created_at
        +timestamp updated_at
    }
    
    class Course {
        +UUID id
        +string title
        +string description
        +string category
        +decimal price
        +integer duration_hours
        +string level
        +string[] skills
        +boolean is_active
        +UUID instructor_id
        +timestamp created_at
        +timestamp updated_at
    }
    
    class Inscription {
        +UUID id
        +UUID user_id
        +UUID course_id
        +string status
        +boolean convention_signed
        +boolean documents_sent
        +string signature_data
        +string signature_ip
        +timestamp signature_timestamp
        +timestamp created_at
        +timestamp updated_at
    }
    
    class Evaluation {
        +UUID id
        +UUID user_id
        +UUID course_id
        +string type
        +jsonb questions
        +integer score
        +integer max_score
        +decimal percentage
        +boolean is_completed
        +timestamp completed_at
        +timestamp created_at
        +timestamp updated_at
    }
    
    class Emargement {
        +UUID id
        +UUID user_id
        +UUID course_id
        +date session_date
        +time session_start_time
        +time session_end_time
        +boolean is_present
        +string signature_data
        +string ip_address
        +string notes
        +timestamp signature_timestamp
        +timestamp created_at
        +timestamp updated_at
    }
    
    OrganisationFormation ||--o{ Profile : "appartient à"
    Profile ||--o{ Course : "enseigne"
    Profile ||--o{ Inscription : "s'inscrit"
    Profile ||--o{ Evaluation : "passe"
    Profile ||--o{ Emargement : "signe"
    
    Course ||--o{ Inscription : "concerne"
    Course ||--o{ Evaluation : "évalue"
    Course ||--o{ Emargement : "suivi dans"`}
                  </lov-mermaid>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flux Métier - Processus d'Inscription</CardTitle>
                <CardDescription>
                  Workflow complet d'une inscription à une formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <lov-mermaid>
                    {`flowchart TD
    A[Étudiant consulte catalogue] --> B{Formation disponible?}
    B -->|Oui| C[Création inscription]
    B -->|Non| D[Liste d'attente]
    
    C --> E[Génération documents]
    E --> F[Envoi automatique email]
    F --> G[Signature convention]
    G --> H{Convention signée?}
    
    H -->|Non| I[Relance automatique]
    I --> G
    H -->|Oui| J[Validation documents administratifs]
    
    J --> K{Documents validés?}
    K -->|Non| L[Demande compléments]
    L --> J
    K -->|Oui| M[Inscription validée]
    
    M --> N[Début formation]
    N --> O[Émargement quotidien]
    O --> P[Suivi présence]
    P --> Q{Formation terminée?}
    
    Q -->|Non| O
    Q -->|Oui| R[Évaluation finale]
    R --> S[Génération certificat]
    S --> T[Archivage dossier]`}
                  </lov-mermaid>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flux de Gestion des Documents</CardTitle>
                <CardDescription>
                  Processus de gestion documentaire dans le système OF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <lov-mermaid>
                    {`flowchart LR
    A[Document téléversé] --> B{Type document}
    B -->|Administratif| C[Validation admin]
    B -->|Formation| D[Validation formateur]
    B -->|Évaluation| E[Correction automatique]
    
    C --> F{Valide?}
    F -->|Oui| G[Document approuvé]
    F -->|Non| H[Demande correction]
    H --> A
    
    D --> I{Conforme?}
    I -->|Oui| J[Ajout catalogue]
    I -->|Non| K[Révision demandée]
    K --> A
    
    E --> L[Calcul score]
    L --> M[Génération rapport]
    
    G --> N[Archivage sécurisé]
    J --> N
    M --> N`}
                  </lov-mermaid>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matrice des Permissions par Rôle</CardTitle>
                <CardDescription>
                  Droits d'accès et d'actions selon les rôles utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <lov-mermaid>
                    {`flowchart TD
    subgraph "Admin Système"
        A1[Gestion OF] --> A2[Gestion Utilisateurs]
        A2 --> A3[Configuration Système]
        A3 --> A4[Monitoring & Logs]
    end
    
    subgraph "Gestionnaire OF"
        M1[Gestion Apprenants] --> M2[Gestion Formations]
        M2 --> M3[Validation Documents]
        M3 --> M4[Rapports & Stats]
    end
    
    subgraph "Formateur"
        F1[Mes Formations] --> F2[Suivi Apprenants]
        F2 --> F3[Émargements]
        F3 --> F4[Évaluations]
    end
    
    subgraph "Apprenant"
        S1[Mon Profil] --> S2[Mes Formations]
        S2 --> S3[Mes Documents]
        S3 --> S4[Mes Évaluations]
    end
    
    A1 -.-> M1
    M1 -.-> F1
    F1 -.-> S1`}
                  </lov-mermaid>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow de Validation</CardTitle>
                <CardDescription>
                  Processus de validation multi-niveaux dans le système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <lov-mermaid>
                    {`stateDiagram-v2
    [*] --> Soumis
    Soumis --> EnAttente : Auto-validation
    Soumis --> EnRevision : Validation manuelle
    
    EnAttente --> Valide : Critères OK
    EnAttente --> Rejete : Critères KO
    
    EnRevision --> Valide : Approbation
    EnRevision --> Rejete : Refus
    EnRevision --> EnAttente : Délégation
    
    Rejete --> Soumis : Nouvelle soumission
    Valide --> Archive : Traitement terminé
    Archive --> [*]`}
                  </lov-mermaid>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}