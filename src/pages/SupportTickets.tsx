
import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const SupportTickets = () => {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [response, setResponse] = useState('');

  const tickets = [
    {
      id: 1,
      title: "Impossible d'accéder à mon cours",
      user: "Marie Dubois",
      email: "marie@email.com",
      priority: "Haute",
      status: "Ouvert",
      category: "Technique",
      created: "2024-03-15 14:30",
      lastUpdate: "2024-03-15 15:45",
      description: "Je ne peux plus accéder à mon cours de Python depuis ce matin. La page se charge indéfiniment.",
      responses: 2
    },
    {
      id: 2,
      title: "Problème de paiement",
      user: "Pierre Martin",
      email: "pierre@email.com",
      priority: "Critique",
      status: "En cours",
      category: "Facturation",
      created: "2024-03-15 10:15",
      lastUpdate: "2024-03-15 16:20",
      description: "Ma carte a été débitée mais je n'ai pas accès au cours acheté.",
      responses: 5
    },
    {
      id: 3,
      title: "Certificat non généré",
      user: "Sophie Chen",
      email: "sophie@email.com",
      priority: "Moyenne",
      status: "Résolu",
      category: "Certificats",
      created: "2024-03-14 16:45",
      lastUpdate: "2024-03-15 09:30",
      description: "J'ai terminé le cours mais le certificat n'apparaît pas dans mon profil.",
      responses: 3
    },
    {
      id: 4,
      title: "Demande de remboursement",
      user: "Jean Dupont",
      email: "jean@email.com",
      priority: "Moyenne",
      status: "En attente",
      category: "Remboursement",
      created: "2024-03-14 11:20",
      lastUpdate: "2024-03-14 11:20",
      description: "Je souhaite annuler mon inscription et être remboursé.",
      responses: 0
    }
  ];

  const handleTicketAction = (ticketId: number, action: string) => {
    setSelectedTicket(ticketId);
    toast({
      title: `Ticket ${action}`,
      description: `Action "${action}" appliquée au ticket #${ticketId}`,
    });
  };

  const handleSendResponse = () => {
    if (!response.trim()) return;
    
    toast({
      title: "Réponse envoyée",
      description: "Votre réponse a été envoyée au client",
    });
    setResponse('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critique': return 'bg-red-100 text-red-800';
      case 'Haute': return 'bg-orange-100 text-orange-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert': return 'bg-blue-100 text-blue-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Résolu': return 'bg-green-100 text-green-800';
      case 'Fermé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technique': return '🔧';
      case 'Facturation': return '💳';
      case 'Certificats': return '🏆';
      case 'Remboursement': return '💰';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support client</h1>
            <p className="text-gray-600">Gestion des tickets et demandes d'assistance</p>
          </div>
          <Button className="bg-pink-600 hover:bg-pink-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Nouveau ticket
          </Button>
        </div>

        {/* Statistiques du support */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tickets ouverts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-xs text-muted-foreground">+3 depuis hier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En cours de traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-xs text-muted-foreground">Assignés aux agents</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Résolus aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-muted-foreground">87% de satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">-15min vs hier</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des tickets */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Tickets de support
                </CardTitle>
                <CardDescription>Demandes d'assistance clients</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Rechercher dans les tickets..." className="pl-10" />
                    </div>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-md">
                    <option value="all">Tous les statuts</option>
                    <option value="open">Ouverts</option>
                    <option value="progress">En cours</option>
                    <option value="resolved">Résolus</option>
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>

                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedTicket === ticket.id ? 'border-pink-500 bg-pink-50' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                            <h4 className="font-semibold">#{ticket.id} - {ticket.title}</h4>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {ticket.user}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {ticket.created}
                            </span>
                            <span>{ticket.responses} réponse(s)</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Dernière mise à jour: {ticket.lastUpdate}
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTicketAction(ticket.id, 'Répondre');
                            }}
                          >
                            Répondre
                          </Button>
                          {ticket.status === 'Ouvert' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTicketAction(ticket.id, 'Résoudre');
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Résoudre
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de réponse */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Réponses templates
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Assigner à un agent
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Escalader
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Fermer le ticket
                </Button>
              </CardContent>
            </Card>

            {selectedTicket && (
              <Card>
                <CardHeader>
                  <CardTitle>Répondre au ticket #{selectedTicket}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Votre réponse</label>
                      <Textarea 
                        placeholder="Tapez votre réponse..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSendResponse}
                        className="bg-pink-600 hover:bg-pink-700"
                        disabled={!response.trim()}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Envoyer
                      </Button>
                      <Button variant="outline">
                        Brouillon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Templates de réponse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100">
                  <p className="text-sm font-medium">Problème technique</p>
                  <p className="text-xs text-gray-600">Template pour les bugs...</p>
                </div>
                <div className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100">
                  <p className="text-sm font-medium">Remboursement</p>
                  <p className="text-xs text-gray-600">Procédure de remboursement...</p>
                </div>
                <div className="p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100">
                  <p className="text-sm font-medium">Certificat</p>
                  <p className="text-xs text-gray-600">Aide pour les certificats...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
