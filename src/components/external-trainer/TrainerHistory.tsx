import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { History, Search, Filter, Download, Calendar, Clock, User, Star } from 'lucide-react';

const TrainerHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const sessionHistory = [
    {
      id: 1,
      date: '2024-01-10',
      time: '09:00-12:00',
      duration: 3,
      student: { name: 'Marie Bernard', email: 'marie@example.com', avatar: '' },
      subject: 'React Hooks',
      price: 135,
      netEarnings: 94.5,
      rating: 5,
      feedback: 'Excellente formation, très claire et pratique!',
      materials: ['Slides React Hooks', 'Exercices pratiques', 'Code source'],
      objectives: ['Comprendre useState', 'Maîtriser useEffect', 'Custom hooks']
    },
    {
      id: 2,
      date: '2024-01-08',
      time: '14:00-16:00',
      duration: 2,
      student: { name: 'Pierre Durand', email: 'pierre@example.com', avatar: '' },
      subject: 'JavaScript ES6+',
      price: 80,
      netEarnings: 56,
      rating: 4,
      feedback: 'Bonne formation, j\'aurais aimé plus d\'exemples.',
      materials: ['Guide ES6', 'Exercices arrow functions'],
      objectives: ['Arrow functions', 'Destructuring', 'Modules ES6']
    },
    {
      id: 3,
      date: '2024-01-05',
      time: '10:00-13:00',
      duration: 3,
      student: { name: 'Sophie Martin', email: 'sophie@example.com', avatar: '' },
      subject: 'UI/UX Design',
      price: 150,
      netEarnings: 105,
      rating: 5,
      feedback: 'Formation très enrichissante, merci!',
      materials: ['Figma templates', 'Design system', 'User personas'],
      objectives: ['Wireframing', 'Prototypage', 'Tests utilisateurs']
    },
    {
      id: 4,
      date: '2024-01-03',
      time: '15:00-17:00',
      duration: 2,
      student: { name: 'Thomas Petit', email: 'thomas@example.com', avatar: '' },
      subject: 'Node.js API',
      price: 96,
      netEarnings: 67.2,
      rating: 4,
      feedback: 'Contenu intéressant, rythme soutenu.',
      materials: ['Postman collection', 'Code API REST'],
      objectives: ['Express.js', 'Routes API', 'Middleware']
    },
    {
      id: 5,
      date: '2023-12-28',
      time: '09:00-11:00',
      duration: 2,
      student: { name: 'Emma Dubois', email: 'emma@example.com', avatar: '' },
      subject: 'TypeScript',
      price: 90,
      netEarnings: 63,
      rating: 5,
      feedback: 'Parfait pour débuter avec TypeScript!',
      materials: ['TypeScript playground', 'Types avancés'],
      objectives: ['Types de base', 'Interfaces', 'Generics']
    },
  ];

  const subjects = ['React', 'JavaScript', 'UI/UX Design', 'Node.js', 'TypeScript', 'Python'];

  const filteredSessions = sessionHistory.filter(session => {
    const matchesSearch = session.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || session.subject.includes(filterSubject);
    
    let matchesPeriod = true;
    if (filterPeriod !== 'all') {
      const sessionDate = new Date(session.date);
      const now = new Date();
      
      switch (filterPeriod) {
        case 'week':
          matchesPeriod = (now.getTime() - sessionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesPeriod = (now.getTime() - sessionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case 'quarter':
          matchesPeriod = (now.getTime() - sessionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesSearch && matchesSubject && matchesPeriod;
  });

  const totalSessions = filteredSessions.length;
  const totalHours = filteredSessions.reduce((acc, session) => acc + session.duration, 0);
  const totalEarnings = filteredSessions.reduce((acc, session) => acc + session.netEarnings, 0);
  const averageRating = filteredSessions.reduce((acc, session) => acc + session.rating, 0) / filteredSessions.length || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Historique de mes séances</h1>
          <p className="text-muted-foreground">Consultez toutes vos formations données</p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalSessions}</p>
                <p className="text-muted-foreground text-sm">Sessions totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalHours}h</p>
                <p className="text-muted-foreground text-sm">Heures enseignées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{Math.round(totalEarnings)}€</p>
                <p className="text-muted-foreground text-sm">Revenus totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-muted-foreground text-sm">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom d'étudiant ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Spécialité</label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les spécialités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les spécialités</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sessions */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {session.student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{session.student.name}</h3>
                    <p className="text-sm text-muted-foreground">{session.student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{session.netEarnings}€</p>
                  <p className="text-sm text-muted-foreground">
                    {session.price}€ - commission
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(session.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{session.time} ({session.duration}h)</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary">{session.subject}</Badge>
                </div>
                <div className="flex items-center">
                  <div className="flex">{renderStars(session.rating)}</div>
                </div>
              </div>

              {/* Objectifs de la session */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Objectifs couverts:</h4>
                <div className="flex flex-wrap gap-2">
                  {session.objectives.map((objective, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {objective}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Matériaux fournis */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Matériaux fournis:</h4>
                <div className="flex flex-wrap gap-2">
                  {session.materials.map((material, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback de l'étudiant */}
              {session.feedback && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-900 mb-1">
                    Commentaire de l'étudiant:
                  </h4>
                  <p className="text-sm text-blue-800 italic">"{session.feedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucune session trouvée</h3>
              <p className="text-muted-foreground">
                Aucune session ne correspond à vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainerHistory;