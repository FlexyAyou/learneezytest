
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TutorPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { offerId, isAnnual, offerType } = location.state || {};

  const offers = [
    {
      id: 1,
      name: "Pack Starter",
      credits: 200,
      monthlyPrice: 50,
      annualPrice: 500,
      description: "Idéal pour débuter l'accompagnement"
    },
    {
      id: 2,
      name: "Pack Premium",
      credits: 500,
      monthlyPrice: 100,
      annualPrice: 1000,
      description: "Le choix des tuteurs expérimentés"
    },
    {
      id: 3,
      name: "Pack Expert",
      credits: 1000,
      monthlyPrice: 180,
      annualPrice: 1800,
      description: "Pour les tuteurs professionnels"
    }
  ];

  const selectedOffer = offers.find(offer => offer.id === offerId);
  
  if (!selectedOffer) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Offre non trouvée</p>
            <Button onClick={() => navigate('/dashboard/tuteur/abonnements')} className="mt-4">
              Retour aux abonnements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculatePrice = () => {
    if (isAnnual) {
      return Math.round(selectedOffer.annualPrice * 0.83);
    }
    return selectedOffer.monthlyPrice;
  };

  const calculateCredits = () => {
    return isAnnual ? selectedOffer.credits * 12 : selectedOffer.credits;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      toast({
        title: "Paiement réussi !",
        description: `Votre abonnement ${selectedOffer.name} a été activé.`,
      });
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600 mb-6">
              Votre abonnement {selectedOffer.name} a été activé avec succès.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="font-semibold">Récapitulatif :</p>
              <p>{calculateCredits()} crédits ajoutés à votre compte</p>
              <p>Période : {isAnnual ? 'Annuelle' : 'Mensuelle'}</p>
            </div>
            <Button onClick={() => navigate('/dashboard/tuteur/abonnements')}>
              Retour aux abonnements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/tuteur/abonnements')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux abonnements
        </Button>
        <h1 className="text-3xl font-bold">Finaliser votre abonnement</h1>
        <p className="text-gray-600">Complétez votre achat pour activer votre abonnement tuteur</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{selectedOffer.name}</h3>
                <p className="text-sm text-gray-600">{selectedOffer.description}</p>
                <p className="text-sm text-gray-600">
                  {calculateCredits()} crédits • {isAnnual ? 'Facturation annuelle' : 'Facturation mensuelle'}
                </p>
              </div>
              <Badge variant="secondary">{isAnnual ? 'Annuel' : 'Mensuel'}</Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prix de base</span>
                <span>{isAnnual ? selectedOffer.annualPrice : selectedOffer.monthlyPrice}€</span>
              </div>
              {isAnnual && (
                <div className="flex justify-between text-green-600">
                  <span>Remise annuelle (-17%)</span>
                  <span>-{Math.round(selectedOffer.annualPrice * 0.17)}€</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span>{Math.round(calculatePrice() * 0.2)}€</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{Math.round(calculatePrice() * 1.2)}€</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Informations de paiement
            </CardTitle>
            <CardDescription>
              Vos informations sont sécurisées et cryptées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Jean" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Dupont" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jean.dupont@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input id="expiry" placeholder="MM/AA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="be">Belgique</SelectItem>
                  <SelectItem value="ch">Suisse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm text-gray-600">
                Paiement sécurisé par cryptage SSL 256 bits
              </p>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Traitement en cours...' : `Payer ${Math.round(calculatePrice() * 1.2)}€`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorPayment;
