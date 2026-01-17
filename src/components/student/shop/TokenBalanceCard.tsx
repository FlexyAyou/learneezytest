import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Sparkles, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TokenBalanceCardProps {
  balance: number;
  isLoading?: boolean;
}

export const TokenBalanceCard = ({ balance, isLoading }: TokenBalanceCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-token/20 via-token-muted to-bonus/10 border-token/30 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-token/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-bonus/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-token" />
              Mon solde de tokens
            </p>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-token" />
                <span className="text-4xl font-bold text-token">{balance.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>Disponible maintenant</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Utilisez vos tokens pour accéder aux formations premium
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
