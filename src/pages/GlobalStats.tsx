
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign, Award, Eye, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const GlobalStats = () => {
  const monthlyData = [
    { month: 'Jan', users: 2400, courses: 120, revenue: 45000 },
    { month: 'Fév', users: 2600, courses: 135, revenue: 52000 },
    { month: 'Mar', users: 2847, courses: 147, revenue: 58000 },
    { month: 'Avr', users: 3100, courses: 162, revenue: 64000 },
    { month: 'Mai', users: 3350, courses: 178, revenue: 71000 },
    { month: 'Jun', users: 3500, courses: 185, revenue: 75000 }
  ];

  const courseCategories = [
    { name: 'Programmation', value: 35, color: '#8884d8' },
    { name: 'Design', value: 25, color: '#82ca9d' },
    { name: 'Marketing', value: 20, color: '#ffc658' },
    { name: 'Business', value: 12, color: '#ff7300' },
    { name: 'Autres', value: 8, color: '#00ff88' }
  ];

  const completionRates = [
    { course: 'JavaScript ES2024', rate: 87, students: 245 },
    { course: 'Python Data Science', rate: 92, students: 189 },
    { course: 'UX/UI Design', rate: 78, students: 156 },
    { course: 'Marketing Digital', rate: 85, students: 234 },
    { course: 'React Avancé', rate: 81, students: 167 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques globales</h1>
            <p className="text-gray-600">Vue d'ensemble des performances de la plateforme</p>
          </div>
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Eye className="h-4 w-4 mr-2" />
            Rapport détaillé
          </Button>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,248</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +12% ce mois-ci
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <div>📚 Étudiants: 14,124</div>
                <div>🎓 Instructeurs: 1,124</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours disponibles</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 cette semaine</p>
              <div className="mt-2 text-xs text-gray-500">
                <div>✅ Publiés: 1,185</div>
                <div>⏳ En révision: 62</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€75,248</div>
              <p className="text-xs text-muted-foreground">+8.2% vs mois dernier</p>
              <div className="mt-2 text-xs text-gray-500">
                <div>🔄 Récurrent: €36,163</div>
                <div>💰 Ponctuel: €39,085</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84%</div>
              <p className="text-xs text-muted-foreground">+3% vs trimestre dernier</p>
              <div className="mt-2 text-xs text-gray-500">
                <div>🏆 Certifiés: 12,067</div>
                <div>📈 En cours: 8,456</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution mensuelle</CardTitle>
              <CardDescription>Croissance des utilisateurs et des revenus</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Utilisateurs" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} name="Revenus (€)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition des cours par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories de cours</CardTitle>
              <CardDescription>Répartition du contenu par domaine</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {courseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cours les plus performants */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Taux de complétion par cours
                </CardTitle>
                <CardDescription>Performance des cours les plus populaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completionRates.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{course.course}</h4>
                        <p className="text-sm text-gray-600">{course.students} étudiants inscrits</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${course.rate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-green-600 min-w-[3rem]">{course.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métriques d'engagement */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Métriques d'engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Temps moyen par session</p>
                  <p className="text-2xl font-bold text-blue-900">45 min</p>
                  <p className="text-xs text-blue-600">+8% vs mois dernier</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Sessions quotidiennes</p>
                  <p className="text-2xl font-bold text-green-900">8,547</p>
                  <p className="text-xs text-green-600">+15% cette semaine</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Taux de rétention</p>
                  <p className="text-2xl font-bold text-purple-900">78%</p>
                  <p className="text-xs text-purple-600">Après 30 jours</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">NPS Score</p>
                  <p className="text-2xl font-bold text-orange-900">8.7</p>
                  <p className="text-xs text-orange-600">Satisfaction élevée</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs mensuels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Nouveaux utilisateurs</span>
                    <span>847/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: '84.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenus (€75K/€80K)</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Nouveaux cours</span>
                    <span>23/25</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalStats;
