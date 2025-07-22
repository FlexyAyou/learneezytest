import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, MessageSquare, Phone, Mail, FileText, Clock, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerSupport = () => {
  const { toast } = useToast();
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  });

  const tickets = [
    {
      id: 'TK-001',
      subject: 'Problème de paiement manqué',
      category: 'Paiements',
      priority: 'high',
      status: 'open',
      date: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Je n\'ai pas reçu le paiement pour ma session du 10 janvier avec Alice Martin.',
      response: null
    },
    {
      id: 'TK-002',
      subject: 'Demande d\'ajout de spécialité',
      category: 'Compte',
      priority: 'medium',
      status: 'in_progress',
      date: '2024-01-12',
      lastUpdate: '2024-01-14',
      description: 'J\'aimerais ajouter "Docker" à mes spécialités autorisées.',
      response: 'Votre demande est en cours d\'examen par notre équipe. Nous vous tiendrons informé sous 48h.'
    },
    {
      id: 'TK-003',
      subject: 'Problème technique avec le calendrier',
      category: 'Technique',
      priority: 'low',
      status: 'resolved',
      date: '2024-01-08',
      lastUpdate: '2024-01-09',
      description: 'Mes créneaux de disponibilité ne s\'affichent pas correctement.',
      response: 'Ce problème a été résolu. Veuillez vider le cache de votre navigateur et réessayer.'
    }
  ];

  const faqItems = [
    {
      category: 'Paiements',
      items: [
        {
          question: 'Quand suis-je payé pour mes formations ?',
          answer: 'Les paiements sont effectués automatiquement 24h après la fin de chaque session. La commission de 30% est prélevée et vous recevez 70% du montant payé par l\'étudiant.'
        },
        {
          question: 'Comment modifier mes coordonnées bancaires ?',
          answer: 'Vous pouvez modifier vos coordonnées bancaires dans la section "Paramètres de paiement" de votre profil. Les modifications prennent effet sous 24h.'
        },
        {
          question: 'Que faire si un paiement est manqué ?',
          answer: 'Si vous ne recevez pas un paiement attendu, contactez-nous via un ticket de support avec les détails de la session concernée.'
        }
      ]
    },
    {
      category: 'Réservations',
      items: [
        {
          question: 'Comment annuler une réservation ?',
          answer: 'Vous pouvez annuler une réservation jusqu\'à 24h avant le début. Au-delà, des frais d\'annulation peuvent s\'appliquer selon nos conditions.'
        },
        {
          question: 'Que faire si un étudiant ne se présente pas ?',
          answer: 'Si un étudiant ne se présente pas sans préavis, vous serez quand même rémunéré. Signalez l\'absence via votre tableau de bord.'
        }
      ]
    },
    {
      category: 'Compte',
      items: [
        {
          question: 'Comment ajouter une nouvelle spécialité ?',
          answer: 'Rendez-vous dans la section "Mes spécialités" et cliquez sur "Demander une nouvelle spécialité". Votre demande sera examinée par notre équipe.'
        },
        {
          question: 'Comment modifier mes tarifs ?',
          answer: 'Vous pouvez modifier vos tarifs à tout moment dans la section "Mes tarifs". Les nouveaux tarifs s\'appliquent aux prochaines réservations.'
        }
      ]
    }
  ];

  const handleSubmitTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket créé",
      description: "Votre demande a été envoyée. Vous recevrez une réponse sous 24h.",
    });

    setNewTicket({ subject: '', category: '', priority: 'medium', description: '' });
    setIsNewTicketDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Ouvert</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Résolu</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Faible</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support & Assistance</h1>
          <p className="text-muted-foreground">Besoin d'aide ? Nous sommes là pour vous accompagner</p>
        </div>
        
        <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Nouveau ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un ticket de support</DialogTitle>
              <DialogDescription>
                Décrivez votre problème ou votre demande. Notre équipe vous répondra rapidement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-subject">Sujet *</Label>
                <Input
                  id="ticket-subject"
                  placeholder="Résumez votre problème en quelques mots"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticket-category">Catégorie *</Label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payments">Paiements</SelectItem>
                    <SelectItem value="bookings">Réservations</SelectItem>
                    <SelectItem value="account">Compte</SelectItem>
                    <SelectItem value="technical">Technique</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticket-priority">Priorité</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Normal</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticket-description">Description *</Label>
                <Textarea
                  id="ticket-description"
                  placeholder="Décrivez votre problème en détail..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmitTicket}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Urgences</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Pour les problèmes urgents uniquement
            </p>
            <p className="font-medium">+33 1 23 45 67 89</p>
            <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Réponse sous 24h maximum
            </p>
            <p className="font-medium">support@learneezy.com</p>
            <p className="text-xs text-muted-foreground">24h/7j</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Chat en direct</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Support instantané
            </p>
            <Button size="sm" className="w-full">
              Démarrer le chat
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Lun-Ven 9h-18h</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Mes tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Mes tickets de support
              </CardTitle>
              <CardDescription>
                Suivez l'état de vos demandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          #{ticket.id} • {ticket.category} • Créé le {formatDate(ticket.date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>
                    
                    {ticket.response && (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-3">
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">S</span>
                          </div>
                          <span className="font-medium text-blue-900">Équipe Support</span>
                          <span className="text-xs text-blue-600 ml-auto">
                            Mis à jour le {formatDate(ticket.lastUpdate)}
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">{ticket.response}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Dernière mise à jour: {formatDate(ticket.lastUpdate)}
                      </div>
                      
                      {ticket.status === 'open' && (
                        <Button size="sm" variant="outline">
                          Ajouter un commentaire
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {tickets.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Aucun ticket</h3>
                    <p className="text-muted-foreground">
                      Vous n'avez aucun ticket de support en cours.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <div className="space-y-6">
            {faqItems.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold mb-2 flex items-start">
                          <HelpCircle className="mr-2 h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {item.question}
                        </h4>
                        <p className="text-sm text-gray-700 ml-6">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guides du formateur</CardTitle>
                <CardDescription>Documents utiles pour bien commencer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Guide de démarrage
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Bonnes pratiques pédagogiques
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Gestion des conflits
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Optimiser ses revenus
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Outils & Templates</CardTitle>
                <CardDescription>Ressources pour améliorer vos formations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Templates de présentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Exercices pratiques
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Grilles d'évaluation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Certificats de formation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerSupport;