import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, History, Zap, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface PurchaseHistoryItem {
  id: string;
  date: string;
  amount: number;
  tokens: number;
  bonus: number;
  total: number;
  status?: 'completed' | 'pending' | 'failed';
  transaction_id?: string;
}

interface PurchaseHistoryListProps {
  purchases: PurchaseHistoryItem[];
  isLoading?: boolean;
}

const StatusBadge = ({ status }: { status: PurchaseHistoryItem['status'] }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Complété
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Échoué
        </Badge>
      );
    default:
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Complété
        </Badge>
      );
  }
};

export const PurchaseHistoryList = ({ purchases, isLoading }: PurchaseHistoryListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique des achats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique des achats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucun achat pour le moment</p>
            <p className="text-sm">Vos transactions apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          Historique des achats
          <Badge variant="secondary" className="ml-auto">
            {purchases.length} transaction{purchases.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3">
            {purchases.map((purchase) => {
              const purchaseDate = new Date(purchase.date);
              const isValidDate = !isNaN(purchaseDate.getTime());
              
              return (
                <div 
                  key={purchase.id} 
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {isValidDate 
                        ? format(purchaseDate, 'dd MMMM yyyy', { locale: fr })
                        : purchase.date
                      }
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{purchase.amount}€</span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        <Coins className="h-3 w-3 text-token" />
                        {purchase.tokens}
                      </span>
                      {purchase.bonus > 0 && (
                        <>
                          <span>+</span>
                          <span className="flex items-center gap-1 text-bonus">
                            <Zap className="h-3 w-3" />
                            {purchase.bonus}
                          </span>
                        </>
                      )}
                    </div>
                    {purchase.transaction_id && (
                      <p className="text-xs text-muted-foreground/60 font-mono">
                        #{purchase.transaction_id.slice(0, 8)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-token" />
                      <span className="font-bold text-token">{purchase.total}</span>
                    </div>
                    <StatusBadge status={purchase.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
