
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star,
  Users,
  BookOpen,
  Clock,
  Euro,
  CheckCircle,
  Coins,
  Gift,
  Zap,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/subscription';

// Plans basés sur les vraies offres de la page /offres
const defaultPlans: SubscriptionPlan[] = [
  // Offres Particuliers
  {
    id: 'particulier-starter',
    name: 'Pack Starter',
    description: 'Parfait pour débuter votre apprentissage',
    price: 29,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 1,
    credits: 100,
    creditPrice: 0.29,
    features: [
      '100 crédits d\'apprentissage',
      'Accès aux cours de base',
      'Support par email',
      'Certificats de base'
    ],
    isActive: true,
    isPopular: false,
    trialDays: 0,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 45
  },
  {
    id: 'particulier-growth',
    name: 'Pack Growth',
    description: 'Le choix idéal pour progresser rapidement',
    price: 79,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 1,
    credits: 300,
    creditPrice: 0.26,
    features: [
      '300 crédits d\'apprentissage',
      'Accès à tous les cours',
      'Réservation de créneaux formateurs',
      'Support prioritaire',
      'Certificats avancés'
    ],
    isActive: true,
    isPopular: true,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 128
  },
  {
    id: 'particulier-premium',
    name: 'Pack Premium',
    description: 'L\'excellence pour les apprenants exigeants',
    price: 120,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 1,
    credits: 500,
    creditPrice: 0.24,
    features: [
      '500 crédits d\'apprentissage',
      'Accès illimité à tous les cours',
      'Réservations prioritaires',
      'Coaching personnalisé',
      'Certificats premium',
      'Support 24/7'
    ],
    isActive: true,
    isPopular: false,
    trialDays: 30,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 89
  },
  // Offres Organismes de Formation
  {
    id: 'of-starter',
    name: 'OF Starter',
    description: 'Idéal pour les petits organismes',
    price: 199,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 10,
    credits: 0, // Les OF n'utilisent pas de crédits mais des licences
    features: [
      'Gestion de 10 apprenants',
      'Plateforme LMS intégrée',
      'Suivi pédagogique',
      'Émargements numériques',
      'Support par email',
      'Certificats automatiques'
    ],
    isActive: true,
    isPopular: false,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 23
  },
  {
    id: 'of-business',
    name: 'OF Business',
    description: 'Pour les organismes en croissance',
    price: 449,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 50,
    credits: 0,
    features: [
      'Gestion de 50 apprenants',
      'Plateforme LMS avancée',
      'Outils de création de contenu',
      'Reporting détaillé',
      'Intégrations CPF/OPCO',
      'Support prioritaire',
      'Formation des formateurs'
    ],
    isActive: true,
    isPopular: true,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 67
  },
  {
    id: 'of-enterprise',
    name: 'OF Enterprise',
    description: 'Solution complète pour grands organismes',
    price: 899,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 999999, // Illimité
    credits: 0,
    features: [
      'Apprenants illimités',
      'Plateforme white-label',
      'API complète',
      'Intelligence artificielle',
      'Conformité Qualiopi',
      'Manager dédié',
      'Formation sur-mesure'
    ],
    isActive: true,
    isPopular: false,
    trialDays: 30,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: 12
  }
];

