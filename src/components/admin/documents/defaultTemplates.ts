import { DocumentType } from './types';

// Default HTML templates for common document types
export const DEFAULT_TEMPLATES: Partial<Record<DocumentType, string>> = {
  cgv: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">CONDITIONS GÉNÉRALES DE VENTE</h1>
    <h2 style="font-size: 16px; color: #666;">Formation Professionnelle Continue</h2>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9;">
    <p style="margin: 0;"><strong>Organisme de Formation :</strong> {{of.nom}}</p>
    <p style="margin: 5px 0 0 0;"><strong>SIRET :</strong> {{of.siret}} | <strong>N° DA :</strong> {{of.nda}}</p>
    <p style="margin: 5px 0 0 0;"><strong>Adresse :</strong> {{of.adresse}}, {{of.codePostal}} {{of.ville}}</p>
    <p style="margin: 5px 0 0 0;"><strong>Contact :</strong> {{of.telephone}} | {{of.email}}</p>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 1 - Objet et champ d'application</h2>
  <p style="text-align: justify;">Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les formations proposées par {{of.nom}}. Toute inscription implique l'acceptation sans réserve des présentes CGV.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 2 - Inscription et formation</h2>
  <p style="text-align: justify;"><strong>Intitulé de la formation :</strong> {{formation.nom}}</p>
  <p style="text-align: justify;"><strong>Durée :</strong> {{formation.duree}}</p>
  <p style="text-align: justify;"><strong>Dates :</strong> du {{dates.debut}} au {{dates.fin}}</p>
  <p style="text-align: justify;"><strong>Lieu :</strong> {{formation.lieu}}</p>
  <p style="text-align: justify;"><strong>Prix :</strong> {{formation.prix}} (nets de taxes)</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 3 - Modalités de paiement</h2>
  <p style="text-align: justify;">Le règlement s'effectue par virement bancaire ou chèque à l'ordre de {{of.nom}}. Le paiement est dû à réception de la facture, sauf accord préalable pour un échéancier.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 4 - Annulation et report</h2>
  <p style="text-align: justify;">Conformément à l'article L.6353-5 du Code du travail, le stagiaire dispose d'un délai de rétractation de 10 jours à compter de la signature.</p>
  <p style="text-align: justify;">En cas d'annulation moins de 15 jours avant le début de la formation, 50% du montant reste dû. En cas d'annulation moins de 7 jours avant, la totalité du montant est due.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 5 - Obligations du stagiaire</h2>
  <p style="text-align: justify;">Le stagiaire s'engage à respecter le règlement intérieur de l'organisme de formation et à suivre assidûment la formation. Toute absence devra être justifiée.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 6 - Propriété intellectuelle</h2>
  <p style="text-align: justify;">L'ensemble des supports pédagogiques remis sont protégés par le droit d'auteur. Toute reproduction ou diffusion sans autorisation est interdite.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 7 - Protection des données personnelles</h2>
  <p style="text-align: justify;">Conformément au RGPD, les données personnelles collectées sont traitées pour la gestion administrative de la formation. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant {{of.email}}.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 8 - Responsabilité</h2>
  <p style="text-align: justify;">{{of.nom}} ne saurait être tenu responsable d'une inexécution de ses obligations due à un cas de force majeure ou à un fait imprévisible et insurmontable d'un tiers.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 9 - Litiges</h2>
  <p style="text-align: justify;">En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux compétents seront ceux du siège social de {{of.nom}}.</p>

  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="width: 45%;">
      <p style="margin-bottom: 15px;"><strong>Pour l'organisme de formation</strong></p>
      <div style="min-height: 60px; margin-bottom: 10px;">{{of.signature}}</div>
      <p>{{of.responsable}}</p>
      <p style="font-size: 12px; color: #666;">Date : {{date.jour}}</p>
    </div>
    <div style="width: 45%;">
      <p style="margin-bottom: 60px;"><strong>Le stagiaire</strong> (mention "Lu et approuvé")</p>
      <p>{{apprenant.prenom}} {{apprenant.nom}}</p>
      <p style="font-size: 12px; color: #666;">Date : {{date.jour}}</p>
    </div>
  </div>
</div>
`,

  programme: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px;">
    <h1 style="font-size: 28px; margin-bottom: 5px;">PROGRAMME DE FORMATION</h1>
    <h2 style="font-size: 20px; color: #444;">{{formation.nom}}</h2>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
    <div>
      <p style="margin: 0;"><strong>Organisme :</strong> {{of.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>N° DA :</strong> {{of.nda}}</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0;"><strong>Durée :</strong> {{formation.duree}}</p>
      <p style="margin: 5px 0 0 0;"><strong>Dates :</strong> {{dates.debut}} - {{dates.fin}}</p>
    </div>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">1. OBJECTIFS PÉDAGOGIQUES</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <p style="text-align: justify;">À l'issue de la formation, le stagiaire sera capable de :</p>
    <ul>
      <li>Maîtriser les concepts fondamentaux de la formation</li>
      <li>Appliquer les techniques et méthodologies enseignées</li>
      <li>Développer des compétences pratiques immédiatement opérationnelles</li>
      <li>Évaluer et améliorer ses pratiques professionnelles</li>
    </ul>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">2. PUBLIC VISÉ ET PRÉREQUIS</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <p><strong>Public concerné :</strong> Professionnels souhaitant développer leurs compétences dans ce domaine.</p>
    <p><strong>Prérequis :</strong> Aucun prérequis spécifique n'est exigé pour cette formation.</p>
    <p><strong>Accessibilité :</strong> Formation accessible aux personnes en situation de handicap. Nous contacter pour adapter les modalités.</p>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">3. CONTENU DE LA FORMATION</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <h3 style="font-size: 14px; color: #444;">Module 1 : Introduction et fondamentaux</h3>
    <ul>
      <li>Présentation des concepts clés</li>
      <li>Contexte et enjeux actuels</li>
      <li>Terminologie et vocabulaire technique</li>
    </ul>
    
    <h3 style="font-size: 14px; color: #444;">Module 2 : Approfondissement</h3>
    <ul>
      <li>Techniques avancées</li>
      <li>Études de cas pratiques</li>
      <li>Exercices d'application</li>
    </ul>
    
    <h3 style="font-size: 14px; color: #444;">Module 3 : Mise en pratique</h3>
    <ul>
      <li>Ateliers pratiques</li>
      <li>Travaux en groupe</li>
      <li>Restitution et feedback</li>
    </ul>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">4. MÉTHODES PÉDAGOGIQUES</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <ul>
      <li><strong>Apports théoriques :</strong> Présentations, supports visuels, documentation</li>
      <li><strong>Mises en situation :</strong> Exercices pratiques, études de cas réels</li>
      <li><strong>Échanges :</strong> Discussions en groupe, partage d'expériences</li>
      <li><strong>Supports remis :</strong> Documentation pédagogique, fiches pratiques, accès ressources en ligne</li>
    </ul>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">5. MODALITÉS D'ÉVALUATION</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <ul>
      <li><strong>Évaluation diagnostique :</strong> Questionnaire de positionnement en début de formation</li>
      <li><strong>Évaluation formative :</strong> Exercices pratiques et mises en situation tout au long de la formation</li>
      <li><strong>Évaluation sommative :</strong> QCM ou cas pratique final</li>
      <li><strong>Attestation :</strong> Remise d'une attestation de fin de formation mentionnant les objectifs atteints</li>
    </ul>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">6. INFORMATIONS PRATIQUES</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Lieu</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{formation.lieu}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Durée totale</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{formation.duree}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Dates</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Du {{dates.debut}} au {{dates.fin}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Horaires</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">9h00 - 12h30 / 14h00 - 17h30</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Formateur</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{formation.formateur}}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Tarif</strong></td>
        <td style="padding: 8px;">{{formation.prix}} (nets de taxes)</td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #333;">
    <p style="margin: 0; font-size: 14px;"><strong>Contact :</strong> {{of.nom}}</p>
    <p style="margin: 5px 0 0 0; font-size: 14px;">{{of.adresse}}, {{of.codePostal}} {{of.ville}}</p>
    <p style="margin: 5px 0 0 0; font-size: 14px;">Tél : {{of.telephone}} | Email : {{of.email}}</p>
  </div>
</div>
`,

  convention: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1 style="text-align: center; font-size: 22px;">CONVENTION DE FORMATION PROFESSIONNELLE</h1>
  <p style="text-align: center; font-size: 14px; color: #666;">Articles L.6353-1 et suivants du Code du travail</p>
  
  <h2 style="font-size: 16px; margin-top: 30px;">Entre les soussignés :</h2>
  
  <div style="padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
    <p><strong>L'organisme de formation :</strong> {{of.nom}}</p>
    <p>SIRET : {{of.siret}} | N° DA : {{of.nda}}</p>
    <p>Représenté par : {{of.responsable}}</p>
  </div>
  
  <div style="padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
    <p><strong>Le bénéficiaire :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
    <p>Entreprise : {{apprenant.entreprise}}</p>
    <p>Adresse : {{apprenant.adresse}}, {{apprenant.codePostal}} {{apprenant.ville}}</p>
  </div>
  
  <h2 style="font-size: 16px;">Il est convenu ce qui suit :</h2>
  
  <h3>Article 1 - Objet</h3>
  <p>{{of.nom}} s'engage à organiser l'action de formation : <strong>{{formation.nom}}</strong></p>
  
  <h3>Article 2 - Modalités</h3>
  <p><strong>Durée :</strong> {{formation.duree}}</p>
  <p><strong>Dates :</strong> du {{dates.debut}} au {{dates.fin}}</p>
  <p><strong>Lieu :</strong> {{formation.lieu}}</p>
  
  <h3>Article 3 - Prix</h3>
  <p>Le coût de la formation est fixé à <strong>{{formation.prix}}</strong> nets de taxes.</p>
  
  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="width: 45%;">
      <p><strong>L'organisme de formation</strong></p>
      <div style="min-height: 60px; margin: 15px 0;">{{of.signature}}</div>
      <p>{{of.responsable}}<br/>Date : {{date.jour}}</p>
    </div>
    <div style="width: 45%;">
      <p><strong>Le bénéficiaire</strong></p>
      <p style="margin-top: 50px;">{{apprenant.prenom}} {{apprenant.nom}}<br/>Date : {{date.jour}}</p>
    </div>
  </div>
</div>
`,

  convocation: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: right; margin-bottom: 30px;">
    <p>{{of.ville}}, le {{date.jour}}</p>
  </div>
  
  <div style="margin-bottom: 30px;">
    <p><strong>{{of.nom}}</strong></p>
    <p>{{of.adresse}}</p>
    <p>{{of.codePostal}} {{of.ville}}</p>
  </div>
  
  <div style="margin-bottom: 30px;">
    <p>À l'attention de :</p>
    <p><strong>{{apprenant.prenom}} {{apprenant.nom}}</strong></p>
    <p>{{apprenant.adresse}}</p>
    <p>{{apprenant.codePostal}} {{apprenant.ville}}</p>
  </div>
  
  <h1 style="text-align: center; font-size: 20px; margin: 40px 0;">CONVOCATION À LA SESSION DE FORMATION</h1>
  
  <p>Madame, Monsieur,</p>
  
  <p style="text-align: justify;">Nous avons le plaisir de vous confirmer votre inscription à la formation <strong>{{formation.nom}}</strong>.</p>
  
  <div style="padding: 20px; background: #f5f5f5; margin: 20px 0;">
    <p><strong>Date :</strong> du {{dates.debut}} au {{dates.fin}}</p>
    <p><strong>Horaires :</strong> 9h00 - 12h30 / 14h00 - 17h30</p>
    <p><strong>Lieu :</strong> {{formation.lieu}}</p>
    <p><strong>Formateur :</strong> {{formation.formateur}}</p>
  </div>
  
  <p style="text-align: justify;">Nous vous remercions de vous présenter 15 minutes avant le début de la formation muni(e) de cette convocation.</p>
  
  <p style="margin-top: 30px;">Cordialement,</p>
  <p style="margin-top: 40px;"><strong>{{of.responsable}}</strong><br/>{{of.nom}}</p>
</div>
`,

  attestation: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 3px double #333;">
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 28px; letter-spacing: 2px;">ATTESTATION DE FORMATION</h1>
  </div>
  
  <p style="text-align: center; font-size: 14px; margin-bottom: 30px;">
    {{of.nom}}<br/>
    N° de déclaration d'activité : {{of.nda}}
  </p>
  
  <p style="text-align: center; font-size: 16px; margin: 30px 0;">atteste que</p>
  
  <p style="text-align: center; font-size: 22px; font-weight: bold; margin: 20px 0;">
    {{apprenant.prenom}} {{apprenant.nom}}
  </p>
  
  <p style="text-align: center; font-size: 16px; margin: 30px 0;">a suivi la formation</p>
  
  <p style="text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0;">
    {{formation.nom}}
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <p><strong>Durée :</strong> {{formation.duree}}</p>
    <p><strong>Du</strong> {{dates.debut}} <strong>au</strong> {{dates.fin}}</p>
    <p><strong>Lieu :</strong> {{formation.lieu}}</p>
  </div>
  
  <p style="text-align: right; margin-top: 50px;">
    Fait à {{of.ville}}, le {{date.jour}}
  </p>
  
  <div style="text-align: right; margin-top: 20px;">
    <div style="display: inline-block; text-align: center;">
      <div style="min-height: 60px;">{{of.signature}}</div>
      <p><strong>{{of.responsable}}</strong><br/>Responsable pédagogique</p>
    </div>
  </div>
</div>
`,

  certificat: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 2px solid #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px;">CERTIFICAT DE RÉALISATION</h1>
    <p style="font-size: 12px; color: #666;">Article L.6353-1 du Code du travail</p>
  </div>
  
  <p style="margin-bottom: 20px;">Je soussigné(e) <strong>{{of.responsable}}</strong>, représentant l'organisme de formation <strong>{{of.nom}}</strong> (N° DA : {{of.nda}}), atteste que :</p>
  
  <div style="padding: 15px; background: #f9f9f9; margin: 20px 0;">
    <p><strong>{{apprenant.prenom}} {{apprenant.nom}}</strong></p>
    <p>{{apprenant.entreprise}}</p>
  </div>
  
  <p>a bien suivi l'action de formation :</p>
  
  <div style="padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
    <p><strong>Intitulé :</strong> {{formation.nom}}</p>
    <p><strong>Durée :</strong> {{formation.duree}}</p>
    <p><strong>Période :</strong> du {{dates.debut}} au {{dates.fin}}</p>
    <p><strong>Lieu :</strong> {{formation.lieu}}</p>
  </div>
  
  <p style="text-align: right; margin-top: 40px;">
    Fait à {{of.ville}}, le {{date.jour}}
  </p>
  
  <div style="text-align: right; margin-top: 20px;">
    <p style="margin-bottom: 10px;"><strong>Cachet et signature</strong></p>
    <div style="min-height: 60px;">{{of.signature}}</div>
  </div>
</div>
`,

  emargement: `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1 style="text-align: center; font-size: 20px;">FEUILLE D'ÉMARGEMENT</h1>
  
  <div style="margin: 20px 0;">
    <p><strong>Formation :</strong> {{formation.nom}}</p>
    <p><strong>Dates :</strong> du {{dates.debut}} au {{dates.fin}}</p>
    <p><strong>Formateur :</strong> {{formation.formateur}}</p>
  </div>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr style="background: #333; color: white;">
        <th style="border: 1px solid #333; padding: 10px;">Nom Prénom</th>
        <th style="border: 1px solid #333; padding: 10px;">Matin</th>
        <th style="border: 1px solid #333; padding: 10px;">Après-midi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #333; padding: 10px;">{{apprenant.prenom}} {{apprenant.nom}}</td>
        <td style="border: 1px solid #333; padding: 10px; height: 50px;"></td>
        <td style="border: 1px solid #333; padding: 10px; height: 50px;"></td>
      </tr>
    </tbody>
  </table>
  
  <p style="margin-top: 30px; font-size: 12px; color: #666;">Signature du formateur : _______________________</p>
</div>
`
};
