
import React from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const InstructorAnalytics = () => {
  const navigate = useNavigate();

  const enrollmentData = [
    { month: 'Jan', inscriptions: 45 },
    { month: 'Fév', inscriptions: 52 },
    { month: 'Mar', inscriptions: 61 },
    { month: 'Avr', inscriptions: 58 },
    { month: 'Mai', inscriptions: 67 },
    { month: 'Jun', inscriptions: 74 },
  ];

  const coursePerformance = [
    { cours: 'React Débutants', étudiants: 1250, revenus: 15000, taux: 85 },
    { cours: 'JS Avancé', étudiants: 890, revenus: 12500, taux: 92 },
    { cours: 'Vue.js', étudiants: 650, revenus: 8200, taux: 78 },
    { cours: 'Node.js', étudiants: 420, revenus: 5600, taux: 88 },
  ];

  const completionData = [
    { name: 'Terminé', value: 65, color: '#10B981' },
    { name: 'En cours', value: 25, color: '#F59E0B' },
    { name: 'Abandonné', value: 10, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/instructeur')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Analysez les performances de vos cours</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€41,300</div>
              <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total étudiants</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,210</div>
              <p className="text-xs text-muted-foreground">+8% ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86%</div>
              <p className="text-xs text-muted-foreground">+3% ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28,450</div>
              <p className="text-xs text-muted-foreground">+15% ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Évolution des inscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inscriptions" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition des complétions */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des complétions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {completionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance des cours */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Étudiants</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenus</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Taux de complétion</th>
                  </tr>
                </thead>
                <tbody>
                  {coursePerformance.map((course, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{course.cours}</td>
                      <td className="py-3 px-4 text-gray-600">{course.étudiants.toLocaleString()}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">
                        €{course.revenus.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${course.taux}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{course.taux}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
