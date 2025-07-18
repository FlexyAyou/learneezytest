
import React from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const AdminSupport = () => {
  const { toast } = useToast();

  const tickets = [
    { 
      id: 1, 
      user: "Marie Dubois", 
      email: "marie@email.com", 
      subject: "Problème de connexion", 
      priority: "Haute", 
      status: "Ouvert", 
      created: "2024-01-15",
      category: "Technique"
    },
    { 
      id: 2, 
      user: "Pierre Martin", 
      email: "pierre@email.com", 
      subject: "Question sur le paiement", 
      priority: "Moyenne", 
      status: "En cours", 
      created: "2024-01-14",
      category: "Facturation"
    },
    { 
      id: 3, 
      user: "Sophie Durand", 
      email: "sophie@email.com", 
      subject: "Certificat non reçu", 
      priority: "Basse", 
      status: "Résolu", 
      created: "2024-01-13",
      category: "Certificats"
    }
  ];

  const handleAssignTicket = (ticketId: number) => {
    toast({
      title: "Ticket assigné",
      description: `Le ticket ${ticketId} vous a été assigné`,
    });
  };

  const handleResolveTicket = (ticketId: number) => {
    toast({
      title: "Ticket résolu",
      description: `Le ticket ${ticketId} a été marqué comme résolu`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets ouverts</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5 depuis hier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En traitement</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 aujourd'hui</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">+18 cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">Temps moyen</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets de support</CardTitle>
          <CardDescription>Gestion des demandes d'assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.user}</p>
                      <p className="text-sm text-gray-600">{ticket.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {ticket.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === 'Haute' 
                        ? 'bg-red-100 text-red-800' 
                        : ticket.priority === 'Moyenne'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'Ouvert' 
                        ? 'bg-red-100 text-red-800' 
                        : ticket.status === 'En cours'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.created}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignTicket(ticket.id)}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleResolveTicket(ticket.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Support par email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Répondre aux emails de support</p>
            <Button className="w-full">Consulter la boîte mail</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-green-600" />
              Support téléphonique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Gérer les appels entrants</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">Prendre un appel</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Chat en direct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Assistance instantanée</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Ouvrir le chat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSupport;
