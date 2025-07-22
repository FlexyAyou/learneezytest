import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Monitor,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search
} from 'lucide-react';

const TutorPlanningNotifications = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const upcomingSessions = [
    {
      id: 1,
      student: 'Emma Martin',
      subject: 'Mathématiques',
      instructor: 'M. Bertrand',
      date: '2024-01-20',
      time: '14:00',
      duration: '1h30',
      type: 'presentiel',
      location: 'Salle 205',
      status: 'confirmed'
    },
    {
      id: 2,
      student: 'Emma Martin',
      subject: 'Anglais',
      instructor: 'Mme Johnson',
      date: '2024-01-22',
      time: '16:00',
      duration: '1h',
      type: 'distanciel',
      location: 'https://meet.google.com/abc-defg-hij',
      status: 'confirmed'
    },
    {
      id: 3,
      student: 'Lucas Dubois',
      subject: 'Sciences Physiques',
      instructor: 'M. Dupont',
      date: '2024-01-25',
      time: '10:30',
      duration: '2h',
      type: 'presentiel',
      location: 'Laboratoire A',
      status: 'pending'
    },
    {
      id: 4,
      student: 'Lucas Dubois',
      subject: 'Français',
      instructor: 'Mme Martin',
      date: '2024-01-18',
      time: '09:00',
      duration: '1h',
      type: 'distanciel',
      location: 'https://zoom.us/j/123456789',
      status: 'cancelled'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'schedule_change',
      student: 'Emma Martin',
      title: 'Changement d\'horaire',
      message: 'Le cours de mathématiques du 20/01 a été déplacé de 15h à 14h',
      date: '2024-01-15',
      priority: 'medium',
      read: false
    },
    {
      id: 2,
      type: 'homework_missing',
      student: 'Lucas Dubois',
      title: 'Devoir non remis',
      message: 'Devoir de français non remis - échéance dépassée',
      date: '2024-01-14',
      priority: 'high',
      read: false
    },
    {
      id: 3,
      type: 'absence',
      student: 'Emma Martin',
      title: 'Absence signalée',
      message: 'Absence au cours d\'anglais du 13/01',
      date: '2024-01-13',
      priority: 'low',
      read: true
    },
    {
      id: 4,
      type: 'evaluation',
      student: 'Lucas Dubois',
      title: 'Nouvelle évaluation',
      message: 'Note de contrôle de sciences : 18/20',
      date: '2024-01-12',
      priority: 'low',
      read: true
    }
  ];

  const students = ['Emma Martin', 'Lucas Dubois'];

  const filteredSessions = upcomingSessions.filter(session => {
    const matchesStudent = selectedStudent === 'all' || session.student === selectedStudent;
    const matchesSearch = session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStudent && matchesSearch;
  });

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'schedule_change': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'homework_missing': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'absence': return <XCircle className="h-4 w-4 text-orange-600" />;
      case 'evaluation': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Planning & Notifications</h1>
        <p className="text-gray-600">Calendrier et notifications importantes</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les élèves</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student} value={student}>{student}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par matière ou formateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions">Sessions à Venir</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications 
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          {/* Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{session.subject}</CardTitle>
                      <CardDescription>{session.student}</CardDescription>
                    </div>
                    <Badge className={getSessionStatusColor(session.status)} variant="secondary">
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{session.date}</span>
                    <Clock className="h-4 w-4 text-gray-500 ml-4" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    {session.type === 'presentiel' ? (
                      <MapPin className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Monitor className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="truncate">{session.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Formateur: {session.instructor}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <Badge variant="outline" className="text-xs">
                      {session.type === 'presentiel' ? 'Présentiel' : 'Distanciel'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune session trouvée pour les filtres sélectionnés</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {/* Notifications */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Alert key={notification.id} className={`${getPriorityColor(notification.priority)} ${!notification.read ? 'border-l-4' : ''}`}>
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <AlertDescription className="text-sm">
                      <span className="font-medium">{notification.student}</span> • {notification.message}
                    </AlertDescription>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {notifications.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune notification</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorPlanningNotifications;