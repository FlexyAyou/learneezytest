import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  Video,
  Mail,
  Bell,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VideoConference {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'missed';
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    present?: boolean;
  };
  student: {
    id: string;
    name: string;
    avatar?: string;
    present?: boolean;
  };
  course: string;
  meetingUrl?: string;
  attendanceStatus: 'both_present' | 'instructor_absent' | 'student_absent' | 'both_absent' | 'pending';
}

const AdminVideoConferences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<VideoConference | null>(null);
  const { toast } = useToast();

  const videoConferences: VideoConference[] = [
    {
      id: '1',
      title: 'Session React Avancé',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      status: 'scheduled',
      instructor: { id: 'i1', name: 'Marie Dubois', avatar: '', present: undefined },
      student: { id: 's1', name: 'Pierre Martin', avatar: '', present: undefined },
      course: 'Développement React',
      meetingUrl: 'https://meet.learneezy.com/session-1',
      attendanceStatus: 'pending'
    },
    {
      id: '2',
      title: 'Cours Python Débutant',
      date: '2024-01-14',
      time: '10:30',
      duration: 45,
      status: 'completed',
      instructor: { id: 'i2', name: 'Jean Dupont', avatar: '', present: true },
      student: { id: 's2', name: 'Sophie Laurent', avatar: '', present: true },
      course: 'Initiation Python',
      attendanceStatus: 'both_present'
    },
    {
      id: '3',
      title: 'Formation JavaScript',
      date: '2024-01-13',
      time: '16:00',
      duration: 90,
      status: 'missed',
      instructor: { id: 'i3', name: 'Thomas Moreau', avatar: '', present: true },
      student: { id: 's3', name: 'Claire Rousseau', avatar: '', present: false },
      course: 'JavaScript ES6+',
      attendanceStatus: 'student_absent'
    },
    {
      id: '4',
      title: 'Session Node.js',
      date: '2024-01-12',
      time: '09:00',
      duration: 120,
      status: 'missed',
      instructor: { id: 'i4', name: 'Sarah Chen', avatar: '', present: false },
      student: { id: 's4', name: 'Marc Olivier', avatar: '', present: true },
      course: 'Backend Node.js',
      attendanceStatus: 'instructor_absent'
    },
    {
      id: '5',
      title: 'Révision Algorithmes',
      date: '2024-01-16',
      time: '11:00',
      duration: 75,
      status: 'scheduled',
      instructor: { id: 'i5', name: 'Paul Girard', avatar: '', present: undefined },
      student: { id: 's5', name: 'Emma Leroy', avatar: '', present: undefined },
      course: 'Algorithmes et Structures',
      meetingUrl: 'https://meet.learneezy.com/session-5',
      attendanceStatus: 'pending'
    }
  ];

  const filteredConferences = videoConferences.filter(conf => {
    const matchesSearch = conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conf.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conf.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conf.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || conf.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || conf.status === statusFilter;
    const matchesAttendance = attendanceFilter === 'all' || conf.attendanceStatus === attendanceFilter;
    
    return matchesSearch && matchesDate && matchesStatus && matchesAttendance;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { variant: 'default' as const, label: 'Planifiée', icon: Calendar },
      ongoing: { variant: 'secondary' as const, label: 'En cours', icon: Video },
      completed: { variant: 'default' as const, label: 'Terminée', icon: CheckCircle2 },
      missed: { variant: 'destructive' as const, label: 'Manquée', icon: XCircle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.scheduled;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getAttendanceBadge = (attendanceStatus: string) => {
    const variants = {
      both_present: { variant: 'default' as const, label: 'Tous présents', icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
      instructor_absent: { variant: 'destructive' as const, label: 'Formateur absent', icon: UserX, className: 'bg-red-100 text-red-800' },
      student_absent: { variant: 'destructive' as const, label: 'Apprenant absent', icon: UserX, className: 'bg-orange-100 text-orange-800' },
      both_absent: { variant: 'destructive' as const, label: 'Tous absents', icon: XCircle, className: 'bg-red-100 text-red-800' },
      pending: { variant: 'secondary' as const, label: 'En attente', icon: Clock, className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = variants[attendanceStatus as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={cn("flex items-center gap-1", config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleSendReminder = (conference: VideoConference, target: 'instructor' | 'student' | 'both') => {
    let message = '';
    if (target === 'instructor') {
      message = `Rappel envoyé à ${conference.instructor.name}`;
    } else if (target === 'student') {
      message = `Rappel envoyé à ${conference.student.name}`;
    } else {
      message = `Rappel envoyé aux deux participants`;
    }
    
    toast({
      title: "Rappel envoyé",
      description: message,
    });
  };

  const handleSendEmail = (conference: VideoConference, target: 'instructor' | 'student' | 'both') => {
    let message = '';
    if (target === 'instructor') {
      message = `Email envoyé à ${conference.instructor.name}`;
    } else if (target === 'student') {
      message = `Email envoyé à ${conference.student.name}`;
    } else {
      message = `Email envoyé aux deux participants`;
    }
    
    toast({
      title: "Email envoyé",
      description: message,
    });
  };

  const handleCreateSession = () => {
    toast({
      title: "Session créée",
      description: "La nouvelle session a été planifiée avec succès",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditSession = (conference: VideoConference) => {
    setSelectedConference(conference);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSession = () => {
    toast({
      title: "Session modifiée",
      description: "La session a été mise à jour avec succès",
    });
    setIsEditDialogOpen(false);
    setSelectedConference(null);
  };

  const handleCancelSession = (conference: VideoConference) => {
    toast({
      title: "Session annulée",
      description: `La session "${conference.title}" a été annulée`,
      variant: "destructive",
    });
  };

  const scheduledConferences = filteredConferences.filter(c => c.status === 'scheduled');
  const completedConferences = filteredConferences.filter(c => c.status === 'completed' || c.status === 'missed');

  const CreateSessionDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer une session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Titre</Label>
            <Input id="title" placeholder="Session de formation..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">Cours</Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">Développement React</SelectItem>
                <SelectItem value="python">Initiation Python</SelectItem>
                <SelectItem value="javascript">JavaScript ES6+</SelectItem>
                <SelectItem value="nodejs">Backend Node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructor" className="text-right">Formateur</Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un formateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marie">Marie Dubois</SelectItem>
                <SelectItem value="jean">Jean Dupont</SelectItem>
                <SelectItem value="thomas">Thomas Moreau</SelectItem>
                <SelectItem value="sarah">Sarah Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="student" className="text-right">Apprenant</Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un apprenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pierre">Pierre Martin</SelectItem>
                <SelectItem value="sophie">Sophie Laurent</SelectItem>
                <SelectItem value="claire">Claire Rousseau</SelectItem>
                <SelectItem value="marc">Marc Olivier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Heure</Label>
            <Input id="time" type="time" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Durée (min)</Label>
            <Input id="duration" type="number" placeholder="60" className="col-span-3" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreateSession}>
            Créer la session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EditSessionDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la session</DialogTitle>
        </DialogHeader>
        {selectedConference && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Titre</Label>
              <Input id="edit-title" defaultValue={selectedConference.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">Date</Label>
              <Input id="edit-date" type="date" defaultValue={selectedConference.date} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right">Heure</Label>
              <Input id="edit-time" type="time" defaultValue={selectedConference.time} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">Durée (min)</Label>
              <Input id="edit-duration" type="number" defaultValue={selectedConference.duration} className="col-span-3" />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleUpdateSession}>
            Mettre à jour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Visioconférences</h1>
          <p className="text-muted-foreground">
            Gérez les sessions de visioconférence planifiées et suivez la présence des participants
          </p>
        </div>
        <CreateSessionDialog />
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="scheduled">Planifiées</SelectItem>
                <SelectItem value="ongoing">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="missed">Manquées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Présence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les présences</SelectItem>
                <SelectItem value="both_present">Tous présents</SelectItem>
                <SelectItem value="instructor_absent">Formateur absent</SelectItem>
                <SelectItem value="student_absent">Apprenant absent</SelectItem>
                <SelectItem value="both_absent">Tous absents</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">
            Sessions Planifiées ({scheduledConferences.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Historique ({completedConferences.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions Planifiées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledConferences.map((conference) => (
                    <TableRow key={conference.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{conference.title}</div>
                          <div className="text-sm text-muted-foreground">{conference.course}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div>{new Date(conference.date).toLocaleDateString('fr-FR')}</div>
                            <div className="text-sm text-muted-foreground">{conference.time}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conference.instructor.avatar} />
                            <AvatarFallback>{conference.instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{conference.instructor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conference.student.avatar} />
                            <AvatarFallback>{conference.student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{conference.student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {conference.duration} min
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(conference.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(conference, 'both')}
                            title="Envoyer un rappel"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendEmail(conference, 'both')}
                            title="Envoyer un email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSession(conference)}
                            title="Modifier la session"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelSession(conference)}
                            title="Annuler la session"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Présence</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedConferences.map((conference) => (
                    <TableRow key={conference.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{conference.title}</div>
                          <div className="text-sm text-muted-foreground">{conference.course}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div>{new Date(conference.date).toLocaleDateString('fr-FR')}</div>
                            <div className="text-sm text-muted-foreground">{conference.time}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conference.instructor.avatar} />
                            <AvatarFallback>{conference.instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{conference.instructor.name}</span>
                            {conference.instructor.present === true && (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                            {conference.instructor.present === false && (
                              <UserX className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conference.student.avatar} />
                            <AvatarFallback>{conference.student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{conference.student.name}</span>
                            {conference.student.present === true && (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                            {conference.student.present === false && (
                              <UserX className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAttendanceBadge(conference.attendanceStatus)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(conference.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditSessionDialog />
    </div>
  );
};

export default AdminVideoConferences;