
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  actions,
  title = "Actions Rapides",
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="h-2 w-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-20 flex-col space-y-2 group hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-pink-300"
                onClick={action.onClick}
              >
                <div className={`p-2 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-700 group-hover:text-pink-700 transition-colors">
                    {action.title}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
