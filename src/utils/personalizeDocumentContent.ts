import { DEFAULT_TEMPLATES } from '@/components/admin/documents/defaultTemplates';

interface FormationBasic {
  id: string;
  name: string;
  description?: string;
  duree?: string;
  lieu?: string;
  prix?: string;
  formateur?: string;
  startDate?: string;
  endDate?: string;
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
  const storedSignature = localStorage.getItem('of_official_signature');
  const signatureHtml = storedSignature
    ? `<img src="${storedSignature}" alt="Signature OF" style="max-height: 60px; max-width: 200px;" />`
    : '<span style="color: #999; font-style: italic;">[Signature OF]</span>';

  const learnerSignatureHtml = learnerSignature
    ? `<div style="margin-top: 10px;"><img src="${learnerSignature}" alt="Signature apprenant" style="max-height: 60px; max-width: 200px;" /><p style="font-size: 12px; color: #666; margin-top: 5px;">Signé électroniquement</p></div>`
    : '';

  // 1. Initial cleanup
  let content = template || '';
  if (!content) return '';

  content = content.trim();
  if (content.startsWith('convention:')) {
    content = content.replace(/^convention:\s*[`'"]?/, '').replace(/[`'"]?$/, '');
  }

  const today = new Date().toLocaleDateString('fr-FR');

  // 2. Prepare Replacements Map
  const replacements: Record<string, string | undefined> = {
    // Organisme
    'of.nom': ofData?.na,
    'of.siret': ofData?.siret,
    'of.nda': ofData?.nda,
    'of.adresse': ofData?.address,
    'of.code_postal': ofData?.postalCode,
    'of.codePostal': ofData?.postalCode,
    'of.ville': ofData?.city,
    'of.telephone': ofData?.phone,
    'of.email': ofData?.email,
    'of.responsable': ofData?.managerName,
    'of.signature': ofData?.logo || signatureHtml,

    // Formation
    'formation.nom': formation.name,
    'formation.description': formation.description || 'Action de formation professionnelle',
    'formation.duree': formation.duree || 'Selon parcours',
    'formation.lieu': formation.lieu || 'À distance / Centre',
    'formation.prix': formation.prix || '-',
    'formation.formateur': formation.formateur || '-',

    // Dates
    'dates.debut': formation.startDate || undefined,
    'dates.fin': formation.endDate || undefined,
    'date.jour': today,
    'dates.aujourdhui': today,
    'dates.signature': today,

    // Apprenant
    'apprenant.nom': learnerData?.lastName,
    'apprenant.prenom': learnerData?.firstName,
    'apprenant.nom_complet': `${learnerData?.firstName || ''} ${learnerData?.lastName || ''}`.trim(),
    'apprenant.nomComplet': `${learnerData?.firstName || ''} ${learnerData?.lastName || ''}`.trim(),
    'apprenant.email': learnerData?.email,
    'apprenant.telephone': learnerData?.phone,
    'apprenant.adresse': learnerData?.address,
    'apprenant.code_postal': learnerData?.postalCode,
    'apprenant.codePostal': learnerData?.postalCode,
    'apprenant.ville': learnerData?.city,
    'apprenant.entreprise': learnerData?.company,
    'apprenant.societe': learnerData?.company,
  };

  // 3. Execution of smart replacements
  Object.entries(replacements).forEach(([key, value]) => {
    const parts = key.split('.');
    if (parts.length !== 2) {
      // Handle simple keys like {{date_jour}}
      const regex = new RegExp(`\\{\\{[\\s\\u00A0&nbsp;]*(?:<[^>]+>)*${key}(?:<[^>]+>)*[\\s\\u00A0&nbsp;]*\\}\\}`, 'gi');
      content = content.replace(regex, value !== undefined && value !== null ? String(value) : '');
      return;
    }

    const [prefix, suffix] = parts;

    // Extremely Robust Regex: handles any number of HTML tags, spaces, entities, dots, underscores between prefix and suffix
    // Match {{ (tags/spaces) prefix (tags/spaces/dots/underscores) suffix (tags/spaces) }}
    const regex = new RegExp(
      `\\{\\{[\\s\\u00A0&nbsp;]*(?:<[^>]+>|[\\s\\u00A0&nbsp;])*${prefix}(?:<[^>]+>|[\\s\\u00A0&nbsp;\\._])+${suffix}(?:<[^>]+>|[\\s\\u00A0&nbsp;])*\\}\\}`,
      'gi'
    );

    const replacementValue = value !== undefined && value !== null ? String(value) : '';
    content = content.replace(regex, replacementValue);
  });

  // 4. Specific signature zone handling
  if (learnerData) {
    const fullName = `${learnerData.firstName} ${learnerData.lastName}`;
    content = content
      .replace(/<p style="margin-bottom: 60px;"><strong>Le stagiaire<\/strong> \(mention "Lu et approuvé"\)<\/p>/g,
        `<p><strong>Le stagiaire</strong> (mention "Lu et approuvé")</p>${learnerSignatureHtml}`)
      .replace(/<p style="margin-top: 50px;">\{\{\s*apprenant\.prenom\s*\}\} \{\{\s*apprenant\.nom\s*\}\}<br\/>Date : \{\{\s*date\.jour\s*\}\}<\/p>/g,
        `${learnerSignatureHtml}<p>${fullName}<br/>Date : ${today}</p>`);

    // Fallback for non-braced names if they are static in some templates
    if (content.includes('La signature sera apposée ici') && learnerSignatureHtml) {
      content = content.replace('La signature sera apposée ici', learnerSignatureHtml);
    }
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
