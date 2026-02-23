import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Coins,
  Calendar,
  Crown,
  Loader2,
  Database
} from 'lucide-react';
import { fastAPIClient } from '@/services/fastapi-client';
import { SubscriptionPlanResponse, SubscriptionPlanCreate, SubscriptionPlanUpdate } from '@/types/fastapi';
import { useToast } from '@/hooks/use-toast';

interface PlanFilters {
  showParticulier: boolean;
  showOrganisme: boolean;
  showMensuel: boolean;
  showAnnuel: boolean;
}

interface SubscriptionPlansManagerProps {
  onPlanUpdate?: (plan: SubscriptionPlanResponse) => void;
  filters?: PlanFilters;
}

const SubscriptionPlansManager: React.FC<SubscriptionPlansManagerProps> = ({
  onPlanUpdate,
  filters = { showParticulier: true, showOrganisme: true, showMensuel: true, showAnnuel: true }
}) => {
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<SubscriptionPlanCreate>({
    name: '',
    price: 0,
    duration_days: 30,
    max_users: undefined,
    storage_limit_gb: undefined,
    features: [],
    is_active: true
  });
  const [featureInput, setFeatureInput] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await fastAPIClient.getSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les plans d'abonnement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (plan?: SubscriptionPlanResponse) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        duration_days: plan.duration_days,
        max_users: plan.max_users,
        storage_limit_gb: plan.storage_limit_gb,
        features: plan.features,
        is_active: plan.is_active
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: 0,
        duration_days: 30,
        max_users: undefined,
        storage_limit_gb: undefined,
        features: [],
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingPlan) {
        const updated = await fastAPIClient.updateSubscriptionPlan(editingPlan.id, formData);
        toast({ title: "Plan mis à jour", description: `Le plan ${updated.name} a été modifié.` });
      } else {
        const created = await fastAPIClient.createSubscriptionPlan(formData);
        toast({ title: "Plan créé", description: `Le plan ${created.name} a été ajouté.` });
      }
      setIsModalOpen(false);
      fetchPlans();
      if (onPlanUpdate && editingPlan) onPlanUpdate(editingPlan);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le plan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (plan: SubscriptionPlanResponse) => {
    try {
      await fastAPIClient.updateSubscriptionPlan(plan.id, { is_active: !plan.is_active });
      toast({ title: "Statut mis à jour", description: `Le plan est maintenant ${!plan.is_active ? 'actif' : 'inactif'}.` });
      fetchPlans();
    } catch (err) {
      toast({ title: "Erreur", description: "Action impossible", variant: "destructive" });
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  // Filtrage local (optionnel si le backend ne filtre pas encore parfaitement)
  const filteredPlans = plans.filter(plan => {
    // Logic for individual vs of
    const isOf = plan.name.toLowerCase().includes('of');
    if (isOf && !filters.showOrganisme) return false;
    if (!isOf && !filters.showParticulier) return false;

    // Duration logic
    if (plan.duration_days <= 31 && !filters.showMensuel) return false;
    if (plan.duration_days > 31 && !filters.showAnnuel) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Chargement des plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des plans d'abonnement</h3>
          <p className="text-gray-600">
            {filteredPlans.length} plan(s) disponible(s)
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-pink-500 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`relative shadow-md hover:shadow-lg transition-shadow overflow-hidden ${!plan.is_active ? 'opacity-70' : ''}`}>
            <div className={`h-2 bg-gradient-to-r ${plan.name.toLowerCase().includes('of') ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'}`} />

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {plan.duration_days} jours d'accès
                  </CardDescription>
                </div>
                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                  {plan.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}€
                </div>
                <div className="text-sm text-gray-500">
                  pour {plan.duration_days} jours
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm border-y py-3 border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{plan.max_users ? `${plan.max_users} users` : 'Illimité'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span>{plan.storage_limit_gb ? `${plan.storage_limit_gb} GB` : 'No limit'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-xs uppercase text-gray-400 tracking-wider">Inclus :</h5>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-gray-400 italic">+{plan.features.length - 4} autres...</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenModal(plan)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant={plan.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleStatus(plan)}
                >
                  {plan.is_active ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-20">
            <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun plan trouvé avec ces filtres.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal Création/Edition */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Modifier le plan' : 'Créer un nouveau plan'}</DialogTitle>
            <DialogDescription>
              Définissez les caractéristiques de cette offre commerciale.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du plan</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: OF Business"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (jours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={e => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_users">Max users</Label>
                <Input
                  id="max_users"
                  type="number"
                  placeholder="Illimité"
                  value={formData.max_users || ''}
                  onChange={e => setFormData({ ...formData, max_users: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">Stockage (GB)</Label>
                <Input
                  id="storage"
                  type="number"
                  placeholder="Illimité"
                  value={formData.storage_limit_gb || ''}
                  onChange={e => setFormData({ ...formData, storage_limit_gb: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fonctionnalités</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  placeholder="Nouvelle fonctionnalité..."
                  onKeyPress={e => e.key === 'Enter' && addFeature()}
                />
                <Button type="button" size="sm" onClick={addFeature}>Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 border rounded bg-gray-50">
                {formData.features.map((f, i) => (
                  <Badge key={i} variant="secondary" className="pl-2 flex items-center gap-1">
                    {f}
                    <button onClick={() => removeFeature(i)} className="p-0.5 hover:bg-gray-200 rounded">
                      <Plus className="h-3 w-3 rotate-45" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name}
              className="bg-primary"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPlan ? 'Sauvegarder les modifications' : 'Créer le plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansManager;
