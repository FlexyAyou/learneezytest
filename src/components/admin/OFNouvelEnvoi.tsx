
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, FileText, Calendar, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OFNouvelEnvoiProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OFNouvelEnvoi: React.FC<OFNouvelEnvoiProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    destinataires: [] as string[],
    sujet: '',
    message: '',
    document: '',
    dateEnvoi: 'immediate'
  });
  const [newDestinataire, setNewDestinataire] = useState('');
  const { toast } = useToast();

  const apprenants = [
    { id: '1', nom: 'Marie Dupont', email: 'marie.dupont@email.com', formation: 'React Avancé' },
    { id: '2', nom: 'Jean Martin', email: 'jean.martin@email.com', formation: 'JavaScript ES6' },
    { id: '3', nom: 'Sophie Bernard', email: 'sophie.bernard@email.com', formation: 'Vue.js' }
  ];

  const documents = [
    { id: '1', titre: 'Attestation de formation', type: 'attestation' },
    { id: '2', titre: 'Certificat de réalisation', type: 'certificat' },
    { id: '3', titre: 'Convention de formation', type: 'convention' },
    { id: '4', titre: 'Règlement intérieur', type: 'reglement' }
  ];

  const handleAddDestinataire = () => {
    if (newDestinataire && !formData.destinataires.includes(newDestinataire)) {
      setFormData(prev => ({
        ...prev,
        destinataires: [...prev.destinataires, newDestinataire]
      }));
      setNewDestinataire('');
    }
  };

  const handleRemoveDestinataire = (email: string) => {
    setFormData(prev => ({
      ...prev,
      destinataires: prev.destinataires.filter(d => d !== email)
    }));
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.sujet || formData.destinataires.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Envoi programmé",
      description: `L'envoi "${formData.sujet}" a été programmé pour ${formData.destinataires.length} destinataire(s)`,
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Nouvel envoi
          </DialogTitle>
          <DialogDescription>Configurez et envoyez un email à vos apprenants</DialogDescription>
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
              <Select value={newDestinataire} onValueChange={setNewDestinataire}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionnez un apprenant" />
                </SelectTrigger>
                <SelectContent>
                  {apprenants.map(apprenant => (
                    <SelectItem key={apprenant.id} value={apprenant.email}>
                      {apprenant.nom} - {apprenant.formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddDestinataire} disabled={!newDestinataire}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.destinataires.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.destinataires.map(email => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveDestinataire(email)}
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
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Mail className="h-4 w-4 mr-2" />
              {formData.dateEnvoi === 'immediate' ? 'Envoyer maintenant' : 'Programmer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
