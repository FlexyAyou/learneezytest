import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, CheckCircle, XCircle, Clock, Users, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerAttendance = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const courses = [
    { id: 1, title: 'React Development - Semaine 1', date: '2024-01-15', instructor: 'Marie Dubois' },
    { id: 2, title: 'UI/UX Design - Introduction', date: '2024-01-16', instructor: 'Jean Martin' },
    { id: 3, title: 'Project Management - Planification', date: '2024-01-17', instructor: 'Sophie Laurent' },
    { id: 4, title: 'Marketing Digital - SEO', date: '2024-01-18', instructor: 'Pierre Moreau' },
  ];

  const attendanceData = [
    {
      id: 1,
      student: 'Alice Bernard',
      email: 'alice@learneezy.com',
      course: 'React Development',
      sessions: [
        { date: '2024-01-15', status: 'Présent', duration: '2h' },
        { date: '2024-01-17', status: 'Absent', duration: '2h' },
        { date: '2024-01-19', status: 'Présent', duration: '2h' },
        { date: '2024-01-22', status: 'Retard', duration: '1.5h' },
      ]
    },
    {
      id: 2,
      student: 'Thomas Petit',
      email: 'thomas@learneezy.com',
      course: 'UI/UX Design',
      sessions: [
        { date: '2024-01-16', status: 'Présent', duration: '2h' },
        { date: '2024-01-18', status: 'Présent', duration: '2h' },
        { date: '2024-01-20', status: 'Présent', duration: '2h' },
        { date: '2024-01-23', status: 'Absent', duration: '0h' },
      ]
    },
    {
      id: 3,
      student: 'Emma Moreau',
      email: 'emma@learneezy.com',
      course: 'Project Management',
      sessions: [
        { date: '2024-01-17', status: 'Présent', duration: '2h' },
        { date: '2024-01-19', status: 'Retard', duration: '1.5h' },
        { date: '2024-01-21', status: 'Présent', duration: '2h' },
        { date: '2024-01-24', status: 'Présent', duration: '2h' },
      ]
    },
  ];

  const getAttendanceRate = (sessions: any[]) => {
    const presentCount = sessions.filter(s => s.status === 'Présent').length;
    return Math.round((presentCount / sessions.length) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Présent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Retard':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Présent':
        return 'default';
      case 'Absent':
        return 'destructive';
      case 'Retard':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suivi des Présences</h1>
        <p className="text-muted-foreground">Monitoring de l'assiduité des apprenants</p>
      </div>

      {/* Filters */}
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
              <label className="text-sm font-medium">Cours</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les cours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cours</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Nom de l'apprenant..." className="pl-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Taux de présence</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">8%</p>
                <p className="text-sm text-muted-foreground">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">5%</p>
                <p className="text-sm text-muted-foreground">Retards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Apprenants actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Détail des Présences
          </CardTitle>
          <CardDescription>Historique complet par apprenant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {attendanceData.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{student.student}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-sm text-muted-foreground">Formation: {student.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{getAttendanceRate(student.sessions)}%</p>
                    <p className="text-sm text-muted-foreground">Assiduité</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {student.sessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <div>
                          <p className="text-sm font-medium">{session.date}</p>
                          <p className="text-xs text-muted-foreground">{session.duration}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(session.status)} className="text-xs">
                        {session.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Exporter rapport de présence
            </Button>
            <Button variant="outline" size="sm">
              Envoyer rappel aux absents
            </Button>
            <Button variant="outline" size="sm">
              Voir statistiques mensuelles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAttendance;