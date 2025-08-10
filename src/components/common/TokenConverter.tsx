
import React from 'react';
import { Coins, Euro, Zap } from 'lucide-react';

interface TokenConverterProps {
  amount: number;
  tokens: number;
  conversionRate: number;
  bonus: number;
  onAmountChange: (amount: number) => void;
  onTokensChange: (tokens: number) => void;
}

export const TokenConverter = ({
  amount,
  tokens,
  conversionRate,
  bonus,
  onAmountChange,
  onTokensChange
}: TokenConverterProps) => {
  const totalTokens = tokens + bonus;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-green-600" />
          <span className="font-bold text-green-700">{amount}€</span>
        </div>
        <div className="text-2xl">→</div>
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-600" />
          <span className="font-bold text-yellow-700">{tokens}</span>
          {bonus > 0 && (
            <>
              <span className="text-gray-500">+</span>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="font-bold text-orange-600">{bonus}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {bonus > 0 && (
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-700">Total avec bonus:</span>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-lg text-yellow-700">{totalTokens}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600 text-center">
        Taux: 1€ = {conversionRate} tokens
      </div>
    </div>
  );
};
