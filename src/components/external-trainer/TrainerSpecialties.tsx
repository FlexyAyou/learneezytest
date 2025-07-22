import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerSpecialties = () => {
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState([
    { id: 1, name: 'React', status: 'approved', level: 'Expert' },
    { id: 2, name: 'JavaScript', status: 'approved', level: 'Expert' },
    { id: 3, name: 'UI/UX Design', status: 'approved', level: 'Avancé' },
    { id: 4, name: 'Node.js', status: 'pending', level: 'Avancé' },
    { id: 5, name: 'Python', status: 'rejected', level: 'Intermédiaire' },
  ]);
  
  const [newSpecialty, setNewSpecialty] = useState({ name: '', level: '', motivation: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSpecialty = () => {
    if (!newSpecialty.name || !newSpecialty.level || !newSpecialty.motivation) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...specialties.map(s => s.id)) + 1;
    setSpecialties([...specialties, {
      id: newId,
      name: newSpecialty.name,
      status: 'pending',
      level: newSpecialty.level,
    }]);

    toast({
      title: "Demande envoyée",
      description: "Votre demande de spécialité a été soumise pour validation",
    });

    setNewSpecialty({ name: '', level: '', motivation: '' });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Spécialités</h1>
          <p className="text-muted-foreground">Gérez vos domaines d'expertise autorisés</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Demander une nouvelle spécialité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Demander une nouvelle spécialité</DialogTitle>
              <DialogDescription>
                Soumettez une demande pour être autorisé à enseigner une nouvelle spécialité
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la spécialité</label>
                <Input
                  placeholder="Ex: TypeScript, Docker, AWS..."
                  value={newSpecialty.name}
                  onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau d'expertise</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={newSpecialty.level}
                  onChange={(e) => setNewSpecialty({...newSpecialty, level: e.target.value})}
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Motivation / Expérience</label>
                <Textarea
                  placeholder="Décrivez votre expérience dans ce domaine, vos certifications, projets réalisés..."
                  value={newSpecialty.motivation}
                  onChange={(e) => setNewSpecialty({...newSpecialty, motivation: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSpecialty}>
                Soumettre la demande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {/* Spécialités approuvées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Spécialités Approuvées</CardTitle>
            <CardDescription>Vous pouvez donner des formations dans ces domaines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {specialties.filter(s => s.status === 'approved').map((specialty) => (
                <div key={specialty.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div>
                    <p className="font-medium">{specialty.name}</p>
                    <p className="text-sm text-muted-foreground">Niveau: {specialty.level}</p>
                  </div>
                  {getStatusBadge(specialty.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spécialités en attente */}
        {specialties.filter(s => s.status === 'pending').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Demandes en attente</CardTitle>
              <CardDescription>Ces demandes sont en cours de validation par notre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {specialties.filter(s => s.status === 'pending').map((specialty) => (
                  <div key={specialty.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div>
                      <p className="font-medium">{specialty.name}</p>
                      <p className="text-sm text-muted-foreground">Niveau: {specialty.level}</p>
                    </div>
                    {getStatusBadge(specialty.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spécialités refusées */}
        {specialties.filter(s => s.status === 'rejected').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Demandes refusées</CardTitle>
              <CardDescription>Ces spécialités ont été refusées. Contactez le support pour plus d'informations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {specialties.filter(s => s.status === 'rejected').map((specialty) => (
                  <div key={specialty.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                      <div>
                        <p className="font-medium">{specialty.name}</p>
                        <p className="text-sm text-muted-foreground">Niveau: {specialty.level}</p>
                      </div>
                    </div>
                    {getStatusBadge(specialty.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainerSpecialties;