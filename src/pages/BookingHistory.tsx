import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Video, Star, Download, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingHistory = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const bookings = [
    {
      id: '1',
      courseTitle: 'Mathématiques - Fractions et Nombres Décimaux',
      instructorName: 'Marie Dubois',
      instructorPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b9c9b3c8?w=100&h=100&fit=crop&crop=face',
      date: '2024-01-20',
      startTime: '09:00',
      endTime: '10:00',
      status: 'completed' as const,
      paymentStatus: 'paid' as const,
      totalAmount: 25,
      type: 'presential' as const,
      location: 'Salle A101',
      level: 'CM1',
      category: 'Mathématiques',
      confirmationCode: 'ABC123',
      rating: 5,
      hasReview: true
    },
    {
      id: '2',
      courseTitle: 'Français - Analyse de Texte',
      instructorName: 'Paul Martin',
      instructorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '2024-01-25',
      startTime: '14:00',
      endTime: '15:30',
      status: 'confirmed' as const,
      paymentStatus: 'paid' as const,
      totalAmount: 30,
      type: 'online' as const,
      level: '6ème',
      category: 'Français',
      confirmationCode: 'DEF456',
      hasReview: false
    },
    {
      id: '3',
      courseTitle: 'Sciences - Les États de la Matière',
      instructorName: 'Sophie Laurent',
      instructorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: '2024-01-30',
      startTime: '16:00',
      endTime: '17:00',
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      totalAmount: 35,
      type: 'presential' as const,
      location: 'Salle B203',
      level: 'CE2',
      category: 'Sciences',
      confirmationCode: 'GHI789',
      hasReview: false
    },
    {
      id: '4',
      courseTitle: 'Anglais - Vocabulaire et Grammaire',
      instructorName: 'Emma Wilson',
      instructorPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b9c9b3c8?w=100&h=100&fit=crop&crop=face',
      date: '2024-01-15',
      startTime: '10:30',
      endTime: '11:30',
      status: 'cancelled' as const,
      paymentStatus: 'refunded' as const,
      totalAmount: 28,
      type: 'online' as const,
      level: '5ème',
      category: 'Anglais',
      confirmationCode: 'JKL012',
      hasReview: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">Remboursé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const handleReview = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setIsReviewDialogOpen(true);
  };

  const submitReview = () => {
    console.log('Review submitted:', { bookingId: selectedBooking, rating: reviewRating, comment: reviewComment });
    setIsReviewDialogOpen(false);
    setReviewRating(5);
    setReviewComment('');
    setSelectedBooking(null);
  };

  const BookingCard = ({ booking }: { booking: typeof bookings[0] }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={booking.instructorPhoto}
              alt={booking.instructorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{booking.courseTitle}</h3>
              <p className="text-gray-600">avec {booking.instructorName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{booking.level}</Badge>
                <Badge variant="outline">{booking.category}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(booking.status)}
            <div className="mt-1">
              {getPaymentStatusBadge(booking.paymentStatus)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(booking.date).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {booking.startTime} - {booking.endTime}
          </div>
          <div className="flex items-center gap-1">
            {booking.type === 'online' ? (
              <>
                <Video className="h-4 w-4" />
                En ligne
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                {booking.location}
              </>
            )}
          </div>
          <div className="font-semibold text-blue-600">
            {booking.totalAmount}€
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Code de confirmation: <span className="font-mono">{booking.confirmationCode}</span>
          </div>
          
          <div className="flex gap-2">
            {booking.status === 'completed' && !booking.hasReview && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleReview(booking.id)}
              >
                <Star className="h-4 w-4 mr-1" />
                Noter
              </Button>
            )}
            {booking.status === 'completed' && booking.hasReview && (
              <div className="flex items-center text-sm text-yellow-600">
                <Star className="h-4 w-4 mr-1 fill-current" />
                {booking.rating}/5
              </div>
            )}
            {booking.status === 'confirmed' && (
              <>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contacter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Rejoindre
                </Button>
              </>
            )}
            {booking.status === 'pending' && (
              <Button variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Réservations</h1>
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminées ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées ({cancelledBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation à venir</h3>
                  <p className="text-gray-600">Explorez nos cours et réservez votre prochain créneau !</p>
                  <Button className="mt-4">Voir les cours</Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun cours terminé</h3>
                  <p className="text-gray-600">Vos cours terminés apparaîtront ici.</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <X className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation annulée</h3>
                  <p className="text-gray-600">Les réservations annulées apparaîtront ici.</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog d'évaluation */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Évaluer le cours</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <Select value={reviewRating.toString()} onValueChange={(value) => setReviewRating(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une note" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span>{rating} étoile{rating > 1 ? 's' : ''}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
              <Textarea
                placeholder="Partagez votre expérience avec ce cours..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={submitReview} className="flex-1">
                Publier l'avis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BookingHistory;