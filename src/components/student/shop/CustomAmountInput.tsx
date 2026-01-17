import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Coins, Euro, Zap, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomAmountInputProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  conversionRate: number;
  calculateBonus: (amount: number) => number;
  maxAmount: number;
  minAmount?: number;
}

export const CustomAmountInput = ({
  amount,
  onAmountChange,
  conversionRate,
  calculateBonus,
  maxAmount,
  minAmount = 1
}: CustomAmountInputProps) => {
  const [inputValue, setInputValue] = useState(amount.toString());
  
  const tokens = Math.floor(amount * conversionRate);
  const bonus = calculateBonus(amount);
  const totalTokens = tokens + bonus;

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= minAmount && num <= maxAmount) {
      onAmountChange(num);
    }
  };

  const handleInputBlur = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num) || num < minAmount) {
      setInputValue(minAmount.toString());
      onAmountChange(minAmount);
    } else if (num > maxAmount) {
      setInputValue(maxAmount.toString());
      onAmountChange(maxAmount);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newAmount = value[0];
    setInputValue(newAmount.toString());
    onAmountChange(newAmount);
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Calculator className="h-4 w-4" />
          Montant personnalisé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input and preview */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              min={minAmount}
              max={maxAmount}
              className="pl-9 text-lg font-semibold"
            />
          </div>
          
          <div className="text-center text-muted-foreground">→</div>
          
          <div className="flex items-center gap-2 min-w-[120px]">
            <Coins className="h-5 w-5 text-token" />
            <span className="font-semibold text-lg text-token">{tokens}</span>
            {bonus > 0 && (
              <>
                <span className="text-muted-foreground">+</span>
                <span className="flex items-center gap-1 text-bonus font-semibold">
                  <Zap className="h-4 w-4" />
                  {bonus}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <Slider
            value={[amount]}
            onValueChange={handleSliderChange}
            min={minAmount}
            max={maxAmount}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minAmount}€</span>
            <span>{maxAmount}€</span>
          </div>
        </div>

        {/* Total display */}
        <div className="bg-token-muted rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vous recevrez</span>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-token" />
            <span className="text-xl font-bold text-token">{totalTokens}</span>
            <span className="text-sm text-muted-foreground">tokens</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
