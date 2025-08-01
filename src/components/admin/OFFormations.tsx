
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Eye, Edit, Plus, Search, Filter, BarChart3, Users, Clock } from 'lucide-react';
import { OFFormationDetail } from './OFFormationDetail';

export const OFFormations = () => {
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formations = [
    { 
      id: '1', 
      titre: 'MODULAGE - Pack Complet - Rehaussement de cils & Extensions de cils : Cil à cil & Volume Russe', 
      description: 'Formation complète en beauté des cils avec techniques avancées',
      formateur: 'Par...', 
      niveau: 'Professionnel',
      duree: '40h',
      dateDebut: '27 mars 2025',
      dateFin: '15 avril 2025', 
      participants: 8, 
      capaciteMax: 15,
      inscrits: 0,
      termines: 1,
      status: 'planned',
      progression: 0,
      vues: 245,
      stats: '1.2k'
    },
    { 
      id: '2', 
      titre: 'MASQUILLES - Pack Complet - Rehaussement de cils & Extensions de cils : Cil à cil & Volume Russe', 
      description: 'Techniques professionnelles de maquillage et extension de cils',
      formateur: 'Par...', 
      niveau: 'Avancé',
      duree: '35h',
      dateDebut: '27 mars 2025',
      dateFin: '10 avril 2025', 
      participants: 8, 
      capaciteMax: 12,
      inscrits: 0,
      termines: 1,
      status: 'planned',
      progression: 0,
      vues: 189,
      stats: '890'
    },
    { 
      id: '3', 
      titre: 'OPEN FORMA - Rehaussement de cils & Extensions de cils : Cil à cil & Volume Russe', 
      description: 'Formation ouverte aux débutants en extensions de cils',
      formateur: 'Par...', 
      niveau: 'Débutant',
      duree: '25h',
      dateDebut: '27 mars 2025',
      dateFin: '05 avril 2025', 
      participants: 8, 
      capaciteMax: 20,
      inscrits: 0,
      termines: 0,
      status: 'planned',
      progression: 0,
      vues: 156,
      stats: '652'
    },
    { 
      id: '4', 
      titre: 'Aurelie Academie : Esthétique Cosmétique Parfumerie - BC01...', 
      description: 'Formation complète en esthétique et cosmétique',
      formateur: 'Pa...', 
      niveau: 'Professionnel',
      duree: '120h',
      dateDebut: '23 janv. 2025',
      dateFin: '15 mars 2025', 
      participants: 1, 
      capaciteMax: 8,
      inscrits: 3,
      termines: 1,
      status: 'active',
      progression: 67,
      vues: 423,
      stats: '2.1k'
    },
    { 
      id: '5', 
      titre: 'CCP1 - Employé technicien vendeur en matériel de sport', 
      description: 'Formation professionnalisante dans le secteur sportif',
      formateur: 'Expert Sport', 
      niveau: 'Professionnel',
      duree: '80h',
      dateDebut: '10 janv. 2025',
      dateFin: '28 février 2025', 
      participants: 14, 
      capaciteMax: 20,
      inscrits: 2,
      termines: 1,
      status: 'active',
      progression: 50,
      vues: 834,
      stats: '3.2k'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'En cours', color: 'bg-green-500' },
      completed: { variant: 'secondary' as const, label: 'Terminé', color: 'bg-gray-500' },
      planned: { variant: 'outline' as const, label: 'Planifié', color: 'bg-blue-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'bg-gray-500' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || formation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewFormation = (formation: any) => {
    setSelectedFormation(formation);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des formations</h1>
          <p className="text-gray-600">Création et suivi des formations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle formation
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
                placeholder="Rechercher une formation..."
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
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exporter les formations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des formations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Liste des formations ({filteredFormations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFormations.map((formation) => (
              <div key={formation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Avatar/Image */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">
                      {formation.titre.charAt(0)}
                    </span>
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-tight mb-1">
                          {formation.titre}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <span>Par {formation.formateur}</span>
                          <span>{formation.dateDebut}</span>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{formation.participants}</span>
                          </div>
                          <span>{formation.inscrits}</span>
                          <span>{formation.termines}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {formation.progression > 0 && (
                          <span className="text-sm font-medium text-green-600">
                            {formation.progression}%
                          </span>
                        )}
                        {getStatusBadge(formation.status)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{formation.vues}</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span>{formation.stats}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formation.duree}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewFormation(formation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Éditer
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Stats
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de détail */}
      <OFFormationDetail
        formation={selectedFormation}
        isOpen={!!selectedFormation}
        onClose={() => setSelectedFormation(null)}
      />
    </div>
  );
};
