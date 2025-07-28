
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Search, Filter, Users, Clock, Calendar, Edit, Eye, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerFormations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formations, setFormations] = useState([
    {
      id: '1',
      titre: 'React Avancé',
      description: 'Formation approfondie sur React et ses concepts avancés',
      formateur: 'Marie Dubois',
      niveau: 'Avancé',
      duree: '40h',
      nbInscrits: 15,
      capaciteMax: 20,
      dateDebut: '2024-02-01',
      dateFin: '2024-03-15',
      status: 'active',
      progression: 65
    },
    {
      id: '2',
      titre: 'JavaScript Fondamentaux',
      description: 'Les bases du JavaScript moderne',
      formateur: 'Jean Martin',
      niveau: 'Débutant',
      duree: '30h',
      nbInscrits: 18,
      capaciteMax: 25,
      dateDebut: '2024-01-15',
      dateFin: '2024-02-28',
      status: 'active',
      progression: 80
    },
    {
      id: '3',
      titre: 'Angular',
      description: 'Framework Angular pour applications web',
      formateur: 'Sophie Laurent',
      niveau: 'Intermédiaire',
      duree: '35h',
      nbInscrits: 12,
      capaciteMax: 20,
      dateDebut: '2024-02-15',
      dateFin: '2024-04-01',
      status: 'planned',
      progression: 0
    },
    {
      id: '4',
      titre: 'Vue.js',
      description: 'Framework Vue.js et son écosystème',
      formateur: 'Pierre Moreau',
      niveau: 'Intermédiaire',
      duree: '32h',
      nbInscrits: 20,
      capaciteMax: 20,
      dateDebut: '2024-01-01',
      dateFin: '2024-02-15',
      status: 'completed',
      progression: 100
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'En cours' },
      completed: { variant: 'secondary' as const, label: 'Terminée' },
      planned: { variant: 'outline' as const, label: 'Planifiée' },
      cancelled: { variant: 'destructive' as const, label: 'Annulée' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getNiveauBadge = (niveau: string) => {
    const niveauConfig = {
      'Débutant': { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      'Intermédiaire': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      'Avancé': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
    };
    
    const config = niveauConfig[niveau as keyof typeof niveauConfig] || { variant: 'outline' as const, color: '' };
    return <Badge variant={config.variant} className={config.color}>{niveau}</Badge>;
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || formation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewFormation = (formation: any) => {
    toast({
      title: "Détail formation",
      description: `Ouverture du détail pour ${formation.titre}`,
    });
  };

  const handleEditFormation = (formation: any) => {
    toast({
      title: "Édition formation",
      description: `Ouverture de l'interface d'édition pour ${formation.titre}`,
    });
  };

  const handleLaunchFormation = (formation: any) => {
    toast({
      title: "Lancement formation",
      description: `Lancement de la formation ${formation.titre}`,
    });
  };

  const handleManageStudents = (formation: any) => {
    toast({
      title: "Gestion des apprenants",
      description: `Gestion des apprenants pour ${formation.titre}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Formations</h1>
          <p className="text-gray-600">Suivi et gestion des formations disponibles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Formation
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
                placeholder="Rechercher par titre ou formateur..."
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
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="planned">Planifiée</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exporter les formations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{formations.length}</p>
                <p className="text-sm text-muted-foreground">Total Formations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{formations.filter(f => f.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{formations.reduce((acc, f) => acc + f.nbInscrits, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Inscrits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{formations.reduce((acc, f) => acc + parseInt(f.duree), 0)}h</p>
                <p className="text-sm text-muted-foreground">Durée Totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des formations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Liste des Formations ({filteredFormations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formation</TableHead>
                <TableHead>Formateur</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Inscrits</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFormations.map((formation) => (
                <TableRow key={formation.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{formation.titre}</p>
                      <p className="text-sm text-gray-500">{formation.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formation.formateur}</TableCell>
                  <TableCell>{getNiveauBadge(formation.niveau)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formation.duree}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {formation.nbInscrits}/{formation.capaciteMax}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <div>
                        <p>{formation.dateDebut}</p>
                        <p className="text-gray-500">→ {formation.dateFin}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(formation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${formation.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{formation.progression}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewFormation(formation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditFormation(formation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleManageStudents(formation)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      {formation.status === 'planned' && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleLaunchFormation(formation)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
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

export default ManagerFormations;
