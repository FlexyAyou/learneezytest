
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, X } from 'lucide-react';
import { TrainerApplication } from '@/types/trainer-application';
import { useToast } from '@/hooks/use-toast';

interface CustomEmailModalProps {
  trainer: TrainerApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomEmailModal = ({ trainer, isOpen, onClose }: CustomEmailModalProps) => {
  const { toast } = useToast();
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  if (!trainer) return null;

  const handleSendEmail = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le sujet et le message de l'email.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Simulate email sending
    setTimeout(() => {
      toast({
        title: "Email envoyé",
        description: `L'email a été envoyé avec succès à ${trainer.firstName} ${trainer.lastName}.`,
      });
      setIsSending(false);
      setEmailData({ subject: '', message: '' });
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setEmailData({ subject: '', message: '' });
    onClose();
  };

  const emailTemplates = [
    {
      name: "Bienvenue",
      subject: "Bienvenue dans notre équipe de formateurs !",
      message: `Bonjour ${trainer.firstName},

Félicitations ! Votre candidature a été approuvée et vous faites maintenant partie de notre équipe de formateurs.

Nous sommes ravis de vous accueillir et nous avons hâte de collaborer avec vous.

Cordialement,
L'équipe LearnEezy`
    },
    {
      name: "Information importante",
      subject: "Information importante concernant votre profil",
      message: `Bonjour ${trainer.firstName},

Nous souhaitons vous informer d'une mise à jour importante concernant votre profil de formateur.

Cordialement,
L'équipe LearnEezy`
    },
    {
      name: "Rappel",
      subject: "Rappel - Action requise",
      message: `Bonjour ${trainer.firstName},

Nous vous rappelons qu'une action est requise de votre part.

Merci de votre attention.

Cordialement,
L'équipe LearnEezy`
    }
  ];

  const useTemplate = (template: typeof emailTemplates[0]) => {
    setEmailData({
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer un email à {trainer.firstName} {trainer.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={trainer.avatar} 
                alt={`${trainer.firstName} ${trainer.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{trainer.firstName} {trainer.lastName}</h3>
                <p className="text-sm text-gray-600">{trainer.email}</p>
              </div>
            </div>
          </div>

          {/* Email templates */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Modèles d'email</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {emailTemplates.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  size="sm"
                  onClick={() => useTemplate(template)}
                  className="text-left justify-start"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Email form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-sm font-medium">
                Sujet *
              </Label>
              <Input
                id="subject"
                placeholder="Entrez le sujet de l'email"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                Message *
              </Label>
              <Textarea
                id="message"
                placeholder="Rédigez votre message..."
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Envoi en cours...' : 'Envoyer l\'email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
