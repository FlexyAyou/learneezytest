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
    <p style="margin: 5px 0 0 0;"><strong>Adresse :</strong> {{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
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
    <p style="margin: 5px 0 0 0; font-size: 14px;">{{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
    <p style="margin: 5px 0 0 0; font-size: 14px;">Tél : {{of.telephone}} | Email : {{of.email}}</p>
  </div>
</div>
`,

  convention: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; margin-bottom: 10px; font-size: 24px;">CONVENTION DE FORMATION PROFESSIONNELLE</h1>
          <p style="color: #6b7280; font-size: 14px;">Articles L.6353-1 et suivants du Code du travail</p>
          <p style="color: #374151; font-weight: bold; margin-top: 5px;">N° {{of.nda}}</p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-size: 18px; text-transform: uppercase;">ENTRE LES SOUSSIGNÉS</h2>
        
        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #f1f5f9;">
          <p style="margin: 0 0 10px 0;"><strong>L'Organisme de Formation :</strong></p>
          <p style="margin: 2px 0;"><strong>{{of.nom}}</strong></p>
          <p style="margin: 2px 0; font-size: 14px;">SIRET : {{of.siret}} | N° DA : {{of.nda}}</p>
          <p style="margin: 2px 0; font-size: 14px;">Adresse : {{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
          <p style="margin: 2px 0; font-size: 14px;">Représenté par : {{of.responsable}}</p>
        </div>

        <p style="text-align: center; font-weight: bold; margin: 20px 0; color: #94a3b8;">ET</p>

        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #f1f5f9;">
          <p style="margin: 0 0 10px 0;"><strong>Le Bénéficiaire (Le Stagiaire) :</strong></p>
          <p style="margin: 2px 0;"><strong>{{apprenant.prenom}} {{apprenant.nom}}</strong></p>
          <p style="margin: 2px 0; font-size: 14px;">Email : {{apprenant.email}} | Tél : {{apprenant.telephone}}</p>
          <p style="margin: 2px 0; font-size: 14px;">Adresse : {{apprenant.adresse}}, {{apprenant.code_postal}} {{apprenant.ville}}</p>
          <p style="margin: 2px 0; font-size: 14px;">Entreprise : {{apprenant.entreprise}}</p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px; font-size: 18px;">ARTICLE 1 - OBJET ET DURÉE</h2>
        <p>La présente convention a pour objet l'action de formation suivante :</p>
        <div style="margin: 20px 0; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 2px 0;"><strong>Formation : {{formation.nom}}</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #4b5563;">{{formation.description}}</p>
          <p style="margin: 8px 0 2px 0; font-size: 14px;"><strong>Période :</strong> du {{dates.debut}} au {{dates.fin}}</p>
          <p style="margin: 2px 0; font-size: 14px;"><strong>Durée totale :</strong> {{formation.duree}}</p>
          <p style="margin: 2px 0; font-size: 14px;"><strong>Lieu :</strong> {{formation.lieu}}</p>
        </div>

        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px; font-size: 18px;">ARTICLE 2 - COÛT ET FINANCEMENT</h2>
        <p>Le coût total de la formation est fixé à <strong>{{formation.prix}}</strong> net de taxes.</p>

        <div style="margin-top: 60px; display: flex; justify-content: space-between; gap: 40px;">
          <div style="flex: 1; min-width: 0;">
            <p style="margin-bottom: 15px;"><strong>Pour l'Organisme de Formation</strong></p>
            <div style="min-height: 100px; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1; border-radius: 6px; background: #f8fafc;">
               {{of.signature}}
            </div>
            <p style="font-size: 12px; margin-top: 5px;">{{of.responsable}}<br/>Fait à {{of.ville}}, le {{dates.aujourdhui}}</p>
          </div>
          
          <div style="flex: 1; min-width: 0;">
            <p style="margin-bottom: 15px;"><strong>Pour le Stagiaire</strong></p>
            <div id="signature-zone" style="min-height: 100px; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1; border-radius: 6px; background: #f8fafc; color: #94a3b8; font-size: 13px;">
               La signature sera apposée ici
            </div>
            <p style="font-size: 12px; margin-top: 5px;">Lu et approuvé<br/>Le {{dates.signature}}</p>
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
    <p>{{of.code_postal}} {{of.ville}}</p>
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
  ,

  analyse_besoin: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; color: #333; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">ANALYSE DU BESOIN DE FORMATION</h1>
    <p style="font-size: 14px; color: #666; font-style: italic;">Formulaire d'évaluation préalable à l'entrée en formation</p>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <p style="margin: 0;"><strong>Organisme de Formation :</strong> {{of.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>N° DA :</strong> {{of.nda}}</p>
    </div>
    <div>
       <p style="margin: 0;"><strong>Apprenant :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
       <p style="margin: 5px 0 0 0;"><strong>Formation :</strong> {{formation.nom}}</p>
    </div>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">1. Contexte professionnel</h2>
  <p style="margin-bottom: 8px;">Décrivez brièvement votre contexte professionnel actuel et vos missions :</p>
  <textarea name="contexte" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: inherit;"></textarea>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">2. Objectifs de la formation</h2>
  <p style="margin-bottom: 8px;">Quels sont vos objectifs pour cette formation ?</p>
  <textarea name="objectifs" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: inherit;"></textarea>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">3. Compétences actuelles</h2>
  <p style="margin-bottom: 8px;">Comment évaluez-vous votre niveau actuel dans le domaine concerné ?</p>
  <div style="margin-bottom: 20px;">
    <label style="margin-right: 15px;"><input type="radio" name="niveau" value="debutant"> Débutant</label>
    <label style="margin-right: 15px;"><input type="radio" name="niveau" value="intermediaire"> Intermédiaire</label>
    <label><input type="radio" name="niveau" value="avance"> Avancé</label>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">4. Attentes spécifiques</h2>
  <p style="margin-bottom: 8px;">Avez-vous des besoins spécifiques (accessibilité, handicaps, aménagements) ?</p>
  <textarea name="attentes" style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ccc; margin-bottom: 30px; font-family: inherit;"></textarea>

  <div style="margin-top: 30px; border: 1px dashed #666; padding: 20px; text-align: center;">
    <p><strong>Signature de l'apprenant :</strong></p>
    <div id="signature-zone" style="min-height: 100px; border: 1px solid #eee; background: #fafafa; margin: 10px auto; max-width: 300px; display: flex; align-items: center; justify-content: center; color: #aaa;">
      La signature sera apposée ici
    </div>
    <p><strong>{{apprenant.prenom}} {{apprenant.nom}}</strong></p>
    <p style="font-size: 12px;">Fait le {{date.jour}}</p>
  </div>
</div>
`,

  test_positionnement: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; color: #333; line-height: 1.6;">

  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">TEST DE POSITIONNEMENT</h1>
    <p style="font-size: 14px; color: #666; font-style: italic;">Évaluation des compétences initiales avant l'entrée en formation</p>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <p style="margin: 0;"><strong>Organisme :</strong> {{of.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>Formateur :</strong> {{formation.formateur}}</p>
    </div>
    <div>
      <p style="margin: 0;"><strong>Apprenant :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>Formation :</strong> {{formation.nom}}</p>
    </div>
  </div>

  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 25px; background: #fffde7; border-left: 4px solid #f59e0b;">
    <p style="margin: 0;"><strong>📋 Instructions :</strong> Ce test permet d'évaluer votre niveau initial. Répondez au mieux de vos connaissances. Il n'y a pas de mauvaise réponse, l'objectif est d'adapter la formation à votre profil.</p>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">1. Connaissances générales du domaine</h2>
  <p style="margin-bottom: 8px;">Comment évaluez-vous votre connaissance actuelle du sujet de la formation ?</p>
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="connaissance" value="aucune"> Aucune connaissance</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="connaissance" value="notions"> Quelques notions de base</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="connaissance" value="bonne"> Bonne connaissance théorique</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="connaissance" value="expert"> Maîtrise avancée / Expert</label>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">2. Expérience pratique</h2>
  <p style="margin-bottom: 8px;">Avez-vous déjà mis en pratique les compétences visées par cette formation ?</p>
  <div style="margin-bottom: 10px;">
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="experience" value="jamais"> Jamais</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="experience" value="rarement"> Rarement (quelques fois)</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="experience" value="regulierement"> Régulièrement</label>
    <label style="display: block; margin-bottom: 8px;"><input type="radio" name="experience" value="quotidien"> Au quotidien</label>
  </div>
  <p style="margin-bottom: 8px;">Précisez dans quel contexte :</p>
  <textarea name="contexte_experience" style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: inherit;" placeholder="Décrivez brièvement votre expérience pratique..."></textarea>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">3. Compétences spécifiques</h2>
  <p style="margin-bottom: 8px;">Pour chaque compétence ci-dessous, évaluez votre niveau :</p>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Compétence</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 80px;">Débutant</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 100px;">Intermédiaire</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 80px;">Avancé</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Compétence 1 (à personnaliser)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp1" value="debutant"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp1" value="intermediaire"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp1" value="avance"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Compétence 2 (à personnaliser)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp2" value="debutant"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp2" value="intermediaire"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp2" value="avance"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Compétence 3 (à personnaliser)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp3" value="debutant"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp3" value="intermediaire"></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><input type="radio" name="comp3" value="avance"></td>
      </tr>
    </tbody>
  </table>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">4. Attentes et objectifs personnels</h2>
  <p style="margin-bottom: 8px;">Quels sont vos principaux objectifs en suivant cette formation ?</p>
  <textarea name="objectifs" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: inherit;" placeholder="Décrivez vos objectifs et ce que vous espérez acquérir..."></textarea>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px; color: #1a1a1a;">5. Difficultés anticipées</h2>
  <p style="margin-bottom: 8px;">Identifiez-vous des difficultés potentielles pour cette formation ?</p>
  <div style="margin-bottom: 10px;">
    <label style="display: block; margin-bottom: 6px;"><input type="checkbox" name="difficulte_temps" value="oui"> Manque de temps disponible</label>
    <label style="display: block; margin-bottom: 6px;"><input type="checkbox" name="difficulte_technique" value="oui"> Difficultés techniques (matériel, logiciel)</label>
    <label style="display: block; margin-bottom: 6px;"><input type="checkbox" name="difficulte_prerequis" value="oui"> Prérequis insuffisants</label>
    <label style="display: block; margin-bottom: 6px;"><input type="checkbox" name="difficulte_aucune" value="oui"> Aucune difficulté anticipée</label>
  </div>
  <p style="margin-bottom: 8px;">Précisions éventuelles :</p>
  <textarea name="precisions_difficultes" style="width: 100%; min-height: 60px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: inherit;" placeholder="Détails supplémentaires..."></textarea>

  <div style="margin-top: 30px; border: 1px dashed #666; padding: 20px; text-align: center;">
    <p><strong>Signature de l'apprenant :</strong></p>
    <div id="signature-zone" style="min-height: 100px; border: 1px solid #eee; background: #fafafa; margin: 10px auto; max-width: 300px; display: flex; align-items: center; justify-content: center; color: #aaa;">
      La signature sera apposée ici
    </div>
    <p><strong>{{apprenant.prenom}} {{apprenant.nom}}</strong></p>
    <p style="font-size: 12px;">Fait le {{date.jour}}</p>
  </div>
</div>
`,

  reglement_interieur: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">RÈGLEMENT INTÉRIEUR</h1>
    <h2 style="font-size: 16px; color: #666;">Applicable aux stagiaires de la formation professionnelle</h2>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9;">
    <p style="margin: 0;"><strong>Organisme de Formation :</strong> {{of.nom}}</p>
    <p style="margin: 5px 0 0 0;"><strong>SIRET :</strong> {{of.siret}} | <strong>N° DA :</strong> {{of.nda}}</p>
    <p style="margin: 5px 0 0 0;"><strong>Adresse :</strong> {{of.adresse}}, {{of.code_postal}} {{of.ville}}</p>
  </div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 1 - Objet et champ d'application</h2>
  <p style="text-align: justify;">Le présent règlement intérieur s'applique à tous les stagiaires inscrits à une action de formation dispensée par {{of.nom}}, et ce pour la durée de la formation suivie.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 2 - Assiduité et ponctualité</h2>
  <p style="text-align: justify;">Les stagiaires sont tenus de suivre les cours, séances de formation et stages avec assiduité. Toute absence doit être justifiée. En cas d'absence prévisible, le stagiaire doit en informer le responsable de la formation.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 3 - Discipline générale</h2>
  <p style="text-align: justify;">Il est interdit aux stagiaires :</p>
  <ul>
    <li>D'introduire des boissons alcoolisées ou des substances illicites dans les locaux</li>
    <li>De se présenter en état d'ébriété ou sous l'emprise de substances</li>
    <li>D'utiliser leur téléphone portable pendant les sessions de formation</li>
    <li>De fumer dans les locaux</li>
  </ul>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 4 - Hygiène et sécurité</h2>
  <p style="text-align: justify;">La prévention des risques d'accidents et de maladies est impérative. Chaque stagiaire doit respecter les consignes de sécurité affichées dans les locaux et signaler immédiatement tout dysfonctionnement.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 5 - Sanctions disciplinaires</h2>
  <p style="text-align: justify;">Tout manquement du stagiaire à l'une des prescriptions du présent règlement pourra faire l'objet d'une sanction prononcée par le responsable de l'organisme de formation. Les sanctions applicables sont : avertissement écrit, exclusion temporaire, exclusion définitive.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 6 - Représentation des stagiaires</h2>
  <p style="text-align: justify;">Pour les formations d'une durée supérieure à 500 heures, un délégué des stagiaires est élu conformément aux dispositions légales.</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">Article 7 - Protection des données</h2>
  <p style="text-align: justify;">Conformément au RGPD, les données collectées sont utilisées exclusivement pour la gestion de la formation. Contact : {{of.email}}</p>

  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="width: 45%;">
      <p><strong>Pour l'organisme de formation</strong></p>
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

  attestation_honneur: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">ATTESTATION SUR L'HONNEUR</h1>
    <h2 style="font-size: 16px; color: #666;">Formation éligible au Compte Personnel de Formation (CPF)</h2>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9;">
    <p style="margin: 0;"><strong>Organisme de Formation :</strong> {{of.nom}}</p>
    <p style="margin: 5px 0 0 0;"><strong>SIRET :</strong> {{of.siret}} | <strong>N° DA :</strong> {{of.nda}}</p>
  </div>

  <p style="text-align: justify; margin-top: 30px;">Je soussigné(e), <strong>{{apprenant.prenom}} {{apprenant.nom}}</strong>,</p>
  <p style="text-align: justify;">demeurant au {{apprenant.adresse}}, {{apprenant.codePostal}} {{apprenant.ville}},</p>

  <p style="text-align: justify; margin-top: 20px;">atteste sur l'honneur :</p>

  <ul style="margin: 20px 0; line-height: 2;">
    <li>Être inscrit(e) à la formation <strong>{{formation.nom}}</strong> dispensée par <strong>{{of.nom}}</strong></li>
    <li>Que cette formation est financée dans le cadre de mon Compte Personnel de Formation (CPF)</li>
    <li>Que les informations fournies sont exactes et complètes</li>
    <li>M'engager à suivre la formation avec assiduité du {{dates.debut}} au {{dates.fin}}</li>
    <li>Avoir pris connaissance que toute fausse déclaration est passible de poursuites</li>
  </ul>

  <p style="text-align: justify; margin-top: 20px;">Je reconnais avoir été informé(e) que toute déclaration frauduleuse pourrait entraîner le remboursement des sommes engagées par la Caisse des Dépôts et Consignations au titre du CPF.</p>

  <div style="margin-top: 40px;">
    <p><strong>Fait à :</strong> {{of.ville}}</p>
    <p><strong>Le :</strong> {{date.jour}}</p>
    <p style="margin-top: 20px;"><strong>Signature de l'apprenant</strong> (précédée de la mention "Lu et approuvé") :</p>
    <div style="min-height: 80px; margin-top: 10px; border: 1px dashed #ccc;"></div>
    <p style="margin-top: 10px;">{{apprenant.prenom}} {{apprenant.nom}}</p>
  </div>
</div>
`,

  test_sortie: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">TEST DE SORTIE</h1>
    <h2 style="font-size: 18px; color: #444;">{{formation.nom}}</h2>
    <p style="font-size: 14px; color: #666;">Évaluation des acquis de fin de formation</p>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #f5f5f5;">
    <div>
      <p style="margin: 0;"><strong>Apprenant :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>Date :</strong> {{date.jour}}</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0;"><strong>Organisme :</strong> {{of.nom}}</p>
      <p style="margin: 5px 0 0 0;"><strong>Formateur :</strong> {{formation.formateur}}</p>
    </div>
  </div>

  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 20px; background: #e8f5e9;">
    <p style="margin: 0;"><strong>Instructions :</strong> Ce test évalue les compétences acquises à l'issue de la formation. Les résultats seront comparés au test de positionnement initial pour mesurer votre progression.</p>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">Question 1</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 15px;">
    <p>[Question à personnaliser selon la formation]</p>
    <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px;"></div>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">Question 2</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 15px;">
    <p>[Question à personnaliser selon la formation]</p>
    <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px;"></div>
  </div>

  <h2 style="font-size: 16px; background: #333; color: white; padding: 8px 15px;">Question 3</h2>
  <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 15px;">
    <p>[Question à personnaliser selon la formation]</p>
    <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px;"></div>
  </div>

  <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border: 2px solid #333;">
    <h3 style="margin-top: 0;">Résultats</h3>
    <p><strong>Note de positionnement (avant) :</strong> {{evaluation.note_positionnement}}</p>
    <p><strong>Note finale (après) :</strong> {{evaluation.note_finale}}</p>
    <p><strong>Progression :</strong> {{evaluation.progression}}</p>
    <p><strong>Niveau acquis :</strong> {{evaluation.niveau_acquis}}</p>
    <p><strong>Commentaire :</strong> {{evaluation.commentaire}}</p>
  </div>
</div>
`,

  satisfaction_chaud: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">QUESTIONNAIRE DE SATISFACTION À CHAUD</h1>
    <h2 style="font-size: 18px; color: #444;">{{formation.nom}}</h2>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5;">
    <p><strong>Apprenant :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
    <p><strong>Formation :</strong> {{formation.nom}} | <strong>Dates :</strong> du {{dates.debut}} au {{dates.fin}}</p>
    <p><strong>Formateur :</strong> {{formation.formateur}}</p>
  </div>

  <p style="margin-bottom: 20px;"><em>Merci de prendre quelques minutes pour évaluer cette formation. Vos retours nous permettent d'améliorer nos prestations.</em></p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">1. Organisation générale</h2>
  <p>Les conditions matérielles étaient-elles satisfaisantes ? ☐ Très bien ☐ Bien ☐ Moyen ☐ Insuffisant</p>
  <p>Les horaires ont-ils été respectés ? ☐ Oui ☐ Partiellement ☐ Non</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">2. Contenu pédagogique</h2>
  <p>Le contenu correspondait-il à vos attentes ? ☐ Tout à fait ☐ En grande partie ☐ Partiellement ☐ Pas du tout</p>
  <p>Le niveau était-il adapté ? ☐ Trop simple ☐ Adapté ☐ Trop complexe</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">3. Le formateur</h2>
  <p>Maîtrise du sujet : ☐ Excellent ☐ Bon ☐ Moyen ☐ Insuffisant</p>
  <p>Qualité des explications : ☐ Excellent ☐ Bon ☐ Moyen ☐ Insuffisant</p>
  <p>Disponibilité et écoute : ☐ Excellent ☐ Bon ☐ Moyen ☐ Insuffisant</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">4. Appréciation globale</h2>
  <p>Note globale de la formation : ☐ 1 ☐ 2 ☐ 3 ☐ 4 ☐ 5</p>
  <p>Recommanderiez-vous cette formation ? ☐ Oui ☐ Non</p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">5. Commentaires libres</h2>
  <div style="border: 1px solid #ccc; min-height: 100px; padding: 10px; margin-bottom: 20px;"></div>

  <div style="margin-top: 30px;">
    <p><strong>Date :</strong> {{date.jour}}</p>
    <p><strong>Signature :</strong></p>
    <div style="min-height: 60px;"></div>
  </div>
</div>
`,

  satisfaction_froid: `
<div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; margin-bottom: 10px;">QUESTIONNAIRE À FROID</h1>
    <h2 style="font-size: 18px; color: #444;">Évaluation à +3 mois</h2>
    <p style="font-size: 14px; color: #666;">{{formation.nom}}</p>
  </div>

  <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5;">
    <p><strong>Apprenant :</strong> {{apprenant.prenom}} {{apprenant.nom}}</p>
    <p><strong>Formation suivie :</strong> {{formation.nom}} | du {{dates.debut}} au {{dates.fin}}</p>
    <p><strong>Date du questionnaire :</strong> {{date.jour}}</p>
  </div>

  <p style="margin-bottom: 20px;"><em>Ce questionnaire vise à évaluer l'impact de la formation sur votre pratique professionnelle, 3 mois après son achèvement.</em></p>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">1. Application des acquis</h2>
  <p>Avez-vous pu mettre en pratique les compétences acquises ? ☐ Oui, régulièrement ☐ Oui, ponctuellement ☐ Non</p>
  <p>Si non, quels freins avez-vous rencontrés ?</p>
  <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px; margin-bottom: 15px;"></div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">2. Impact professionnel</h2>
  <p>La formation a-t-elle eu un impact positif sur votre activité ? ☐ Très positif ☐ Positif ☐ Neutre ☐ Négatif</p>
  <p>Précisez les améliorations constatées :</p>
  <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px; margin-bottom: 15px;"></div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">3. Besoins complémentaires</h2>
  <p>Identifiez-vous des besoins de formation complémentaires ? ☐ Oui ☐ Non</p>
  <p>Si oui, lesquels ?</p>
  <div style="border: 1px solid #ccc; min-height: 60px; padding: 10px; margin-bottom: 15px;"></div>

  <h2 style="font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 5px;">4. Appréciation rétrospective</h2>
  <p>Avec le recul, comment évaluez-vous cette formation ? ☐ 1 ☐ 2 ☐ 3 ☐ 4 ☐ 5</p>

  <div style="margin-top: 30px;">
    <p><strong>Date :</strong> {{date.jour}}</p>
    <p><strong>Signature :</strong></p>
    <div style="min-height: 60px;"></div>
  </div>
</div>
`
};
