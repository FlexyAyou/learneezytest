
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Coins, Star, Clock, Users, BookOpen, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoursePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

export const CoursePurchaseModal = ({ isOpen, onClose, course }: CoursePurchaseModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('tokens');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock OF data
  const ofData = {
    name: "Formation Pro Academy",
    availableTokens: 450,
    subscription: "Business",
    tokenPrice: 1.5 // 1.5€ per token
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate purchase process
    setTimeout(() => {
      if (paymentMethod === 'tokens') {
        if (ofData.availableTokens >= course.tokenPrice) {
          toast({
            title: "Cours acheté avec succès !",
            description: `"${course.title}" a été ajouté à votre catalogue. ${course.tokenPrice} tokens ont été débités.`,
          });
        } else {
          toast({
            title: "Tokens insuffisants",
            description: `Vous avez besoin de ${course.tokenPrice} tokens mais vous n'en avez que ${ofData.availableTokens}.`,
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
      } else {
        toast({
          title: "Cours acheté avec succès !",
          description: `"${course.title}" a été ajouté à votre catalogue. Paiement de ${course.price}€ effectué.`,
        });
      }
      
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Acheter ce cours</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} étudiants
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {course.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">Contenu du cours</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                <div>• {course.modules} modules de formation</div>
                  <div>• {course.exercises} exercices pratiques</div>
                  <div>• Support instructeur inclus</div>
                  {course.certificates && <div>• Certificat de completion</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">Avantages OF</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• Revente autorisée</div>
                  <div>• Personnalisation possible</div>
                  <div>• Support technique inclus</div>
                  <div>• Mises à jour gratuites</div>
                  <div>• Statistiques détaillées</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Selection */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Choisissez votre méthode de paiement</h4>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {course.tokenPrice > 0 && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="tokens" id="tokens" />
                    <Label htmlFor="tokens" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Coins className="h-5 w-5 text-orange-500" />
                        <div>
                          <div className="font-medium">Payer avec des tokens</div>
                          <div className="text-sm text-gray-600">
                            {course.tokenPrice} tokens ({(course.tokenPrice * ofData.tokenPrice).toFixed(2)}€)
                          </div>
                          <div className="text-xs text-gray-500">
                            Solde disponible: {ofData.availableTokens} tokens
                          </div>
                        </div>
                      </div>
                    </Label>
                    {ofData.availableTokens < course.tokenPrice && (
                      <Badge variant="destructive" className="text-xs">
                        Insuffisant
                      </Badge>
                    )}
                  </div>
                )}

                {course.price > 0 && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Paiement par carte</div>
                          <div className="text-sm text-gray-600">
                            {course.price}€ TTC
                          </div>
                          <div className="text-xs text-gray-500">
                            Paiement sécurisé par Stripe
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>

              {paymentMethod === 'tokens' && ofData.availableTokens < course.tokenPrice && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    Vous avez besoin de {course.tokenPrice - ofData.availableTokens} tokens supplémentaires.
                    <Button variant="link" className="p-0 h-auto text-red-700 underline ml-1">
                      Acheter des tokens
                    </Button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Informations de votre organisation</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Organisation:</span>
                  <div className="font-medium">{ofData.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Abonnement:</span>
                  <div className="font-medium">{ofData.subscription}</div>
                </div>
                <div>
                  <span className="text-gray-600">Tokens disponibles:</span>
                  <div className="font-medium">{ofData.availableTokens}</div>
                </div>
                <div>
                  <span className="text-gray-600">Prix du token:</span>
                  <div className="font-medium">{ofData.tokenPrice}€</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing || (paymentMethod === 'tokens' && ofData.availableTokens < course.tokenPrice)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                "Traitement en cours..."
              ) : (
                `Acheter ${paymentMethod === 'tokens' ? `(${course.tokenPrice} tokens)` : `(${course.price}€)`}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
