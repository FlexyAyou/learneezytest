import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Bell,
  BookOpen,
  Home
} from 'lucide-react';

const ParentPlanningNotifications = () => {
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("current");

  const sessions = [
    {
      id: 1,
      studentName: "Emma Martin",
      subject: "Mathématiques",
      teacherName: "M. Dubois",
      teacherAvatar: "/placeholder.svg",
      date: "2024-01-22",
      time: "14:00 - 15:30",
      type: "Présentiel",
      location: "Salle 205",
      status: "Confirmé"
    },
    {
      id: 2,
      studentName: "Emma Martin",
      subject: "Français",
      teacherName: "Mme Lefèvre",
      teacherAvatar: "/placeholder.svg",
      date: "2024-01-23",
      time: "16:00 - 17:00",
      type: "Distanciel",
      location: "Lien Zoom",
      status: "Confirmé"
    },
    {
      id: 3,
      studentName: "Lucas Martin",
      subject: "Sciences",
      teacherName: "M. Bernard",
      teacherAvatar: "/placeholder.svg",
      date: "2024-01-24",
      time: "15:00 - 16:00",
      type: "Présentiel",
      location: "Laboratoire",
      status: "Modifié"
    },
    {
      id: 4,
      studentName: "Lucas Martin",
      subject: "Anglais",
      teacherName: "Mme Petit",
      teacherAvatar: "/placeholder.svg",
      date: "2024-01-25",
      time: "13:30 - 14:30",
      type: "Distanciel",
      location: "Teams",
      status: "Confirmé"
    },
    {
      id: 5,
      studentName: "Emma Martin",
      subject: "Histoire-Géo",
      teacherName: "M. Rousseau",
      teacherAvatar: "/placeholder.svg",
      date: "2024-01-26",
      time: "10:00 - 11:30",
      type: "Présentiel",
      location: "Salle 301",
      status: "Annulé"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "planning",
      priority: "high",
      title: "Changement de planning",
      message: "Le cours de Sciences de Lucas du 24/01 est avancé à 15h00",
      studentName: "Lucas Martin",
      date: "2024-01-20",
      read: false
    },
    {
      id: 2,
      type: "homework",
      priority: "medium",
      title: "Devoir non remis",
      message: "Emma n'a pas rendu son devoir de Mathématiques prévu pour le 19/01",
      studentName: "Emma Martin",
      date: "2024-01-19",
      read: false
    },
    {
      id: 3,
      type: "absence",
      priority: "low",
      title: "Absence signalée",
      message: "Lucas était absent au cours d'Anglais du 18/01",
      studentName: "Lucas Martin",
      date: "2024-01-18",
      read: true
    },
    {
      id: 4,
      type: "results",
      priority: "low",
      title: "Nouveaux résultats",
      message: "Les notes du quiz de Français d'Emma sont disponibles",
      studentName: "Emma Martin",
      date: "2024-01-17",
      read: true
    },
    {
      id: 5,
      type: "planning",
      priority: "high",
      title: "Session annulée",
      message: "Le cours d'Histoire-Géo d'Emma du 26/01 est annulé",
      studentName: "Emma Martin",
      date: "2024-01-16",
      read: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé": return "bg-green-100 text-green-800";
      case "Modifié": return "bg-yellow-100 text-yellow-800";
      case "Annulé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low": return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "planning": return <Calendar className="h-4 w-4" />;
      case "homework": return <BookOpen className="h-4 w-4" />;
      case "absence": return <XCircle className="h-4 w-4" />;
      case "results": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => 
    selectedStudent === "all" || session.studentName.includes(selectedStudent.split('_')[1] || "")
  );

  const filteredNotifications = notifications.filter(notification => 
    selectedStudent === "all" || notification.studentName.includes(selectedStudent.split('_')[1] || "")
  );

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planning & Notifications</h1>
          <p className="text-muted-foreground">Sessions à venir et notifications importantes</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les élèves</SelectItem>
              <SelectItem value="student_Emma">Emma Martin</SelectItem>
              <SelectItem value="student_Lucas">Lucas Martin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planning">Planning des sessions</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sessions à venir
              </CardTitle>
              <CardDescription>
                Prochaines sessions de formation pour vos enfants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar>
                      <AvatarImage src={session.teacherAvatar} />
                      <AvatarFallback>{session.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{session.subject}</h3>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.teacherName} • {session.studentName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {session.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.time}
                        </div>
                        <div className="flex items-center gap-1">
                          {session.type === "Présentiel" ? (
                            <>
                              <Home className="h-4 w-4" />
                              {session.location}
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4" />
                              {session.location}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {session.type === "Distanciel" && session.status === "Confirmé" && (
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Rejoindre
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications récentes
                  </CardTitle>
                  <CardDescription>
                    Changements de planning, devoirs non remis et autres alertes
                  </CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm">
                    Marquer tout comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Alert key={notification.id} className={`${!notification.read ? 'border-primary' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(notification.priority)}
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{notification.studentName}</Badge>
                            <span className="text-xs text-muted-foreground">{notification.date}</span>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <AlertDescription>{notification.message}</AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPlanningNotifications;