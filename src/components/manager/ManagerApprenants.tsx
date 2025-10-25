
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Eye, Edit, Plus, Search, Filter, Mail, Phone, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerApprenants = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApprenant, setSelectedApprenant] = useState<any>(null);

  const [apprenants, setApprenants] = useState([
    { 
      id: '1', 
      nom: 'Dupont', 
      prenom: 'Marie', 
      email: 'marie.dupont@email.com', 
      phone: '06 12 34 56 78',
      status: 'active', 
      formation: 'React Avancé', 
      progression: 78,
      dateInscription: '2024-01-15',
      derniereConnexion: '2024-01-20'
    },
    { 
      id: '2', 
      nom: 'Martin', 
      prenom: 'Jean', 
      email: 'jean.martin@email.com', 
      phone: '06 23 45 67 89',
      status: 'completed', 
      formation: 'JavaScript Fondamentaux', 
      progression: 100,
      dateInscription: '2024-01-10',
      derniereConnexion: '2024-01-19'
    },
    { 
      id: '3', 
      nom: 'Bernard', 
      prenom: 'Sophie', 
      email: 'sophie.bernard@email.com', 
      phone: '06 34 56 78 90',
      status: 'pending', 
      formation: 'Angular', 
      progression: 45,
      dateInscription: '2024-01-12',
      derniereConnexion: '2024-01-18'
    },
    { 
      id: '4', 
      nom: 'Durand', 
      prenom: 'Pierre', 
      email: 'pierre.durand@email.com', 
      phone: '06 45 67 89 01',
      status: 'active', 
      formation: 'Vue.js', 
      progression: 62,
      dateInscription: '2024-01-08',
      derniereConnexion: '2024-01-21'
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      inactive: { variant: 'destructive' as const, label: 'Inactif' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredApprenants = apprenants.filter(apprenant => {
    const matchesSearch = `${apprenant.prenom} ${apprenant.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apprenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apprenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleContactApprenant = (apprenant: any) => {
    toast({
      title: "Contact apprenant",
      description: `Ouverture de l'interface de contact pour ${apprenant.prenom} ${apprenant.nom}`,
    });
  };

  const handleEditApprenant = (apprenant: any) => {
    setSelectedApprenant(apprenant);
    toast({
      title: "Édition apprenant",
      description: `Ouverture de l'interface d'édition pour ${apprenant.prenom} ${apprenant.nom}`,
    });
  };

  const handleViewProgress = (apprenant: any) => {
    toast({
      title: "Progression",
      description: `Affichage du détail de progression pour ${apprenant.prenom} ${apprenant.nom}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Apprenants</h1>
          <p className="text-gray-600">Suivi et gestion des apprenants inscrits</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Apprenant
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exporter la liste
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{apprenants.length}</p>
                <p className="text-sm text-muted-foreground">Total Apprenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{apprenants.filter(a => a.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{apprenants.filter(a => a.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{Math.round(apprenants.reduce((acc, a) => acc + a.progression, 0) / apprenants.length)}%</p>
                <p className="text-sm text-muted-foreground">Progression Moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des apprenants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des Apprenants ({filteredApprenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprenants.map((apprenant) => (
                <TableRow key={apprenant.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{apprenant.prenom} {apprenant.nom}</p>
                      <p className="text-sm text-gray-500">ID: {apprenant.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {apprenant.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {apprenant.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {apprenant.formation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${apprenant.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{apprenant.progression}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(apprenant.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {apprenant.derniereConnexion}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProgress(apprenant)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditApprenant(apprenant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleContactApprenant(apprenant)}
                      >
                        <Mail className="h-4 w-4" />
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

export default ManagerApprenants;
