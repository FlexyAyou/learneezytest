import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Users, CheckCircle, XCircle, Clock, Search, Filter, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerEnrollments = () => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const enrollmentRequests = [
    {
      id: 1,
      studentName: 'Julie Dubois',
      studentEmail: 'julie.dubois@email.com',
      course: 'React Development',
      requestDate: '2024-01-20',
      status: 'En attente',
      motivation: 'Je souhaite approfondir mes compétences en React pour évoluer dans mon poste actuel.',
      prerequisites: 'JavaScript, HTML, CSS',
      priority: 'Haute'
    },
    {
      id: 2,
      studentName: 'Marc Leroy',
      studentEmail: 'marc.leroy@email.com',
      course: 'UI/UX Design',
      requestDate: '2024-01-18',
      status: 'Approuvée',
      motivation: 'Transition de carrière vers le design, formation nécessaire pour acquérir les bases.',
      prerequisites: 'Aucun',
      priority: 'Moyenne'
    },
    {
      id: 3,
      studentName: 'Sarah Martin',
      studentEmail: 'sarah.martin@email.com',
      course: 'Project Management',
      requestDate: '2024-01-22',
      status: 'Rejetée',
      motivation: 'Besoin de certifications pour mon évolution professionnelle.',
      prerequisites: 'Expérience en gestion d\'équipe',
      priority: 'Basse',
      rejectionReason: 'Prérequis insuffisants'
    },
    {
      id: 4,
      studentName: 'David Chen',
      studentEmail: 'david.chen@email.com',
      course: 'Marketing Digital',
      requestDate: '2024-01-19',
      status: 'En attente',
      motivation: 'Développer mes compétences digitales pour mon entreprise.',
      prerequisites: 'Notions de marketing',
      priority: 'Haute'
    },
  ];

  const courses = [
    { id: 1, name: 'React Development', capacity: 20, enrolled: 15, waitlist: 3 },
    { id: 2, name: 'UI/UX Design', capacity: 15, enrolled: 12, waitlist: 1 },
    { id: 3, name: 'Project Management', capacity: 25, enrolled: 22, waitlist: 5 },
    { id: 4, name: 'Marketing Digital', capacity: 18, enrolled: 14, waitlist: 2 },
  ];

  const handleStatusChange = (id: number, newStatus: string) => {
    toast({
      title: "Statut mis à jour",
      description: `Demande d'inscription ${newStatus.toLowerCase()}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approuvée':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejetée':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'En attente':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approuvée':
        return 'default';
      case 'Rejetée':
        return 'destructive';
      case 'En attente':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return 'text-red-600';
      case 'Moyenne':
        return 'text-orange-600';
      case 'Basse':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredRequests = enrollmentRequests.filter(request => {
    const matchesStatus = selectedStatus === '' || request.status === selectedStatus;
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Inscriptions</h1>
        <p className="text-muted-foreground">Administration des demandes d'inscription aux formations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {enrollmentRequests.filter(r => r.status === 'En attente').length}
                </p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {enrollmentRequests.filter(r => r.status === 'Approuvée').length}
                </p>
                <p className="text-sm text-muted-foreground">Approuvées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {enrollmentRequests.filter(r => r.status === 'Rejetée').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{enrollmentRequests.length}</p>
                <p className="text-sm text-muted-foreground">Total demandes</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Approuvée">Approuvée</SelectItem>
                  <SelectItem value="Rejetée">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Nom ou formation..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Capacités des Formations</CardTitle>
          <CardDescription>Suivi des places disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{course.name}</h3>
                  <Badge variant={course.enrolled >= course.capacity ? 'destructive' : 'default'}>
                    {course.enrolled}/{course.capacity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inscrits: {course.enrolled}</span>
                    <span>Liste d'attente: {course.waitlist}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Demandes d'Inscription
          </CardTitle>
          <CardDescription>Gérer les demandes des apprenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="font-medium">{request.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{request.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                    <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">Formation demandée</p>
                    <p className="text-sm text-muted-foreground">{request.course}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date de demande</p>
                    <p className="text-sm text-muted-foreground">{request.requestDate}</p>
                  </div>
                </div>

                {request.status === 'Rejetée' && request.rejectionReason && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-800">Raison du rejet:</p>
                    <p className="text-sm text-red-700">{request.rejectionReason}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        Voir détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails de la demande - {request.studentName}</DialogTitle>
                        <DialogDescription>
                          Formation: {request.course}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Motivation</h4>
                          <p className="text-sm text-muted-foreground">{request.motivation}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Prérequis</h4>
                          <p className="text-sm text-muted-foreground">{request.prerequisites}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {request.status === 'En attente' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(request.id, 'Approuvée')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusChange(request.id, 'Rejetée')}
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerEnrollments;