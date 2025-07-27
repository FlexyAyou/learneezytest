
import React from 'react';
import { X, Download, QrCode, Shield, FileText, Award, Calendar, User, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreview = ({ document, isOpen, onClose }: DocumentPreviewProps) => {
  if (!document) return null;

  const renderDocumentContent = () => {
    switch (document.type) {
      case 'attestation':
        return <AttestationPreview document={document} />;
      case 'certificat':
        return <CertificatPreview document={document} />;
      case 'emargement':
        return <EmargementPreview document={document} />;
      case 'convention':
        return <ConventionPreview document={document} />;
      case 'logs':
        return <LogsPreview document={document} />;
      case 'planning':
        return <PlanningPreview document={document} />;
      case 'evaluation':
        return <EvaluationPreview document={document} />;
      case 'template':
        return <TemplatePreview document={document} />;
      case 'reglement':
        return <ReglementPreview document={document} />;
      case 'ressource':
        return <RessourcePreview document={document} />;
      default:
        return <DefaultPreview document={document} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{document.title}</span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour l'aperçu de l'attestation
const AttestationPreview = ({ document }: { document: any }) => (
  <div className="bg-white border-2 border-gray-300 p-8 rounded-lg shadow-lg">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ATTESTATION DE FIN DE FORMATION</h1>
      <div className="w-32 h-1 bg-blue-500 mx-auto"></div>
    </div>
    
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg">Il est attesté que</p>
        <h2 className="text-xl font-bold text-blue-600 my-2">{document.apprenant}</h2>
        <p className="text-lg">a suivi avec succès la formation</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-center text-lg mb-2">{document.formation}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Durée :</span> 35 heures
          </div>
          <div>
            <span className="font-semibold">Période :</span> 15/01/2024 - 20/01/2024
          </div>
          <div>
            <span className="font-semibold">Modalité :</span> Présentiel et distanciel
          </div>
          <div>
            <span className="font-semibold">Code :</span> {document.uniqueCode}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex items-center space-x-2">
          <QrCode className="w-16 h-16" />
          <div className="text-xs text-gray-500">
            <p>QR Code de vérification</p>
            <p>{document.qrCode}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">Fait le {new Date().toLocaleDateString('fr-FR')}</p>
          <p className="text-sm font-semibold">Organisme de Formation</p>
          <div className="w-24 h-12 bg-gray-200 rounded mt-2 flex items-center justify-center text-xs">
            Signature
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu du certificat
const CertificatPreview = ({ document }: { document: any }) => (
  <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 p-8 rounded-lg shadow-lg">
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Award className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-green-800 mb-2">CERTIFICAT DE RÉALISATION</h1>
      <div className="w-40 h-1 bg-green-500 mx-auto"></div>
    </div>
    
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg">Ce certificat est décerné à</p>
        <h2 className="text-2xl font-bold text-green-600 my-4">{document.apprenant}</h2>
        <p className="text-lg">pour avoir complété avec succès la formation</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-2">{document.formation}</h3>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-green-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-green-600">Durée</div>
            <div>35 heures</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">Score final</div>
            <div>87/100</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">Mention</div>
            <div>Bien</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex items-center space-x-2">
          <QrCode className="w-16 h-16 text-green-500" />
          <div className="text-xs text-gray-500">
            <p>Code unique : {document.uniqueCode}</p>
            <p>Vérifiable en ligne</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">Délivré le {new Date().toLocaleDateString('fr-FR')}</p>
          <div className="w-32 h-16 bg-green-100 rounded mt-2 flex items-center justify-center text-xs border-2 border-green-300">
            Signature électronique
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu de l'émargement
const EmargementPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">FEUILLE D'ÉMARGEMENT</h1>
      <p className="text-sm text-gray-600">{document.formation}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
      <div>
        <span className="font-semibold">Date :</span> 15/01/2024
      </div>
      <div>
        <span className="font-semibold">Horaires :</span> 9h00 - 17h00
      </div>
      <div>
        <span className="font-semibold">Lieu :</span> Salle 101
      </div>
      <div>
        <span className="font-semibold">Formateur :</span> Jean Dupont
      </div>
    </div>
    
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="border border-gray-300 p-2">Nom Prénom</th>
          <th className="border border-gray-300 p-2">Matin</th>
          <th className="border border-gray-300 p-2">Après-midi</th>
          <th className="border border-gray-300 p-2">Signature</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300 p-2">Marie Dupont</td>
          <td className="border border-gray-300 p-2 text-center">✓</td>
          <td className="border border-gray-300 p-2 text-center">✓</td>
          <td className="border border-gray-300 p-2 text-center">
            <div className="w-16 h-8 bg-blue-100 rounded text-xs flex items-center justify-center">
              Signée
            </div>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-2">Jean Martin</td>
          <td className="border border-gray-300 p-2 text-center">✓</td>
          <td className="border border-gray-300 p-2 text-center">✓</td>
          <td className="border border-gray-300 p-2 text-center">
            <div className="w-16 h-8 bg-blue-100 rounded text-xs flex items-center justify-center">
              Signée
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div className="mt-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <QrCode className="w-8 h-8" />
        <span className="text-xs">QR de vérification</span>
      </div>
      <div className="text-xs text-gray-500">
        Généré le {new Date().toLocaleString('fr-FR')}
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu de la convention
const ConventionPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-8 rounded-lg">
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold text-gray-800">CONVENTION DE FORMATION</h1>
      <p className="text-sm text-gray-600">Article L.6353-1 du Code du travail</p>
    </div>
    
    <div className="space-y-6 text-sm">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-2">ORGANISME DE FORMATION</h3>
          <p>Nom : Formation Excellence</p>
          <p>Adresse : 123 Rue de la Formation</p>
          <p>SIRET : 12345678901234</p>
          <p>N° déclaration : 11750123456</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">STAGIAIRE</h3>
          <p>Nom : {document.apprenant}</p>
          <p>Adresse : [Adresse du stagiaire]</p>
          <p>Email : marie.dupont@email.com</p>
          <p>Téléphone : 01 23 45 67 89</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">FORMATION</h3>
        <p><span className="font-semibold">Intitulé :</span> {document.formation}</p>
        <p><span className="font-semibold">Durée :</span> 35 heures</p>
        <p><span className="font-semibold">Dates :</span> Du 15/01/2024 au 20/01/2024</p>
        <p><span className="font-semibold">Lieu :</span> Présentiel et distanciel</p>
        <p><span className="font-semibold">Prix :</span> 1 500,00 €</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">CONDITIONS GÉNÉRALES</h3>
        <p className="text-xs leading-relaxed">
          La présente convention est établie conformément aux dispositions du Code du travail...
          [Contenu des conditions générales]
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <p className="font-semibold">Fait à [Ville], le {new Date().toLocaleDateString('fr-FR')}</p>
          <p className="mt-4">Signature du stagiaire</p>
          <div className="w-32 h-16 bg-gray-100 border-2 border-dashed border-gray-300 mt-2 flex items-center justify-center text-xs">
            Zone de signature
          </div>
        </div>
        <div>
          <p className="font-semibold">Pour l'organisme de formation</p>
          <p className="mt-4">Signature du responsable</p>
          <div className="w-32 h-16 bg-gray-100 border-2 border-dashed border-gray-300 mt-2 flex items-center justify-center text-xs">
            Zone de signature
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu des logs
const LogsPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">LOGS DE CONNEXION</h1>
      <p className="text-sm text-gray-600">Apprenant : {document.apprenant}</p>
      <p className="text-sm text-gray-600">Formation : {document.formation}</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Informations de session
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Date :</span> 15/01/2024
          </div>
          <div>
            <span className="font-semibold">Durée totale :</span> 7h 23min
          </div>
          <div>
            <span className="font-semibold">Adresse IP :</span> 192.168.1.100
          </div>
          <div>
            <span className="font-semibold">Navigateur :</span> Chrome 120
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2">Heure</th>
              <th className="border border-gray-300 p-2">Action</th>
              <th className="border border-gray-300 p-2">Détails</th>
              <th className="border border-gray-300 p-2">Vérification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">09:00:15</td>
              <td className="border border-gray-300 p-2">Connexion</td>
              <td className="border border-gray-300 p-2">Authentification réussie</td>
              <td className="border border-gray-300 p-2">✓ QR vérifié</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">09:15:30</td>
              <td className="border border-gray-300 p-2">Activité</td>
              <td className="border border-gray-300 p-2">Consultation module 1</td>
              <td className="border border-gray-300 p-2">✓ Caméra ON</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">10:30:45</td>
              <td className="border border-gray-300 p-2">Inactivité</td>
              <td className="border border-gray-300 p-2">Pause détectée (15min)</td>
              <td className="border border-gray-300 p-2">⚠ Caméra OFF</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">16:45:20</td>
              <td className="border border-gray-300 p-2">Déconnexion</td>
              <td className="border border-gray-300 p-2">Fin de session</td>
              <td className="border border-gray-300 p-2">✓ Validé</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <QrCode className="w-8 h-8" />
          <span className="text-xs">Code de vérification : {document.qrCode}</span>
        </div>
        <Badge variant="default" className="bg-green-500">
          Session valide
        </Badge>
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu du planning
const PlanningPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">PLANNING DE FORMATION</h1>
      <p className="text-sm text-gray-600">{document.formation}</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Informations générales
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Période :</span> 15/01/2024 - 20/01/2024
          </div>
          <div>
            <span className="font-semibold">Durée totale :</span> 35 heures
          </div>
          <div>
            <span className="font-semibold">Modalité :</span> Mixte
          </div>
          <div>
            <span className="font-semibold">Formateur :</span> Jean Dupont
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Horaires</th>
              <th className="border border-gray-300 p-2">Module</th>
              <th className="border border-gray-300 p-2">Modalité</th>
              <th className="border border-gray-300 p-2">Lien/Lieu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">15/01/2024</td>
              <td className="border border-gray-300 p-2">9h00 - 17h00</td>
              <td className="border border-gray-300 p-2">Introduction React</td>
              <td className="border border-gray-300 p-2">Présentiel</td>
              <td className="border border-gray-300 p-2">Salle 101</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">16/01/2024</td>
              <td className="border border-gray-300 p-2">9h00 - 17h00</td>
              <td className="border border-gray-300 p-2">Composants React</td>
              <td className="border border-gray-300 p-2">Distanciel</td>
              <td className="border border-gray-300 p-2">https://meet.example.com/abc123</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">17/01/2024</td>
              <td className="border border-gray-300 p-2">9h00 - 17h00</td>
              <td className="border border-gray-300 p-2">Hooks & State</td>
              <td className="border border-gray-300 p-2">Distanciel</td>
              <td className="border border-gray-300 p-2">https://meet.example.com/def456</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">18/01/2024</td>
              <td className="border border-gray-300 p-2">9h00 - 17h00</td>
              <td className="border border-gray-300 p-2">Projet pratique</td>
              <td className="border border-gray-300 p-2">Présentiel</td>
              <td className="border border-gray-300 p-2">Salle 101</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">19/01/2024</td>
              <td className="border border-gray-300 p-2">9h00 - 17h00</td>
              <td className="border border-gray-300 p-2">Évaluation finale</td>
              <td className="border border-gray-300 p-2">Présentiel</td>
              <td className="border border-gray-300 p-2">Salle 101</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Composant pour l'aperçu des évaluations
const EvaluationPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">BILAN D'ÉVALUATION</h1>
      <p className="text-sm text-gray-600">Apprenant : {document.apprenant}</p>
      <p className="text-sm text-gray-600">Formation : {document.formation}</p>
    </div>
    
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold mb-2">ÉVALUATION INITIALE</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Connaissances théoriques</span>
              <span className="font-semibold">12/20</span>
            </div>
            <div className="flex justify-between">
              <span>Compétences pratiques</span>
              <span className="font-semibold">8/20</span>
            </div>
            <div className="flex justify-between">
              <span>Score global</span>
              <span className="font-semibold text-orange-600">10/20</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold mb-2">ÉVALUATION FINALE</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Connaissances théoriques</span>
              <span className="font-semibold">17/20</span>
            </div>
            <div className="flex justify-between">
              <span>Compétences pratiques</span>
              <span className="font-semibold">16/20</span>
            </div>
            <div className="flex justify-between">
              <span>Score global</span>
              <span className="font-semibold text-green-600">16.5/20</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">PROGRESSION</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Amélioration globale</span>
            <Badge variant="default" className="bg-green-500">+65%</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">COMPÉTENCES ACQUISES</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Programmation React
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Gestion des composants
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Hooks React
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Tests unitaires
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composants pour les documents OF
const TemplatePreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">TEMPLATE - {document.title}</h1>
      <p className="text-sm text-gray-600">Catégorie : {document.category}</p>
    </div>
    
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Variables disponibles</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>{{nom_apprenant}}</div>
        <div>{{formation_titre}}</div>
        <div>{{date_debut}}</div>
        <div>{{date_fin}}</div>
        <div>{{duree_formation}}</div>
        <div>{{logo_of}}</div>
      </div>
    </div>
    
    <div className="border-2 border-dashed border-gray-300 p-4 rounded bg-white">
      <p className="text-sm text-gray-600 mb-2">Aperçu du template :</p>
      <div className="space-y-2 text-sm">
        <p>Objet : Convocation à la formation {{formation_titre}}</p>
        <p>Bonjour {{nom_apprenant}},</p>
        <p>Vous êtes convoqué(e) à la formation {{formation_titre}} qui se déroulera du {{date_debut}} au {{date_fin}}.</p>
        <p>Cordialement,<br/>L'équipe de formation</p>
      </div>
    </div>
  </div>
);

const ReglementPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">RÈGLEMENT INTÉRIEUR</h1>
      <p className="text-sm text-gray-600">Organisme de Formation</p>
    </div>
    
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-bold mb-2">Article 1 - Objet et champ d'application</h3>
        <p>Le présent règlement intérieur s'applique à tous les stagiaires...</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Article 2 - Dispositions générales</h3>
        <p>Les stagiaires sont tenus de respecter les horaires de formation...</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Article 3 - Hygiène et sécurité</h3>
        <p>Il est interdit de fumer dans les locaux de formation...</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Article 4 - Discipline</h3>
        <p>En cas de non-respect du règlement intérieur...</p>
      </div>
    </div>
  </div>
);

const RessourcePreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">RESSOURCE PÉDAGOGIQUE</h1>
      <p className="text-sm text-gray-600">{document.title}</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2">Informations</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Type :</span> Guide d'évaluation
          </div>
          <div>
            <span className="font-semibold">Formation :</span> {document.usedInFormations?.[0]}
          </div>
          <div>
            <span className="font-semibold">Ajouté le :</span> {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
          </div>
          <div>
            <span className="font-semibold">Format :</span> PDF
          </div>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 p-4 rounded">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aperçu du contenu du document</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DefaultPreview = ({ document }: { document: any }) => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="text-center">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">{document.title}</h2>
      <p className="text-sm text-gray-600">Type : {document.type}</p>
    </div>
  </div>
);
