
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Euro, Edit, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerRates = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const [rates, setRates] = useState([
    { 
      id: 1, 
      specialty: 'React', 
      hourlyRate: 45, 
      sessionRate: 180, 
      active: true, 
      minDuration: 2,
      maxDuration: 8,
      groupDiscount: 10 
    },
    { 
      id: 2, 
      specialty: 'JavaScript', 
      hourlyRate: 40, 
      sessionRate: 160, 
      active: true, 
      minDuration: 1,
      maxDuration: 6,
      groupDiscount: 15 
    },
    { 
      id: 3, 
      specialty: 'UI/UX Design', 
      hourlyRate: 50, 
      sessionRate: 200, 
      active: true, 
      minDuration: 3,
      maxDuration: 8,
      groupDiscount: 20 
    },
    { 
      id: 4, 
      specialty: 'Node.js', 
      hourlyRate: 48, 
      sessionRate: 192, 
      active: false, 
      minDuration: 2,
      maxDuration: 6,
      groupDiscount: 12 
    },
  ]);

  const [newRate, setNewRate] = useState({
    specialty: '',
    hourlyRate: '',
    sessionRate: '',
    minDuration: 1,
    maxDuration: 8,
    groupDiscount: 0,
    active: true,
  });

  const handleSaveRate = () => {
    if (!newRate.specialty || !newRate.hourlyRate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (editingRate) {
      setRates(rates.map(r => r.id === editingRate.id ? {
        ...r,
        specialty: newRate.specialty,
        hourlyRate: Number(newRate.hourlyRate),
        sessionRate: Number(newRate.sessionRate) || Number(newRate.hourlyRate) * 4,
        minDuration: newRate.minDuration,
        maxDuration: newRate.maxDuration,
        groupDiscount: newRate.groupDiscount,
        active: newRate.active,
      } : r));
      
      toast({
        title: "Tarif modifié",
        description: "Vos tarifs ont été mis à jour",
      });
    } else {
      const newId = Math.max(...rates.map(r => r.id)) + 1;
      setRates([...rates, {
        id: newId,
        specialty: newRate.specialty,
        hourlyRate: Number(newRate.hourlyRate),
        sessionRate: Number(newRate.sessionRate) || Number(newRate.hourlyRate) * 4,
        minDuration: newRate.minDuration,
        maxDuration: newRate.maxDuration,
        groupDiscount: newRate.groupDiscount,
        active: newRate.active,
      }]);

      toast({
        title: "Tarif ajouté",
        description: "Nouveau tarif créé avec succès",
      });
    }

    setNewRate({
      specialty: '',
      hourlyRate: '',
      sessionRate: '',
      minDuration: 1,
      maxDuration: 8,
      groupDiscount: 0,
      active: true,
    });
    setEditingRate(null);
    setIsDialogOpen(false);
  };

  const handleEditRate = (rate) => {
    setEditingRate(rate);
    setNewRate({
      specialty: rate.specialty,
      hourlyRate: rate.hourlyRate.toString(),
      sessionRate: rate.sessionRate.toString(),
      minDuration: rate.minDuration,
      maxDuration: rate.maxDuration,
      groupDiscount: rate.groupDiscount,
      active: rate.active,
    });
    setIsDialogOpen(true);
  };

  const toggleRateStatus = (id: number) => {
    setRates(rates.map(r => r.id === id ? { ...r, active: !r.active } : r));
    toast({
      title: "Statut modifié",
      description: "Le statut du tarif a été mis à jour",
    });
  };

  const calculateYourEarning = (amount: number) => {
    return (amount * 0.7).toFixed(0); // 30% commission
  };

  const averageRate = rates.filter(r => r.active).reduce((acc, r) => acc + r.hourlyRate, 0) / rates.filter(r => r.active).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Tarifs</h1>
          <p className="text-muted-foreground">Définissez vos prix par heure ou par séance</p>
          <p className="text-sm text-muted-foreground mt-1">
            Commission Learneezy: 30% • Vous recevez: 70%
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRate(null);
              setNewRate({
                specialty: '',
                hourlyRate: '',
                sessionRate: '',
                minDuration: 1,
                maxDuration: 8,
                groupDiscount: 0,
                active: true,
              });
            }}>
              <Euro className="mr-2 h-4 w-4" />
              Ajouter un tarif
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRate ? 'Modifier le tarif' : 'Ajouter un tarif'}
              </DialogTitle>
              <DialogDescription>
                Définissez vos tarifs pour cette spécialité
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialité</label>
                <Select value={newRate.specialty} onValueChange={(value) => setNewRate({...newRate, specialty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Node.js">Node.js</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix/heure (€)</label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={newRate.hourlyRate}
                    onChange={(e) => setNewRate({...newRate, hourlyRate: e.target.value})}
                  />
                  {newRate.hourlyRate && (
                    <p className="text-xs text-muted-foreground">
                      Vous recevrez: {calculateYourEarning(Number(newRate.hourlyRate))}€/h
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix/séance (€)</label>
                  <Input
                    type="number"
                    placeholder="180"
                    value={newRate.sessionRate}
                    onChange={(e) => setNewRate({...newRate, sessionRate: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optionnel (4h par défaut)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée min (h)</label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={newRate.minDuration}
                    onChange={(e) => setNewRate({...newRate, minDuration: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée max (h)</label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={newRate.maxDuration}
                    onChange={(e) => setNewRate({...newRate, maxDuration: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remise groupes (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="10"
                  value={newRate.groupDiscount}
                  onChange={(e) => setNewRate({...newRate, groupDiscount: Number(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Remise appliquée pour les formations en groupe
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRate.active}
                  onCheckedChange={(checked) => setNewRate({...newRate, active: checked})}
                />
                <label className="text-sm font-medium">Tarif actif</label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveRate}>
                {editingRate ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{averageRate.toFixed(0)}€</p>
                <p className="text-muted-foreground text-sm">Tarif moyen/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{rates.filter(r => r.active).length}</p>
                <p className="text-muted-foreground text-sm">Tarifs actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{Math.max(...rates.map(r => r.hourlyRate))}€</p>
                <p className="text-muted-foreground text-sm">Tarif max/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{rates.reduce((acc, r) => acc + r.groupDiscount, 0) / rates.length}%</p>
                <p className="text-muted-foreground text-sm">Remise moy. groupes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tarifs */}
      <div className="grid gap-6">
        {rates.map((rate) => (
          <Card key={rate.id} className={!rate.active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{rate.specialty}</CardTitle>
                  <CardDescription>
                    Durée: {rate.minDuration}h - {rate.maxDuration}h
                    {rate.groupDiscount > 0 && ` • Remise groupes: ${rate.groupDiscount}%`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {rate.active ? (
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Inactif</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditRate(rate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{rate.hourlyRate}€</p>
                  <p className="text-sm text-gray-600">Prix/heure</p>
                  <p className="text-xs text-green-600 font-medium">
                    Vous: {calculateYourEarning(rate.hourlyRate)}€
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{rate.sessionRate}€</p>
                  <p className="text-sm text-gray-600">Prix/séance</p>
                  <p className="text-xs text-green-600 font-medium">
                    Vous: {calculateYourEarning(rate.sessionRate)}€
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      checked={rate.active}
                      onCheckedChange={() => toggleRateStatus(rate.id)}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {rate.active ? 'Désactiver' : 'Activer'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainerRates;
