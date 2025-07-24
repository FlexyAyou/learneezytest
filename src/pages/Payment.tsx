import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { courseId, slotId } = useParams();
  const navigate = useNavigate();
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

  // Mock data pour le cours et le créneau sélectionné
  const bookingDetails = {
    courseTitle: 'Mathématiques - Fractions et Nombres Décimaux',
    instructorName: 'Marie Dubois',
    instructorPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b9c9b3c8?w=100&h=100&fit=crop&crop=face',
    date: '2024-01-25',
    startTime: '09:00',
    endTime: '10:00',
    duration: '1h',
    price: 25,
    location: 'Salle A101',
    type: 'presential' as 'presential' | 'online',
    level: 'CM1',
    category: 'Mathématiques'
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
      
      // Redirection vers la confirmation après 3 secondes
      setTimeout(() => {
        navigate('/reservations');
      }, 3000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    // Format: XXXX XXXX XXXX XXXX
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    // Format: MM/YY
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Paiement réussi !
              </h1>
              <p className="text-gray-600 mb-6">
                Votre réservation a été confirmée. Vous allez recevoir un email de confirmation.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Détails de votre réservation</h3>
                <p className="text-sm text-gray-600">
                  Code de confirmation: <span className="font-mono font-bold">ABC123</span>
                </p>
                <p className="text-sm text-gray-600">
                  {bookingDetails.courseTitle} - {new Date(bookingDetails.date).toLocaleDateString('fr-FR')} à {bookingDetails.startTime}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Redirection automatique vers vos réservations dans quelques secondes...
              </p>
              <Link to="/reservations">
                <Button>Voir mes réservations</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to={`/cours/${courseId}/reservation`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la sélection
        </Link>

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
                <CardTitle>Résumé de votre réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={bookingDetails.instructorPhoto}
                    alt={bookingDetails.instructorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{bookingDetails.courseTitle}</h3>
                    <p className="text-gray-600">avec {bookingDetails.instructorName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{bookingDetails.level}</Badge>
                      <Badge variant="outline">{bookingDetails.category}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(bookingDetails.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horaire:</span>
                    <span className="font-medium">{bookingDetails.startTime} - {bookingDetails.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">{bookingDetails.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {bookingDetails.type === 'online' ? 'En ligne' : `Présentiel${bookingDetails.location ? ` - ${bookingDetails.location}` : ''}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-blue-600">{bookingDetails.price}€</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    TVA incluse - Paiement sécurisé
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
                      Payer {bookingDetails.price}€
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

      <Footer />
    </div>
  );
};

export default Payment;