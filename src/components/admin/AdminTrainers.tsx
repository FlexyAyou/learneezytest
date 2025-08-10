
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, UserCheck, Users, Mail, Phone, MapPin, Star, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminTrainers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for trainers
  const trainers = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      specialities: ['React', 'JavaScript', 'Node.js'],
      location: 'Paris, France',
      status: 'actif',
      rating: 4.8,
      totalCourses: 12,
      totalStudents: 1245,
      joinDate: '2023-01-15',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      experience: '5 ans',
      certifications: ['React Certified', 'AWS Solutions Architect']
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+33 6 98 76 54 32',
      specialities: ['UX/UI Design', 'Figma', 'Adobe XD'],
      location: 'Lyon, France',
      status: 'actif',
      rating: 4.6,
      totalCourses: 8,
      totalStudents: 892,
      joinDate: '2023-03-20',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      experience: '7 ans',
      certifications: ['Adobe Certified Expert', 'Google UX Design']
    },
    {
      id: '3',
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      phone: '+33 6 45 67 89 01',
      specialities: ['Marketing Digital', 'SEO', 'Google Ads'],
      location: 'Marseille, France',
      status: 'en_attente',
      rating: 4.7,
      totalCourses: 15,
      totalStudents: 1567,
      joinDate: '2022-11-10',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      experience: '10 ans',
      certifications: ['Google Ads Certified', 'HubSpot Certified']
    },
    {
      id: '4',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '+33 6 23 45 67 89',
      specialities: ['Python', 'Data Science', 'Machine Learning'],
      location: 'Toulouse, France',
      status: 'inactif',
      rating: 4.9,
      totalCourses: 6,
      totalStudents: 734,
      joinDate: '2023-06-05',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      experience: '8 ans',
      certifications: ['Python Institute Certified', 'AWS Machine Learning']
    }
  ];

  const handleStatusChange = (trainerId, newStatus) => {
    toast({
      title: "Statut modifié",
      description: `Le formateur a été ${newStatus === 'actif' ? 'activé' : 'désactivé'}.`,
    });
  };

  const handleDeleteTrainer = (trainerId) => {
    toast({
      title: "Formateur supprimé",
      description: "Le formateur a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const handleContactTrainer = (trainer) => {
    toast({
      title: "Email envoyé",
      description: `Un email a été envoyé à ${trainer.name}.`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'inactif':
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialities.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || trainer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des formateurs</h1>
          <p className="text-gray-600">Gérer les formateurs de la plateforme</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un formateur
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total formateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trainers.filter(t => t.status === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((trainers.filter(t => t.status === 'actif').length / trainers.length) * 100)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cours créés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainers.reduce((sum, trainer) => sum + trainer.totalCourses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Par tous les formateurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / trainers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Sur 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Liste des formateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Spécialités</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={trainer.avatar} 
                        alt={trainer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Depuis {new Date(trainer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {trainer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {trainer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialities.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {trainer.location}
                    </div>
                  </TableCell>
                  <TableCell>{trainer.totalCourses}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {trainer.totalStudents}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {trainer.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(trainer.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Voir les détails"
                            onClick={() => setSelectedTrainer(trainer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Profil du formateur</DialogTitle>
                          </DialogHeader>
                          {selectedTrainer && (
                            <div className="space-y-6">
                              <div className="flex items-start space-x-4">
                                <img 
                                  src={selectedTrainer.avatar} 
                                  alt={selectedTrainer.name}
                                  className="w-24 h-24 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold">{selectedTrainer.name}</h3>
                                  <p className="text-gray-600">{selectedTrainer.experience} d'expérience</p>
                                  <div className="mt-2">
                                    {getStatusBadge(selectedTrainer.status)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Informations de contact</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Email:</strong> {selectedTrainer.email}</div>
                                    <div><strong>Téléphone:</strong> {selectedTrainer.phone}</div>
                                    <div><strong>Localisation:</strong> {selectedTrainer.location}</div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Statistiques</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Cours créés:</strong> {selectedTrainer.totalCourses}</div>
                                    <div><strong>Étudiants formés:</strong> {selectedTrainer.totalStudents}</div>
                                    <div><strong>Note moyenne:</strong> {selectedTrainer.rating}/5</div>
                                    <div><strong>Membre depuis:</strong> {new Date(selectedTrainer.joinDate).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Spécialités</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTrainer.specialities.map((spec, index) => (
                                    <Badge key={index} variant="outline">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Certifications</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTrainer.certifications.map((cert, index) => (
                                    <Badge key={index} className="bg-blue-100 text-blue-800">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 pt-4">
                                <Button onClick={() => handleContactTrainer(selectedTrainer)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Contacter
                                </Button>
                                <Button variant="outline">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        title="Supprimer"
                        onClick={() => handleDeleteTrainer(trainer.id)}
                        className="hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
};

export default AdminTrainers;
