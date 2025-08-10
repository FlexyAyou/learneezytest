import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Coins, Plus, Settings, Send, DollarSign, Users, TrendingUp, History, Euro, Search, Filter, ShoppingBag, Package, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const AdminTokens = () => {
  const [tokenValue, setTokenValue] = useState(0.50);
  const [selectedUser, setSelectedUser] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // États pour la gestion de la boutique
  const [newPackage, setNewPackage] = useState({
    name: '',
    tokens: '',
    price: '',
    discount: '',
    description: '',
    targetAudience: 'individual',
    isActive: true,
    isPopular: false,
    features: ['']
  });

  // Données simulées
  const tokenStats = {
    totalDistributed: 125000,
    totalValue: 62500,
    activeUsers: 847,
    monthlyGrowth: 15.3
  };

  const recentTransactions = [
    {
      id: 1,
      user: 'Formation Plus',
      type: 'distribution',
      amount: 500,
      reason: 'Paiement espèces formation',
      date: '2024-08-10 14:30',
      status: 'completed'
    },
    {
      id: 2,
      user: 'TechFormation Pro',
      type: 'purchase',
      amount: 200,
      reason: 'Formation IA',
      date: '2024-08-10 12:15',
      status: 'completed'
    },
    {
      id: 3,
      user: 'Alice Martin',
      type: 'gift',
      amount: 50,
      reason: 'Bonus satisfaction client',
      date: '2024-08-10 09:45',
      status: 'completed'
    }
  ];

  const users = [
    { id: '1', name: 'Formation Plus', type: 'organisme', tokens: 1500 },
    { id: '2', name: 'TechFormation Pro', type: 'organisme', tokens: 800 },
    { id: '3', name: 'Alice Martin', type: 'student', tokens: 120 },
    { id: '4', name: 'Jean Dupont', type: 'trainer', tokens: 300 }
  ];

  // Packages de la boutique
  const shopPackages = [
    {
      id: 1,
      name: 'Pack Starter',
      tokens: 50,
      price: 25,
      originalPrice: 30,
      discount: 17,
      targetAudience: 'individual',
      isActive: true,
      isPopular: false,
      sales: 150,
      revenue: 3750,
      features: ['50 tokens', 'Accès formations de base', 'Support email']
    },
    {
      id: 2,
      name: 'Pack Premium',
      tokens: 120,
      price: 55,
      originalPrice: 65,
      discount: 15,
      targetAudience: 'individual',
      isActive: true,
      isPopular: true,
      sales: 300,
      revenue: 16500,
      features: ['120 tokens', 'Accès toutes formations', 'Support prioritaire', 'Bonus 20 tokens']
    },
    {
      id: 3,
      name: 'Pack Tuteur Premium',
      tokens: 500,
      price: 200,
      originalPrice: 250,
      discount: 20,
      targetAudience: 'tutor',
      isActive: true,
      isPopular: true,
      sales: 80,
      revenue: 16000,
      features: ['500 tokens', 'Gestion illimitée élèves', 'Outils avancés', 'Support prioritaire']
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Carte bancaire', isActive: true, fees: 2.9 },
    { id: 'paypal', name: 'PayPal', isActive: true, fees: 3.4 },
    { id: 'mobile', name: 'Paiement mobile', isActive: false, fees: 2.5 },
    { id: 'crypto', name: 'Cryptomonnaie', isActive: false, fees: 1.5 }
  ];

  const coupons = [
    { id: 1, code: 'STUDENT20', discount: 20, type: 'percentage', isActive: true, uses: 45, maxUses: 100 },
    { id: 2, code: 'TUTOR25', discount: 25, type: 'percentage', isActive: true, uses: 12, maxUses: 50 },
    { id: 3, code: 'WELCOME10', discount: 10, type: 'fixed', isActive: true, uses: 234, maxUses: 500 }
  ];

  const handleDistributeTokens = () => {
    if (!selectedUser || !tokenAmount || !reason) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Logique de distribution des tokens
    toast.success(`${tokenAmount} tokens distribués avec succès`);
    setSelectedUser('');
    setTokenAmount('');
    setReason('');
    setPaymentMethod('');
  };

  const handleUpdateTokenValue = () => {
    // Logique de mise à jour de la valeur des tokens
    toast.success(`Valeur du token mise à jour : ${tokenValue}€`);
  };

  const handleCreatePackage = () => {
    if (!newPackage.name || !newPackage.tokens || !newPackage.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    toast.success('Package créé avec succès');
    setNewPackage({
      name: '',
      tokens: '',
      price: '',
      discount: '',
      description: '',
      targetAudience: 'individual',
      isActive: true,
      isPopular: false,
      features: ['']
    });
  };

  const addFeature = () => {
    setNewPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setNewPackage(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setNewPackage(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des tokens & Boutique</h1>
          <p className="text-gray-600">Administration complète des tokens et de la boutique en ligne</p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens distribués</p>
                <p className="text-2xl font-bold">{tokenStats.totalDistributed.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold">{tokenStats.totalValue.toLocaleString()}€</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{tokenStats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Croissance mensuelle</p>
                <p className="text-2xl font-bold">+{tokenStats.monthlyGrowth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribute" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="distribute">Distribution</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="shop-packages">Packages Boutique</TabsTrigger>
          <TabsTrigger value="payment-methods">Modes de paiement</TabsTrigger>
          <TabsTrigger value="coupons">Codes promos</TabsTrigger>
          <TabsTrigger value="transactions">Historique</TabsTrigger>
          <TabsTrigger value="users">Soldes utilisateurs</TabsTrigger>
        </TabsList>

        {/* Distribution de tokens */}
        <TabsContent value="distribute">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Distribuer des tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Utilisateur / Organisation *</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.type}) - {user.tokens} tokens
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Nombre de tokens *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 100"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motif *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Paiement en espèces pour formation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Mode de paiement (optionnel)</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                      <SelectItem value="transfer">Virement</SelectItem>
                      <SelectItem value="gift">Cadeau/Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tokenAmount && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Récapitulatif :</strong> {tokenAmount} tokens = {(parseFloat(tokenAmount) * tokenValue).toFixed(2)}€
                  </p>
                </div>
              )}

              <Button onClick={handleDistributeTokens} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Distribuer les tokens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarification */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration de la tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenValue">Valeur d'un token (€)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tokenValue"
                      type="number"
                      step="0.01"
                      value={tokenValue}
                      onChange={(e) => setTokenValue(parseFloat(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600">€ par token</span>
                  </div>
                </div>

                <Button onClick={handleUpdateTokenValue}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mettre à jour la tarification
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Coûts des activités</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Achat de cours premium</span>
                    <Badge variant="outline">10-50 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Génération de certificat</span>
                    <Badge variant="outline">5 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Création de convention</span>
                    <Badge variant="outline">3 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Support premium</span>
                    <Badge variant="outline">2 tokens</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des packages de la boutique */}
        <TabsContent value="shop-packages">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Créer un nouveau package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">Nom du package *</Label>
                    <Input
                      id="packageName"
                      placeholder="Ex: Pack Premium"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageTokens">Nombre de tokens *</Label>
                    <Input
                      id="packageTokens"
                      type="number"
                      placeholder="Ex: 100"
                      value={newPackage.tokens}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, tokens: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packagePrice">Prix (€) *</Label>
                    <Input
                      id="packagePrice"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 50.00"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageDiscount">Réduction (%)</Label>
                    <Input
                      id="packageDiscount"
                      type="number"
                      placeholder="Ex: 15"
                      value={newPackage.discount}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, discount: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageAudience">Public cible</Label>
                    <Select value={newPackage.targetAudience} onValueChange={(value) => setNewPackage(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Particuliers</SelectItem>
                        <SelectItem value="tutor">Tuteurs</SelectItem>
                        <SelectItem value="organisme">Organismes</SelectItem>
                        <SelectItem value="enterprise">Entreprises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageDescription">Description</Label>
                    <Input
                      id="packageDescription"
                      placeholder="Ex: Le plus populaire"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fonctionnalités</Label>
                  {newPackage.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Ex: Accès à toutes les formations"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                      />
                      {newPackage.features.length > 1 && (
                        <Button onClick={() => removeFeature(index)} variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button onClick={addFeature} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une fonctionnalité
                  </Button>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newPackage.isActive}
                      onCheckedChange={(checked) => setNewPackage(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Package actif</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={newPackage.isPopular}
                      onCheckedChange={(checked) => setNewPackage(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label htmlFor="isPopular">Package populaire</Label>
                  </div>
                </div>

                <Button onClick={handleCreatePackage} className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Créer le package
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Packages existants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Public</TableHead>
                      <TableHead>Ventes</TableHead>
                      <TableHead>Revenus</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shopPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pkg.name}</p>
                            {pkg.isPopular && <Badge variant="secondary">Populaire</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{pkg.tokens} tokens</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-bold">{pkg.price}€</span>
                            {pkg.discount > 0 && (
                              <div className="text-xs text-gray-500">
                                <span className="line-through">{pkg.originalPrice}€</span>
                                <span className="text-red-600 ml-1">(-{pkg.discount}%)</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {pkg.targetAudience === 'individual' ? 'Particuliers' :
                             pkg.targetAudience === 'tutor' ? 'Tuteurs' : 'Organismes'}
                          </Badge>
                        </TableCell>
                        <TableCell>{pkg.sales}</TableCell>
                        <TableCell>{pkg.revenue.toLocaleString()}€</TableCell>
                        <TableCell>
                          <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                            {pkg.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestion des modes de paiement */}
        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration des modes de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mode de paiement</TableHead>
                    <TableHead>Frais (%)</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell>{method.fees}%</TableCell>
                      <TableCell>
                        <Badge variant={method.isActive ? 'default' : 'secondary'}>
                          {method.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Switch checked={method.isActive} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des codes promos */}
        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Codes promotionnels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discount}{coupon.type === 'percentage' ? '%' : '€'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {coupon.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                        </Badge>
                      </TableCell>
                      <TableCell>{coupon.uses} / {coupon.maxUses}</TableCell>
                      <TableCell>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        {/* Historique des transactions */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input placeholder="Rechercher une transaction..." />
                </div>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.user}</TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === 'distribution' ? 'default' :
                          transaction.type === 'purchase' ? 'destructive' : 'secondary'
                        }>
                          {transaction.type === 'distribution' ? 'Distribution' :
                           transaction.type === 'purchase' ? 'Achat' : 'Cadeau'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.amount} tokens</TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Complété
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Soldes utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Soldes des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Solde tokens</TableHead>
                    <TableHead>Valeur (€)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.type === 'organisme' ? 'Organisation' :
                           user.type === 'student' ? 'Étudiant' : 'Formateur'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.tokens} tokens</TableCell>
                      <TableCell>{(user.tokens * tokenValue).toFixed(2)}€</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTokens;
