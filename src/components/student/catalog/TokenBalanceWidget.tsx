import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TokenBalanceWidgetProps {
  balance: number;
  isLoading?: boolean;
}

export const TokenBalanceWidget = ({ balance, isLoading = false }: TokenBalanceWidgetProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-token/10 via-background to-primary/10 border-token/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-token-muted rounded-xl">
              <Coins className="h-8 w-8 text-token" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Votre solde</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{balance.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">tokens</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/apprenant/boutique')}
            className="bg-token hover:bg-token/90 text-token-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            Recharger
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
