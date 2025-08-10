
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, Calendar, Percent, Users, BarChart3, Copy, Download, Filter, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPromotions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for promotions
  const promotions = [
    {
      id: '1',
      code: 'WELCOME2024',
      name: 'Offre de bienvenue',
      type: 'percentage',
      value: 20,
      description: 'Réduction de 20% pour les nouveaux utilisateurs',
      status: 'actif',
      usageLimit: 1000,
      usageCount: 245,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: 'nouveaux_utilisateurs',
      minimumAmount: 50,
      applicableProducts: ['formations', 'abonnements'],
      createdBy: 'Admin',
      createdAt: '2024-01-01',
      revenue: 12500
    },
    {
      id: '2',
      code: 'SUMMER50',
      name: 'Promotion été',
      type: 'fixed',
      value: 50,
      description: 'Réduction fixe de 50€ sur les formations premium',
      status: 'actif',
      usageLimit: 500,
      usageCount: 156,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      targetAudience: 'tous',
      minimumAmount: 200,
      applicableProducts: ['formations'],
      createdBy: 'Marketing',
      createdAt: '2024-05-15',
      revenue: 7800
    },
    {
      id: '3',
      code: 'BLACKFRIDAY',
      name: 'Black Friday',
      type: 'percentage',
      value: 40,
      description: 'Méga promotion Black Friday',
      status: 'expiré',
      usageLimit: 2000,
      usageCount: 1856,
      startDate: '2023-11-24',
      endDate: '2023-11-27',
      targetAudience: 'tous',
      minimumAmount: 100,
      applicableProducts: ['formations', 'abonnements', 'certifications'],
      createdBy: 'Admin',
      createdAt: '2023-11-01',
      revenue: 45600
    },
    {
      id: '4',
      code: 'STUDENT30',
      name: 'Tarif étudiant',
      type: 'percentage',
      value: 30,
      description: 'Réduction étudiante',
      status: 'suspendu',
      usageLimit: null,
      usageCount: 89,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: 'etudiants',
      minimumAmount: 25,
      applicableProducts: ['formations'],
      createdBy: 'Admin',
      createdAt: '2024-01-01',
      revenue: 2670
    }
  ];

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'percentage',
    value: '',
    description: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    targetAudience: 'tous',
    minimumAmount: '',
    applicableProducts: [],
    status: 'actif'
  });

  const handleCreatePromotion = () => {
    toast({
      title: "Code promo créé",
      description: `Le code promo ${formData.code} a été créé avec succès.`,
    });
    setFormData({
      code: '',
      name: '',
      type: 'percentage',
      value: '',
      description: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      targetAudience: 'tous',
      minimumAmount: '',
      applicableProducts: [],
      status: 'actif'
    });
  };

  const handleDeletePromotion = (promotionId) => {
    toast({
      title: "Code promo supprimé",
      description: "Le code promo a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const handleDuplicatePromotion = (promotion) => {
    toast({
      title: "Code promo dupliqué",
      description: `Une copie de ${promotion.code} a été créée.`,
    });
  };

  const handleToggleStatus = (promotionId, newStatus) => {
    toast({
      title: "Statut modifié",
      description: `Le code promo a été ${newStatus}.`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'suspendu':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendu</Badge>;
      case 'expiré':
        return <Badge className="bg-red-100 text-red-800">Expiré</Badge>;
      case 'brouillon':
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type, value) => {
    if (type === 'percentage') {
      return <Badge variant="outline">{value}%</Badge>;
    } else {
      return <Badge variant="outline">{value}€</Badge>;
    }
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = promotions.reduce((sum, promo) => sum + promo.revenue, 0);
  const totalUsage = promotions.reduce((sum, promo) => sum + promo.usageCount, 0);
  const activePromotions = promotions.filter(p => p.status === 'actif').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des promotions</h1>
          <p className="text-gray-600">Créer et gérer les codes promo et offres spéciales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau code promo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau code promo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Code promo *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="Ex: WELCOME2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nom de la promotion *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Offre de bienvenue"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description de la promotion"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de réduction *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Pourcentage</SelectItem>
                        <SelectItem value="fixed">Montant fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">Valeur *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      placeholder={formData.type === 'percentage' ? 'Ex: 20' : 'Ex: 50'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="usageLimit">Limite d'utilisation</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      placeholder="Laisser vide pour illimité"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumAmount">Montant minimum</Label>
                    <Input
                      id="minimumAmount"
                      type="number"
                      value={formData.minimumAmount}
                      onChange={(e) => setFormData({...formData, minimumAmount: e.target.value})}
                      placeholder="Ex: 50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Public cible</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les utilisateurs</SelectItem>
                      <SelectItem value="nouveaux_utilisateurs">Nouveaux utilisateurs</SelectItem>
                      <SelectItem value="etudiants">Étudiants</SelectItem>
                      <SelectItem value="entreprises">Entreprises</SelectItem>
                      <SelectItem value="vip">Clients VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'actif'}
                    onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'actif' : 'brouillon'})}
                  />
                  <Label htmlFor="status">Activer immédiatement</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Annuler</Button>
                  <Button onClick={handleCreatePromotion}>Créer le code promo</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Codes promo actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePromotions}</div>
            <p className="text-xs text-muted-foreground">Sur {promotions.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisations totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Depuis le début</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">+2.3% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promotions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="promotions">Codes promo</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Liste des codes promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par code, nom ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="expiré">Expiré</SelectItem>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisation</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Revenus</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{promotion.code}</div>
                        <div className="text-sm text-gray-600">{promotion.description}</div>
                      </TableCell>
                      <TableCell>{promotion.name}</TableCell>
                      <TableCell>
                        {getTypeBadge(promotion.type, promotion.value)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {promotion.usageCount}
                          {promotion.usageLimit && `/${promotion.usageLimit}`}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ 
                              width: promotion.usageLimit 
                                ? `${Math.min((promotion.usageCount / promotion.usageLimit) * 100, 100)}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">→ {new Date(promotion.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">€{promotion.revenue.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(promotion.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" title="Voir les détails">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="Modifier">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Dupliquer"
                            onClick={() => handleDuplicatePromotion(promotion)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Supprimer"
                            onClick={() => handleDeletePromotion(promotion.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance des codes promo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions.slice(0, 5).map((promo) => (
                    <div key={promo.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{promo.code}</div>
                        <div className="text-sm text-gray-500">{promo.usageCount} utilisations</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">€{promo.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {((promo.usageCount / totalUsage) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Tendances mensuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Janvier 2024</span>
                    <span className="font-medium">€15,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Février 2024</span>
                    <span className="font-medium">€18,560</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mars 2024</span>
                    <span className="font-medium">€22,180</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avril 2024</span>
                    <span className="font-medium">€19,740</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de codes promo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Bienvenue nouveaux clients</h3>
                    <p className="text-sm text-gray-600 mb-3">Réduction de 20% pour les nouveaux utilisateurs</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Pourcentage</span>
                      <span>Usage: Unique</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Offre saisonnière</h3>
                    <p className="text-sm text-gray-600 mb-3">Réduction limitée dans le temps</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Fixe ou %</span>
                      <span>Durée limitée</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Fidélité client</h3>
                    <p className="text-sm text-gray-600 mb-3">Récompense pour clients réguliers</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Pourcentage</span>
                      <span>Usage: Illimité</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPromotions;
