
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, CheckCircle, XCircle, Download } from 'lucide-react';
import { TrainerBookingDetail } from './TrainerBookingDetail';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  student: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  location: string;
  notes?: string;
}

export const TrainerBookingsActions = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      student: 'Marie Dupont',
      course: 'React Avancé',
      date: '2024-01-20',
      time: '14:00',
      duration: 2,
      price: 80,
      status: 'pending',
      location: 'En ligne',
      notes: 'Première séance, focus sur les hooks'
    },
    {
      id: '2',
      student: 'Jean Martin',
      course: 'JavaScript ES6',
      date: '2024-01-22',
      time: '10:00',
      duration: 1.5,
      price: 60,
      status: 'confirmed',
      location: 'Paris 15e',
    },
    {
      id: '3',
      student: 'Sophie Bernard',
      course: 'TypeScript',
      date: '2024-01-25',
      time: '16:00',
      duration: 3,
      price: 120,
      status: 'cancelled',
      location: 'En ligne',
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'En attente' },
      confirmed: { variant: 'default' as const, label: 'Confirmé' },
      cancelled: { variant: 'destructive' as const, label: 'Annulé' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  const handleAccept = (booking: Booking) => {
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: 'confirmed' as const } : b
    ));
    toast({
      title: "Réservation acceptée",
      description: `La réservation de ${booking.student} a été confirmée.`,
    });
    setShowDetail(false);
  };

  const handleReject = (booking: Booking) => {
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
    ));
    toast({
      title: "Réservation refusée",
      description: `La réservation de ${booking.student} a été annulée.`,
    });
    setShowDetail(false);
  };

  const handleCancel = (booking: Booking) => {
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
    ));
    toast({
      title: "Réservation annulée",
      description: `La réservation de ${booking.student} a été annulée.`,
    });
    setShowDetail(false);
  };

  const handleDownloadSchedule = () => {
    const scheduleData = bookings.filter(b => b.status === 'confirmed')
      .map(b => `${b.date} ${b.time} - ${b.course} avec ${b.student}`)
      .join('\n');
    
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(scheduleData)}`;
    element.download = 'planning-cours.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Planning téléchargé",
      description: "Votre planning a été téléchargé avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Réservations</h2>
          <p className="text-gray-600">Gérez vos réservations et disponibilités</p>
        </div>
        <Button onClick={handleDownloadSchedule} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Télécharger planning
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Réservations récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.student}</TableCell>
                  <TableCell>{booking.course}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.price}€</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleAccept(booking)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(booking)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TrainerBookingDetail
        booking={selectedBooking}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onAccept={handleAccept}
        onReject={handleReject}
        onCancel={handleCancel}
      />
    </div>
  );
};
