
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle } from 'lucide-react';

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

interface TrainerBookingDetailProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

export const TrainerBookingDetail = ({ booking, isOpen, onClose, onAccept, onReject, onCancel }: TrainerBookingDetailProps) => {
  if (!booking) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'En attente', color: 'text-yellow-600' },
      confirmed: { variant: 'default' as const, label: 'Confirmé', color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, label: 'Annulé', color: 'text-red-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Détails de la réservation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Étudiant
                  </label>
                  <p className="text-gray-900">{booking.student}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Cours</label>
                  <p className="text-gray-900">{booking.course}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </label>
                  <p className="text-gray-900">{booking.date}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure
                  </label>
                  <p className="text-gray-900">{booking.time} ({booking.duration}h)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lieu
                  </label>
                  <p className="text-gray-900">{booking.location}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Tarif
                  </label>
                  <p className="text-gray-900">{booking.price}€</p>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Statut</label>
                <div className="mt-1">{getStatusBadge(booking.status)}</div>
              </div>

              {booking.notes && (
                <div>
                  <label className="font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4 border-t">
            {booking.status === 'pending' && (
              <>
                <Button onClick={() => onAccept(booking)} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepter
                </Button>
                <Button onClick={() => onReject(booking)} variant="outline" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <Button onClick={() => onCancel(booking)} variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
