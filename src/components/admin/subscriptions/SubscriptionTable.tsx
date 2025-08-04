
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  CreditCard, 
  Mail, 
  AlertCircle, 
  CheckCircle,
  Clock,
  X,
  Pause
} from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onViewDetails: (subscription: Subscription) => void;
  onEditSubscription: (subscription: Subscription) => void;
  onCancelSubscription: (subscription: Subscription) => void;
  onSendReminder: (subscription: Subscription) => void;
  onSuspendSubscription: (subscription: Subscription) => void;
  isLoading?: boolean;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onViewDetails,
  onEditSubscription,
  onCancelSubscription,
  onSendReminder,
  onSuspendSubscription,
  isLoading = false
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      trial: { label: 'Essai', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      expired: { label: 'Expiré', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      cancelled: { label: 'Annulé', variant: 'outline' as const, icon: X, color: 'text-gray-600' },
      suspended: { label: 'Suspendu', variant: 'outline' as const, icon: Pause, color: 'text-yellow-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryWarning = (endDate: string, status: string) => {
    if (status !== 'active') return null;
    
    const daysLeft = getDaysUntilExpiry(endDate);
    if (daysLeft <= 7 && daysLeft > 0) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}
        </Badge>
      );
    } else if (daysLeft <= 0) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expiré depuis {Math.abs(daysLeft)} jour{Math.abs(daysLeft) > 1 ? 's' : ''}
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Utilisateur</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Revenus</TableHead>
            <TableHead>Prochaine facturation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${subscription.user?.firstName} ${subscription.user?.lastName}`} />
                    <AvatarFallback>
                      {subscription.user?.firstName?.[0]}{subscription.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {subscription.user?.firstName} {subscription.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.user?.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {subscription.plan?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {subscription.plan?.price}€/{subscription.plan?.interval === 'monthly' ? 'mois' : 'an'}
                  </div>
                  {subscription.plan?.isPopular && (
                    <Badge variant="secondary" className="text-xs">Populaire</Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-2">
                  {getStatusBadge(subscription.status)}
                  {getExpiryWarning(subscription.endDate, subscription.status)}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-500">Début:</span> {format(new Date(subscription.startDate), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  <div>
                    <span className="text-gray-500">Fin:</span> {format(new Date(subscription.endDate), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  {subscription.trialEndDate && (
                    <div className="text-blue-600">
                      <span className="text-gray-500">Essai:</span> {format(new Date(subscription.trialEndDate), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm space-y-1">
                  <div className="font-medium">
                    {subscription.totalAmountPaid.toLocaleString()}€
                  </div>
                  <div className="text-gray-500">
                    Total payé
                  </div>
                  {subscription.discountApplied > 0 && (
                    <Badge variant="outline" className="text-xs">
                      -{subscription.discountApplied}% remise
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  {subscription.nextPaymentDate ? (
                    <div className={`${getDaysUntilExpiry(subscription.nextPaymentDate) <= 3 ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                      {format(new Date(subscription.nextPaymentDate), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                  {subscription.autoRenewal ? (
                    <Badge variant="outline" className="text-xs mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Auto
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Manuel
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onViewDetails(subscription)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditSubscription(subscription)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendReminder(subscription)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer rappel
                    </DropdownMenuItem>
                    {subscription.status === 'active' && (
                      <DropdownMenuItem onClick={() => onSuspendSubscription(subscription)}>
                        <Pause className="mr-2 h-4 w-4" />
                        Suspendre
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onCancelSubscription(subscription)}
                      className="text-red-600"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Annuler
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            Aucun abonnement trouvé
          </div>
        </div>
      )}
    </div>
  );
};
