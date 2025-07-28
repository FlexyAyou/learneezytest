
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className = '',
  onClick
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <Card 
      className={`${className} ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''} transition-all duration-300 group border-l-4 border-l-pink-500 hover:border-l-pink-600`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div className="p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
          <Icon className="h-4 w-4 text-pink-600 group-hover:text-pink-700 transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
          {value}
        </div>
        {change && (
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-sm">{getTrendIcon()}</span>
            <p className={`text-xs font-medium ${getTrendColor()}`}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
