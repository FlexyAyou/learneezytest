import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Zap, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TokenPackage {
  id: string;
  amount: number;
  tokens: number;
  bonusPercent: number;
  bonus: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

interface TokenPackageCardProps {
  package: TokenPackage;
  isSelected: boolean;
  onSelect: (pkg: TokenPackage) => void;
  isLoading?: boolean;
}

export const TokenPackageCard = ({
  package: pkg,
  isSelected,
  onSelect,
  isLoading
}: TokenPackageCardProps) => {
  const totalTokens = pkg.tokens + pkg.bonus;

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group overflow-hidden',
        isSelected
          ? 'ring-2 ring-token bg-token-muted shadow-lg scale-[1.02]'
          : 'hover:ring-1 hover:ring-token/50 bg-card',
        pkg.isBestValue && 'border-bonus',
        pkg.isPopular && 'border-primary'
      )}
      onClick={() => !isLoading && onSelect(pkg)}
    >
      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {pkg.isPopular && (
          <Badge className="bg-primary text-primary-foreground text-xs">
            <Star className="h-3 w-3 mr-1" />
            Populaire
          </Badge>
        )}
        {pkg.isBestValue && (
          <Badge className="bg-bonus text-bonus-foreground text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Meilleure offre
          </Badge>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <div className="h-5 w-5 rounded-full bg-token flex items-center justify-center">
            <svg className="h-3 w-3 text-token-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <CardContent className="p-4 pt-8">
        {/* Price */}
        <div className="text-center mb-3">
          <span className="text-3xl font-bold text-foreground">{pkg.amount}€</span>
        </div>

        {/* Tokens display */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Coins className="h-5 w-5 text-token" />
          <span className="text-xl font-semibold text-token-foreground">{pkg.tokens}</span>
          {pkg.bonus > 0 && (
            <>
              <span className="text-muted-foreground">+</span>
              <div className="flex items-center gap-1 text-bonus">
                <Zap className="h-4 w-4" />
                <span className="font-semibold">{pkg.bonus}</span>
              </div>
            </>
          )}
        </div>

        {/* Bonus badge */}
        {pkg.bonusPercent > 0 && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-bonus border-bonus/30 bg-bonus/10">
              +{pkg.bonusPercent}% bonus
            </Badge>
          </div>
        )}

        {/* Total */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-bold text-lg text-token">{totalTokens} tokens</span>
          </div>
        </div>
      </CardContent>

      {/* Hover effect background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br from-token/5 to-bonus/5 opacity-0 transition-opacity duration-300',
        'group-hover:opacity-100',
        isSelected && 'opacity-100'
      )} />
    </Card>
  );
};
