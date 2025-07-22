import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Clock, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerAvailabilities = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recurring, setRecurring] = useState(false);
  
  const [availabilities, setAvailabilities] = useState([
    { id: 1, date: '2024-01-15', timeStart: '09:00', timeEnd: '12:00', isBooked: false, recurringType: 'none' },
    { id: 2, date: '2024-01-15', timeStart: '14:00', timeEnd: '17:00', isBooked: true, recurringType: 'none' },
    { id: 3, date: '2024-01-16', timeStart: '10:00', timeEnd: '16:00', isBooked: false, recurringType: 'weekly' },
    { id: 4, date: '2024-01-17', timeStart: '09:00', timeEnd: '11:00', isBooked: false, recurringType: 'none' },
  ]);

  const [newSlot, setNewSlot] = useState({
    date: '',
    timeStart: '',
    timeEnd: '',
    recurringType: 'none',
  });

  const weekDays = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ];

  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.timeStart || !newSlot.timeEnd) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...availabilities.map(a => a.id)) + 1;
    setAvailabilities([...availabilities, {
      id: newId,
      date: newSlot.date,
      timeStart: newSlot.timeStart,
      timeEnd: newSlot.timeEnd,
      isBooked: false,
      recurringType: newSlot.recurringType,
    }]);

    toast({
      title: "Créneaux ajoutés",
      description: "Vos disponibilités ont été mises à jour",
    });

    setNewSlot({ date: '', timeStart: '', timeEnd: '', recurringType: 'none' });
    setIsDialogOpen(false);
  };

  const handleDeleteSlot = (id: number) => {
    setAvailabilities(availabilities.filter(a => a.id !== id));
    toast({
      title: "Créneau supprimé",
      description: "Le créneau a été retiré de vos disponibilités",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getRecurringBadge = (type: string) => {
    switch (type) {
      case 'weekly':
        return <Badge variant="outline" className="text-xs">Hebdomadaire</Badge>;
      case 'monthly':
        return <Badge variant="outline" className="text-xs">Mensuel</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Disponibilités</h1>
          <p className="text-muted-foreground">Gérez vos créneaux ouverts à la réservation</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des créneaux
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter des créneaux</DialogTitle>
              <DialogDescription>
                Définissez vos nouveaux créneaux de disponibilité
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de début</label>
                  <Input
                    type="time"
                    value={newSlot.timeStart}
                    onChange={(e) => setNewSlot({...newSlot, timeStart: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de fin</label>
                  <Input
                    type="time"
                    value={newSlot.timeEnd}
                    onChange={(e) => setNewSlot({...newSlot, timeEnd: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Récurrence</label>
                <Select value={newSlot.recurringType} onValueChange={(value) => setNewSlot({...newSlot, recurringType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la récurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSlot}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendrier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendrier
            </CardTitle>
            <CardDescription>Sélectionnez une date pour voir vos disponibilités</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Liste des créneaux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Mes Créneaux
            </CardTitle>
            <CardDescription>Tous vos créneaux de disponibilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availabilities.map((availability) => (
                <div key={availability.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {formatDate(availability.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {availability.timeStart} - {availability.timeEnd}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      {availability.isBooked ? (
                        <Badge className="bg-red-100 text-red-800 text-xs">Réservé</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 text-xs">Disponible</Badge>
                      )}
                      {getRecurringBadge(availability.recurringType)}
                    </div>
                  </div>
                  
                  {!availability.isBooked && (
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteSlot(availability.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{availabilities.length}</p>
                <p className="text-muted-foreground text-sm">Créneaux totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{availabilities.filter(a => !a.isBooked).length}</p>
                <p className="text-muted-foreground text-sm">Créneaux disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Badge className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{availabilities.filter(a => a.isBooked).length}</p>
                <p className="text-muted-foreground text-sm">Créneaux réservés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerAvailabilities;