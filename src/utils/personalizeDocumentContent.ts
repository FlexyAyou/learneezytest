import { DEFAULT_TEMPLATES } from '@/components/admin/documents/defaultTemplates';

interface FormationBasic {
  id: string;
  name: string;
}

/**
 * Personnalise le contenu HTML d'un template de document avec les données réelles.
 * Utilisé côté apprenant pour la prévisualisation des documents envoyés par l'OF.
 */
export const personalizeDocumentContent = (
  template: string,
  formation: FormationBasic,
  learnerSignature?: string
): string => {
  // Récupérer la signature OF depuis localStorage
  const storedSignature = localStorage.getItem('of_official_signature');
  const signatureHtml = storedSignature
    ? `<img src="${storedSignature}" alt="Signature OF" style="max-height: 60px; max-width: 200px;" />`
    : '<span style="color: #999; font-style: italic;">[Signature OF]</span>';

  // Signature de l'apprenant
  const learnerSignatureHtml = learnerSignature
    ? `<div style="margin-top: 10px;"><img src="${learnerSignature}" alt="Signature apprenant" style="max-height: 60px; max-width: 200px;" /><p style="font-size: 12px; color: #666; margin-top: 5px;">Signé électroniquement</p></div>`
    : '';

  return template
    .replace(/\{\{of\.nom\}\}/g, 'InfinitiAX Formation')
    .replace(/\{\{of\.siret\}\}/g, '123 456 789 00012')
    .replace(/\{\{of\.nda\}\}/g, '11 75 12345 75')
    .replace(/\{\{of\.adresse\}\}/g, '15 Rue de la Formation')
    .replace(/\{\{of\.codePostal\}\}/g, '75001')
    .replace(/\{\{of\.ville\}\}/g, 'Paris')
    .replace(/\{\{of\.telephone\}\}/g, '01 23 45 67 89')
    .replace(/\{\{of\.email\}\}/g, 'contact@infinitiax.com')
    .replace(/\{\{of\.responsable\}\}/g, 'Jean Dupont')
    .replace(/\{\{of\.signature\}\}/g, signatureHtml)
    .replace(/\{\{formation\.nom\}\}/g, formation.name)
    .replace(/\{\{formation\.duree\}\}/g, '35 heures')
    .replace(/\{\{formation\.lieu\}\}/g, 'Paris - En présentiel')
    .replace(/\{\{formation\.prix\}\}/g, '1 500,00 €')
    .replace(/\{\{formation\.formateur\}\}/g, 'Jean Dupont')
    .replace(/\{\{dates\.debut\}\}/g, '15/01/2024')
    .replace(/\{\{dates\.fin\}\}/g, '19/01/2024')
    .replace(/\{\{date\.jour\}\}/g, new Date().toLocaleDateString('fr-FR'))
    .replace(/\{\{apprenant\.nom\}\}/g, 'Martin')
    .replace(/\{\{apprenant\.prenom\}\}/g, 'Sophie')
    .replace(/\{\{apprenant\.entreprise\}\}/g, 'Entreprise ABC')
    .replace(/\{\{apprenant\.adresse\}\}/g, '10 Rue Exemple')
    .replace(/\{\{apprenant\.codePostal\}\}/g, '75002')
    .replace(/\{\{apprenant\.ville\}\}/g, 'Paris')
    // Remplacer le placeholder du stagiaire par la signature si disponible
    .replace(/<p style="margin-bottom: 60px;"><strong>Le stagiaire<\/strong> \(mention "Lu et approuvé"\)<\/p>/g,
      `<p><strong>Le stagiaire</strong> (mention "Lu et approuvé")</p>${learnerSignatureHtml}`)
    .replace(/<p style="margin-top: 50px;">{{apprenant\.prenom}} {{apprenant\.nom}}<br\/>Date : {{date\.jour}}<\/p>/g,
      `${learnerSignatureHtml}<p>Sophie Martin<br/>Date : ${new Date().toLocaleDateString('fr-FR')}</p>`);
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
