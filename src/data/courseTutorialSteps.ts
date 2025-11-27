import step1Welcome from '@/assets/tutorial/step-1-welcome.jpg';
import step2Info from '@/assets/tutorial/step-2-info.jpg';
import step3Cover from '@/assets/tutorial/step-3-cover.jpg';
import step4Objectives from '@/assets/tutorial/step-4-objectives.jpg';
import step5Modules from '@/assets/tutorial/step-5-modules.jpg';
import step6Lessons from '@/assets/tutorial/step-6-lessons.jpg';
import step7Quiz from '@/assets/tutorial/step-7-quiz.jpg';
import step8Publish from '@/assets/tutorial/step-8-publish.jpg';

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image: string;
  tips?: string[];
}

export const courseTutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Bienvenue dans le créateur de cours",
    description: "Ce tutoriel vous guidera à travers toutes les étapes de création d'un cours complet sur la plateforme. Vous apprendrez à structurer votre contenu, ajouter des ressources et publier votre cours.",
    image: step1Welcome,
    tips: [
      "Préparez votre contenu à l'avance",
      "Organisez vos modules de manière logique",
      "Testez votre cours avant de le publier"
    ]
  },
  {
    id: 2,
    title: "Étape 1 : Informations générales du cours",
    description: "Commencez par renseigner les informations de base : titre accrocheur, description détaillée, prix, catégorie et niveau. Ces informations sont essentielles pour que les apprenants trouvent et comprennent votre cours.",
    image: step2Info,
    tips: [
      "Choisissez un titre clair et descriptif",
      "Rédigez une description complète et engageante",
      "Sélectionnez la bonne catégorie pour le référencement"
    ]
  },
  {
    id: 3,
    title: "Étape 2 : Image de couverture et cycles d'apprentissage",
    description: "Ajoutez une image de couverture attractive qui représente bien votre cours. Sélectionnez ensuite les cycles d'apprentissage appropriés pour cibler le bon public.",
    image: step3Cover,
    tips: [
      "Utilisez une image de haute qualité (minimum 1200x630px)",
      "L'image doit être pertinente au contenu du cours",
      "Vous pouvez sélectionner plusieurs cycles"
    ]
  },
  {
    id: 4,
    title: "Étape 3 : Objectifs pédagogiques et programme",
    description: "Définissez clairement les objectifs d'apprentissage de votre cours. Vous pouvez également télécharger un document PDF présentant le programme détaillé du cours.",
    image: step4Objectives,
    tips: [
      "Formulez des objectifs mesurables et concrets",
      "Utilisez des verbes d'action (apprendre, comprendre, maîtriser)",
      "Le programme PDF est optionnel mais recommandé"
    ]
  },
  {
    id: 5,
    title: "Étape 4 : Créer et organiser vos modules",
    description: "Structurez votre cours en modules thématiques. Chaque module doit avoir un titre clair et une description. Vous pouvez réorganiser vos modules par glisser-déposer.",
    image: step5Modules,
    tips: [
      "Un module = un thème ou concept majeur",
      "Organisez les modules de manière progressive",
      "Limitez-vous à 5-10 modules pour une meilleure clarté"
    ]
  },
  {
    id: 6,
    title: "Étape 5 : Ajouter des leçons à vos modules",
    description: "Enrichissez chaque module avec des leçons. Vous pouvez uploader des vidéos, PDFs ou images, ou utiliser des URLs de vidéos. Ajoutez également des ressources pédagogiques téléchargeables.",
    image: step6Lessons,
    tips: [
      "Variez les formats : vidéos, documents, images",
      "Gardez vos leçons courtes et ciblées (5-15 min)",
      "Ajoutez des ressources complémentaires si pertinent"
    ]
  },
  {
    id: 7,
    title: "Étape 6 : Créer des quiz et devoirs",
    description: "Évaluez la compréhension des apprenants avec des quiz et des devoirs. Vous pouvez créer différents types de questions : choix unique, choix multiple, vrai/faux, réponses courtes, etc.",
    image: step7Quiz,
    tips: [
      "Les quiz renforcent l'apprentissage",
      "Variez les types de questions",
      "Les devoirs permettent une évaluation plus approfondie"
    ]
  },
  {
    id: 8,
    title: "Étape 7 : Révision et publication",
    description: "Avant de publier, vérifiez que toutes les sections sont complètes. Vous pouvez sauvegarder en brouillon pour continuer plus tard, ou publier directement pour rendre votre cours accessible aux apprenants.",
    image: step8Publish,
    tips: [
      "Relisez tout le contenu avant publication",
      "Vérifiez que tous les médias sont bien uploadés",
      "Testez la navigation entre les leçons",
      "Utilisez 'Brouillon' pour sauvegarder votre progression"
    ]
  }
];
