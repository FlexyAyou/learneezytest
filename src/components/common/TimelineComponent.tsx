
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface TimelineComponentProps {
  items: TimelineItem[];
  title?: string;
  className?: string;
}

export const TimelineComponent: React.FC<TimelineComponentProps> = ({
  items,
  title = "Activités Récentes",
  className = ""
}) => {
  const getTypeStyles = (type: TimelineItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconStyles = (type: TimelineItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="h-2 w-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative flex items-start space-x-3 group">
                {/* Timeline line */}
                {index < items.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-200 group-hover:bg-pink-300 transition-colors duration-300"></div>
                )}
                
                {/* Icon */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconStyles(item.type)} shadow-md group-hover:shadow-lg transition-all duration-300`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                {/* Content */}
                <div className={`flex-1 p-3 rounded-lg border ${getTypeStyles(item.type)} group-hover:shadow-md transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
