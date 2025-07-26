import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, DollarSign, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerBookings = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const upcomingBookings = [
    { 
      id: 1, 
      student: { name: 'Alice Martin', email: 'alice@example.com', avatar: '' },
      subject: 'React Development', 
      date: '2024-01-15', 
      time: '14:00-16:00', 
      price: 90,
      commission: 27,
      status: 'confirmed',
      duration: 2,
      notes: 'Première séance, évaluer le niveau'
    },
    { 
      id: 2, 
      student: { name: 'Thomas Petit', email: 'thomas@example.com', avatar: '' },
      subject: 'JavaScript Avancé', 
      date: '2024-01-16', 
      time: '10:00-12:00', 
      price: 100,
      commission: 30,
      status: 'confirmed',
      duration: 2,
      notes: 'Focus sur les promesses et async/await'
    },
    { 
      id: 3, 
      student: { name: 'Emma Dubois', email: 'emma@example.com', avatar: '' },
      subject: 'UI/UX Design', 
      date: '2024-01-17', 
      time: '15:00-18:00', 
      price: 150,
      commission: 45,
      status: 'pending',
      duration: 3,
      notes: 'Création d\'un prototype interactif'
    },
  ];

  const completedBookings = [
    { 
      id: 4, 
      student: { name: 'Marie Bernard', email: 'marie@example.com', avatar: '' },
      subject: 'React Hooks', 
      date: '2024-01-10', 
      time: '09:00-12:00', 
      price: 135,
      commission: 40.5,
      status: 'completed',
      duration: 3,
      rating: 5,
      feedback: 'Excellente formation, très claire et pratique!'
    },
    { 
      id: 5, 
      student: { name: 'Pierre Durand', email: 'pierre@example.com', avatar: '' },
      subject: 'Anglais', 
      date: '2024-01-08', 
      time: '14:00-16:00', 
      price: 80,
      commission: 24,
      status: 'completed',
      duration: 2,
      rating: 4,
      feedback: 'Bonne formation, j\'aurais aimé plus d\'exemples.'
    },
  ];

  const cancelledBookings = [
    { 
      id: 6, 
      student: { name: 'Sophie Martin', email: 'sophie@example.com', avatar: '' },
      subject: 'Node.js', 
      date: '2024-01-12', 
      time: '16:00-18:00', 
      price: 96,
      commission: 28.8,
      status: 'cancelled',
      duration: 2,
      cancelReason: 'Annulé par l\'étudiant - urgence familiale',
      cancelledBy: 'student'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la raison de l'annulation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Réservation annulée",
      description: "La réservation a été annulée et l'étudiant a été notifié",
    });

    setCancelReason('');
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  const BookingCard = ({ booking, showActions = true }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {booking.student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{booking.student.name}</h3>
              <p className="text-sm text-muted-foreground">{booking.student.email}</p>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.time}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.price}€</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.duration}h</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <h4 className="font-medium text-sm mb-1">{booking.subject}</h4>
          {booking.notes && <p className="text-sm text-muted-foreground">{booking.notes}</p>}
        </div>

        {booking.rating && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium">Note: </span>
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < booking.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            {booking.feedback && (
              <p className="text-sm text-muted-foreground italic">"{booking.feedback}"</p>
            )}
          </div>
        )}

        {booking.cancelReason && (
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-red-800">
              <AlertCircle className="inline mr-1 h-4 w-4" />
              {booking.cancelReason}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span>Vous recevrez: <span className="font-semibold text-green-600">{(booking.price * 0.7).toFixed(0)}€</span></span>
          {showActions && booking.status === 'confirmed' && (
            <div className="space-x-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="mr-1 h-3 w-3" />
                Contacter
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleCancelBooking(booking)}
              >
                Annuler
              </Button>
            </div>
          )}
          {showActions && booking.status === 'pending' && (
            <div className="space-x-2">
              <Button size="sm" variant="outline">
                <XCircle className="mr-1 h-3 w-3" />
                Refuser
              </Button>
              <Button size="sm">
                <CheckCircle className="mr-1 h-3 w-3" />
                Confirmer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Réservations</h1>
        <p className="text-muted-foreground">Gérez vos sessions réservées par les élèves</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                <p className="text-muted-foreground text-sm">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{completedBookings.length}</p>
                <p className="text-muted-foreground text-sm">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{cancelledBookings.length}</p>
                <p className="text-muted-foreground text-sm">Annulées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {(upcomingBookings.reduce((acc, b) => acc + b.price, 0) * 0.7).toFixed(0)}€
                </p>
                <p className="text-muted-foreground text-sm">À recevoir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour les différents types de réservations */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div>
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div>
            {completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions={false} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <div>
            {cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog d'annulation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la réservation</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison de l'annulation. L'étudiant sera automatiquement notifié.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Raison de l'annulation (obligatoire)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmCancelBooking}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerBookings;