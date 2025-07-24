import React, { useState } from 'react';
import { Bell, Check, X, Calendar, CreditCard, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'booking_confirmation',
      title: 'Réservation confirmée',
      message: 'Votre cours de Mathématiques avec Marie Dubois est confirmé pour demain à 9h00.',
      isRead: false,
      createdAt: '2024-01-24T10:30:00Z',
      data: { courseId: '1', slotId: '1' }
    },
    {
      id: '2',
      type: 'booking_reminder',
      title: 'Rappel de cours',
      message: 'Votre cours de Français commence dans 1 heure. Salle B203.',
      isRead: false,
      createdAt: '2024-01-24T13:00:00Z',
      data: { courseId: '2', slotId: '2' }
    },
    {
      id: '3',
      type: 'payment_success',
      title: 'Paiement réussi',
      message: 'Votre paiement de 35€ pour le cours de Physique-Chimie a été accepté.',
      isRead: true,
      createdAt: '2024-01-23T16:45:00Z',
      data: { amount: 35, courseId: '6' }
    },
    {
      id: '4',
      type: 'course_update',
      title: 'Modification de cours',
      message: 'Le cours d\'Anglais du 26/01 a été déplacé en ligne suite à une indisponibilité.',
      isRead: false,
      createdAt: '2024-01-23T09:15:00Z',
      data: { courseId: '5', slotId: '5' }
    },
    {
      id: '5',
      type: 'booking_cancelled',
      title: 'Cours annulé',
      message: 'Le cours de SVT du 25/01 a été annulé. Vous avez été remboursé automatiquement.',
      isRead: true,
      createdAt: '2024-01-22T14:20:00Z',
      data: { courseId: '8', amount: 38 }
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'booking_reminder':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'payment_success':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'course_update':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'booking_cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'1h';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;