interface SubscriptionPlansManagerProps {
  onPlanUpdate?: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlansManager: React.FC<SubscriptionPlansManagerProps> = ({
  onPlanUpdate
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleActive = (planId: string) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, isActive: !plan.isActive, updatedAt: new Date().toISOString() }
        : plan
    ));
    
    const plan = plans.find(p => p.id === planId);
    toast({
      title: "Plan mis à jour",
      description: `Le plan ${plan?.name} a été ${plan?.isActive ? 'désactivé' : 'activé'}`,
    });
  };

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan?.subscribers && plan.subscribers > 0) {
      toast({
        title: "Impossible de supprimer",
        description: `Ce plan a ${plan.subscribers} abonnés actifs. Désactivez-le plutôt.`,
        variant: "destructive"
      });
      return;
    }

    setPlans(prev => prev.filter(plan => plan.id !== planId));
    toast({
      title: "Plan supprimé",
      description: `Le plan ${plan?.name} a été supprimé avec succès`,
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
    setPlans(prev => prev.map(plan => 
      plan.id === updatedPlan.id 
        ? { ...updatedPlan, updatedAt: new Date().toISOString() }
        : plan
    ));
    
    setIsEditModalOpen(false);
    setSelectedPlan(null);
    onPlanUpdate?.(updatedPlan);
    
    toast({
      title: "Plan mis à jour",
      description: `Le plan ${updatedPlan.name} a été mis à jour avec succès`,
    });
  };

  const getCreditPrice = (plan: SubscriptionPlan) => {
    if (plan.credits && plan.credits > 0) {
      return plan.creditPrice?.toFixed(3) || (plan.price / plan.credits).toFixed(3);
    }
    return '0.000';
  };

  const getValidityText = (interval: string) => {
    switch (interval) {
      case 'monthly': return '1 mois';
      case 'quarterly': return '3 mois';
      case 'yearly': return '12 mois';
      default: return interval;
    }
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    if (plan.name.includes('Starter')) return <Gift className="h-6 w-6" />;
    if (plan.name.includes('Growth') || plan.name.includes('Business')) return <Zap className="h-6 w-6" />;
    if (plan.name.includes('Premium') || plan.name.includes('Enterprise')) return <Crown className="h-6 w-6" />;
    return <BookOpen className="h-6 w-6" />;
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'individual': return 'Particulier';
      case 'organisme': return 'Organisme de Formation';
      case 'team': return 'Équipe';
      case 'enterprise': return 'Entreprise';
      case 'education': return 'Éducation';
      default: return audience;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des plans d'abonnement</h2>
          <p className="text-gray-600 mt-1">
            Configurez et gérez vos offres d'abonnement basées sur les vraies offres
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un plan
        </Button>
      </div>

      {/* Filtres par type d'audience */}
      <div className="flex gap-4 mb-6">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Particuliers: {plans.filter(p => p.targetAudience === 'individual').length}
        </Badge>
        <Badge variant="outline" className="text-green-600 border-green-200">
          Organismes: {plans.filter(p => p.targetAudience === 'organisme').length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-60' : ''} ${plan.isPopular ? 'ring-2 ring-purple-500' : ''}`}>
            {plan.isPopular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600">
                <Star className="h-3 w-3 mr-1" />
                Populaire
              </Badge>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPlanIcon(plan)}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {getAudienceLabel(plan.targetAudience)}
                  </Badge>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(plan.id)}
                    className="h-8 w-8"
                  >
                    {plan.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPlan(plan)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="h-8 w-8 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {plan.price}€
                </div>
                <div className="text-sm text-gray-500">
                  par {getValidityText(plan.interval)}
                </div>
                {plan.credits && plan.credits > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {getCreditPrice(plan)}€ par crédit
                  </div>
                )}
              </div>

              {plan.credits && plan.credits > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 p-2 rounded">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{plan.credits} crédits inclus</span>
                </div>
              )}

              {plan.maxUsers && (
                <div className="flex items-center justify-center gap-2 text-sm bg-green-50 p-2 rounded">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {plan.maxUsers === 999999 ? 'Utilisateurs illimités' : `${plan.maxUsers} utilisateur${plan.maxUsers > 1 ? 's' : ''}`}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <div className="text-sm text-gray-500">
                    +{plan.features.length - 4} autres fonctionnalités
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Validité : {getValidityText(plan.interval)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{plan.subscribers} abonnés</span>
                </div>
                <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                  {plan.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le plan</DialogTitle>
            <DialogDescription>
              Modifiez les détails de votre plan d'abonnement
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du plan</Label>
                  <Input 
                    value={selectedPlan.name} 
                    onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Prix (€)</Label>
                  <Input 
                    type="number"
                    value={selectedPlan.price} 
                    onChange={(e) => setSelectedPlan({...selectedPlan, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre de crédits</Label>
                  <Input 
                    type="number"
                    value={selectedPlan.credits || 0} 
                    onChange={(e) => setSelectedPlan({...selectedPlan, credits: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Prix unitaire du crédit (€)</Label>
                  <Input 
                    type="number"
                    step="0.001"
                    value={selectedPlan.creditPrice || 0} 
                    onChange={(e) => setSelectedPlan({...selectedPlan, creditPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label>Type d'audience</Label>
                <Select 
                  value={selectedPlan.targetAudience} 
                  onValueChange={(value) => setSelectedPlan({...selectedPlan, targetAudience: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Particulier</SelectItem>
                    <SelectItem value="organisme">Organisme de Formation</SelectItem>
                    <SelectItem value="team">Équipe</SelectItem>
                    <SelectItem value="enterprise">Entreprise</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  value={selectedPlan.description || ''} 
                  onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="popular"
                  checked={selectedPlan.isPopular || false}
                  onCheckedChange={(checked) => setSelectedPlan({...selectedPlan, isPopular: checked})}
                />
                <Label htmlFor="popular">Plan populaire</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => handleSavePlan(selectedPlan)}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
