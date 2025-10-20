
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, BookOpen, Shield, CreditCard, Settings, AlertTriangle } from 'lucide-react';

export const SuperAdminActivity = () => {
  const recentActivity: any[] = [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucune activité récente</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
