
import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle, Crown, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const StudentPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const { offerId, isAnnual, offerType } = location.state || {};

  const offers = [
    {
      id: 1,
      name: "Pack Starter",
      credits: 100,
      monthlyPrice: 29,
      annualPrice: 290,
      icon: <Gift className="h-6 w-6" />,
      description: "Parfait pour débuter",
      features: [
        "100 crédits d'apprentissage",
        "Accès aux cours de base",
        "Support par email",
        "Certificats de base"
      ]
    },
    {
      id: 2,
      name: "Pack Growth",
      credits: 300,
      monthlyPrice: 79,
      annualPrice: 790,
      icon: <Zap className="h-6 w-6" />,
      description: "Le choix idéal pour progresser",
      features: [
        "300 crédits d'apprentissage",
        "Accès à tous les cours",
        "Réservation de créneaux formateurs",
        "Support prioritaire",
        "Certificats avancés"
      ]
    },
    {
      id: 3,
      name: "Pack Premium",
      credits: 500,
      monthlyPrice: 120,
      annualPrice: 1200,
      icon: <Crown className="h-6 w-6" />,
      description: "L'excellence pour les apprenants exigeants",
      features: [
        "500 crédits d'apprentissage",
        "Accès illimité à tous les cours",
        "Réservations prioritaires",
        "Coaching personnalisé",
        "Certificats premium",
        "Support 24/7"
      ]
    }
  ];

  const selectedOffer = offers.find(offer => offer.id === offerId);
  
  const calculatePrice = (offer: any) => {
    if (isAnnual) {
      return Math.round(offer.annualPrice * 0.83);
    }
    return offer.monthlyPrice;
  };

  const calculateCredits = (offer: any) => {
    return isAnnual ? offer.credits * 12 : offer.credits;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      toast({
        title: "Paiement réussi !",
        description: "Votre abonnement a été activé avec succès.",
        variant: "default"
      });
      
      // Redirection vers l'abonnement après 3 secondes
      setTimeout(() => {
        navigate('/dashboard/apprenant/subscription');
      }, 3000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  if (!selectedOffer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Offre non trouvée
            </h1>
            <p className="text-gray-600 mb-6">
              L'offre sélectionnée n'existe pas ou a expiré.
            </p>
            <Button onClick={() => navigate('/dashboard/apprenant/subscription')}>
              Retour aux abonnements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardContent className="p-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Paiement réussi !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre abonnement {selectedOffer.name} a été activé avec succès.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Détails de votre abonnement</h3>
              <p className="text-sm text-gray-600">
                {selectedOffer.name} - {calculateCredits(selectedOffer)} crédits
              </p>
              <p className="text-sm text-gray-600">
                {calculatePrice(selectedOffer)}€ {isAnnual ? 'par an' : 'par mois'}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Redirection automatique vers vos abonnements dans quelques secondes...
            </p>
            <Button onClick={() => navigate('/dashboard/apprenant/subscription')}>
              Voir mon abonnement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard/apprenant/subscription')}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux abonnements
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de paiement */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informations de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Vos informations de paiement sont sécurisées et cryptées.
                </AlertDescription>
              </Alert>

              {/* Informations de la carte */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardHolder">Nom du porteur</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Informations de facturation */}
              <div className="space-y-4">
                <h4 className="font-semibold">Informations de facturation</h4>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    placeholder="123 Rue de la Paix"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé de la commande */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de votre commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  {selectedOffer.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedOffer.name}</h3>
                  <p className="text-gray-600">{selectedOffer.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Étudiant</Badge>
                    {isAnnual && <Badge variant="outline" className="bg-green-100 text-green-800">Annuel -17%</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crédits inclus:</span>
                  <span className="font-medium">{calculateCredits(selectedOffer)} crédits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Période:</span>
                  <span className="font-medium">{isAnnual ? 'Annuelle' : 'Mensuelle'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Abonnement étudiant</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Fonctionnalités incluses:</h4>
                <ul className="space-y-2">
                  {selectedOffer.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-blue-600">{calculatePrice(selectedOffer)}€</span>
                </div>
                <p className="text-xs text-gray-500">
                  TVA incluse - Paiement sécurisé - {isAnnual ? 'Facturé annuellement' : 'Facturé mensuellement'}
                </p>
              </div>

              <Button 
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Confirmer le paiement {calculatePrice(selectedOffer)}€
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                En confirmant votre paiement, vous acceptez nos conditions générales de vente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentPayment;
