import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Eye, Edit, Plus, Search, Filter, BarChart3, Users, Clock, UserPlus, Check, ShoppingCart } from 'lucide-react';
import { OFFormationDetail } from './OFFormationDetail';
import { LearneezyCourseCatalog } from './LearneezyCourseCatalog';

export const OFFormations = () => {
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFormationForAssign, setSelectedFormationForAssign] = useState<any>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const formations = [
    { 
      id: '1', 
      titre: 'Développement Web Full Stack - React & Node.js', 
      description: 'Formation complète en développement web moderne avec React, Node.js et bases de données',
      formateur: 'Jean Dupont', 
      niveau: 'Professionnel',
      duree: '120h',
      dateDebut: '27 mars 2025',
      dateFin: '15 mai 2025', 
      participants: 12, 
      capaciteMax: 20,
      inscrits: 8,
      termines: 1,
      status: 'planned',
      progression: 0,
      vues: 345,
      stats: '2.1k'
    },
    { 
      id: '2', 
      titre: 'Intelligence Artificielle et Machine Learning avec Python', 
      description: 'Maîtrisez les techniques d\'IA et ML avec Python, TensorFlow et scikit-learn',
      formateur: 'Marie Martin', 
      niveau: 'Avancé',
      duree: '80h',
      dateDebut: '10 avril 2025',
      dateFin: '20 mai 2025', 
      participants: 15, 
      capaciteMax: 18,
      inscrits: 5,
      termines: 2,
      status: 'planned',
      progression: 0,
      vues: 289,
      stats: '1.8k'
    },
    { 
      id: '3', 
      titre: 'DevOps et Cloud Computing - AWS & Docker', 
      description: 'Formation aux pratiques DevOps modernes avec AWS, Docker et Kubernetes',
      formateur: 'Pierre Bernard', 
      niveau: 'Intermédiaire',
      duree: '60h',
      dateDebut: '05 avril 2025',
      dateFin: '25 avril 2025', 
      participants: 10, 
      capaciteMax: 16,
      inscrits: 3,
      termines: 0,
      status: 'planned',
      progression: 0,
      vues: 456,
      stats: '3.2k'
    },
    { 
      id: '4', 
      titre: 'Cybersécurité et Tests de Pénétration', 
      description: 'Formation complète en cybersécurité avec pratiques de pentesting',
      formateur: 'Sophie Dubois', 
      niveau: 'Professionnel',
      duree: '100h',
      dateDebut: '23 janv. 2025',
      dateFin: '15 mars 2025', 
      participants: 8, 
      capaciteMax: 12,
      inscrits: 6,
      termines: 1,
      status: 'active',
      progression: 67,
      vues: 523,
      stats: '4.1k'
    },
    { 
      id: '5', 
      titre: 'Développement Mobile - Flutter & React Native', 
      description: 'Créez des applications mobiles multiplateformes avec Flutter et React Native',
      formateur: 'Alexandre Petit', 
      niveau: 'Intermédiaire',
      duree: '90h',
      dateDebut: '10 janv. 2025',
      dateFin: '28 février 2025', 
      participants: 14, 
      capaciteMax: 20,
      inscrits: 4,
      termines: 1,
      status: 'active',
      progression: 50,
      vues: 634,
      stats: '2.9k'
    },
  ];

  const apprenants = [
    { id: '1', nom: 'Durand', prenom: 'Thomas', email: 'thomas.durand@email.com', isAssigned: false },
    { id: '2', nom: 'Lefebvre', prenom: 'Julie', email: 'julie.lefebvre@email.com', isAssigned: true },
    { id: '3', nom: 'Moreau', prenom: 'Nicolas', email: 'nicolas.moreau@email.com', isAssigned: false },
    { id: '4', nom: 'Simon', prenom: 'Emma', email: 'emma.simon@email.com', isAssigned: false },
    { id: '5', nom: 'Michel', prenom: 'Lucas', email: 'lucas.michel@email.com', isAssigned: true },
    { id: '6', nom: 'Garcia', prenom: 'Léa', email: 'lea.garcia@email.com', isAssigned: false },
    { id: '7', nom: 'Roux', prenom: 'Hugo', email: 'hugo.roux@email.com', isAssigned: false },
    { id: '8', nom: 'Blanc', prenom: 'Chloé', email: 'chloe.blanc@email.com', isAssigned: false },
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

  const handleAssignFormation = (formation: any) => {
    setSelectedFormationForAssign(formation);
    setShowAssignModal(true);
  };

  const handleAssignLearner = (learnerId: string) => {
    console.log(`Assigning learner ${learnerId} to formation ${selectedFormationForAssign?.id}`);
    // Logique d'assignation ici
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des formations</h1>
          <p className="text-gray-600">Création et suivi des formations</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowCatalogModal(true)}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Voir le catalogue Learneezy
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
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
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignFormation(formation)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assigner
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

      {/* Modal d'assignation */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assigner des apprenants à la formation</DialogTitle>
            <p className="text-sm text-gray-600">
              {selectedFormationForAssign?.titre}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un apprenant..."
                className="pl-10"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {apprenants.map((apprenant) => (
                <div key={apprenant.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {apprenant.prenom.charAt(0)}{apprenant.nom.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {apprenant.prenom} {apprenant.nom}
                      </p>
                      <p className="text-xs text-gray-500">{apprenant.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {apprenant.isAssigned && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Assigné
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={apprenant.isAssigned ? "outline" : "default"}
                      onClick={() => handleAssignLearner(apprenant.id)}
                    >
                      {apprenant.isAssigned ? 'Retirer' : 'Assigner'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Catalogue Learneezy Modal */}
      <LearneezyCourseCatalog
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
      />
    </div>
  );
};
