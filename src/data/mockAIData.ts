
export interface AIPromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  example: string;
}

export interface AIGeneratedModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  lessons: AIGeneratedLesson[];
}

export interface AIGeneratedLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  exercises?: AIGeneratedExercise[];
  resources?: string[];
}

export interface AIGeneratedExercise {
  id: string;
  type: 'quiz' | 'text' | 'choice';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface CourseAIData {
  title: string;
  description: string;
  level: string;
  category: string;
  estimatedDuration: number;
  modules: AIGeneratedModule[];
  objectives: string[];
  prerequisites: string[];
}

export const promptTemplates: AIPromptTemplate[] = [
  {
    id: "1",
    title: "Mathématiques élémentaire",
    description: "Template pour cours de mathématiques niveau élémentaire",
    category: "Mathématiques",
    level: "CP-CE2",
    example: "Créer un cours sur les additions et soustractions pour les élèves de CP, avec des exercices pratiques et des jeux éducatifs"
  },
  {
    id: "2", 
    title: "Sciences naturelles collège",
    description: "Template pour cours de sciences niveau collège",
    category: "Sciences",
    level: "6ème-3ème",
    example: "Développer un cours sur l'écosystème forestier pour les élèves de 5ème, incluant la biodiversité et les chaînes alimentaires"
  },
  {
    id: "3",
    title: "Français expression écrite",
    description: "Template pour développer l'expression écrite",
    category: "Français",
    level: "CE1-CM2",
    example: "Enseigner la rédaction d'une histoire courte aux élèves de CE2, avec structure narrative et personnages"
  },
  {
    id: "4",
    title: "Histoire chronologique",
    description: "Template pour cours d'histoire avec chronologie",
    category: "Histoire-Géographie",
    level: "CM1-3ème",
    example: "Présenter la Révolution française aux élèves de 4ème avec les causes, événements clés et conséquences"
  }
];

export const mockAIResponse = {
  mathCP: {
    title: "Les Nombres de 0 à 20 - Découverte et Manipulation",
    description: "Un parcours ludique pour apprendre à compter, reconnaître et manipuler les nombres de 0 à 20",
    level: "CP",
    category: "Mathématiques",
    estimatedDuration: 480, // 8 heures
    objectives: [
      "Reconnaître et nommer les nombres de 0 à 20",
      "Comprendre la notion de quantité",
      "Effectuer des additions simples",
      "Utiliser les nombres dans des situations concrètes"
    ],
    prerequisites: [
      "Savoir compter oralement jusqu'à 10",
      "Reconnaître quelques chiffres"
    ],
    modules: [
      {
        id: "mod1",
        title: "Découverte des nombres 0-10",
        description: "Introduction aux premiers nombres avec manipulation d'objets",
        duration: 120,
        order: 1,
        lessons: [
          {
            id: "les1",
            title: "Les nombres 0, 1, 2, 3",
            description: "Découverte des premiers nombres avec des objets concrets",
            content: "Dans cette leçon, nous allons découvrir les nombres 0, 1, 2 et 3.\n\n**Objectifs:**\n- Reconnaître ces nombres\n- Les associer à des quantités\n- Les écrire correctement\n\n**Activité 1: Compter avec les doigts**\nMontrons avec nos doigts:\n- 0 doigt (poing fermé)\n- 1 doigt\n- 2 doigts\n- 3 doigts\n\n**Activité 2: Compter les objets**\nRegardons autour de nous et comptons:\n- 1 tableau\n- 2 crayons\n- 3 livres",
            duration: 30,
            order: 1,
            exercises: [
              {
                id: "ex1",
                type: "choice" as const,
                question: "Combien de pommes vois-tu sur l'image ?",
                options: ["1", "2", "3"],
                correctAnswer: "2"
              }
            ],
            resources: ["Objets de manipulation", "Images numériques"]
          },
          {
            id: "les2", 
            title: "Les nombres 4, 5, 6",
            description: "Suite de la découverte avec les nombres suivants",
            content: "Continuons notre exploration avec les nombres 4, 5 et 6.\n\n**Rappel:**\nNous connaissons déjà 0, 1, 2, 3\n\n**Nouveaux nombres:**\n- Le 4 : comme les pattes d'un chat\n- Le 5 : comme les doigts d'une main\n- Le 6 : comme les faces d'un dé\n\n**Activité: La boîte à compter**\nPrenons des cubes et comptons ensemble de 4 à 6.",
            duration: 30,
            order: 2,
            exercises: [
              {
                id: "ex2",
                type: "quiz" as const,
                question: "Quel nombre vient après 5 ?",
                options: ["4", "6", "7"],
                correctAnswer: "6"
              }
            ],
            resources: []
          }
        ]
      },
      {
        id: "mod2",
        title: "Les nombres 11-20",
        description: "Extension vers les nombres plus grands",
        duration: 180,
        order: 2,
        lessons: [
          {
            id: "les3",
            title: "Onze, douze, treize...",
            description: "Introduction aux nombres de 11 à 15",
            content: "Maintenant que nous maîtrisons 0-10, découvrons les nombres suivants!\n\n**Les nombres de 11 à 15:**\n- 11 (onze) = 10 + 1\n- 12 (douze) = 10 + 2\n- 13 (treize) = 10 + 3\n- 14 (quatorze) = 10 + 4\n- 15 (quinze) = 10 + 5\n\n**Astuce:**\nTous ces nombres se construisent en ajoutant à 10 !\n\n**Activité: Les collections**\nComptons les objets par groupe de 10 + quelques-uns.",
            duration: 45,
            order: 1,
            exercises: [],
            resources: []
          }
        ]
      },
      {
        id: "mod3",
        title: "Premières additions",
        description: "Introduction au calcul avec les petits nombres",
        duration: 180,
        order: 3,
        lessons: [
          {
            id: "les4",
            title: "Additionner avec les doigts",
            description: "Apprendre à calculer 1+1, 2+1, etc.",
            content: "L'addition, c'est **ajouter** des quantités ensemble.\n\n**Exemples simples:**\n- 1 + 1 = 2 (un doigt + un doigt = deux doigts)\n- 2 + 1 = 3 (deux doigts + un doigt = trois doigts)\n- 1 + 2 = 3 (même résultat !)\n\n**Le signe +**\nLe signe + veut dire \"plus\" ou \"ajouter\"\n\n**Le signe =**\nLe signe = veut dire \"égal\" ou \"ça fait\"\n\n**Activité pratique:**\nUtilisons nos doigts pour calculer :\n- 3 + 1\n- 2 + 2\n- 1 + 3",
            duration: 60,
            order: 1,
            exercises: [
              {
                id: "ex3",
                type: "text" as const,
                question: "Calcule: 2 + 3 = ?"
              }
            ],
            resources: []
          }
        ]
      }
    ]
  } as CourseAIData
};

export const aiGenerationSteps = [
  { id: 1, title: "Analyse du prompt", description: "Compréhension des besoins pédagogiques" },
  { id: 2, title: "Structure du cours", description: "Création de l'architecture modulaire" },
  { id: 3, title: "Génération du contenu", description: "Rédaction des leçons et exercices" },
  { id: 4, title: "Optimisation pédagogique", description: "Adaptation au niveau et objectifs" }
];

export const estimatedCosts = {
  outline: { tokens: 1200, cost: 0.003 },
  content: { tokens: 8500, cost: 0.021 },
  total: { tokens: 9700, cost: 0.024 }
};
