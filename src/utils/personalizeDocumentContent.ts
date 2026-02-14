import { DEFAULT_TEMPLATES } from '@/components/admin/documents/defaultTemplates';

interface FormationBasic {
  id: string;
  name: string;
}

/**
 * Personnalise le contenu HTML d'un template de document avec les données réelles.
 * Utilisé côté apprenant pour la prévisualisation des documents envoyés par l'OF.
 */
interface OFDetails {
  na?: string;
  siret?: string;
  nda?: string; // Numéro de déclaration d'activité
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  logo?: string;
}

interface LearnerDetails {
  firstName: string;
  lastName: string;
  company?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  email?: string;
}

/**
 * Personnalise le contenu HTML d'un template de document avec les données réelles.
 * Utilisé côté apprenant pour la prévisualisation des documents envoyés par l'OF.
 */
export const personalizeDocumentContent = (
  template: string,
  formation: FormationBasic,
  ofData?: OFDetails,
  learnerData?: LearnerDetails,
  learnerSignature?: string
): string => {
  // Récupérer la signature OF depuis localStorage ou utiliser celle fournie
  const storedSignature = localStorage.getItem('of_official_signature');
  const signatureHtml = storedSignature
    ? `<img src="${storedSignature}" alt="Signature OF" style="max-height: 60px; max-width: 200px;" />`
    : '<span style="color: #999; font-style: italic;">[Signature OF]</span>';

  // Signature de l'apprenant
  const learnerSignatureHtml = learnerSignature
    ? `<div style="margin-top: 10px;"><img src="${learnerSignature}" alt="Signature apprenant" style="max-height: 60px; max-width: 200px;" /><p style="font-size: 12px; color: #666; margin-top: 5px;">Signé électroniquement</p></div>`
    : '';

  let content = template;

  // Remplacement des données de l'OF
  content = content
    .replace(/\{\{of\.nom\}\}/g, ofData?.na || 'Nom de l\'OF')
    .replace(/\{\{of\.siret\}\}/g, ofData?.siret || 'SIRET non renseigné')
    .replace(/\{\{of\.nda\}\}/g, ofData?.nda || 'NDA non renseigné')
    .replace(/\{\{of\.adresse\}\}/g, ofData?.address || '')
    .replace(/\{\{of\.codePostal\}\}/g, ofData?.postalCode || '')
    .replace(/\{\{of\.ville\}\}/g, ofData?.city || '')
    .replace(/\{\{of\.telephone\}\}/g, ofData?.phone || '')
    .replace(/\{\{of\.email\}\}/g, ofData?.email || '')
    .replace(/\{\{of\.responsable\}\}/g, ofData?.managerName || 'Responsable de formation')
    .replace(/\{\{of\.signature\}\}/g, signatureHtml);

  // Remplacement des données de la formation
  content = content
    .replace(/\{\{formation\.nom\}\}/g, formation.name || 'Formation')
    .replace(/\{\{formation\.duree\}\}/g, 'Variable') // À dynamiser si dispo
    .replace(/\{\{formation\.lieu\}\}/g, 'À distance / E-learning')
    .replace(/\{\{formation\.prix\}\}/g, '-') // À dynamiser si dispo
    .replace(/\{\{formation\.formateur\}\}/g, '-') // À dynamiser si dispo
    .replace(/\{\{dates\.debut\}\}/g, new Date().toLocaleDateString('fr-FR')) // À dynamiser
    .replace(/\{\{dates\.fin\}\}/g, '-') // À dynamiser
    .replace(/\{\{date\.jour\}\}/g, new Date().toLocaleDateString('fr-FR'));

  // Remplacement des données de l'apprenant
  if (learnerData) {
    content = content
      .replace(/\{\{apprenant\.nom\}\}/g, learnerData.lastName || '')
      .replace(/\{\{apprenant\.prenom\}\}/g, learnerData.firstName || '')
      .replace(/\{\{apprenant\.entreprise\}\}/g, learnerData.company || '')
      .replace(/\{\{apprenant\.adresse\}\}/g, learnerData.address || '')
      .replace(/\{\{apprenant\.codePostal\}\}/g, learnerData.postalCode || '')
      .replace(/\{\{apprenant\.ville\}\}/g, learnerData.city || '')
      .replace(/\{\{apprenant\.telephone\}\}/g, learnerData.phone || '')
      .replace(/\{\{apprenant\.email\}\}/g, learnerData.email || '');

    // Remplacement zone de signature
    content = content
      .replace(/<p style="margin-bottom: 60px;"><strong>Le stagiaire<\/strong> \(mention "Lu et approuvé"\)<\/p>/g,
        `<p><strong>Le stagiaire</strong> (mention "Lu et approuvé")</p>${learnerSignatureHtml}`)
      .replace(/<p style="margin-top: 50px;">{{apprenant\.prenom}} {{apprenant\.nom}}<br\/>Date : {{date\.jour}}<\/p>/g,
        `${learnerSignatureHtml}<p>${learnerData.firstName} ${learnerData.lastName}<br/>Date : ${new Date().toLocaleDateString('fr-FR')}</p>`);
  } else {
    // Nettoyage des placeholders si pas de données apprenant
    content = content
      .replace(/\{\{apprenant\..*?\}\}/g, '....................');
  }

  return content;
};

/**
 * Mapping des types de documents côté apprenant vers les clés de DEFAULT_TEMPLATES.
 * Permet de retrouver le template HTML correspondant à un type de document.
 */
const TEMPLATE_TYPE_MAP: Record<string, keyof typeof DEFAULT_TEMPLATES> = {
  cgv: 'cgv',
  convention: 'convention',
  programme: 'programme',
  convocation: 'convocation',
  emargement: 'emargement',
  attestation: 'attestation',
  certificat: 'certificat',
  cgv_ri: 'cgv',
  analyse_besoin: 'analyse_besoin',
  test_positionnement: 'test_positionnement',
  reglement_interieur: 'reglement_interieur',
  attestation_honneur: 'attestation_honneur',
  test_sortie: 'test_sortie',
  satisfaction_chaud: 'satisfaction_chaud',
  satisfaction_froid: 'satisfaction_froid',
};

/**
 * Récupère le template HTML pour un type de document donné.
 * Retourne undefined si aucun template n'existe pour ce type.
 */
export const getTemplateForType = (docType: string): string | undefined => {
  const templateKey = TEMPLATE_TYPE_MAP[docType];
  if (!templateKey) return undefined;
  return DEFAULT_TEMPLATES[templateKey];
};
