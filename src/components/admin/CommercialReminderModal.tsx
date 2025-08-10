
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Percent, Clock, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommercialReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  organisme: {
    id: string;
    name: string;
    email: string;
    subscription: {
      daysRemaining: number;
      tokensRemaining: number;
      tokensTotal: number;
    };
  };
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: string;
}

export const CommercialReminderModal = ({ isOpen, onClose, organisme }: CommercialReminderModalProps) => {
  const { toast } = useToast();
  const [emailType, setEmailType] = useState<'renewal' | 'tokens'>('renewal');
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Mock des codes promo - en réalité viendrait de l'API
  const promoCodes: PromoCode[] = [
    { id: '1', code: 'RENEWAL20', description: 'Renouvellement -20%', discount: 20, type: 'percentage', validUntil: '2024-12-31' },
    { id: '2', code: 'TOKENS15', description: 'Tokens -15%', discount: 15, type: 'percentage', validUntil: '2024-12-31' },
    { id: '3', code: 'FIDELE30', description: 'Client fidèle -30%', discount: 30, type: 'percentage', validUntil: '2024-12-31' },
    { id: '4', code: 'URGENT50', description: 'Offre urgente 50€', discount: 50, type: 'fixed', validUntil: '2024-11-30' }
  ];

  const getDefaultSubject = (type: 'renewal' | 'tokens') => {
    if (type === 'renewal') {
      return `Renouvelez votre abonnement Learneezy - ${organisme.name}`;
    } else {
      return `Rechargez vos tokens Learneezy - ${organisme.name}`;
    }
  };

  const getDefaultMessage = (type: 'renewal' | 'tokens') => {
    if (type === 'renewal') {
      return `Bonjour,

Votre abonnement Learneezy expire dans ${organisme.subscription.daysRemaining} jours.

Pour assurer la continuité de vos formations, nous vous invitons à renouveler votre abonnement dès maintenant.

${selectedPromoCode ? `Profitez de notre code promo exclusif : ${promoCodes.find(p => p.id === selectedPromoCode)?.code}` : ''}

Cordialement,
L'équipe Learneezy`;
    } else {
      return `Bonjour,

Il ne vous reste plus que ${organisme.subscription.tokensRemaining} tokens sur votre compte Learneezy.

Pour continuer à créer du contenu pédagogique avec l'IA, rechargez vos tokens dès maintenant.

${selectedPromoCode ? `Profitez de notre code promo exclusif : ${promoCodes.find(p => p.id === selectedPromoCode)?.code}` : ''}

Cordialement,
L'équipe Learneezy`;
    }
  };

  const handleSendEmail = () => {
    const selectedPromo = promoCodes.find(p => p.id === selectedPromoCode);
    
    console.log('Sending commercial reminder email:', {
      to: organisme.email,
      type: emailType,
      subject: customSubject || getDefaultSubject(emailType),
      message: customMessage || getDefaultMessage(emailType),
      promoCode: selectedPromo
    });

    toast({
      title: "Email envoyé",
      description: `Relance commerciale envoyée à ${organisme.name}`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Relance commerciale - {organisme.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de l'organisme */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">État de l'abonnement</h4>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{organisme.subscription.daysRemaining} jours restants</span>
              </div>
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                <span>{organisme.subscription.tokensRemaining}/{organisme.subscription.tokensTotal} tokens</span>
              </div>
            </div>
          </div>

          {/* Type d'email */}
          <div>
            <Label htmlFor="emailType">Type de relance</Label>
            <Select value={emailType} onValueChange={(value: 'renewal' | 'tokens') => setEmailType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renewal">Renouvellement d'abonnement</SelectItem>
                <SelectItem value="tokens">Achat de tokens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Code promo */}
          <div>
            <Label htmlFor="promoCode">Code promo (optionnel)</Label>
            <Select value={selectedPromoCode} onValueChange={setSelectedPromoCode}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un code promo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun code promo</SelectItem>
                {promoCodes.map((promo) => (
                  <SelectItem key={promo.id} value={promo.id}>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        <Percent className="h-3 w-3 mr-1" />
                        {promo.code}
                      </Badge>
                      <span className="text-sm">{promo.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPromoCode && (
              <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                <div className="flex items-center text-green-800">
                  <Percent className="h-4 w-4 mr-1" />
                  Code sélectionné: <strong className="ml-1">{promoCodes.find(p => p.id === selectedPromoCode)?.code}</strong>
                </div>
                <div className="text-green-600 text-xs mt-1">
                  {promoCodes.find(p => p.id === selectedPromoCode)?.description} - 
                  Valide jusqu'au {new Date(promoCodes.find(p => p.id === selectedPromoCode)?.validUntil || '').toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Sujet personnalisé */}
          <div>
            <Label htmlFor="subject">Sujet de l'email</Label>
            <Input
              id="subject"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder={getDefaultSubject(emailType)}
            />
          </div>

          {/* Message personnalisé */}
          <div>
            <Label htmlFor="message">Message personnalisé</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={getDefaultMessage(emailType)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer la relance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
