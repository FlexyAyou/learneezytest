
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Mail, Eye, MousePointer, TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';

interface EmailAnalyticsProps {
  data: {
    overview: {
      totalSent: number;
      totalOpened: number;
      totalClicked: number;
      totalBounced: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
    };
    campaigns: Array<{
      id: string;
      name: string;
      type: string;
      sent: number;
      opened: number;
      clicked: number;
      openRate: number;
      clickRate: number;
    }>;
    trends: Array<{
      date: string;
      sent: number;
      opened: number;
      clicked: number;
    }>;
    segmentPerformance: Array<{
      segment: string;
      sent: number;
      openRate: number;
      clickRate: number;
    }>;
  };
}

export const EmailAnalytics: React.FC<EmailAnalyticsProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const pieData = [
    { name: 'Ouverts', value: data.overview.totalOpened, color: '#10B981' },
    { name: 'Cliqués', value: data.overview.totalClicked, color: '#3B82F6' },
    { name: 'Bounced', value: data.overview.totalBounced, color: '#EF4444' },
    { name: 'Non ouverts', value: data.overview.totalSent - data.overview.totalOpened, color: '#6B7280' }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails envoyés</p>
                <p className="text-2xl font-bold">{data.overview.totalSent.toLocaleString()}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                +12% vs mois dernier
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'ouverture</p>
                <p className="text-2xl font-bold">{data.overview.openRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={data.overview.openRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de clic</p>
                <p className="text-2xl font-bold">{data.overview.clickRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Progress value={data.overview.clickRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de rebond</p>
                <p className="text-2xl font-bold">{data.overview.bounceRate}%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={data.overview.bounceRate < 5 ? "default" : "destructive"} className="text-xs">
                {data.overview.bounceRate < 5 ? 'Bon' : 'À améliorer'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendances d'engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Envoyés" />
                <Line type="monotone" dataKey="opened" stroke="#82ca9d" name="Ouverts" />
                <Line type="monotone" dataKey="clicked" stroke="#ffc658" name="Cliqués" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance par campagne */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance des campagnes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Campagne</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-right p-2">Envoyés</th>
                  <th className="text-right p-2">Ouverts</th>
                  <th className="text-right p-2">Cliqués</th>
                  <th className="text-right p-2">Taux ouverture</th>
                  <th className="text-right p-2">Taux clic</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{campaign.name}</td>
                    <td className="p-2">
                      <Badge variant="outline">{campaign.type}</Badge>
                    </td>
                    <td className="p-2 text-right">{campaign.sent}</td>
                    <td className="p-2 text-right">{campaign.opened}</td>
                    <td className="p-2 text-right">{campaign.clicked}</td>
                    <td className="p-2 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.openRate > 25 ? 'bg-green-100 text-green-800' : 
                        campaign.openRate > 15 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {campaign.openRate}%
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.clickRate > 5 ? 'bg-green-100 text-green-800' : 
                        campaign.clickRate > 2 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {campaign.clickRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance par segment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance par segment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.segmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="openRate" fill="#8884d8" name="Taux d'ouverture %" />
              <Bar dataKey="clickRate" fill="#82ca9d" name="Taux de clic %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
