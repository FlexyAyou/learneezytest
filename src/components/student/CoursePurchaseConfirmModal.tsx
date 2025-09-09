import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Users, Star, BookOpen, ShoppingCart } from 'lucide-react';

interface CoursePurchaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: number;
    title: string;
    instructor: string;
    image: string;
    duration: string;
    students: number;
    rating: number;
    price: string;
    level: string;
    category: string;
    description: string;
  } | null;
  onConfirmPurchase: (course: any) => void;
  userTokenBalance: number;
}

const CoursePurchaseConfirmModal = ({ 
  isOpen, 
  onClose, 
  course, 
  onConfirmPurchase, 
  userTokenBalance 
}: CoursePurchaseConfirmModalProps) => {
  if (!course) return null;

  const extractTokenPrice = (priceString: string) => {
    return parseInt(priceString.replace(' tokens', ''));
  };

  const tokenPrice = extractTokenPrice(course.price);
  const canAfford = userTokenBalance >= tokenPrice;
  const remainingBalance = userTokenBalance - tokenPrice;

  const handleConfirmPurchase = () => {
    onConfirmPurchase(course);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            Confirmer l'achat du cours
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails de votre achat avant de confirmer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aperçu du cours */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-600 mb-2">{course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students} étudiants
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la transaction */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Détails de la transaction
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix du cours :</span>
                  <span className="font-semibold text-lg text-primary">{tokenPrice} tokens</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Votre solde actuel :</span>
                  <span className="font-medium">{userTokenBalance} tokens</span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Solde après achat :</span>
                  <span className={`font-semibold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    {canAfford ? remainingBalance : userTokenBalance} tokens
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ Solde insuffisant pour effectuer cet achat
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    Il vous manque {tokenPrice - userTokenBalance} tokens
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={onClose} variant="outline">
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmPurchase}
            disabled={!canAfford}
            className={`${canAfford 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
              : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {canAfford ? `Confirmer l'achat (${tokenPrice} tokens)` : 'Solde insuffisant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePurchaseConfirmModal;