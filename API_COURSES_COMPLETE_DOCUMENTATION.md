# Documentation API Complète - Gestion des Cours avec Quiz, Devoirs et Certifications

## Table des matières

1. [Architecture générale](#architecture-générale)
2. [Schéma de base de données](#schéma-de-base-de-données)
3. [Modèles Pydantic](#modèles-pydantic)
4. [Endpoints API](#endpoints-api)
5. [Exemples complets](#exemples-complets)
6. [Validation et calcul de score](#validation-et-calcul-de-score)
7. [Permissions et sécurité](#permissions-et-sécurité)
8. [Gestion des erreurs](#gestion-des-erreurs)

---

## Architecture générale

### Stack technique
- **Backend**: FastAPI
- **Base de données relationnelle**: PostgreSQL (cours, utilisateurs, organisations, évaluations)
- **Base de données NoSQL**: MongoDB (contenu flexible des cours, questions complexes)
- **Authentification**: JWT avec OAuth2
- **Validation**: Pydantic v2
- **ORM**: SQLAlchemy pour PostgreSQL, Motor pour MongoDB

### Structure des dossiers
```
app/
├── models/
│   ├── __init__.py
│   ├── user.py                 # Modèles utilisateurs existants
│   ├── organization.py         # Modèles organisations existants
│   ├── course.py               # Modèles cours (étendu)
│   ├── evaluation.py           # Nouveaux modèles évaluations
│   └── question.py             # Nouveaux modèles questions
├── routes/
│   ├── __init__.py
│   ├── auth.py                 # Routes auth existantes
│   ├── courses.py              # Routes cours (étendu)
│   ├── evaluations.py          # Nouvelles routes évaluations
│   └── statistics.py           # Nouvelles routes statistiques
├── services/
│   ├── __init__.py
│   ├── course_service.py       # Logique métier cours
│   ├── evaluation_service.py  # Logique métier évaluations
│   ├── grading_service.py     # Service de notation
│   └── stats_service.py       # Service de statistiques
├── utils/
│   ├── __init__.py
│   ├── validators.py          # Validateurs personnalisés
│   ├── score_calculator.py    # Calcul des scores
│   └── permissions.py         # Gestion des permissions
└── schemas/
    ├── __init__.py
    ├── course_schemas.py      # Schémas Pydantic cours
    ├── evaluation_schemas.py  # Schémas Pydantic évaluations
    └── question_schemas.py    # Schémas Pydantic questions
```

---

## Schéma de base de données

### PostgreSQL Tables

#### Table `evaluations`
```sql
CREATE TYPE evaluation_type AS ENUM ('quiz', 'assignment', 'certification');
CREATE TYPE feedback_timing AS ENUM ('immediate', 'after-submit', 'never');

CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id VARCHAR NOT NULL,  -- Référence MongoDB
    module_id INTEGER,            -- NULL si certification (niveau cours)
    lesson_id INTEGER,            -- NULL si assignment ou certification
    type evaluation_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    -- Settings
    show_feedback feedback_timing DEFAULT 'after-submit',
    allow_retry BOOLEAN DEFAULT true,
    max_attempts INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT false,
    randomize_options BOOLEAN DEFAULT false,
    time_limit INTEGER,           -- en minutes
    passing_score INTEGER NOT NULL DEFAULT 70,
    
    -- Assignment specific
    due_date TIMESTAMP,
    allow_late_submission BOOLEAN DEFAULT false,
    requires_manual_grading BOOLEAN DEFAULT false,
    rubric JSONB,                 -- Grille d'évaluation
    
    -- Certification specific
    exam_mode BOOLEAN DEFAULT false,
    show_results_immediately BOOLEAN DEFAULT true,
    certificate_template VARCHAR(255),
    prerequisites JSONB,          -- IDs des prérequis
    
    -- Metadata
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT chk_level CHECK (
        (type = 'quiz' AND lesson_id IS NOT NULL) OR
        (type = 'assignment' AND module_id IS NOT NULL AND lesson_id IS NULL) OR
        (type = 'certification' AND module_id IS NULL AND lesson_id IS NULL)
    )
);

CREATE INDEX idx_evaluations_course ON evaluations(course_id);
CREATE INDEX idx_evaluations_type ON evaluations(type);
```

#### Table `evaluation_results`
```sql
CREATE TABLE evaluation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Scores
    score DECIMAL(5,2) NOT NULL,          -- Pourcentage (0-100)
    points_earned DECIMAL(10,2) NOT NULL,
    total_points DECIMAL(10,2) NOT NULL,
    is_passing BOOLEAN NOT NULL,
    
    -- Tentative
    attempt_number INTEGER NOT NULL DEFAULT 1,
    
    -- Timing
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    time_spent INTEGER,                    -- en secondes
    
    -- Grading
    feedback TEXT,
    graded_by INTEGER REFERENCES users(id),
    graded_at TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, graded
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(evaluation_id, user_id, attempt_number)
);

CREATE INDEX idx_results_evaluation ON evaluation_results(evaluation_id);
CREATE INDEX idx_results_user ON evaluation_results(user_id);
CREATE INDEX idx_results_status ON evaluation_results(status);
```

#### Table `user_answers`
```sql
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID REFERENCES evaluation_results(id) ON DELETE CASCADE,
    question_id VARCHAR NOT NULL,  -- Référence MongoDB
    
    -- Réponse (format JSON flexible selon le type de question)
    answer JSONB NOT NULL,
    
    -- Scoring
    is_correct BOOLEAN,
    points_earned DECIMAL(10,2),
    
    -- Timing
    time_spent INTEGER,  -- en secondes
    submitted_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(result_id, question_id)
);

CREATE INDEX idx_answers_result ON user_answers(result_id);
CREATE INDEX idx_answers_question ON user_answers(question_id);
```

### MongoDB Collections

#### Collection `questions`
```javascript
{
  _id: ObjectId("..."),
  type: "single-choice" | "multiple-choice" | "true-false" | "short-answer" | "long-answer" | "fill-blank" | "matching" | "ordering",
  evaluation_id: "uuid-de-evaluation",
  question: "Texte de la question",
  points: 10,
  difficulty: "easy" | "medium" | "hard",
  explanation: "Explication de la réponse",
  
  // Média optionnel
  media: {
    type: "image" | "video" | "audio",
    url: "https://..."
  },
  
  tags: ["react", "hooks", "state"],
  
  // Champs spécifiques selon le type
  
  // Pour single-choice
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 2, // Index de la bonne réponse
  
  // Pour multiple-choice
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswers: [1, 3], // Indices des bonnes réponses
  
  // Pour true-false
  correctAnswer: true,
  
  // Pour short-answer
  correctAnswers: ["réponse1", "réponse2", "réponse 1"],
  caseSensitive: false,
  
  // Pour long-answer
  minWords: 100,
  maxWords: 500,
  rubric: ["Critère 1", "Critère 2", "Critère 3"],
  
  // Pour fill-blank
  text: "JavaScript utilise [blank] pour gérer l'asynchrone et [blank] pour les promesses.",
  correctAnswers: ["callbacks", "then/catch"],
  
  // Pour matching
  leftItems: ["React", "Vue", "Angular"],
  rightItems: ["Facebook", "Evan You", "Google"],
  correctMatches: [
    { left: 0, right: 0 },
    { left: 1, right: 1 },
    { left: 2, right: 2 }
  ],
  
  // Pour ordering
  items: ["Étape A", "Étape B", "Étape C"],
  correctOrder: [0, 2, 1], // L'ordre correct des indices
  
  created_at: ISODate("2025-01-10T10:00:00Z"),
  updated_at: ISODate("2025-01-10T10:00:00Z")
}
```

---

## Modèles Pydantic

### Schémas de Questions (`schemas/question_schemas.py`)

```python
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal, Union
from datetime import datetime

# Types de base
QuestionType = Literal[
    "single-choice",
    "multiple-choice",
    "true-false",
    "short-answer",
    "long-answer",
    "fill-blank",
    "matching",
    "ordering"
]

DifficultyLevel = Literal["easy", "medium", "hard"]

# Média
class QuestionMedia(BaseModel):
    type: Literal["image", "video", "audio"]
    url: str

# Question de base
class BaseQuestionSchema(BaseModel):
    type: QuestionType
    question: str = Field(..., min_length=1, max_length=1000)
    points: float = Field(..., ge=0)
    difficulty: Optional[DifficultyLevel] = "medium"
    explanation: Optional[str] = None
    media: Optional[QuestionMedia] = None
    tags: List[str] = Field(default_factory=list)

# Single Choice
class SingleChoiceQuestion(BaseQuestionSchema):
    type: Literal["single-choice"] = "single-choice"
    options: List[str] = Field(..., min_length=2, max_length=10)
    correctAnswer: int = Field(..., ge=0)
    
    @field_validator('correctAnswer')
    @classmethod
    def validate_correct_answer(cls, v, info):
        options = info.data.get('options', [])
        if v >= len(options):
            raise ValueError(f"correctAnswer index {v} out of range for {len(options)} options")
        return v

# Multiple Choice
class MultipleChoiceQuestion(BaseQuestionSchema):
    type: Literal["multiple-choice"] = "multiple-choice"
    options: List[str] = Field(..., min_length=2, max_length=10)
    correctAnswers: List[int] = Field(..., min_length=1)
    
    @field_validator('correctAnswers')
    @classmethod
    def validate_correct_answers(cls, v, info):
        options = info.data.get('options', [])
        if any(idx >= len(options) for idx in v):
            raise ValueError("correctAnswers indices out of range")
        if len(v) != len(set(v)):
            raise ValueError("Duplicate indices in correctAnswers")
        return v

# True/False
class TrueFalseQuestion(BaseQuestionSchema):
    type: Literal["true-false"] = "true-false"
    correctAnswer: bool

# Short Answer
class ShortAnswerQuestion(BaseQuestionSchema):
    type: Literal["short-answer"] = "short-answer"
    correctAnswers: List[str] = Field(..., min_length=1)
    caseSensitive: bool = False

# Long Answer
class LongAnswerQuestion(BaseQuestionSchema):
    type: Literal["long-answer"] = "long-answer"
    minWords: Optional[int] = Field(None, ge=0)
    maxWords: Optional[int] = Field(None, ge=0)
    rubric: List[str] = Field(default_factory=list)

# Fill Blank
class FillBlankQuestion(BaseQuestionSchema):
    type: Literal["fill-blank"] = "fill-blank"
    text: str = Field(..., min_length=1)
    correctAnswers: List[str] = Field(..., min_length=1)
    
    @field_validator('text')
    @classmethod
    def validate_blanks(cls, v, info):
        blank_count = v.count('[blank]')
        correct_answers = info.data.get('correctAnswers', [])
        if blank_count != len(correct_answers):
            raise ValueError(f"Number of [blank] ({blank_count}) must match correctAnswers length ({len(correct_answers)})")
        return v

# Matching
class MatchPair(BaseModel):
    left: int
    right: int

class MatchingQuestion(BaseQuestionSchema):
    type: Literal["matching"] = "matching"
    leftItems: List[str] = Field(..., min_length=2)
    rightItems: List[str] = Field(..., min_length=2)
    correctMatches: List[MatchPair] = Field(..., min_length=1)

# Ordering
class OrderingQuestion(BaseQuestionSchema):
    type: Literal["ordering"] = "ordering"
    items: List[str] = Field(..., min_length=2)
    correctOrder: List[int] = Field(..., min_length=2)
    
    @field_validator('correctOrder')
    @classmethod
    def validate_order(cls, v, info):
        items = info.data.get('items', [])
        if len(v) != len(items):
            raise ValueError("correctOrder length must match items length")
        if set(v) != set(range(len(items))):
            raise ValueError("correctOrder must contain all indices exactly once")
        return v

# Union de tous les types de questions
Question = Union[
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    ShortAnswerQuestion,
    LongAnswerQuestion,
    FillBlankQuestion,
    MatchingQuestion,
    OrderingQuestion
]

# Pour la création (sans ID)
class QuestionCreate(BaseModel):
    __root__: Question

# Pour la réponse (avec ID MongoDB)
class QuestionResponse(BaseModel):
    id: str = Field(alias="_id")
    evaluation_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
```

### Schémas d'Évaluations (`schemas/evaluation_schemas.py`)

```python
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal
from datetime import datetime
from .question_schemas import Question

EvaluationType = Literal["quiz", "assignment", "certification"]
FeedbackTiming = Literal["immediate", "after-submit", "never"]

# Settings communs
class EvaluationSettings(BaseModel):
    show_feedback: FeedbackTiming = "after-submit"
    allow_retry: bool = True
    max_attempts: int = Field(3, ge=1, le=10)
    randomize_questions: bool = False
    randomize_options: bool = False
    time_limit: Optional[int] = Field(None, ge=1)  # en minutes
    passing_score: int = Field(70, ge=0, le=100)

# Quiz (leçon)
class QuizCreate(BaseModel):
    type: Literal["quiz"] = "quiz"
    course_id: str
    module_id: int
    lesson_id: int
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    questions: List[Question] = Field(..., min_length=1)
    settings: EvaluationSettings

class QuizResponse(QuizCreate):
    id: str
    created_by: int
    created_at: datetime
    updated_at: datetime

# Assignment (module)
class AssignmentSettings(BaseModel):
    due_date: Optional[datetime] = None
    allow_late_submission: bool = False
    max_attempts: int = Field(3, ge=1)
    time_limit: Optional[int] = None
    passing_score: int = Field(70, ge=0, le=100)
    requires_manual_grading: bool = False
    rubric: List[str] = Field(default_factory=list)

class ResourceAttachment(BaseModel):
    name: str
    url: str

class AssignmentCreate(BaseModel):
    type: Literal["assignment"] = "assignment"
    course_id: str
    module_id: int
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    instructions: Optional[str] = None
    questions: List[Question] = Field(..., min_length=1)
    settings: AssignmentSettings
    resources: List[ResourceAttachment] = Field(default_factory=list)

class AssignmentResponse(AssignmentCreate):
    id: str
    created_by: int
    created_at: datetime
    updated_at: datetime

# Certification (cours)
class CertificationSettings(BaseModel):
    exam_mode: bool = True
    time_limit: int = Field(..., ge=30)  # Obligatoire, min 30 min
    passing_score: int = Field(70, ge=0, le=100)
    max_attempts: int = Field(1, ge=1, le=3)
    randomize_questions: bool = True
    show_results_immediately: bool = True
    certificate_template: Optional[str] = None
    prerequisites: List[str] = Field(default_factory=list)  # IDs des modules/devoirs

class CertificationCreate(BaseModel):
    type: Literal["certification"] = "certification"
    course_id: str
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    questions: List[Question] = Field(..., min_length=10)  # Min 10 questions
    settings: CertificationSettings

class CertificationResponse(CertificationCreate):
    id: str
    created_by: int
    created_at: datetime
    updated_at: datetime

# Update schemas
class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: Optional[List[Question]] = None
    settings: Optional[EvaluationSettings] = None

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    questions: Optional[List[Question]] = None
    settings: Optional[AssignmentSettings] = None
    resources: Optional[List[ResourceAttachment]] = None

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: Optional[List[Question]] = None
    settings: Optional[CertificationSettings] = None
```

### Schémas de Soumission et Résultats

```python
from pydantic import BaseModel, Field
from typing import Any, Optional, List
from datetime import datetime

# Soumission d'une réponse
class AnswerSubmission(BaseModel):
    question_id: str
    answer: Any  # Format dépend du type de question
    time_spent: Optional[int] = None  # en secondes

# Soumission d'une évaluation complète
class EvaluationSubmission(BaseModel):
    evaluation_id: str
    answers: List[AnswerSubmission]
    started_at: datetime
    completed_at: datetime

# Résultat d'une question
class QuestionResult(BaseModel):
    question_id: str
    answer: Any
    is_correct: Optional[bool]
    points_earned: float
    max_points: float
    time_spent: Optional[int]
    explanation: Optional[str] = None

# Résultat d'une évaluation
class EvaluationResultResponse(BaseModel):
    id: str
    evaluation_id: str
    evaluation_type: EvaluationType
    user_id: int
    
    score: float  # Pourcentage
    points_earned: float
    total_points: float
    is_passing: bool
    
    attempt_number: int
    started_at: datetime
    completed_at: Optional[datetime]
    time_spent: int  # en secondes
    
    status: str  # in_progress, completed, graded
    
    # Pour affichage détaillé
    questions_results: Optional[List[QuestionResult]] = None
    
    # Feedback formateur (devoirs)
    feedback: Optional[str] = None
    graded_by: Optional[int] = None
    graded_at: Optional[datetime] = None

# Notation manuelle (devoirs)
class ManualGrading(BaseModel):
    result_id: str
    feedback: str = Field(..., min_length=1)
    points_adjustments: Optional[List[dict]] = None  # {question_id, points}

# Statistiques d'évaluation
class QuestionStats(BaseModel):
    question_id: str
    question_text: str
    correct_rate: float  # Pourcentage
    average_time_spent: float  # en secondes
    total_attempts: int

class EvaluationStatsResponse(BaseModel):
    evaluation_id: str
    evaluation_title: str
    total_attempts: int
    completed_attempts: int
    average_score: float
    passing_rate: float
    average_time_spent: float  # en secondes
    question_stats: List[QuestionStats]
```

---

## Endpoints API

### 1. Gestion des Quiz (Leçons)

#### Créer un Quiz
```http
POST /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "quiz",
  "course_id": "course_mongo_id",
  "module_id": 1,
  "lesson_id": 1,
  "title": "Quiz : Les bases de React",
  "description": "Testez vos connaissances sur les concepts fondamentaux de React",
  "questions": [
    {
      "type": "single-choice",
      "question": "Quel hook permet de gérer l'état dans un composant fonctionnel ?",
      "points": 10,
      "difficulty": "easy",
      "options": ["useEffect", "useState", "useContext", "useReducer"],
      "correctAnswer": 1,
      "explanation": "useState est le hook utilisé pour gérer l'état local dans les composants fonctionnels."
    },
    {
      "type": "multiple-choice",
      "question": "Quels sont les hooks de cycle de vie React ?",
      "points": 15,
      "difficulty": "medium",
      "options": ["useEffect", "useState", "useLayoutEffect", "useMemo"],
      "correctAnswers": [0, 2],
      "explanation": "useEffect et useLayoutEffect sont les hooks liés au cycle de vie."
    },
    {
      "type": "true-false",
      "question": "React utilise un Virtual DOM",
      "points": 5,
      "difficulty": "easy",
      "correctAnswer": true
    }
  ],
  "settings": {
    "show_feedback": "after-submit",
    "allow_retry": true,
    "max_attempts": 3,
    "randomize_questions": false,
    "randomize_options": true,
    "time_limit": 15,
    "passing_score": 70
  }
}
```

**Réponse 201 Created:**
```json
{
  "id": "uuid-quiz",
  "type": "quiz",
  "course_id": "course_mongo_id",
  "module_id": 1,
  "lesson_id": 1,
  "title": "Quiz : Les bases de React",
  "description": "Testez vos connaissances...",
  "questions": [...],
  "settings": {...},
  "created_by": 42,
  "created_at": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-10T10:00:00Z"
}
```

#### Récupérer un Quiz
```http
GET /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}
Authorization: Bearer <token>
```

**Réponse 200 OK:** Structure identique à la création.

#### Modifier un Quiz
```http
PUT /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Quiz modifié",
  "settings": {
    "passing_score": 80
  }
}
```

#### Supprimer un Quiz
```http
DELETE /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}
Authorization: Bearer <token>
```

**Réponse 204 No Content**

---

### 2. Gestion des Devoirs (Modules)

#### Créer un Devoir
```http
POST /api/courses/{course_id}/modules/{module_id}/assignment
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "assignment",
  "course_id": "course_mongo_id",
  "module_id": 1,
  "title": "Projet : Créer une Todo App avec React",
  "description": "Développez une application de gestion de tâches complète",
  "instructions": "Votre application doit inclure :\n1. Ajout de tâches\n2. Modification\n3. Suppression\n4. Filtrage par statut",
  "questions": [
    {
      "type": "long-answer",
      "question": "Expliquez votre choix d'architecture pour la gestion de l'état",
      "points": 30,
      "difficulty": "hard",
      "minWords": 150,
      "maxWords": 500,
      "rubric": [
        "Clarté de l'explication",
        "Justification technique",
        "Considération des alternatives"
      ]
    },
    {
      "type": "short-answer",
      "question": "Quel est le lien GitHub de votre projet ?",
      "points": 5,
      "correctAnswers": ["https://github.com/"]
    }
  ],
  "settings": {
    "due_date": "2025-01-20T23:59:59Z",
    "allow_late_submission": true,
    "max_attempts": 1,
    "time_limit": null,
    "passing_score": 70,
    "requires_manual_grading": true,
    "rubric": [
      "Fonctionnalité complète (30 points)",
      "Qualité du code (30 points)",
      "Design UI/UX (20 points)",
      "Documentation (20 points)"
    ]
  },
  "resources": [
    {
      "name": "Guide React",
      "url": "https://react.dev"
    },
    {
      "name": "Exemples de code",
      "url": "https://..."
    }
  ]
}
```

**Réponse 201 Created:** Structure similaire avec ID ajouté.

#### Autres endpoints Assignment
- `GET /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`
- `PUT /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`
- `DELETE /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`

---

### 3. Gestion des Certifications (Cours)

#### Créer une Certification
```http
POST /api/courses/{course_id}/certification
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "certification",
  "course_id": "course_mongo_id",
  "title": "Certification React Developer",
  "description": "Examen de certification officiel pour valider vos compétences React",
  "questions": [
    {
      "type": "single-choice",
      "question": "Qu'est-ce que le Virtual DOM ?",
      "points": 10,
      "difficulty": "medium",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 1
    },
    {
      "type": "ordering",
      "question": "Ordonnez les étapes du cycle de vie d'un composant React",
      "points": 15,
      "difficulty": "hard",
      "items": [
        "Mounting",
        "Updating",
        "Unmounting"
      ],
      "correctOrder": [0, 1, 2]
    },
    {
      "type": "matching",
      "question": "Associez les hooks à leur fonction",
      "points": 20,
      "difficulty": "medium",
      "leftItems": ["useState", "useEffect", "useContext"],
      "rightItems": ["Gestion d'état", "Effets secondaires", "Contexte"],
      "correctMatches": [
        {"left": 0, "right": 0},
        {"left": 1, "right": 1},
        {"left": 2, "right": 2}
      ]
    },
    {
      "type": "fill-blank",
      "question": "React utilise [blank] pour optimiser les rendus et [blank] pour comparer les objets",
      "points": 10,
      "difficulty": "easy",
      "text": "React utilise [blank] pour optimiser les rendus et [blank] pour comparer les objets",
      "correctAnswers": ["memoization", "shallow comparison"]
    }
    // ... minimum 10 questions au total
  ],
  "settings": {
    "exam_mode": true,
    "time_limit": 90,
    "passing_score": 75,
    "max_attempts": 2,
    "randomize_questions": true,
    "show_results_immediately": false,
    "certificate_template": "react_developer_cert",
    "prerequisites": ["module_1_assignment_id", "module_2_assignment_id"]
  }
}
```

**Réponse 201 Created**

#### Autres endpoints Certification
- `GET /api/courses/{course_id}/certification/{certification_id}`
- `PUT /api/courses/{course_id}/certification/{certification_id}`
- `DELETE /api/courses/{course_id}/certification/{certification_id}`

---

### 4. Soumission et Notation

#### Soumettre une Évaluation
```http
POST /api/evaluations/{evaluation_id}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "evaluation_id": "uuid-evaluation",
  "started_at": "2025-01-10T10:00:00Z",
  "completed_at": "2025-01-10T10:25:00Z",
  "answers": [
    {
      "question_id": "q1_mongo_id",
      "answer": 1,  // Index pour single-choice
      "time_spent": 45
    },
    {
      "question_id": "q2_mongo_id",
      "answer": [0, 2],  // Array pour multiple-choice
      "time_spent": 60
    },
    {
      "question_id": "q3_mongo_id",
      "answer": true,  // Boolean pour true-false
      "time_spent": 30
    },
    {
      "question_id": "q4_mongo_id",
      "answer": "useState",  // String pour short-answer
      "time_spent": 40
    },
    {
      "question_id": "q5_mongo_id",
      "answer": "Le useState hook permet de gérer l'état local...",  // Long text pour long-answer
      "time_spent": 300
    },
    {
      "question_id": "q6_mongo_id",
      "answer": ["memoization", "shallow comparison"],  // Array pour fill-blank
      "time_spent": 50
    },
    {
      "question_id": "q7_mongo_id",
      "answer": [
        {"left": 0, "right": 0},
        {"left": 1, "right": 1}
      ],  // Pairs pour matching
      "time_spent": 70
    },
    {
      "question_id": "q8_mongo_id",
      "answer": [0, 2, 1],  // Ordered indices pour ordering
      "time_spent": 55
    }
  ]
}
```

**Réponse 201 Created:**
```json
{
  "id": "result_uuid",
  "evaluation_id": "uuid-evaluation",
  "evaluation_type": "quiz",
  "user_id": 123,
  "score": 85.5,
  "points_earned": 85.5,
  "total_points": 100,
  "is_passing": true,
  "attempt_number": 1,
  "started_at": "2025-01-10T10:00:00Z",
  "completed_at": "2025-01-10T10:25:00Z",
  "time_spent": 1500,
  "status": "completed",
  "questions_results": [
    {
      "question_id": "q1_mongo_id",
      "answer": 1,
      "is_correct": true,
      "points_earned": 10,
      "max_points": 10,
      "time_spent": 45,
      "explanation": "useState est le hook utilisé..."
    }
    // ... autres questions
  ]
}
```

#### Récupérer les Résultats d'une Évaluation
```http
GET /api/evaluations/{evaluation_id}/results?user_id={user_id}&attempt={attempt_number}
Authorization: Bearer <token>
```

**Réponse 200 OK:** Structure identique à la soumission.

#### Récupérer l'Historique des Tentatives
```http
GET /api/evaluations/{evaluation_id}/results/history?user_id={user_id}
Authorization: Bearer <token>
```

**Réponse 200 OK:**
```json
{
  "evaluation_id": "uuid-evaluation",
  "evaluation_title": "Quiz : Les bases de React",
  "user_id": 123,
  "attempts": [
    {
      "attempt_number": 1,
      "score": 65.0,
      "is_passing": false,
      "completed_at": "2025-01-08T10:00:00Z"
    },
    {
      "attempt_number": 2,
      "score": 85.5,
      "is_passing": true,
      "completed_at": "2025-01-10T10:25:00Z"
    }
  ],
  "best_score": 85.5,
  "attempts_remaining": 1
}
```

#### Noter Manuellement un Devoir
```http
POST /api/evaluations/{evaluation_id}/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "result_id": "result_uuid",
  "feedback": "Excellent travail ! L'architecture est bien pensée et le code est propre. Quelques suggestions d'amélioration : ...",
  "points_adjustments": [
    {
      "question_id": "q1_mongo_id",
      "points": 28  // Sur 30 max
    },
    {
      "question_id": "q2_mongo_id",
      "points": 5
    }
  ]
}
```

**Réponse 200 OK:**
```json
{
  "id": "result_uuid",
  "evaluation_id": "assignment_uuid",
  "score": 91.4,
  "points_earned": 91.4,
  "total_points": 100,
  "is_passing": true,
  "status": "graded",
  "feedback": "Excellent travail ! ...",
  "graded_by": 42,
  "graded_at": "2025-01-11T14:30:00Z"
}
```

---

### 5. Statistiques et Analytics

#### Statistiques d'une Évaluation
```http
GET /api/evaluations/{evaluation_id}/stats
Authorization: Bearer <token>
```

**Réponse 200 OK:**
```json
{
  "evaluation_id": "uuid-evaluation",
  "evaluation_title": "Quiz : Les bases de React",
  "evaluation_type": "quiz",
  "total_attempts": 156,
  "completed_attempts": 142,
  "average_score": 78.5,
  "passing_rate": 82.4,
  "average_time_spent": 845,
  "question_stats": [
    {
      "question_id": "q1_mongo_id",
      "question_text": "Quel hook permet de gérer l'état...",
      "correct_rate": 92.3,
      "average_time_spent": 42,
      "total_attempts": 142
    },
    {
      "question_id": "q2_mongo_id",
      "question_text": "Quels sont les hooks de cycle de vie...",
      "correct_rate": 65.5,
      "average_time_spent": 68,
      "total_attempts": 142
    }
  ]
}
```

#### Statistiques Globales d'un Cours
```http
GET /api/courses/{course_id}/stats/evaluations
Authorization: Bearer <token>
```

**Réponse 200 OK:**
```json
{
  "course_id": "course_mongo_id",
  "total_evaluations": 15,
  "evaluations_by_type": {
    "quiz": 8,
    "assignment": 5,
    "certification": 2
  },
  "overall_stats": {
    "total_attempts": 450,
    "average_score": 76.8,
    "passing_rate": 81.2
  },
  "evaluations": [
    {
      "evaluation_id": "uuid-1",
      "title": "Quiz Module 1",
      "type": "quiz",
      "attempts": 156,
      "average_score": 78.5,
      "passing_rate": 82.4
    }
    // ... autres évaluations
  ]
}
```

#### Historique d'un Utilisateur
```http
GET /api/users/{user_id}/evaluations/history
Authorization: Bearer <token>
```

**Réponse 200 OK:**
```json
{
  "user_id": 123,
  "total_evaluations_taken": 12,
  "total_passed": 10,
  "overall_average_score": 82.3,
  "evaluations": [
    {
      "evaluation_id": "uuid-1",
      "evaluation_title": "Quiz : Les bases de React",
      "evaluation_type": "quiz",
      "course_id": "course_mongo_id",
      "course_title": "Maîtrisez React",
      "best_score": 85.5,
      "is_passing": true,
      "attempts": 2,
      "last_attempt_at": "2025-01-10T10:25:00Z"
    }
    // ... autres évaluations
  ]
}
```

---

### 6. Récupération d'un Cours Complet avec Évaluations

```http
GET /api/courses/{course_id}/full
Authorization: Bearer <token>
```

**Réponse 200 OK:**
```json
{
  "id": "course_mongo_id",
  "title": "Maîtrisez React de A à Z",
  "description": "...",
  "modules": [
    {
      "id": 1,
      "title": "Introduction à React",
      "lessons": [
        {
          "id": 1,
          "title": "Les bases des composants",
          "video_url": "...",
          "quiz": {
            "id": "quiz_uuid",
            "title": "Quiz : Les bases de React",
            "settings": {...}
          }
        }
      ],
      "assignment": {
        "id": "assignment_uuid",
        "title": "Projet : Todo App",
        "due_date": "2025-01-20T23:59:59Z"
      }
    }
  ],
  "certification": {
    "id": "cert_uuid",
    "title": "Certification React Developer",
    "settings": {
      "prerequisites": ["assignment_uuid_1", "assignment_uuid_2"]
    }
  }
}
```

---

## Exemples complets

### Exemple 1 : Créer un cours complet avec toutes les évaluations

```python
# 1. Créer le cours (MongoDB)
course_data = {
    "title": "Maîtrisez React de A à Z",
    "description": "Apprenez React de zéro",
    "modules": [
        {
            "id": 1,
            "title": "Introduction à React",
            "lessons": [
                {
                    "id": 1,
                    "title": "Les bases",
                    "video_url": "..."
                }
            ]
        }
    ]
}
course = await course_service.create_course(course_data, user_id=admin_id)

# 2. Créer un quiz pour la leçon 1
quiz_data = {
    "type": "quiz",
    "course_id": str(course.id),
    "module_id": 1,
    "lesson_id": 1,
    "title": "Quiz Module 1",
    "questions": [
        {
            "type": "single-choice",
            "question": "Qu'est-ce que JSX ?",
            "points": 10,
            "options": ["A", "B", "C", "D"],
            "correctAnswer": 2
        }
    ],
    "settings": {
        "passing_score": 70,
        "max_attempts": 3
    }
}
quiz = await evaluation_service.create_quiz(quiz_data, user_id=admin_id)

# 3. Créer un devoir pour le module 1
assignment_data = {
    "type": "assignment",
    "course_id": str(course.id),
    "module_id": 1,
    "title": "Projet React",
    "description": "Créer une app",
    "questions": [...],
    "settings": {
        "due_date": "2025-01-20T23:59:59Z",
        "requires_manual_grading": True
    }
}
assignment = await evaluation_service.create_assignment(assignment_data, user_id=admin_id)

# 4. Créer la certification du cours
cert_data = {
    "type": "certification",
    "course_id": str(course.id),
    "title": "Certification React",
    "questions": [...],  # Minimum 10 questions
    "settings": {
        "exam_mode": True,
        "time_limit": 90,
        "prerequisites": [str(assignment.id)]
    }
}
certification = await evaluation_service.create_certification(cert_data, user_id=admin_id)
```

### Exemple 2 : Workflow complet d'un apprenant

```python
# 1. L'apprenant s'inscrit au cours
await course_service.enroll_user(course_id, user_id)

# 2. L'apprenant passe le quiz
submission = {
    "evaluation_id": quiz_id,
    "answers": [
        {"question_id": "q1", "answer": 2, "time_spent": 45}
    ],
    "started_at": "...",
    "completed_at": "..."
}
result = await evaluation_service.submit_evaluation(submission, user_id)
# result.score = 85, result.is_passing = True

# 3. L'apprenant soumet le devoir
assignment_submission = {
    "evaluation_id": assignment_id,
    "answers": [
        {
            "question_id": "long_answer_q",
            "answer": "Mon explication complète...",
            "time_spent": 3600
        }
    ],
    "started_at": "...",
    "completed_at": "..."
}
assignment_result = await evaluation_service.submit_evaluation(
    assignment_submission, user_id
)
# assignment_result.status = "completed" (en attente de notation)

# 4. Le formateur note le devoir
grading = {
    "result_id": str(assignment_result.id),
    "feedback": "Excellent travail !",
    "points_adjustments": [
        {"question_id": "long_answer_q", "points": 28}
    ]
}
graded = await evaluation_service.grade_evaluation(grading, grader_id=teacher_id)
# graded.status = "graded", graded.score = 93.3

# 5. L'apprenant vérifie les prérequis
prerequisites_met = await evaluation_service.check_prerequisites(
    certification_id, user_id
)
# True si tous les devoirs/modules requis sont validés

# 6. L'apprenant passe la certification
cert_submission = {
    "evaluation_id": certification_id,
    "answers": [...],  # 10+ réponses
    "started_at": "...",
    "completed_at": "..."
}
cert_result = await evaluation_service.submit_evaluation(cert_submission, user_id)
# cert_result.score = 82, cert_result.is_passing = True
# Génération automatique du certificat
```

---

## Validation et calcul de score

### Service de Calcul de Score (`services/grading_service.py`)

```python
from typing import Dict, Any, List
from .question_schemas import Question

class GradingService:
    
    def calculate_score(
        self, 
        questions: List[Question],
        answers: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calcule le score d'une évaluation
        """
        total_points = sum(q.points for q in questions)
        earned_points = 0
        results = []
        
        # Créer un mapping question_id -> question
        questions_map = {str(q.id): q for q in questions}
        
        for answer_data in answers:
            question_id = answer_data['question_id']
            user_answer = answer_data['answer']
            question = questions_map.get(question_id)
            
            if not question:
                continue
                
            is_correct, points = self._grade_question(question, user_answer)
            earned_points += points
            
            results.append({
                'question_id': question_id,
                'answer': user_answer,
                'is_correct': is_correct,
                'points_earned': points,
                'max_points': question.points,
                'explanation': question.explanation if not is_correct else None
            })
        
        score = (earned_points / total_points * 100) if total_points > 0 else 0
        
        return {
            'score': round(score, 2),
            'points_earned': earned_points,
            'total_points': total_points,
            'results': results
        }
    
    def _grade_question(self, question: Question, user_answer: Any) -> tuple:
        """
        Note une question selon son type
        Returns: (is_correct: bool, points_earned: float)
        """
        if question.type == 'single-choice':
            is_correct = user_answer == question.correctAnswer
            return is_correct, question.points if is_correct else 0
        
        elif question.type == 'multiple-choice':
            # Toutes les réponses doivent être correctes
            user_set = set(user_answer) if isinstance(user_answer, list) else set()
            correct_set = set(question.correctAnswers)
            is_correct = user_set == correct_set
            
            # Notation partielle possible
            if not is_correct:
                # Nombre de bonnes réponses / total attendu
                correct_count = len(user_set & correct_set)
                total_correct = len(correct_set)
                points = (correct_count / total_correct) * question.points
                return False, round(points, 2)
            
            return True, question.points
        
        elif question.type == 'true-false':
            is_correct = user_answer == question.correctAnswer
            return is_correct, question.points if is_correct else 0
        
        elif question.type == 'short-answer':
            # Vérifier si la réponse correspond à l'une des réponses acceptées
            user_answer_str = str(user_answer).strip()
            if not question.caseSensitive:
                user_answer_str = user_answer_str.lower()
                correct_answers = [a.lower() for a in question.correctAnswers]
            else:
                correct_answers = question.correctAnswers
            
            is_correct = user_answer_str in correct_answers
            return is_correct, question.points if is_correct else 0
        
        elif question.type == 'long-answer':
            # Nécessite notation manuelle
            # On retourne 0 points temporairement
            return None, 0
        
        elif question.type == 'fill-blank':
            # Vérifier chaque trou
            if not isinstance(user_answer, list):
                return False, 0
            
            if len(user_answer) != len(question.correctAnswers):
                return False, 0
            
            correct_count = sum(
                1 for user, correct in zip(user_answer, question.correctAnswers)
                if user.strip().lower() == correct.strip().lower()
            )
            
            is_correct = correct_count == len(question.correctAnswers)
            points = (correct_count / len(question.correctAnswers)) * question.points
            
            return is_correct, round(points, 2)
        
        elif question.type == 'matching':
            # Vérifier chaque paire
            if not isinstance(user_answer, list):
                return False, 0
            
            user_pairs = set((p['left'], p['right']) for p in user_answer)
            correct_pairs = set(
                (m.left, m.right) for m in question.correctMatches
            )
            
            correct_count = len(user_pairs & correct_pairs)
            total_pairs = len(correct_pairs)
            
            is_correct = user_pairs == correct_pairs
            points = (correct_count / total_pairs) * question.points
            
            return is_correct, round(points, 2)
        
        elif question.type == 'ordering':
            # Vérifier l'ordre exact
            is_correct = user_answer == question.correctOrder
            return is_correct, question.points if is_correct else 0
        
        return False, 0
```

---

## Permissions et sécurité

### Matrice de Permissions

| Action | Superadmin | OF Admin | Formateur Interne | Créateur Contenu | Formateur Indep. | Apprenant |
|--------|-----------|----------|-------------------|------------------|------------------|-----------|
| **Créer Quiz** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Modifier Quiz** | ✅ | ✅ | ✅ (ses cours) | ✅ (ses cours) | ✅ (ses cours) | ❌ |
| **Supprimer Quiz** | ✅ | ✅ | ✅ (ses cours) | ❌ | ✅ (ses cours) | ❌ |
| **Créer Devoir** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Modifier Devoir** | ✅ | ✅ | ✅ (ses cours) | ✅ (ses cours) | ✅ (ses cours) | ❌ |
| **Créer Certification** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Passer Évaluation** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (inscrit) |
| **Noter Devoir** | ✅ | ✅ | ✅ (ses cours) | ❌ | ✅ (ses cours) | ❌ |
| **Voir Stats** | ✅ | ✅ | ✅ (ses cours) | ✅ (ses cours) | ✅ (ses cours) | ✅ (ses résultats) |

### Middleware de Permissions

```python
from fastapi import HTTPException, status
from typing import List

async def check_evaluation_permission(
    user_id: int,
    user_role: str,
    action: str,
    course_id: str = None,
    evaluation_id: str = None
):
    """
    Vérifie les permissions pour les actions sur les évaluations
    """
    # Superadmin a tous les droits
    if user_role == 'superadmin':
        return True
    
    # OF Admin a tous les droits dans son OF
    if user_role == 'of_admin':
        # Vérifier que le cours appartient à son OF
        if course_id:
            course = await get_course(course_id)
            user_of = await get_user_organization(user_id)
            if course.owner_id == user_of.id:
                return True
    
    # Formateurs peuvent créer/modifier dans leurs cours
    if user_role in ['formateur_interne', 'createur_contenu', 'independent_trainer']:
        if action in ['create', 'update', 'delete', 'grade']:
            # Vérifier que c'est le créateur du cours
            if course_id:
                course = await get_course(course_id)
                if course.created_by == user_id:
                    return True
    
    # Apprenants peuvent seulement passer les évaluations
    if user_role == 'apprenant' and action == 'submit':
        # Vérifier l'inscription au cours
        if course_id:
            is_enrolled = await check_enrollment(user_id, course_id)
            if is_enrolled:
                return True
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Vous n'avez pas la permission pour cette action"
    )
```

### Mode Examen pour Certification

```python
class CertificationSubmission:
    """
    Implémente les restrictions du mode examen
    """
    
    @staticmethod
    async def start_exam(evaluation_id: str, user_id: int):
        """
        Démarre une session d'examen sécurisée
        """
        # Vérifier les prérequis
        cert = await get_certification(evaluation_id)
        if cert.settings.prerequisites:
            for prereq_id in cert.settings.prerequisites:
                result = await get_user_result(user_id, prereq_id)
                if not result or not result.is_passing:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Prérequis {prereq_id} non validé"
                    )
        
        # Vérifier les tentatives restantes
        attempts = await get_user_attempts(user_id, evaluation_id)
        if len(attempts) >= cert.settings.max_attempts:
            raise HTTPException(
                status_code=400,
                detail="Nombre maximum de tentatives atteint"
            )
        
        # Créer une session d'examen
        session = {
            'user_id': user_id,
            'evaluation_id': evaluation_id,
            'started_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(
                minutes=cert.settings.time_limit
            ),
            'exam_mode': cert.settings.exam_mode,
            'randomize_questions': cert.settings.randomize_questions
        }
        
        # Randomiser les questions si activé
        questions = await get_evaluation_questions(evaluation_id)
        if session['randomize_questions']:
            random.shuffle(questions)
        
        session['questions_order'] = [str(q.id) for q in questions]
        
        # Enregistrer la session
        await save_exam_session(session)
        
        return {
            'session_id': session['id'],
            'expires_at': session['expires_at'],
            'questions': questions,
            'exam_mode_enabled': session['exam_mode']
        }
    
    @staticmethod
    async def validate_submission(
        evaluation_id: str,
        user_id: int,
        submission_data: dict
    ):
        """
        Valide une soumission d'examen
        """
        session = await get_active_exam_session(user_id, evaluation_id)
        
        if not session:
            raise HTTPException(400, "Aucune session d'examen active")
        
        # Vérifier le délai
        if datetime.utcnow() > session['expires_at']:
            raise HTTPException(400, "Temps limite dépassé")
        
        # Vérifier que toutes les questions ont été répondues
        answered = set(a['question_id'] for a in submission_data['answers'])
        required = set(session['questions_order'])
        
        if answered != required:
            raise HTTPException(400, "Toutes les questions doivent être répondues")
        
        # Marquer la session comme complétée
        await complete_exam_session(session['id'])
        
        return True
```

---

## Gestion des erreurs

### Codes d'erreur standards

| Code HTTP | Signification | Utilisation |
|-----------|--------------|-------------|
| 400 | Bad Request | Données invalides, tentatives dépassées, temps limite |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Évaluation/cours/question inexistant |
| 409 | Conflict | Tentative de création en doublon |
| 422 | Unprocessable Entity | Erreurs de validation Pydantic |
| 500 | Internal Server Error | Erreur serveur |

### Exemples de réponses d'erreur

```json
// 400 - Tentatives dépassées
{
  "detail": "Nombre maximum de tentatives atteint (3/3)",
  "error_code": "MAX_ATTEMPTS_EXCEEDED",
  "max_attempts": 3,
  "attempts_used": 3
}

// 403 - Permission refusée
{
  "detail": "Vous devez être inscrit au cours pour passer cette évaluation",
  "error_code": "NOT_ENROLLED",
  "course_id": "course_mongo_id"
}

// 400 - Prérequis non validé
{
  "detail": "Vous devez valider les prérequis avant de passer la certification",
  "error_code": "PREREQUISITES_NOT_MET",
  "missing_prerequisites": [
    {
      "id": "assignment_uuid",
      "title": "Projet Module 1",
      "status": "not_passed"
    }
  ]
}

// 422 - Validation Pydantic
{
  "detail": [
    {
      "loc": ["body", "questions", 0, "correctAnswer"],
      "msg": "correctAnswer index 5 out of range for 4 options",
      "type": "value_error"
    }
  ]
}

// 400 - Temps limite dépassé
{
  "detail": "Le temps limite de 90 minutes a été dépassé",
  "error_code": "TIME_LIMIT_EXCEEDED",
  "time_limit": 90,
  "time_spent": 95
}
```

---

## Migration Alembic

```python
"""Add evaluations tables

Revision ID: add_evaluations
Revises: previous_migration
Create Date: 2025-01-10 10:00:00
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

def upgrade():
    # Créer les types ENUM
    evaluation_type = sa.Enum(
        'quiz', 'assignment', 'certification',
        name='evaluation_type'
    )
    evaluation_type.create(op.get_bind())
    
    feedback_timing = sa.Enum(
        'immediate', 'after-submit', 'never',
        name='feedback_timing'
    )
    feedback_timing.create(op.get_bind())
    
    # Table evaluations
    op.create_table(
        'evaluations',
        sa.Column('id', UUID, primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('course_id', sa.String(), nullable=False),
        sa.Column('module_id', sa.Integer(), nullable=True),
        sa.Column('lesson_id', sa.Integer(), nullable=True),
        sa.Column('type', evaluation_type, nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('instructions', sa.Text()),
        
        # Settings
        sa.Column('show_feedback', feedback_timing, server_default='after-submit'),
        sa.Column('allow_retry', sa.Boolean(), server_default='true'),
        sa.Column('max_attempts', sa.Integer(), server_default='3'),
        sa.Column('randomize_questions', sa.Boolean(), server_default='false'),
        sa.Column('randomize_options', sa.Boolean(), server_default='false'),
        sa.Column('time_limit', sa.Integer()),
        sa.Column('passing_score', sa.Integer(), nullable=False, server_default='70'),
        
        # Assignment specific
        sa.Column('due_date', sa.TIMESTAMP()),
        sa.Column('allow_late_submission', sa.Boolean(), server_default='false'),
        sa.Column('requires_manual_grading', sa.Boolean(), server_default='false'),
        sa.Column('rubric', JSONB),
        
        # Certification specific
        sa.Column('exam_mode', sa.Boolean(), server_default='false'),
        sa.Column('show_results_immediately', sa.Boolean(), server_default='true'),
        sa.Column('certificate_template', sa.String(255)),
        sa.Column('prerequisites', JSONB),
        
        # Metadata
        sa.Column('created_by', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now())
    )
    
    # Contrainte de niveau
    op.create_check_constraint(
        'chk_evaluation_level',
        'evaluations',
        """
        (type = 'quiz' AND lesson_id IS NOT NULL) OR
        (type = 'assignment' AND module_id IS NOT NULL AND lesson_id IS NULL) OR
        (type = 'certification' AND module_id IS NULL AND lesson_id IS NULL)
        """
    )
    
    # Index
    op.create_index('idx_evaluations_course', 'evaluations', ['course_id'])
    op.create_index('idx_evaluations_type', 'evaluations', ['type'])
    
    # Table evaluation_results
    op.create_table(
        'evaluation_results',
        sa.Column('id', UUID, primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('evaluation_id', UUID, sa.ForeignKey('evaluations.id', ondelete='CASCADE')),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE')),
        
        sa.Column('score', sa.Numeric(5, 2), nullable=False),
        sa.Column('points_earned', sa.Numeric(10, 2), nullable=False),
        sa.Column('total_points', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_passing', sa.Boolean(), nullable=False),
        
        sa.Column('attempt_number', sa.Integer(), nullable=False, server_default='1'),
        
        sa.Column('started_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('completed_at', sa.TIMESTAMP()),
        sa.Column('time_spent', sa.Integer()),
        
        sa.Column('feedback', sa.Text()),
        sa.Column('graded_by', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('graded_at', sa.TIMESTAMP()),
        
        sa.Column('status', sa.String(20), server_default='in_progress'),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now())
    )
    
    op.create_unique_constraint(
        'uq_evaluation_user_attempt',
        'evaluation_results',
        ['evaluation_id', 'user_id', 'attempt_number']
    )
    
    op.create_index('idx_results_evaluation', 'evaluation_results', ['evaluation_id'])
    op.create_index('idx_results_user', 'evaluation_results', ['user_id'])
    op.create_index('idx_results_status', 'evaluation_results', ['status'])
    
    # Table user_answers
    op.create_table(
        'user_answers',
        sa.Column('id', UUID, primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('result_id', UUID, sa.ForeignKey('evaluation_results.id', ondelete='CASCADE')),
        sa.Column('question_id', sa.String(), nullable=False),
        
        sa.Column('answer', JSONB, nullable=False),
        
        sa.Column('is_correct', sa.Boolean()),
        sa.Column('points_earned', sa.Numeric(10, 2)),
        
        sa.Column('time_spent', sa.Integer()),
        sa.Column('submitted_at', sa.TIMESTAMP(), server_default=sa.func.now())
    )
    
    op.create_unique_constraint(
        'uq_result_question',
        'user_answers',
        ['result_id', 'question_id']
    )
    
    op.create_index('idx_answers_result', 'user_answers', ['result_id'])
    op.create_index('idx_answers_question', 'user_answers', ['question_id'])

def downgrade():
    op.drop_table('user_answers')
    op.drop_table('evaluation_results')
    op.drop_table('evaluations')
    
    sa.Enum(name='evaluation_type').drop(op.get_bind())
    sa.Enum(name='feedback_timing').drop(op.get_bind())
```

---

## Tests Recommandés

### Tests Unitaires

```python
import pytest
from app.services.grading_service import GradingService

@pytest.fixture
def grading_service():
    return GradingService()

def test_single_choice_correct(grading_service):
    question = {
        "type": "single-choice",
        "points": 10,
        "correctAnswer": 2
    }
    user_answer = 2
    
    is_correct, points = grading_service._grade_question(question, user_answer)
    
    assert is_correct == True
    assert points == 10

def test_multiple_choice_partial_credit(grading_service):
    question = {
        "type": "multiple-choice",
        "points": 20,
        "correctAnswers": [0, 1, 2]
    }
    user_answer = [0, 1]  # 2 sur 3 correctes
    
    is_correct, points = grading_service._grade_question(question, user_answer)
    
    assert is_correct == False
    assert points == pytest.approx(13.33, 0.1)

def test_fill_blank_all_correct(grading_service):
    question = {
        "type": "fill-blank",
        "points": 15,
        "correctAnswers": ["react", "hooks", "state"]
    }
    user_answer = ["React", "Hooks", "State"]  # Case insensitive
    
    is_correct, points = grading_service._grade_question(question, user_answer)
    
    assert is_correct == True
    assert points == 15
```

### Tests d'Intégration

```python
@pytest.mark.asyncio
async def test_complete_quiz_workflow(client, db_session):
    # Créer un cours
    course = await create_test_course()
    
    # Créer un quiz
    quiz_data = {
        "type": "quiz",
        "course_id": str(course.id),
        "module_id": 1,
        "lesson_id": 1,
        "title": "Test Quiz",
        "questions": [
            {
                "type": "single-choice",
                "question": "Test?",
                "points": 10,
                "options": ["A", "B", "C"],
                "correctAnswer": 1
            }
        ],
        "settings": {
            "passing_score": 70
        }
    }
    
    response = await client.post(
        f"/api/courses/{course.id}/modules/1/lessons/1/quiz",
        json=quiz_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 201
    quiz = response.json()
    
    # Apprenant passe le quiz
    submission = {
        "evaluation_id": quiz["id"],
        "answers": [
            {"question_id": quiz["questions"][0]["id"], "answer": 1}
        ],
        "started_at": "2025-01-10T10:00:00Z",
        "completed_at": "2025-01-10T10:05:00Z"
    }
    
    response = await client.post(
        f"/api/evaluations/{quiz['id']}/submit",
        json=submission,
        headers={"Authorization": f"Bearer {student_token}"}
    )
    
    assert response.status_code == 201
    result = response.json()
    assert result["score"] == 100
    assert result["is_passing"] == True
```

---

## Résumé des Endpoints

### Quiz (Leçons)
- `POST /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz`
- `GET /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}`
- `PUT /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}`
- `DELETE /api/courses/{course_id}/modules/{module_id}/lessons/{lesson_id}/quiz/{quiz_id}`

### Devoirs (Modules)
- `POST /api/courses/{course_id}/modules/{module_id}/assignment`
- `GET /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`
- `PUT /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`
- `DELETE /api/courses/{course_id}/modules/{module_id}/assignment/{assignment_id}`

### Certifications (Cours)
- `POST /api/courses/{course_id}/certification`
- `GET /api/courses/{course_id}/certification/{certification_id}`
- `PUT /api/courses/{course_id}/certification/{certification_id}`
- `DELETE /api/courses/{course_id}/certification/{certification_id}`

### Soumissions et Résultats
- `POST /api/evaluations/{evaluation_id}/submit`
- `GET /api/evaluations/{evaluation_id}/results`
- `GET /api/evaluations/{evaluation_id}/results/history`
- `POST /api/evaluations/{evaluation_id}/grade`

### Statistiques
- `GET /api/evaluations/{evaluation_id}/stats`
- `GET /api/courses/{course_id}/stats/evaluations`
- `GET /api/users/{user_id}/evaluations/history`

### Cours Complets
- `GET /api/courses/{course_id}/full`

---

**Fin de la documentation API complète**
