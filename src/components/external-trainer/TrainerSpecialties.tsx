
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  X, 
  Target, 
  BookOpen, 
  Award,
  Clock,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerSpecialties = () => {
  const { toast } = useToast();
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    experience: '',
    certifications: ''
  });

  const currentSpecialties = [
    {
      id: 1,
      name: 'React Development',
      description: 'Développement d\'applications web modernes avec React et ses écosystèmes',
      experience: '5 ans',
      certifications: 'React Developer Certification',
      status: 'approved',
      students: 45,
      rating: 4.8,
      hourlyRate: '50€'
    },
    {
      id: 2,
      name: 'JavaScript ES6+',
      description: 'JavaScript moderne, programmation asynchrone, et bonnes pratiques',
      experience: '6 ans',
      certifications: 'JavaScript Expert Certification',
      status: 'approved',
      students: 38,
      rating: 4.9,
      hourlyRate: '45€'
    },
    {
      id: 3,
      name: 'Node.js Backend',
      description: 'Développement d\'APIs REST et GraphQL avec Node.js',
      experience: '4 ans',
      certifications: 'Node.js Developer Certification',
      status: 'pending',
      students: 0,
      rating: 0,
      hourlyRate: '55€'
    }
  ];

  const handleAddSpecialty = () => {
    if (!newSpecialty.name || !newSpecialty.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Spécialité soumise",
      description: "Votre nouvelle spécialité a été soumise pour validation",
    });

    setNewSpecialty({
      name: '',
      description: '',
      experience: '',
      certifications: ''
    });
    setIsAddingSpecialty(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      default: return 'Inconnue';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Spécialités</h1>
          <p className="text-gray-600">Gérez vos domaines d'expertise et demandez de nouvelles spécialités</p>
        </div>
        
        <Button
          onClick={() => setIsAddingSpecialty(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Demander une spécialité
        </Button>
      </div>

      {/* Add Specialty Form */}
      {isAddingSpecialty && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-pink-600" />
                Nouvelle Spécialité
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSpecialty(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Soumettez votre demande pour une nouvelle spécialité. Elle sera validée par notre équipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty-name">Nom de la spécialité *</Label>
                <Input
                  id="specialty-name"
                  value={newSpecialty.name}
                  onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
                  placeholder="Ex: Python pour Data Science"
                />
              </div>
              <div>
                <Label htmlFor="experience">Années d'expérience</Label>
                <Input
                  id="experience"
                  value={newSpecialty.experience}
                  onChange={(e) => setNewSpecialty({...newSpecialty, experience: e.target.value})}
                  placeholder="Ex: 3 ans"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newSpecialty.description}
                onChange={(e) => setNewSpecialty({...newSpecialty, description: e.target.value})}
                placeholder="Décrivez votre expertise dans ce domaine..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="certifications">Certifications</Label>
              <Input
                id="certifications"
                value={newSpecialty.certifications}
                onChange={(e) => setNewSpecialty({...newSpecialty, certifications: e.target.value})}
                placeholder="Listez vos certifications pertinentes"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingSpecialty(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddSpecialty}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                Soumettre la demande
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Specialties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentSpecialties.map((specialty) => (
          <Card key={specialty.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="h-5 w-5 mr-2 text-pink-600" />
                    {specialty.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-xs ${getStatusColor(specialty.status)}`}>
                      {getStatusText(specialty.status)}
                    </Badge>
                    {specialty.status === 'approved' && (
                      <>
                        <Badge variant="outline" className="text-xs">
                          {specialty.hourlyRate}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-600">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {specialty.rating}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{specialty.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Expérience:</span>
                  <p className="text-gray-600">{specialty.experience}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Étudiants:</span>
                  <p className="text-gray-600">{specialty.students} actifs</p>
                </div>
              </div>
              
              {specialty.certifications && (
                <div>
                  <span className="font-medium text-gray-700 text-sm">Certifications:</span>
                  <p className="text-sm text-gray-600">{specialty.certifications}</p>
                </div>
              )}
              
              {specialty.status === 'approved' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:border-pink-300"
                  >
                    Modifier les tarifs
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Voir les étudiants
                  </Button>
                </div>
              )}
              
              {specialty.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <Clock className="h-3 w-3 inline mr-1" />
                    En cours de validation par notre équipe pédagogique
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Award className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Comment ajouter une spécialité ?</h3>
              <p className="text-sm text-blue-700">
                Soumettez votre demande avec vos justificatifs d'expertise. Notre équipe validera votre spécialité 
                sous 48h. Une fois approuvée, vous pourrez définir vos tarifs et commencer à recevoir des réservations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerSpecialties;
