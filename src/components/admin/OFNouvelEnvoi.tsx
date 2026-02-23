
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, FileText, Calendar, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useOFUsers } from '@/hooks/useApi';
import { fastAPIClient } from '@/services/fastapi-client';
import { Loader2 } from 'lucide-react';

interface OFNouvelEnvoiProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OFNouvelEnvoi: React.FC<OFNouvelEnvoiProps> = ({ isOpen, onClose }) => {
  const { organization } = useOrganization();
  const ofId = organization?.organizationId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    destinataires: [] as { id: number; email: string; name: string }[],
    sujet: '',
    message: '',
    document: '',
    dateEnvoi: 'immediate'
  });
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>('');
  const { toast } = useToast();

  const { data: learnersData, isLoading: isLoadingLearners } = useOFUsers(ofId, { role: 'learner' });
  const apprenants = learnersData || [];

  const documents = [
    { id: '1', titre: 'Attestation de formation', type: 'attestation' },
    { id: '2', titre: 'Certificat de réalisation', type: 'certificat' },
    { id: '3', titre: 'Convention de formation', type: 'convention' },
    { id: '4', titre: 'Règlement intérieur', type: 'reglement' }
  ];

  const handleAddDestinataire = () => {
    const learner = apprenants.find((a: any) => a.id.toString() === selectedLearnerId);
    if (learner && !formData.destinataires.some(d => d.id === learner.id)) {
      setFormData(prev => ({
        ...prev,
        destinataires: [...prev.destinataires, {
          id: learner.id,
          email: learner.email,
          name: `${learner.first_name || ''} ${learner.last_name || ''}`.trim()
        }]
      }));
      setSelectedLearnerId('');
    }
  };

  const handleRemoveDestinataire = (id: number) => {
    setFormData(prev => ({
      ...prev,
      destinataires: prev.destinataires.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.sujet || formData.destinataires.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!ofId) return;

    setIsSubmitting(true);
    try {
      await fastAPIClient.sendCommunication(ofId, {
        type: formData.type,
        learner_ids: formData.destinataires.map(d => d.id),
        subject: formData.sujet,
        content: formData.message,
        // template_id: formData.document, // if we want to use template
      });

      toast({
        title: "Envoi réussi",
        description: `L'envoi "${formData.sujet}" a été effectué pour ${formData.destinataires.length} destinataire(s)`,
      });

      // Reset form
      setFormData({
        type: '',
        destinataires: [],
        sujet: '',
        message: '',
        document: '',
        dateEnvoi: 'immediate'
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur est survenue lors de l'envoi de la communication.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Nouvel envoi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type d'envoi */}
          <div className="space-y-2">
            <Label htmlFor="type">Type d'envoi *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type d'envoi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="convocation">Convocation</SelectItem>
                <SelectItem value="relance">Relance</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
                <SelectItem value="certificat">Certificat</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="rappel">Rappel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destinataires */}
          <div className="space-y-2">
            <Label>Destinataires *</Label>
            <div className="flex space-x-2">
              <Select value={selectedLearnerId} onValueChange={setSelectedLearnerId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={isLoadingLearners ? "Chargement..." : "Sélectionnez un apprenant"} />
                </SelectTrigger>
                <SelectContent>
                  {apprenants.map((apprenant: any) => (
                    <SelectItem key={apprenant.id} value={apprenant.id.toString()}>
                      {apprenant.first_name} {apprenant.last_name} ({apprenant.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddDestinataire} disabled={!selectedLearnerId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.destinataires.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.destinataires.map(dest => (
                  <Badge key={dest.id} variant="secondary" className="flex items-center gap-1">
                    {dest.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveDestinataire(dest.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <Label htmlFor="sujet">Sujet *</Label>
            <Input
              id="sujet"
              value={formData.sujet}
              onChange={(e) => setFormData(prev => ({ ...prev, sujet: e.target.value }))}
              placeholder="Objet de l'email"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Contenu personnalisé du message..."
              rows={4}
            />
          </div>

          {/* Document à joindre */}
          <div className="space-y-2">
            <Label htmlFor="document">Document à joindre</Label>
            <Select value={formData.document} onValueChange={(value) => setFormData(prev => ({ ...prev, document: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un document (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {documents.map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {doc.titre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date d'envoi */}
          <div className="space-y-2">
            <Label htmlFor="dateEnvoi">Date d'envoi</Label>
            <Select value={formData.dateEnvoi} onValueChange={(value) => setFormData(prev => ({ ...prev, dateEnvoi: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoi immédiat
                  </div>
                </SelectItem>
                <SelectItem value="programme">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programmer l'envoi
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.dateEnvoi === 'immediate' ? 'Envoyer maintenant' : 'Programmer'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
