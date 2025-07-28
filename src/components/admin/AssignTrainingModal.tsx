
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssignTrainingModalProps {
  trigger?: React.ReactNode;
}

export const AssignTrainingModal: React.FC<AssignTrainingModalProps> = ({ trigger }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const users = [
    { id: '1', name: 'Alice Martin', email: 'alice@example.com' },
    { id: '2', name: 'Bob Dupont', email: 'bob@example.com' },
    { id: '3', name: 'Claire Bernard', email: 'claire@example.com' },
  ];

  const trainings = [
    { id: '1', name: 'Formation React Avancé', duration: '40h' },
    { id: '2', name: 'Gestion de Projet Agile', duration: '30h' },
    { id: '3', name: 'Marketing Digital', duration: '25h' },
  ];

  const handleAssign = () => {
    if (!selectedUser || !selectedTraining || !startDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const user = users.find(u => u.id === selectedUser);
    const training = trainings.find(t => t.id === selectedTraining);

    toast({
      title: "Formation assignée",
      description: `${training?.name} a été assignée à ${user?.name}`,
    });

    // Reset form
    setSelectedUser('');
    setSelectedTraining('');
    setStartDate('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Assigner une formation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assigner une formation à un apprenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user">Apprenant</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un apprenant" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="training">Formation</Label>
            <Select value={selectedTraining} onValueChange={setSelectedTraining}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une formation" />
              </SelectTrigger>
              <SelectContent>
                {trainings.map((training) => (
                  <SelectItem key={training.id} value={training.id}>
                    {training.name} ({training.duration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssign}>
              Assigner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
